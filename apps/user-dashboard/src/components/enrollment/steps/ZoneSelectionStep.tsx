"use client";

import React, { useState, useEffect } from "react";
import { Translate } from "@/components/ui/translate";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, MapPin, CheckCircle2, AlertTriangle, ArrowRight, ShieldCheck } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Badge } from "@/components/ui/badge";

const ALL_ZONES = [
  { id: 'CH-RED-01', name: 'Velachery', region: 'South Chennai', currentRisk: 'High' },
  { id: 'CH-RED-02', name: 'Pallikaranai', region: 'South Chennai', currentRisk: 'High' },
  { id: 'CH-RED-03', name: 'Madipakkam', region: 'South Chennai', currentRisk: 'High' },
  { id: 'CH-RED-04', name: 'Perumbakkam', region: 'South Chennai', currentRisk: 'High' },
  { id: 'CH-RED-05', name: 'Semmencherry', region: 'South Chennai', currentRisk: 'High' },
  { id: 'CH-RED-06', name: 'Sholinganallur', region: 'South Chennai (OMR)', currentRisk: 'High' },
  { id: 'CH-RED-07', name: 'Adyar / Thiruvanmiyur', region: 'Coastal South', currentRisk: 'Medium' },
  { id: 'CH-RED-08', name: 'Saidapet', region: 'Central-South', currentRisk: 'Medium' },
  { id: 'CH-RED-09', name: 'Kotturpuram', region: 'Central-South', currentRisk: 'Medium' },
  { id: 'CH-RED-10', name: 'T. Nagar', region: 'Central-South', currentRisk: 'Low' },
  { id: 'CH-RED-11', name: 'Kodambakkam', region: 'Central-West', currentRisk: 'Low' },
  { id: 'CH-RED-12', name: 'Anna Nagar', region: 'North-West', currentRisk: 'Low' },
  { id: 'CH-RED-13', name: 'Tambaram', region: 'South Outskirts', currentRisk: 'Low' },
  { id: 'CH-RED-14', name: 'Chromepet', region: 'South Outskirts', currentRisk: 'Low' },
  { id: 'CH-RED-15', name: 'Guindy', region: 'Central-South', currentRisk: 'Medium' },
];

interface ZoneSelectionStepProps {
  onNext: (selected: string[]) => void;
  onBack: () => void;
  initialSelected?: string[];
}

