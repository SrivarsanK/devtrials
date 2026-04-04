'use client';

import { useDashboardStore } from '@/store/dashboardStore';
import { useForecasts } from '@/hooks/useForecasts';
import { AlertCircle, Map, Navigation, PauseCircle, PlayCircle, ShieldAlert, Cpu, TrendingUp } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

export function ForecastPanel() {
  const { loading } = useForecasts();
  const forecasts = useDashboardStore((s) => s.forecasts);
  const pausedZones = useDashboardStore((s) => s.pausedZones);
  const toggleZonePause = useDashboardStore((s) => s.toggleZonePause);

  if (loading) {
    return (
      <div className="glass card-glow rounded-3xl border border-white/5 p-6 h-full animate-pulse flex flex-col gap-4">
          <div className="h-8 bg-white/5 rounded-xl w-1/2" />
          <div className="flex-1 bg-white/5 rounded-2xl" />
      </div>
    );
  }

  const totalLiabilityLakhs = forecasts.reduce((sum, f) => sum + f.predictedPayoutLakhs, 0);
  const isReinsuranceAlert = totalLiabilityLakhs > 50;

  return (
    <div className="flex flex-col h-full glass card-glow rounded-3xl border border-white/5 p-6 relative overflow-hidden group">
      <div className="absolute inset-0 bg-gradient-to-br from-secondary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-1000" />
      
      <header className="flex items-center justify-between mb-6 relative z-10">
        <div className="flex items-center gap-4">
            <div className="size-10 rounded-xl bg-secondary/10 flex items-center justify-center shadow-lg neon-secondary">
                <Cpu className="size-6 text-secondary" />
            </div>
            <div>
                <h3 className="text-xl font-display font-black text-white uppercase tracking-tight leading-none">Neural Forecast</h3>
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-1.5 opacity-50">72h Liability Projection</p>
            </div>
        </div>
        <div className="px-3 py-1 rounded-full glass-subtle border border-white/5 text-[9px] font-black uppercase tracking-widest text-muted-foreground">
          LSTM Model v4.0
        </div>
      </header>

      {isReinsuranceAlert && (
        <div className="mb-6 bg-danger/10 border border-danger/30 rounded-2xl p-4 flex items-start gap-4 relative z-10 animate-float">
          <div className="size-10 rounded-xl bg-danger/20 flex items-center justify-center shrink-0 shadow-lg neon-danger">
            <ShieldAlert className="size-5 text-danger" />
          </div>
          <div>
            <p className="text-danger text-[10px] font-black uppercase tracking-widest">Reinsurance Alert Active</p>
            <p className="text-white/70 text-[11px] font-medium leading-relaxed mt-1.5">
              Active liability projection ({totalLiabilityLakhs.toFixed(1)}L) exceeds ₹50.0L threshold. Munich Re sync initiated.
            </p>
          </div>
        </div>
      )}

      {/* Table Header */}
      <div className="grid grid-cols-12 gap-4 pb-3 border-b border-white/5 text-[9px] font-black uppercase font-semibold tracking-[0.15em] text-muted-foreground/40 mb-3 px-2 relative z-10">
        <div className="col-span-5">Risk Zone</div>
        <div className="col-span-3 text-center">Trigger</div>
        <div className="col-span-4 text-right">Proj. Exposure</div>
      </div>

      {/* Scrollable list */}
      <div className="flex-1 overflow-y-auto space-y-2 custom-scrollbar pr-2 relative z-10">
        {forecasts.map((forecast) => {
          const isPaused = pausedZones.has(forecast.zone) || forecast.riskStatus === 'RED';
          
          let riskDot = 'bg-success';
          let glowClass = 'neon-success';
          if (forecast.riskStatus === 'AMBER') {
              riskDot = 'bg-warning';
              glowClass = 'neon-warning';
          }
          if (forecast.riskStatus === 'RED') {
              riskDot = 'bg-danger animate-pulse-red';
              glowClass = 'neon-danger';
          }

          return (
            <div
              key={`${forecast.city}-${forecast.zone}`}
              className="grid grid-cols-12 gap-4 py-3 items-center glass-subtle border border-white/5 hover:border-white/10 transition-all px-4 rounded-2xl group/item"
            >
              <div className="col-span-5 flex items-center gap-3">
                <div className={cn("size-2 rounded-full shrink-0 shadow-lg", riskDot, glowClass)} />
                <div className="flex flex-col min-w-0">
                    <span className="text-white font-black uppercase text-[11px] truncate tracking-tight group-hover/item:text-secondary transition-colors" title={forecast.zone}>
                    {forecast.zone}
                    </span>
                    <span className="text-muted-foreground text-[9px] font-bold uppercase tracking-widest opacity-40">{forecast.city}</span>
                </div>
              </div>
              
              <div className="col-span-3 flex justify-center">
                <span className="px-2 py-0.5 glass rounded-full border border-white/5 text-[9px] font-black uppercase tracking-widest text-secondary opacity-80">
                  {forecast.dominantTrigger}
                </span>
              </div>
              
              <div className="col-span-4 flex items-center justify-end gap-3">
                <span className="text-sm font-display font-black text-white tabular-nums tracking-tighter leading-none">
                    ₹{forecast.predictedPayoutLakhs.toFixed(1)}L
                </span>
                <div className="size-8 rounded-lg flex items-center justify-center glass-subtle border-white/5">
                    {forecast.riskStatus === 'RED' ? (
                         <PauseCircle className="size-4 text-danger animate-pulse" />
                    ) : (
                        <TrendingUp className="size-4 text-secondary opacity-40 group-hover/item:opacity-100 transition-opacity" />
                    )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
