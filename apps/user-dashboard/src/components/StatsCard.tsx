"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Activity,
  AlertTriangle,
  CheckCircle2,
  Clock,
  TrendingUp,
  MapPin,
  Zap,
  IndianRupee,
  Layers,
  LucideIcon
} from "lucide-react";
import { cn } from "@/lib/utils";
import { animate } from "animejs";

const iconMap: Record<string, LucideIcon> = {
  "activity": Activity,
  "alert": AlertTriangle,
  "check": CheckCircle2,
  "clock": Clock,
  "trend": TrendingUp,
  "map": MapPin,
  "zap": Zap,
  "rupee": IndianRupee,
  "layers": Layers,
};

interface StatsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: string;
  status?: 'active' | 'warning' | 'danger';
}

export default function StatsCard({ title, value, subtitle, icon, status }: StatsCardProps) {
  const cardRef = React.useRef<HTMLDivElement>(null);
  const iconRef = React.useRef<HTMLDivElement>(null);
  const LucideIcon = iconMap[icon] || Activity;

  // Map status to Fireship colors
  const statusColor = status === 'active' ? 'bg-fs-green' : 
                     status === 'warning' ? 'bg-fs-yellow' : 
                     status === 'danger' ? 'bg-fs-red' : 'bg-fs-blue';

  const onMouseEnter = () => {
    if (cardRef.current) {
        animate(cardRef.current, {
          scale: 1.02,
          duration: 400,
          ease: 'easeOutElastic(1, .6)'
        });
    }
    if (iconRef.current) {
        animate(iconRef.current, {
          rotate: '15deg',
          scale: 1.2,
          duration: 600,
          ease: 'spring(1, 80, 10, 0)'
        });
    }
  };

  const onMouseLeave = () => {
    if (cardRef.current) {
        animate(cardRef.current, {
          scale: 1,
          duration: 400,
          ease: 'easeOutExpo'
        });
    }
    if (iconRef.current) {
        animate(iconRef.current, {
          rotate: '0deg',
          scale: 1,
          duration: 600,
          ease: 'spring(1, 80, 10, 0)'
        });
    }
  };

  return (
    <Card 
      ref={cardRef}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      className="rounded-2xl glass-subtle card-glow transition-all duration-300 group overflow-hidden border-white/[0.05] hover:border-white/[0.1] cursor-pointer"
    >
      <div className="flex p-4 items-center gap-5">
        <div 
          ref={iconRef}
          className={cn(
            "size-14 rounded-xl flex items-center justify-center shrink-0 shadow-lg transition-transform duration-500",
            statusColor
          )}
        >
          <LucideIcon className="size-7 text-white drop-shadow-sm" strokeWidth={2.5} />
        </div>
        
        <div className="flex-1 min-w-0">
          <CardTitle className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground group-hover:text-primary transition-colors">
            {title}
          </CardTitle>
          <div className="text-3xl font-black text-foreground tabular-nums tracking-tighter mt-0.5">
            {value}
          </div>
          {subtitle && (
            <p className="text-[10px] font-bold text-muted-foreground mt-0.5 opacity-60 uppercase tracking-tight">
              {subtitle}
            </p>
          )}
        </div>
      </div>
    </Card>
  );
}
