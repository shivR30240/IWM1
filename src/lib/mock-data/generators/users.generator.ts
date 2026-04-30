import type { User, UserRole } from "@/types";
import { generateUserId } from "@/lib/utils/id-generator";

interface UserTemplate {
  name: string;
  nameHi: string;
  role: UserRole;
  departmentId: string | null;
  email: string;
  password: string;
  wardAssignments: number[];
}

const USER_TEMPLATES: UserTemplate[] = [
  // Super Admin
  { name: "Anil Kumar Sinha", nameHi: "अनिल कुमार सिन्हा", role: "super_admin", departmentId: null, email: "admin@imc.gov.in", password: "admin123", wardAssignments: [] },
  // Department Heads
  { name: "Rajesh Sharma", nameHi: "राजेश शर्मा", role: "department_head", departmentId: "WATER", email: "rajesh.sharma@imc.gov.in", password: "dept123", wardAssignments: [] },
  { name: "Sunita Patel", nameHi: "सुनीता पटेल", role: "department_head", departmentId: "PWD", email: "sunita.patel@imc.gov.in", password: "dept123", wardAssignments: [] },
  { name: "Manoj Dubey", nameHi: "मनोज दुबे", role: "department_head", departmentId: "ELEC", email: "manoj.dubey@imc.gov.in", password: "dept123", wardAssignments: [] },
  { name: "Kavita Joshi", nameHi: "कविता जोशी", role: "department_head", departmentId: "SANIT", email: "kavita.joshi@imc.gov.in", password: "dept123", wardAssignments: [] },
  { name: "Deepak Rathore", nameHi: "दीपक राठौर", role: "department_head", departmentId: "HORT", email: "deepak.rathore@imc.gov.in", password: "dept123", wardAssignments: [] },
  // Officers
  { name: "Priya Verma", nameHi: "प्रिया वर्मा", role: "officer", departmentId: "WATER", email: "priya.verma@imc.gov.in", password: "officer123", wardAssignments: [] },
  { name: "Amit Gupta", nameHi: "अमित गुप्ता", role: "officer", departmentId: "PWD", email: "amit.gupta@imc.gov.in", password: "officer123", wardAssignments: [] },
  { name: "Neha Singh", nameHi: "नेहा सिंह", role: "officer", departmentId: "ELEC", email: "neha.singh@imc.gov.in", password: "officer123", wardAssignments: [] },
  { name: "Vikram Yadav", nameHi: "विक्रम यादव", role: "officer", departmentId: "SANIT", email: "vikram.yadav@imc.gov.in", password: "officer123", wardAssignments: [] },
  { name: "Pooja Tiwari", nameHi: "पूजा तिवारी", role: "officer", departmentId: "HORT", email: "pooja.tiwari@imc.gov.in", password: "officer123", wardAssignments: [] },
  // Field Staff
  { name: "Ramesh Yadav", nameHi: "रमेश यादव", role: "field_staff", departmentId: "WATER", email: "ramesh.yadav@imc.gov.in", password: "field123", wardAssignments: [1, 2, 5, 7, 10] },
  { name: "Suresh Kumar", nameHi: "सुरेश कुमार", role: "field_staff", departmentId: "WATER", email: "suresh.kumar@imc.gov.in", password: "field123", wardAssignments: [12, 15, 18, 20, 22] },
  { name: "Dinesh Prajapati", nameHi: "दिनेश प्रजापति", role: "field_staff", departmentId: "PWD", email: "dinesh.prajapati@imc.gov.in", password: "field123", wardAssignments: [25, 28, 30, 33] },
  { name: "Kailash Malviya", nameHi: "कैलाश मालवीय", role: "field_staff", departmentId: "PWD", email: "kailash.malviya@imc.gov.in", password: "field123", wardAssignments: [35, 38, 40, 42] },
  { name: "Mohan Solanki", nameHi: "मोहन सोलंकी", role: "field_staff", departmentId: "ELEC", email: "mohan.solanki@imc.gov.in", password: "field123", wardAssignments: [45, 48, 50, 52] },
  { name: "Bharat Chouhan", nameHi: "भारत चौहान", role: "field_staff", departmentId: "ELEC", email: "bharat.chouhan@imc.gov.in", password: "field123", wardAssignments: [55, 58, 60, 62] },
  { name: "Govind Soni", nameHi: "गोविंद सोनी", role: "field_staff", departmentId: "SANIT", email: "govind.soni@imc.gov.in", password: "field123", wardAssignments: [1, 5, 10, 15, 20] },
  { name: "Shankar Meena", nameHi: "शंकर मीना", role: "field_staff", departmentId: "SANIT", email: "shankar.meena@imc.gov.in", password: "field123", wardAssignments: [25, 30, 35, 40, 45] },
  { name: "Pappu Lal", nameHi: "पप्पू लाल", role: "field_staff", departmentId: "SANIT", email: "pappu.lal@imc.gov.in", password: "field123", wardAssignments: [50, 55, 60, 65, 70] },
  { name: "Raju Thakur", nameHi: "राजू ठाकुर", role: "field_staff", departmentId: "HORT", email: "raju.thakur@imc.gov.in", password: "field123", wardAssignments: [7, 12, 18, 22, 28, 33] },
  { name: "Ashok Nagar", nameHi: "अशोक नागर", role: "field_staff", departmentId: "ADMIN", email: "ashok.nagar@imc.gov.in", password: "field123", wardAssignments: [38, 42, 48, 52, 58, 62] },
  { name: "Mahesh Jatav", nameHi: "महेश जाटव", role: "field_staff", departmentId: "ADMIN", email: "mahesh.jatav@imc.gov.in", password: "field123", wardAssignments: [65, 68, 70, 72] },
];

export function generateUsers(): User[] {
  return USER_TEMPLATES.map((t, i) => ({
    id: generateUserId("USR", i + 1),
    name: t.name,
    nameHi: t.nameHi,
    email: t.email,
    phone: `+91-98${String(7600 + i * 11).padStart(4, "0")}${String(1000 + i * 37).padStart(4, "0")}`,
    password: t.password,
    role: t.role,
    departmentId: t.departmentId,
    wardAssignments: t.wardAssignments,
    isActive: true,
    avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(t.name)}`,
    createdAt: "2024-01-15T09:00:00.000Z",
  }));
}
