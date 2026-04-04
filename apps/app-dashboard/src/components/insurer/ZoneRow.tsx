'use client';

import { ZoneReserve } from '@/types';
import { useDashboardStore } from '@/store/dashboardStore';
import { CircuitBreakerToggle } from './CircuitBreakerToggle';
import { cn } from '@/lib/utils';
import { ShieldCheck, ShieldAlert, ShieldX } from 'lucide-react';

interface ZoneRowProps {
  zone: ZoneReserve;
}

const statusConfig: Record<string, { dot: string; text: string; glow: string; icon: any }> = {
  GREEN: {
    dot: 'bg-success',
    glow: 'neon-success',
    text: 'text-success',
    icon: ShieldCheck,
  },
  AMBER: {
    dot: 'bg-warning animate-pulse-amber',
    glow: 'neon-warning',
    text: 'text-warning',
    icon: ShieldAlert,
  },
  RED: {
    dot: 'bg-danger animate-pulse-red',
    glow: 'neon-danger',
    text: 'text-danger',
    icon: ShieldX,
  },
};

export function ZoneRow({ zone }: ZoneRowProps) {
  const pausedZones = useDashboardStore((s) => s.pausedZones);
  const isPaused = pausedZones.has(zone.id) || zone.issuancesPaused;
  const config = statusConfig[zone.status as keyof typeof statusConfig];

  return (
    <div className="grid grid-cols-12 items-center py-4 px-6 rounded-xl hover:bg-white/[0.04] transition-all duration-300 group border-b border-white/[0.02]">
      {/* Zone Name */}
      <div className="col-span-4 flex items-center gap-4">
        <div className={cn("size-2 rounded-full", config.dot, config.glow)} />
        <div className="flex flex-col">
            <span className="text-sm font-black uppercase tracking-tight text-white group-hover:text-secondary transition-colors">{zone.name}</span>
            <span className="text-[9px] font-bold text-muted-foreground/50 uppercase tracking-widest">Cluster Node {zone.id.split('-')[1]}</span>
        </div>
      </div>

      {/* Coverage Status */}
      <div className="col-span-4 flex flex-col items-center justify-center">
        <div className={cn("flex items-center gap-2 px-3 py-1 rounded-full glass-subtle border-white/5", config.text)}>
            <config.icon className="size-3" />
            <span className="text-[10px] font-black uppercase tracking-widest leading-none">
                {zone.coverageRatioPercent}% Healthy
            </span>
        </div>
      </div>

      {/* Liquidity + Controls */}
      <div className="col-span-4 flex items-center justify-end gap-8">
        <div className="text-right hidden sm:block">
            <p className="text-[10px] font-display font-black text-white tabular-nums tracking-tight">
                ₹{zone.reserveLakhs}L <span className="text-white/20">/</span> <span className="text-primary/70">₹{zone.liabilityLakhs}L</span>
            </p>
        </div>
        <div className="flex items-center gap-4 min-w-[100px] justify-end">
            <div className={cn("text-[9px] font-black uppercase tracking-widest transition-colors", isPaused ? "text-danger" : "text-success")}>
                {isPaused ? "OFFLINE" : "ACTIVE"}
            </div>
            <CircuitBreakerToggle zoneId={zone.id} isPaused={isPaused} />
        </div>
      </div>
    </div>
  );
}
