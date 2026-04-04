'use client';

import { useSocket } from '@/hooks/useSocket';
import { ReserveHealthWidget } from './ReserveHealthWidget';
import { TriggerStatusPanel } from './TriggerStatusPanel';
import { LossRatioChart } from './LossRatioChart';
import { FraudPanel } from './FraudPanel';
import { ForecastPanel } from './ForecastPanel';
import { ZoneRiskMap } from './ZoneRiskMap';
import { ShieldCheck, Activity, Globe, RefreshCcw, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { cn } from '@/lib/utils';

export function DashboardClient() {
  useSocket();
  const [loading, setLoading] = useState(false);

  const handleSync = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 1500);
  };

  return (
    <div className="flex flex-col gap-10 pb-20">

      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 relative z-10">
        <div className="space-y-6 flex-1">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="h-[2px] w-8 bg-gradient-to-r from-primary to-transparent rounded-full" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground opacity-60">RideSuraksha Protocol v4.2.0</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1 rounded-full glass-strong border border-white/[0.05]">
              <div className="size-1.5 rounded-full bg-success neon-success animate-pulse" />
              <span className="text-[9px] font-black uppercase tracking-[0.1em] text-foreground/80">System Operational</span>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg glass-subtle text-[10px] font-black uppercase tracking-[0.12em] text-secondary">
              <Sparkles className="size-3.5 animate-pulse" />
              <span>Insurer Command Center</span>
            </div>
            <h1 className="text-[clamp(2.5rem,6vw,4.5rem)] font-display font-black tracking-tighter text-foreground uppercase leading-[0.85]">
              Operations <br /> <span className="text-secondary italic">Intelligence</span>
            </h1>
            <p className="max-w-xl text-sm md:text-base text-muted-foreground leading-relaxed font-medium opacity-80">
              High-fidelity monitoring of risk exposure and payout velocity across the <span className="text-white font-bold">ShieldLife</span> parametric insurance network.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 group">
          <Button
            onClick={handleSync}
            size="lg"
            className="rounded-xl bg-secondary text-white font-black uppercase h-12 px-8 text-[11px] tracking-[0.15em] shadow-[0_0_25px_rgba(0,216,255,0.25)] hover:scale-105 active:scale-95 transition-all group border-none"
          >
            <RefreshCcw className={cn("size-4 mr-2", loading ? "animate-spin" : "group-hover:rotate-180 transition-transform duration-700")} />
            Real-time Sync
          </Button>
        </div>
      </header>
      
      <section className="relative z-10">
        <ReserveHealthWidget />
      </section>
      
      <section className="space-y-6 relative z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h2 className="text-3xl font-display font-black text-foreground tracking-tight uppercase">Monitoring Stream</h2>
            <div className="h-1.5 w-12 bg-primary rounded-full shadow-[0_0_15px_rgba(255,70,37,0.4)]" />
          </div>
          <div className="flex items-center gap-2 group cursor-pointer">
            <Globe className="size-4 text-secondary group-hover:animate-spin-slow" />
            <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground group-hover:text-foreground transition-colors">Cross-Region Nodes</span>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          <div className="lg:col-span-2">
            <TriggerStatusPanel />
          </div>
          <div className="lg:col-span-3">
            <LossRatioChart />
          </div>
        </div>
      </section>

      <section className="space-y-6 relative z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h2 className="text-3xl font-display font-black text-foreground tracking-tight uppercase">Risk Intelligence</h2>
            <div className="h-1.5 w-12 bg-secondary rounded-full shadow-[0_0_15px_rgba(0,216,255,0.4)]" />
          </div>
          <div className="flex items-center gap-2">
             <Activity className="size-4 text-primary animate-pulse" />
             <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Neural Analysis Active</span>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          <div className="lg:col-span-2">
            <FraudPanel />
          </div>
          <div className="lg:col-span-3">
            <ForecastPanel />
          </div>
        </div>
      </section>

      <section className="space-y-6 relative z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h2 className="text-3xl font-display font-black text-foreground tracking-tight uppercase">Global Coverage</h2>
            <div className="h-1.5 w-12 bg-white/20 rounded-full" />
          </div>
        </div>
        <div className="rounded-2xl overflow-hidden glass card-glow border-white/5">
          <ZoneRiskMap />
        </div>
      </section>
    </div>
  );
}
