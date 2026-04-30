import type { Ticket, User, Department, CitizenFeedback } from "@/types";
import { generateDepartments } from "./generators/departments.generator";
import { generateUsers } from "./generators/users.generator";
import { generateTickets } from "./generators/tickets.generator";
import { generateFeedback } from "./generators/feedback.generator";
import { resetCounter } from "@/lib/utils/id-generator";
import { resetSeed } from "@/lib/utils/seeded-random";

interface Store {
  tickets: Map<string, Ticket>;
  users: Map<string, User>;
  departments: Map<string, Department>;
  feedback: Map<string, CitizenFeedback>;
}

let _store: Store | null = null;

function seed(): Store {
  resetSeed(42);
  resetCounter();

  const departments = generateDepartments();
  const users = generateUsers();

  // Build officer and field staff maps by department
  const officers: Record<string, string[]> = {};
  const fieldStaff: Record<string, string[]> = {};
  for (const u of users) {
    if (u.departmentId) {
      if (u.role === "officer" || u.role === "department_head") {
        if (!officers[u.departmentId]) officers[u.departmentId] = [];
        officers[u.departmentId].push(u.id);
      }
      if (u.role === "field_staff") {
        if (!fieldStaff[u.departmentId]) fieldStaff[u.departmentId] = [];
        fieldStaff[u.departmentId].push(u.id);
      }
    }
  }

  const tickets = generateTickets({ officers, fieldStaff });
  const feedback = generateFeedback(tickets);

  // Attach feedback to tickets
  for (const [ticketId, fb] of feedback) {
    const ticket = tickets.find(t => t.id === ticketId);
    if (ticket) ticket.feedback = fb;
  }

  return {
    tickets: new Map(tickets.map(t => [t.id, t])),
    users: new Map(users.map(u => [u.id, u])),
    departments: new Map(departments.map(d => [d.id, d])),
    feedback,
  };
}

export function getStore(): Store {
  if (!_store) {
    _store = seed();
  }
  return _store;
}

export function getTicketsArray(): Ticket[] {
  return Array.from(getStore().tickets.values());
}

export function getUsersArray(): User[] {
  return Array.from(getStore().users.values());
}

export function getDepartmentsArray(): Department[] {
  return Array.from(getStore().departments.values());
}
