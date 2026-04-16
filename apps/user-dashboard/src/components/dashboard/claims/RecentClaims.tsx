"use client";

import React from "react";
import { History, BadgeInfo } from "lucide-react";
import { Translate } from "@/components/ui/translate";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ClaimHistoryItem } from "@/lib/types/dashboard";

interface RecentClaimsProps {
  claims: ClaimHistoryItem[];
  loading?: boolean;
}

export function RecentClaims({ claims, loading }: RecentClaimsProps) {
  const formatDate = (dateInput: string) => {
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
    <Card className="glass-subtle card-glow border-white/[0.05] shadow-2xl h-full flex flex-col">
       <CardHeader className="flex flex-row items-center justify-between pb-4">
          <CardTitle className="text-xl font-manrope font-black text-white tracking-tight uppercase flex items-center gap-3 italic">
             <History className="w-5 h-5 text-primary" />
             <Translate text="Recent Claims" />
          </CardTitle>
       </CardHeader>

       <CardContent className="space-y-3 pb-8 flex-1">
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
          ) : claims.length === 0 ? (
            <div className="p-8 text-center text-white/20 uppercase text-[10px] font-black tracking-widest border border-dashed border-white/5 rounded-[28px]">
              No historical claims found
            </div>
          ) : (
            claims.slice(0, 5).map((claim) => (
              <div key={claim.id} className="p-5 bg-[#0e0e0e] border border-white/5 rounded-[28px] group/claim transition-all hover:bg-white/5 hover:border-white/10 active:scale-[0.98]">
                <div className="flex items-center justify-between mb-4">
                    <Badge className={`border-none font-bold uppercase text-[9px] tracking-widest px-3 py-0.5 rounded-full ${
                      claim.status === 'PAID' 
                        ? 'bg-green-500/10 text-green-500' 
                        : 'bg-white/10 text-white/30'
                    }`}>
                      <Translate text={claim.status} />
                    </Badge>
                    <span className="text-[10px] font-bold text-white/30 uppercase tracking-widest">
                      {formatDate(claim.timestamp)}
                    </span>
                </div>
                
                <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <h5 className="text-base font-manrope font-black text-white tracking-tight leading-none uppercase">
                          <Translate text={getTriggerLabel(claim.type)} />
                      </h5>
                      <p className="text-[10px] font-black uppercase tracking-[0.1em] text-white/20">
                          <Translate text={claim.zone} /> · <Translate text="Auto Verify" />
                      </p>
                    </div>
                    <div className="text-2xl font-manrope font-black text-primary tracking-tighter">
                      ₹{claim.amount}
                    </div>
                </div>
              </div>
            ))
          )}
       </CardContent>

       <div className="p-6 border-t border-white/5 bg-black/20 mt-auto">
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
