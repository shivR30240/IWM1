"use client";

import { useState, useEffect } from "react";
import { Card, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import dynamic from "next/dynamic";

const DepartmentChart = dynamic(() => import("@/components/charts/DepartmentChart"), { ssr: false, loading: () => <div className="h-[350px] animate-pulse bg-gray-100 rounded" /> });

interface DeptInfo {
  id: string;
  name: string;
  totalTickets: number;
  resolvedTickets: number;
  activeTickets: number;
  staffCount: number;
}

export default function DepartmentsComparisonPage() {
  const [departments, setDepartments] = useState<DeptInfo[]>([]);

  useEffect(() => {
    fetch("/api/departments").then(r => r.json()).then(d => { if (d.success) setDepartments(d.data); });
  }, []);

  const chartData = departments.map(d => ({
    name: d.name.length > 15 ? d.name.slice(0, 15) + "..." : d.name,
    resolved: d.resolvedTickets,
    pending: d.activeTickets,
  }));

  return (
    <div className="space-y-6">
      <h1 className="font-[family-name:var(--font-hind)] text-2xl font-bold">Department Comparison</h1>

      <Card>
        <CardTitle>Resolved vs Pending by Department</CardTitle>
        <div className="mt-4 h-[350px]">
          <DepartmentChart data={chartData} />
        </div>
      </Card>

      <Card padding={false}>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[var(--color-border)] bg-[var(--color-muted)]">
                <th className="px-4 py-3 text-left font-medium">Department</th>
                <th className="px-4 py-3 text-left font-medium">Total</th>
                <th className="px-4 py-3 text-left font-medium">Resolved</th>
                <th className="px-4 py-3 text-left font-medium">Active</th>
                <th className="px-4 py-3 text-left font-medium">Staff</th>
                <th className="px-4 py-3 text-left font-medium">Resolution Rate</th>
              </tr>
            </thead>
            <tbody>
              {departments.map(dept => (
                <tr key={dept.id} className="border-b border-[var(--color-border)]">
                  <td className="px-4 py-3 font-medium">{dept.name}</td>
                  <td className="px-4 py-3">{dept.totalTickets}</td>
                  <td className="px-4 py-3 text-green-600 font-medium">{dept.resolvedTickets}</td>
                  <td className="px-4 py-3 text-orange-600 font-medium">{dept.activeTickets}</td>
                  <td className="px-4 py-3">{dept.staffCount}</td>
                  <td className="px-4 py-3">
                    <Badge variant={dept.totalTickets > 0 && (dept.resolvedTickets / dept.totalTickets) > 0.5 ? "success" : "warning"}>
                      {dept.totalTickets > 0 ? Math.round((dept.resolvedTickets / dept.totalTickets) * 100) : 0}%
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
