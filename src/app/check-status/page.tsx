"use client";

import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Badge, getStatusVariant, getPriorityVariant } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { Search, CheckCircle, Circle, AlertTriangle, MapPin, Building2, Calendar, Clock } from "lucide-react";
import { useState, useEffect } from "react";

interface TicketResult {
  id: string;
  category: string;
  status: string;
  priority: string;
  wardName: string;
  departmentId: string;
  createdAt: string;
  updatedAt: string;
  resolvedAt: string | null;
  statusHistory: { toStatus: string; changedAt: string; note: string }[];
}

const STATUS_ORDER = ["open", "assigned", "in_progress", "resolved", "closed"];
const STATUS_LABELS: Record<string, string> = {
  open: "Received",
  assigned: "Assigned",
  in_progress: "In Progress",
  resolved: "Resolved",
  closed: "Closed",
  escalated: "Escalated",
};

export default function CheckStatusPage() {
  const [ticketId, setTicketId] = useState("");
  const [captchaA, setCaptchaA] = useState(0);
  const [captchaB, setCaptchaB] = useState(0);
  const [captchaAnswer, setCaptchaAnswer] = useState("");
  const [result, setResult] = useState<TicketResult | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setCaptchaA(Math.floor(Math.random() * 9) + 1);
      setCaptchaB(Math.floor(Math.random() * 9) + 1);
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setResult(null);

    if (!ticketId.trim()) { setError("Please enter a Ticket ID"); return; }
    if (parseInt(captchaAnswer) !== captchaA + captchaB) { setError("Incorrect answer. Please solve the math problem."); return; }

    setLoading(true);
    try {
      const res = await fetch(`/api/tickets/status/${ticketId.trim().toUpperCase()}`);
      const data = await res.json();
      if (data.success) {
        setResult(data.data);
      } else {
        setError(data.error?.message || "Ticket not found. Please check the ID and try again.");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const getStatusIndex = (status: string) => STATUS_ORDER.indexOf(status);

  return (
    <>
      <Header />
      <main className="min-h-[calc(100vh-4rem)] bg-[var(--color-background)]">
        <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-12">
            <span className="inline-block rounded-full bg-[var(--color-accent)]/10 px-4 py-1.5 text-sm font-medium text-[var(--color-accent)] mb-4">
              Track Your Complaint
            </span>
            <h1 className="font-[family-name:var(--font-hind)] text-4xl font-bold text-[var(--color-foreground)] sm:text-5xl">
              Check Ticket Status
            </h1>
            <p className="mt-4 text-[var(--color-muted-foreground)]">Enter your Ticket ID to track your complaint</p>
            <p className="text-sm text-[var(--color-muted-foreground)]">अपनी शिकायत ट्रैक करने के लिए अपना टिकट आईडी दर्ज करें</p>
          </div>

          {/* Search Form */}
          <Card className="mb-8" glow>
            <form onSubmit={handleSearch} className="space-y-6">
              <Input
                label="Ticket ID"
                placeholder="e.g., IVC-2024-00001"
                value={ticketId}
                onChange={e => setTicketId(e.target.value)}
              />
              <div className="flex flex-col sm:flex-row items-end gap-4">
                <div className="w-full sm:w-auto">
                  <Input
                    label={`Verify: What is ${captchaA} + ${captchaB}?`}
                    placeholder="Your answer"
                    type="number"
                    value={captchaAnswer}
                    onChange={e => setCaptchaAnswer(e.target.value)}
                    className="sm:w-[180px]"
                  />
                </div>
                <Button type="submit" disabled={loading} size="lg" className="w-full sm:w-auto">
                  {loading ? (
                    <>
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-[var(--color-primary)] border-t-transparent" />
                      Searching...
                    </>
                  ) : (
                    <>
                      <Search className="h-4 w-4" />
                      Search
                    </>
                  )}
                </Button>
              </div>
              {error && (
                <div className="flex items-center gap-3 rounded-xl bg-[var(--color-danger)]/10 border border-[var(--color-danger)]/20 px-4 py-3 text-sm text-[var(--color-danger)]">
                  <AlertTriangle className="h-5 w-5 shrink-0" />
                  {error}
                </div>
              )}
            </form>
          </Card>

          {/* Result */}
          {result && (
            <Card className="animate-fade-in" glow>
              <div className="space-y-8">
                {/* Ticket Header */}
                <div className="flex flex-wrap items-start justify-between gap-4 pb-6 border-b border-[var(--color-border)]">
                  <div>
                    <h2 className="text-2xl font-bold text-[var(--color-foreground)]">{result.id}</h2>
                    <p className="text-[var(--color-muted-foreground)] capitalize mt-1">{result.category.replace(/_/g, " ")}</p>
                  </div>
                  <div className="flex gap-2">
                    <Badge variant={getStatusVariant(result.status)} dot>
                      {STATUS_LABELS[result.status] || result.status}
                    </Badge>
                    <Badge variant={getPriorityVariant(result.priority)}>
                      {result.priority}
                    </Badge>
                  </div>
                </div>

                {/* Ticket Details */}
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="flex items-center gap-3 rounded-xl bg-[var(--color-muted)] p-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--color-border)]">
                      <MapPin className="h-5 w-5 text-[var(--color-accent)]" />
                    </div>
                    <div>
                      <p className="text-xs text-[var(--color-muted-foreground)]">Ward</p>
                      <p className="font-medium text-[var(--color-foreground)]">{result.wardName}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 rounded-xl bg-[var(--color-muted)] p-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--color-border)]">
                      <Building2 className="h-5 w-5 text-[var(--color-info)]" />
                    </div>
                    <div>
                      <p className="text-xs text-[var(--color-muted-foreground)]">Department</p>
                      <p className="font-medium text-[var(--color-foreground)]">{result.departmentId}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 rounded-xl bg-[var(--color-muted)] p-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--color-border)]">
                      <Calendar className="h-5 w-5 text-[var(--color-success)]" />
                    </div>
                    <div>
                      <p className="text-xs text-[var(--color-muted-foreground)]">Filed On</p>
                      <p className="font-medium text-[var(--color-foreground)]">
                        {new Date(result.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 rounded-xl bg-[var(--color-muted)] p-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--color-border)]">
                      <Clock className="h-5 w-5 text-[var(--color-warning)]" />
                    </div>
                    <div>
                      <p className="text-xs text-[var(--color-muted-foreground)]">Last Updated</p>
                      <p className="font-medium text-[var(--color-foreground)]">
                        {new Date(result.updatedAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Status Timeline */}
                <div>
                  <h3 className="text-lg font-semibold text-[var(--color-foreground)] mb-6">Progress Timeline</h3>
                  <div className="relative">
                    {STATUS_ORDER.map((status, i) => {
                      const currentIndex = getStatusIndex(result.status === "escalated" ? "in_progress" : result.status);
                      const isCompleted = i <= currentIndex && i < STATUS_ORDER.length;
                      const isCurrent = i === currentIndex;
                      const historyEntry = result.statusHistory.find(h => h.toStatus === status);

                      return (
                        <div key={status} className="flex gap-4">
                          <div className="flex flex-col items-center">
                            <div className={`flex h-8 w-8 items-center justify-center rounded-full transition-all ${
                              isCompleted 
                                ? isCurrent 
                                  ? "bg-[var(--color-accent)] text-[var(--color-primary)]" 
                                  : "bg-[var(--color-success)] text-white"
                                : "bg-[var(--color-muted)] text-[var(--color-muted-foreground)]"
                            }`}>
                              {isCompleted ? (
                                <CheckCircle className="h-5 w-5" />
                              ) : (
                                <Circle className="h-5 w-5" />
                              )}
                            </div>
                            {i < STATUS_ORDER.length - 1 && (
                              <div className={`w-0.5 h-12 ${isCompleted && i < currentIndex ? "bg-[var(--color-success)]" : "bg-[var(--color-border)]"}`} />
                            )}
                          </div>
                          <div className="pb-8">
                            <div className="flex items-center gap-2">
                              <p className={`font-medium ${isCompleted ? "text-[var(--color-foreground)]" : "text-[var(--color-muted-foreground)]"}`}>
                                {STATUS_LABELS[status]}
                              </p>
                              {isCurrent && result.status === "escalated" && (
                                <Badge variant="danger">Escalated</Badge>
                              )}
                            </div>
                            {historyEntry && (
                              <p className="text-sm text-[var(--color-muted-foreground)] mt-1">
                                {new Date(historyEntry.changedAt).toLocaleString("en-IN", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}
                                {historyEntry.note && <span className="block mt-0.5">{historyEntry.note}</span>}
                              </p>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </Card>
          )}

          {/* Help text */}
          <div className="mt-12 text-center">
            <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-card)] p-6">
              <p className="text-[var(--color-muted-foreground)]">
                {"Don't have a Ticket ID? Call "}
                <a href="tel:1800XXXXXXX" className="font-semibold text-[var(--color-accent)] hover:underline">1800-XXX-XXXX</a>
                {" to file a complaint."}
              </p>
              <p className="mt-2 text-sm text-[var(--color-muted-foreground)]">
                {"टिकट आईडी नहीं है? शिकायत दर्ज करने के लिए "}
                <span className="font-semibold text-[var(--color-accent)]">1800-XXX-XXXX</span>
                {" पर कॉल करें।"}
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
