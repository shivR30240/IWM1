import { NextRequest } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { User } from "@/models/User";
import { successResponse } from "@/lib/api-helpers/response";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  await connectToDatabase();
  
  const query: { role?: string; departmentId?: string } = {};
  
  const role = searchParams.get("role");
  if (role) query.role = role;

  const departmentId = searchParams.get("departmentId");
  if (departmentId) query.departmentId = departmentId;

  const users = await User.find(query).lean();

  // Strip passwords from response
  const sanitized = users.map(({ password: _, ...u }) => u);
  return successResponse(sanitized);
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  await connectToDatabase();
  
  const userCount = await User.countDocuments();
  const id = `USR-${String(userCount + 1).padStart(3, "0")}`;

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

  const createdUser = await User.create(newUser);
  const userObj = createdUser.toObject();
  const { password: _, ...sanitized } = userObj;
  
  return successResponse(sanitized, 201);
}
