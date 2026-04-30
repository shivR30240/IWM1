import { getTicketsArray } from "@/lib/mock-data/store";
import { successResponse } from "@/lib/api-helpers/response";

export async function GET() {
  const tickets = getTicketsArray();

  const resolvedOrClosed = tickets.filter(t => t.status === "resolved" || t.status === "closed");
  const avgResolutionHours = resolvedOrClosed.length > 0
    ? resolvedOrClosed.reduce((sum, t) => {
      const resolved = t.resolvedAt || t.closedAt || t.updatedAt;
      return sum + (new Date(resolved).getTime() - new Date(t.createdAt).getTime()) / (1000 * 60 * 60);
    }, 0) / resolvedOrClosed.length
    : 0;

  const slaCompliant = resolvedOrClosed.filter(t => !t.slaBreached).length;
  const feedbackTickets = tickets.filter(t => t.feedback);
  const avgSatisfaction = feedbackTickets.length > 0
    ? feedbackTickets.reduce((sum, t) => sum + (t.feedback?.rating || 0), 0) / feedbackTickets.length
    : 0;

  const ticketsByCategory: Record<string, number> = {};
  const ticketsByStatus: Record<string, number> = {};
  const ticketsByPriority: Record<string, number> = {};

  for (const t of tickets) {
    ticketsByCategory[t.category] = (ticketsByCategory[t.category] || 0) + 1;
    ticketsByStatus[t.status] = (ticketsByStatus[t.status] || 0) + 1;
    ticketsByPriority[t.priority] = (ticketsByPriority[t.priority] || 0) + 1;
  }

  return successResponse({
    totalTickets: tickets.length,
    openTickets: ticketsByStatus["open"] || 0,
    resolvedTickets: (ticketsByStatus["resolved"] || 0) + (ticketsByStatus["closed"] || 0),
    closedTickets: ticketsByStatus["closed"] || 0,
    escalatedTickets: ticketsByStatus["escalated"] || 0,
    avgResolutionHours: Math.round(avgResolutionHours),
    slaCompliancePercent: resolvedOrClosed.length > 0 ? Math.round((slaCompliant / resolvedOrClosed.length) * 100) : 0,
    citizenSatisfactionAvg: Math.round(avgSatisfaction * 10) / 10,
    ticketsByCategory,
    ticketsByStatus,
    ticketsByPriority,
  });
}
