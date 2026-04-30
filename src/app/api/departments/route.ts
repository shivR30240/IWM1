import { getDepartmentsArray, getTicketsArray } from "@/lib/mock-data/store";
import { successResponse } from "@/lib/api-helpers/response";

export async function GET() {
  const departments = getDepartmentsArray();
  const tickets = getTicketsArray();

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
