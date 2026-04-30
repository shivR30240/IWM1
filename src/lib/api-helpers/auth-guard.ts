import type { DecodedToken } from "@/types";
import { NextRequest } from "next/server";

export function authenticateRequest(request: NextRequest): DecodedToken | null {
  const authHeader = request.headers.get("Authorization");
  if (!authHeader?.startsWith("Bearer ")) {
    // Also check cookies
    const tokenCookie = request.cookies.get("auth-token")?.value;
    if (!tokenCookie) return null;
    return decodeMockToken(tokenCookie);
  }
  const token = authHeader.slice(7);
  return decodeMockToken(token);
}

export function decodeMockToken(token: string): DecodedToken | null {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;
    const payload = JSON.parse(atob(parts[1]));
    if (payload.exp && payload.exp < Date.now() / 1000) return null;
    return payload as DecodedToken;
  } catch {
    return null;
  }
}

export function createMockToken(userId: string, role: string, departmentId: string | null, name: string): string {
  const header = btoa(JSON.stringify({ alg: "HS256", typ: "JWT" }));
  const payload = btoa(JSON.stringify({
    userId,
    role,
    departmentId,
    name,
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + 24 * 60 * 60,
  }));
  const signature = btoa("mock-signature");
  return `${header}.${payload}.${signature}`;
}
