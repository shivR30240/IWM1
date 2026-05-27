import { connectToDatabase } from "@/lib/db";
import { Ticket as TicketModel } from "@/models/Ticket";
import { User as UserModel } from "@/models/User";
import { Department as DepartmentModel } from "@/models/Department";
import type { Ticket, User, Department } from "@/types";

export async function getTicketsArray(): Promise<Ticket[]> {
  await connectToDatabase();
  const tickets = await TicketModel.find({}).lean();
  return tickets as unknown as Ticket[];
}

export async function getUsersArray(): Promise<User[]> {
  await connectToDatabase();
  const users = await UserModel.find({}).lean();
  return users as unknown as User[];
}

export async function getDepartmentsArray(): Promise<Department[]> {
  await connectToDatabase();
  const departments = await DepartmentModel.find({}).lean();
  return departments as unknown as Department[];
}

// Retained for absolute backward compatibility in case of legacy references
export function getStore() {
  console.warn("⚠️ Legacy synchronous getStore() called. Returning empty maps. Use asynchronous database queries instead.");
  return {
    tickets: new Map<string, Ticket>(),
    users: new Map<string, User>(),
    departments: new Map<string, Department>(),
    feedback: new Map<string, unknown>(),
  };
}
