"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, ChevronDown, ChevronUp, Radio, Ruler, Navigation } from "lucide-react";
import { cn } from "@/lib/utils";
import anime from "animejs";

interface ZoneCardProps {
  zone: {
    id: string;
    name: string;
    region?: string;
    city?: string;
    currentRisk?: string;
    center?: { lat: number; lng: number };
    radius?: number;
    monitoredServices?: string[];
  };
}

export function ZoneCard({ zone }: ZoneCardProps) {
  const [expanded, setExpanded] = React.useState(false);
  const cardRef = React.useRef<HTMLDivElement>(null);
  const iconRef = React.useRef<HTMLDivElement>(null);

  const handleEnter = () => {
    anime({
      targets: cardRef.current,
      scale: 1.02,
      duration: 400,
      easing: 'easeOutQuad'
    });
    anime({
      targets: iconRef.current,
      rotate: '12deg',
      scale: 1.1,
      duration: 600,
      easing: 'spring(1, 80, 10, 0)'
    });
  };

  const handleLeave = () => {
    anime({
      targets: cardRef.current,
      scale: 1,
      duration: 400,
      easing: 'easeOutQuad'
    });
    anime({
      targets: iconRef.current,
      rotate: '0deg',
      scale: 1,
      duration: 600,
      easing: 'spring(1, 80, 10, 0)'
    });
  };

  const riskColor = zone.currentRisk === 'High' ? 'bg-fs-red shadow-[0_0_15px_rgba(255,50,50,0.4)]' : 
                   zone.currentRisk === 'Medium' ? 'bg-fs-yellow shadow-[0_0_15px_rgba(255,200,50,0.4)]' : 
                   'bg-fs-green shadow-[0_0_15px_rgba(0,255,150,0.4)]';

  return (
    <Card
      ref={cardRef}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      className={cn(
        "rounded-2xl glass card-glow transition-all duration-300 cursor-pointer overflow-hidden group/card border-white/[0.05]",
        expanded && "ring-1 ring-primary/20 bg-[#12121a]/80"
      )}
      onClick={() => setExpanded(!expanded)}
    >
      <CardHeader className="flex flex-row items-center justify-between space-y-0 p-5">
        <div className="flex items-center gap-4">
          <div ref={iconRef} className={cn("flex aspect-square size-12 items-center justify-center rounded-2xl transition-all duration-300", riskColor)}>
            <MapPin className="size-6 text-white" strokeWidth={2.5} />
          </div>
          <div>
            <CardTitle className="text-xl font-display font-black tracking-tight text-white group-hover/card:text-primary transition-colors leading-none uppercase">
              {zone.name}
            </CardTitle>
            <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest mt-1.5 opacity-60">
              Region: {(zone.region || zone.city || "Unknown").toUpperCase()}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2.5">
          <div className={cn("h-2 w-2 rounded-full", zone.currentRisk === 'High' ? 'bg-fs-red animate-pulse' : 'bg-fs-green')} />
          {expanded ? <ChevronUp className="size-4 text-white/20" /> : <ChevronDown className="size-4 text-white/20" />}
        </div>
      </CardHeader>

      <CardContent className="px-5 pb-5 pt-0">
        <div className={cn(
          "grid gap-3 overflow-hidden transition-all duration-500 ease-in-out",
          expanded ? "max-h-[500px] opacity-100 mt-3 border-t border-white/[0.06] pt-3" : "max-h-0 opacity-0"
        )}>
          {zone.center && (
            <div className="flex items-center justify-between group">
              <div className="flex items-center gap-2 text-[9px] font-black uppercase text-white/40 group-hover:text-white transition-colors">
                <Navigation className="size-3" />
                <span>Coordinates</span>
              </div>
              <span className="text-[10px] font-mono font-bold text-primary">
                {zone.center.lat.toFixed(4)}, {zone.center.lng.toFixed(4)}
              </span>
            </div>
          )}

          {zone.radius && (
            <div className="flex items-center justify-between group">
              <div className="flex items-center gap-2 text-[9px] font-black uppercase text-white/40 group-hover:text-white transition-colors">
                <Ruler className="size-3" />
                <span>Monitor Radius</span>
              </div>
              <span className="text-[10px] font-bold text-white">
                {zone.radius} KM
              </span>
            </div>
          )}

          <div className="space-y-1.5">
            <div className="flex items-center gap-2 text-[9px] font-black uppercase text-white/30">
              <Radio className="size-3" />
              <span>Monitoring active</span>
            </div>
          </div>
        </div>

        {zone.monitoredServices && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {zone.monitoredServices.map(s => (
              <Badge
                key={s}
                variant="secondary"
                className="rounded-lg bg-white/[0.05] border-none text-[8px] font-black uppercase px-2 py-0.5 text-white/40 hover:bg-white/[0.1] hover:text-white transition-all"
              >
                {s}
              </Badge>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
