"use client";

import React, { useEffect, useState } from "react";
import ZoneCard from "@/components/ZoneCard";
import { fetchZones, Zone } from "@/lib/api";
import { Map, Loader2, Search, ArrowUpRight } from "lucide-react";
import { Input } from "@/components/ui/input";

export default function ZonesPage() {
  const [zones, setZones] = useState<Zone[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    async function load() {
      try {
        const data = await fetchZones();
        setZones(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const filteredZones = zones.filter(z => 
    z.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-16 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-12">
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="h-0.5 w-12 bg-primary rounded-full shadow-[0_0_10px_var(--primary)]" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground opacity-60">Regional coverage monitoring</span>
          </div>
          <h1 className="text-8xl font-bebas tracking-wide text-foreground leading-[0.85]">
            Monitored <br /> <span className="text-primary italic">Risk Zones</span>
          </h1>
          <p className="max-w-2xl text-lg font-medium text-muted-foreground leading-relaxed">
            Strategic coverage across India&apos;s largest gig economy clusters, monitoring hyper-local environmental triggers with millimetric precision.
          </p>
        </div>
        
        <div className="relative w-full max-w-sm group">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 size-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
          <Input 
            placeholder="Search risk zones..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="h-16 pl-14 pr-6 rounded-2xl border-border bg-card/30 backdrop-blur-md text-lg font-bold uppercase tracking-tight placeholder:text-muted-foreground/30 focus-visible:ring-primary/20 focus-visible:border-primary transition-all shadow-xl shadow-black/5"
          />
        </div>
      </header>

      {loading ? (
        <div className="flex h-[40vh] items-center justify-center border-2 border-dashed border-border rounded-[3rem] bg-muted/5">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="animate-spin text-primary" size={48} />
            <span className="font-bold text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Synchronizing Registry...</span>
          </div>
        </div>
      ) : filteredZones.length === 0 ? (
        <div className="flex h-[40vh] flex-col items-center justify-center border border-border rounded-[3rem] bg-card/30 backdrop-blur-md shadow-2xl">
          <div className="size-20 rounded-full bg-muted/20 flex items-center justify-center mb-6">
            <Map size={40} className="text-muted-foreground opacity-40" />
          </div>
          <p className="font-black uppercase text-xl leading-none">No active zones detected</p>
          <p className="text-sm font-medium text-muted-foreground mt-2 uppercase tracking-tight">Try adjusting your search criteria</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {filteredZones.map((z) => (
            <ZoneCard key={z.id} zone={z} />
          ))}
        </div>
      )}
      
      <footer className="mt-20 p-12 rounded-[3rem] border border-border bg-gradient-to-br from-primary/10 via-card/50 to-secondary/10 backdrop-blur-xl relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-12 opacity-5 scale-150 rotate-12 group-hover:rotate-0 transition-transform duration-1000">
          <Map className="size-64 text-foreground" />
        </div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div className="space-y-4">
            <h3 className="text-5xl font-bebas tracking-wide text-foreground leading-[1.1]">
               Expanding to <br/> New Territories
            </h3>
            <p className="max-w-md text-sm font-medium text-muted-foreground italic">
              GigShield is actively onboarding 14 additional metropolitan clusters for the 2025 monsoon season.
            </p>
          </div>
          <button className="h-16 px-10 rounded-2xl bg-foreground text-background font-black uppercase flex items-center gap-3 hover:scale-105 active:scale-95 transition-all shadow-2xl shadow-black/20 group/btn">
            Register New Zone
            <ArrowUpRight className="size-5 group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform" />
          </button>
        </div>
      </footer>
    </div>
  );
}
