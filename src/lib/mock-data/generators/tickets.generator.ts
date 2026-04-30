import type { Ticket, TicketStatus, TicketPriority, TicketCategory, TicketSource, StatusChange } from "@/types";
import { generateTicketId, resetCounter } from "@/lib/utils/id-generator";
import { randomElement, randomInt, randomFloat, weightedRandom, randomBoolean, resetSeed } from "@/lib/utils/seeded-random";
import { INDORE_LOCATIONS } from "../constants/indore-locations";
import { CATEGORIES } from "../constants/categories";
import { getDepartmentForCategory } from "./departments.generator";
import { SLA_RULES } from "../constants/sla-rules";

// Re-export seeded random with ticket id generation
import { generateTicketId as genId } from "@/lib/utils/id-generator";

const CITIZEN_NAMES = [
  { en: "Ramesh Agarwal", hi: "रमेश अग्रवाल" },
  { en: "Sita Devi", hi: "सीता देवी" },
  { en: "Mohammad Aziz", hi: "मोहम्मद अज़ीज़" },
  { en: "Lakshmi Bai", hi: "लक्ष्मी बाई" },
  { en: "Sunil Thakur", hi: "सुनील ठाकुर" },
  { en: "Meena Kumari", hi: "मीना कुमारी" },
  { en: "Pramod Jain", hi: "प्रमोद जैन" },
  { en: "Asha Rathore", hi: "आशा राठौर" },
  { en: "Vijay Malhotra", hi: "विजय मल्होत्रा" },
  { en: "Kamla Sharma", hi: "कमला शर्मा" },
  { en: "Ravi Patel", hi: "रवि पटेल" },
  { en: "Geeta Yadav", hi: "गीता यादव" },
  { en: "Hansraj Meena", hi: "हंसराज मीना" },
  { en: "Saroj Gupta", hi: "सरोज गुप्ता" },
  { en: "Ashok Verma", hi: "अशोक वर्मा" },
  { en: "Parvati Singh", hi: "पार्वती सिंह" },
  { en: "Gopal Das", hi: "गोपाल दास" },
  { en: "Radha Tiwari", hi: "राधा तिवारी" },
  { en: "Kishan Lal", hi: "किशन लाल" },
  { en: "Sunita Dubey", hi: "सुनीता दुबे" },
];

const SOURCES: TicketSource[] = ["voice_call", "voice_call", "voice_call", "web_portal", "whatsapp"];

