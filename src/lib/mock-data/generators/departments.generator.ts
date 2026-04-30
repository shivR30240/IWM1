import type { Department, TicketCategory, TicketPriority } from "@/types";
import { SLA_RULES } from "../constants/sla-rules";

export function generateDepartments(): Department[] {
  return [
    {
      id: "WATER", name: "Water & Sewerage", nameHi: "जल एवं सीवरेज", code: "WATER",
      headOfficerId: "HOD-001", categories: ["water_supply", "drainage"] as TicketCategory[],
      contactPhone: "+91-731-2525001", contactEmail: "water@imc.gov.in",
      slaTargetHours: SLA_RULES.WATER as Record<TicketPriority, number>, staffCount: 45,
    },
    {
      id: "PWD", name: "Public Works", nameHi: "लोक निर्माण", code: "PWD",
      headOfficerId: "HOD-002", categories: ["roads", "building_permits"] as TicketCategory[],
      contactPhone: "+91-731-2525002", contactEmail: "pwd@imc.gov.in",
      slaTargetHours: SLA_RULES.PWD as Record<TicketPriority, number>, staffCount: 38,
    },
    {
      id: "ELEC", name: "Electrical", nameHi: "विद्युत", code: "ELEC",
      headOfficerId: "HOD-003", categories: ["electricity", "street_lights"] as TicketCategory[],
      contactPhone: "+91-731-2525003", contactEmail: "electrical@imc.gov.in",
      slaTargetHours: SLA_RULES.ELEC as Record<TicketPriority, number>, staffCount: 30,
    },
    {
      id: "SANIT", name: "Sanitation", nameHi: "स्वच्छता", code: "SANIT",
      headOfficerId: "HOD-004", categories: ["sanitation", "garbage_collection"] as TicketCategory[],
      contactPhone: "+91-731-2525004", contactEmail: "sanitation@imc.gov.in",
      slaTargetHours: SLA_RULES.SANIT as Record<TicketPriority, number>, staffCount: 60,
    },
    {
      id: "HORT", name: "Horticulture", nameHi: "उद्यानिकी", code: "HORT",
      headOfficerId: "HOD-005", categories: ["parks"] as TicketCategory[],
      contactPhone: "+91-731-2525005", contactEmail: "horticulture@imc.gov.in",
      slaTargetHours: SLA_RULES.HORT as Record<TicketPriority, number>, staffCount: 20,
    },
    {
      id: "ADMIN", name: "General Administration", nameHi: "सामान्य प्रशासन", code: "ADMIN",
      headOfficerId: "HOD-006", categories: ["other"] as TicketCategory[],
      contactPhone: "+91-731-2525006", contactEmail: "admin@imc.gov.in",
      slaTargetHours: SLA_RULES.ADMIN as Record<TicketPriority, number>, staffCount: 25,
    },
  ];
}

const DEPT_CATEGORY_MAP: Record<string, string> = {
  water_supply: "WATER", drainage: "WATER",
  roads: "PWD", building_permits: "PWD",
  electricity: "ELEC", street_lights: "ELEC",
  sanitation: "SANIT", garbage_collection: "SANIT",
  parks: "HORT",
  other: "ADMIN",
};

export function getDepartmentForCategory(category: string): string {
  return DEPT_CATEGORY_MAP[category] || "ADMIN";
}
