import { NextRequest } from "next/server";
import { getTicketsArray } from "@/lib/mock-data/store";
import { successResponse } from "@/lib/api-helpers/response";
import { format, subDays } from "date-fns";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const days = parseInt(searchParams.get("days") || "30");
  const tickets = getTicketsArray();

  const now = new Date();
  const points = [];

  for (let i = days; i >= 0; i--) {
    const date = subDays(now, i);
    const dateStr = format(date, "yyyy-MM-dd");

    const created = tickets.filter(t => format(new Date(t.createdAt), "yyyy-MM-dd") === dateStr).length;
    const resolved = tickets.filter(t => t.resolvedAt && format(new Date(t.resolvedAt), "yyyy-MM-dd") === dateStr).length;
    const escalated = tickets.filter(t => t.escalatedAt && format(new Date(t.escalatedAt), "yyyy-MM-dd") === dateStr).length;

    points.push({ date: dateStr, created, resolved, escalated });
  }

  return successResponse(points);
}
