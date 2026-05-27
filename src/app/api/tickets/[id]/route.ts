import { NextRequest } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { Ticket } from "@/models/Ticket";
import { successResponse, errorResponse } from "@/lib/api-helpers/response";

export async function GET(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await connectToDatabase();
  const ticket = await Ticket.findOne({ id }).lean();
  if (!ticket) return errorResponse("NOT_FOUND", "Ticket not found", 404);
  return successResponse(ticket);
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await connectToDatabase();
  const ticketDoc = await Ticket.findOne({ id });
  if (!ticketDoc) return errorResponse("NOT_FOUND", "Ticket not found", 404);

  const body = await request.json();

  if (body.status && body.status !== ticketDoc.status) {
    ticketDoc.statusHistory.push({
      fromStatus: ticketDoc.status,
      toStatus: body.status,
      changedBy: body.changedBy || "system",
      changedAt: new Date().toISOString(),
      note: body.note || `Status changed to ${body.status}`,
    });
    ticketDoc.status = body.status;
    if (body.status === "resolved") ticketDoc.resolvedAt = new Date().toISOString();
    if (body.status === "closed") ticketDoc.closedAt = new Date().toISOString();
    if (body.status === "escalated") ticketDoc.escalatedAt = new Date().toISOString();
  }

  if (body.assignedOfficerId !== undefined) ticketDoc.assignedOfficerId = body.assignedOfficerId;
  if (body.assignedFieldStaffId !== undefined) ticketDoc.assignedFieldStaffId = body.assignedFieldStaffId;
  if (body.priority) ticketDoc.priority = body.priority;
  ticketDoc.updatedAt = new Date().toISOString();

  await ticketDoc.save();
  return successResponse(ticketDoc.toObject());
}
