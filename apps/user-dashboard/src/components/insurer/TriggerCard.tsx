'use client';

import { TriggerEvent } from '@/types';
import { cn } from '@/lib/utils';
import { AlertCircle, Eye, CheckCircle2, TrendingUp } from 'lucide-react';

interface TriggerCardProps {
  trigger: TriggerEvent;
}

const statusConfig: Record<string, { bg: string; text: string; border: string; glow: string; icon: any }> = {
  NORMAL: { bg: 'bg-success/15', text: 'text-success', border: 'border-success/30', glow: 'neon-success', icon: CheckCircle2 },
  WATCH: { bg: 'bg-warning/15', text: 'text-warning', border: 'border-warning/30', glow: 'neon-warning', icon: Eye },
  TRIGGERED: { bg: 'bg-danger/15', text: 'text-danger', border: 'border-danger/30', glow: 'neon-danger', icon: AlertCircle },
};

const barColor: Record<string, string> = {
  NORMAL: 'bg-success',
  WATCH: 'bg-warning',
  TRIGGERED: 'bg-danger',
};

export function TriggerCard({ trigger }: TriggerCardProps) {
  const config = statusConfig[trigger.status] || statusConfig.NORMAL;

  return (
    <div className="glass card-glow rounded-2xl border border-white/5 p-5 hover:border-white/10 transition-all duration-500 group relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-tr from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
      
      {/* Header: name + badge */}
      <div className="flex items-center justify-between mb-4 relative z-10">
        <span className="text-sm font-black uppercase tracking-tight text-white group-hover:text-secondary transition-colors duration-500">{trigger.name}</span>
        <div
          className={cn("px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest border flex items-center gap-1.5", config.bg, config.text, config.border, config.glow)}
        >
          <config.icon className="size-3" />
          {trigger.status}
        </div>
      </div>

      {/* Progress bar */}
      <div className="space-y-2 relative z-10">
          <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
            <div
              className={cn("h-full rounded-full transition-all duration-1000 ease-out shadow-lg", barColor[trigger.status], config.glow)}
              style={{ width: `${Math.min(trigger.progressPercent, 100)}%` }}
            />
          </div>

          <div className="flex justify-between items-center">
            <div className="flex items-center gap-1.5">
                <TrendingUp className={cn("size-3", config.text)} />
                <p className="text-[10px] font-bold text-muted-foreground/70 uppercase tracking-widest">
                    {trigger.currentValue} / {trigger.thresholdLabel}
                </p>
            </div>
            <span className="text-[10px] font-black text-white/50">{Math.round(trigger.progressPercent)}%</span>
          </div>
      </div>

      {/* Pre-warning chip */}
      {trigger.status === 'WATCH' && trigger.progressPercent > 85 && (
        <div className="mt-4 animate-float relative z-10">
          <div className="bg-warning/10 text-warning text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-xl border border-warning/20 flex items-center gap-2">
            <AlertCircle className="size-3 animate-pulse" />
            Forecast: Critical Threshold In ~4h
          </div>
        </div>
      )}

      {/* Expanded TRIGGERED detail */}
      {trigger.status === 'TRIGGERED' && (
        <div className="border-t border-white/5 mt-4 pt-4 flex flex-col gap-2 relative z-10">
          <div className="flex justify-between items-center">
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Workers Affected</span>
            <span className="text-xs font-black text-danger neon-danger tabular-nums leading-none">
              {trigger.affectedWorkers?.toLocaleString('en-IN')}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Payout Estimation</span>
            <span className="text-sm font-display font-black text-white tabular-nums tracking-tighter leading-none">
              ₹{trigger.estimatedPayoutLakhs}L
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
