"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth/context";
import { Badge, getStatusVariant, getPriorityVariant } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { MapPin, Clock, AlertTriangle } from "lucide-react";
import Link from "next/link";
import type { Ticket } from "@/types";

const STATUS_LABELS: Record<string, string> = {
  open: "Open", assigned: "Assigned", in_progress: "In Progress",
  resolved: "Resolved", closed: "Closed", escalated: "Escalated",
};

export default function FieldDashboardPage() {
  const { user } = useAuth();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetch(`/api/tickets?assignedTo=${user.id}&pageSize=50`)
        .then(r => r.json())
        .then(data => {
          if (data.success) setTickets(data.data);
          setLoading(false);
        });
    }
  }, [user]);

  // If no tickets assigned to user, fetch department tickets instead
  useEffect(() => {
    if (!loading && tickets.length === 0 && user?.departmentId) {
      fetch(`/api/tickets?departmentId=${user.departmentId}&pageSize=20`)
        .then(r => r.json())
        .then(data => { if (data.success) setTickets(data.data); });
    }
  }, [loading, tickets.length, user]);

  const filteredTickets = filter === "all" ? tickets
    : filter === "pending" ? tickets.filter(t => t.status === "open" || t.status === "assigned")
    : filter === "in_progress" ? tickets.filter(t => t.status === "in_progress")
    : tickets.filter(t => t.status === "resolved" || t.status === "closed");

  const urgentCount = tickets.filter(t => t.priority === "critical" || t.priority === "high").length;
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  return (
    <div className="space-y-4 max-w-lg mx-auto">
      {/* Greeting */}
      <div>
        <h1 className="font-[family-name:var(--font-hind)] text-xl font-bold">
          {greeting}, {user?.name.split(" ")[0]}!
        </h1>
        <p className="text-sm text-[var(--color-muted-foreground)]">
          You have {tickets.length} tasks{urgentCount > 0 && <>, <span className="text-[var(--color-danger)] font-medium">{urgentCount} urgent</span></>}
        </p>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-1 rounded-lg bg-white p-1 border border-[var(--color-border)]">
        {["all", "pending", "in_progress", "completed"].map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={`flex-1 rounded-md px-3 py-2 text-xs font-medium transition-colors cursor-pointer ${filter === f ? "bg-[var(--color-primary)] text-white" : "text-[var(--color-muted-foreground)] hover:bg-[var(--color-muted)]"}`}>
            {f === "all" ? "All" : f === "pending" ? "Pending" : f === "in_progress" ? "Active" : "Done"}
          </button>
        ))}
      </div>

      {/* Task List */}
      {loading ? (
        <div className="flex h-40 items-center justify-center"><div className="h-6 w-6 animate-spin rounded-full border-3 border-[var(--color-primary)] border-t-transparent" /></div>
      ) : filteredTickets.length === 0 ? (
        <Card className="text-center py-8">
          <p className="text-[var(--color-muted-foreground)]">No tasks found</p>
        </Card>
      ) : (
        <div className="space-y-3">
          {filteredTickets.map(ticket => (
            <Link key={ticket.id} href={`/dashboard/field/tasks/${ticket.id}`}>
              <Card className="hover:shadow-md transition-shadow cursor-pointer mb-3">
                <div className="flex gap-3">
                  {/* Priority strip */}
                  <div className={`w-1 self-stretch rounded-full ${ticket.priority === "critical" ? "bg-red-500" : ticket.priority === "high" ? "bg-orange-500" : ticket.priority === "medium" ? "bg-yellow-500" : "bg-green-500"}`} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="text-sm font-bold text-[var(--color-foreground)]">{ticket.id}</p>
                        <p className="text-xs capitalize text-[var(--color-muted-foreground)]">{ticket.category.replace(/_/g, " ")}</p>
                      </div>
                      <Badge variant={getStatusVariant(ticket.status)} className="shrink-0">{STATUS_LABELS[ticket.status]}</Badge>
                    </div>
                    <div className="mt-2 flex items-center gap-3 text-xs text-[var(--color-muted-foreground)]">
                      <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{ticket.wardName}</span>
                      <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{new Date(ticket.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}</span>
                      {ticket.slaBreached && <span className="flex items-center gap-1 text-red-500"><AlertTriangle className="h-3 w-3" />SLA</span>}
                    </div>
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
