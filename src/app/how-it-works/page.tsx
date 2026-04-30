import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Phone, Mic, Ticket, Search, ArrowRight, CheckCircle } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

const STEPS = [
  {
    icon: Phone,
    title: "Call the Helpline",
    titleHi: "हेल्पलाइन पर कॉल करें",
    description: "Dial our toll-free number 1800-XXX-XXXX from any phone - landline or mobile. The helpline is available 24 hours a day, 7 days a week. No internet connection required.",
    descHi: "किसी भी फोन से हमारे टोल-फ्री नंबर 1800-XXX-XXXX पर कॉल करें। हेल्पलाइन 24/7 उपलब्ध है।",
  },
  {
    icon: Mic,
    title: "Speak Your Complaint",
    titleHi: "अपनी शिकायत बोलें",
    description: "After the greeting, simply describe your issue in your own words. Speak in Hindi, English, or Malwi - our system understands all three. Mention the location and problem clearly.",
    descHi: "अभिवादन के बाद, अपनी समस्या अपने शब्दों में बताएं। हिंदी, अंग्रेजी या मालवी में बोलें।",
  },
  {
    icon: Ticket,
    title: "Get Your Ticket ID",
    titleHi: "अपना टिकट आईडी प्राप्त करें",
    description: "Once your complaint is registered, you'll immediately receive an SMS with your unique Ticket ID (e.g., IVC-2024-00123). Save this number for tracking.",
    descHi: "शिकायत दर्ज होने के बाद, आपको तुरंत एक SMS से टिकट आईडी मिलेगी। ट्रैकिंग के लिए इसे सहेजें।",
  },
  {
    icon: Search,
    title: "Track Your Status",
    titleHi: "अपनी स्थिति ट्रैक करें",
    description: "Use your Ticket ID to check the status of your complaint anytime on this website, via WhatsApp, or by calling back. Get real-time updates on resolution progress.",
    descHi: "अपने टिकट आईडी से कभी भी वेबसाइट, WhatsApp या कॉल बैक से शिकायत की स्थिति जानें।",
  },
];

export default function HowItWorksPage() {
  return (
    <>
      <Header />
      <main className="min-h-[calc(100vh-4rem)] bg-[var(--color-background)]">
        <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="inline-block rounded-full bg-[var(--color-accent)]/10 px-4 py-1.5 text-sm font-medium text-[var(--color-accent)] mb-4">
              Getting Started
            </span>
            <h1 className="font-[family-name:var(--font-hind)] text-4xl font-bold text-[var(--color-foreground)] sm:text-5xl">How It Works</h1>
            <p className="mt-4 text-lg text-[var(--color-muted-foreground)]">Four simple steps to resolve your civic complaint</p>
            <p className="text-[var(--color-muted-foreground)]">चार सरल चरणों में आपकी नागरिक शिकायत का समाधान</p>
          </div>

          {/* Timeline */}
          <div className="relative">
            {/* Connecting line */}
            <div className="absolute left-8 top-0 bottom-0 w-px bg-gradient-to-b from-[var(--color-accent)] via-[var(--color-border)] to-[var(--color-border)] hidden sm:block" />

            <div className="space-y-8">
              {STEPS.map((step, i) => (
                <div key={i} className="group relative flex gap-6 sm:gap-8 rounded-2xl border border-[var(--color-border)] bg-[var(--color-card)] p-6 transition-all hover:border-[var(--color-accent)]/30">
                  {/* Step indicator */}
                  <div className="relative z-10 flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-[var(--color-muted)] text-[var(--color-accent)] transition-colors group-hover:bg-[var(--color-accent)]/10">
                    <step.icon className="h-7 w-7" />
                    <span className="absolute -top-2 -right-2 flex h-7 w-7 items-center justify-center rounded-full bg-[var(--color-accent)] text-sm font-bold text-[var(--color-primary)]">
                      {i + 1}
                    </span>
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <h3 className="font-[family-name:var(--font-hind)] text-xl font-semibold text-[var(--color-foreground)]">{step.title}</h3>
                    <p className="text-sm text-[var(--color-accent)] font-medium">{step.titleHi}</p>
                    <p className="mt-3 text-[var(--color-muted-foreground)] leading-relaxed">{step.description}</p>
                    <p className="mt-2 text-sm text-[var(--color-muted-foreground)] opacity-75">{step.descHi}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* What Happens Next */}
          <div className="mt-16 rounded-2xl border border-[var(--color-success)]/20 bg-[var(--color-success)]/5 p-8">
            <h2 className="font-[family-name:var(--font-hind)] text-xl font-bold text-[var(--color-success)] flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--color-success)]/10">
                <CheckCircle className="h-5 w-5" />
              </div>
              What Happens After You Call?
            </h2>
            <ul className="mt-6 space-y-4 text-[var(--color-foreground)]">
              {[
                "Your complaint is automatically categorized and routed to the correct department",
                "A field officer is assigned to address your issue",
                "You receive updates via SMS and WhatsApp as work progresses",
                "Once resolved, you can provide feedback on the service",
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-[var(--color-success)]" />
                  <span className="text-[var(--color-muted-foreground)]">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* CTA */}
          <div className="mt-16 text-center rounded-2xl border border-[var(--color-border)] bg-[var(--color-card)] p-10">
            <h2 className="font-[family-name:var(--font-hind)] text-2xl font-bold text-[var(--color-foreground)]">Ready to get started?</h2>
            <p className="mt-2 text-[var(--color-muted-foreground)]">Call us now or check the status of an existing complaint</p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <a href="tel:1800XXXXXXX">
                <Button size="lg"><Phone className="h-5 w-5" /> Call 1800-XXX-XXXX</Button>
              </a>
              <Link href="/check-status">
                <Button size="lg" variant="outline">Check Ticket Status <ArrowRight className="h-5 w-5" /></Button>
              </Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
