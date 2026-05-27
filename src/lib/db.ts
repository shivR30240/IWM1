import mongoose from "mongoose";
import { generateDepartments } from "./mock-data/generators/departments.generator";
import { generateUsers } from "./mock-data/generators/users.generator";
import { generateTickets } from "./mock-data/generators/tickets.generator";
import { generateFeedback } from "./mock-data/generators/feedback.generator";
import { resetCounter } from "@/lib/utils/id-generator";
import { resetSeed } from "@/lib/utils/seeded-random";

const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  throw new Error("Please define the MONGO_URI environment variable inside .env.local");
}

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  var mongoose: MongooseCache | undefined;
}

const cached: MongooseCache = global.mongoose || { conn: null, promise: null };

if (!global.mongoose) {
  global.mongoose = cached;
}

export async function connectToDatabase() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    console.log("🔌 Connecting to MongoDB database...");
    cached.promise = mongoose.connect(MONGO_URI!, opts).then((mongooseInstance) => {
      console.log("🔌 MongoDB Connected successfully!");
      return mongooseInstance;
    });
  }

  try {
    cached.conn = await cached.promise;
    
    // Check if seeding is needed
    await seedDatabaseIfNeeded();
  } catch (e) {
    cached.promise = null;
    console.error("❌ Failed to connect to MongoDB:", e);
    throw e;
  }

  return cached.conn;
}

async function seedDatabaseIfNeeded() {
  // Dynamically import models to prevent circular dependency issues or early model registration errors
  const { Department } = await import("@/models/Department");
  const { User } = await import("@/models/User");
  const { Ticket } = await import("@/models/Ticket");

  try {
    const deptCount = await Department.countDocuments();
    if (deptCount > 0) {
      console.log("📊 Database already seeded with records.");
      return;
    }

    console.log("🌱 MongoDB is empty. Seeding realistic Indore civic data...");

    resetSeed(42);
    resetCounter();

    const depts = generateDepartments();
    const users = generateUsers();

    const officers: Record<string, string[]> = {};
    const fieldStaff: Record<string, string[]> = {};
    for (const u of users) {
      if (u.departmentId) {
        if (u.role === "officer" || u.role === "department_head") {
          if (!officers[u.departmentId]) officers[u.departmentId] = [];
          officers[u.departmentId].push(u.id);
        }
        if (u.role === "field_staff") {
          if (!fieldStaff[u.departmentId]) fieldStaff[u.departmentId] = [];
          fieldStaff[u.departmentId].push(u.id);
        }
      }
    }

    const ticketsList = generateTickets({ officers, fieldStaff });
    const feedbacks = generateFeedback(ticketsList);

    for (const [ticketId, fb] of feedbacks) {
      const t = ticketsList.find(x => x.id === ticketId);
      if (t) t.feedback = fb;
    }

    // Insert seeded records
    await Department.insertMany(depts);
    console.log(`✅ Seeded ${depts.length} departments.`);

    await User.insertMany(users);
    console.log(`✅ Seeded ${users.length} users.`);

    await Ticket.insertMany(ticketsList);
    console.log(`✅ Seeded ${ticketsList.length} tickets.`);

    console.log("🌱 Database seeding complete!");
  } catch (error) {
    console.error("❌ Error while seeding database:", error);
  }
}
