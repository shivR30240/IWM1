import { NextRequest } from "next/server";
import { getStore } from "@/lib/mock-data/store";
import { successResponse, errorResponse } from "@/lib/api-helpers/response";

export async function GET(_: NextRequest, { params }: { params: Promise<{ ticketId: string }> }) {
  const { ticketId } = await params;
  const store = getStore();
  const ticket = store.tickets.get(ticketId);

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
    statusHistory: ticket.statusHistory.map(h => ({
      toStatus: h.toStatus,
      changedAt: h.changedAt,
      note: h.note,
    })),
  });
}
