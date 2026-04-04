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
        { id: 'TN-CHE-01', name: 'Chennai Central', city: 'Chennai', currentRisk: 'Medium', region: 'Downtown' },
        { id: 'TN-CHE-02', name: 'Adyar / Tiruvanmiyur', city: 'Chennai', currentRisk: 'Low', region: 'Coastal' },
        { id: 'TN-CBE-01', name: 'Coimbatore RS Puram', city: 'Coimbatore', currentRisk: 'High', region: 'North' }
      ]);
      setLoading(false);
    };
    fetchData();
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
         <div className="space-y-3">
            <h1 className="text-5xl md:text-7xl font-manrope font-black text-white tracking-tighter leading-[0.9] flex flex-wrap items-center gap-x-4">
               <Translate text="Coverage" />
               <span className="text-white/40 italic font-medium underline decoration-primary decoration-8 underline-offset-[16px]"><Translate text="Zones" /></span>
            </h1>
            <p className="text-xs font-black uppercase tracking-[0.4em] text-primary/60 px-1 opacity-80 decoration-primary decoration-dotted">
                <Translate text={`${selectedZones.length} / 3 Territories Monitored`} />
            </p>
         </div>

         {/* Selection Summary */}
         <div className="flex items-center gap-3 overflow-x-auto pb-4 scrollbar-none min-h-[64px] bg-white/5 p-4 rounded-[32px] border border-white/5">
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
                
                return (
                  <motion.div 
                    layout
                    key={zone.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    onClick={() => toggleZone(zone.id)}
                    className={`p-10 bg-surface-card border rounded-[48px] transition-all relative overflow-hidden group/card hover:shadow-[0_20px_50px_-10px_rgba(249,115,22,0.15)] active:scale-[0.98] cursor-pointer ${
                      isSelected ? 'border-primary bg-primary/[0.03]' : 'border-white/5 hover:border-white/20'
                    }`}
                  >
                    {isSelected && (
                       <div className="absolute top-0 right-0 p-8">
                          <div className="w-14 h-14 rounded-3xl bg-primary flex flex-col items-center justify-center text-white shadow-2xl animate-in zoom-in-50 duration-500 border-b-4 border-primary-dark/40">
                             <span className="text-2xl font-black leading-none italic">{priorityIndex + 1}</span>
                             <span className="text-[7px] font-black uppercase tracking-tighter"><Translate text={getPriorityLabel(priorityIndex)} /></span>
                          </div>
                       </div>
                    )}
                    
                    <div className="flex flex-col h-full gap-8">
                       <div className="space-y-1">
                          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20 leading-none">
                             <Translate text={zone.region || zone.city} />
                          </p>
                          <h4 className={`text-2xl font-manrope font-black tracking-tighter uppercase transition-colors italic leading-none pt-1 ${isSelected ? 'text-primary' : 'text-white'}`}>
                             <Translate text={zone.name} />
                          </h4>
                       </div>

                       <div className="p-6 bg-white/[0.03] rounded-[32px] grid grid-cols-2 gap-6 border border-white/5 group-hover/card:bg-white/[0.06] transition-all">
                          <div className="space-y-1">
                             <span className="text-[9px] font-black uppercase text-white/20 tracking-widest"><Translate text="Risk Score" /></span>
                             <div className={`px-3 py-1 rounded-full border text-[9px] font-black text-center uppercase tracking-widest ${getRiskColor(zone.currentRisk)}`}>
                                <Translate text={zone.currentRisk} />
                             </div>
                          </div>
                          <div className="space-y-1">
                             <span className="text-[9px] font-black uppercase text-white/20 tracking-widest"><Translate text="Alerts 24h" /></span>
                             <div className="flex items-center gap-2">
                                <span className="text-xl font-bold text-white leading-none italic">14+</span>
                                <TrendingUp className="w-4 h-4 text-red-500" />
                             </div>
                          </div>
                       </div>

                       <div className="mt-auto pt-8 flex items-center justify-between border-t border-white/5">
                          <p className="text-[10px] font-black text-white/20 uppercase tracking-widest">
                             <Translate text={zone.id} />
                          </p>
                          <div className="flex items-center gap-2">
                             {isSelected ? (
                               <Badge className="bg-primary/10 text-primary border-primary/20 uppercase font-black text-[9px] tracking-widest px-4 py-1.5 animate-pulse">
                                  <CheckCircle2 className="w-3.5 h-3.5 mr-2" /> <Translate text="Nominated" />
                               </Badge>
                             ) : (
                                <span className="text-[9px] font-black text-white/20 uppercase group-hover/card:text-white group-hover/card:translate-x-1 transition-all flex items-center gap-2">
                                   <Translate text="Nominate Zone" />
                                   <IndianRupee className="w-3 h-3" />
                                </span>
                             )}
                          </div>
                       </div>
                    </div>
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
