"use client";

import React from "react";
import { Translate } from "@/components/ui/translate";
import { CloudRain, AlertTriangle, CloudLightning, Wind, Sun, CheckCircle2, History, BadgeInfo } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ClaimHistoryItem } from "@/lib/types/dashboard";

interface RecentClaimsProps {
  claims: ClaimHistoryItem[];
  loading?: boolean;
}

export function RecentClaims({ claims, loading }: RecentClaimsProps) {
  const getIcon = (type: string) => {
    switch (type) {
      case 'RAINFALL': return CloudRain;
      case 'HEAT_INDEX': return Sun;
      case 'AQI': return Wind;
      case 'FLOOD': return CloudLightning;
      default: return AlertTriangle;
    }
  };

  const getTitle = (type: string) => {
    switch (type) {
      case 'RAINFALL': return "Heavy Rain Payout";
      case 'AQI': return "Air Quality Payout";
      case 'HEAT_INDEX': return "Extreme Heat Payout";
      case 'FLOOD': return "Flood Alert Payout";
      case 'CIVIL': return "Zone Closure Payout";
      default: return "System Payout";
    }
  };

  return (
    <Card className="glass-subtle card-glow border-white/[0.05] shadow-2xl h-full flex flex-col relative overflow-hidden group">
       <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 blur-[80px] rounded-full -translate-y-1/2 translate-x-1/2" />
       
       <CardHeader className="flex flex-row items-center justify-between pb-8">
          <div className="space-y-1 z-10">
             <CardTitle className="text-xl font-display font-black text-white tracking-tight uppercase flex items-center gap-3 italic">
                <History className="w-5 h-5 text-primary" />
                <Translate text="Recent Claims" />
             </CardTitle>
             <p className="text-[10px] uppercase font-bold tracking-[0.2em] text-white/20">
               <Translate text="Latest processed insurance claims" />
             </p>
          </div>
       </CardHeader>

       <CardContent className="space-y-3 pb-8 flex-1 z-10 relative">
          <div className="grid gap-3">
             {loading ? (
               <div className="p-12 text-center text-white/20 uppercase text-[10px] font-black tracking-widest border border-dashed border-white/5 rounded-[32px]">
                  <Translate text="Loading claims..." />
               </div>
             ) : claims.length === 0 ? (
               <div className="p-12 text-center text-white/20 uppercase text-[10px] font-black tracking-widest border border-dashed border-white/5 rounded-[32px]">
                  <Translate text="No historical claims found" />
               </div>
             ) : (
               claims.slice(0, 5).map((claim, idx) => {
                 const Icon = getIcon(claim.type);
                 return (
                   <div key={claim.id || idx} className="p-6 bg-white/[0.02] border border-white/5 rounded-[32px] flex items-center justify-between group/event hover:border-primary/20 hover:bg-white/[0.04] transition-all">
                      <div className="flex items-center gap-6">
                         <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center group-hover/event:bg-primary/10 transition-colors border border-white/5 group-hover/event:border-primary/20">
                            <Icon className="w-7 h-7 text-white/40 group-hover/event:text-primary transition-colors" />
                         </div>
                         <div className="space-y-1.5">
                            <div className="flex items-center gap-2">
                              <p className="text-lg font-display font-black text-white tracking-tight uppercase leading-none italic">
                                 <Translate text={getTitle(claim.type)} />
                              </p>
                              <span className="text-[9px] font-black bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 px-2 py-0.5 rounded-full">
                                {claim.status}
                              </span>
                            </div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-white/30 flex items-center gap-2">
                               <span className="text-white/60">{claim.zone}</span> 
                               <span className="opacity-40">·</span> 
                               {new Date(claim.timestamp).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                            </p>
                         </div>
                      </div>
                      
                      <div className="text-right space-y-1.5">
                         <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest flex items-center justify-end gap-2">
                            <CheckCircle2 className="w-3 h-3" />
                            <Translate text="Auto Verify" />
                         </p>
                         <p className="text-2xl font-black text-white italic tracking-tighter leading-none">₹{claim.amount}</p>
                      </div>
                   </div>
                 );
               })
             )}
          </div>
       </CardContent>

       <div className="p-6 border-t border-white/5 bg-black/20 mt-auto z-10 relative">
          <div className="flex gap-4 items-start">
            <BadgeInfo className="w-4 h-4 text-white/20 shrink-0 mt-0.5" />
            <p className="text-[9px] font-bold text-white/30 leading-relaxed uppercase tracking-widest">
              <Translate text="History limited to last 5 events per session security protocol." />
            </p>
          </div>
       </div>
    </Card>
  );
}

