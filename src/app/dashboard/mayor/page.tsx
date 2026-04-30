"use client";

import { useState, useEffect } from "react";
import { Card, CardTitle, CardDescription } from "@/components/ui/Card";
import { StatCard } from "@/components/shared/StatCard";
import { BarChart3, Clock, CheckCircle, AlertTriangle, TrendingUp, Users, Activity } from "lucide-react";
import dynamic from "next/dynamic";
import type { OverviewStats, TrendPoint } from "@/types";

const TrendChart = dynamic(() => import("@/components/charts/TrendChart"), { 
  ssr: false, 
  loading: () => (
    <div className="h-[300px] rounded-xl bg-[var(--color-muted)] animate-shimmer" />
  )
});
const CategoryChart = dynamic(() => import("@/components/charts/CategoryChart"), { 
  ssr: false, 
  loading: () => (
    <div className="h-[300px] rounded-xl bg-[var(--color-muted)] animate-shimmer" />
  )
});
const DepartmentChart = dynamic(() => import("@/components/charts/DepartmentChart"), { 
  ssr: false, 
  loading: () => (
    <div className="h-[350px] rounded-xl bg-[var(--color-muted)] animate-shimmer" />
  )
});

export default function MayorDashboardPage() {
  const [stats, setStats] = useState<OverviewStats | null>(null);
  const [trends, setTrends] = useState<TrendPoint[]>([]);
  const [deptData, setDeptData] = useState<{ name: string; resolved: number; pending: number }[]>([]);

  useEffect(() => {
    fetch("/api/stats/overview").then(r => r.json()).then(d => { if (d.success) setStats(d.data); });
    fetch("/api/stats/trends?days=30").then(r => r.json()).then(d => { if (d.success) setTrends(d.data); });
    fetch("/api/departments").then(r => r.json()).then(d => {
      if (d.success) {
        setDeptData(d.data.map((dept: { name: string; resolvedTickets: number; activeTickets: number }) => ({
          name: dept.name.length > 12 ? dept.name.slice(0, 12) + "..." : dept.name,
          resolved: dept.resolvedTickets,
          pending: dept.activeTickets,
        })));
      }
    });
  }, []);

  if (!stats) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-[var(--color-accent)] border-t-transparent" />
          <p className="text-sm text-[var(--color-muted-foreground)]">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  const categoryData = Object.entries(stats.ticketsByCategory).map(([name, value]) => ({
    name: name.replace(/_/g, " ").replace(/^\w/, c => c.toUpperCase()),
    value,
  }));

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Page Header */}
      <div>
        <h1 className="font-[family-name:var(--font-hind)] text-3xl font-bold text-[var(--color-foreground)]">
          City Overview
        </h1>
        <p className="mt-1 text-[var(--color-muted-foreground)]">
          Real-time analytics and performance metrics
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard 
          title="Total Complaints" 
          value={stats.totalTickets.toLocaleString()} 
          icon={BarChart3} 
          trend={{ value: 12, isPositive: true }} 
          iconColor="text-[var(--color-accent)]"
          accentColor="var(--color-accent)"
        />
        <StatCard 
          title="Resolved" 
          value={stats.resolvedTickets.toLocaleString()} 
          icon={CheckCircle} 
          iconColor="text-[var(--color-success)]"
          accentColor="var(--color-success)"
        />
        <StatCard 
          title="Escalated" 
          value={stats.escalatedTickets} 
          icon={AlertTriangle} 
          iconColor="text-[var(--color-danger)]"
          accentColor="var(--color-danger)"
        />
        <StatCard 
          title="Avg Resolution" 
          value={`${stats.avgResolutionHours}h`} 
          icon={Clock} 
          iconColor="text-[var(--color-info)]"
          accentColor="var(--color-info)"
        />
      </div>

      {/* Charts Row 1 */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card glow>
          <div className="mb-6">
            <CardTitle>Complaint Trends</CardTitle>
            <CardDescription>Last 30 days performance</CardDescription>
          </div>
          <div className="h-[300px]">
            <TrendChart data={trends} />
          </div>
        </Card>
        <Card glow>
          <div className="mb-6">
            <CardTitle>Category Distribution</CardTitle>
            <CardDescription>Breakdown by complaint type</CardDescription>
          </div>
          <div className="h-[300px]">
            <CategoryChart data={categoryData} />
          </div>
        </Card>
      </div>

      {/* Department Comparison */}
      <Card glow>
        <div className="mb-6">
          <CardTitle>Department Comparison</CardTitle>
          <CardDescription>Performance across all departments</CardDescription>
        </div>
        <div className="h-[350px]">
          <DepartmentChart data={deptData} />
        </div>
      </Card>

      {/* Extra stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Card glow>
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--color-success)]/10">
              <Users className="h-6 w-6 text-[var(--color-success)]" />
            </div>
            <div>
              <p className="text-sm text-[var(--color-muted-foreground)]">Citizen Satisfaction</p>
              <div className="flex items-baseline gap-2">
                <p className="text-2xl font-bold text-[var(--color-foreground)]">{stats.citizenSatisfactionAvg}</p>
                <p className="text-sm text-[var(--color-muted-foreground)]">/5</p>
              </div>
            </div>
          </div>
        </Card>
        <Card glow>
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--color-info)]/10">
              <TrendingUp className="h-6 w-6 text-[var(--color-info)]" />
            </div>
            <div>
              <p className="text-sm text-[var(--color-muted-foreground)]">SLA Compliance</p>
              <div className="flex items-baseline gap-2">
                <p className="text-2xl font-bold text-[var(--color-foreground)]">{stats.slaCompliancePercent}</p>
                <p className="text-sm text-[var(--color-muted-foreground)]">%</p>
              </div>
            </div>
          </div>
        </Card>
        <Card glow>
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--color-warning)]/10">
              <Activity className="h-6 w-6 text-[var(--color-warning)]" />
            </div>
            <div>
              <p className="text-sm text-[var(--color-muted-foreground)]">Open Tickets</p>
              <p className="text-2xl font-bold text-[var(--color-foreground)]">{stats.openTickets}</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
