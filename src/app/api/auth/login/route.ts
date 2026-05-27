import { NextRequest } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { User } from "@/models/User";
import { createMockToken } from "@/lib/api-helpers/auth-guard";
import { successResponse, errorResponse } from "@/lib/api-helpers/response";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { email, password } = body;

  if (!email || !password) {
    return errorResponse("INVALID_INPUT", "Email and password are required", 400);
  }

  await connectToDatabase();
  const user = await User.findOne({ email, password }).lean();

  if (!user) {
    return errorResponse("AUTH_FAILED", "Invalid email or password", 401);
  }

  if (!user.isActive) {
    return errorResponse("ACCOUNT_DISABLED", "Account is disabled", 403);
  }

  const token = createMockToken(user.id, user.role, user.departmentId, user.name);
  const { password: _, ...userWithoutPassword } = user;

  return successResponse({
    token,
    user: userWithoutPassword,
    expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
  });
}
