"use client";

import React, { useState, useMemo, useEffect } from "react";
import { Translate } from "@/components/ui/translate";
import { Button } from "@/components/ui/button";
import { Shield, Clock, MapPin, Check, Info, ArrowRight, Zap, TrendingUp, AlertTriangle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// RISK REGISTRY (Sync with ZoneSelectionStep)
const ZONE_RISK_MAP: Record<string, number> = {
  'High': 15,
  'Medium': 10,
  'Low': 5
};

const ALL_ZONES = [
  { id: 'CH-RED-01', name: 'Velachery', currentRisk: 'High' },
  { id: 'CH-RED-02', name: 'Pallikaranai', currentRisk: 'High' },
  { id: 'CH-RED-03', name: 'Madipakkam', currentRisk: 'High' },
  { id: 'CH-RED-04', name: 'Perumbakkam', currentRisk: 'High' },
  { id: 'CH-RED-05', name: 'Semmencherry', currentRisk: 'High' },
  { id: 'CH-RED-06', name: 'Sholinganallur', currentRisk: 'High' },
  { id: 'CH-RED-07', name: 'Adyar / Thiruvanmiyur', currentRisk: 'Medium' },
  { id: 'CH-RED-08', name: 'Saidapet', currentRisk: 'Medium' },
  { id: 'CH-RED-09', name: 'Kotturpuram', currentRisk: 'Medium' },
  { id: 'CH-RED-10', name: 'T. Nagar', currentRisk: 'Low' },
  { id: 'CH-RED-11', name: 'Kodambakkam', currentRisk: 'Low' },
  { id: 'CH-RED-12', name: 'Anna Nagar', currentRisk: 'Low' },
  { id: 'CH-RED-13', name: 'Tambaram', currentRisk: 'Low' },
  { id: 'CH-RED-14', name: 'Chromepet', currentRisk: 'Low' },
  { id: 'CH-RED-15', name: 'Guindy', currentRisk: 'Medium' },
];

interface RideSurakshaStepProps {
  selectedZones: string[];
  onNext: (policy: any) => void;
  onBack: () => void;
}

export function RideSurakshaStep({ selectedZones, onNext, onBack }: RideSurakshaStepProps) {
  const [days, setDays] = useState(1);
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  // UPDATED DYNAMIC PRICING LOGIC
  const calculatePrice = useMemo(() => {
    // 1. Calculate sum of weights based on zone risk
    const totalZoneWeight = (selectedZones || []).reduce((acc: number, id: string) => {
      const zone = ALL_ZONES.find(z => z.id === id);
      const risk = zone?.currentRisk || 'Low';
      return acc + (ZONE_RISK_MAP[risk] || 5);
    }, 0);

    // 2. Day Multiplier
    const dayMultipliers: Record<number, number> = { 1: 1, 2: 1.25, 3: 1.5 };
    const multiplier = dayMultipliers[days] || 1;

    // 3. Final calculation capped at 50rs
    const rawPrice = Math.round(totalZoneWeight * multiplier);
    return Math.min(50, rawPrice);
  }, [selectedZones, days]);

  const handleConfirm = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onNext({
        planName: "RideSuraksha",
        premium: calculatePrice,
        days: days,
        zonesCovered: (selectedZones || []).length
      });
    }, 1500);
  };

  if (!mounted) return null;

  return (
    <div className="w-full max-w-xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/20 rounded-full mb-2">
           <Zap className="w-3 h-3 text-primary animate-pulse" />
           <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em]"><Translate text="Parametric Protection" /></span>
        </div>
        <h2 className="text-4xl font-display font-black text-white tracking-tight uppercase leading-none">
          RideSuraksha <br />
          <span className="text-muted-foreground/60 font-bold italic normal-case text-xl tracking-normal">
             <Translate text="Dynamic Earnings Shield" />
          </span>
        </h2>
      </div>

      {/* PRICING CARD */}
      <div className="glass-strong border border-white/5 rounded-[40px] p-8 md:p-10 shadow-2xl relative overflow-hidden group">
         <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-20 transition-opacity">
            <Shield className="w-32 h-32 text-primary" />
         </div>

         <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 relative z-10">
            <div className="space-y-4">
               <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10">
                     <MapPin className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                     <p className="text-[10px] font-black text-muted-foreground/60 uppercase tracking-widest"><Translate text="Selected Territory" /></p>
                     <p className="text-white font-bold tracking-tight">{(selectedZones || []).length} <Translate text="Zones Protected" /></p>
                  </div>
               </div>

               <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10">
                     <Clock className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex flex-col">
                     <p className="text-[10px] font-black text-muted-foreground/60 uppercase tracking-widest"><Translate text="Coverage Window" /></p>
                     <div className="flex gap-2 mt-2">
                        {[1, 2, 3].map((d) => (
                           <button 
                             key={d} 
                             onClick={() => setDays(d)}
                             className={`px-4 py-2 rounded-xl text-xs font-black transition-all ${days === d ? 'bg-primary text-white shadow-lg shadow-primary/30' : 'bg-white/5 text-muted-foreground/80 hover:bg-white/10'}`}
                           >
                             {d} <Translate text="Day" />{d > 1 ? 's' : ''}
                           </button>
                        ))}
                     </div>
                  </div>
               </div>
            </div>

            <div className="text-center md:text-right bg-white/5 md:bg-transparent p-6 md:p-0 rounded-3xl md:rounded-none border border-white/5 md:border-none min-w-[140px]">
               <p className="text-[10px] font-black text-muted-foreground/60 uppercase tracking-[0.2em] mb-1"><Translate text="Total Premium" /></p>
               <div className="flex items-baseline justify-center md:justify-end gap-1">
                  <span className="text-primary font-black text-5xl tracking-tighter transition-all duration-300">₹{calculatePrice}</span>
                  <span className="text-muted-foreground/80 text-[10px] font-black uppercase tracking-widest">/ <Translate text="Policy" /></span>
               </div>
               <div className="mt-4 flex items-center justify-center md:justify-end gap-2 text-primary font-black text-[10px] uppercase tracking-widest">
                  <TrendingUp className="w-3 h-3" />
                  <Translate text="Risk Adjusted" />
               </div>
            </div>
         </div>
      </div>

      {/* RISK SUMMARY */}
      <div className="flex items-center gap-3 p-4 bg-white/3 border border-white/5 rounded-2xl">
         <AlertTriangle className="w-4 h-4 text-muted-foreground/80" />
         <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/80">
            <Translate text="Premium capped at ₹50 max. Weighted by zone risk profiles." />
         </p>
      </div>

      {/* BENEFITS PANEL */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
         <div className="p-6 glass-subtle border border-white/5 rounded-3xl flex items-start gap-4">
            <Check className="w-5 h-5 text-primary shrink-0 mt-1" />
            <div>
               <h4 className="text-sm font-black text-white uppercase tracking-tight"><Translate text="Rainfall Trigger" /></h4>
               <p className="text-xs text-muted-foreground/80 leading-relaxed"><Translate text="Automatic payouts if rainfall exceeds 5mm/hour in your zone." /></p>
            </div>
         </div>
         <div className="p-6 glass-subtle border border-white/5 rounded-3xl flex items-start gap-4">
            <Check className="w-5 h-5 text-primary shrink-0 mt-1" />
            <div>
               <h4 className="text-sm font-black text-white uppercase tracking-tight"><Translate text="Instant Payouts" /></h4>
               <p className="text-xs text-muted-foreground/80 leading-relaxed"><Translate text="Money credited to your linked UPI within 15 minutes of the trigger." /></p>
            </div>
         </div>
      </div>

      {/* INFO FOOTER */}
      <div className="flex items-start gap-3 p-4 bg-primary/5 border border-primary/10 rounded-2xl text-primary/60 text-[10px] leading-relaxed font-bold uppercase tracking-widest">
         <Info className="w-4 h-4 shrink-0" />
         <p>
            <Translate text="RideSuraksha uses hyper-local weather data from ISRO satellites. Premium is calculated based on current atmospheric pressure and historical zone volatility." />
         </p>
      </div>

      {/* ACTIONS */}
      <div className="flex gap-4 pt-4">
        <Button 
          onClick={onBack}
          variant="ghost"
          className="h-16 px-8 hover:bg-white/5 text-muted-foreground/80 hover:text-white transition-all rounded-[32px] font-black text-xs uppercase tracking-widest border border-white/10"
        >
           <Translate text="Back" />
        </Button>
        <Button 
          onClick={handleConfirm}
          disabled={loading}
          className="flex-1 h-16 bg-primary hover:bg-primary/90 text-white transition-all font-black text-lg rounded-[32px] flex items-center justify-center gap-3 border-none shadow-[0_0_50px_-5px_rgba(255,70,37,0.5)]"
        >
          {loading ? (
            <div className="flex items-center gap-3">
               <TrendingUp className="w-5 h-5 animate-bounce" />
               <Translate text="Underwriting..." />
            </div>
          ) : (
            <>
              <Translate text="Activate Coverage" />
              <ArrowRight className="w-6 h-6" />
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
