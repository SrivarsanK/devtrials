'use client';

import { ZoneRiskMap } from '@/components/insurer/ZoneRiskMap';
import { Globe, Sparkles } from 'lucide-react';
import { useSocket } from '@/hooks/useSocket';

export default function RiskMapPage() {
  useSocket(); // maintain live connection

  return (
    <div className="w-full px-6 md:px-10 pt-6 pb-2 space-y-6 h-[calc(100vh-80px)] flex flex-col">
      <header className="space-y-6 shrink-0">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="h-[2px] w-8 bg-gradient-to-r from-secondary to-transparent rounded-full" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground opacity-60">Visual Telemetry</span>
          </div>
        </div>
        
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg glass-subtle text-[10px] font-black uppercase tracking-[0.12em] text-secondary">
            <Sparkles className="size-3.5 animate-pulse" />
            <span>Interactive Risk Map</span>
          </div>
          <h1 className="text-[clamp(2.5rem,5vw,3.5rem)] font-display font-black tracking-tighter text-foreground uppercase leading-[0.85]">
            Live Map <br /> <span className="text-secondary italic">Operations</span>
          </h1>
        </div>
      </header>

      <section className="flex-1 w-full bg-background rounded-2xl overflow-hidden glass border-white/5 relative z-10 card-glow">
          <div className="absolute top-0 right-0 p-6 z-20">
              <div className="flex items-center gap-2 px-3 py-2 rounded-lg glass-strong border border-white/[0.05]">
                <div className="size-2 rounded-full bg-success neon-success animate-pulse" />
                <span className="text-[9px] font-black uppercase tracking-[0.1em] text-foreground/80">Spatial Oracle Active</span>
              </div>
          </div>
          <ZoneRiskMap className="h-full" />
      </section>
    </div>
  );
}
