import { NextRequest } from "next/server";
import { getStore, getTicketsArray } from "@/lib/mock-data/store";
import { applyTicketFilters } from "@/lib/api-helpers/filters";
import { successResponse, errorResponse, paginatedResponse } from "@/lib/api-helpers/response";
import type { TicketFilterParams } from "@/types";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  const params: TicketFilterParams = {
    status: searchParams.get("status") || undefined,
    category: searchParams.get("category") || undefined,
    priority: searchParams.get("priority") || undefined,
    departmentId: searchParams.get("departmentId") || undefined,
    wardNumber: searchParams.get("wardNumber") || undefined,
    dateFrom: searchParams.get("dateFrom") || undefined,
    dateTo: searchParams.get("dateTo") || undefined,
    search: searchParams.get("search") || undefined,
    assignedTo: searchParams.get("assignedTo") || undefined,
    slaBreached: searchParams.get("slaBreached") || undefined,
    sortBy: searchParams.get("sortBy") || undefined,
    sortOrder: (searchParams.get("sortOrder") as "asc" | "desc") || undefined,
    page: searchParams.get("page") || "1",
    pageSize: searchParams.get("pageSize") || "20",
  };

  const allTickets = getTicketsArray();
  const filtered = applyTicketFilters(allTickets, params);
  const page = Math.max(1, parseInt(params.page || "1"));
  const pageSize = Math.min(100, Math.max(1, parseInt(params.pageSize || "20")));

  return paginatedResponse(filtered, page, pageSize);
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const store = getStore();

  const ticketCount = store.tickets.size;
  const id = `IVC-2024-${String(ticketCount + 1).padStart(5, "0")}`;

  const newTicket = {
    id,
    title: body.title || `${body.category} issue`,
    titleHi: body.titleHi || body.title || "",
    description: body.description || "",
    descriptionHi: body.descriptionHi || "",
    category: body.category || "other",
    status: "open" as const,
    priority: body.priority || "medium",
    source: body.source || "web_portal",
    citizenName: body.citizenName || "Anonymous",
    citizenPhone: body.citizenPhone || "",
    wardNumber: body.wardNumber || 1,
    wardName: body.wardName || "Unknown",
    address: body.address || "",
    latitude: body.latitude || 22.7196,
    longitude: body.longitude || 75.8577,
    departmentId: body.departmentId || "ADMIN",
    assignedOfficerId: null,
    assignedFieldStaffId: null,
    slaTargetHours: 48,
    slaBreached: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    resolvedAt: null,
    closedAt: null,
    escalatedAt: null,
    statusHistory: [{ fromStatus: null, toStatus: "open" as const, changedBy: "system", changedAt: new Date().toISOString(), note: "Complaint received" }],
    attachments: [],
    feedback: null,
  };

  store.tickets.set(id, newTicket);
  return successResponse(newTicket, 201);
}
