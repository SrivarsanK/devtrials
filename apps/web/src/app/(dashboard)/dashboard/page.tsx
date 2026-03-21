"use client";

import React, { useEffect, useState } from "react";
import StatsCard from "@/components/StatsCard";
import TriggerTable from "@/components/TriggerTable";
import { fetchTriggers, fetchZones, checkHealth, Trigger, Zone } from "@/lib/api";
import { RefreshCcw, Activity as ActivityIcon, ShieldCheck, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function DashboardPage() {
  const [triggers, setTriggers] = useState<Trigger[]>([]);
  const [zones, setZones] = useState<Zone[]>([]);
  const [health, setHealth] = useState<boolean>(false);
  const [loading, setLoading] = useState(true);

  async function init() {
    setLoading(true);
    try {
      const [t, z, h] = await Promise.all([fetchTriggers(), fetchZones(), checkHealth()]);
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

  return (
    <div className="flex flex-col gap-16 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-12">
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="h-0.5 w-12 bg-primary rounded-full shadow-[0_0_10px_var(--primary)]" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground opacity-60">GigShield Protocol v2.4</span>
          </div>
          <h1 className="text-8xl font-bebas tracking-wide text-foreground leading-[0.85]">
            Live <br /> <span className="text-primary italic">Monitoring</span>
          </h1>
          <p className="max-w-xl text-lg font-medium text-muted-foreground leading-relaxed">
            Real-time monitoring of weather and air quality triggers protecting India&apos;s gig economy across all metropolitan clusters.
          </p>
        </div>
        <div className="flex flex-col items-end gap-6 w-full md:w-auto">
          <div className="flex items-center gap-4 px-6 py-3 rounded-2xl bg-card border border-border/50 shadow-lg">
            <div className={`size-3 rounded-full ${health ? 'bg-success animate-pulse shadow-[0_0_8px_var(--success)]' : 'bg-warning shadow-[0_0_8px_var(--warning)]'}`} />
            <span className="text-sm font-black uppercase tracking-widest">{health ? 'System Operational' : 'Node Disconnect'}</span>
          </div>
          <Button 
            onClick={init}
            size="lg"
            className="rounded-2xl bg-secondary hover:bg-secondary/90 text-secondary-foreground font-black uppercase h-16 px-10 shadow-xl shadow-secondary/10 hover:scale-105 active:scale-95 transition-all w-full md:w-auto group"
          >
            <RefreshCcw className={loading ? "animate-spin mr-3" : "mr-3 group-hover:rotate-180 transition-transform duration-500"} size={20} />
            Synchronize Feed
          </Button>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        <StatsCard 
          title="Active Alerts" 
          value={triggers.filter(t => t.status === "ACTIVE").length} 
          icon="zap" 
          status={health ? "active" : "danger"} 
          subtitle="Real-time trigger pipeline"
        />
        <StatsCard 
          title="Protected Hubs" 
          value={zones.length} 
          icon="map" 
          subtitle="Indian Metropolitan Coverage"
        />
        <StatsCard 
          title="Yield Index" 
          value="1.24x" 
          icon="trend" 
          subtitle="Current Payout Velocity"
        />
      </div>

      <section className="space-y-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h2 className="text-5xl font-bebas text-foreground tracking-wide">Activity Stream</h2>
            <div className="h-0.5 w-24 bg-gradient-to-r from-primary to-transparent" />
          </div>
          <button className="text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors flex items-center gap-2 group">
            View Analytics
            <ArrowUpRight className="size-3 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
          </button>
        </div>
        
        <div className="rounded-[3rem] border border-border bg-card/10 backdrop-blur-sm overflow-hidden shadow-2xl relative group">
           <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5 opacity-30 group-hover:opacity-60 transition-opacity duration-1000" />
           <TriggerTable triggers={triggers} loading={loading} />
        </div>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mt-10">
        <div className="p-10 rounded-[3rem] border border-border bg-card/30 backdrop-blur-md relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-10 opacity-10 group-hover:scale-110 transition-transform duration-700">
            <ShieldCheck className="size-24 text-primary" />
          </div>
          <div className="relative z-10 space-y-6">
            <h4 className="text-4xl font-bebas tracking-wide">Immutable Logging</h4>
            <p className="text-sm font-medium text-muted-foreground leading-relaxed">
              Every environmental trigger is hashed and stored in our distributed ledger, ensuring total transparency between platforms and gig workers.
            </p>
            <div className="flex items-center gap-4 text-[10px] font-bold uppercase tracking-widest text-primary">
               Verification Verified
               <div className="size-1.5 bg-primary rounded-full" />
            </div>
          </div>
        </div>
        
        <div className="p-10 rounded-[3rem] border border-border bg-card/30 backdrop-blur-md relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-10 opacity-10 group-hover:scale-110 transition-transform duration-700">
            <ActivityIcon className="size-24 text-secondary" />
          </div>
          <div className="relative z-10 space-y-6">
            <h4 className="text-4xl font-bebas tracking-wide">Health Metrics</h4>
            <p className="text-sm font-medium text-muted-foreground leading-relaxed">
              Global monitoring nodes are operating within normal latency thresholds. Data ingestion pipeline v4.0 is active across all regions.
            </p>
            <div className="flex items-center gap-4 text-[10px] font-bold uppercase tracking-widest text-secondary">
               Latency: 24ms
               <div className="size-1.5 bg-secondary rounded-full" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
