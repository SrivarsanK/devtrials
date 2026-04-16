"use client";

import React, { useState, useEffect } from "react";
import { Translate } from "@/components/ui/translate";
import { CloudRain, AlertTriangle, Info, RefreshCw, Smartphone, TrendingUp, Sun, CloudLightning, Wind } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TriggerService, TriggerEvent } from "@/lib/api";
import { Skeleton } from "@/components/ui/skeleton";

export function RiskFeed() {
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [events, setEvents] = useState<TriggerEvent[]>([]);

  const fetchTriggers = async () => {
    setLoading(true);
    const data = await TriggerService.getTriggers();
    setEvents(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchTriggers();
    // Poll every 60s
    const timer = setInterval(fetchTriggers, 60000);
    return () => clearInterval(timer);
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await TriggerService.pollTriggers();
      await fetchTriggers();
    } catch (err) {
      console.error("Refresh failed:", err);
    } finally {
      setTimeout(() => setRefreshing(false), 800);
    }
  };

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
      case 'RAINFALL': return "Heavy Rain Imminent";
      case 'AQI': return "Unsafe Air Quality";
      case 'HEAT_INDEX': return "Extreme Heat Warning";
      case 'FLOOD': return "Flash Flood Alert";
      case 'CIVIL': return "Zone Disruption";
      default: return "System Alert";
    }
  };

  const getTimeLabel = (timestamp: string | Date) => {
    const date = new Date(timestamp);
    const diff = Date.now() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    if (minutes < 5) return "Just now";
    if (minutes < 60) return `${minutes} min ago`;
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <Card className="glass-subtle card-glow border-white/[0.05] h-full relative group shadow-2xl">
      <CardHeader className="flex flex-row items-center justify-between pb-6">
        <div className="space-y-1">
          <CardTitle className="text-xl font-manrope font-black text-white tracking-tight uppercase flex items-center gap-3">
             <div className="w-2 h-2 rounded-full bg-primary animate-ping" />
             <Translate text="Live Risk Feed" />
          </CardTitle>
          <p className="text-[10px] uppercase font-bold tracking-widest text-white/30">
            <Translate text="Zone: Chennai Central (Updated now)" />
          </p>
        </div>
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={handleRefresh}
          className="hover:bg-white/5 text-white/30 hover:text-primary transition-all active:scale-90"
        >
          <RefreshCw className={`w-5 h-5 ${refreshing ? "animate-spin" : ""}`} />
        </Button>
      </CardHeader>
      
      <CardContent className="space-y-6 pb-8">
        <div className="p-6 bg-primary/5 border border-primary/20 rounded-3xl flex flex-col items-center justify-center text-center gap-2 group-hover:bg-primary/10 transition-colors">
            <Badge variant="outline" className="bg-primary/20 text-primary border-primary font-black uppercase text-[10px] tracking-widest px-3 py-1 mb-2">
                <Translate text={events.length > 0 ? "Potential Risk" : "Normal Risk"} />
            </Badge>
            <div className="flex items-center gap-4 text-white">
                <CloudRain className="w-8 h-8 text-primary" />
                <span className="text-3xl font-manrope font-black tracking-tighter">
                   {events.length > 0 ? "74%" : "12%"}
                </span>
                <TrendingUp className={`w-5 h-5 ${events.length > 0 ? "text-red-500" : "text-green-500"}`} />
            </div>
            <p className="text-xs font-bold text-white/40 uppercase tracking-widest">
                <Translate text="Disruption Probability" />
            </p>
        </div>

        <div className="space-y-4">
          <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30 px-1 border-l border-primary/40 leading-none">
             <Translate text="Upcoming Triggers" />
          </h4>
          
          <div className="grid gap-3">
            {loading ? (
              Array(2).fill(0).map((_, i) => (
                <div key={i} className="p-5 bg-[#0e0e0e] border border-white/5 rounded-3xl flex items-center gap-5">
                   <Skeleton className="w-12 h-12 rounded-2xl bg-white/5" />
                   <div className="space-y-2 flex-1">
                      <Skeleton className="h-4 w-3/4 bg-white/5" />
                      <Skeleton className="h-3 w-1/2 bg-white/5" />
                   </div>
                </div>
              ))
            ) : events.length === 0 ? (
              <div className="p-8 text-center text-white/20 uppercase text-[10px] font-black tracking-widest border border-dashed border-white/5 rounded-3xl">
                 No active triggers in your zone
              </div>
            ) : (
              events.map((event, idx) => {
                const Icon = getIcon(event.triggerType);
                return (
                  <div key={event.id || idx} className="p-5 bg-[#0e0e0e] border border-white/5 rounded-3xl flex items-center justify-between group/alert hover:border-primary/20 transition-all">
                     <div className="flex items-center gap-5">
                        <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center group-hover/alert:bg-primary/10 transition-colors">
                           <Icon className="w-6 h-6 text-white/40 group-hover/alert:text-primary transition-colors" />
                        </div>
                        <div className="space-y-1">
                           <p className="text-sm font-manrope font-bold text-white tracking-tight uppercase">
                              <Translate text={getTitle(event.triggerType)} />
                           </p>
                           <p className="text-[10px] font-black uppercase tracking-widest text-white/20">
                              <Translate text={event.zoneId} /> · <Translate text={getTimeLabel(event.timestamp)} />
                           </p>
                        </div>
                     </div>
                     <div className={`w-2 h-2 rounded-full ${event.status === 'ACTIVE' ? 'bg-red-500' : 'bg-green-500'} shadow-[0_0_10px_rgba(239,68,68,0.4)]`} />
                  </div>
                );
              })
            )}
          </div>
        </div>

        <div className="rounded-2xl border border-white/5 p-4 flex items-center gap-4 bg-white/5 group-hover:bg-white/10 transition-colors">
           <Smartphone className="w-6 h-6 text-primary shrink-0" />
           <p className="text-[10px] font-bold text-white/40 leading-relaxed uppercase tracking-widest">
              <Translate text="Keep your GPS active for hyper-local payout calculation." />
           </p>
        </div>
      </CardContent>
    </Card>
  );
}
