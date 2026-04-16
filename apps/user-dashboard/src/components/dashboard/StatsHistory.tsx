"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Translate } from "@/components/ui/translate";
import { IndianRupee, ShieldCheck, TrendingUp, ArrowUpRight, History, Zap, ShieldAlert, BadgeInfo } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TriggerService, TriggerEvent } from "@/lib/api";
import { Skeleton } from "@/components/ui/skeleton";

export function StatsHistory() {
  const [loading, setLoading] = useState(true);
  const [events, setEvents] = useState<TriggerEvent[]>([]);

  useEffect(() => {
    const fetchHistory = async () => {
      setLoading(true);
      const data = await TriggerService.getTriggers(20);
      setEvents(data);
      setLoading(false);
    };
    fetchHistory();
  }, []);

  const totalProtected = events.reduce((sum, event) => {
    return sum + (event.metadata?.payoutAmount || 0);
  }, 0);

  const activeClaims = events.filter(e => e.status === 'ACTIVE').length;

  const formatDate = (dateInput: string | Date) => {
    const date = new Date(dateInput);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const getTriggerLabel = (type: string) => {
    switch (type) {
      case 'RAINFALL': return "Heavy Rain Payout";
      case 'AQI': return "Air Quality Payout";
      case 'HEAT_INDEX': return "Heat Index Payout";
      case 'FLOOD': return "Flood Alert Payout";
      default: return "System Payout";
    }
  };

  return (
    <div className="space-y-4">
      
      {/* Total Savings Card */}
      <Card className="glass-subtle card-glow border-white/[0.05] relative group p-1 shadow-2xl">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-primary/10 via-transparent to-transparent -z-10 group-hover:from-primary/20 transition-all duration-700" />
        
        <CardHeader className="pb-4">
           <div className="flex items-center gap-3 mb-2">
              <Zap className="w-5 h-5 text-primary" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 leading-none">
                 <Translate text="Income Statistics" />
              </span>
           </div>
           <CardTitle className="text-3xl font-manrope font-black text-white tracking-tighter">
             <Translate text="Protected Total" />
           </CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-8 pb-8">
           <div className="flex items-end gap-3 text-white">
              <span className="text-6xl font-manrope font-black tracking-tightest">
                 ₹{totalProtected.toLocaleString()}
              </span>
              <div className="flex flex-col mb-2">
                  <div className="flex items-center gap-1 text-green-500 font-black text-sm tracking-tighter">
                     <TrendingUp className="w-3.5 h-3.5" /> +14%
                  </div>
                  <span className="text-[9px] uppercase font-bold text-white/20 tracking-widest leading-none mt-1">
                     <Translate text="Since Mar" />
                  </span>
              </div>
           </div>

           <div className="p-6 bg-[#0e0e0e] border border-white/5 rounded-3xl flex items-center justify-between">
              <div className="space-y-1">
                 <p className="text-lg font-bold text-white tracking-tight uppercase leading-none">
                    <Translate text="Earnings Saved" />
                 </p>
                 <p className="text-[10px] font-black uppercase tracking-widest text-white/30">
                    <Translate text={`${activeClaims} Claims Triggered`} />
                 </p>
              </div>
              <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center border border-primary/20">
                 <IndianRupee className="w-7 h-7 text-primary" />
              </div>
           </div>
        </CardContent>
      </Card>

      {/* Claims List Card */}
      <Card className="glass-subtle card-glow border-white/[0.05] shadow-2xl">
         <CardHeader className="flex flex-row items-center justify-between pb-4">
            <CardTitle className="text-xl font-manrope font-black text-white tracking-tight uppercase flex items-center gap-3">
               <History className="w-5 h-5 text-white/40" />
               <Translate text="Recent Claims" />
            </CardTitle>
         </CardHeader>

         <CardContent className="space-y-3 pb-8">
            {loading ? (
              Array(3).fill(0).map((_, i) => (
                <div key={i} className="p-5 bg-[#0e0e0e] border border-white/5 rounded-[28px] space-y-4">
                   <div className="flex justify-between">
                      <Skeleton className="h-4 w-12 bg-white/5" />
                      <Skeleton className="h-3 w-20 bg-white/5" />
                   </div>
                   <div className="flex justify-between">
                      <div className="space-y-1 flex-1">
                         <Skeleton className="h-4 w-3/4 bg-white/5" />
                         <Skeleton className="h-3 w-1/2 bg-white/5" />
                      </div>
                      <Skeleton className="h-8 w-16 bg-white/5" />
                   </div>
                </div>
              ))
            ) : events.length === 0 ? (
              <div className="p-8 text-center text-white/20 uppercase text-[10px] font-black tracking-widest border border-dashed border-white/5 rounded-[28px]">
                No historical claims found
              </div>
            ) : (
              events.map((claim, idx) => (
                <div key={claim.id || idx} className="p-5 bg-[#0e0e0e] border border-white/5 rounded-[28px] group/claim transition-all hover:bg-white/5 hover:border-white/10 active:scale-[0.98]">
                  <div className="flex items-center justify-between mb-4">
                      <Badge className={`border-none font-bold uppercase text-[9px] tracking-widest px-3 py-0.5 rounded-full ${
                        claim.status === 'ACTIVE' 
                          ? 'bg-green-500/10 text-green-500' 
                          : 'bg-white/10 text-white/30'
                      }`}>
                        <Translate text={claim.status === 'ACTIVE' ? "PAID" : "EXPIRED"} />
                      </Badge>
                      <span className="text-[10px] font-bold text-white/30 uppercase tracking-widest">
                        {formatDate(claim.timestamp)}
                      </span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <h5 className="text-base font-manrope font-black text-white tracking-tight leading-none uppercase">
                            <Translate text={getTriggerLabel(claim.triggerType)} />
                        </h5>
                        <p className="text-[10px] font-black uppercase tracking-[0.1em] text-white/20">
                            <Translate text={claim.zoneId} /> · <Translate text="Automatic Verification" />
                        </p>
                      </div>
                      <div className="text-2xl font-manrope font-black text-primary tracking-tighter">
                        ₹{claim.metadata?.payoutAmount || 0}
                      </div>
                  </div>
                </div>
              ))
            )}

            <div className="pt-6 border-t border-white/5 flex items-center justify-center group/more cursor-pointer">
               <Link href="/history" className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30 group-hover/more:text-white transition-colors flex items-center gap-3">
                  <Translate text="View Full Payout History" /> <ArrowUpRight className="w-3.5 h-3.5" />
               </Link>
            </div>
         </CardContent>
      </Card>

      <div className="rounded-3xl border border-white/5 p-6 bg-[#0e0e0e] flex gap-5 items-start">
         <div className="w-10 h-10 rounded-2xl bg-white/5 flex items-center justify-center shrink-0">
            <BadgeInfo className="w-5 h-5 text-white/30" />
         </div>
         <p className="text-xs font-bold text-white/40 leading-relaxed uppercase tracking-widest pt-1">
            <Translate text="All payouts are calculated using parametric smart contracts and verified against IMD weather radar data." />
         </p>
      </div>

    </div>
  );
}
