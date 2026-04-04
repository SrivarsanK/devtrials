"use client";

import React, { useState, useEffect } from "react";
import { History, Search, Filter, Download, TrendingUp, Zap, ArrowUpRight, IndianRupee, MapPin, ShieldCheck } from "lucide-react";
import { Translate } from "@/components/ui/translate";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { TriggerService, TriggerEvent } from "@/lib/api";
import { Skeleton } from "@/components/ui/skeleton";
import { motion, AnimatePresence } from "framer-motion";

export default function PayoutHistoryPage() {
  const [loading, setLoading] = useState(true);
  const [events, setEvents] = useState<TriggerEvent[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchHistory = async () => {
      setLoading(true);
      const data = await TriggerService.getTriggers(50);
      setEvents(data);
      setLoading(false);
    };
    fetchHistory();
  }, []);

  const totalProtected = events.reduce((sum, event) => sum + (event.metadata?.payoutAmount || 0), 0);
  const filteredEvents = events.filter(e => 
    e.zoneId.toLowerCase().includes(searchQuery.toLowerCase()) ||
    e.triggerType.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatDate = (dateInput: string | Date) => {
    return new Date(dateInput).toLocaleDateString('en-US', { 
        month: 'short', day: 'numeric', year: 'numeric',
        hour: '2-digit', minute: '2-digit'
    });
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
    <div className="space-y-12 pb-12 animate-in fade-in duration-700">
      
      {/* HEADER SECTION */}
      <section className="flex flex-col md:flex-row md:items-end justify-between gap-8 pt-4">
         <div className="space-y-3">
            <h1 className="text-5xl md:text-7xl font-manrope font-black text-white tracking-tighter leading-[0.9] flex flex-wrap items-center gap-x-4 italic">
               <Translate text="Payout" />
               <span className="text-white/40 italic font-medium underline decoration-primary decoration-8 underline-offset-[16px]"><Translate text="History" /></span>
            </h1>
            <p className="text-xs font-black uppercase tracking-[0.4em] text-primary/60 px-1 opacity-80 italic">
                <Translate text="Real-time Contract Settlements" />
            </p>
         </div>

         {/* EXPORT TERMINAL */}
         <div className="bg-white/5 border border-white/5 rounded-[40px] p-6 flex flex-col sm:flex-row items-center gap-8 shadow-2xl relative overflow-hidden backdrop-blur-sm min-w-[320px] group hover:border-primary/20 transition-all cursor-pointer">
            <div className="w-16 h-16 rounded-3xl bg-primary/10 flex items-center justify-center border border-primary/20 group-hover:scale-110 transition-transform">
               <Download className="w-8 h-8 text-primary shadow-[0_0_15px_rgba(249,115,22,0.5)]" />
            </div>
            <div>
               <p className="text-[10px] font-black uppercase text-white/20 tracking-widest leading-none mb-1.5 flex items-center gap-2">
                  <Translate text="Export System Logs" />
               </p>
               <h4 className="text-2xl font-manrope font-black text-white tracking-tight uppercase leading-none">PDF / CSV Format</h4>
               <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest leading-none mt-2.5 italic">
                 <Translate text="Monthly Statements" />
               </p>
            </div>
         </div>
      </section>

      {/* STATS AREA */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <Card className="lg:col-span-3 bg-surface-card border-white/5 p-10 rounded-[48px] relative overflow-hidden group hover:border-primary/40 transition-all shadow-2xl backdrop-blur-sm">
             <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 blur-[100px] rounded-full -translate-y-1/2 translate-x-1/2" />
             <div className="flex items-center gap-4 mb-6">
                <Zap className="w-6 h-6 text-primary animate-pulse" />
                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white/40 italic"><Translate text="Total Earnings Protected" /></span>
             </div>
             <div className="flex items-end gap-6 relative">
                <div className="flex items-center text-8xl md:text-9xl font-manrope font-black text-white tracking-tighter leading-none italic">
                   <span className="text-primary text-5xl md:text-7xl -mt-8 mr-2 italic">₹</span>{totalProtected.toLocaleString()}
                </div>
                <div className="flex flex-col mb-4 space-y-2">
                   <div className="flex items-center gap-2 text-rose-500 font-black text-xs tracking-widest uppercase">
                      <TrendingUp className="w-4 h-4" /> +14.8%
                   </div>
                   <span className="text-[9px] uppercase font-black text-white/20 tracking-widest"><Translate text="vs last month" /></span>
                </div>
             </div>
          </Card>
          
          <Card className="bg-primary/5 border border-primary/20 p-10 rounded-[48px] flex flex-col justify-between group hover:bg-primary/10 transition-all relative overflow-hidden h-full min-h-[300px]">
             <div className="space-y-2">
                <IndianRupee className="w-12 h-12 text-primary opacity-50 group-hover:scale-110 transition-transform" />
                <h5 className="text-2xl font-manrope font-black text-white tracking-tighter italic"><Translate text="Wallet Audit" /></h5>
             </div>
             <div className="space-y-4">
                <p className="text-[10px] text-white/30 uppercase font-black tracking-[0.2em] leading-relaxed"><Translate text="Verification of all parametric triggers against on-ground sensor clusters." /></p>
                <Button className="w-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-widest h-14 rounded-[32px] hover:bg-primary hover:text-white group">
                  <Translate text="Run Audit" /> <ArrowUpRight className="ml-2 w-4 h-4" />
                </Button>
             </div>
          </Card>
      </div>

      {/* TRANSACTION LIST */}
      <div className="space-y-8">
         <div className="flex items-center justify-between px-2">
            <h3 className="text-xl font-manrope font-black text-white tracking-tight uppercase flex items-center gap-3 leading-none italic">
               <History className="w-6 h-6 text-primary" />
               <Translate text="Transaction Logs" />
            </h3>
            <div className="flex items-center gap-4">
               <span className="text-[10px] font-black uppercase tracking-widest text-white/20">{filteredEvents.length} <Translate text="Events" /></span>
               <Button variant="ghost" size="icon" className="w-10 h-10 rounded-xl bg-white/5 border border-white/5 text-white/30 hover:text-white">
                  <Filter className="w-4 h-4" />
               </Button>
            </div>
         </div>

         <div className="grid gap-6">
          {loading ? (
             Array(5).fill(0).map((_, i) => (
                <div key={i} className="p-10 bg-surface-card border border-white/5 rounded-[48px] space-y-6">
                   <div className="flex justify-between items-center">
                      <Skeleton className="h-4 w-24 bg-white/5" />
                      <Skeleton className="h-4 w-32 bg-white/5" />
                   </div>
                   <Skeleton className="h-12 w-1/2 bg-white/5" />
                </div>
             ))
          ) : filteredEvents.length === 0 ? (
             <Card className="p-24 text-center border-2 border-dashed border-white/5 rounded-[60px] flex flex-col items-center gap-6 bg-white/[0.01]">
                <div className="w-20 h-20 rounded-3xl bg-white/5 flex items-center justify-center">
                   <History className="w-10 h-10 text-white/10" />
                </div>
                <div className="space-y-2">
                   <p className="text-white/40 font-black uppercase tracking-[0.3em] text-sm"><Translate text="No historical data found" /></p>
                   <p className="text-[10px] text-white/20 uppercase font-black"><Translate text="System monitoring active — Check back after a precipitation event" /></p>
                </div>
             </Card>
          ) : (
            <AnimatePresence mode="popLayout">
              {filteredEvents.map((event, idx) => (
                <motion.div 
                  key={event.id || idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="p-10 bg-surface-card border border-white/5 rounded-[48px] hover:border-primary/40 transition-all group/item shadow-2xl relative overflow-hidden backdrop-blur-sm cursor-pointer active:scale-99"
                >
                   <div className="absolute top-0 right-0 p-8 pt-10">
                      <div className="text-5xl font-manrope font-black text-rose-500/10 group-hover/item:text-rose-500/20 transition-colors italic leading-none">
                         #00{idx + 1}
                      </div>
                   </div>

                   <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 mb-8">
                      <Badge className={`border-none font-black uppercase text-[10px] tracking-[0.3em] px-6 py-2 rounded-full ${
                        event.status === 'ACTIVE' 
                          ? 'bg-emerald-500/10 text-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.1)]' 
                          : 'bg-white/10 text-white/40'
                      }`}>
                        <Translate text={event.status === 'ACTIVE' ? "Settled Automatically" : "Event Expired"} />
                      </Badge>
                      <span className="text-[11px] font-black text-white/30 uppercase tracking-[0.2em] italic">
                        {formatDate(event.timestamp)}
                      </span>
                   </div>
                   
                   <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-8">
                      <div className="space-y-3">
                        <h5 className="text-3xl font-manrope font-black text-white tracking-tighter uppercase group-hover/item:text-primary transition-colors italic leading-none">
                            <Translate text={getTriggerLabel(event.triggerType)} />
                        </h5>
                        <div className="flex items-center gap-4">
                           <div className="flex items-center gap-2 text-white/40">
                              <MapPin className="w-3.5 h-3.5" />
                              <p className="text-xs font-black uppercase tracking-widest leading-none pt-0.5">
                                 <Translate text={event.zoneId} />
                              </p>
                           </div>
                           <div className="w-1.5 h-1.5 rounded-full bg-white/10" />
                           <div className="flex items-center gap-2 text-primary/60">
                              <ShieldCheck className="w-3.5 h-3.5" />
                              <p className="text-[10px] font-black uppercase tracking-widest leading-none pt-0.5">
                                 <Translate text="Contract Verified" />
                              </p>
                           </div>
                        </div>
                      </div>
                      
                      <div className="flex items-baseline gap-2 group-hover/item:scale-110 transition-transform duration-500">
                         <span className="text-3xl font-manrope font-black text-primary italic leading-none">₹</span>
                         <span className="text-7xl font-manrope font-black text-white tracking-tighter leading-none italic">{event.metadata?.payoutAmount || 0}</span>
                      </div>
                   </div>
                </motion.div>
              ))}
            </AnimatePresence>
          )}
         </div>
      </div>

    </div>
  );
}
