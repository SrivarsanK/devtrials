"use client";

import React from "react";
import { ChennaiZone, ZONE_TIER_CONFIG } from "@/lib/chennaiZones";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, ChevronDown, ChevronUp, Radio, Ruler, Navigation } from "lucide-react";
import { cn } from "@/lib/utils";
import anime from "animejs";

interface ZoneCardProps {
  zone: ChennaiZone;
}

export default function ZoneCard({ zone }: ZoneCardProps) {
  const [expanded, setExpanded] = React.useState(false);
  const cardRef = React.useRef<HTMLDivElement>(null);
  const iconRef = React.useRef<HTMLDivElement>(null);
  const config = ZONE_TIER_CONFIG[zone.zone];

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

  return (
    <Card
      ref={cardRef}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      className={cn(
        "rounded-2xl glass card-glow transition-all duration-300 cursor-pointer overflow-hidden group/card",
        expanded && "ring-1 ring-secondary/20 bg-[#12121a]/80"
      )}
      onClick={() => setExpanded(!expanded)}
    >
      <CardHeader className="flex flex-row items-center justify-between space-y-0 p-5">
        <div className="flex items-center gap-4">
          <div ref={iconRef} className="flex aspect-square size-12 items-center justify-center rounded-2xl transition-all duration-300" style={{ backgroundColor: config.color, boxShadow: `0 0 15px ${config.glowColor}` }}>
            <MapPin className="size-6 text-[#0a0a12]" strokeWidth={2.5} />
          </div>
          <div>
            <CardTitle className="text-[22px] font-display font-black tracking-tight text-foreground group-hover/card:text-secondary transition-colors leading-none uppercase">
              {zone.name}
            </CardTitle>
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-1.5 opacity-60">
              Region: {zone.region.toUpperCase()}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2.5">
          <div className="px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-widest" style={{ backgroundColor: config.bgColor, color: config.color, border: `1px solid ${config.borderColor}` }}>
             Class {zone.zone}
          </div>
          {expanded ? <ChevronUp className="size-4 text-muted-foreground" /> : <ChevronDown className="size-4 text-muted-foreground" />}
        </div>
      </CardHeader>

      <CardContent className="px-5 pb-5 pt-0">
        <div className={cn(
          "grid gap-3 overflow-hidden transition-all duration-500 ease-in-out",
          expanded ? "max-h-[500px] opacity-100 mt-3 border-t border-white/[0.06] pt-3" : "max-h-0 opacity-0"
        )}>
          <div className="flex items-center justify-between group">
            <div className="flex items-center gap-2 text-[10px] font-medium uppercase text-muted-foreground group-hover:text-foreground transition-colors">
              <Navigation className="size-3" />
              <span>Coordinates</span>
            </div>
            <span className="text-xs font-mono font-medium text-secondary">
              {zone.lat.toFixed(4)}, {zone.lng.toFixed(4)}
            </span>
          </div>

          <div className="flex items-center justify-between group">
            <div className="flex items-center gap-2 text-[10px] font-medium uppercase text-muted-foreground group-hover:text-foreground transition-colors">
              <Ruler className="size-3" />
              <span>Monitor Radius</span>
            </div>
            <span className="text-xs font-medium text-foreground">
              {zone.radius || 50} KM
            </span>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center gap-2 text-[10px] font-medium uppercase text-muted-foreground">
              <Radio className="size-3" />
              <span>Prioritization Metadata</span>
            </div>
          </div>
        </div>

        <div className="mt-3 flex flex-wrap gap-1.5">
          <Badge
            variant="secondary"
            className="rounded-lg border-none text-[9px] font-black uppercase px-3 py-1 transition-all"
            style={{ backgroundColor: config.bgColor, color: config.color }}
          >
            {config.cluster}
          </Badge>
          <Badge
            variant="secondary"
            className="rounded-lg bg-white/[0.05] border-none text-[9px] font-black uppercase px-3 py-1 text-muted-foreground/80 transition-all"
          >
            {config.priority.split(' — ')[1]}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
}
