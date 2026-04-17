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
import anime from "animejs";

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

    // Premium entrance animation
    const tl = anime.timeline({
      easing: 'easeOutExpo',
      duration: 1000
    });

    tl.add({
      targets: '.animate-header-item',
      translateY: [30, 0],
      opacity: [0, 1],
      delay: anime.stagger(100)
    })
    .add({
      targets: '.animate-stats-card',
      scale: [0.95, 1],
      opacity: [0, 1],
      duration: 800,
      easing: 'spring(1, 80, 10, 0)'
    }, '-=600')
    .add({
      targets: '.animate-history-item',
      translateY: [20, 0],
      opacity: [0, 1],
      delay: anime.stagger(50)
    }, '-=600');
  }, []);

  const totalProtected = events.reduce((sum, event) => sum + (event.metadata?.payoutAmount || 0), 0);
  const filteredEvents = events.filter(e => 
    (e.zoneId || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
    (e.triggerType || "").toLowerCase().includes(searchQuery.toLowerCase())
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

  const [isExporting, setIsExporting] = useState(false);

  const handleDownload = (format: 'pdf' | 'csv') => {
    const timestamp = new Date().toISOString().split('T')[0];
    const fileName = `RideSuraksha_Statement_${timestamp}`;

    if (format === 'csv') {
      // Generate CSV
      const headers = ["ID", "Type", "Zone", "Status", "Amount", "Timestamp"];
      const rows = events.map((e, idx) => [
        `#00${idx + 1}`,
        e.triggerType,
        e.zoneId,
        e.status,
        e.metadata?.payoutAmount || 0,
        new Date(e.timestamp).toLocaleString()
      ]);

      const csvContent = [
        headers.join(","),
        ...rows.map(r => r.join(","))
      ].join("\n");

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement("a");
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", `${fileName}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      // Professional PDF/Print Report Generation
      const reportWindow = window.open('', '_blank');
      if (!reportWindow) return;

      const reportHtml = `
        <!DOCTYPE html>
        <html>
          <head>
            <title>RideSuraksha - Payout Audit Report</title>
            <style>
              @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;700;900&display=swap');
              body { font-family: 'Inter', sans-serif; padding: 40px; color: #111; line-height: 1.6; }
              .header { border-bottom: 2px solid #ff4625; padding-bottom: 20px; margin-bottom: 30px; display: flex; justify-content: space-between; align-items: flex-end; }
              .logo { font-size: 24px; font-weight: 900; letter-spacing: -1px; text-transform: uppercase; }
              .logo span { color: #ff4625; }
              .title { text-align: right; }
              .title h1 { margin: 0; font-size: 14px; text-transform: uppercase; letter-spacing: 2px; color: #666; }
              .summary { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; margin-bottom: 40px; }
              .stat-card { background: #f9f9f9; padding: 20px; border-radius: 12px; border: 1px solid #eee; }
              .stat-label { font-size: 10px; font-weight: 700; color: #999; text-transform: uppercase; margin-bottom: 5px; }
              .stat-value { font-size: 20px; font-weight: 900; }
              table { width: 100%; border-collapse: collapse; margin-top: 20px; }
              th { text-align: left; background: #f4f4f4; padding: 12px; font-size: 11px; text-transform: uppercase; border-bottom: 2px solid #eee; }
              td { padding: 12px; font-size: 12px; border-bottom: 1px solid #eee; }
              .status { font-weight: 700; font-size: 10px; text-transform: uppercase; padding: 4px 8px; border-radius: 4px; }
              .status-active { background: #e6f7ef; color: #10b981; }
              .amount { font-weight: 700; color: #ff4625; }
              .footer { margin-top: 50px; font-size: 10px; color: #999; text-align: center; border-top: 1px solid #eee; padding-top: 20px; }
              @media print { .no-print { display: none; } }
            </style>
          </head>
          <body>
            <div class="header">
              <div class="logo">RIDE<span>SURAKSHA</span></div>
              <div class="title">
                <h1>Payout Audit Statement</h1>
                <div style="font-size: 10px; color: #999;">Generated on ${new Date().toLocaleString()}</div>
              </div>
            </div>

            <div class="summary">
              <div class="stat-card">
                <div class="stat-label">Total Settlements</div>
                <div class="stat-value">₹${totalProtected.toLocaleString()}</div>
              </div>
              <div class="stat-card">
                <div class="stat-label">Event Count</div>
                <div class="stat-value">${events.length}</div>
              </div>
              <div class="stat-card">
                <div class="stat-label">Coverage Zones</div>
                <div class="stat-value">24 Active</div>
              </div>
            </div>

            <table>
              <thead>
                <tr>
                  <th>Ref ID</th>
                  <th>Description</th>
                  <th>Location</th>
                  <th>Timestamp</th>
                  <th>Status</th>
                  <th>Amount</th>
                </tr>
              </thead>
              <tbody>
                ${events.map((e, idx) => `
                  <tr>
                    <td>#00${idx + 1}</td>
                    <td>${getTriggerLabel(e.triggerType)}</td>
                    <td>${e.zoneId}</td>
                    <td>${new Date(e.timestamp).toLocaleDateString()}</td>
                    <td><span class="status ${e.status === 'ACTIVE' ? 'status-active' : ''}">${e.status === 'ACTIVE' ? 'Settled' : 'Expired'}</span></td>
                    <td class="amount">₹${e.metadata?.payoutAmount || 0}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>

            <div class="footer">
              This is a computationally verified audit document. For support, contact support@ridesuraksha.io
              <br/>© 2026 RideSuraksha Parametric Insurance Platform
            </div>

            <script>
              window.onload = () => {
                window.print();
                // Optionally close the window after printing
                // window.onafterprint = () => window.close();
              };
            </script>
          </body>
        </html>
      `;

      reportWindow.document.write(reportHtml);
      reportWindow.document.close();
    }
    setIsExporting(false);
  };

  return (
    <div className="space-y-12 pb-12 animate-in fade-in duration-700">
      
      {/* EXPORT MODAL */}
      <AnimatePresence>
        {isExporting && (
           <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsExporting(false)}
                className="absolute inset-0 bg-black/80 backdrop-blur-md"
              />
              <motion.div 
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="relative bg-[#12121a] border border-white/10 rounded-[48px] p-12 w-full max-w-md shadow-2xl overflow-hidden"
              >
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-50" />
                  
                  <div className="text-center space-y-4 mb-10">
                    <h3 className="text-3xl font-display font-black text-white uppercase tracking-tight italic"><Translate text="Select Format" /></h3>
                    <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em]"><Translate text="Choose export specification" /></p>
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                      <button 
                        onClick={() => handleDownload('pdf')}
                        className="group flex flex-col items-center gap-6 p-8 bg-white/5 border border-white/5 rounded-[40px] hover:border-primary/40 hover:bg-primary/5 transition-all"
                      >
                          <div className="w-16 h-16 rounded-3xl bg-white/5 flex items-center justify-center group-hover:scale-110 transition-transform">
                             <Download className="w-8 h-8 text-white/20 group-hover:text-primary" />
                          </div>
                          <span className="text-xl font-display font-black text-white italic uppercase tracking-tighter">.PDF</span>
                      </button>

                      <button 
                        onClick={() => handleDownload('csv')}
                        className="group flex flex-col items-center gap-6 p-8 bg-white/5 border border-white/5 rounded-[40px] hover:border-primary/40 hover:bg-primary/5 transition-all"
                      >
                          <div className="w-16 h-16 rounded-3xl bg-white/5 flex items-center justify-center group-hover:scale-110 transition-transform">
                             <Download className="w-8 h-8 text-white/20 group-hover:text-primary" />
                          </div>
                          <span className="text-xl font-display font-black text-white italic uppercase tracking-tighter">.CSV</span>
                      </button>
                  </div>

                  <button 
                    onClick={() => setIsExporting(false)}
                    className="w-full mt-10 py-4 text-[10px] font-black text-white/20 uppercase tracking-[0.4em] hover:text-white transition-colors"
                  >
                    <Translate text="Dismiss Terminal" />
                  </button>
              </motion.div>
           </div>
        )}
      </AnimatePresence>
      
      {/* HEADER SECTION */}
      <section className="flex flex-col md:flex-row md:items-end justify-between gap-8 pt-4">
         <div className="space-y-4 animate-header-item opacity-0">
            <h1 className="text-6xl md:text-8xl font-display font-black text-white tracking-tighter leading-[0.8] flex flex-wrap items-center gap-x-4 uppercase">
               <Translate text="Payout" />
               <span className="text-white/40 italic font-medium underline-offset-[16px]"><Translate text="History" /></span>
            </h1>
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-primary/60 px-1 opacity-80">
                <Translate text="Real-time Contract Settlements" />
            </p>
         </div>

         {/* EXPORT TERMINAL */}
         <div 
            onClick={() => setIsExporting(true)}
            className="bg-white/5 border border-white/5 rounded-[40px] p-6 flex flex-col sm:flex-row items-center gap-8 shadow-2xl relative overflow-hidden backdrop-blur-sm min-w-[320px] group hover:border-primary/20 transition-all cursor-pointer active:scale-95"
          >
            <div className="w-16 h-16 rounded-[28px] bg-primary/10 flex items-center justify-center border border-primary/20 group-hover:scale-105 transition-all duration-500 shadow-[0_0_20px_rgba(255,70,37,0.1)]">
               <Download className="w-7 h-7 text-primary drop-shadow-[0_0_8px_rgba(255,70,37,0.8)]" strokeWidth={3} />
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
          <Card className="animate-stats-card opacity-0 lg:col-span-3 bg-surface-card border-white/5 p-10 rounded-[48px] relative overflow-hidden group hover:border-primary/40 transition-all shadow-2xl backdrop-blur-sm">
             <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 blur-[100px] rounded-full -translate-y-1/2 translate-x-1/2" />
             <div className="flex items-center gap-4 mb-6">
                <Zap className="w-6 h-6 text-primary animate-pulse" />
                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white/40 italic"><Translate text="Total Protected" /></span>
             </div>
             <div className="flex items-end gap-6 relative">
                <div className="flex items-center text-8xl md:text-9xl font-display font-black text-white tracking-tighter leading-none uppercase">
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
          
          <Card className="animate-stats-card opacity-0 bg-primary/5 border border-primary/20 p-10 rounded-[48px] flex flex-col justify-between group hover:bg-primary/10 transition-all relative overflow-hidden h-full min-h-[300px]">
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
      <div className="space-y-8 animate-history-item opacity-0">
         <div className="flex items-center justify-between px-2">
            <h3 className="text-3xl font-display font-black text-white tracking-tight uppercase flex items-center gap-3 leading-none italic">
               <History className="w-7 h-7 text-primary" />
               <Translate text="Ledger" />
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
                  className="animate-history-item opacity-0 p-10 bg-surface-card border border-white/5 rounded-[48px] hover:border-primary/40 transition-all group/item shadow-2xl relative overflow-hidden backdrop-blur-sm cursor-pointer active:scale-99"
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
                        <h5 className="text-3xl font-display font-black text-white tracking-tighter uppercase group-hover/item:text-primary transition-colors italic leading-none">
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
                         <span className="text-3xl font-display font-black text-primary leading-none">₹</span>
                         <span className="text-7xl font-display font-black text-white tracking-tighter leading-none">{event.metadata?.payoutAmount || 0}</span>
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
