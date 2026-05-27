import { NextRequest } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { Ticket } from "@/models/Ticket";
import { Department } from "@/models/Department";
import { successResponse, errorResponse } from "@/lib/api-helpers/response";

export async function GET(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await connectToDatabase();
  const tickets = await Ticket.find({ departmentId: id }).lean();
  const dept = await Department.findOne({ id }).lean();

  if (!dept) return errorResponse("NOT_FOUND", "Department not found", 404);

  const resolved = tickets.filter(t => t.status === "resolved" || t.status === "closed");
  const avgResolution = resolved.length > 0
    ? resolved.reduce((sum, t) => {
      const r = t.resolvedAt || t.closedAt || t.updatedAt;
      return sum + (new Date(r).getTime() - new Date(t.createdAt).getTime()) / (1000 * 60 * 60);
    }, 0) / resolved.length
    : 0;

  const slaCompliant = resolved.filter(t => !t.slaBreached).length;

  return successResponse({
    departmentId: id,
    departmentName: dept.name,
    totalTickets: tickets.length,
    openTickets: tickets.filter(t => t.status === "open" || t.status === "assigned").length,
    resolvedTickets: resolved.length,
    avgResolutionHours: Math.round(avgResolution),
    slaCompliancePercent: resolved.length > 0 ? Math.round((slaCompliant / resolved.length) * 100) : 0,
  });
}
