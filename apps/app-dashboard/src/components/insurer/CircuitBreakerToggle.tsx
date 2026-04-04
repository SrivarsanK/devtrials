'use client';

import { useDashboardStore } from '@/store/dashboardStore';
import { cn } from '@/lib/utils';
import { Power, PowerOff } from 'lucide-react';

interface CircuitBreakerToggleProps {
  zoneId: string;
  isPaused: boolean;
}

export function CircuitBreakerToggle({ zoneId, isPaused }: CircuitBreakerToggleProps) {
  const toggleZonePause = useDashboardStore((s) => s.toggleZonePause);

  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        toggleZonePause(zoneId);
      }}
      className={cn(
        "size-9 flex items-center justify-center rounded-xl border transition-all duration-500 shadow-lg group active:scale-90",
        isPaused
          ? 'bg-danger/20 text-danger border-danger/40 hover:bg-danger/30 neon-danger'
          : 'bg-success/20 text-success border-success/40 hover:bg-success/30 neon-success'
      )}
    >
      {isPaused ? (
        <PowerOff className="size-4 animate-pulse" />
      ) : (
        <Power className="size-4 group-hover:rotate-12 transition-transform" />
      )}
    </button>
  );
}
