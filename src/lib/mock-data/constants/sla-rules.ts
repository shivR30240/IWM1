import type { TicketPriority } from "@/types";

export const SLA_RULES: Record<string, Record<TicketPriority, number>> = {
  WATER: { critical: 4, high: 12, medium: 48, low: 120 },
  PWD: { critical: 8, high: 24, medium: 72, low: 168 },
  ELEC: { critical: 2, high: 8, medium: 24, low: 96 },
  SANIT: { critical: 6, high: 16, medium: 48, low: 120 },
  HORT: { critical: 12, high: 36, medium: 96, low: 240 },
  ADMIN: { critical: 8, high: 24, medium: 72, low: 168 },
};
