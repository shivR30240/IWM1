import { NextRequest } from "next/server";
import { getUsersArray, getStore } from "@/lib/mock-data/store";
import { successResponse } from "@/lib/api-helpers/response";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  let users = getUsersArray();

  const role = searchParams.get("role");
  if (role) users = users.filter(u => u.role === role);

  const departmentId = searchParams.get("departmentId");
  if (departmentId) users = users.filter(u => u.departmentId === departmentId);

  // Strip passwords from response
  const sanitized = users.map(({ password: _, ...u }) => u);
  return successResponse(sanitized);
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const store = getStore();
  const id = `USR-${String(store.users.size + 1).padStart(3, "0")}`;

  const newUser = {
    id,
    name: body.name || "",
    nameHi: body.nameHi || "",
    email: body.email || "",
    phone: body.phone || "",
    password: body.password || "password123",
    role: body.role || "field_staff",
    departmentId: body.departmentId || null,
    wardAssignments: body.wardAssignments || [],
    isActive: true,
    avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(body.name || "User")}`,
    createdAt: new Date().toISOString(),
  };

  store.users.set(id, newUser);
  const { password: _, ...sanitized } = newUser;
  return successResponse(sanitized, 201);
}
