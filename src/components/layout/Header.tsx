"use client";

import Link from "next/link";
import { useState } from "react";
import { Phone, Menu, X, LogIn, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { useAuth } from "@/lib/auth/context";
import { Button } from "@/components/ui/Button";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/how-it-works", label: "How It Works" },
  { href: "/check-status", label: "Check Status" },
  { href: "/faqs", label: "FAQs" },
  { href: "/contact", label: "Contact" },
];

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { isAuthenticated, user } = useAuth();

  const dashboardRoute = user?.role === "super_admin" ? "/admin"
    : user?.role === "field_staff" ? "/dashboard/field"
    : user?.role === "department_head" || user?.role === "officer" ? "/dashboard/department"
    : "/admin";

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--color-border)] bg-[var(--color-background)]/80 backdrop-blur-xl">
      <div className="mx-auto flex h-18 max-w-7xl items-center justify-between px-6 sm:px-8 lg:px-12">
        {/* Logo */}
        <Link href="/" className="group flex items-center gap-3">
          <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[var(--color-accent)] to-[var(--color-accent-dark)] shadow-lg shadow-[var(--color-accent)]/20 transition-transform group-hover:scale-105">
            <Phone className="h-5 w-5 text-[var(--color-primary)]" />
          </div>
          <div className="hidden sm:block">
            <span className="text-lg font-bold text-[var(--color-foreground)]">Voice-Connect</span>
            <span className="ml-2 rounded-full bg-[var(--color-muted)] px-2 py-0.5 text-[10px] font-medium text-[var(--color-muted-foreground)]">Indore</span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden items-center gap-2 md:flex" aria-label="Main navigation">
          {NAV_LINKS.map(link => (
            <Link key={link.href} href={link.href}
              className="rounded-lg px-5 py-2.5 text-sm font-medium text-[var(--color-muted-foreground)] transition-all hover:bg-[var(--color-muted)] hover:text-[var(--color-foreground)]">
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-4">
          <a href="tel:1800XXXXXXX" className="hidden items-center gap-2 rounded-xl bg-[var(--color-muted)] px-4 py-2 text-sm font-semibold text-[var(--color-accent)] transition-all hover:bg-[var(--color-accent)]/10 sm:flex">
            <Phone className="h-4 w-4" />
            <span>1800-XXX-XXXX</span>
          </a>
          {isAuthenticated ? (
            <Link href={dashboardRoute}>
              <Button size="sm" className="gap-2">
                Dashboard
                <ChevronRight className="h-4 w-4" />
              </Button>
            </Link>
          ) : (
            <Link href="/login">
              <Button size="sm" variant="outline" className="gap-2">
                <LogIn className="h-4 w-4" />
                Login
              </Button>
            </Link>
          )}
          <button onClick={() => setMobileOpen(!mobileOpen)}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-[var(--color-border)] bg-[var(--color-muted)] text-[var(--color-foreground)] transition-colors hover:bg-[var(--color-border)] md:hidden"
            aria-label="Toggle menu">
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      {mobileOpen && (
        <div className="border-t border-[var(--color-border)] bg-[var(--color-background)] md:hidden animate-fade-in">
          <nav className="flex flex-col p-4 gap-1" aria-label="Mobile navigation">
            {NAV_LINKS.map(link => (
              <Link key={link.href} href={link.href} onClick={() => setMobileOpen(false)}
                className="rounded-xl px-4 py-3 text-base font-medium text-[var(--color-foreground)] transition-colors hover:bg-[var(--color-muted)]">
                {link.label}
              </Link>
            ))}
            <div className="mt-4 border-t border-[var(--color-border)] pt-4">
              <a href="tel:1800XXXXXXX" className="flex items-center gap-3 rounded-xl bg-[var(--color-accent)]/10 px-4 py-3 text-base font-semibold text-[var(--color-accent)]">
                <Phone className="h-5 w-5" />
                Call Helpline: 1800-XXX-XXXX
              </a>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
