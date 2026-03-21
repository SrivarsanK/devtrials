"use client";

import Link from "next/link";
import React from "react";
import { ArrowRight, Zap, ShieldCheck, MapPin, Wind, CloudRain, ThermometerSun, PlayCircle, Globe, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground overflow-x-hidden">
      {/* Top Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 h-24 border-b border-border/10 bg-background/50 backdrop-blur-xl flex items-center px-6 md:px-12 justify-between">
        <div className="flex items-center gap-4">
          <div className="size-12 rounded-2xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20 rotate-3 group-hover:rotate-0 transition-transform">
            <Zap className="size-7 text-primary-foreground fill-current" />
          </div>
          <div className="flex flex-col">
            <span className="text-3xl font-bebas tracking-wide leading-none">GigShield</span>
            <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-primary opacity-80 mt-1">Parametric Oracle</span>
          </div>
        </div>
        
        <div className="hidden lg:flex items-center gap-12">
          {["Protocols", "Ecosystem", "Governance", "Network"].map((item) => (
            <Link 
              key={item} 
              href="#" 
              className="text-xs font-black uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors relative group"
            >
              {item}
              <span className="absolute -bottom-2 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full" />
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-4">
           <Link href="/dashboard">
             <Button variant="outline" className="rounded-xl border-border bg-card/50 px-8 font-black uppercase text-xs h-12 hover:bg-primary hover:text-primary-foreground transition-all">
                Access Dashboard
             </Button>
           </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col pt-32 pb-24 px-6 md:px-12 max-w-[1400px] mx-auto w-full gap-32">
        <section className="relative grid grid-cols-1 lg:grid-cols-2 gap-20 items-center min-h-[70vh]">
          <div className="space-y-12 z-10 animate-in fade-in slide-in-from-left-8 duration-1000">
            <div className="inline-flex items-center gap-3 bg-primary/10 text-primary px-6 py-2 rounded-2xl border border-primary/20 text-[11px] font-black uppercase tracking-[0.1em] shadow-lg shadow-primary/5">
              <Zap size={16} className="fill-primary" />
              <span className="opacity-90">Hyper-Local Protection Protocol active</span>
            </div>
            
            <div className="space-y-6">
              <h1 className="text-7xl md:text-8xl lg:text-[130px] font-bebas tracking-wide leading-[0.8] text-foreground transition-all hover:tracking-[0.05em] duration-700">
                Shield the <br /> 
                <span className="text-primary italic animate-pulse">Driven.</span>
              </h1>
              <div className="h-1.5 w-40 bg-gradient-to-r from-primary to-transparent rounded-full shadow-[0_0_15px_var(--primary)]" />
            </div>
            
            <p className="max-w-xl text-xl font-medium text-muted-foreground leading-relaxed border-l-4 border-primary/40 pl-10 py-4 italic">
            Autonomous safety nets for India&apos;s essential gig workforce. 
            Real-time environmental synchronization providing <span className="text-foreground font-black underline decoration-primary underline-offset-4">instant payouts</span> during climate emergencies.
            </p>
            
            <div className="flex flex-wrap gap-8 pt-8">
              <Link href="/dashboard">
                <Button size="lg" className="rounded-2xl bg-primary hover:bg-primary/90 text-primary-foreground font-black uppercase h-20 px-12 text-lg shadow-2xl shadow-primary/30 hover:scale-110 active:scale-95 transition-all flex items-center gap-4 group">
                  Enter Console 
                  <ArrowRight className="size-6 group-hover:translate-x-2 transition-transform" />
                </Button>
              </Link>
              <Button variant="ghost" size="lg" className="rounded-2xl font-black uppercase h-20 px-10 text-lg hover:bg-secondary/10 hover:text-secondary transition-all flex items-center gap-4 group">
                <div className="size-10 rounded-full bg-secondary/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <PlayCircle className="size-6 text-secondary fill-current" />
                </div>
                The Protocol
              </Button>
            </div>
          </div>
          
          <div className="relative group animate-in fade-in slide-in-from-right-8 duration-1000">
            <div className="absolute -inset-10 bg-gradient-to-tr from-primary/30 to-secondary/30 rounded-[3rem] blur-3xl opacity-30 group-hover:opacity-60 transition-opacity duration-1000" />
            <div className="relative p-2 rounded-[3.5rem] bg-gradient-to-br from-border/50 to-transparent border border-border shadow-2xl overflow-hidden">
               <div className="aspect-[4/5] overflow-hidden rounded-[3rem]">
                <img 
                  src="https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&q=80&w=2070" 
                  alt="Gig Economy Worker" 
                  className="w-full h-full object-cover grayscale-[0.3] contrast-[1.2] group-hover:grayscale-0 transition-all duration-1000 group-hover:scale-105" 
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-transparent pointer-events-none" />
              
              {/* Floating tactical card */}
              <div className="absolute bottom-10 left-10 right-10 p-8 rounded-3xl bg-card/40 backdrop-blur-2xl border border-white/10 flex items-center justify-between shadow-2xl translate-y-4 group-hover:translate-y-0 transition-transform duration-700">
                <div className="space-y-1">
                  <p className="text-[10px] uppercase font-black text-muted-foreground tracking-[0.2em] opacity-60">Payout Velocity</p>
                  <div className="flex items-center gap-4">
                    <p className="text-4xl font-black text-foreground tabular-nums tracking-tighter">0.14s</p>
                    <div className="px-2 py-0.5 rounded-full bg-success/20 border border-success/30 text-[9px] font-black text-success uppercase">Instant</div>
                  </div>
                </div>
                <div className="size-16 rounded-2xl bg-primary/20 flex items-center justify-center border border-primary/30 shadow-inner">
                  <ShieldCheck className="size-8 text-primary" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Tactical Feed Banner */}
        <section className="py-12 border-y border-border/10 flex flex-wrap gap-12 justify-between items-center opacity-50 grayscale hover:opacity-100 hover:grayscale-0 transition-all duration-700 overflow-hidden relative">
           <div className="absolute inset-0 bg-primary/5 -skew-y-1 scale-110" />
           {["AQI MONITORING", "PRECIPITATION ORACLE", "HEATWAVE PROTECTION", "SMART CONTRACT Payouts"].map((item, i) => (
             <div key={i} className="flex items-center gap-4 relative z-10">
               <div className="size-2 bg-primary rounded-full shadow-[0_0_8px_var(--primary)]" />
               <span className="text-xs font-black uppercase tracking-[0.2em]">{item}</span>
             </div>
           ))}
        </section>

        {/* Feature Grid */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {[
            {
              icon: CloudRain,
              title: "Precipitation",
              desc: "Hyper-local monitoring of rainfall intensity. Automatic indexing for high-volume precipitation events.",
              accent: "from-blue-500/10 to-transparent",
              border: "group-hover:border-blue-500/30"
            },
            {
              icon: Wind,
              title: "Pollution",
              desc: "Active intervention for hazardous air quality levels. Dynamic thresholds synchronized with national AQI feeds.",
              accent: "from-primary/10 to-transparent",
              border: "group-hover:border-primary/30"
            },
            {
              icon: ThermometerSun,
              title: "Thermal",
              desc: "Tactical heat-index monitoring. Integrated rest-period incentives during peak tropical heat events.",
              accent: "from-warning/10 to-transparent",
              border: "group-hover:border-warning/30"
            }
          ].map((feature, i) => (
            <div key={i} className={cn(
              "group relative p-12 rounded-[3rem] border border-border bg-card/30 backdrop-blur-md overflow-hidden transition-all duration-1000 h-full flex flex-col justify-end min-h-[400px]",
              feature.border
            )}>
              <div className={cn("absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-1000", feature.accent)} />
              <div className="absolute top-12 left-12 p-5 rounded-2xl bg-background/50 border border-border group-hover:scale-110 group-hover:shadow-xl transition-all duration-700">
                <feature.icon className="size-10 text-primary" strokeWidth={2.5} />
              </div>
              <div className="relative z-10 space-y-4">
                <h3 className="text-5xl font-bebas tracking-wide text-foreground leading-none">{feature.title}</h3>
                <p className="text-base font-medium text-muted-foreground leading-relaxed italic line-clamp-3">{feature.desc}</p>
                <div className="flex items-center gap-2 text-primary text-[10px] font-black uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity group-hover:translate-x-2 duration-500">
                  Integrate Protocol <ChevronRight size={14} />
                </div>
              </div>
            </div>
          ))}
        </section>

        {/* World Statistics */}
        <section className="p-16 rounded-[4rem] bg-card border border-border shadow-2xl relative overflow-hidden flex flex-col lg:flex-row items-center justify-between gap-16 group">
           <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,var(--primary)_0%,transparent_25%)] opacity-5" />
           <div className="space-y-8 relative z-10 lg:max-w-xl">
             <div className="flex items-center gap-4 text-primary font-black uppercase tracking-widest text-xs">
                <Globe className="size-5 animate-spin-slow" />
                Global Expansion Phase
             </div>
             <h2 className="text-7xl md:text-8xl font-bebas tracking-wide leading-[0.9]">
                Covering the <br /> <span className="text-primary italic">Global South</span>
             </h2>
             <p className="text-lg font-medium text-muted-foreground leading-relaxed">
               By EOFY 2026, GigShield will provide parametric protection to over 4 million gig workers across the African and South-Asian continents.
             </p>
             <Button variant="outline" className="h-16 px-10 rounded-2xl border-2 border-primary text-primary font-black uppercase hover:bg-primary hover:text-primary-foreground transition-all flex items-center gap-3">
               Explore Territories <MapPin size={18} />
             </Button>
           </div>

           <div className="grid grid-cols-2 gap-8 w-full lg:w-auto">
              {[
                { label: "Active Riders", val: "1.2M+" },
                { label: "Platform Nodes", val: "84" },
                { label: "Safety Payouts", val: "$4.1M" },
                { label: "Response Time", val: "2s" },
              ].map((stat, i) => (
                <div key={i} className="p-8 rounded-3xl bg-background/50 border border-border group-hover:border-primary/20 transition-colors">
                  <p className="text-6xl font-bebas text-foreground tabular-nums tracking-wide">{stat.val}</p>
                  <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mt-2">{stat.label}</p>
                </div>
              ))}
           </div>
        </section>

        {/* Footer */}
        <footer className="pt-24 flex flex-col gap-16 border-t border-border/10">
          <div className="flex flex-col md:flex-row justify-between items-start gap-12">
            <div className="space-y-6 max-w-sm">
              <div className="flex items-center gap-4">
                <div className="size-10 rounded-xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20">
                  <Zap className="size-6 text-primary-foreground fill-current" />
                </div>
                <h4 className="text-4xl font-bebas tracking-wide">GigShield</h4>
              </div>
              <p className="text-sm font-medium text-muted-foreground leading-relaxed italic">
                The world&apos;s first decentralized parametric insurance oracle built specifically for the vulnerable gig-economy nodes.
              </p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-16">
              {[
                { title: "Protocol", links: ["Documentation", "Audit", "GitHub", "Paper"] },
                { title: "Company", links: ["Ecosystem", "Founders", "Regions", "Careers"] },
                { title: "Legal", links: ["Privacy", "Standard", "AML", "Terms"] }
              ].map((section) => (
                <div key={section.title} className="space-y-6">
                  <h5 className="text-[11px] font-black uppercase tracking-[0.2em] text-foreground">{section.title}</h5>
                  <ul className="space-y-4">
                    {section.links.map(link => (
                      <li key={link}>
                        <Link href="#" className="text-xs font-bold text-muted-foreground hover:text-primary transition-colors">{link}</Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row justify-between items-center py-12 border-t border-border/10 gap-8">
            <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground opacity-40">© 2026 GigShield Autonomous DAO. All Rights Reserved.</span>
            <div className="flex items-center gap-8">
               <span className="text-[9px] font-bold uppercase tracking-widest px-3 py-1 bg-success/10 text-success rounded-full border border-success/20">Oracle Sync: Active</span>
               <div className="flex gap-6">
                  <Globe className="size-5 text-muted-foreground hover:text-white transition-colors cursor-pointer" />
                  <Zap className="size-5 text-muted-foreground hover:text-white transition-colors cursor-pointer" />
                  <ShieldCheck className="size-5 text-muted-foreground hover:text-white transition-colors cursor-pointer" />
               </div>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}
