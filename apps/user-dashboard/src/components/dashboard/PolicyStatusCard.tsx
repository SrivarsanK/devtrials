"use client";

import React from "react";
import { Zap, Edit3, ShieldCheck, CalendarDays, CheckCircle2, UserCheck } from "lucide-react";
import { Translate } from "@/components/ui/translate";
import { Button } from "@/components/ui/button";
import { UserPolicy } from "@/lib/types/dashboard";

const PARTNER_LOGOS: Record<string, string> = {
  swiggy: "/logos/swiggy.png",
  zomato: "/logos/zomato.png",
  uber: "/logos/uber.svg",
  rapido: "/logos/rapido.png",
  zepto: "/logos/zepto.png",
  porter: "/logos/porter.png",
};

interface PolicyStatusCardProps {
  policy: UserPolicy;
  onEdit?: () => void;
}

export function PolicyStatusCard({ policy, onEdit }: PolicyStatusCardProps) {
  return (
    <div className="bg-surface-card border border-white/5 rounded-[48px] p-8 md:p-10 flex flex-col xl:flex-row items-center justify-between gap-10 group hover:border-primary/40 transition-all shadow-2xl relative overflow-hidden backdrop-blur-sm w-full">
      {/* Background Accents */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 blur-[100px] rounded-full -translate-y-1/2 translate-x-1/2 group-hover:bg-primary/10 transition-all" />
      <div className="absolute top-0 left-0 w-2 h-full bg-primary" />
      
      {/* LEFT: PRIMARY IDENTITY */}
      <div className="flex items-center gap-8 z-10 w-full xl:w-auto">
        <div className="relative">
          <div className="w-20 h-20 rounded-[32px] bg-primary/10 flex items-center justify-center border border-primary/20 shadow-inner group-hover:scale-105 transition-transform duration-500">
            <Zap className="w-10 h-10 text-primary drop-shadow-[0_0_15px_rgba(249,115,22,0.8)]" />
          </div>
          <div className="absolute -bottom-2 -right-2 w-9 h-9 rounded-xl bg-white/10 border border-white/20 backdrop-blur-md flex items-center justify-center p-1.5 shadow-2xl">
            <img src={PARTNER_LOGOS[policy.partner]} alt={policy.partner} className="w-full h-full object-contain" />
          </div>
        </div>
        <div className="space-y-1.5">
          <p className="text-[10px] font-black uppercase text-primary tracking-[0.4em] leading-none mb-1 flex items-center gap-2">
            <ShieldCheck className="w-3 h-3" />
            <Translate text="Coverage Active" /> 
            <span className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse" />
          </p>
          <h4 className="text-4xl font-display font-black text-white tracking-tighter uppercase leading-none italic">{policy.plan}</h4>
          <p className="text-[10px] font-bold text-white/20 uppercase tracking-[0.2em]">{policy.tier} Tier · {policy.zone}</p>
        </div>
      </div>

      {/* MIDDLE: METRICS & STATUS */}
      <div className="flex flex-1 items-center justify-around gap-8 z-10 w-full px-4 border-y xl:border-y-0 xl:border-x border-white/5 py-8 xl:py-0">
         <div className="space-y-1.5">
            <p className="text-[10px] font-black text-white/20 uppercase tracking-widest"><Translate text="Premium Rate" /></p>
            <div className="flex items-baseline gap-1">
               <span className="text-2xl font-black text-white italic">₹{policy.premiumAmount}</span>
               <span className="text-[10px] font-bold text-white/40 uppercase">/Day</span>
            </div>
         </div>

         <div className="space-y-1.5">
            <p className="text-[10px] font-black text-white/20 uppercase tracking-widest"><Translate text="Total Invested" /></p>
            <p className="text-2xl font-black text-emerald-500 italic">₹{policy.totalPremiumPaid}</p>
         </div>

         <div className="hidden md:flex flex-col space-y-1.5">
            <p className="text-[10px] font-black text-white/20 uppercase tracking-widest"><Translate text="Next Deduction" /></p>
            <div className="flex items-center gap-2">
               <CalendarDays className="w-4 h-4 text-primary/60" />
               <span className="text-xs font-black text-white/80 uppercase tracking-tighter">
                  {new Date(policy.expiryDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
               </span>
            </div>
         </div>

         <div className="space-y-1.5">
            <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest flex items-center gap-2">
               <CheckCircle2 className="w-3 h-3" />
               <Translate text="Auto-Pay" />
            </p>
            <p className="text-xs font-black text-white uppercase tracking-widest">{policy.autoDeduct ? 'ENABLED' : 'DISABLED'}</p>
         </div>
      </div>

      {/* RIGHT: IDENTITY & ACTIONS */}
      <div className="flex items-center gap-8 z-10 w-full xl:w-auto justify-between xl:justify-end">
        <div className="flex flex-col items-end space-y-2">
           <div className="flex -space-x-3">
             {[1, 2, 3].map(i => (
               <div key={i} className="w-10 h-10 rounded-full border-4 border-[#0a0a0a] bg-white/5 flex items-center justify-center overflow-hidden shadow-xl ring-1 ring-white/5">
                 <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i+15}`} alt="avatar" className="w-full h-full object-cover" />
               </div>
             ))}
           </div>
           <p className="text-[9px] font-black text-white/20 uppercase tracking-[0.2em] flex items-center gap-2">
              <UserCheck className="w-3 h-3" />
              <span className="lowercase underline underline-offset-4 decoration-white/10">{policy.upiId}</span>
           </p>
        </div>
        
        <Button 
          onClick={onEdit}
          size="icon"
          className="w-16 h-16 bg-white/5 border border-white/10 hover:bg-primary hover:border-primary hover:text-white rounded-[24px] transition-all duration-500 shadow-2xl group/edit"
        >
          <Edit3 className="w-6 h-6 group-hover:scale-110 transition-transform" />
        </Button>
      </div>
    </div>
  );
}
