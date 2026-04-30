"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth/context";
import { Card, CardTitle } from "@/components/ui/Card";
import { StatCard } from "@/components/shared/StatCard";
import { BarChart3, Clock, CheckCircle, TrendingUp } from "lucide-react";
import type { DepartmentStats } from "@/types";

export default function PerformancePage() {
  const { user } = useAuth();
  const [stats, setStats] = useState<DepartmentStats | null>(null);

  useEffect(() => {
    if (user?.departmentId) {
      fetch(`/api/stats/department/${user.departmentId}`)
        .then(r => r.json())
        .then(data => { if (data.success) setStats(data.data); });
    }
  }, [user]);

  if (!stats) return <div className="flex h-64 items-center justify-center"><div className="h-8 w-8 animate-spin rounded-full border-4 border-[var(--color-primary)] border-t-transparent" /></div>;

  return (
    <div className="space-y-6">
      <h1 className="font-[family-name:var(--font-hind)] text-2xl font-bold">Department Performance</h1>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="SLA Compliance" value={`${stats.slaCompliancePercent}%`} icon={CheckCircle} iconColor="text-green-600" />
        <StatCard title="Avg Resolution" value={`${stats.avgResolutionHours}h`} icon={Clock} iconColor="text-blue-600" />
        <StatCard title="Total Tickets" value={String(stats.totalTickets)} icon={BarChart3} />
        <StatCard title="Resolved" value={String(stats.resolvedTickets)} icon={TrendingUp} iconColor="text-green-600" />
      </div>

      <Card>
        <CardTitle>Performance Summary</CardTitle>
        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          <div className="rounded-lg bg-blue-50 p-4 text-center">
            <p className="text-2xl font-bold text-blue-700">{String(stats.openTickets)}</p>
            <p className="text-sm text-blue-600">Open Tickets</p>
          </div>
          <div className="rounded-lg bg-green-50 p-4 text-center">
            <p className="text-2xl font-bold text-green-700">{String(stats.resolvedTickets)}</p>
            <p className="text-sm text-green-600">Resolved</p>
          </div>
          <div className="rounded-lg bg-purple-50 p-4 text-center">
            <p className="text-2xl font-bold text-purple-700">{stats.slaCompliancePercent}%</p>
            <p className="text-sm text-purple-600">SLA Compliance</p>
          </div>
        </div>
      </Card>
    </div>
  );
}
