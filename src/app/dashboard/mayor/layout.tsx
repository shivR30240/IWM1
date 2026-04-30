"use client";

import { RoleGuard } from "@/components/auth/RoleGuard";
import { Sidebar, type SidebarItem } from "@/components/layout/Sidebar";
import { TopBar } from "@/components/layout/TopBar";
import { LayoutDashboard, Map, Building2, TrendingUp } from "lucide-react";

const SIDEBAR_ITEMS: SidebarItem[] = [
  { href: "/dashboard/mayor", label: "Overview", icon: LayoutDashboard },
  { href: "/dashboard/mayor/heatmap", label: "Heatmap", icon: Map },
  { href: "/dashboard/mayor/departments", label: "Departments", icon: Building2 },
];

export default function MayorLayout({ children }: { children: React.ReactNode }) {
  return (
    <RoleGuard allowedRoles={["super_admin", "department_head"]}>
      <div className="flex h-screen overflow-hidden">
        <Sidebar items={SIDEBAR_ITEMS} title="City Dashboard" />
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
