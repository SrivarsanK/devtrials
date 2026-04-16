"use client";

import React from "react";
import { Translate } from "@/components/ui/translate";
import { CloudRain, AlertTriangle, CloudLightning, Wind, Sun, CheckCircle2, History } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ClaimHistoryItem } from "@/lib/types/dashboard";

interface DisruptionHistoryProps {
  history: ClaimHistoryItem[];
}

export function DisruptionHistory({ history }: DisruptionHistoryProps) {
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
      case 'RAINFALL': return "Heavy Rainfall";
      case 'AQI': return "Unsafe AQI";
      case 'HEAT_INDEX': return "Extreme Heat";
      case 'FLOOD': return "Flash Flood";
      case 'CIVIL': return "Zone Closure";
      default: return "System Alert";
    }
  };

  return (
    <Card className="glass-subtle card-glow border-white/[0.05] h-full relative group shadow-2xl overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 blur-[80px] rounded-full -translate-y-1/2 translate-x-1/2" />
      
      <CardHeader className="flex flex-row items-center justify-between pb-8">
        <div className="space-y-1 z-10">
          <CardTitle className="text-xl font-display font-black text-white tracking-tight uppercase flex items-center gap-3 italic">
             <History className="w-5 h-5 text-primary" />
             <Translate text="History of Triggered Disruptions" />
          </CardTitle>
          <p className="text-[10px] uppercase font-bold tracking-[0.2em] text-white/20">
            <Translate text="Historical payout events for your current geofence" />
          </p>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-2 pb-8 z-10 relative">
        <div className="grid gap-3">
          {history.length === 0 ? (
            <div className="p-12 text-center text-white/20 uppercase text-[10px] font-black tracking-widest border border-dashed border-white/5 rounded-[32px]">
               No historical disruptions recorded
            </div>
          ) : (
            history.map((event, idx) => {
              const Icon = getIcon(event.type);
              return (
                <div key={event.id || idx} className="p-6 bg-white/[0.02] border border-white/5 rounded-[32px] flex items-center justify-between group/event hover:border-primary/20 hover:bg-white/[0.04] transition-all">
                   <div className="flex items-center gap-6">
                      <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center group-hover/event:bg-primary/10 transition-colors border border-white/5 group-hover/event:border-primary/20">
                         <Icon className="w-7 h-7 text-white/40 group-hover/event:text-primary transition-colors" />
                      </div>
                      <div className="space-y-1.5">
                         <div className="flex items-center gap-2">
                           <p className="text-lg font-display font-black text-white tracking-tight uppercase leading-none italic">
                              <Translate text={getTitle(event.type)} />
                           </p>
                           <span className="text-[9px] font-black bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 px-2 py-0.5 rounded-full">
                             {event.status}
                           </span>
                         </div>
                         <p className="text-[10px] font-black uppercase tracking-widest text-white/30 flex items-center gap-2">
                            <span className="text-white/60">{event.zone}</span> 
                            <span className="opacity-40">·</span> 
                            {new Date(event.timestamp).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                         </p>
                      </div>
                   </div>
                   
                   <div className="text-right space-y-1.5">
                      <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest flex items-center justify-end gap-2">
                         <CheckCircle2 className="w-3 h-3" />
                         <Translate text="Payment Generated" />
                      </p>
                      <p className="text-2xl font-black text-white italic tracking-tighter leading-none">₹{event.amount}</p>
                   </div>
                </div>
              );
            })
          )}
        </div>
      </CardContent>
    </Card>
  );
}
