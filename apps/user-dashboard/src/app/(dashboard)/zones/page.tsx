"use client";

import React, { useState, useEffect } from "react";
import { 
  Globe, Search, MapPin, CheckCircle2, AlertTriangle, 
  ShieldCheck, TrendingUp, Sun, CloudRain 
} from "lucide-react";
import { Translate } from "@/components/ui/translate";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { TriggerService, TriggerEvent } from "@/lib/api";
import { Skeleton } from "@/components/ui/skeleton";
import { motion, AnimatePresence } from "framer-motion";
import anime from "animejs";
import { ZoneCard } from "@/components/dashboard/shared/ZoneCard";
import { cn } from "@/lib/utils";

export default function ZonesPage() {
  const [loading, setLoading] = useState(true);
  const [zones, setZones] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedZones, setSelectedZones] = useState<string[]>(["TN-CHE-01"]);

  const toggleZone = (id: string) => {
    setSelectedZones(prev => {
      if (prev.includes(id)) return prev.filter(zId => zId !== id);
      if (prev.length < 3) return [...prev, id];
      return prev;
    });
  };

  const getPriorityLabel = (index: number) => {
    switch (index) {
      case 0: return "Primary";
      case 1: return "Secondary";
      case 2: return "Tertiary";
      default: return "";
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const zoneData = await TriggerService.getZones();
      setZones(zoneData.length ? zoneData : [
        { id: 'TN-CHE-01', name: 'Chennai Central', city: 'Chennai', currentRisk: 'Medium', region: 'Downtown', center: { lat: 13.0827, lng: 80.2707 }, radius: 10 },
        { id: 'TN-CHE-02', name: 'Adyar / Tiruvanmiyur', city: 'Chennai', currentRisk: 'Low', region: 'Coastal', center: { lat: 12.9915, lng: 80.2520 }, radius: 15 },
        { id: 'TN-CBE-01', name: 'Coimbatore RS Puram', city: 'Coimbatore', currentRisk: 'High', region: 'North', center: { lat: 11.0168, lng: 76.9558 }, radius: 5 },
        { id: 'TN-CHE-03', name: 'Madipakkam / Velachery', city: 'Chennai', currentRisk: 'High', region: 'Suburban', center: { lat: 12.9662, lng: 80.2185 }, radius: 12 },
        { id: 'TN-CHE-04', name: 'Mount Road', city: 'Chennai', currentRisk: 'Medium', region: 'Commercial', center: { lat: 13.0633, lng: 80.2530 }, radius: 8 },
        { id: 'TN-CHE-05', name: 'OMR Corridor', city: 'Chennai', currentRisk: 'Low', region: 'IT Hub', center: { lat: 12.8710, lng: 80.2229 }, radius: 25 }
      ]);
      setLoading(false);
    };
    fetchData();

    // Premium entrance animation
    const tl = anime.timeline({
      easing: 'easeOutExpo',
      duration: 1000
    });

    tl.add({
      targets: '.animate-header-item',
      translateY: [30, 0],
      opacity: [0, 1],
      delay: anime.stagger(100)
    })
    .add({
      targets: '.animate-zone-summary',
      scale: [0.95, 1],
      opacity: [0, 1],
      duration: 800
    }, '-=600')
    .add({
      targets: '.animate-zone-card',
      translateY: [20, 0],
      opacity: [0, 1],
      delay: anime.stagger(80)
    }, '-=600');
  }, []);

  const filteredZones = zones.filter(z => 
    z.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    z.city.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getRiskColor = (risk: string) => {
    switch (risk?.toLowerCase()) {
      case 'high': return 'bg-red-500/10 text-red-500 border-red-500/20';
      case 'medium': return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20';
      default: return 'bg-green-500/10 text-green-500 border-green-500/20';
    }
  };

  return (
    <div className="space-y-12 pb-12 animate-in fade-in duration-700">
      
      {/* HEADER SECTION */}
      <section className="flex flex-col md:flex-row md:items-end justify-between gap-8 pt-4">
         <div className="space-y-4 animate-header-item opacity-0">
            <h1 className="text-6xl md:text-8xl font-display font-black text-white tracking-tighter leading-[0.8] flex flex-wrap items-center gap-x-4 uppercase">
               <Translate text="Coverage" />
               <span className="text-white/40 italic font-medium underline-offset-[16px]"><Translate text="Zones" /></span>
            </h1>
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-primary/60 px-1 opacity-80">
                <Translate text={`${selectedZones.length} / 3 Territories Monitored`} />
            </p>
         </div>

         {/* Selection Summary */}
         <div className="animate-zone-summary opacity-0 flex items-center gap-3 overflow-x-auto pb-4 scrollbar-none min-h-[64px] bg-white/5 p-4 rounded-[32px] border border-white/5">
            <AnimatePresence mode="popLayout">
              {selectedZones.length === 0 && (
                 <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-[10px] font-bold text-white/20 uppercase tracking-widest px-4">
                    <Translate text="No zones nominated yet." />
                 </motion.p>
              )}
              {selectedZones.map((zId, idx) => {
                const z = zones.find(zone => zone.id === zId);
                return (
                  <motion.div 
                    key={zId}
                    initial={{ opacity: 0, x: -10, scale: 0.9 }}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="flex items-center gap-4 bg-primary/10 border border-primary/20 rounded-2xl px-5 py-2.5 shrink-0 hover:bg-primary/20 transition-all cursor-default"
                  >
                     <div className="w-5 h-5 rounded-lg bg-primary flex items-center justify-center text-[10px] font-black text-white italic">
                        {idx + 1}
                     </div>
                     <span className="text-[11px] font-black text-white uppercase tracking-tight truncate max-w-[100px]">
                        <Translate text={z?.name || zId} />
                     </span>
                  </motion.div>
                )
              })}
            </AnimatePresence>
         </div>
      </section>

      {/* SEARCH TERMINAL */}
      <div className="relative group max-w-2xl">
         <div className="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 flex items-center justify-center text-white/20 group-focus-within:text-primary transition-colors">
            <Search className="w-5 h-5" />
         </div>
         <Input 
           placeholder="Search monitored corridors..." 
           className="bg-surface-card border-white/5 rounded-[32px] pl-16 h-20 text-xl tracking-tight font-black text-white placeholder:text-white/10 focus:ring-primary/20 focus:border-primary/40 transition-all border-dashed"
           value={searchQuery}
           onChange={(e) => setSearchQuery(e.target.value)}
         />
      </div>

      {/* GRID AREA */}
      <div className="space-y-8">
         <div className="flex items-center justify-between px-2">
            <h3 className="text-xl font-manrope font-black text-white tracking-tight uppercase flex items-center gap-3 leading-none italic">
               <Globe className="w-6 h-6 text-primary" />
               <Translate text="Corridor Risk Map" />
            </h3>
            <span className="text-[9px] font-black uppercase tracking-widest text-white/20">{filteredZones.length} <Translate text="Active" /></span>
         </div>

         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {loading ? (
             Array(6).fill(0).map((_, i) => (
                <div key={i} className="p-10 bg-surface-card border border-white/5 rounded-[48px] space-y-6">
                   <div className="flex justify-between items-start">
                      <Skeleton className="h-4 w-24 bg-white/5" />
                      <Skeleton className="h-6 w-20 bg-white/10 rounded-full" />
                   </div>
                   <Skeleton className="h-10 w-3/4 bg-white/5" />
                   <Skeleton className="h-20 w-full bg-white/5 rounded-3xl" />
                </div>
             ))
          ) : (
            <AnimatePresence mode="popLayout">
              {filteredZones.map((zone) => {
                const isSelected = selectedZones.includes(zone.id);
                const priorityIndex = selectedZones.indexOf(zone.id);
                
                // Adapter for shared ZoneCard
                const sharedZoneData = {
                  ...zone,
                  monitoredServices: ["Rainfall", "AQI", "Heat Index"]
                };

                return (
                  <motion.div 
                    layout
                    key={zone.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    onClick={() => toggleZone(zone.id)}
                    className="animate-zone-card opacity-0 relative group"
                  >
                    {isSelected && (
                       <div className="absolute top-0 right-0 p-4 z-10 pointer-events-none">
                          <div className="w-10 h-10 rounded-2xl bg-primary flex flex-col items-center justify-center text-white shadow-2xl animate-in zoom-in-50 duration-500 border-b-2 border-primary-dark/40">
                             <span className="text-lg font-black leading-none italic">{priorityIndex + 1}</span>
                          </div>
                       </div>
                    )}
                    
                    <div className={cn(
                      "transition-all duration-300 rounded-[32px] p-1",
                      isSelected ? "ring-2 ring-primary bg-primary/5" : ""
                    )}>
                      <ZoneCard zone={sharedZoneData} />
                    </div>

                    {!isSelected && (
                      <div className="absolute bottom-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Badge className="bg-white/5 text-white/40 border-none uppercase font-black text-[7px] tracking-widest px-3 py-1">
                          Nominate
                        </Badge>
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </AnimatePresence>
          )}
         </div>
      </div>

    </div>
  );
}

// ICON IMPORT
import { IndianRupee } from "lucide-react";
