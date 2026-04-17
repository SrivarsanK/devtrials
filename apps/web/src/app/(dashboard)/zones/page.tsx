"use client";

import React, { useEffect, useState } from "react";
import { ALL_CHENNAI_ZONES, ZoneTier, ZONE_TIER_CONFIG } from "@/lib/chennaiZones";
import { Map, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import anime from "animejs";
import RegisterZoneModal from "@/components/RegisterZoneModal";
import ZoneCard from "@/components/ZoneCard";

export default function ZonesPage() {
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const tl = anime.timeline({
      easing: 'easeOutExpo',
      duration: 1000
    });

    tl.add({
      targets: '.anime-header-item',
      translateY: [30, 0],
      opacity: [0, 1],
      delay: anime.stagger(100),
    })
    .add({
      targets: '.anime-zone-section',
      translateY: [40, 0],
      opacity: [0, 1],
      delay: anime.stagger(150),
      easing: 'spring(1, 80, 10, 0)',
    }, '-=600')
    .add({
      targets: '.anime-footer',
      translateY: [30, 0],
      opacity: [0, 1],
    }, '-=400');
  }, []);

  const filteredZones = ALL_CHENNAI_ZONES.filter(z =>
    z.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    z.region.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const groupedZones = {
    red: filteredZones.filter(z => z.zone === 'red'),
    orange: filteredZones.filter(z => z.zone === 'orange'),
    green: filteredZones.filter(z => z.zone === 'green'),
  };

  const renderSection = (tier: ZoneTier) => {
    const zones = groupedZones[tier];
    if (zones.length === 0) return null;
    const config = ZONE_TIER_CONFIG[tier];

    return (
      <div key={tier} className="space-y-6 anime-zone-section opacity-0">
        <div className="flex items-center gap-4 pl-2">
          <div className="flex items-center gap-3">
             <div className="size-3 rounded-full" style={{ backgroundColor: config.color, boxShadow: `0 0 10px ${config.color}` }} />
             <h2 className="text-2xl font-display font-black text-white tracking-tight uppercase">{config.label}s</h2>
          </div>
          <div className="h-[1px] flex-1 bg-gradient-to-r from-white/[0.05] to-transparent" />
          <div className="text-[10px] font-black uppercase tracking-widest text-slate-500">
            {config.priority.split(' — ')[1]} • {zones.length} Zones
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {zones.map((z) => (
            <div key={z.name} className="anime-zone-card">
              <ZoneCard zone={z} />
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col gap-12">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-10">
        <div className="space-y-4">
          <div className="flex items-center gap-3 opacity-0 anime-header-item">
            <div className="h-[2px] w-10 bg-gradient-to-r from-primary to-transparent rounded-full" />
            <span className="text-[10px] font-medium uppercase tracking-[0.12em] text-muted-foreground opacity-60">Regional coverage monitoring</span>
          </div>
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-display font-black tracking-tight text-foreground uppercase leading-[0.85] opacity-0 anime-header-item">
            Monitored <br /> <span className="text-secondary italic">Risk Zones</span>
          </h1>
          <p className="max-w-2xl text-sm text-muted-foreground leading-relaxed font-medium opacity-0 anime-header-item">
            Strategic coverage across India&apos;s largest gig economy clusters, monitoring hyper-local environmental triggers with millimetric precision.
          </p>
        </div>

        <div className="relative w-full max-w-sm group opacity-0 anime-header-item">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-muted-foreground group-focus-within:text-secondary transition-colors" />
          <Input
            placeholder="Search risk zones..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="h-12 pl-11 pr-5 rounded-xl glass text-sm font-medium placeholder:text-muted-foreground/30 focus-visible:ring-1 focus-visible:ring-secondary/30 focus-visible:border-secondary/20 transition-all"
          />
        </div>
      </header>

      {filteredZones.length === 0 ? (
        <div className="flex h-[40vh] flex-col items-center justify-center rounded-2xl glass">
          <div className="size-16 rounded-full glass flex items-center justify-center mb-4">
            <Map size={32} className="text-muted-foreground opacity-40" />
          </div>
          <p className="font-bold uppercase text-lg leading-none">No active zones detected</p>
          <p className="text-sm text-muted-foreground mt-1.5">Try adjusting your search criteria</p>
        </div>
      ) : (
        <div className="flex flex-col gap-16">
          {(Object.keys(ZONE_TIER_CONFIG) as ZoneTier[]).map(renderSection)}
        </div>
      )}

      <footer className="p-10 rounded-2xl glass card-glow relative overflow-hidden group anime-footer opacity-0">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5" />
        <div className="absolute top-0 right-0 p-10 opacity-5 scale-150 rotate-12 group-hover:rotate-0 transition-transform duration-1000">
          <Map className="size-48 text-foreground" />
        </div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3">
            <h3 className="text-4xl font-display font-black tracking-tight text-foreground uppercase leading-[1.1]">
              Expanding to <br /> New Territories
            </h3>
            <p className="max-w-md text-sm text-muted-foreground font-medium">
              RideSuraksha is actively onboarding 14 additional metropolitan clusters for the 2025 monsoon season.
            </p>
          </div>
          <RegisterZoneModal onSuccess={() => {}} />
        </div>
      </footer>
    </div>
  );
}
