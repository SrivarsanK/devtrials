"use client";

import Link from "next/link";
import React from "react";
import { ArrowRight, Zap, ShieldCheck, MapPin, Wind, CloudRain, ThermometerSun, PlayCircle, Globe, ChevronRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import anime from "animejs";
import dynamic from "next/dynamic";

// Dynamically import 3D component to ensure it only renders on client
const HeroShield = dynamic(() => import("@/components/HeroShield"), { ssr: false });

export default function HomePage() {
  React.useEffect(() => {
    const tl = anime.timeline({
      easing: 'easeOutExpo',
      duration: 1000
    });

    tl.add({
      targets: '.anime-hero-content > *',
      translateY: [50, 0],
      opacity: [0, 1],
      delay: anime.stagger(150),
    })
    .add({
      targets: '.anime-hero-image',
      scale: [0.9, 1],
      opacity: [0, 1],
      duration: 1500,
    }, '-=800')
    .add({
      targets: '.anime-banner-item',
      translateX: [-20, 0],
      opacity: [0, 0.6],
      delay: anime.stagger(100),
    }, '-=1000')
    .add({
      targets: '.anime-feature-card',
      translateY: [40, 0],
      opacity: [0, 1],
      delay: anime.stagger(100),
      easing: 'spring(1, 80, 10, 0)',
    }, '-=800')
    .add({
      targets: '.anime-stats-section',
      translateY: [30, 0],
      opacity: [0, 1],
    }, '-=500');
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground overflow-x-hidden">
      {/* Ambient background glow */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-primary/8 rounded-full blur-[150px] animate-glow-pulse" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-secondary/6 rounded-full blur-[120px] animate-glow-pulse" style={{ animationDelay: '1.5s' }} />
      </div>

      {/* Top Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 h-20 glass-strong flex items-center px-6 md:px-12 justify-between">
        <div className="flex items-center gap-3">
          <div className="size-10 rounded-xl bg-primary flex items-center justify-center shadow-[0_0_15px_rgba(255,70,37,0.3)] rotate-6">
            <ShieldCheck className="size-6 text-white" strokeWidth={2.5} />
          </div>
          <div className="flex flex-col gap-0 leading-tight">
            <span className="text-2xl font-display font-black tracking-tight text-foreground whitespace-nowrap uppercase">Ride<span className="text-primary italic">Suraksha</span></span>
            <span className="text-[8px] font-bold tracking-[0.2em] text-muted-foreground uppercase opacity-60 whitespace-nowrap">Parametric Oracle</span>
          </div>
        </div>

        <div className="hidden lg:flex items-center gap-10">
          {[
            { label: "Protocols", href: "/dashboard" },
            { label: "Ecosystem", href: "/zones" },
            { label: "Governance", href: "#" },
            { label: "Network", href: "/triggers" }
          ].map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="text-[11px] font-black uppercase tracking-[0.16em] text-white/50 hover:text-white transition-all duration-300 relative group"
            >
              {item.label}
              <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-gradient-to-r from-primary to-secondary transition-all duration-500 group-hover:w-full" />
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <Link href="/dashboard">
            <Button className="rounded-xl glass border border-white/10 px-6 font-bold uppercase text-[11px] h-10 hover:bg-primary hover:text-white hover:border-primary/50 hover:neon-primary transition-all">
              Access Dashboard
            </Button>
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col pt-24 pb-12 px-6 md:px-12 max-w-[1400px] mx-auto w-full gap-16 md:gap-28 relative z-10">
        <section className="relative flex flex-col items-start min-h-[65vh] md:min-h-[85vh] gap-8">
          {/* 3D Hero Element - Precisely positioned to touch the 'E' in 'SHIELD' */}
          <div className="absolute top-[18%] translate-y-[-50%] left-[45%] lg:left-[48%] z-0 pointer-events-none anime-hero-image opacity-0 overflow-visible scale-[0.7] lg:scale-[1] w-[400px] h-[400px] lg:w-[800px] lg:h-[800px] flex items-center justify-start">
            <div className="absolute inset-0 bg-gradient-to-tr from-primary/15 to-secondary/15 rounded-full blur-[100px] opacity-20 animate-glow-pulse scale-75" />
            <div className="w-full h-full relative">
              <HeroShield />
              <div className="absolute inset-x-0 bottom-0 h-1/4 bg-gradient-to-t from-background via-transparent to-transparent" />
            </div>
          </div>

          <div className="w-full lg:w-3/5 relative z-10 flex flex-col items-start text-left pt-12">
            <div className="space-y-12 anime-hero-content w-full">
              <div className="inline-flex items-center gap-2.5 glass rounded-full px-5 py-2 text-[10px] font-bold uppercase tracking-[0.1em] text-secondary opacity-0 self-start">
                <Sparkles size={14} className="text-secondary animate-pulse" />
                <span>Hyper-Local Protection Protocol</span>
              </div>

              <div className="space-y-6 opacity-0 relative">
                <h1 className="text-5xl sm:text-7xl md:text-8xl lg:text-[110px] font-display font-black tracking-tighter leading-[0.8] text-white uppercase drop-shadow-2xl flex flex-col">
                  <span className="relative">
                    SHIELD THE
                  </span>
                  <span className="text-primary italic">DRIVEN.</span>
                </h1>
                <div className="h-2 w-48 bg-primary rounded-full shadow-[0_0_20px_rgba(255,70,37,0.6)]" />
              </div>

              <p className="max-w-xl text-base md:text-lg text-white/70 leading-relaxed border-l-2 border-primary/40 pl-8 py-3 opacity-0 backdrop-blur-sm bg-white/[0.02] rounded-r-2xl">
                Autonomous safety nets for India&apos;s essential gig workforce.
                Real-time environmental synchronization providing <span className="text-white font-bold text-shadow-glow">instant payouts</span> during climate emergencies.
              </p>

              <div className="flex flex-row items-center gap-3 md:gap-6 pt-6 opacity-0">
                <Link href="/dashboard" className="flex-1 sm:flex-none">
                  <Button size="lg" className="w-full sm:w-auto rounded-xl sm:rounded-2xl bg-primary hover:bg-primary/90 text-white font-bold uppercase h-12 sm:h-16 px-4 sm:px-12 text-[10px] sm:text-sm shadow-[0_10px_30px_rgba(255,70,37,0.45)] hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2 sm:gap-4 border-none">
                    Enter Console
                    <ArrowRight className="size-4 sm:size-5" />
                  </Button>
                </Link>
                <Link href="#" className="flex-1 sm:flex-none">
                  <Button variant="ghost" size="lg" className="w-full sm:w-auto rounded-xl sm:rounded-2xl font-bold uppercase h-12 sm:h-16 px-4 sm:px-10 text-[10px] sm:text-sm hover:bg-secondary/10 hover:text-secondary transition-all flex items-center justify-center gap-2 sm:gap-4 group border border-white/5 backdrop-blur-md">
                    <div className="size-6 sm:size-10 rounded-full glass flex items-center justify-center group-hover:neon-secondary transition-all shadow-inner">
                      <PlayCircle className="size-4 sm:size-6 text-secondary fill-current" />
                    </div>
                    The Protocol
                  </Button>
                </Link>
              </div>
            </div>
          </div>

          {/* Floating tactical card - Re-anchored to avoid central clutter */}
          <div className="absolute right-0 bottom-20 group lg:opacity-100 hidden lg:block z-20">
            <div className="p-8 rounded-[2rem] glass-strong border border-white/10 flex items-center gap-10 shadow-2xl animate-float-slow backdrop-blur-3xl">
              <div className="space-y-2">
                <p className="text-[10px] uppercase font-black text-muted-foreground tracking-[0.25em]">Payout Velocity</p>
                <div className="flex items-center gap-4">
                  <p className="text-5xl font-bold text-white tabular-nums font-mono tracking-tighter shrink-0 leading-none">0.14s</p>
                  <div className="px-3 py-1.5 rounded-full bg-success/15 border border-success/20 text-[10px] font-black text-success uppercase neon-success whitespace-nowrap">Instant</div>
                </div>
              </div>
              <div className="size-16 rounded-[1.25rem] bg-primary/15 flex items-center justify-center border border-primary/20 shrink-0 shadow-[0_0_30px_rgba(255,70,37,0.2)]">
                <ShieldCheck className="size-9 text-primary shadow-glow" />
              </div>
            </div>
          </div>
        </section>

        {/* Scrolling Banner */}
        <section className="py-8 border-y border-white/5 relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/[0.03] via-transparent to-secondary/[0.03]" />
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-y-6 lg:gap-8 relative z-10 px-4 max-w-[1200px] mx-auto">
            {["AQI MONITORING", "PRECIPITATION ORACLE", "HEATWAVE PROTECTION", "SMART CONTRACT PAYOUTS"].map((item, i) => (
              <div key={i} className="flex items-center justify-center lg:justify-start gap-3 anime-banner-item opacity-0 group-hover:opacity-100 transition-all duration-500 py-1 px-2">
                <div className="size-1.5 bg-secondary rounded-full neon-secondary animate-pulse shrink-0" />
                <span className="text-[8px] md:text-[10px] lg:text-[11px] font-black uppercase tracking-[0.15em] lg:tracking-[0.25em] text-white/40 group-hover:text-white/80 transition-colors text-center whitespace-nowrap">{item}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Feature Grid — Glassmorphism Cards */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              icon: CloudRain,
              title: "Precipitation",
              desc: "Hyper-local monitoring of rainfall intensity. Automatic indexing for high-volume precipitation events.",
              color: "bg-fs-blue",
              iconColor: "text-white",
            },
            {
              icon: Wind,
              title: "Pollution",
              desc: "Active intervention for hazardous air quality levels. Dynamic thresholds synchronized with national AQI feeds.",
              color: "bg-fs-purple",
              iconColor: "text-white",
            },
            {
              icon: ThermometerSun,
              title: "Thermal",
              desc: "Tactical heat-index monitoring. Integrated rest-period incentives during peak tropical heat events.",
              color: "bg-fs-yellow",
              iconColor: "text-white",
            }
          ].map((feature, i) => (
            <div key={feature.title} className="group p-8 rounded-3xl glass-subtle card-glow flex flex-col gap-6 hover:translate-y-[-4px] transition-all duration-300 anime-feature-card opacity-0">
              <div className={cn("size-16 rounded-2xl flex items-center justify-center shadow-lg transition-transform group-hover:scale-110", feature.color)}>
                <feature.icon className={cn("size-8", feature.iconColor)} strokeWidth={2.5} />
              </div>
              <div className="space-y-3">
                <h3 className="text-3xl font-display font-black tracking-tight text-foreground leading-none uppercase">{feature.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed font-medium">
                  {feature.desc}
                </p>
              </div>
              <div className="mt-auto pt-4">
                <div className="flex items-center gap-2 text-primary text-[11px] font-bold uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-all group-hover:translate-x-1 duration-500">
                  Integrate Protocol <ChevronRight size={14} />
                </div>
              </div>
            </div>
          ))}
        </section>

        {/* World Statistics */}
        <section className="p-8 md:p-14 rounded-2xl md:rounded-3xl glass card-glow relative overflow-hidden flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-14 group anime-stats-section opacity-0">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,70,37,0.08)_0%,transparent_40%)] pointer-events-none" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_80%,rgba(0,216,255,0.05)_0%,transparent_40%)] pointer-events-none" />
          
          <div className="w-full lg:max-w-xl flex flex-col items-start text-left space-y-8 relative z-10">
            <div className="flex items-center gap-3 text-secondary font-black uppercase tracking-[0.2em] text-[10px] sm:text-[11px]">
              <Globe className="size-4 animate-spin-slow text-secondary" />
              African Operations Phase
            </div>
            <h2 className="text-5xl sm:text-6xl md:text-7xl font-display font-black tracking-tight leading-[0.85] uppercase">
              Covering the <br /> <span className="text-secondary italic">Pan-African</span>
            </h2>
            <p className="text-sm sm:text-base text-white/60 leading-relaxed font-medium max-w-lg">
              By EOFY 2026, RideSuraksha will provide parametric protection to over 4 million gig workers across the African continent and reaching the Global South.
            </p>
            <Button className="h-14 px-10 rounded-xl bg-secondary hover:bg-secondary/90 text-white font-black uppercase shadow-[0_10px_30px_rgba(0,216,255,0.3)] border-none transition-all hover:scale-105 active:scale-95 w-full sm:w-auto flex items-center justify-center gap-3">
              Explore Africa <MapPin size={18} />
            </Button>
          </div>

          <div className="grid grid-cols-2 gap-4 sm:gap-6 w-full lg:w-auto relative z-10">
            {[
              { label: "Active Riders", val: "1.2M+" },
              { label: "Platform Nodes", val: "84" },
              { label: "Safety Payouts", val: "$4.1M" },
              { label: "Response Time", val: "2s" },
            ].map((stat, i) => (
              <div key={i} className="p-5 md:p-8 rounded-2xl glass-subtle border border-white/5 hover:border-secondary/30 transition-all duration-500 flex flex-col justify-center items-center lg:items-start min-w-[140px] md:min-w-[180px]">
                <p className="text-3xl md:text-5xl font-display font-black text-white tabular-nums tracking-tighter leading-none shrink-0">{stat.val}</p>
                <div className="h-0.5 w-6 bg-secondary/30 my-3 lg:my-4 hidden lg:block" />
                <p className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] text-white/40 mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Footer */}
        <footer className="pt-20 flex flex-col gap-14 border-t border-white/5">
          <div className="flex flex-col md:flex-row justify-between items-start gap-12">
            <div className="space-y-4 max-w-sm">
              <div className="flex items-center gap-3">
                <div className="size-9 rounded-xl bg-primary flex items-center justify-center shadow-[0_0_15px_rgba(255,70,37,0.3)]">
                  <Zap className="size-5 text-white fill-current" />
                </div>
                <h4 className="text-3xl font-display font-black tracking-tight uppercase">RideSuraksha</h4>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                The world&apos;s first decentralized parametric insurance oracle built specifically for the vulnerable gig-economy nodes.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-6 md:gap-14 w-full md:w-auto">
              {[
                { title: "Protocol", links: ["Documentation", "Audit", "GitHub", "Paper"] },
                { title: "Company", links: ["Ecosystem", "Founders", "Regions", "Careers"] },
                { title: "Legal", links: ["Privacy", "Standard", "AML", "Terms"] }
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
            <span className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground opacity-40">© 2026 RideSuraksha Autonomous DAO. All Rights Reserved.</span>
            <div className="flex items-center gap-6">
              <span className="text-[9px] font-bold uppercase tracking-widest px-3 py-1 glass rounded-full text-success border border-success/20 neon-success">Oracle Sync: Active</span>
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