export function ZoneSelectionStep({ onNext, onBack, initialSelected = [] }: ZoneSelectionStepProps) {
  const [selectedZones, setSelectedZones] = useState<string[]>(initialSelected);
  const [searchQuery, setSearchQuery] = useState("");

  const toggleZone = (id: string) => {
    setSelectedZones(prev => {
      if (prev.includes(id)) {
        return prev.filter(zId => zId !== id);
      }
      if (prev.length < 3) {
        return [...prev, id];
      }
      return prev;
    });
  };

  const filteredZones = ALL_ZONES.filter(z => 
    z.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    z.region.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getPriorityLabel = (index: number) => {
    switch (index) {
      case 0: return "Primary";
      case 1: return "Secondary";
      case 2: return "Tertiary";
      default: return "";
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
      <div className="text-center space-y-4">
        <div className="w-20 h-20 rounded-3xl bg-primary/10 flex items-center justify-center mx-auto relative group">
           <MapPin className="w-10 h-10 text-primary drop-shadow-[0_0_15px_rgba(249,115,22,0.6)]" />
           <div className="absolute inset-x-[-20%] inset-y-[-20%] bg-primary/5 blur-[40px] rounded-full -z-10 animate-pulse transition-colors" />
        </div>
        <h2 className="text-3xl font-manrope font-black text-white tracking-tight uppercase">
          <Translate text="Coverage Zones" /> <br />
          <span className="text-white/40 font-bold italic normal-case text-lg tracking-normal">
             <Translate text="Selection (1-3) by Priority" />
          </span>
        </h2>
      </div>

      {/* Selected zones summary - Horizontal Scroller */}
      <div className="flex items-center gap-3 overflow-x-auto pb-4 pt-4 px-2 scrollbar-none min-h-[60px]">
        <AnimatePresence mode="popLayout">
          {selectedZones.length === 0 && (
             <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em] pl-4 italic">
                <Translate text="Select your primary work zones below" />
             </motion.p>
          )}
          {selectedZones.map((zId, idx) => {
            const z = ALL_ZONES.find(zone => zone.id === zId);
            return (
              <motion.div 
                key={zId}
                initial={{ opacity: 0, x: -10, scale: 0.9 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-2xl px-5 py-2.5 shrink-0 group hover:border-primary/50 transition-colors"
              >
                 <div className="w-6 h-6 rounded-lg bg-primary flex items-center justify-center text-[11px] font-black text-white leading-none shadow-[0_0_15px_rgba(16,185,129,0.3)]">
                    {idx + 1}
                 </div>
                 <span className="text-xs font-black text-white max-w-[120px] truncate uppercase tracking-tight">
                    <Translate text={z?.name || zId} />
                 </span>
                 <button onClick={() => toggleZone(zId)} className="text-white/20 hover:text-red-500 transition-colors active:scale-95">
                    <AlertTriangle className="w-4 h-4 rotate-45" />
                 </button>
              </motion.div>
            )
          })}
        </AnimatePresence>
      </div>

      <div className="space-y-6">
        {/* Search Bar */}
        <div className="relative group">
           <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20 group-focus-within:text-primary transition-colors" />
           <Input 
             placeholder="Search by City or Zone Name..." 
             className="bg-white/5 border-white/5 rounded-[32px] pl-16 h-16 text-lg tracking-tight font-bold text-white placeholder:text-white/10 focus:ring-primary/20 focus:border-primary/40 transition-all border-dashed"
             value={searchQuery}
             onChange={(e) => setSearchQuery(e.target.value)}
           />
        </div>

        {/* Suggestions / Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[300px] lg:max-h-[400px] overflow-y-auto pr-2 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-white/5">
          {filteredZones.map((zone) => {
            const isSelected = selectedZones.includes(zone.id);
            const priorityIndex = selectedZones.indexOf(zone.id);
            
            return (
              <motion.button
                key={zone.id}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                onClick={() => toggleZone(zone.id)}
                className={`p-6 bg-white/3 border rounded-[32px] transition-all relative overflow-hidden group/card hover:shadow-2xl flex flex-col gap-2 text-left ${
                  isSelected ? 'border-primary bg-primary/[0.05]' : 'border-white/5 hover:border-white/10'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[10px] font-black uppercase text-white/30 tracking-widest leading-none">
                      <Translate text={zone.region} />
                    </span>
                    <span className={`text-base font-black tracking-tight uppercase group-hover/card:text-primary transition-colors ${isSelected ? 'text-primary' : 'text-white'}`}>
                      <Translate text={zone.name} />
                    </span>
                  </div>
                  {isSelected && (
                    <div className="w-8 h-8 rounded-xl bg-primary flex flex-col items-center justify-center text-white shadow-xl animate-in zoom-in-50 duration-300">
                       <span className="text-sm font-black leading-none">{priorityIndex + 1}</span>
                       <span className="text-[5px] font-black uppercase tracking-tighter"><Translate text={getPriorityLabel(priorityIndex)} /></span>
                    </div>
                  )}
                </div>
              </motion.button>
            );
          })}
        </div>

        <div className="flex gap-4 pt-6">
          <Button 
            onClick={onBack}
            variant="ghost"
            className="h-16 px-8 hover:bg-white/5 text-white/40 hover:text-white transition-all rounded-[32px] font-black text-xs uppercase tracking-widest border border-white/5"
          >
             <Translate text="Back" />
          </Button>
          <Button 
            onClick={() => onNext(selectedZones)}
            disabled={selectedZones.length === 0}
            className="flex-1 h-16 bg-gradient-to-r from-primary to-primary-dark hover:opacity-90 active:scale-95 transition-all font-black text-xl rounded-[32px] flex items-center justify-center gap-3 border-none shadow-[0_0_30px_-5px_rgba(249,115,22,0.4)] disabled:opacity-30 disabled:grayscale transition-all"
          >
            <Translate text="Confirm Selection" />
            <ArrowRight className="w-5 h-5" />
          </Button>
        </div>
      </div>
      
      <p className="text-center text-[10px] font-black uppercase text-white/20 tracking-[0.4em] pt-4 italic">
        Priority zones receive faster payout processing
      </p>
    </div>
  );
}