export function generateTickets(userIds: { officers: Record<string, string[]>; fieldStaff: Record<string, string[]> }): Ticket[] {
  resetSeed(42);

  const now = new Date();
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

  const categories: TicketCategory[] = [
    "water_supply", "water_supply", "water_supply",
    "garbage_collection", "garbage_collection", "garbage_collection",
    "roads", "roads", "roads",
    "street_lights", "street_lights",
    "drainage", "drainage",
    "sanitation", "sanitation",
    "electricity", "electricity",
    "parks",
    "building_permits",
    "other",
  ];

  const statuses: TicketStatus[] = [
    "open", "open", "open",
    "assigned", "assigned",
    "in_progress", "in_progress", "in_progress",
    "resolved", "resolved", "resolved", "resolved",
    "closed", "closed",
    "escalated",
  ];

  const priorities: TicketPriority[] = ["low", "low", "medium", "medium", "medium", "high", "high", "critical"];

  const tickets: Ticket[] = [];
  resetSeed(42);

  for (let i = 0; i < 60; i++) {
    const category = randomElement(categories);
    const status = randomElement(statuses);
    const priority = randomElement(priorities);
    const location = randomElement(INDORE_LOCATIONS);
    const address = randomElement(location.addresses);
    const citizen = randomElement(CITIZEN_NAMES);
    const source = randomElement(SOURCES);
    const deptId = getDepartmentForCategory(category);

    const catInfo = CATEGORIES.find(c => c.id === category)!;
    const template = randomElement(catInfo.templates);
    const days = randomInt(2, 7);
    const description = template.en.replace("{area}", location.wardName).replace("{address}", address).replace("{days}", String(days));
    const descriptionHi = template.hi.replace("{area}", location.wardName).replace("{address}", address).replace("{days}", String(days));

    // Create time
    const createdAt = new Date(thirtyDaysAgo.getTime() + randomFloat(0, 1) * (now.getTime() - thirtyDaysAgo.getTime() - 2 * 24 * 60 * 60 * 1000));

    // SLA
    const slaHours = (SLA_RULES[deptId] || SLA_RULES.ADMIN)[priority];

    // Build status history and timestamps
    const statusHistory: StatusChange[] = [];
    let updatedAt = new Date(createdAt);
    let resolvedAt: string | null = null;
    let closedAt: string | null = null;
    let escalatedAt: string | null = null;
    let assignedOfficerId: string | null = null;
    let assignedFieldStaffId: string | null = null;

    const deptOfficers = userIds.officers[deptId] || [];
    const deptFieldStaff = userIds.fieldStaff[deptId] || [];

    statusHistory.push({ fromStatus: null, toStatus: "open", changedBy: "system", changedAt: createdAt.toISOString(), note: "Complaint received via " + source.replace("_", " ") });

    if (status !== "open") {
      const assignTime = new Date(createdAt.getTime() + randomInt(1, 12) * 60 * 60 * 1000);
      assignedOfficerId = deptOfficers.length > 0 ? randomElement(deptOfficers) : null;
      statusHistory.push({ fromStatus: "open", toStatus: "assigned", changedBy: assignedOfficerId || "system", changedAt: assignTime.toISOString(), note: "Assigned to department" });
      updatedAt = assignTime;

      if (status === "assigned") {
        if (deptFieldStaff.length > 0) assignedFieldStaffId = randomElement(deptFieldStaff);
      }
    }

    if (["in_progress", "resolved", "closed", "escalated"].includes(status) && status !== "escalated") {
      const progressTime = new Date(updatedAt.getTime() + randomInt(2, 24) * 60 * 60 * 1000);
      assignedFieldStaffId = deptFieldStaff.length > 0 ? randomElement(deptFieldStaff) : null;
      statusHistory.push({ fromStatus: "assigned", toStatus: "in_progress", changedBy: assignedFieldStaffId || "system", changedAt: progressTime.toISOString(), note: "Work started on site" });
      updatedAt = progressTime;
    }

    if (["resolved", "closed"].includes(status)) {
      const resolveTime = new Date(updatedAt.getTime() + randomInt(4, 72) * 60 * 60 * 1000);
      statusHistory.push({ fromStatus: "in_progress", toStatus: "resolved", changedBy: assignedFieldStaffId || "system", changedAt: resolveTime.toISOString(), note: "Issue resolved" });
      resolvedAt = resolveTime.toISOString();
      updatedAt = resolveTime;
    }

    if (status === "closed") {
      const closeTime = new Date(updatedAt.getTime() + randomInt(12, 48) * 60 * 60 * 1000);
      statusHistory.push({ fromStatus: "resolved", toStatus: "closed", changedBy: "system", changedAt: closeTime.toISOString(), note: "Auto-closed after verification" });
      closedAt = closeTime.toISOString();
      updatedAt = closeTime;
    }

    if (status === "escalated") {
      const escalateTime = new Date(updatedAt.getTime() + randomInt(24, 96) * 60 * 60 * 1000);
      statusHistory.push({ fromStatus: statusHistory[statusHistory.length - 1].toStatus, toStatus: "escalated", changedBy: "system", changedAt: escalateTime.toISOString(), note: "SLA breached - auto escalated" });
      escalatedAt = escalateTime.toISOString();
      updatedAt = escalateTime;
    }

    const actualResolutionHours = resolvedAt
      ? (new Date(resolvedAt).getTime() - createdAt.getTime()) / (1000 * 60 * 60)
      : null;
    const slaBreached = status === "escalated" || (actualResolutionHours !== null && actualResolutionHours > slaHours) || (status !== "resolved" && status !== "closed" && (updatedAt.getTime() - createdAt.getTime()) / (1000 * 60 * 60) > slaHours);

    const phoneNum = `+91-98***-**${String(randomInt(100, 999))}`;

    tickets.push({
      id: genId(),
      title: `${catInfo.name} issue in ${location.wardName}`,
      titleHi: `${catInfo.nameHi} - ${location.wardName}`,
      description,
      descriptionHi,
      category,
      status,
      priority,
      source,
      citizenName: citizen.en,
      citizenPhone: phoneNum,
      wardNumber: location.wardNumber,
      wardName: location.wardName,
      address: `${address}, ${location.wardName}, Indore`,
      latitude: location.latitude + randomFloat(-0.005, 0.005),
      longitude: location.longitude + randomFloat(-0.005, 0.005),
      departmentId: deptId,
      assignedOfficerId,
      assignedFieldStaffId,
      slaTargetHours: slaHours,
      slaBreached,
      createdAt: createdAt.toISOString(),
      updatedAt: updatedAt.toISOString(),
      resolvedAt,
      closedAt,
      escalatedAt,
      statusHistory,
      attachments: status === "resolved" || status === "closed" ? [`/images/placeholder-${randomInt(1, 3)}.jpg`] : [],
      feedback: null,
    });
  }

  return tickets;
}
