'use client';

import { TriggerStatusPanel } from '@/components/insurer/TriggerStatusPanel';
import { LossRatioChart } from '@/components/insurer/LossRatioChart';
import { Activity, Globe, Sparkles } from 'lucide-react';
import { useSocket } from '@/hooks/useSocket';

export default function TriggersPage() {
  useSocket(); // maintain live connection

  return (
    <div className="max-w-[1500px] mx-auto px-6 md:px-10 py-10 space-y-10">
      <header className="space-y-6">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="h-[2px] w-8 bg-gradient-to-r from-primary to-transparent rounded-full" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground opacity-60">Operations Stream</span>
          </div>
        </div>
        
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg glass-subtle text-[10px] font-black uppercase tracking-[0.12em] text-secondary">
            <Sparkles className="size-3.5 animate-pulse" />
            <span>Event Monitoring Console</span>
          </div>
          <h1 className="text-[clamp(2rem,5vw,3.5rem)] font-display font-black tracking-tighter text-foreground uppercase leading-[0.85]">
            Trigger <br /> <span className="text-primary italic">Live Stream</span>
          </h1>
          <p className="max-w-xl text-sm md:text-base text-muted-foreground leading-relaxed font-medium opacity-80">
            Real-time telemetry from environmental sensors. Every data point is mathematically verified by the oracle network.
          </p>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center gap-3">
                <h2 className="text-xl font-display font-black text-foreground uppercase tracking-tight">Active Transmissions</h2>
                <div className="h-px flex-1 bg-white/5" />
            </div>
            <TriggerStatusPanel />
          </div>
          <div className="lg:col-span-3 space-y-6">
            <div className="flex items-center gap-3 justify-between">
                <div className="flex items-center gap-3">
                    <h2 className="text-xl font-display font-black text-foreground uppercase tracking-tight">Velocity Trend</h2>
                    <div className="h-px w-20 bg-white/5" />
                </div>
                <div className="flex items-center gap-2">
                    <Globe className="size-4 text-secondary" />
                    <span className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground">30D Loss Ratio</span>
                </div>
            </div>
            <LossRatioChart />
          </div>
      </div>
    </div>
  );
}
