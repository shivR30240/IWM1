import { connectToDatabase } from '../db';
import { Ticket as TicketModel } from '@/models/Ticket';
import { sendTicketConfirmationSMS } from './twilio-client';
import { sendWhatsAppNotification } from '../whatsapp/notifications';
import { ProcessedComplaint } from './nlu-processor';
import type { Ticket } from "@/types";

/**
 * Call Workflow Orchestrator
 * Manages the complete flow from call to ticket creation
 */

interface CallTicketData {
  callerPhone: string;
  transcript: string;
  processedData: ProcessedComplaint;
  callSid: string;
  recordingUrl: string;
  recordingSid: string;
}

interface TicketCreationResult {
  success: boolean;
  ticketId?: string;
  error?: string;
}

/**
 * Create ticket from call data
 */
export async function createTicketFromCall(data: CallTicketData): Promise<TicketCreationResult> {
  try {
    console.log('🎫 Creating ticket from call and storing in MongoDB...');

    const { callerPhone, transcript, processedData, callSid, recordingUrl, recordingSid } = data;

    // Generate ticket ID
    const ticketId = generateTicketId();

    // Extract citizen name from phone
    const citizenName = extractCitizenName(callerPhone);

    // Map processed data to ticket format
    const newTicket = {
      id: ticketId,
      title: processedData.summary.substring(0, 100),
      titleHi: processedData.summaryHi,
      description: transcript,
      descriptionHi: processedData.summaryHi,
      category: processedData.category,
      status: 'open' as const,
      priority: processedData.priority,
      source: 'voice_call' as const,
      citizenName,
      citizenPhone: callerPhone,
      wardNumber: processedData.location.wardNumber || 0,
      wardName: processedData.location.wardName || 'Unknown',
      address: processedData.location.fullAddress,
      latitude: 22.7196, // Default Indore coordinates
      longitude: 75.8577,
      departmentId: getDepartmentIdForCategory(processedData.category),
      assignedOfficerId: null,
      assignedFieldStaffId: null,
      slaTargetHours: 48,
      slaBreached: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      resolvedAt: null,
      closedAt: null,
      escalatedAt: null,
      statusHistory: [{
        fromStatus: null,
        toStatus: 'open',
        changedBy: 'system',
        changedAt: new Date().toISOString(),
        note: 'Ticket created via voice call',
      }],
      attachments: recordingUrl ? [recordingUrl] : [],
      feedback: null,
      callMetadata: {
        callSid,
        recordingSid,
        recordingUrl,
        transcript,
        processedAt: new Date().toISOString(),
      },
    };

    // Connect to database and save
    await connectToDatabase();
    await TicketModel.create(newTicket);
    console.log('✅ Ticket stored in MongoDB:', ticketId);

    // Send confirmation SMS
    console.log('📱 Sending confirmation SMS...');
    const smsResult = await sendTicketConfirmationSMS(
      callerPhone,
      ticketId,
      citizenName
    );

    if (!smsResult.success) {
      console.warn('⚠️  Failed to send SMS:', smsResult.error);
    } else {
      console.log('✅ SMS sent successfully');
    }

    // Send WhatsApp notification
    console.log('💬 Sending WhatsApp notification...');
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const whatsappResult = await sendWhatsAppNotification(
      callerPhone,
      'ticket_creation',
      {
        name: citizenName,
        ticket_id: ticketId,
        category: processedData.category,
        tracking_url: `${baseUrl}/check-status`
      }
    );

    if (!whatsappResult.success) {
      console.warn('⚠️  Failed to send WhatsApp:', whatsappResult.error);
    } else {
      console.log('✅ WhatsApp sent successfully');
    }

    // Log call data
    logCallData({
      callSid,
      recordingSid,
      recordingUrl,
      ticketId,
      status: 'success',
      timestamp: new Date().toISOString(),
    });

    return {
      success: true,
      ticketId,
    };
  } catch (error) {
    console.error('❌ Error creating ticket from call:', error);
    
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Generate unique ticket ID
 * Format: IVC-YYYY-XXXXX
 */
function generateTicketId(): string {
  const year = new Date().getFullYear();
  const random = Math.floor(Math.random() * 99999).toString().padStart(5, '0');
  return `IVC-${year}-${random}`;
}

/**
 * Extract citizen name from phone number
 */
function extractCitizenName(phone: string): string {
  return `Citizen ${phone.slice(-4)}`;
}

/**
 * Get department ID for a given category
 */
function getDepartmentIdForCategory(category: string): string {
  const departmentMap: Record<string, string> = {
    water_supply: 'dept_water',
    drainage: 'dept_sanitation',
    roads: 'dept_infrastructure',
    electricity: 'dept_electricity',
    sanitation: 'dept_sanitation',
    garbage_collection: 'dept_sanitation',
    street_lights: 'dept_electricity',
    parks: 'dept_parks',
    building_permits: 'dept_building',
    other: 'dept_general',
  };

  return departmentMap[category] || 'dept_general';
}

/**
 * Log call data for analytics
 */
function logCallData(data: {
  callSid: string;
  recordingSid: string;
  recordingUrl: string;
  ticketId?: string;
  status: string;
  timestamp: string;
}): void {
  console.log('📊 Call log registered:', data);
}

/**
 * Get ticket by ID (for API endpoint)
 */
export async function getTicketById(ticketId: string): Promise<Ticket | null> {
  await connectToDatabase();
  const doc = await TicketModel.findOne({ id: ticketId }).lean();
  return doc as unknown as Ticket | null;
}

/**
 * Get all tickets created via calls
 */
export async function getAllCallTickets(): Promise<Ticket[]> {
  await connectToDatabase();
  const docs = await TicketModel.find({ source: 'voice_call' }).lean();
  return docs as unknown as Ticket[];
}
