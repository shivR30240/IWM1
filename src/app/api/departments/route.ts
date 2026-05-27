import { connectToDatabase } from "@/lib/db";
import { Department } from "@/models/Department";
import { Ticket } from "@/models/Ticket";
import { successResponse } from "@/lib/api-helpers/response";

export async function GET() {
  await connectToDatabase();
  const departments = await Department.find({}).lean();
  const tickets = await Ticket.find({}).lean();

  const enriched = departments.map(dept => {
    const deptTickets = tickets.filter(t => t.departmentId === dept.id);
    return {
      ...dept,
      activeTickets: deptTickets.filter(t => !["closed", "resolved"].includes(t.status)).length,
      totalTickets: deptTickets.length,
      resolvedTickets: deptTickets.filter(t => t.status === "resolved" || t.status === "closed").length,
    };
  });

  return successResponse(enriched);
}
