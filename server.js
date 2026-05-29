const express = require("express");
const mongoose = require("mongoose");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const cors = require("cors");
require("dotenv").config({ path: ".env.local" });

const app = express();
app.use(cors()); // This allows your frontends (including Vercel) to communicate with this backend
app.use(express.json());

// --- 1. DATABASE CONNECT ---
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("✅ Connected to Indore City Database"))
    .catch(err => console.error("❌ MongoDB connection error:", err));

// --- 2. DEFINE SCHEMAS & MODELS ---
const ComplaintSchema = new mongoose.Schema({
    complaint_id: { type: String, required: true, unique: true, index: true },
    department: { type: String, required: true, index: true },
    text: { type: String, required: true },
    status: { type: String, enum: ["PENDING", "IN_PROGRESS", "RESOLVED"], default: "PENDING", index: true },
    priority: { type: String, enum: ["HIGH", "LOW"], default: "LOW" },
    retry_count: { type: Number, default: 0 },
    is_retry: { type: Boolean, default: false },
    created_at: { type: Date, default: Date.now, index: true },
    updated_at: { type: Date, default: Date.now },
    processed_at: { type: Date },
    ingestion_timestamp: Number,
    queue_entered_at: Number,
    processing_started_at: Number,
    processing_completed_at: Number,
    source: { type: String, default: "MAIN" }
}, { timestamps: true });

const Complaint = mongoose.models.Complaint || mongoose.model("Complaint", ComplaintSchema);

const ComplaintDLQSchema = new mongoose.Schema({
    complaint_id: { type: String, required: true, index: true },
    department: String,
    text: String,
    status: { type: String, enum: ["FAILED", "MANUAL_REVIEW"], default: "FAILED", index: true },
    priority: { type: String, enum: ["HIGH", "LOW"] },
    failure_reason: { type: String, required: true },
    failure_type: { type: String, enum: ["TEMPORARY", "PERMANENT", "UNKNOWN"], default: "UNKNOWN" },
    retry_count: Number,
    max_retries: Number,
    created_at: Date,
    failed_at: { type: Date, default: Date.now },
    last_attempt_at: Date,
    pipeline_latency: Number,
    end_to_end_latency: Number,
    queue_delay: Number,
    source: { type: String, default: "DLQ" },
    original_payload: { type: Object, required: true }
}, { timestamps: true });

const ComplaintDLQ = mongoose.models.ComplaintDLQ || mongoose.model("ComplaintDLQ", ComplaintDLQSchema);

// --- 3. INITIALIZE GEMINI (Structured Output Mode) ---
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({
    model: "gemini-2.0-flash",
    // Leverage Gemini structured output configuration to guarantee valid JSON formatting matching schema
    generationConfig: {
        responseMimeType: "application/json",
        responseSchema: {
            type: "OBJECT",
            properties: {
                department: {
                    type: "STRING",
                    enum: ["WATER", "WASTE", "ELECTRICITY", "ROADS", "GENERAL"],
                    description: "Select the most appropriate civic department based on the grievance transcript"
                },
                priority: {
                    type: "STRING",
                    enum: ["HIGH", "LOW"],
                    description: "Select the urgency of the ticket (HIGH for active safety hazards or severe utility cuts, LOW otherwise)"
                }
            },
            required: ["department", "priority"]
        }
    }
});

