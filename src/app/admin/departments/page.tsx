"use client";

import { useState, useEffect } from "react";
import { Card, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";

interface DeptInfo {
  id: string;
  name: string;
  nameHi: string;
  code: string;
  staffCount: number;
  totalTickets: number;
  activeTickets: number;
  resolvedTickets: number;
  slaTargetHours: Record<string, number>;
}

export default function DepartmentSettingsPage() {
  const [departments, setDepartments] = useState<DeptInfo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/departments").then(r => r.json()).then(d => {
      if (d.success) setDepartments(d.data);
      setLoading(false);
    });
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="font-[family-name:var(--font-hind)] text-2xl font-bold">Department Settings</h1>

      <Card padding={false}>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[var(--color-border)] bg-[var(--color-muted)]">
                <th className="px-4 py-3 text-left font-medium">Department</th>
                <th className="px-4 py-3 text-left font-medium">Code</th>
                <th className="hidden sm:table-cell px-4 py-3 text-left font-medium">Staff</th>
                <th className="hidden md:table-cell px-4 py-3 text-left font-medium">Tickets</th>
                <th className="px-4 py-3 text-left font-medium">SLA (Critical)</th>
                <th className="px-4 py-3 text-left font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={6} className="px-4 py-12 text-center text-[var(--color-muted-foreground)]">Loading...</td></tr>
              ) : departments.map(dept => (
                <tr key={dept.id} className="border-b border-[var(--color-border)]">
                  <td className="px-4 py-3">
                    <div>
                      <p className="font-medium">{dept.name}</p>
                      <p className="text-xs text-[var(--color-muted-foreground)]">{dept.nameHi}</p>
                    </div>
                  </td>
                  <td className="px-4 py-3"><code className="rounded bg-[var(--color-muted)] px-1.5 py-0.5 text-xs">{dept.code}</code></td>
                  <td className="hidden sm:table-cell px-4 py-3">{dept.staffCount}</td>
                  <td className="hidden md:table-cell px-4 py-3">
                    <span className="text-green-600">{dept.resolvedTickets}</span> / {dept.totalTickets}
                  </td>
                  <td className="px-4 py-3">{dept.slaTargetHours?.critical || "-"}h</td>
                  <td className="px-4 py-3"><Badge variant="success">Active</Badge></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
