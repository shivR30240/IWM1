"use client";

import { RoleGuard } from "@/components/auth/RoleGuard";
import { Sidebar, type SidebarItem } from "@/components/layout/Sidebar";
import { TopBar } from "@/components/layout/TopBar";
import { Ticket, BarChart3, Map, TrendingUp } from "lucide-react";

const SIDEBAR_ITEMS: SidebarItem[] = [
  { href: "/dashboard/department", label: "Tickets", icon: Ticket },
  { href: "/dashboard/department/performance", label: "Performance", icon: BarChart3 },
  { href: "/dashboard/department/map", label: "Map View", icon: Map },
];

export default function DepartmentLayout({ children }: { children: React.ReactNode }) {
  return (
    <RoleGuard allowedRoles={["officer", "department_head", "super_admin"]}>
      <div className="flex h-screen overflow-hidden">
        <Sidebar items={SIDEBAR_ITEMS} title="Department" />
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
