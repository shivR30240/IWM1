"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardTitle } from "@/components/ui/Card";
import { Badge, getStatusVariant } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { ArrowLeft, MapPin, Navigation, Camera, CheckCircle, Clock } from "lucide-react";
import type { Ticket } from "@/types";

const STATUS_LABELS: Record<string, string> = {
  open: "Open", assigned: "Assigned", in_progress: "In Progress",
  resolved: "Resolved", closed: "Closed", escalated: "Escalated",
};

export default function TaskDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [loading, setLoading] = useState(true);
  const [checkedIn, setCheckedIn] = useState(false);

  useEffect(() => {
    fetch(`/api/tickets/${params.id}`)
      .then(r => r.json())
      .then(data => { if (data.success) setTicket(data.data); setLoading(false); });
  }, [params.id]);

  const updateStatus = async (newStatus: string) => {
    if (!ticket) return;
    const res = await fetch(`/api/tickets/${ticket.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus, changedBy: "field_staff" }),
    });
    const data = await res.json();
    if (data.success) setTicket(data.data);
  };

  if (loading) return <div className="flex h-64 items-center justify-center"><div className="h-6 w-6 animate-spin rounded-full border-3 border-[var(--color-primary)] border-t-transparent" /></div>;
  if (!ticket) return <div className="text-center py-12"><p>Task not found</p></div>;

  return (
    <div className="space-y-4 max-w-lg mx-auto">
      <button onClick={() => router.back()} className="flex items-center gap-1 text-sm text-[var(--color-muted-foreground)]">
        <ArrowLeft className="h-4 w-4" /> Back
      </button>

      {/* Header */}
      <Card>
        <div className="flex items-start justify-between">
          <div>
            <p className="text-lg font-bold">{ticket.id}</p>
            <p className="text-sm capitalize text-[var(--color-muted-foreground)]">{ticket.category.replace(/_/g, " ")}</p>
          </div>
          <Badge variant={getStatusVariant(ticket.status)}>{STATUS_LABELS[ticket.status]}</Badge>
        </div>
      </Card>

      {/* Status Buttons */}
      <div className="grid grid-cols-3 gap-2">
        <Button
          size="lg"
          className={`${ticket.status === "assigned" ? "bg-blue-600 hover:bg-blue-700" : "bg-blue-100 text-blue-600"}`}
          onClick={() => updateStatus("assigned")}
        >
          En Route
        </Button>
        <Button
          size="lg"
          className={`${ticket.status === "in_progress" ? "bg-orange-500 hover:bg-orange-600 text-white" : "bg-orange-100 text-orange-600"}`}
          onClick={() => updateStatus("in_progress")}
        >
          On Site
        </Button>
        <Button
          size="lg"
          className={`${ticket.status === "resolved" ? "bg-green-600 hover:bg-green-700 text-white" : "bg-green-100 text-green-600"}`}
          onClick={() => updateStatus("resolved")}
        >
          Done
        </Button>
      </div>

      {/* Location */}
      <Card>
        <div className="flex items-start gap-3">
          <MapPin className="h-5 w-5 text-[var(--color-primary)] mt-0.5 shrink-0" />
          <div className="flex-1">
            <p className="font-medium">{ticket.wardName}</p>
            <p className="text-sm text-[var(--color-muted-foreground)]">{ticket.address}</p>
          </div>
        </div>
        <a
          href={`https://www.google.com/maps/dir/?api=1&destination=${ticket.latitude},${ticket.longitude}`}
          target="_blank" rel="noopener noreferrer"
          className="mt-3 flex items-center justify-center gap-2 rounded-lg bg-[var(--color-primary)] px-4 py-2.5 text-sm font-medium text-white hover:bg-[var(--color-primary-dark)] transition-colors"
        >
          <Navigation className="h-4 w-4" /> Navigate to Location
        </a>
      </Card>

      {/* Description */}
      <Card>
        <CardTitle>Description</CardTitle>
        <p className="mt-2 text-sm">{ticket.description}</p>
        <p className="mt-1 text-sm text-[var(--color-muted-foreground)] italic">{ticket.descriptionHi}</p>
      </Card>

      {/* Check In/Out */}
      <Card>
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium">{checkedIn ? "Checked In" : "Check In"}</p>
            <p className="text-xs text-[var(--color-muted-foreground)]">{checkedIn ? `at ${new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}` : "Tap to record your arrival"}</p>
          </div>
          <Button variant={checkedIn ? "secondary" : "primary"} size="sm" onClick={() => setCheckedIn(!checkedIn)}>
            {checkedIn ? <><CheckCircle className="h-4 w-4" /> Checked In</> : <><Clock className="h-4 w-4" /> Check In</>}
          </Button>
        </div>
      </Card>

      {/* Photo Upload Placeholder */}
      <Card>
        <CardTitle>Photos</CardTitle>
        <button className="mt-3 flex w-full items-center justify-center gap-2 rounded-lg border-2 border-dashed border-[var(--color-border)] py-6 text-sm text-[var(--color-muted-foreground)] hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] transition-colors cursor-pointer">
          <Camera className="h-5 w-5" /> Upload Photo
        </button>
      </Card>

      {/* Timeline */}
      <Card>
        <CardTitle>History</CardTitle>
        <div className="mt-3 space-y-3">
          {ticket.statusHistory.map((entry, i) => (
            <div key={i} className="flex gap-3">
              <CheckCircle className="h-4 w-4 mt-0.5 text-[var(--color-primary)] shrink-0" />
              <div>
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
  );
}
