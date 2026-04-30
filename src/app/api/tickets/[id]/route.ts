import { NextRequest } from "next/server";
import { getStore } from "@/lib/mock-data/store";
import { successResponse, errorResponse } from "@/lib/api-helpers/response";

export async function GET(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const store = getStore();
  const ticket = store.tickets.get(id);
  if (!ticket) return errorResponse("NOT_FOUND", "Ticket not found", 404);
  return successResponse(ticket);
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const store = getStore();
  const ticket = store.tickets.get(id);
  if (!ticket) return errorResponse("NOT_FOUND", "Ticket not found", 404);

  const body = await request.json();

  if (body.status && body.status !== ticket.status) {
    ticket.statusHistory.push({
      fromStatus: ticket.status,
      toStatus: body.status,
      changedBy: body.changedBy || "system",
      changedAt: new Date().toISOString(),
      note: body.note || `Status changed to ${body.status}`,
    });
    ticket.status = body.status;
    if (body.status === "resolved") ticket.resolvedAt = new Date().toISOString();
    if (body.status === "closed") ticket.closedAt = new Date().toISOString();
    if (body.status === "escalated") ticket.escalatedAt = new Date().toISOString();
  }

  if (body.assignedOfficerId !== undefined) ticket.assignedOfficerId = body.assignedOfficerId;
  if (body.assignedFieldStaffId !== undefined) ticket.assignedFieldStaffId = body.assignedFieldStaffId;
  if (body.priority) ticket.priority = body.priority;
  ticket.updatedAt = new Date().toISOString();

  store.tickets.set(id, ticket);
  return successResponse(ticket);
}
