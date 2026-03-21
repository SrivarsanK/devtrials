"use client";

import React from "react";
import { Zone } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, ChevronDown, ChevronUp, Radio, Ruler, Navigation } from "lucide-react";
import { cn } from "@/lib/utils";

interface ZoneCardProps {
  zone: Zone;
}

export default function ZoneCard({ zone }: ZoneCardProps) {
  const [expanded, setExpanded] = React.useState(false);

  return (
    <Card 
      className={cn(
        "rounded-2xl border border-border bg-card/40 backdrop-blur-md shadow-sm hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 cursor-pointer overflow-hidden group/card",
        expanded && "ring-1 ring-primary/20 bg-card/60"
      )}
      onClick={() => setExpanded(!expanded)}
    >
      <CardHeader className="flex flex-row items-center justify-between space-y-0 p-6">
        <div className="flex items-center gap-4">
          <div className="flex aspect-square size-12 items-center justify-center rounded-xl bg-primary/10 border border-primary/20 group-hover/card:scale-110 transition-transform">
            <MapPin className="size-6 text-primary" />
          </div>
          <div>
            <CardTitle className="text-xl font-bold tracking-tight text-foreground group-hover/card:text-primary transition-colors">
              {zone.name}
            </CardTitle>
            <p className="text-[10px] font-semibold text-muted-foreground uppercase mt-0.5 tracking-wider opacity-60">
              Region: {(zone.state || zone.city || "Unknown").toUpperCase()}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex h-2 w-2 rounded-full bg-success shadow-[0_0_10px_var(--success)]" />
          {expanded ? <ChevronUp className="size-5 text-muted-foreground" /> : <ChevronDown className="size-5 text-muted-foreground" />}
        </div>
      </CardHeader>
      
      <CardContent className="px-6 pb-6 pt-0">
        <div className={cn(
          "grid gap-4 overflow-hidden transition-all duration-500 ease-in-out",
          expanded ? "max-h-[500px] opacity-100 mt-4 border-t border-border/50 pt-4" : "max-h-0 opacity-0"
        )}>
          <div className="flex items-center justify-between group">
            <div className="flex items-center gap-2 text-[10px] font-bold uppercase text-muted-foreground group-hover:text-foreground transition-colors">
              <Navigation className="size-3" />
              <span>Coordinates</span>
            </div>
            <span className="text-xs font-mono font-medium text-primary">
              {zone.center.lat.toFixed(4)}, {zone.center.lng.toFixed(4)}
            </span>
          </div>
          
          <div className="flex items-center justify-between group">
            <div className="flex items-center gap-2 text-[10px] font-bold uppercase text-muted-foreground group-hover:text-foreground transition-colors">
              <Ruler className="size-3" />
              <span>Monitor Radius</span>
            </div>
            <span className="text-xs font-semibold">
              {zone.radius} KM
            </span>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-[10px] font-bold uppercase text-muted-foreground">
              <Radio className="size-3" />
              <span>Active Monitored Services</span>
            </div>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {zone.monitoredServices.map(s => (
            <Badge 
              key={s} 
              variant="secondary"
              className="rounded-full bg-secondary/50 border-none text-[9px] font-semibold uppercase px-2 py-0.5 text-muted-foreground/80 hover:bg-primary/20 hover:text-primary transition-colors"
            >
              {s}
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
