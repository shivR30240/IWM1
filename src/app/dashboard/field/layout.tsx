"use client";

import { RoleGuard } from "@/components/auth/RoleGuard";
import { TopBar } from "@/components/layout/TopBar";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ClipboardList, Map, User } from "lucide-react";
import { cn } from "@/lib/utils/cn";

const TABS = [
  { href: "/dashboard/field", label: "Tasks", icon: ClipboardList },
  { href: "/dashboard/field/tasks", label: "Map", icon: Map },
];

export default function FieldLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <RoleGuard allowedRoles={["field_staff", "super_admin"]}>
      <div className="flex h-screen flex-col">
        <TopBar />
        <main className="flex-1 overflow-y-auto bg-[var(--color-background)] p-4">
          {children}
        </main>
        {/* Bottom Tab Nav */}
        <nav className="flex border-t border-[var(--color-border)] bg-[var(--color-card)] sm:hidden" aria-label="Field staff navigation">
          {TABS.map(tab => {
            const isActive = pathname === tab.href;
            return (
              <Link key={tab.href} href={tab.href}
                className={cn(
                  "flex flex-1 flex-col items-center gap-1 py-3 text-xs font-medium transition-colors",
                  isActive ? "text-[var(--color-accent)]" : "text-[var(--color-muted-foreground)]"
                )}>
                <tab.icon className="h-5 w-5" />
                {tab.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </RoleGuard>
  );
}
