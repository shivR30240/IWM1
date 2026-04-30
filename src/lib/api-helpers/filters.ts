import type { Ticket, TicketFilterParams } from "@/types";

export function applyTicketFilters(tickets: Ticket[], params: TicketFilterParams): Ticket[] {
  let result = [...tickets];

  if (params.status) {
    const statuses = params.status.split(",");
    result = result.filter(t => statuses.includes(t.status));
  }
  if (params.category) {
    const cats = params.category.split(",");
    result = result.filter(t => cats.includes(t.category));
  }
  if (params.priority) {
    const pris = params.priority.split(",");
    result = result.filter(t => pris.includes(t.priority));
  }
  if (params.departmentId) {
    result = result.filter(t => t.departmentId === params.departmentId);
  }
  if (params.wardNumber) {
    result = result.filter(t => t.wardNumber === Number(params.wardNumber));
  }
  if (params.dateFrom) {
    const from = new Date(params.dateFrom).getTime();
    result = result.filter(t => new Date(t.createdAt).getTime() >= from);
  }
  if (params.dateTo) {
    const to = new Date(params.dateTo).getTime();
    result = result.filter(t => new Date(t.createdAt).getTime() <= to);
  }
  if (params.assignedTo) {
    result = result.filter(t => t.assignedOfficerId === params.assignedTo || t.assignedFieldStaffId === params.assignedTo);
  }
  if (params.slaBreached === "true") {
    result = result.filter(t => t.slaBreached);
  } else if (params.slaBreached === "false") {
    result = result.filter(t => !t.slaBreached);
  }
  if (params.search) {
    const s = params.search.toLowerCase();
    result = result.filter(t =>
      t.id.toLowerCase().includes(s) ||
      t.title.toLowerCase().includes(s) ||
      t.description.toLowerCase().includes(s) ||
      t.citizenName.toLowerCase().includes(s) ||
      t.wardName.toLowerCase().includes(s) ||
      t.address.toLowerCase().includes(s)
    );
  }

  // Sort
  const sortBy = params.sortBy || "createdAt";
  const sortOrder = params.sortOrder || "desc";
  result.sort((a, b) => {
    let aVal: string | number = "";
    let bVal: string | number = "";
    if (sortBy === "createdAt" || sortBy === "updatedAt") {
      aVal = new Date(a[sortBy as keyof Ticket] as string).getTime();
      bVal = new Date(b[sortBy as keyof Ticket] as string).getTime();
    } else if (sortBy === "priority") {
      const order = { critical: 4, high: 3, medium: 2, low: 1 };
      aVal = order[a.priority] || 0;
      bVal = order[b.priority] || 0;
    } else {
      aVal = String(a[sortBy as keyof Ticket] || "");
      bVal = String(b[sortBy as keyof Ticket] || "");
    }
    if (aVal < bVal) return sortOrder === "asc" ? -1 : 1;
    if (aVal > bVal) return sortOrder === "asc" ? 1 : -1;
    return 0;
  });

  return result;
}
