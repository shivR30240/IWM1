import Link from "next/link";
import { Phone, Mail, MapPin, ExternalLink } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-[var(--color-border)] bg-[var(--color-background)]">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-4">
          {/* About */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[var(--color-accent)] to-[var(--color-accent-dark)]">
                <Phone className="h-5 w-5 text-[var(--color-primary)]" />
              </div>
              <span className="text-lg font-bold text-[var(--color-foreground)]">Voice-Connect</span>
            </div>
            <p className="text-sm text-[var(--color-muted-foreground)] leading-relaxed">
              A voice-first civic complaint platform for Indore. Report issues by speaking, not typing.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="mb-6 text-sm font-semibold uppercase tracking-wider text-[var(--color-foreground)]">Quick Links</h3>
            <ul className="space-y-3">
              {[
                { href: "/", label: "Home" },
                { href: "/how-it-works", label: "How It Works" },
                { href: "/check-status", label: "Check Ticket Status" },
                { href: "/faqs", label: "FAQs & Support" },
                { href: "/contact", label: "Contact Us" },
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="group flex items-center gap-2 text-sm text-[var(--color-muted-foreground)] transition-colors hover:text-[var(--color-accent)]">
                    {link.label}
                    <ExternalLink className="h-3 w-3 opacity-0 transition-opacity group-hover:opacity-100" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="mb-6 text-sm font-semibold uppercase tracking-wider text-[var(--color-foreground)]">Contact Info</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[var(--color-muted)]">
                  <Phone className="h-4 w-4 text-[var(--color-accent)]" />
                </div>
                <div>
                  <p className="text-sm font-medium text-[var(--color-foreground)]">1800-XXX-XXXX</p>
                  <p className="text-xs text-[var(--color-muted-foreground)]">Toll-free, 24/7</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[var(--color-muted)]">
                  <Mail className="h-4 w-4 text-[var(--color-accent)]" />
                </div>
                <div>
                  <p className="text-sm text-[var(--color-muted-foreground)]">support@voiceconnect.indore.gov.in</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[var(--color-muted)]">
                  <MapPin className="h-4 w-4 text-[var(--color-accent)]" />
                </div>
                <div>
                  <p className="text-sm text-[var(--color-muted-foreground)]">Indore Municipal Corporation,<br />M.G. Road, Indore, M.P. 452001</p>
                </div>
              </li>
            </ul>
          </div>

          {/* Languages */}
          <div>
            <h3 className="mb-6 text-sm font-semibold uppercase tracking-wider text-[var(--color-foreground)]">Languages</h3>
            <div className="space-y-4">
              <div className="rounded-xl bg-[var(--color-muted)] p-4">
                <p className="text-xs font-medium uppercase tracking-wider text-[var(--color-muted-foreground)] mb-2">Supported on call</p>
                <div className="flex flex-wrap gap-2">
                  {["Hindi", "English", "Malwi"].map((lang) => (
                    <span key={lang} className="rounded-full bg-[var(--color-border)] px-3 py-1 text-xs font-medium text-[var(--color-foreground)]">{lang}</span>
                  ))}
                </div>
              </div>
              <div className="rounded-xl bg-[var(--color-muted)] p-4">
                <p className="text-xs font-medium uppercase tracking-wider text-[var(--color-muted-foreground)] mb-2">Website</p>
                <div className="flex flex-wrap gap-2">
                  {["English", "Hindi"].map((lang) => (
                    <span key={lang} className="rounded-full bg-[var(--color-border)] px-3 py-1 text-xs font-medium text-[var(--color-foreground)]">{lang}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 border-t border-[var(--color-border)] pt-8">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <p className="text-sm text-[var(--color-muted-foreground)]">
              &copy; {new Date().getFullYear()} Indore Municipal Corporation. All rights reserved.
            </p>
            <div className="flex items-center gap-1 text-sm text-[var(--color-muted-foreground)]">
              <span>Built with</span>
              <span className="text-[var(--color-accent)]">care</span>
              <span>for Indore</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
