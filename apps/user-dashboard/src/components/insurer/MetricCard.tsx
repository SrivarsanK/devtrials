import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MetricCardProps {
  label: string;
  value: string;
  color: 'green' | 'amber' | 'red' | 'blue' | 'white';
  icon: LucideIcon;
  subtitle?: string;
}

const colorMap = {
  green: {
    text: 'text-success',
    border: 'border-l-success',
    iconBg: 'bg-success/10',
    glow: 'neon-success',
  },
  amber: {
    text: 'text-warning',
    border: 'border-l-warning',
    iconBg: 'bg-warning/10',
    glow: 'neon-warning',
  },
  red: {
    text: 'text-danger',
    border: 'border-l-danger',
    iconBg: 'bg-danger/10',
    glow: 'neon-danger',
  },
  blue: {
    text: 'text-secondary',
    border: 'border-l-secondary',
    iconBg: 'bg-secondary/10',
    glow: 'neon-secondary',
  },
  white: {
    text: 'text-white',
    border: 'border-l-white/20',
    iconBg: 'bg-white/5',
    glow: '',
  },
};

export function MetricCard({ label, value, color, icon: Icon, subtitle }: MetricCardProps) {
  const colors = colorMap[color];

  return (
    <div
      className={cn(
        "glass-subtle rounded-2xl border-l-[6px] p-6 hover:scale-[1.03] transition-all duration-500 cursor-default group card-glow",
        colors.border
      )}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-3">
          <p className="text-[10px] font-black uppercase tracking-[0.25em] text-muted-foreground">{label}</p>
          <p className={cn("text-3xl font-display font-black tracking-tight leading-none uppercase", colors.text)}>{value}</p>
          {subtitle && <p className="text-[10px] font-bold text-muted-foreground/60 uppercase tracking-widest">{subtitle}</p>}
        </div>
        <div className={cn("size-12 rounded-xl flex items-center justify-center shadow-lg transition-transform group-hover:scale-110", colors.iconBg, colors.glow)}>
          <Icon className={cn("size-6", colors.text)} />
        </div>
      </div>
    </div>
  );
}
