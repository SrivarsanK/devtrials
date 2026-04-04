'use client';

import { useState } from 'react';
import { CityReserveSummary } from '@/types';
import { ChevronDown, ChevronUp, MapPin, Activity } from 'lucide-react';
import { ZoneRow } from './ZoneRow';
import { cn } from '@/lib/utils';

interface CityCardProps {
  cityData: CityReserveSummary;
  defaultExpanded?: boolean;
}

const statusColors: Record<string, { dot: string; badge: string; badgeText: string; glow: string }> = {
  GREEN: {
    dot: 'bg-success',
    glow: 'neon-success',
    badge: 'bg-success/15 border-success/30',
    badgeText: 'text-success',
  },
  AMBER: {
    dot: 'bg-warning animate-pulse-amber',
    glow: 'neon-warning',
    badge: 'bg-warning/15 border-warning/30',
    badgeText: 'text-warning',
  },
  RED: {
    dot: 'bg-danger animate-pulse-red',
    glow: 'neon-danger',
    badge: 'bg-danger/15 border-danger/30',
    badgeText: 'text-danger',
  },
};

export function CityCard({ cityData, defaultExpanded = false }: CityCardProps) {
  const [expanded, setExpanded] = useState(defaultExpanded);
  const colors = statusColors[cityData.status as keyof typeof statusColors];

  return (
    <div className="glass card-glow rounded-2xl border border-white/5 overflow-hidden transition-all duration-500 hover:border-white/10 group">
      {/* Card Header — clickable */}
      <button
        onClick={() => setExpanded(!expanded)}
        className={cn(
            "w-full flex items-center justify-between px-6 py-5 hover:bg-white/[0.03] transition-all duration-300 relative overflow-hidden",
            expanded ? "bg-white/[0.02]" : ""
        )}
      >
        <div className="flex items-center gap-6 relative z-10">
          {/* Status dot */}
          <div className={cn("size-3 rounded-full shadow-lg", colors.dot, colors.glow)} />

          <div className="flex items-center gap-4">
              <div className="size-10 rounded-xl glass-subtle flex items-center justify-center shrink-0 border-white/5 group-hover:scale-110 transition-transform">
                <MapPin className="size-5 text-secondary" strokeWidth={2.5} />
              </div>
              <div className="text-left">
                <h3 className="text-2xl font-display font-black text-white uppercase tracking-tight leading-none">{cityData.city}</h3>
                <div className="flex items-center gap-2 mt-1.5">
                    <span
                        className={cn("px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-[0.15em] border", colors.badge, colors.badgeText)}
                    >
                        {cityData.status}
                    </span>
                    <span className="text-[10px] font-bold text-muted-foreground/60 uppercase racking-widest">Metropolitan Hub</span>
                </div>
              </div>
          </div>
        </div>

        <div className="flex items-center gap-8 relative z-10">
          {/* Quick stats */}
          <div className="text-right hidden sm:block border-l border-white/5 pl-8">
            <p className="text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-1 opacity-50">Active Nodes</p>
            <div className="flex items-center gap-2">
                <Activity className="size-3 text-secondary animate-pulse" />
                <span className="text-xl font-display font-black text-white tabular-nums tracking-tight">
                    {cityData.activePolicies.toLocaleString('en-IN')}
                </span>
            </div>
          </div>
          <div className="text-right hidden md:block border-l border-white/5 pl-8">
            <p className="text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-1 opacity-50">Reserve / Liability</p>
            <div className="flex items-center gap-2">
                <span className="text-lg font-display font-black text-white tabular-nums tracking-tighter">
                ₹{cityData.reserveLakhs}L <span className="text-white/20 mx-1">/</span> <span className="text-secondary opacity-80">₹{cityData.liabilityLakhs}L</span>
                </span>
            </div>
          </div>

          {/* Chevron */}
          <div className={cn("size-10 rounded-full glass-subtle flex items-center justify-center border-white/5 transition-transform duration-500", expanded ? "rotate-180" : "")}>
            <ChevronDown className="size-5 text-muted-foreground" />
          </div>
        </div>
      </button>

      {/* Expanded zone rows */}
      <div
        className={cn(
            "transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] overflow-hidden",
            expanded ? "max-h-[1000px] opacity-100 py-4" : "max-h-0 opacity-0"
        )}
      >
        <div className="px-6 space-y-2">
           <div className="grid grid-cols-12 px-6 py-2 text-[9px] font-black uppercase tracking-widest text-muted-foreground/50 border-b border-white/5 mb-2">
                <div className="col-span-4">Zone Cluster</div>
                <div className="col-span-4 text-center">Protocol Status</div>
                <div className="col-span-4 text-right">Liquidity Health</div>
           </div>
           {cityData.zones.map((zone) => (
            <ZoneRow key={zone.id} zone={zone} />
          ))}
        </div>
      </div>
    </div>
  );
}
