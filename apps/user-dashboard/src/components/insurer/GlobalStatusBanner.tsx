'use client';

import { useDashboardStore } from '@/store/dashboardStore';
import { Shield, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';

const statusConfig = {
  GREEN: {
    bg: 'bg-success/10',
    border: 'border-success/30',
    text: 'text-success',
    icon: CheckCircle2,
    dotClass: 'neon-success',
  },
  AMBER: {
    bg: 'bg-warning/10',
    border: 'border-warning/30',
    text: 'text-warning',
    icon: AlertTriangle,
    dotClass: 'animate-pulse-amber neon-warning',
  },
  RED: {
    bg: 'bg-danger/10',
    border: 'border-danger/30',
    text: 'text-danger',
    icon: AlertTriangle,
    dotClass: 'animate-pulse-red neon-danger',
  },
};

export function GlobalStatusBanner() {
  const reserveHealth = useDashboardStore((s) => s.reserveHealth);
  const lastUpdated = useDashboardStore((s) => s.lastUpdated);

  if (!reserveHealth) {
    return (
      <div className="w-full rounded-2xl border border-white/5 glass-subtle p-6 animate-pulse">
        <div className="h-8 bg-white/5 rounded-xl w-3/4" />
      </div>
    );
  }

  const config = statusConfig[reserveHealth.globalStatus as keyof typeof statusConfig];
  const StatusIcon = config.icon;
  const timeStr = lastUpdated
    ? new Date(lastUpdated).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Kolkata' }) + ' IST'
    : '';

  return (
    <div
      className={cn(
        "w-full rounded-3xl border-2 p-6 flex flex-col md:flex-row items-center justify-between transition-all duration-700 glass-strong shadow-2xl relative overflow-hidden group",
        config.border,
        config.bg
      )}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
      
      <div className="flex items-center gap-6 relative z-10">
        {/* Status dot */}
        <div className={cn("size-4 rounded-full", config.text.replace('text-', 'bg-'), config.dotClass)} />

        {/* Shield icon */}
        <div className={cn("size-14 rounded-2xl flex items-center justify-center glass shadow-inner transition-transform group-hover:scale-110 duration-500", config.bg)}>
            <Shield className={cn("size-8", config.text)} />
        </div>

        {/* Message */}
        <div className="space-y-1">
          <p className={cn("text-2xl font-display font-black tracking-tight uppercase leading-none", config.text)}>
            {reserveHealth.globalStatus} — {reserveHealth.globalStatus === 'GREEN' ? 'Protocols Stable' : 'Active Intervention'}
          </p>
          <p className="text-sm text-foreground/70 font-medium tracking-tight">
            {reserveHealth.globalMessage}
          </p>
        </div>
      </div>

      {/* Timestamp */}
      <div className="flex items-center gap-3 mt-4 md:mt-0 glass-subtle px-4 py-2 rounded-xl border-white/5 relative z-10">
        <StatusIcon className={cn("size-4", config.text)} />
        <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{timeStr}</span>
      </div>
    </div>
  );
}
