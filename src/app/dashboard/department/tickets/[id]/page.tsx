"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardTitle } from "@/components/ui/Card";
import { Badge, getStatusVariant, getPriorityVariant } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { ArrowLeft, MapPin, Clock, User, CheckCircle, Circle, AlertTriangle } from "lucide-react";
import type { Ticket } from "@/types";

const STATUS_LABELS: Record<string, string> = {
  open: "Open", assigned: "Assigned", in_progress: "In Progress",
  resolved: "Resolved", closed: "Closed", escalated: "Escalated",
};

export default function TicketDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/tickets/${params.id}`)
      .then(r => r.json())
      .then(data => {
        if (data.success) setTicket(data.data);
        setLoading(false);
      });
  }, [params.id]);

  const updateStatus = async (newStatus: string) => {
    if (!ticket) return;
    const res = await fetch(`/api/tickets/${ticket.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus, changedBy: "officer" }),
    });
    const data = await res.json();
    if (data.success) setTicket(data.data);
  };

  if (loading) return <div className="flex h-64 items-center justify-center"><div className="h-8 w-8 animate-spin rounded-full border-4 border-[var(--color-primary)] border-t-transparent" /></div>;
  if (!ticket) return <div className="text-center py-12"><p>Ticket not found</p><Button variant="outline" onClick={() => router.back()}>Go Back</Button></div>;

  return (
    <div className="space-y-6">
      <button onClick={() => router.back()} className="flex items-center gap-1 text-sm text-[var(--color-muted-foreground)] hover:text-[var(--color-foreground)]">
        <ArrowLeft className="h-4 w-4" /> Back to Tickets
      </button>

      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-[family-name:var(--font-hind)] text-2xl font-bold">{ticket.id}</h1>
          <p className="text-[var(--color-muted-foreground)] capitalize">{ticket.category.replace(/_/g, " ")} - {ticket.wardName}</p>
        </div>
        <div className="flex gap-2">
          <Badge variant={getStatusVariant(ticket.status)}>{STATUS_LABELS[ticket.status]}</Badge>
          <Badge variant={getPriorityVariant(ticket.priority)}>{ticket.priority}</Badge>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Content */}
        <div className="space-y-6 lg:col-span-2">
          <Card>
            <CardTitle>Complaint Description</CardTitle>
            <p className="mt-2 text-[var(--color-foreground)]">{ticket.description}</p>
            <p className="mt-2 text-sm text-[var(--color-muted-foreground)] italic">{ticket.descriptionHi}</p>
          </Card>

          {/* Timeline */}
          <Card>
            <CardTitle>Status Timeline</CardTitle>
            <div className="mt-4 space-y-0">
              {ticket.statusHistory.map((entry, i) => (
                <div key={i} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <CheckCircle className="h-5 w-5 text-[var(--color-primary)]" />
                    {i < ticket.statusHistory.length - 1 && <div className="w-0.5 h-6 bg-[var(--color-border)]" />}
                  </div>
                  <div className="pb-4">
                    <p className="text-sm font-medium">{entry.note}</p>
                    <p className="text-xs text-[var(--color-muted-foreground)]">
                      {new Date(entry.changedAt).toLocaleString("en-IN", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          <Card>
            <CardTitle>Details</CardTitle>
            <dl className="mt-3 space-y-3 text-sm">
              <div className="flex items-start gap-2">
                <User className="h-4 w-4 mt-0.5 text-[var(--color-muted-foreground)]" />
                <div><dt className="text-[var(--color-muted-foreground)]">Citizen</dt><dd className="font-medium">{ticket.citizenName}</dd></div>
              </div>
              <div className="flex items-start gap-2">
                <MapPin className="h-4 w-4 mt-0.5 text-[var(--color-muted-foreground)]" />
                <div><dt className="text-[var(--color-muted-foreground)]">Address</dt><dd className="font-medium">{ticket.address}</dd></div>
              </div>
              <div className="flex items-start gap-2">
                <Clock className="h-4 w-4 mt-0.5 text-[var(--color-muted-foreground)]" />
                <div><dt className="text-[var(--color-muted-foreground)]">Created</dt><dd className="font-medium">{new Date(ticket.createdAt).toLocaleString("en-IN")}</dd></div>
              </div>
              {ticket.slaBreached && (
                <div className="flex items-center gap-2 rounded-lg bg-red-50 px-3 py-2 text-red-700">
                  <AlertTriangle className="h-4 w-4" />
                  <span className="text-sm font-medium">SLA Breached</span>
                </div>
              )}
            </dl>
          </Card>

          {/* Actions */}
          <Card>
            <CardTitle>Quick Actions</CardTitle>
            <div className="mt-3 space-y-2">
              {ticket.status === "open" && <Button className="w-full" onClick={() => updateStatus("assigned")}>Assign Ticket</Button>}
              {ticket.status === "assigned" && <Button className="w-full" onClick={() => updateStatus("in_progress")}>Start Progress</Button>}
              {ticket.status === "in_progress" && <Button className="w-full" variant="secondary" onClick={() => updateStatus("resolved")}>Mark Resolved</Button>}
              {ticket.status === "resolved" && <Button className="w-full" onClick={() => updateStatus("closed")}>Close Ticket</Button>}
              {!["closed", "escalated", "resolved"].includes(ticket.status) && (
                <Button className="w-full" variant="danger" onClick={() => updateStatus("escalated")}>Escalate</Button>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
