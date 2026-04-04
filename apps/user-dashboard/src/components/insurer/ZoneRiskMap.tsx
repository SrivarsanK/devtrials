'use client';

import dynamic from 'next/dynamic';
import { MapPin, Globe, ShieldCheck } from 'lucide-react';
import { cn } from '@/lib/utils';

// Critical: ssr:false prevents "window is not defined" crash (ZRM-001)
const LeafletMapInner = dynamic(
  () => import('./LeafletMapInner').then((m) => m.LeafletMapInner),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-[600px] glass rounded-3xl flex flex-col items-center justify-center border border-white/5 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-tr from-primary/5 to-secondary/5 animate-pulse" />
        <div className="flex flex-col items-center gap-6 text-muted-foreground relative z-10">
          <div className="size-20 rounded-2xl bg-white/5 flex items-center justify-center shadow-lg border border-white/10">
            <Globe className="size-10 text-secondary animate-spin-slow" />
          </div>
          <div className="space-y-2 text-center">
             <h4 className="text-xl font-display font-black text-white uppercase tracking-tight">Syncing Oracle Network</h4>
             <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40">Loading Geospatial Data Clusters...</p>
          </div>
        </div>
      </div>
    ),
  }
);

export function ZoneRiskMap({ className }: { className?: string }) {
  return (
    <div className={cn("glass-strong card-glow rounded-3xl border border-white/5 p-8 relative overflow-hidden group flex flex-col", className)}>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(0,216,255,0.05)_0%,transparent_50%)] pointer-events-none" />
      
      <header className="flex flex-col md:flex-row items-center justify-between mb-8 relative z-10 gap-6 shrink-0">
        <div className="flex items-center gap-4">
            <div className="size-12 rounded-xl bg-primary/10 flex items-center justify-center shadow-lg neon-primary">
                <MapPin className="size-7 text-primary" />
            </div>
            <div>
                <h3 className="text-2xl font-display font-black text-white uppercase tracking-tight leading-none">Operational Map</h3>
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-2 opacity-50">Real-time Risk Topography</p>
            </div>
        </div>
        
        <div className="flex items-center gap-6 bg-white/[0.03] px-6 py-2.5 rounded-2xl border border-white/5">
            <div className="flex items-center gap-2 group cursor-help">
                <div className="size-2 rounded-full bg-success neon-success" />
                <span className="text-[9px] font-black uppercase tracking-widest text-white/40 group-hover:text-success transition-colors">Stable</span>
            </div>
            <div className="flex items-center gap-2 group cursor-help">
                <div className="size-2 rounded-full bg-warning neon-warning animate-pulse" />
                <span className="text-[9px] font-black uppercase tracking-widest text-white/40 group-hover:text-warning transition-colors">Heightened</span>
            </div>
            <div className="flex items-center gap-2 group cursor-help">
                <div className="size-2 rounded-full bg-danger neon-danger animate-pulse-red" />
                <span className="text-[9px] font-black uppercase tracking-widest text-white/40 group-hover:text-danger transition-colors">Intervention</span>
            </div>
            <div className="w-px h-3 bg-white/10" />
            <div className="flex items-center gap-2">
                <ShieldCheck className="size-3.5 text-secondary opacity-60" />
                <span className="text-[9px] font-black uppercase tracking-widest text-secondary">Secured</span>
            </div>
        </div>
      </header>

      <div className="rounded-2xl overflow-hidden border border-white/5 shadow-2xl relative flex-1">
        <LeafletMapInner />
      </div>

      <footer className="mt-6 flex items-center justify-between shrink-0">
         <p className="text-[10px] font-bold text-muted-foreground/40 uppercase tracking-widest italic flex items-center gap-2">
           <Globe className="size-3" />
           Geo-Spatial Synchronization Active Across Mumbai, Delhi, Chennai
         </p>
      </footer>
    </div>
  );
}
