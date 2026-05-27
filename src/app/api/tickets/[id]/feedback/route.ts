import { NextRequest } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { Ticket } from "@/models/Ticket";
import { successResponse, errorResponse } from "@/lib/api-helpers/response";

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await connectToDatabase();
  const ticketDoc = await Ticket.findOne({ id });

  if (!ticketDoc) return errorResponse("NOT_FOUND", "Ticket not found", 404);
  if (ticketDoc.status !== "resolved" && ticketDoc.status !== "closed") {
    return errorResponse("INVALID_STATE", "Feedback can only be submitted for resolved tickets", 400);
  }
  if (ticketDoc.feedback) {
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

  ticketDoc.feedback = feedback;
  await ticketDoc.save();

  return successResponse(feedback, 201);
}
