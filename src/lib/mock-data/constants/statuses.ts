import type { TicketStatus } from "@/types";

export const STATUS_LABELS: Record<TicketStatus, { en: string; hi: string; color: string }> = {
  open: { en: "Open", hi: "खुला", color: "bg-blue-100 text-blue-800" },
  assigned: { en: "Assigned", hi: "सौंपा गया", color: "bg-purple-100 text-purple-800" },
  in_progress: { en: "In Progress", hi: "प्रगति में", color: "bg-yellow-100 text-yellow-800" },
  resolved: { en: "Resolved", hi: "समाधान", color: "bg-green-100 text-green-800" },
  closed: { en: "Closed", hi: "बंद", color: "bg-gray-100 text-gray-800" },
  escalated: { en: "Escalated", hi: "वृद्धि", color: "bg-red-100 text-red-800" },
};

export const VALID_TRANSITIONS: Record<TicketStatus, TicketStatus[]> = {
  open: ["assigned", "escalated"],
  assigned: ["in_progress", "escalated", "open"],
  in_progress: ["resolved", "escalated"],
  resolved: ["closed", "in_progress"],
  closed: [],
  escalated: ["assigned", "in_progress"],
};

export const PRIORITY_LABELS: Record<string, { en: string; hi: string; color: string }> = {
  low: { en: "Low", hi: "कम", color: "bg-green-100 text-green-800" },
  medium: { en: "Medium", hi: "मध्यम", color: "bg-yellow-100 text-yellow-800" },
  high: { en: "High", hi: "उच्च", color: "bg-orange-100 text-orange-800" },
  critical: { en: "Critical", hi: "गंभीर", color: "bg-red-100 text-red-800" },
};

export const STATUS_ORDER: TicketStatus[] = ["open", "assigned", "in_progress", "resolved", "closed"];
