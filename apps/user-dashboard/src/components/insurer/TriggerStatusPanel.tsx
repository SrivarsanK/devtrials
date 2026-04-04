import { useMemo } from 'react';
import { useDashboardStore } from '@/store/dashboardStore';
import { useTriggers } from '@/hooks/useTriggers';
import { TriggerCard } from './TriggerCard';
import { cn } from '@/lib/utils';
import { Activity, Radio } from 'lucide-react';

const statusPriority: Record<string, number> = {
  TRIGGERED: 0,
  WATCH: 1,
  NORMAL: 2,
};

export function TriggerStatusPanel() {
  const { loading } = useTriggers();
  const activeTriggers = useDashboardStore((s) => s.activeTriggers);
  const socketConnected = useDashboardStore((s) => s.socketConnected);

  const sorted = useMemo(
    () =>
      [...activeTriggers].sort(
        (a, b) => (statusPriority[a.status] ?? 3) - (statusPriority[b.status] ?? 3)
      ),
    [activeTriggers]
  );

  const activeCount = activeTriggers.filter((t) => t.status !== 'NORMAL').length;

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-8 bg-white/5 rounded-xl w-48 animate-pulse" />
        {[...Array(3)].map((_, i) => (
          <div key={i} className="glass-subtle rounded-2xl p-6 animate-pulse border border-white/5">
            <div className="h-4 bg-white/5 rounded w-2/3 mb-4" />
            <div className="h-2 bg-white/5 rounded-full" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
            <div className="size-8 rounded-lg bg-primary/10 flex items-center justify-center shadow-lg neon-primary">
                <Radio className="size-5 text-primary" />
            </div>
            <h2 className="text-2xl font-display font-black text-white uppercase tracking-tight leading-none">Oracle Stream</h2>
        </div>
        <div className="flex items-center gap-4">
             <div className="flex items-center gap-2 group cursor-pointer glass-subtle px-3 py-1 rounded-full border-white/5">
                <div
                    className={cn(
                        "size-1.5 rounded-full",
                        socketConnected ? 'bg-success neon-success animate-pulse' : 'bg-danger neon-danger'
                    )}
                />
                <span className="text-[9px] font-black uppercase tracking-[0.15em] text-muted-foreground group-hover:text-foreground transition-colors">
                    {socketConnected ? 'Real-time' : 'Halted'}
                </span>
            </div>
            {activeCount > 0 && (
                <div className="px-3 py-1 rounded-full bg-danger/10 text-danger border border-danger/30 text-[9px] font-black uppercase tracking-widest neon-danger">
                    {activeCount} Anomalies
                </div>
            )}
        </div>
      </div>

      {/* Trigger grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {sorted.map((trigger) => (
          <TriggerCard key={trigger.id} trigger={trigger} />
        ))}
      </div>
    </div>
  );
}
