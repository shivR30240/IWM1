"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils/cn";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import type { LucideIcon } from "lucide-react";

export interface SidebarItem {
  href: string;
  label: string;
  icon: LucideIcon;
  badge?: number;
}

interface SidebarProps {
  items: SidebarItem[];
  title: string;
}

export function Sidebar({ items, title }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();

  return (
    <aside className={cn(
      "hidden lg:flex flex-col border-r border-[var(--color-border)] bg-[var(--color-card)] transition-all duration-300",
      collapsed ? "w-[72px]" : "w-64"
    )}>
      {/* Header */}
      <div className={cn(
        "flex h-16 items-center border-b border-[var(--color-border)] px-4",
        collapsed ? "justify-center" : "justify-between"
      )}>
        {!collapsed && (
          <span className="text-sm font-semibold text-[var(--color-foreground)] truncate">{title}</span>
        )}
        <button 
          onClick={() => setCollapsed(!collapsed)} 
          className={cn(
            "flex h-8 w-8 items-center justify-center rounded-lg",
            "text-[var(--color-muted-foreground)] transition-colors",
            "hover:bg-[var(--color-muted)] hover:text-[var(--color-foreground)]"
          )}
          aria-label="Toggle sidebar"
        >
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-3" aria-label="Dashboard navigation">
        <div className="space-y-1">
          {items.map(item => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <Link 
                key={item.href} 
                href={item.href}
                className={cn(
                  "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200",
                  isActive
                    ? "bg-[var(--color-accent)]/10 text-[var(--color-accent)]"
                    : "text-[var(--color-muted-foreground)] hover:bg-[var(--color-muted)] hover:text-[var(--color-foreground)]",
                  collapsed && "justify-center px-2"
                )}
              >
                <item.icon className={cn(
                  "h-5 w-5 shrink-0 transition-colors",
                  isActive && "text-[var(--color-accent)]"
                )} />
                {!collapsed && (
                  <>
                    <span className="truncate">{item.label}</span>
                    {item.badge !== undefined && item.badge > 0 && (
                      <span className={cn(
                        "ml-auto flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-[10px] font-bold",
                        "bg-[var(--color-danger)] text-white"
                      )}>
                        {item.badge > 99 ? "99+" : item.badge}
                      </span>
                    )}
                  </>
                )}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Footer */}
      {!collapsed && (
        <div className="border-t border-[var(--color-border)] p-4">
          <div className="rounded-xl bg-[var(--color-muted)] p-3">
            <p className="text-xs font-medium text-[var(--color-muted-foreground)]">Need help?</p>
            <p className="mt-1 text-xs text-[var(--color-muted-foreground)]">
              <a href="tel:1800XXXXXXX" className="text-[var(--color-accent)] hover:underline">1800-XXX-XXXX</a>
            </p>
          </div>
        </div>
      )}
    </aside>
  );
}
