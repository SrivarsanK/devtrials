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
  const LucideIcon = iconMap[icon] || Activity;

  return (
    <Card className="rounded-xl border border-border bg-card/40 backdrop-blur-md shadow-sm hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 group">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-6">
        <CardTitle className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground group-hover:text-primary transition-colors">
          {title}
        </CardTitle>
        <div className="flex items-center gap-2">
           <LucideIcon className="size-4 text-primary opacity-70 group-hover:opacity-100 group-hover:scale-110 transition-all" />
           {status && (
             <div className={`h-1.5 w-1.5 rounded-full ${
               status === 'active' ? 'bg-success shadow-[0_0_8px_var(--success)]' :
               status === 'warning' ? 'bg-warning shadow-[0_0_8px_var(--warning)]' :
               'bg-danger shadow-[0_0_8px_var(--danger)]'
             }`} />
           )}
        </div>
      </CardHeader>
      <CardContent className="px-6 pb-6">
        <div className="text-3xl font-bold text-foreground tabular-nums tracking-tight">{value}</div>
        {subtitle && (
          <p className="text-[10px] font-medium text-muted-foreground mt-1 opacity-60">
            {subtitle}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
