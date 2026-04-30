"use client";

import { useState } from "react";
import { useAuth } from "@/lib/auth/context";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Phone, LogIn, Eye, EyeOff, ArrowRight, Building2, Users } from "lucide-react";
import Link from "next/link";

const DEMO_ACCOUNTS = [
  { email: "admin@imc.gov.in", password: "admin123", role: "Admin", icon: "shield" },
  { email: "rajesh.sharma@imc.gov.in", password: "dept123", role: "Department Head", icon: "building" },
  { email: "priya.verma@imc.gov.in", password: "officer123", role: "Officer", icon: "user" },
  { email: "ramesh.yadav@imc.gov.in", password: "field123", role: "Field Staff", icon: "map" },
];

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const result = await login(email, password);
    if (!result.success) {
      setError(result.error || "Login failed");
    }
    setLoading(false);
  };

  const fillDemo = (acc: typeof DEMO_ACCOUNTS[0]) => {
    setEmail(acc.email);
    setPassword(acc.password);
    setError("");
  };

  return (
    <div className="flex min-h-screen bg-[var(--color-background)]">
      {/* Left - Branding */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-between p-12 relative overflow-hidden">
        {/* Background effects */}
        <div className="absolute inset-0 grid-pattern opacity-30" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-[var(--color-accent)]/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-[var(--color-secondary)]/10 rounded-full blur-3xl" />
        
        <div className="relative">
          <Link href="/" className="group inline-flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-[var(--color-accent)] to-[var(--color-accent-dark)] shadow-lg shadow-[var(--color-accent)]/25 transition-transform group-hover:scale-105">
              <Phone className="h-6 w-6 text-[var(--color-primary)]" />
            </div>
            <span className="text-xl font-bold text-[var(--color-foreground)]">Voice-Connect</span>
          </Link>
        </div>
        
        <div className="relative space-y-8">
          <div>
            <h1 className="font-[family-name:var(--font-hind)] text-5xl font-bold leading-tight text-[var(--color-foreground)]">
              Manage Civic
              <br />
              <span className="text-gradient">Complaints</span>
            </h1>
            <p className="mt-4 text-lg text-[var(--color-muted-foreground)] max-w-md">
              Track resolutions, serve citizens better through our integrated dashboard system.
            </p>
          </div>
          
          <div className="grid grid-cols-2 gap-4 max-w-sm">
            <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-card)] p-5">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--color-accent)]/10 text-[var(--color-accent)] mb-3">
                <Building2 className="h-5 w-5" />
              </div>
              <p className="text-2xl font-bold text-[var(--color-foreground)]">60+</p>
              <p className="text-sm text-[var(--color-muted-foreground)]">Active Tickets</p>
            </div>
            <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-card)] p-5">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--color-success)]/10 text-[var(--color-success)] mb-3">
                <Users className="h-5 w-5" />
              </div>
              <p className="text-2xl font-bold text-[var(--color-foreground)]">6</p>
              <p className="text-sm text-[var(--color-muted-foreground)]">Departments</p>
            </div>
          </div>
        </div>
        
        <div className="relative">
          <p className="text-sm text-[var(--color-muted-foreground)]">
            &copy; {new Date().getFullYear()} Indore Municipal Corporation
          </p>
        </div>
      </div>

      {/* Right - Login Form */}
      <div className="flex flex-1 flex-col justify-center px-6 py-12 sm:px-12 lg:px-16 lg:border-l border-[var(--color-border)]">
        <div className="mx-auto w-full max-w-sm">
          {/* Mobile logo */}
          <div className="mb-12 lg:hidden">
            <Link href="/" className="group inline-flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-[var(--color-accent)] to-[var(--color-accent-dark)]">
                <Phone className="h-6 w-6 text-[var(--color-primary)]" />
              </div>
              <span className="text-xl font-bold text-[var(--color-foreground)]">Voice-Connect</span>
            </Link>
          </div>

          <div className="mb-14">
            <h2 className="font-[family-name:var(--font-hind)] text-4xl font-bold text-[var(--color-foreground)] tracking-tight">
              Welcome back
            </h2>
            <p className="mt-4 text-lg text-[var(--color-muted-foreground)]">
              Sign in to access your dashboard
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            <Input 
              label="Email" 
              type="email" 
              required 
              value={email} 
              onChange={e => setEmail(e.target.value)} 
              placeholder="your.name@imc.gov.in" 
            />
            <div className="relative">
              <Input 
                label="Password" 
                type={showPassword ? "text" : "password"} 
                required 
                value={password} 
                onChange={e => setPassword(e.target.value)} 
                placeholder="Enter your password" 
              />
              <button 
                type="button" 
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-10 text-[var(--color-muted-foreground)] hover:text-[var(--color-foreground)] transition-colors"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>

            {error && (
              <div className="rounded-xl bg-[var(--color-danger)]/10 border border-[var(--color-danger)]/20 px-4 py-3 text-sm text-[var(--color-danger)]">
                {error}
              </div>
            )}

            <div className="pt-6">
              <Button type="submit" size="lg" className="w-full h-14 text-lg rounded-xl shadow-[0_0_20px_rgba(0,212,170,0.2)] hover:shadow-[0_0_30px_rgba(0,212,170,0.4)] transition-shadow" disabled={loading}>
                {loading ? (
                  <span className="h-5 w-5 animate-spin rounded-full border-2 border-[var(--color-primary)] border-t-transparent" />
                ) : (
                  <LogIn className="h-5 w-5 mr-2" />
                )}
                {loading ? "Signing in..." : "Sign In"}
              </Button>
            </div>
          </form>

          {/* Demo Accounts */}
          <div className="mt-12">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[var(--color-border)]" />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="bg-[var(--color-background)] px-4 text-[var(--color-muted-foreground)] uppercase tracking-wider">
                  Demo Accounts
                </span>
              </div>
            </div>
            
            <div className="mt-8 grid grid-cols-2 gap-4">
              {DEMO_ACCOUNTS.map(acc => (
                <button 
                  key={acc.email} 
                  onClick={() => fillDemo(acc)}
                  className="group flex items-center gap-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] px-4 py-4 text-left transition-all hover:border-[var(--color-accent)]/30 hover:bg-[var(--color-muted)] cursor-pointer"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-[var(--color-foreground)] truncate">{acc.role}</p>
                    <p className="text-xs text-[var(--color-muted-foreground)] truncate mt-1">{acc.email.split("@")[0]}</p>
                  </div>
                  <ArrowRight className="h-4 w-4 text-[var(--color-muted-foreground)] opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
              ))}
            </div>
          </div>

          <p className="mt-10 text-center text-sm text-[var(--color-muted-foreground)]">
            <Link href="/" className="text-[var(--color-accent)] hover:text-[var(--color-accent-light)] transition-colors">
              Back to home
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
