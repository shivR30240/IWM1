"use client";

import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Phone, Mail, MapPin, Clock, MessageCircle, Send, CheckCircle } from "lucide-react";
import { useState } from "react";

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", phone: "", subject: "general", message: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 5000);
    setForm({ name: "", email: "", phone: "", subject: "general", message: "" });
  };

  return (
    <>
      <Header />
      <main className="min-h-[calc(100vh-4rem)] bg-[var(--color-background)]">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="inline-block rounded-full bg-[var(--color-accent)]/10 px-4 py-1.5 text-sm font-medium text-[var(--color-accent)] mb-4">
              Get In Touch
            </span>
            <h1 className="font-[family-name:var(--font-hind)] text-4xl font-bold text-[var(--color-foreground)] sm:text-5xl">Contact Us</h1>
            <p className="mt-4 text-[var(--color-muted-foreground)]">Get in touch with the Voice-Connect team</p>
          </div>

          <div className="grid gap-8 lg:grid-cols-5">
            {/* Form */}
            <div className="lg:col-span-3">
              <Card glow>
                {submitted ? (
                  <div className="py-12 text-center">
                    <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-[var(--color-success)]/10">
                      <CheckCircle className="h-8 w-8 text-[var(--color-success)]" />
                    </div>
                    <h3 className="text-xl font-bold text-[var(--color-foreground)]">Message Sent!</h3>
                    <p className="mt-2 text-[var(--color-muted-foreground)]">{"Thank you for reaching out. We'll get back to you soon."}</p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="grid gap-5 sm:grid-cols-2">
                      <Input label="Name *" required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Your full name" />
                      <Input label="Email *" type="email" required value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="your@email.com" />
                    </div>
                    <div className="grid gap-5 sm:grid-cols-2">
                      <Input label="Phone" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} placeholder="+91-XXXXX-XXXXX" />
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-[var(--color-foreground)]">Subject</label>
                        <select 
                          value={form.subject} 
                          onChange={e => setForm({ ...form, subject: e.target.value })}
                          className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-muted)] px-4 py-3 text-sm text-[var(--color-foreground)] focus:border-[var(--color-accent)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]/20 transition-all"
                        >
                          <option value="general">General Inquiry</option>
                          <option value="feedback">Feedback</option>
                          <option value="technical">Technical Issue</option>
                          <option value="other">Other</option>
                        </select>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-[var(--color-foreground)]">Message *</label>
                      <textarea 
                        required 
                        value={form.message} 
                        onChange={e => setForm({ ...form, message: e.target.value })}
                        className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-muted)] px-4 py-3 text-sm text-[var(--color-foreground)] focus:border-[var(--color-accent)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]/20 min-h-[140px] transition-all placeholder:text-[var(--color-muted-foreground)]"
                        placeholder="Describe your inquiry..." 
                      />
                    </div>
                    <Button type="submit" size="lg">
                      <Send className="h-4 w-4" /> Send Message
                    </Button>
                  </form>
                )}
              </Card>
            </div>

            {/* Contact Info */}
            <div className="space-y-4 lg:col-span-2">
              <Card glow>
                <h3 className="mb-6 font-[family-name:var(--font-hind)] text-lg font-semibold text-[var(--color-foreground)]">Contact Information</h3>
                <ul className="space-y-5">
                  {[
                    { icon: Phone, label: "Helpline", value: "1800-XXX-XXXX (Toll-free)", color: "text-[var(--color-accent)]", bg: "bg-[var(--color-accent)]/10" },
                    { icon: Mail, label: "Email", value: "support@voiceconnect.indore.gov.in", color: "text-[var(--color-info)]", bg: "bg-[var(--color-info)]/10" },
                    { icon: MapPin, label: "Address", value: "Indore Municipal Corporation, M.G. Road, Indore, M.P. 452001", color: "text-[var(--color-warning)]", bg: "bg-[var(--color-warning)]/10" },
                    { icon: Clock, label: "Office Hours", value: "Mon - Sat: 9:00 AM - 6:00 PM | Helpline: 24/7", color: "text-[var(--color-success)]", bg: "bg-[var(--color-success)]/10" },
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-4">
                      <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${item.bg}`}>
                        <item.icon className={`h-5 w-5 ${item.color}`} />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-[var(--color-foreground)]">{item.label}</p>
                        <p className="text-sm text-[var(--color-muted-foreground)]">{item.value}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </Card>

              <Card glow>
                <h3 className="mb-4 font-[family-name:var(--font-hind)] text-lg font-semibold text-[var(--color-foreground)]">Connect With Us</h3>
                <a 
                  href="https://wa.me/911800XXXXXXX" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 rounded-xl bg-green-500/10 border border-green-500/20 p-4 text-green-500 transition-all hover:bg-green-500/20"
                >
                  <MessageCircle className="h-6 w-6" />
                  <div>
                    <p className="font-medium">WhatsApp</p>
                    <p className="text-sm opacity-80">Message us anytime</p>
                  </div>
                </a>
              </Card>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
