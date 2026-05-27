"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth/context";
import { Card } from "@/components/ui/Card";
import { Badge, getStatusVariant, getPriorityVariant } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { StatCard } from "@/components/shared/StatCard";
import { Search, Filter, Ticket as TicketIcon, Clock, AlertTriangle, CheckCircle } from "lucide-react";
import Link from "next/link";
import type { Ticket } from "@/types";

const STATUS_LABELS: Record<string, string> = {
  open: "Open", assigned: "Assigned", in_progress: "In Progress",
  resolved: "Resolved", closed: "Closed", escalated: "Escalated",
};

export default function DepartmentDashboardPage() {
  const { user, token } = useAuth();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("");
  const [page, setPage] = useState(1);

  const fetchTickets = async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (user?.departmentId) params.set("departmentId", user.departmentId);
    if (statusFilter) params.set("status", statusFilter);
    if (priorityFilter) params.set("priority", priorityFilter);
    if (search) params.set("search", search);
    params.set("page", String(page));
    params.set("pageSize", "15");

    const res = await fetch(`/api/tickets?${params}`);
    const data = await res.json();
    if (data.success) {
      setTickets(data.data);
      setTotalItems(data.pagination?.totalItems || 0);
    }
    setLoading(false);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchTickets();
    }, 0);
    return () => clearTimeout(timer);
  }, [user, page, statusFilter, priorityFilter]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchTickets();
  };

  const openCount = tickets.filter(t => t.status === "open").length;
  const inProgressCount = tickets.filter(t => t.status === "in_progress" || t.status === "assigned").length;
  const escalatedCount = tickets.filter(t => t.status === "escalated").length;

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Total Tickets" value={totalItems} icon={TicketIcon} />
        <StatCard title="Open" value={openCount} icon={Clock} iconColor="text-blue-600" />
        <StatCard title="In Progress" value={inProgressCount} icon={CheckCircle} iconColor="text-yellow-600" />
        <StatCard title="Escalated" value={escalatedCount} icon={AlertTriangle} iconColor="text-red-600" />
      </div>

      {/* Filters */}
      <Card>
        <div className="flex flex-wrap items-end gap-3">
          <form onSubmit={handleSearch} className="flex flex-1 gap-2 min-w-[200px]">
            <Input placeholder="Search tickets..." value={search} onChange={e => setSearch(e.target.value)} className="flex-1" />
            <Button type="submit" size="md"><Search className="h-4 w-4" /></Button>
          </form>
          <select value={statusFilter} onChange={e => { setStatusFilter(e.target.value); setPage(1); }}
            className="rounded-lg border border-[var(--color-border)] px-3 py-2 text-sm">
            <option value="">All Status</option>
            {Object.entries(STATUS_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
          </select>
          <select value={priorityFilter} onChange={e => { setPriorityFilter(e.target.value); setPage(1); }}
            className="rounded-lg border border-[var(--color-border)] px-3 py-2 text-sm">
            <option value="">All Priority</option>
            <option value="critical">Critical</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>
      </Card>

      {/* Tickets Table */}
      <Card padding={false}>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[var(--color-border)] bg-[var(--color-muted)]">
                <th className="px-4 py-3 text-left font-medium text-[var(--color-muted-foreground)]">ID</th>
                <th className="px-4 py-3 text-left font-medium text-[var(--color-muted-foreground)]">Category</th>
                <th className="hidden sm:table-cell px-4 py-3 text-left font-medium text-[var(--color-muted-foreground)]">Ward</th>
                <th className="px-4 py-3 text-left font-medium text-[var(--color-muted-foreground)]">Priority</th>
                <th className="px-4 py-3 text-left font-medium text-[var(--color-muted-foreground)]">Status</th>
                <th className="hidden md:table-cell px-4 py-3 text-left font-medium text-[var(--color-muted-foreground)]">Created</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={6} className="px-4 py-12 text-center text-[var(--color-muted-foreground)]">Loading tickets...</td></tr>
              ) : tickets.length === 0 ? (
                <tr><td colSpan={6} className="px-4 py-12 text-center text-[var(--color-muted-foreground)]">No tickets found</td></tr>
              ) : tickets.map(ticket => (
                <tr key={ticket.id} className="border-b border-[var(--color-border)] hover:bg-[var(--color-muted)]/50 transition-colors">
                  <td className="px-4 py-3">
                    <Link href={`/dashboard/department/tickets/${ticket.id}`} className="font-medium text-[var(--color-primary)] hover:underline">
                      {ticket.id}
                    </Link>
                  </td>
                  <td className="px-4 py-3 capitalize">{ticket.category.replace(/_/g, " ")}</td>
                  <td className="hidden sm:table-cell px-4 py-3">{ticket.wardName}</td>
                  <td className="px-4 py-3"><Badge variant={getPriorityVariant(ticket.priority)}>{ticket.priority}</Badge></td>
                  <td className="px-4 py-3"><Badge variant={getStatusVariant(ticket.status)}>{STATUS_LABELS[ticket.status]}</Badge></td>
                  <td className="hidden md:table-cell px-4 py-3 text-[var(--color-muted-foreground)]">
                    {new Date(ticket.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* Pagination */}
        {totalItems > 15 && (
          <div className="flex items-center justify-between border-t border-[var(--color-border)] px-4 py-3">
            <p className="text-sm text-[var(--color-muted-foreground)]">Showing {(page - 1) * 15 + 1}-{Math.min(page * 15, totalItems)} of {totalItems}</p>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage(p => p - 1)}>Previous</Button>
              <Button variant="outline" size="sm" disabled={page * 15 >= totalItems} onClick={() => setPage(p => p + 1)}>Next</Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
