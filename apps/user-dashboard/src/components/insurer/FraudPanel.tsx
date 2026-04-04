'use client';

import { useDashboardStore } from '@/store/dashboardStore';
import { useFraudAlerts } from '@/hooks/useFraudAlerts';
import { ShieldAlert, CheckCircle2, XCircle, Search, Fingerprint, ShieldEllipsis } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

export function FraudPanel() {
  const { loading } = useFraudAlerts();
  const fraudAlerts = useDashboardStore((s) => s.fraudAlerts);
  const resolveFraudAlert = useDashboardStore((s) => s.resolveFraudAlert);

  if (loading) {
    return (
      <div className="glass card-glow rounded-3xl border border-white/5 p-6 h-full animate-pulse flex flex-col gap-4">
          <div className="h-8 bg-white/5 rounded-xl w-1/2" />
          <div className="flex-1 bg-white/5 rounded-2xl" />
      </div>
    );
  }

  if (fraudAlerts.length === 0) {
    return (
      <div className="glass card-glow rounded-3xl border border-success/20 p-8 h-full flex flex-col items-center justify-center text-center space-y-4">
        <div className="size-16 rounded-2xl bg-success/10 flex items-center justify-center shadow-lg neon-success mb-2">
            <CheckCircle2 className="size-8 text-success" />
        </div>
        <div>
            <h4 className="text-xl font-display font-black text-white uppercase tracking-tight">Queue Synchronized</h4>
            <p className="text-xs text-muted-foreground font-medium uppercase tracking-widest mt-2 opacity-60">All nodes reporting valid claim patterns.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full glass card-glow rounded-3xl border border-white/5 p-6 relative overflow-hidden group">
      <div className="absolute inset-0 bg-gradient-to-br from-danger/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-1000" />
      
      <header className="flex items-center justify-between mb-8 relative z-10">
        <div className="flex items-center gap-4">
            <div className="size-10 rounded-xl bg-danger/10 flex items-center justify-center shadow-lg neon-danger">
                <Fingerprint className="size-6 text-danger" />
            </div>
            <div>
                <h3 className="text-xl font-display font-black text-white uppercase tracking-tight leading-none">Security Queue</h3>
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-1.5 opacity-50">Anomalous Activity Detection</p>
            </div>
        </div>
        <div className="px-3 py-1 rounded-full bg-danger/15 text-danger border border-danger/30 text-[9px] font-black uppercase tracking-widest neon-danger">
          {fraudAlerts.length} High Risk
        </div>
      </header>

      <div className="flex-1 overflow-y-auto pr-2 space-y-4 custom-scrollbar relative z-10">
        {fraudAlerts.map((alert) => {
          const isSevere = alert.fraudScore > 0.8;
          const config = isSevere
            ? { text: 'text-danger', border: 'border-danger/30', bg: 'bg-danger/10', glow: 'neon-danger' }
            : { text: 'text-warning', border: 'border-warning/30', bg: 'bg-warning/10', glow: 'neon-warning' };

          return (
            <div
              key={alert.id}
              className="p-5 rounded-2xl glass-subtle border border-white/5 hover:border-white/10 transition-all group/item hover:translate-y-[-2px] duration-300"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex flex-col">
                  <span className="text-white text-xs font-black uppercase tracking-widest leading-none">{alert.id}</span>
                  <span className="text-[9px] font-bold text-muted-foreground mt-1 opacity-50 uppercase tracking-widest">{alert.type}</span>
                </div>
                <div className={cn("px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border flex items-center gap-1.5", config.bg, config.text, config.border, config.glow)}>
                  <ShieldEllipsis className="size-3" />
                  Score {alert.fraudScore.toFixed(2)}
                </div>
              </div>

              <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60 mb-4 bg-white/5 px-3 py-2 rounded-lg">
                <div className="flex items-center gap-2">
                    <span className="text-secondary opacity-80">{alert.city}</span>
                    <span className="opacity-20">/</span>
                    <span>{alert.zone}</span>
                </div>
                <span className="text-white">₹{alert.claimAmountInr.toLocaleString('en-IN')}</span>
              </div>

              <p className="text-[11px] text-muted-foreground leading-relaxed font-medium mb-5 line-clamp-3">
                {alert.description}
              </p>

              <div className="flex items-center gap-2 mt-2 pt-4 border-t border-white/5">
                <Button
                  onClick={() => resolveFraudAlert(alert.id, 'approve')}
                    variant="ghost"
                    className="flex-1 h-9 rounded-xl glass-subtle text-success hover:bg-success/20 hover:text-success text-[9px] font-black uppercase tracking-widest border-white/5"
                >
                  Confirm
                </Button>
                <Button
                  onClick={() => resolveFraudAlert(alert.id, 'investigate')}
                    variant="ghost"
                    className="flex-1 h-9 rounded-xl glass-subtle text-warning hover:bg-warning/20 hover:text-warning text-[9px] font-black uppercase tracking-widest border-white/5"
                >
                  Hold
                </Button>
                <Button
                  onClick={() => resolveFraudAlert(alert.id, 'reject')}
                    variant="ghost"
                    className="flex-1 h-9 rounded-xl glass-subtle text-danger hover:bg-danger/20 hover:text-danger text-[9px] font-black uppercase tracking-widest border-white/5"
                >
                  Drop
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
