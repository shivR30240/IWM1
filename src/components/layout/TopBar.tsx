"use client";

import { useAuth } from "@/lib/auth/context";
import { Button } from "@/components/ui/Button";
import { LogOut, Bell, Menu, X, ChevronRight } from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import type { SidebarItem } from "./Sidebar";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils/cn";

interface TopBarProps {
  sidebarItems?: SidebarItem[];
}

export function TopBar({ sidebarItems }: TopBarProps) {
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  return (
    <>
      <header className="flex h-16 items-center justify-between border-b border-[var(--color-border)] bg-[var(--color-card)] px-4 lg:px-6">
        <div className="flex items-center gap-4">
          {sidebarItems && (
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)} 
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-[var(--color-border)] bg-[var(--color-muted)] text-[var(--color-foreground)] transition-colors hover:bg-[var(--color-border)] lg:hidden" 
              aria-label="Toggle menu"
            >
              <Menu className="h-5 w-5" />
            </button>
          )}
          <Breadcrumbs />
        </div>
        <div className="flex items-center gap-3">
          <button 
            className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-[var(--color-border)] bg-[var(--color-muted)] transition-colors hover:bg-[var(--color-border)]" 
            aria-label="Notifications"
          >
            <Bell className="h-5 w-5 text-[var(--color-muted-foreground)]" />
            <span className="absolute right-2 top-2 h-2.5 w-2.5 rounded-full bg-[var(--color-danger)] ring-2 ring-[var(--color-card)]" />
          </button>
          {user && (
            <div className="hidden items-center gap-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-muted)] px-3 py-2 sm:flex">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-[var(--color-accent)] to-[var(--color-accent-dark)] text-xs font-bold text-[var(--color-primary)]">
                {user.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
              </div>
              <div className="text-left">
                <p className="text-sm font-medium text-[var(--color-foreground)] leading-tight">{user.name}</p>
                <p className="text-xs text-[var(--color-muted-foreground)] capitalize">{user.role.replace(/_/g, " ")}</p>
              </div>
            </div>
          )}
          <Button variant="ghost" size="sm" onClick={logout} className="rounded-xl">
            <LogOut className="h-4 w-4" />
            <span className="hidden sm:inline">Logout</span>
          </Button>
        </div>
      </header>

      {/* Mobile sidebar drawer */}
      {mobileMenuOpen && sidebarItems && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)} />
          <div className="absolute left-0 top-0 h-full w-72 bg-[var(--color-card)] shadow-2xl animate-fade-in">
            <div className="flex h-16 items-center justify-between border-b border-[var(--color-border)] px-4">
              <span className="font-semibold text-[var(--color-foreground)]">Navigation</span>
              <button 
                onClick={() => setMobileMenuOpen(false)} 
                className="flex h-8 w-8 items-center justify-center rounded-lg text-[var(--color-muted-foreground)] hover:bg-[var(--color-muted)] hover:text-[var(--color-foreground)]"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <nav className="p-3 space-y-1">
              {sidebarItems.map(item => {
                const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
                return (
                  <Link 
                    key={item.href} 
                    href={item.href} 
                    onClick={() => setMobileMenuOpen(false)}
                    className={cn(
                      "flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all",
                      isActive
                        ? "bg-[var(--color-accent)]/10 text-[var(--color-accent)]"
                        : "text-[var(--color-muted-foreground)] hover:bg-[var(--color-muted)] hover:text-[var(--color-foreground)]"
                    )}
                  >
                    <item.icon className="h-5 w-5" />
                    <span className="flex-1">{item.label}</span>
                    {item.badge !== undefined && item.badge > 0 && (
                      <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-[var(--color-danger)] px-1.5 text-[10px] font-bold text-white">
                        {item.badge > 99 ? "99+" : item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>
      )}
    </>
  );
}

function Breadcrumbs() {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);

  const labels: Record<string, string> = {
    admin: "Admin",
    dashboard: "Dashboard",
    department: "Department",
    field: "Field Staff",
    mayor: "Mayor",
    tickets: "Tickets",
    users: "Users",
    departments: "Departments",
    performance: "Performance",
    map: "Map",
    tasks: "Tasks",
    heatmap: "Heatmap",
    "ivr-config": "IVR Config",
    "call-logs": "Call Logs",
    "call-stats": "Call Stats",
  };

  return (
    <nav aria-label="Breadcrumb" className="hidden sm:block">
      <ol className="flex items-center gap-1.5 text-sm">
        {segments.map((seg, i) => {
          const href = "/" + segments.slice(0, i + 1).join("/");
          const isLast = i === segments.length - 1;
          const label = labels[seg] || (seg.startsWith("IVC") ? seg : seg.charAt(0).toUpperCase() + seg.slice(1));
          return (
            <li key={href} className="flex items-center gap-1.5">
              {i > 0 && <ChevronRight className="h-4 w-4 text-[var(--color-border)]" />}
              {isLast ? (
                <span className="font-medium text-[var(--color-foreground)]">{label}</span>
              ) : (
                <Link href={href} className="text-[var(--color-muted-foreground)] hover:text-[var(--color-accent)] transition-colors">{label}</Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
