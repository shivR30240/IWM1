"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import type { User, UserRole } from "@/types";
import { decodeMockToken } from "@/lib/api-helpers/auth-guard";

type AuthUser = Omit<User, "password">;

interface AuthContextType {
  user: AuthUser | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

const ROLE_ROUTES: Record<UserRole, string> = {
  super_admin: "/admin",
  department_head: "/dashboard/department",
  officer: "/dashboard/department",
  field_staff: "/dashboard/field",
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const stored = localStorage.getItem("auth-token");
    const storedUser = localStorage.getItem("auth-user");
    if (stored && storedUser) {
      const decoded = decodeMockToken(stored);
      if (decoded) {
        setTimeout(() => {
          setToken(stored);
          setUser(JSON.parse(storedUser));
          setIsLoading(false);
        }, 0);
        return;
      } else {
        localStorage.removeItem("auth-token");
        localStorage.removeItem("auth-user");
      }
    }
    setTimeout(() => {
      setIsLoading(false);
    }, 0);
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!data.success) {
        return { success: false, error: data.error?.message || "Login failed" };
      }
      setToken(data.data.token);
      setUser(data.data.user);
      localStorage.setItem("auth-token", data.data.token);
      localStorage.setItem("auth-user", JSON.stringify(data.data.user));
      document.cookie = `auth-token=${data.data.token}; path=/; max-age=86400`;

      const role = data.data.user.role as UserRole;
      const route = role === "super_admin" ? "/admin" : ROLE_ROUTES[role] || "/dashboard/department";
      router.push(route);
      return { success: true };
    } catch {
      return { success: false, error: "Network error" };
    }
  }, [router]);

  const logout = useCallback(() => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("auth-token");
    localStorage.removeItem("auth-user");
    document.cookie = "auth-token=; path=/; max-age=0";
    router.push("/login");
  }, [router]);

  return (
    <AuthContext.Provider value={{ user, token, isLoading, isAuthenticated: !!user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}

export { ROLE_ROUTES };
