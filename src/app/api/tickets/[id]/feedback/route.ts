import { NextRequest } from "next/server";
import { getStore } from "@/lib/mock-data/store";
import { successResponse, errorResponse } from "@/lib/api-helpers/response";

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const store = getStore();
  const ticket = store.tickets.get(id);

  if (!ticket) return errorResponse("NOT_FOUND", "Ticket not found", 404);
  if (ticket.status !== "resolved" && ticket.status !== "closed") {
    return errorResponse("INVALID_STATE", "Feedback can only be submitted for resolved tickets", 400);
  }
  if (ticket.feedback) {
    return errorResponse("ALREADY_EXISTS", "Feedback already submitted for this ticket", 409);
  }

  const body = await request.json();
  const feedback = {
    ticketId: id,
    rating: Math.min(5, Math.max(1, body.rating || 3)) as 1 | 2 | 3 | 4 | 5,
    comment: body.comment || "",
    commentHi: body.commentHi || "",
    submittedAt: new Date().toISOString(),
  };

  ticket.feedback = feedback;
  store.feedback.set(id, feedback);
  store.tickets.set(id, ticket);

  return successResponse(feedback, 201);
}
