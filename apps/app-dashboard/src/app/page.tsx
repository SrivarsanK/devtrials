"use client";

import Link from "next/link";
import React from "react";
import { ArrowRight, Zap, ShieldCheck, MapPin, Activity, TrendingUp, BarChart3, PlayCircle, Globe, ChevronRight, Sparkles, ShieldAlert, Cpu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { animate, stagger, createTimeline } from "animejs";
import dynamic from "next/dynamic";

// Dynamically import 3D component to ensure it only renders on client
const HeroShield = dynamic(() => import("@/components/HeroShield"), { ssr: false });

export default function HomePage() {
  const [isMounted, setIsMounted] = React.useState(false);

  React.useEffect(() => {
    setIsMounted(true);
  }, []);

  React.useEffect(() => {
    if (!isMounted) return;

    // Small delay to ensure Ref elements are actually rendered and styled by tailwind
    const timer = setTimeout(() => {
      // Check if targets exist to prevent early errors
      const hasContent = document.querySelector('.anime-hero-content');
      if (!hasContent) return;

      const tl = createTimeline({
        defaults: {
          duration: 1000,
          ease: 'easeOutExpo'
        }
      });

      tl.add('.anime-hero-content > *', {
        y: [50, 0],
        opacity: [0, 1],
        delay: stagger(120),
      })
      .add('.anime-hero-image', {
        scale: [0.85, 1],
        opacity: [0, 1],
        duration: 1200,
      }, '-=600')
      .add('.anime-banner-item', {
        x: [-15, 0],
        opacity: [0, 0.4],
        delay: stagger(80),
      }, '-=1000')
      .add('.anime-feature-card', {
        y: [30, 0],
        opacity: [0, 1],
        delay: stagger(100),
      }, '-=700')
      .add('.anime-stats-section', {
        y: [20, 0],
        opacity: [0, 1],
        duration: 800
      }, '-=400');
    }, 100);

    return () => clearTimeout(timer);
  }, [isMounted]);

  // Prevent SSR mismatch by returning null or a placeholder background
  if (!isMounted) {
    return <div className="min-h-screen bg-background" />;
  }

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground overflow-x-hidden">
      {/* Ambient background glow & Grid Pattern */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
        <div className="absolute top-0 left-1/4 w-[800px] h-[800px] bg-primary/10 rounded-full blur-[180px] animate-glow-pulse" />
        <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-secondary/8 rounded-full blur-[150px] animate-glow-pulse" style={{ animationDelay: '1.5s' }} />
      </div>

      {/* Top Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 h-20 glass-strong flex items-center px-6 md:px-12 justify-between">
        <div className="flex items-center gap-3">
          <div className="size-10 rounded-xl bg-primary flex items-center justify-center shadow-[0_0_15px_rgba(255,70,37,0.3)] rotate-6">
            <ShieldCheck className="size-6 text-white" strokeWidth={2.5} />
          </div>
          <div className="flex flex-col gap-0 leading-tight">
            <span className="text-2xl font-display font-black tracking-tight text-foreground whitespace-nowrap uppercase">Ride<span className="text-secondary italic">Suraksha</span></span>
            <span className="text-[8px] font-bold tracking-[0.2em] text-muted-foreground uppercase opacity-60 whitespace-nowrap">Insurer Portal</span>
          </div>
        </div>

        <div className="hidden lg:flex items-center gap-12">
          {[
            { label: "Liquidity", href: "#liquidity" },
            { label: "Underwriting", href: "#underwriting" },
            { label: "Transparency", href: "#transparency" },
            { label: "Risk Map", href: "/dashboard/risk-map" }
          ].map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="text-[12px] font-black uppercase tracking-[0.25em] text-white/50 hover:text-white transition-all duration-300 relative group"
            >
              {item.label}
              <span className="absolute -bottom-2 left-0 w-0 h-[3px] bg-secondary shadow-[0_0_10px_rgba(0,216,255,0.8)] transition-all duration-500 group-hover:w-full" />
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-4">
          <Link href="/dashboard">
            <Button className="rounded-xl glass border border-white/10 px-6 font-black uppercase text-[11px] h-11 hover:bg-primary hover:text-white hover:border-primary/50 hover:neon-primary transition-all shadow-[0_0_20px_rgba(255,70,37,0.15)] relative overflow-hidden group/btn">
              <span className="relative z-10">Commander Access</span>
              <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-white/10 to-primary/0 translate-x-[-100%] group-hover/btn:translate-x-[100%] transition-transform duration-700" />
            </Button>
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col pt-24 pb-12 px-6 md:px-12 max-w-[1400px] mx-auto w-full gap-16 md:gap-28 relative z-10">
        <section className="relative flex flex-col items-start min-h-[65vh] md:min-h-[85vh] gap-8">
          {/* Hero Section Inner Content */}
          <div className="w-full lg:w-3/5 relative z-10 flex flex-col items-start text-left pt-12">
            <div className="space-y-12 anime-hero-content w-full">
              <div className="inline-flex items-center gap-2.5 glass rounded-full px-5 py-2 text-[10px] font-bold uppercase tracking-[0.1em] text-secondary opacity-0 self-start">
                <Sparkles size={14} className="text-secondary animate-pulse" />
                <span>Institutional Risk Protocol v4.2</span>
              </div>

              <div className="space-y-8 opacity-0 relative">
                <h1 className="text-6xl sm:text-8xl md:text-9xl lg:text-[120px] font-display font-black tracking-tighter leading-[0.85] text-white uppercase drop-shadow-2xl flex flex-col">
                  <span className="relative inline-block">
                    PROTECT THE
                  </span>
                  <span className="text-secondary italic flex items-center gap-4">
                    CAPITAL
                    <div className="h-[2px] flex-1 bg-gradient-to-r from-secondary to-transparent rounded-full shadow-[0_0_20px_rgba(0,216,255,0.6)] mt-4 hidden lg:block" />
                  </span>
                </h1>
              </div>

              <p className="max-w-xl text-base md:text-lg text-white/70 leading-relaxed border-l-2 border-secondary/40 pl-8 py-3 opacity-0 backdrop-blur-sm bg-white/[0.02] rounded-r-2xl">
                Advanced parametric infrastructure for ShieldLife General Insurance. 
                Full-spectrum solvency oracles providing <span className="text-white font-bold text-shadow-glow">instant liquidity protection</span> across global risk nodes.
              </p>

              <div className="flex flex-row items-center gap-3 md:gap-6 pt-6 opacity-0">
                <Link href="/dashboard" className="flex-1 sm:flex-none">
                  <Button size="lg" className="w-full sm:w-auto rounded-xl sm:rounded-2xl bg-secondary hover:bg-secondary/90 text-white font-black uppercase h-12 sm:h-16 px-4 sm:px-12 text-[10px] sm:text-sm shadow-[0_10px_30px_rgba(0,216,255,0.45)] hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2 sm:gap-4 border-none">
                    Launch Command
                    <ArrowRight className="size-4 sm:size-5" />
                  </Button>
                </Link>
                <Link href="#" className="flex-1 sm:flex-none">
                  <Button variant="ghost" size="lg" className="w-full sm:w-auto rounded-xl sm:rounded-2xl font-bold uppercase h-12 sm:h-16 px-4 sm:px-10 text-[10px] sm:text-sm hover:bg-primary/10 hover:text-primary transition-all flex items-center justify-center gap-2 sm:gap-4 group border border-white/5 backdrop-blur-md">
                    <div className="size-6 sm:size-10 rounded-full glass flex items-center justify-center group-hover:neon-primary transition-all shadow-inner">
                      <PlayCircle className="size-4 sm:size-6 text-primary fill-current" />
                    </div>
                    The Oracle
                  </Button>
                </Link>
              </div>
            </div>
          </div>

          {/* Floating tactical card - Compact high-fidelity glassmorphism badge */}
          <div className="absolute right-0 bottom-24 group lg:opacity-100 hidden lg:block z-20">
            <div className="relative p-8 rounded-[2rem] glass border border-white/10 shadow-2xl animate-float-slow backdrop-blur-2xl bg-white/5 min-w-[320px] overflow-visible group">
              {/* Refined 3D Shield Backdrop */}
              <div className="absolute left-[-160px] right-[-20px] inset-y-[-180px] -z-10 group-hover:scale-105 transition-transform duration-1000 pointer-events-none opacity-80 scale-100">
                <HeroShield />
              </div>

              <div className="flex items-center justify-between gap-6 relative z-10">
                <div className="space-y-3">
                  <p className="text-[10px] uppercase font-black text-white/40 tracking-[0.25em]">Payout Velocity</p>
                  <div className="flex items-center gap-3">
                    <p className="text-5xl font-bold text-white tabular-nums font-mono tracking-tighter shrink-0 leading-none">0.14s</p>
                    <div className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-black text-white uppercase backdrop-blur-md">Instant</div>
                  </div>
                </div>
                
                <div className="size-14 rounded-2xl bg-primary/20 flex items-center justify-center border border-primary/20 shadow-[0_0_25px_rgba(255,70,37,0.2)] group-hover:neon-primary transition-all duration-500">
                  <ShieldCheck className="size-7 text-primary shadow-glow" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Professional Navigation Strip - Replacement for generic banner */}
        <section className="py-12 border-y border-white/5 relative bg-white/[0.01] backdrop-blur-sm">
          <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent pointer-events-none" />
          <div className="max-w-[1000px] mx-auto px-6 relative z-10 flex items-center justify-between">
            {[
              { label: "Liquidity", href: "#liquidity" },
              { label: "Underwriting", href: "#underwriting" },
              { label: "Transparency", href: "#transparency" },
              { label: "Risk Map", href: "/dashboard/risk-map" }
            ].map((item, i) => (
              <a
                key={item.label}
                href={item.href}
                className="group flex flex-col items-center gap-1 relative"
              >
                <span className="text-[12px] md:text-[13px] font-black uppercase tracking-[0.3em] text-white/50 group-hover:text-white transition-all duration-500 py-2">
                  {item.label}
                </span>
                <div className="absolute -bottom-1 size-1.5 rounded-full bg-secondary opacity-0 group-hover:opacity-100 group-hover:neon-secondary transition-all duration-500" />
                <div className="absolute inset-0 bg-white/5 blur-xl opacity-0 group-hover:opacity-100 transition-opacity rounded-full px-8 -z-10" />
              </a>
            ))}
          </div>
        </section>

        {/* Feature Grid */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-8 scroll-mt-32">
          {[
            {
              id: "liquidity",
              icon: TrendingUp,
              title: "Liquidity",
              desc: "Dynamic pool rebalancing based on real-time climate triggers. Automated solvency ratios for instant high-volume payouts.",
              color: "bg-primary/10 border-primary/20",
              iconColor: "text-primary",
            },
            {
              id: "underwriting",
              icon: Cpu,
              title: "Underwriting",
              desc: "Deep-learning fraud detection analyzing behavior patterns. Proactive risk mitigation for insurance-as-code protocols.",
              color: "bg-secondary/10 border-secondary/20",
              iconColor: "text-secondary",
            },
            {
              id: "transparency",
              icon: BarChart3,
              title: "Transparency",
              desc: "Real-time transparent loss calculations. Decentralized reporting nodes synchronized across global data points.",
              color: "bg-white/5 border-white/10",
              iconColor: "text-white",
            }
          ].map((feature, i) => (
            <div key={feature.title} id={feature.id} className="group p-10 rounded-[2.5rem] glass-strong border border-white/5 card-glow flex flex-col gap-8 hover:translate-y-[-8px] hover:border-white/20 transition-all duration-500 anime-feature-card opacity-0 relative overflow-hidden scroll-mt-32">
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className={cn("size-20 rounded-2xl flex items-center justify-center shadow-lg transition-all duration-500 group-hover:scale-110 group-hover:rotate-3 border backdrop-blur-md", feature.color)}>
                <feature.icon className={cn("size-10", feature.iconColor)} strokeWidth={2.5} />
              </div>
              <div className="space-y-4 relative z-10">
                <h3 className="text-4xl font-display font-black tracking-tight text-foreground leading-none uppercase">{feature.title}</h3>
                <p className="text-base text-muted-foreground leading-relaxed font-medium opacity-80 group-hover:opacity-100 transition-opacity">
                  {feature.desc}
                </p>
              </div>
              <div className="mt-auto pt-6 border-t border-white/5">
                <div className="flex items-center gap-3 text-secondary text-[12px] font-black uppercase tracking-[0.2em] group-hover:text-white transition-colors">
                  Analyze Protocol <div className="size-6 rounded-full bg-secondary/10 flex items-center justify-center group-hover:bg-secondary group-hover:text-white transition-all"><ChevronRight size={14} /></div>
                </div>
              </div>
            </div>
          ))}
        </section>

        {/* Institutional Statistics */}
        <section className="p-8 md:p-14 rounded-2xl md:rounded-3xl glass card-glow relative overflow-hidden flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-14 group anime-stats-section opacity-0">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(0,216,255,0.08)_0%,transparent_40%)] pointer-events-none" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_80%,rgba(255,70,37,0.05)_0%,transparent_40%)] pointer-events-none" />
          
          <div className="w-full lg:max-w-xl flex flex-col items-start text-left space-y-8 relative z-10">
            <div className="flex items-center gap-3 text-primary font-black uppercase tracking-[0.2em] text-[10px] sm:text-[11px]">
              <ShieldAlert className="size-4 animate-pulse text-primary" />
              Global Capacity Phase
            </div>
            <h2 className="text-5xl sm:text-6xl md:text-7xl font-display font-black tracking-tight leading-[0.85] uppercase">
              Underwriting at <br /> <span className="text-primary italic">Web-Scale</span>
            </h2>
            <p className="text-sm sm:text-base text-white/60 leading-relaxed font-medium max-w-lg">
              RideSuraksha manages over $420M in dynamic capital pools, serving as the parametric liquidity backbone for the gig workforce ecosystem.
            </p>
            <Button className="h-14 px-10 rounded-xl bg-primary hover:bg-primary/90 text-white font-black uppercase shadow-[0_10px_30px_rgba(255,70,37,0.3)] border-none transition-all hover:scale-105 active:scale-95 w-full sm:w-auto flex items-center justify-center gap-3">
              Institutional Deck <MapPin size={18} />
            </Button>
          </div>

          <div className="grid grid-cols-2 gap-4 sm:gap-6 w-full lg:w-auto relative z-10">
            {[
              { label: "TVL Managed", val: "$420M", color: "text-primary" },
              { label: "Safety Nodes", val: "1,240", color: "text-white" },
              { label: "Oracle Sync", val: "120ms", color: "text-secondary" },
              { label: "Capital Flow", val: "99.9%", color: "text-white" },
            ].map((stat, i) => (
              <div key={i} className="p-8 rounded-[2rem] glass-strong border border-white/5 hover:border-white/20 transition-all duration-500 flex flex-col justify-center items-center lg:items-start min-w-[200px] relative group/stat overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover/stat:opacity-100 transition-opacity" />
                <p className={cn("text-4xl md:text-5xl font-display font-black tabular-nums tracking-tighter leading-none shrink-0 relative z-10", stat.color)}>{stat.val}</p>
                <div className="h-0.5 w-8 bg-current opacity-20 my-4 hidden lg:block relative z-10" />
                <p className="text-[10px] font-black uppercase tracking-[0.25em] text-white/40 mt-1 relative z-10 group-hover/stat:text-white/70 transition-colors">{stat.label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Footer */}
        <footer className="pt-20 flex flex-col gap-14 border-t border-white/5">
          <div className="flex flex-col md:flex-row justify-between items-start gap-12">
            <div className="space-y-4 max-w-sm">
              <div className="flex items-center gap-3">
                <div className="size-9 rounded-xl bg-secondary flex items-center justify-center shadow-[0_0_15px_rgba(0,216,255,0.3)]">
                  <Activity className="size-5 text-white fill-current" />
                </div>
                <h4 className="text-3xl font-display font-black tracking-tight uppercase">RideSuraksha</h4>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                The world&apos;s most advanced parametric insurance infrastructure for institutional-grade risk management.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-6 md:gap-14 w-full md:w-auto">
              {[
                { title: "Dashboard", links: ["Reserve Health", "Loss Ratio", "Fraud Engine", "Zones"] },
                { title: "Protocol", links: ["Underwriting", "Solvency", "Governance", "API"] },
                { title: "Legal", links: ["Privacy", "Standard", "AML", "Compliance"] }
              ].map((section) => (
                <div key={section.title} className="space-y-4">
                  <h5 className="text-[11px] font-bold uppercase tracking-[0.15em] text-foreground">{section.title}</h5>
                  <ul className="space-y-3">
                    {section.links.map(link => (
                      <li key={link}>
                        <Link href="#" className="text-xs text-muted-foreground hover:text-secondary transition-colors">{link}</Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-center py-10 border-t border-white/5 gap-6">
            <span className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground opacity-40">© 2026 ShieldLife General Insurance. All Rights Reserved.</span>
            <div className="flex items-center gap-6">
              <span className="text-[9px] font-bold uppercase tracking-widest px-3 py-1 glass rounded-full text-success border border-success/20 neon-success">Oracle Status: Synchronized</span>
              <div className="flex gap-5">
                <Globe className="size-4 text-muted-foreground hover:text-secondary transition-colors cursor-pointer" />
                <Zap className="size-4 text-muted-foreground hover:text-primary transition-colors cursor-pointer" />
                <ShieldCheck className="size-4 text-muted-foreground hover:text-secondary transition-colors cursor-pointer" />
              </div>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}