// --- 4. THE WEBHOOK POST ROUTE ---
app.post('/incoming-call-data', async (req, res) => {
    const startProcessingTime = Date.now();
    console.log("📦 NEW WEBHOOK SIGNAL DETECTED FROM OMNIDIMENSION...");

    // Safe extraction variables
    const originalPayload = req.body || {};
    const complaintId = originalPayload.call_id?.toString() || originalPayload.call_sid || `UNKNOWN_${Date.now()}`;
    const conversation = originalPayload.call_report?.full_conversation;
    
    // Log conversion metadata
    const callDateStr = originalPayload.call_date; // e.g., "2026-04-29 21:35:50"
    const parsedCallDate = callDateStr ? new Date(callDateStr) : new Date();

    try {
        // --- DATA VALIDATION PATROL ---
        if (!conversation) {
            throw new Error("Missing structural payload parameter: call_report.full_conversation is undefined or empty.");
        }

        // --- GEMINI INTELLIGENT ROUTING & FILTERING ---
        let aiData = { department: "GENERAL", priority: "LOW" };
        
        try {
            const prompt = `Analyze this Indore grievance transcript and extract the department and priority: "${conversation}"`;

            const result = await model.generateContent(prompt);
            const textResponse = result.response.text();
            
            console.log(`🤖 Gemini response: ${textResponse}`);
            const parsedAi = JSON.parse(textResponse);
            
            // Normalize case constraints
            aiData.department = (parsedAi.department || "GENERAL").toUpperCase();
            aiData.priority = (parsedAi.priority || "LOW").toUpperCase();
            
        } catch (aiError) {
            // Treat AI engine failures or name resolution disconnects as TEMPORARY execution block flags
            console.error("⚠️ Gemini processing exception occurred. Re-routing payload tracking parameters...");
            throw new Error(`AI processing failure: ${aiError.message}`);
        }

        const completionTime = Date.now();

        // --- WRITE RECORD TO MAIN WORKING PIPELINE ---
        const activeComplaint = new Complaint({
            complaint_id: complaintId,
            department: aiData.department,
            text: conversation,
            status: "PENDING",
            priority: aiData.priority,
            created_at: parsedCallDate,
            ingestion_timestamp: startProcessingTime,
            processing_started_at: startProcessingTime,
            processing_completed_at: completionTime,
            source: "MAIN"
        });

        await activeComplaint.save();
        console.log(`✅ MAIN PIPELINE ACCESS SUCCESS: Stored Complaint ID ${complaintId}`);
        return res.status(200).json({ status: "success", message: "Logged to main storage" });

    } catch (catchError) {
        console.error(`🚨 EXCEPTION INCURRED. MOVING PACKET ${complaintId} TO DEAD LETTER QUEUE (DLQ)`);

        const failedTime = Date.now();
        
        // Determine if it was an operational validation check or an underlying connection/API failure
        const failureType = catchError.message.includes("Missing structural") ? "PERMANENT" : "TEMPORARY";

        try {
            // --- WRITE RECORD TO EMERGENCY FAULT RECOVERY LAYER (DLQ) ---
            const dlqTicket = new ComplaintDLQ({
                complaint_id: complaintId,
                department: "UNKNOWN",
                text: conversation || "No conversation extracted from payload string",
                status: "FAILED",
                failure_reason: catchError.message,
                failure_type: failureType,
                created_at: parsedCallDate,
                failed_at: new Date(),
                last_attempt_at: new Date(startProcessingTime),
                pipeline_latency: failedTime - startProcessingTime,
                original_payload: originalPayload,
                source: "DLQ"
            });

            await dlqTicket.save();
            console.log(`📥 DLQ STORAGE CONFIRMED: Logged tracking ticket for ID ${complaintId}`);
            
            // Return 200 OK to OmniDimension so it registers transaction execution context as resolved
            return res.status(200).json({ status: "buffered_to_dlq", error: catchError.message });

        } catch (dlqFatalError) {
            console.error("❌ CRITICAL DISASTER: Cloud cluster database validation fault dropping tracking data packets:", dlqFatalError.message);
            return res.status(500).send("Database Storage Failure");
        }
    }
});

// Root landing route to verify backend status
app.get('/', (req, res) => {
    res.status(200).json({
        status: "online",
        message: "Indore Grievance Call Automation API is fully operational!",
        endpoints: {
            webhook: "POST /incoming-call-data",
            complaints: "GET /api/complaints",
            dlq: "GET /api/complaints-dlq"
        }
    });
});

// --- 5. COMPLAINTS ENDPOINTS ---
app.get('/api/complaints', async (req, res) => {
    try {
        const activeComplaints = await Complaint.find().sort({ created_at: -1 });
        res.status(200).json(activeComplaints);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch complaints" });
    }
});

// Route for the frontend to see the dead-letter-queue items
app.get('/api/complaints-dlq', async (req, res) => {
    try {
        const dlqItems = await ComplaintDLQ.find().sort({ failed_at: -1 });
        res.status(200).json(dlqItems);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch DLQ items" });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
