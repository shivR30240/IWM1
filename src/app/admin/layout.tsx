"use client";

import { RoleGuard } from "@/components/auth/RoleGuard";
import { Sidebar, type SidebarItem } from "@/components/layout/Sidebar";
import { TopBar } from "@/components/layout/TopBar";
import { LayoutDashboard, Users, Building2, Settings, Phone, BarChart3 } from "lucide-react";

const SIDEBAR_ITEMS: SidebarItem[] = [
  { href: "/admin", label: "System Stats", icon: LayoutDashboard },
  { href: "/admin/users", label: "User Management", icon: Users },
  { href: "/admin/departments", label: "Departments", icon: Building2 },
  { href: "/admin/call-stats", label: "Call Statistics", icon: BarChart3 },
  { href: "/admin/call-logs", label: "Call Logs", icon: Phone },
  { href: "/admin/ivr-config", label: "IVR Config", icon: Settings },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <RoleGuard allowedRoles={["super_admin"]}>
      <div className="flex h-screen overflow-hidden">
        <Sidebar items={SIDEBAR_ITEMS} title="Admin Panel" />
        <div className="flex flex-1 flex-col overflow-hidden">
          <TopBar sidebarItems={SIDEBAR_ITEMS} />
          <main className="flex-1 overflow-y-auto bg-[var(--color-background)] p-4 lg:p-6">
            {children}
          </main>
        </div>
      </div>
    </RoleGuard>
  );
}
