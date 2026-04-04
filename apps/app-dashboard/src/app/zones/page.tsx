'use client';

import { ReserveHealthWidget } from '@/components/insurer/ReserveHealthWidget';
import { MapPin, Sparkles, LayoutDashboard } from 'lucide-react';
import { useSocket } from '@/hooks/useSocket';

export default function ZonesPage() {
  useSocket(); // maintain live connection

  return (
    <div className="max-w-[1500px] mx-auto px-6 md:px-10 py-10 space-y-12">
      <header className="space-y-6">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="h-[2px] w-8 bg-gradient-to-r from-secondary to-transparent rounded-full" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground opacity-60">Node Inventory</span>
          </div>
        </div>
        
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg glass-subtle text-[10px] font-black uppercase tracking-[0.12em] text-primary">
            <Sparkles className="size-3.5 animate-pulse" />
            <span>Node Governance Center</span>
          </div>
          <h1 className="text-[clamp(2rem,5vw,3.5rem)] font-display font-black tracking-tighter text-foreground uppercase leading-[0.85]">
            Regional <br /> <span className="text-secondary italic">Hubs</span>
          </h1>
          <p className="max-w-xl text-sm md:text-base text-muted-foreground leading-relaxed font-medium opacity-80">
            Control center for all synchronized hub nodes. Manage reserves, adjust liability exposure, and override circuit breakers.
          </p>
        </div>
      </header>

      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h2 className="text-3xl font-display font-black text-foreground tracking-tight uppercase">Reserve Segmentation</h2>
            <div className="h-1.5 w-12 bg-secondary rounded-full" />
          </div>
          <div className="flex items-center gap-2">
             <MapPin className="size-4 text-primary" />
             <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">3 Cities • 15 Micro-Zones</span>
          </div>
        </div>

        <ReserveHealthWidget />
      </section>
    </div>
  );
}
