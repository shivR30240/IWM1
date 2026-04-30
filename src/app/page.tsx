"use client";

import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import Link from "next/link";
import { Phone, Mic, Ticket, Search, ArrowRight, CheckCircle, Users, Clock, Building2, MessageCircle, Star, Shield, Zap, Globe } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { motion } from "framer-motion";

const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
};

export default function HomePage() {
  return (
    <>
      <Header />
      <main id="main-content">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-[var(--color-background)]">
          <div className="absolute inset-0 grid-pattern opacity-30" />
          
          <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-[var(--color-accent)]/10 rounded-full blur-[100px]" />
          <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-[var(--color-secondary)]/10 rounded-full blur-[100px]" />
          
          <div className="relative mx-auto max-w-7xl px-6 py-32 sm:px-12 sm:py-48 lg:px-16 lg:py-64">
            <div className="grid lg:grid-cols-2 gap-24 xl:gap-32 items-center">
              <motion.div 
                initial="hidden" 
                animate="visible" 
                variants={staggerContainer}
                className="max-w-2xl"
              >
                <motion.div variants={fadeInUp} className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-[var(--color-muted)] border border-[var(--color-border)] mb-10 shadow-sm">
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--color-accent)] opacity-75"></span>
                    <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-[var(--color-accent)]"></span>
                  </span>
                  <span className="text-sm font-medium tracking-wide text-[var(--color-muted-foreground)]">Available 24/7 for Indore</span>
                </motion.div>
                
                <motion.h1 variants={fadeInUp} className="font-[family-name:var(--font-hind)] text-6xl font-bold leading-[1.1] text-[var(--color-foreground)] sm:text-7xl lg:text-8xl tracking-tight">
                  Your Voice,
                  <br />
                  <span className="text-gradient pb-2 block">Your City</span>
                </motion.h1>
                
                <motion.p variants={fadeInUp} className="mt-8 font-[family-name:var(--font-hind)] text-2xl text-[var(--color-muted-foreground)] sm:text-3xl font-light tracking-wide">
                  आपकी आवाज़, आपका शहर
                </motion.p>
                
                <motion.p variants={fadeInUp} className="mt-10 text-xl leading-relaxed text-[var(--color-muted-foreground)] max-w-lg">
                  Report civic issues in Indore seamlessly. No apps to download, no complex forms to fill. Just call or message.
                </motion.p>
                
                <motion.div variants={fadeInUp} className="mt-16 flex flex-wrap gap-6">
                  <a href="tel:1800XXXXXXX">
                    <Button size="lg" className="h-14 px-8 text-lg rounded-2xl shadow-lg shadow-[var(--color-accent)]/20 hover:shadow-[var(--color-accent)]/40 transition-shadow">
                      <Phone className="h-5 w-5 mr-2" />
                      Call Helpline
                    </Button>
                  </a>
                  <a href="https://wa.me/919876543210" target="_blank" rel="noopener noreferrer">
                    <Button size="lg" variant="secondary" className="h-14 px-8 text-lg rounded-2xl">
                      <MessageCircle className="h-5 w-5 mr-2" />
                      WhatsApp
                    </Button>
                  </a>
                  <Link href="/check-status">
                    <Button size="lg" variant="outline" className="h-14 px-8 text-lg rounded-2xl border-2">
                      Check Status
                    </Button>
                  </Link>
                </motion.div>
              </motion.div>
              
              {/* Hero Visual */}
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
                className="hidden lg:block relative"
              >
                <div className="grid grid-cols-2 gap-8">
                  <div className="col-span-2 rounded-3xl border border-[var(--color-border)] bg-[var(--color-card)]/50 backdrop-blur-xl p-10 hover-lift shadow-2xl">
                    <div className="flex items-center gap-8">
                      <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-[var(--color-accent)] to-[var(--color-accent-dark)] shadow-inner">
                        <Phone className="h-10 w-10 text-[var(--color-primary)]" />
                      </div>
                      <div>
                        <p className="text-base text-[var(--color-muted-foreground)] mb-2 font-medium tracking-wide uppercase">Toll-Free Helpline</p>
                        <p className="text-4xl font-bold text-[var(--color-foreground)] tracking-tight">1800-XXX-XXXX</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="rounded-3xl border border-[var(--color-border)] bg-[var(--color-card)]/50 backdrop-blur-xl p-8 hover-lift shadow-xl">
                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-green-500/10 mb-8">
                      <MessageCircle className="h-8 w-8 text-green-500" />
                    </div>
                    <p className="text-sm text-[var(--color-muted-foreground)] mb-2 uppercase tracking-wider font-medium">WhatsApp</p>
                    <p className="text-xl font-semibold text-[var(--color-foreground)]">+91 98765 43210</p>
                  </div>
                  
                  <div className="rounded-3xl border border-[var(--color-border)] bg-[var(--color-card)]/50 backdrop-blur-xl p-8 hover-lift shadow-xl">
                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[var(--color-info)]/10 mb-8">
                      <Ticket className="h-8 w-8 text-[var(--color-info)]" />
                    </div>
                    <p className="text-sm text-[var(--color-muted-foreground)] mb-2 uppercase tracking-wider font-medium">Track Ticket</p>
                    <p className="text-xl font-semibold text-[var(--color-foreground)]">IVC-2026-12345</p>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="relative border-y border-[var(--color-border)] bg-[var(--color-card)] py-16">
          <div className="mx-auto max-w-7xl px-6 sm:px-12 lg:px-16">
            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              variants={staggerContainer}
              className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4"
            >
              {[
                { icon: CheckCircle, value: "10k+", label: "Complaints Resolved", color: "text-[var(--color-success)]", bg: "bg-[var(--color-success)]/10" },
                { icon: Building2, value: "50+", label: "City Departments", color: "text-[var(--color-info)]", bg: "bg-[var(--color-info)]/10" },
                { icon: Users, value: "98%", label: "Citizen Satisfaction", color: "text-[var(--color-accent)]", bg: "bg-[var(--color-accent)]/10" },
                { icon: Clock, value: "< 48h", label: "Avg. Response Time", color: "text-[var(--color-warning)]", bg: "bg-[var(--color-warning)]/10" },
              ].map((stat, idx) => (
                <motion.div key={idx} variants={fadeInUp} className="group flex items-center gap-6 rounded-3xl border border-[var(--color-border)] bg-[var(--color-background)] p-8 transition-all hover:border-[var(--color-border)] hover:shadow-xl">
                  <div className={`flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl ${stat.bg} ${stat.color} transition-transform duration-500 group-hover:scale-110`}>
                    <stat.icon className="h-10 w-10" />
                  </div>
                  <div>
                    <p className="text-4xl font-bold text-[var(--color-foreground)] tracking-tight">{stat.value}</p>
                    <p className="text-base text-[var(--color-muted-foreground)] mt-2 font-medium">{stat.label}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* How It Works */}
        <section className="relative bg-[var(--color-background)] py-36 sm:py-48">
          <div className="absolute inset-0 dot-pattern opacity-30" />
          
          <div className="relative mx-auto max-w-7xl px-6 sm:px-12 lg:px-16">
            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={fadeInUp}
              className="text-center mb-24"
            >
              <span className="inline-block rounded-full bg-[var(--color-accent)]/10 px-6 py-2.5 text-sm font-semibold tracking-wider uppercase text-[var(--color-accent)] mb-8">
                Simple Process
              </span>
              <h2 className="font-[family-name:var(--font-hind)] text-5xl font-bold text-[var(--color-foreground)] sm:text-6xl text-balance tracking-tight">
                How It Works
              </h2>
              <p className="mt-8 text-xl text-[var(--color-muted-foreground)] max-w-2xl mx-auto leading-relaxed">
                Four effortless steps to resolve your civic complaint and improve your neighborhood.
              </p>
            </motion.div>
            
            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={staggerContainer}
              className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4"
            >
              {[
                { icon: Phone, title: "Call or WhatsApp", desc: "Dial our toll-free number or send a simple WhatsApp message.", step: 1 },
                { icon: Mic, title: "Describe Issue", desc: "Speak naturally in Hindi, English, or local Malwi.", step: 2 },
                { icon: Ticket, title: "Get Ticket ID", desc: "Receive an instant confirmation SMS with your tracking ID.", step: 3 },
                { icon: Search, title: "Track Progress", desc: "Monitor the resolution status online at any time.", step: 4 },
              ].map(s => (
                <motion.div key={s.step} variants={fadeInUp} className="group relative">
                  <div className="rounded-3xl border border-[var(--color-border)] bg-[var(--color-card)]/40 backdrop-blur-sm p-10 transition-all hover:border-[var(--color-accent)]/30 hover:bg-[var(--color-card)] hover:shadow-2xl h-full">
                    <div className="relative mb-10">
                      <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-[var(--color-muted)] text-[var(--color-foreground)] transition-all duration-500 group-hover:bg-[var(--color-accent)] group-hover:text-[var(--color-primary)]">
                        <s.icon className="h-10 w-10" />
                      </div>
                      <span className="absolute -top-3 -right-3 flex h-10 w-10 items-center justify-center rounded-full bg-[var(--color-background)] border-2 border-[var(--color-border)] text-base font-bold text-[var(--color-foreground)] shadow-sm">
                        {s.step}
                      </span>
                    </div>
                    <h3 className="font-[family-name:var(--font-hind)] text-2xl font-semibold text-[var(--color-foreground)] mb-5 tracking-tight">{s.title}</h3>
                    <p className="text-[var(--color-muted-foreground)] leading-loose text-lg">{s.desc}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Features Grid - Bento Style */}
        <section className="relative border-t border-[var(--color-border)] bg-[var(--color-card)] py-36 sm:py-48">
          <div className="mx-auto max-w-7xl px-6 sm:px-12 lg:px-16">
            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={fadeInUp}
              className="text-center mb-24"
            >
              <span className="inline-block rounded-full bg-[var(--color-secondary)]/10 px-6 py-2.5 text-sm font-semibold tracking-wider uppercase text-[var(--color-secondary)] mb-8">
                Why Choose Us
              </span>
              <h2 className="font-[family-name:var(--font-hind)] text-5xl font-bold text-[var(--color-foreground)] sm:text-6xl text-balance tracking-tight">
                Built for Citizens
              </h2>
              <p className="mt-8 text-xl text-[var(--color-muted-foreground)] max-w-2xl mx-auto leading-relaxed">
                Making civic engagement more accessible, transparent, and responsive than ever before.
              </p>
            </motion.div>
            
            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={staggerContainer}
              className="grid gap-8 md:grid-cols-2 lg:grid-cols-3"
            >
              <motion.div variants={fadeInUp} className="md:col-span-2 lg:col-span-2 group rounded-3xl border border-[var(--color-border)] bg-[var(--color-background)]/50 p-12 transition-all hover:border-[var(--color-accent)]/30 hover:shadow-2xl">
                <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-[var(--color-accent)]/10 text-[var(--color-accent)] mb-10">
                  <Phone className="h-10 w-10" />
                </div>
                <h3 className="font-[family-name:var(--font-hind)] text-4xl font-semibold text-[var(--color-foreground)] mb-6 tracking-tight">Voice-First Platform</h3>
                <p className="text-[var(--color-muted-foreground)] leading-loose text-xl mb-12 max-w-2xl">
                  No app download or form filling required. Just call and speak natively. Our AI-powered system automatically understands you, extracts the issue, and creates a ticket.
                </p>
                <div className="flex flex-wrap gap-4">
                  <span className="rounded-full bg-[var(--color-muted)] px-6 py-2.5 text-sm font-medium tracking-wide text-[var(--color-foreground)]">Hindi</span>
                  <span className="rounded-full bg-[var(--color-muted)] px-6 py-2.5 text-sm font-medium tracking-wide text-[var(--color-foreground)]">English</span>
                  <span className="rounded-full bg-[var(--color-muted)] px-6 py-2.5 text-sm font-medium tracking-wide text-[var(--color-foreground)]">Malwi</span>
                </div>
              </motion.div>
              
              <motion.div variants={fadeInUp} className="group rounded-3xl border border-[var(--color-border)] bg-[var(--color-background)]/50 p-12 transition-all hover:border-[var(--color-accent)]/30 hover:shadow-2xl">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[var(--color-muted)] text-[var(--color-accent)] mb-8 transition-colors group-hover:bg-[var(--color-accent)]/10">
                  <MessageCircle className="h-8 w-8" />
                </div>
                <h3 className="font-[family-name:var(--font-hind)] text-2xl font-semibold text-[var(--color-foreground)] mb-4 tracking-tight">WhatsApp Support</h3>
                <p className="text-[var(--color-muted-foreground)] leading-loose text-lg">Send media and get instant status updates via WhatsApp.</p>
              </motion.div>

              {[
                { icon: Shield, title: "Transparent Tracking", desc: "Monitor your complaint status in real-time." },
                { icon: Zap, title: "AI-Powered", desc: "Smart classification routes issues to the right department." },
                { icon: Globe, title: "Multi-Language", desc: "Communicate seamlessly in your preferred language." }
              ].map((feature, idx) => (
                <motion.div key={idx} variants={fadeInUp} className="group rounded-3xl border border-[var(--color-border)] bg-[var(--color-background)]/50 p-12 transition-all hover:border-[var(--color-accent)]/30 hover:shadow-2xl">
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[var(--color-muted)] text-[var(--color-accent)] mb-8 transition-colors group-hover:bg-[var(--color-accent)]/10">
                    <feature.icon className="h-8 w-8" />
                  </div>
                  <h3 className="font-[family-name:var(--font-hind)] text-2xl font-semibold text-[var(--color-foreground)] mb-4 tracking-tight">{feature.title}</h3>
                  <p className="text-[var(--color-muted-foreground)] leading-loose text-lg">{feature.desc}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* CTA Banner */}
        <section className="relative overflow-hidden bg-[var(--color-background)] py-36 sm:py-48">
          <div className="absolute inset-0 grid-pattern opacity-30" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[var(--color-accent)]/5 rounded-full blur-[120px]" />
          
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="relative mx-auto max-w-4xl px-6 text-center sm:px-12"
          >
            <h2 className="font-[family-name:var(--font-hind)] text-5xl font-bold text-[var(--color-foreground)] sm:text-7xl text-balance tracking-tight">
              Ready to Make a Difference?
            </h2>
            <p className="mt-8 text-2xl text-[var(--color-muted-foreground)] font-light">
              Your voice matters. Take action now to improve Indore.
            </p>
            <div className="mt-16 flex flex-wrap justify-center gap-6">
              <a href="tel:1800XXXXXXX">
                <Button size="lg" className="h-16 px-10 text-xl rounded-2xl shadow-[0_0_40px_rgba(0,212,170,0.3)] hover:shadow-[0_0_60px_rgba(0,212,170,0.5)] transition-shadow">
                  <Phone className="h-6 w-6 mr-3" />
                  Call Now
                </Button>
              </a>
              <Link href="/check-status">
                <Button size="lg" variant="outline" className="h-16 px-10 text-xl rounded-2xl border-2 backdrop-blur-sm">
                  Track Status
                </Button>
              </Link>
            </div>
          </motion.div>
        </section>
      </main>
      <Footer />
    </>
  );
}
