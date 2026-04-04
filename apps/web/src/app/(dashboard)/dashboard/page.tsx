"use client";

import React, { useEffect, useState } from "react";
import { StatsCard } from "@repo/ui";
import { TriggerTable } from "@repo/ui";
import { fetchTriggers, fetchZones, fetchHealth, Trigger, Zone } from "@/lib/api";
import { RefreshCcw, Activity as ActivityIcon, ShieldCheck, ArrowUpRight } from "lucide-react";
import {} from "@repo/ui";
import anime from "animejs";
import { useUser } from "@clerk/nextjs";

export default function DashboardPage() {
  const { user, isLoaded } = useUser();
  const [triggers, setTriggers] = useState<Trigger[]>([]);
  const [zones, setZones] = useState<Zone[]>([]);
  const [health, setHealth] = useState<boolean>(false);
  const [loading, setLoading] = useState(true);

  async function init() {
    setLoading(true);
    try {
      // Trigger a poll to get latest weather data from APIs (including AccuWeather)
      const { manualPoll } = await import("@/lib/api");
      try {
        await manualPoll();
      } catch (pollErr) {
        console.warn("Manual poll failed, using existing cache", pollErr);
      }

      const [t, z, h] = await Promise.all([fetchTriggers(), fetchZones(), fetchHealth()]);
      setTriggers(t);
      setZones(z);
      setHealth(h);
    } catch (err) {
      console.error("Data fetch error", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    init();
  }, []);

  useEffect(() => {
    if (loading) return;

    // Orchestrate the entrance timeline
    const tl = anime.timeline({
      easing: 'easeOutExpo',
      duration: 1200
    });

    tl.add({
      targets: '.anime-header > *',
      translateY: [40, 0],
      opacity: [0, 1],
      delay: anime.stagger(150),
    })
    .add({
      targets: '.anime-stats-card',
      scale: [0.8, 1],
      opacity: [0, 1],
      rotateX: [-20, 0],
      delay: anime.stagger(100),
      easing: 'spring(1, 80, 10, 0)',
    }, '-=800')
    .add({
      targets: '.anime-stream-title',
      translateX: [-50, 0],
      opacity: [0, 1],
    }, '-=1000')
    .add({
      targets: '.anime-trigger-table',
      translateY: [30, 0],
      opacity: [0, 1],
    }, '-=800')
    .add({
      targets: '.anime-info-card',
      scale: [0.95, 1],
      translateY: [20, 0],
      opacity: [0, 1],
      delay: anime.stagger(200),
    }, '-=800');

  }, [loading]);

  return (
    <div className="flex flex-col gap-[clamp(2rem,5vh,4rem)]">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 md:gap-12 anime-header relative">
        <div className="flex-1 space-y-4 md:space-y-6 opacity-0 min-w-0">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="h-[2px] w-8 bg-gradient-to-r from-primary to-transparent rounded-full" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground opacity-60">GigShield Protocol v2.4</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1 rounded-full glass-strong border border-white/[0.05]">
              <div className={`size-1.5 rounded-full ${health ? 'bg-success neon-success animate-pulse' : 'bg-warning'}`} />
              <span className="text-[9px] font-black uppercase tracking-[0.1em] text-foreground/80">{health ? 'Operational' : 'Offline'}</span>
            </div>
          </div>
          
          <div className="space-y-4">
            <h1 className="text-[clamp(2.3rem,8vw,5rem)] font-display font-black tracking-tighter text-foreground uppercase leading-[0.8] shrink-0">
              Welcome, <br /> <span className="text-secondary italic">{isLoaded && user ? user.firstName : "Auditor"}</span>
            </h1>
            <p className="max-w-xl text-sm md:text-base text-muted-foreground leading-relaxed font-medium opacity-80 mt-4">
              Real-time monitoring of weather and air quality triggers for <span className="text-white font-bold">{isLoaded && user ? user.fullName : "Verified Auditor"}</span> across all metropolitan clusters.
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-4 pb-2 group opacity-0 w-full md:w-auto overflow-hidden">
          <Button
            onClick={init}
            size="sm"
            className="rounded-xl bg-secondary text-white font-bold uppercase h-11 px-8 text-[11px] tracking-[0.15em] shadow-[0_0_25px_rgba(0,216,255,0.25)] hover:scale-105 active:scale-95 transition-all group border-none w-fit"
          >
            <RefreshCcw className={loading ? "animate-spin mr-2" : "mr-2 group-hover:rotate-180 transition-transform duration-500"} size={14} />
            <span className="whitespace-nowrap">Synchronize</span>
          </Button>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="anime-stats-card opacity-0">
          <StatsCard
            title="Active Alerts"
            value={triggers.filter(t => t.status === "ACTIVE").length}
            icon="zap"
            status={health ? "active" : "danger"}
            subtitle="Real-time trigger pipeline"
          />
        </div>
        <div className="anime-stats-card opacity-0">
          <StatsCard
            title="Protected Hubs"
            value={zones.length}
            icon="map"
            subtitle="Indian Metropolitan Coverage"
          />
        </div>
        <div className="anime-stats-card opacity-0">
          <StatsCard
            title="Yield Index"
            value="1.24x"
            icon="trend"
            subtitle="Current Payout Velocity"
          />
        </div>
      </div>

      <section className="space-y-6">
        <div className="flex items-center justify-between anime-stream-title opacity-0">
          <div className="flex items-center gap-3">
            <h2 className="text-4xl font-display font-black text-foreground tracking-tight uppercase">Activity Stream</h2>
            <div className="h-2 w-16 bg-primary rounded-full" />
          </div>
          <button className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground hover:text-secondary transition-colors flex items-center gap-1.5 group">
            View Analytics
            <ArrowUpRight className="size-3 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </button>
        </div>

        <div className="rounded-2xl glass card-glow overflow-hidden relative group anime-trigger-table opacity-0">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/3 via-transparent to-secondary/3 opacity-0 group-hover:opacity-100 transition-opacity duration-1000 pointer-events-none" />
          <TriggerTable triggers={triggers} loading={loading} />
        </div>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-8 rounded-2xl glass card-glow relative overflow-hidden group anime-info-card opacity-0">
          <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-110 transition-transform duration-700">
            <ShieldCheck className="size-20 text-primary" />
          </div>
          <div className="relative z-10 space-y-4">
            <h4 className="text-3xl font-display font-black tracking-tight uppercase">Immutable Logging</h4>
            <p className="text-sm text-muted-foreground leading-relaxed font-medium">
              Every environmental trigger is hashed and stored in our distributed ledger, ensuring total transparency between platforms and gig workers.
            </p>
            <div className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-widest text-primary">
              Verification Verified
              <div className="size-2 bg-primary rounded-full" />
            </div>
          </div>
        </div>

        <div className="p-8 rounded-2xl glass card-glow relative overflow-hidden group anime-info-card opacity-0">
          <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-110 transition-transform duration-700">
            <ActivityIcon className="size-20 text-secondary" />
          </div>
          <div className="relative z-10 space-y-4">
            <h4 className="text-3xl font-display font-black tracking-tight uppercase">Health Metrics</h4>
            <p className="text-sm text-muted-foreground leading-relaxed font-medium">
              Global monitoring nodes are operating within normal latency thresholds. Data ingestion pipeline v4.0 is active across all regions.
            </p>
            <div className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-widest text-secondary">
              Latency: 24ms
              <div className="size-2 bg-secondary rounded-full" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

