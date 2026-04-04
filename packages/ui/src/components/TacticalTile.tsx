"use client";

import React from "react";
import { LucideIcon } from "lucide-react";
import { cn } from "../lib/utils";
import { useLanguage } from "./LanguageContext";

interface TacticalTileProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  subtitle?: string;
  trend?: {
    value: string;
    isUp: boolean;
  };
  variant?: "primary" | "secondary" | "success" | "warning" | "danger";
  className?: string;
}

export function TacticalTile({ 
  title, 
  value, 
  icon: Icon, 
  subtitle, 
  trend, 
  variant = "primary",
  className 
}: TacticalTileProps) {
  const { t } = useLanguage();

  const variantColors = {
    primary: "text-primary shadow-[0_0_15px_rgba(255,159,74,0.3)]",
    secondary: "text-[#e4e2e1] shadow-[0_0_15px_rgba(228,226,225,0.2)]",
    success: "text-success shadow-[0_0_15px_rgba(0,200,150,0.3)]",
    warning: "text-warning shadow-[0_0_15px_rgba(255,200,0,0.3)]",
    danger: "text-danger shadow-[0_0_15px_rgba(255,45,85,0.3)]",
  };

  const neonBorders = {
    primary: "hover:shadow-[0_0_20px_-5px_rgba(255,159,74,0.4)]",
    secondary: "hover:shadow-[0_0_20px_-5px_rgba(228,226,225,0.3)]",
    success: "hover:shadow-[0_0_20px_-5px_rgba(0,200,150,0.4)]",
    warning: "hover:shadow-[0_0_20px_-5px_rgba(255,200,0,0.4)]",
    danger: "hover:shadow-[0_0_20px_-5px_rgba(255,45,85,0.4)]",
  };

  return (
    <div 
      className={cn(
        "group relative p-6 rounded-2xl glass-subtle border border-white/[0.04] transition-all duration-500 card-glow overflow-hidden h-full flex flex-col justify-between",
        neonBorders[variant],
        className
      )}
    >
      {/* Background Decor */}
      <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-110 transition-transform duration-700 pointer-events-none">
        <Icon className="size-24" />
      </div>

      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-4">
          <div className={cn("p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.06] transition-all group-hover:bg-white/[0.08]")}>
            <Icon className={cn("size-5", variantColors[variant])} />
          </div>
          <h3 className="text-[10px] font-black uppercase tracking-[0.16em] text-muted-foreground whitespace-nowrap">
            {t(title)}
          </h3>
        </div>

        <div className="space-y-1">
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-freeroad-black tracking-tighter uppercase leading-none truncate max-w-full">
              {value}
            </span>
            {trend && (
              <span className={cn(
                "text-[10px] font-black px-1.5 py-0.5 rounded-md uppercase",
                trend.isUp ? "bg-success/20 text-success" : "bg-warning/20 text-warning"
              )}>
                {trend.isUp ? "↑" : "↓"}{trend.value}
              </span>
            )}
          </div>
          {subtitle && (
            <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/60">
              {t(subtitle)}
            </p>
          )}
        </div>
      </div>

      <div className="mt-8 relative z-10 flex items-center justify-between">
        <div className="h-1 flex-1 bg-white/[0.05] rounded-full overflow-hidden mr-4">
          <div className={cn("h-full transition-all duration-1000", variant === "primary" ? "bg-primary" : "bg-muted-foreground/20")} style={{ width: '40%' }} />
        </div>
        <button className="text-[9px] font-black uppercase tracking-widest text-primary hover:text-white transition-colors">
          Details
        </button>
      </div>

      {/* Tonal Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/[0.01] via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
    </div>
  );
}

