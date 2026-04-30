"use client";

import { useState, useEffect } from "react";
import { StatCard } from "@/components/shared/StatCard";
import { Card, CardTitle, CardDescription } from "@/components/ui/Card";
import { Users, Building2, BarChart3, Shield, ArrowRight, ChevronRight } from "lucide-react";
import Link from "next/link";
import type { OverviewStats } from "@/types";

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<OverviewStats | null>(null);
  const [userCount, setUserCount] = useState(0);
  const [deptCount, setDeptCount] = useState(0);

  useEffect(() => {
    fetch("/api/stats/overview").then(r => r.json()).then(d => { if (d.success) setStats(d.data); });
    fetch("/api/users").then(r => r.json()).then(d => { if (d.success) setUserCount(d.data.length); });
    fetch("/api/departments").then(r => r.json()).then(d => { if (d.success) setDeptCount(d.data.length); });
  }, []);

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="font-[family-name:var(--font-hind)] text-3xl font-bold text-[var(--color-foreground)]">System Overview</h1>
        <p className="mt-1 text-[var(--color-muted-foreground)]">Monitor and manage your platform</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard 
          title="Total Users" 
          value={userCount} 
          icon={Users} 
          trend={{ value: 5, isPositive: true }} 
          iconColor="text-[var(--color-accent)]"
          accentColor="var(--color-accent)"
        />
        <StatCard 
          title="Departments" 
          value={deptCount} 
          icon={Building2} 
          iconColor="text-purple-400"
          accentColor="#a855f7"
        />
        <StatCard 
          title="Total Complaints" 
          value={stats?.totalTickets || 0} 
          icon={BarChart3} 
          iconColor="text-[var(--color-info)]"
          accentColor="var(--color-info)"
        />
        <StatCard 
          title="System Uptime" 
          value="99.9%" 
          icon={Shield} 
          iconColor="text-[var(--color-success)]"
          accentColor="var(--color-success)"
        />
      </div>

      {/* Quick Links */}
      <div>
        <h2 className="font-[family-name:var(--font-hind)] text-lg font-semibold text-[var(--color-foreground)] mb-4">Quick Actions</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[
            { href: "/admin/users", title: "User Management", desc: "Manage staff accounts and roles", icon: Users, color: "text-[var(--color-info)]", bg: "bg-[var(--color-info)]/10" },
            { href: "/admin/departments", title: "Department Settings", desc: "Configure departments and SLAs", icon: Building2, color: "text-purple-400", bg: "bg-purple-500/10" },
            { href: "/admin/ivr-config", title: "IVR Configuration", desc: "Configure voice menu flows", icon: Shield, color: "text-[var(--color-success)]", bg: "bg-[var(--color-success)]/10" },
          ].map(link => (
            <Link key={link.href} href={link.href}>
              <Card className="group hover:border-[var(--color-accent)]/30 transition-all cursor-pointer h-full" glow>
                <div className="flex items-start gap-4">
                  <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${link.bg} ${link.color} transition-transform group-hover:scale-110`}>
                    <link.icon className="h-6 w-6" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-[var(--color-foreground)]">{link.title}</h3>
                    <p className="mt-1 text-sm text-[var(--color-muted-foreground)]">{link.desc}</p>
                  </div>
                  <ChevronRight className="h-5 w-5 text-[var(--color-muted-foreground)] opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      {/* Status Overview */}
      {stats && (
        <Card glow>
          <div className="mb-6">
            <CardTitle>Ticket Status Distribution</CardTitle>
            <CardDescription>Current breakdown by status</CardDescription>
          </div>
          <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-6">
            {Object.entries(stats.ticketsByStatus).map(([status, count]) => {
              const getStatusColor = (s: string) => {
                const colors: Record<string, string> = {
                  open: "border-[var(--color-info)]/30 bg-[var(--color-info)]/5",
                  assigned: "border-purple-500/30 bg-purple-500/5",
                  in_progress: "border-[var(--color-warning)]/30 bg-[var(--color-warning)]/5",
                  resolved: "border-[var(--color-success)]/30 bg-[var(--color-success)]/5",
                  closed: "border-[var(--color-border)] bg-[var(--color-muted)]",
                  escalated: "border-[var(--color-danger)]/30 bg-[var(--color-danger)]/5",
                };
                return colors[s] || colors.closed;
              };

              return (
                <div key={status} className={`rounded-xl border p-4 text-center transition-all hover:scale-105 ${getStatusColor(status)}`}>
                  <p className="text-2xl font-bold text-[var(--color-foreground)]">{count}</p>
                  <p className="text-xs text-[var(--color-muted-foreground)] capitalize mt-1">{status.replace(/_/g, " ")}</p>
                </div>
              );
            })}
          </div>
        </Card>
      )}
    </div>
  );
}
