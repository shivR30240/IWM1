import { NextRequest } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { Ticket } from "@/models/Ticket";
import { successResponse, errorResponse } from "@/lib/api-helpers/response";

export async function GET(_: NextRequest, { params }: { params: Promise<{ ticketId: string }> }) {
  const { ticketId } = await params;
  await connectToDatabase();
  const ticket = await Ticket.findOne({ id: ticketId }).lean();

  if (!ticket) {
    return errorResponse("NOT_FOUND", "No ticket found with this ID", 404);
  }

  // Public endpoint: return stripped-down view (no PII)
  return successResponse({
    id: ticket.id,
    category: ticket.category,
    status: ticket.status,
    priority: ticket.priority,
    wardName: ticket.wardName,
    departmentId: ticket.departmentId,
    createdAt: ticket.createdAt,
    updatedAt: ticket.updatedAt,
    resolvedAt: ticket.resolvedAt,
    statusHistory: (ticket.statusHistory || []).map((h: { toStatus: string; changedAt: string; note: string }) => ({
      toStatus: h.toStatus,
      changedAt: h.changedAt,
      note: h.note,
    })),
  });
}
