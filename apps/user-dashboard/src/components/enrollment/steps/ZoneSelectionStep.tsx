"use client";

import React, { useState, useMemo } from "react";
import { Translate } from "@/components/ui/translate";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, MapPin, AlertTriangle, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const ALL_ZONES = [
  // RED ZONES
  { id: 'CH-Z-01', name: 'Sholinganallur', region: 'South Chennai (OMR)' },
  { id: 'CH-Z-02', name: 'Karapakkam', region: 'South Chennai (OMR)' },
  { id: 'CH-Z-03', name: 'Thiruvanmiyur', region: 'Coastal South' },
  { id: 'CH-Z-04', name: 'Saidapet', region: 'Central-South' },
  { id: 'CH-Z-05', name: 'Kotturpuram', region: 'Central-South' },
  { id: 'CH-Z-06', name: 'Jafferkhanpet', region: 'Central-South' },
  { id: 'CH-Z-07', name: 'Nandambakkam', region: 'Central-South' },
  { id: 'CH-Z-08', name: 'Ennore', region: 'North Chennai' },
  { id: 'CH-Z-09', name: 'Manali', region: 'North Chennai' },
  { id: 'CH-Z-10', name: 'Kolathur', region: 'North Chennai' },
  { id: 'CH-Z-11', name: 'Vyasarpadi', region: 'North Chennai' },
  { id: 'CH-Z-12', name: 'Wimco Nagar', region: 'North Chennai' },
  { id: 'CH-Z-13', name: 'Tiruvottiyur', region: 'North Chennai' },
  { id: 'CH-Z-14', name: 'Royapuram', region: 'North Chennai (Coastal)' },
  { id: 'CH-Z-15', name: 'Tondiarpet', region: 'North Chennai' },
  { id: 'CH-Z-16', name: 'Guindy', region: 'Central-South' },
  { id: 'CH-Z-17', name: 'Perungudi', region: 'South Chennai (OMR)' },
  { id: 'CH-Z-18', name: 'Perambur', region: 'North Chennai' },
  
  // ORANGE ZONES
  { id: 'CH-Z-19', name: 'Velachery', region: 'South Chennai' },
  { id: 'CH-Z-20', name: 'Pallikaranai', region: 'South Chennai' },
  { id: 'CH-Z-21', name: 'Madipakkam', region: 'South Chennai' },
  { id: 'CH-Z-22', name: 'Perumbakkam', region: 'South Chennai' },
  { id: 'CH-Z-23', name: 'Semmencherry', region: 'South Chennai' },
  { id: 'CH-Z-24', name: 'Adyar Estuarine Belt', region: 'South Chennai' },
  { id: 'CH-Z-25', name: 'Sunnambu Kolathur', region: 'South Chennai' },
  { id: 'CH-Z-26', name: 'Ambattur', region: 'West Chennai' },
  { id: 'CH-Z-27', name: 'Avadi', region: 'North-West Chennai' },
  { id: 'CH-Z-28', name: 'Porur', region: 'West Chennai' },
  { id: 'CH-Z-29', name: 'Chrompet', region: 'South-West Chennai' },
  { id: 'CH-Z-30', name: 'Pallavaram', region: 'South-West Chennai' },
  { id: 'CH-Z-31', name: 'Tambaram', region: 'South-West Chennai' },
  { id: 'CH-Z-32', name: 'Medavakkam', region: 'South Chennai' },
  { id: 'CH-Z-33', name: 'Nanganallur', region: 'South Chennai' },
  { id: 'CH-Z-34', name: 'Meenambakkam', region: 'South-West Chennai' },
  { id: 'CH-Z-35', name: 'Egmore', region: 'Central' },
  { id: 'CH-Z-36', name: 'Chepauk', region: 'Central-East' },
  { id: 'CH-Z-37', name: 'Mylapore', region: 'Central-East' },
  { id: 'CH-Z-38', name: 'Triplicane', region: 'Central-East' },
  { id: 'CH-Z-39', name: 'Royapettah', region: 'Central-East' },
  { id: 'CH-Z-40', name: 'Virugambakkam', region: 'West Chennai' },
  { id: 'CH-Z-41', name: 'Valasaravakkam', region: 'West Chennai' },
  { id: 'CH-Z-42', name: 'Mogappair', region: 'North-West Chennai' },
  { id: 'CH-Z-43', name: 'Poonamallee', region: 'West Chennai' },
  { id: 'CH-Z-44', name: 'Korattur', region: 'North-West Chennai' },
  { id: 'CH-Z-45', name: 'Anna Nagar', region: 'North-West Chennai' },
  { id: 'CH-Z-46', name: 'Adyar', region: 'South Chennai' },

  // GREEN ZONES
  { id: 'CH-Z-47', name: 'Nungambakkam', region: 'Central' },
  { id: 'CH-Z-48', name: 'T Nagar', region: 'Central' },
  { id: 'CH-Z-49', name: 'Kilpauk', region: 'Central' },
  { id: 'CH-Z-50', name: 'Teynampet', region: 'Central' },
  { id: 'CH-Z-51', name: 'Alwarpet', region: 'Central-South' },
  { id: 'CH-Z-52', name: 'Thousand Lights', region: 'Central' },
  { id: 'CH-Z-53', name: 'Choolaimedu', region: 'Central-West' },
  { id: 'CH-Z-54', name: 'Vadapalani', region: 'Central-West' },
  { id: 'CH-Z-55', name: 'Saligramam', region: 'West Chennai' },
  { id: 'CH-Z-56', name: 'Ashok Nagar', region: 'Central-West' },
  { id: 'CH-Z-57', name: 'Kodambakkam', region: 'Central-West' },
  { id: 'CH-Z-58', name: 'Purasaiwakkam', region: 'North-Central' },
  { id: 'CH-Z-59', name: 'Aminjikarai', region: 'Central-West' },
  { id: 'CH-Z-60', name: 'Besant Nagar', region: 'South Coastal' },
  { id: 'CH-Z-61', name: 'Nandanam', region: 'Central' },
  { id: 'CH-Z-62', name: 'Santhome', region: 'Central-East' },
].sort((a, b) => a.name.localeCompare(b.name));

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

  const groupedZones = useMemo(() => {
    const filtered = ALL_ZONES.filter(z => 
      z.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      z.region.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const groups: Record<string, typeof ALL_ZONES> = {};
    filtered.forEach(z => {
      if (!groups[z.region]) groups[z.region] = [];
      groups[z.region].push(z);
    });

    return Object.keys(groups)
      .sort((a, b) => a.localeCompare(b))
      .map(region => ({
        region,
        zones: groups[region].sort((a, b) => a.name.localeCompare(b.name))
      }));
  }, [searchQuery]);

  const getPriorityLabel = (index: number) => {
    switch (index) {
      case 0: return "Primary";
      case 1: return "Secondary";
      case 2: return "Tertiary";
      default: return "";
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
      <div className="text-center space-y-4">
        <div className="w-20 h-20 rounded-3xl bg-primary/10 flex items-center justify-center mx-auto relative group">
           <MapPin className="w-10 h-10 text-primary drop-shadow-[0_0_15px_rgba(255,70,37,0.6)]" />
           <div className="absolute inset-x-[-20%] inset-y-[-20%] bg-primary/5 blur-[40px] rounded-full -z-10 animate-pulse transition-colors" />
        </div>
        <h2 className="text-3xl font-display font-black text-white tracking-tight uppercase">
          <Translate text="Coverage Zones" /> <br />
          <span className="text-muted-foreground/80 font-bold italic normal-case text-lg tracking-normal">
             <Translate text="Select 1 to 3 zones by Priority" />
          </span>
        </h2>
      </div>

      {/* Selected zones summary - Horizontal Scroller */}
      <div className="flex items-center gap-3 overflow-x-auto pb-4 pt-4 px-2 scrollbar-none min-h-[60px]">
        <AnimatePresence mode="popLayout">
          {selectedZones.length === 0 && (
             <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-[10px] font-black text-muted-foreground/60 uppercase tracking-[0.3em] pl-4 italic">
                <Translate text="Select your work zones below" />
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
                 <div className="w-6 h-6 rounded-lg bg-primary flex items-center justify-center text-[11px] font-black text-white leading-none shadow-[0_0_15px_rgba(255,70,37,0.3)]">
                    {idx + 1}
                 </div>
                 <span className="text-xs font-black text-white max-w-[120px] truncate uppercase tracking-tight">
                    <Translate text={z?.name || zId} />
                 </span>
                 <button onClick={() => toggleZone(zId)} className="text-muted-foreground/60 hover:text-red-500 transition-colors active:scale-95">
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
           <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground/60 group-focus-within:text-primary transition-colors" />
           <Input 
             placeholder="Search by area or region..." 
             className="bg-white/5 border-white/5 rounded-[32px] pl-16 h-16 text-lg tracking-tight font-bold text-white placeholder:text-white/10 focus:ring-primary/20 focus:border-primary/40 transition-all border-dashed"
             value={searchQuery}
             onChange={(e) => setSearchQuery(e.target.value)}
           />
        </div>

        {/* Suggestions / Grid grouped by Region */}
        <div className="space-y-10 max-h-[500px] overflow-y-auto pr-4 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-white/5">
          {groupedZones.map((group) => (
            <div key={group.region} className="space-y-4">
              <h3 className="text-[10px] font-black uppercase tracking-[0.5em] text-white/20 px-4 flex items-center gap-4">
                <Translate text={group.region} />
                <div className="h-px bg-white/5 flex-1" />
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {group.zones.map((zone) => {
                  const isSelected = selectedZones.includes(zone.id);
                  const priorityIndex = selectedZones.indexOf(zone.id);
                  
                  return (
                    <motion.button
                      key={zone.id}
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                      onClick={() => toggleZone(zone.id)}
                      className={`p-6 bg-white/[0.03] border rounded-[32px] transition-all relative overflow-hidden group/card hover:shadow-2xl flex items-center justify-between text-left ${
                        isSelected ? 'border-primary bg-primary/[0.05]' : 'border-white/5 hover:border-white/10'
                      }`}
                    >
                      <span className={`text-sm font-black tracking-tight uppercase group-hover/card:text-primary transition-colors ${isSelected ? 'text-primary' : 'text-white'}`}>
                        <Translate text={zone.name} />
                      </span>
                      {isSelected && (
                        <div className="w-8 h-8 rounded-xl bg-primary flex flex-col items-center justify-center text-white shadow-xl animate-in zoom-in-50 duration-300">
                           <span className="text-sm font-black leading-none">{priorityIndex + 1}</span>
                           <span className="text-[5px] font-black uppercase tracking-tighter"><Translate text={getPriorityLabel(priorityIndex)} /></span>
                        </div>
                      )}
                    </motion.button>
                  );
                })}
              </div>
            </div>
          ))}
          {groupedZones.length === 0 && (
             <div className="py-20 text-center opacity-20">
                <p className="text-sm font-black uppercase tracking-widest"><Translate text="No zones found matching your search" /></p>
             </div>
          )}
        </div>

        <div className="flex gap-4 pt-6">
          <Button 
            onClick={onBack}
            variant="ghost"
            className="h-16 px-8 hover:bg-white/5 text-muted-foreground/80 hover:text-white transition-all rounded-[32px] font-black text-xs uppercase tracking-widest border border-white/5"
          >
             <Translate text="Back" />
          </Button>
          <Button 
            onClick={() => onNext(selectedZones)}
            disabled={selectedZones.length === 0}
            className="flex-1 h-16 bg-primary hover:bg-primary/90 text-white transition-all font-black text-xl rounded-[32px] flex items-center justify-center gap-3 border-none shadow-[0_0_30px_-5px_rgba(255,70,37,0.4)] disabled:opacity-30 disabled:grayscale transition-all"
          >
            <Translate text="Confirm Coverage" />
            <ArrowRight className="w-5 h-5" />
          </Button>
        </div>
      </div>
      
      <p className="text-center text-[10px] font-black uppercase text-muted-foreground/60 tracking-[0.4em] pt-4 italic">
        Priority zones receive faster payout processing
      </p>
    </div>
  );
}
