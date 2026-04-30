"use client";

import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Phone, MessageCircle, ChevronDown, HelpCircle } from "lucide-react";
import { useState } from "react";

const FAQ_DATA = [
  {
    category: "General",
    items: [
      { q: "What is Voice-Connect?", a: "Voice-Connect is a voice-first civic complaint platform for Indore. Citizens can call a toll-free helpline to report civic issues like water supply, road damage, sanitation, and more without needing to fill forms or download apps." },
      { q: "Is the helpline number toll-free?", a: "Yes, the helpline number 1800-XXX-XXXX is completely toll-free. You will not be charged for the call." },
      { q: "What languages are supported?", a: "The system supports Hindi, English, and Malwi on phone calls. The website is available in English and Hindi." },
    ],
  },
  {
    category: "Filing Complaints",
    items: [
      { q: "How do I file a complaint?", a: "Simply call 1800-XXX-XXXX and describe your issue after the greeting. Mention the location clearly. You will receive a Ticket ID via SMS." },
      { q: "What types of issues can I report?", a: "You can report water supply issues, road damage, drainage/sewer problems, electricity outages, street light failures, garbage collection, sanitation, park maintenance, and more." },
      { q: "Can I file a complaint without calling?", a: "The primary channel is voice call. However, you can also reach us via WhatsApp or visit this website to check status." },
      { q: "Do I need to register or create an account?", a: "No registration is needed for citizens. Just call and speak your complaint." },
    ],
  },
  {
    category: "Tracking & Status",
    items: [
      { q: "How do I check my complaint status?", a: "Go to the 'Check Status' page on this website and enter your Ticket ID. You can also get updates via SMS and WhatsApp." },
      { q: "What do the different statuses mean?", a: "Open: Complaint received. Assigned: Sent to the relevant department. In Progress: Field staff working on it. Resolved: Issue fixed. Closed: Confirmed resolved after verification." },
      { q: "How long does it take to resolve a complaint?", a: "Resolution time depends on the issue type and severity. Critical issues like water supply are prioritized (target: 4-12 hours). Average resolution time is under 48 hours." },
      { q: "What happens if my complaint is not resolved on time?", a: "The system automatically escalates overdue complaints to senior officials. You can also call back to request escalation." },
    ],
  },
  {
    category: "Technical",
    items: [
      { q: "What if I don't receive an SMS with my Ticket ID?", a: "Please wait a few minutes. If you still don't receive it, call back and our operator can look up your complaint by phone number." },
      { q: "Is my personal information safe?", a: "Yes. We follow strict data protection guidelines. Your phone number and personal details are encrypted and only accessible to authorized officials handling your complaint." },
    ],
  },
];

export default function FAQsPage() {
  const [openIndex, setOpenIndex] = useState<string | null>(null);

  return (
    <>
      <Header />
      <main className="min-h-[calc(100vh-4rem)] bg-[var(--color-background)]">
        <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="inline-block rounded-full bg-[var(--color-info)]/10 px-4 py-1.5 text-sm font-medium text-[var(--color-info)] mb-4">
              Help Center
            </span>
            <h1 className="font-[family-name:var(--font-hind)] text-4xl font-bold text-[var(--color-foreground)] sm:text-5xl">FAQs & Support</h1>
            <p className="mt-4 text-[var(--color-muted-foreground)]">Find answers to commonly asked questions</p>
            <p className="text-sm text-[var(--color-muted-foreground)]">अक्सर पूछे जाने वाले प्रश्नों के उत्तर</p>
          </div>

          {FAQ_DATA.map(section => (
            <div key={section.category} className="mb-8">
              <h2 className="mb-4 font-[family-name:var(--font-hind)] text-lg font-semibold text-[var(--color-accent)] flex items-center gap-2">
                <HelpCircle className="h-5 w-5" />
                {section.category}
              </h2>
              <div className="space-y-2">
                {section.items.map((item, i) => {
                  const key = `${section.category}-${i}`;
                  const isOpen = openIndex === key;
                  return (
                    <div key={key} className="rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] overflow-hidden">
                      <button
                        onClick={() => setOpenIndex(isOpen ? null : key)}
                        className="flex w-full items-center justify-between px-5 py-4 text-left text-sm font-medium text-[var(--color-foreground)] hover:bg-[var(--color-muted)]/50 transition-colors cursor-pointer"
                        aria-expanded={isOpen}
                      >
                        {item.q}
                        <ChevronDown className={`h-4 w-4 shrink-0 text-[var(--color-muted-foreground)] transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
                      </button>
                      {isOpen && (
                        <div className="border-t border-[var(--color-border)] px-5 py-4 text-sm text-[var(--color-muted-foreground)] leading-relaxed bg-[var(--color-muted)]/30">
                          {item.a}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}

          {/* Still need help */}
          <Card className="mt-12 text-center" glow>
            <h2 className="font-[family-name:var(--font-hind)] text-xl font-bold text-[var(--color-foreground)]">Still need help?</h2>
            <p className="mt-2 text-[var(--color-muted-foreground)]">Reach out to us through any of these channels</p>
            <div className="mt-6 flex flex-wrap justify-center gap-4">
              <a href="tel:1800XXXXXXX">
                <Button size="lg">
                  <Phone className="h-5 w-5" /> Call: 1800-XXX-XXXX
                </Button>
              </a>
              <a href="https://wa.me/911800XXXXXXX?text=Hi%2C%20I%20need%20help%20with%20my%20complaint" target="_blank" rel="noopener noreferrer">
                <Button size="lg" variant="secondary">
                  <MessageCircle className="h-5 w-5" /> WhatsApp Us
                </Button>
              </a>
            </div>
          </Card>
        </div>
      </main>
      <Footer />
    </>
  );
}
