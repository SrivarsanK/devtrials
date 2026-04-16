"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  AlertCircle, History, 
  ShieldAlert, ShieldCheck, Zap, ArrowRight,
  Info, Plus
} from "lucide-react";
import { ClaimForm } from "@/components/dashboard/claims/ClaimForm";
import { ClaimHistory } from "@/components/dashboard/claims/ClaimHistory";
import { Button } from "@/components/ui/button";
import { Translate } from "@/components/ui/translate";
import anime from "animejs";

// Mock initial data
const initialClaims: any[] = [
  {
    id: "CLM-9382",
    type: "Weather Disruption",
    reason: "Heavy rainfall in Velachery prevented completion of primary morning slots.",
    status: "Accepted",
    date: "04/04/2026",
    videoName: "rain_velachery_0404.mp4",
    amountRequested: "₹1,450",
    adminNote: "ISRO sensor data confirms 8.4mm/hr rainfall in Velachery. Claim verified automatically."
  },
  {
    id: "CLM-8120",
    type: "Bad Air Quality",
    reason: "AQI exceeded 350 in T. Nagar, triggering mandatory health-safety work suspension.",
    status: "Pending",
    date: "03/28/2026",
    videoName: "aqi_monitor_view.mov",
    amountRequested: "₹800",
  },
  {
    id: "CLM-7655",
    type: "Others",
    reason: "Sudden closure of access points in Semmencherry due to local transit block.",
    status: "Rejected",
    date: "03/15/2026",
    videoName: "transit_block.webm",
    amountRequested: "₹1,200",
    adminNote: "Incident metadata indicates alternative routes were accessible. Request declined."
  }
];

export default function ClaimsPage() {
  const [claims, setClaims] = useState(initialClaims);
  const [activeTab, setActiveTab] = useState<"form" | "history">("form");

  useEffect(() => {
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
      targets: '.animate-content-section',
      translateY: [20, 0],
      opacity: [0, 1],
      duration: 800
    }, '-=600');
  }, []);

  const handleClaimSuccess = (newClaim: any) => {
    setClaims([newClaim, ...claims]);
    setActiveTab("history");
  };

  return (
    <div className="space-y-12 pb-20 animate-in fade-in duration-700">
      
      {/* HEADER SECTION */}
      <section className="flex flex-col xl:flex-row xl:items-end justify-between gap-8 pt-4">
         <div className="space-y-5 animate-header-item opacity-0">
            <div className="flex items-center gap-3">
               <ShieldAlert className="w-5 h-5 text-primary animate-pulse" />
               <span className="text-[10px] font-black uppercase text-primary tracking-[0.4em] opacity-80">
                  <Translate text="Verification Terminal" />
               </span>
            </div>
            <div className="space-y-2">
               <h1 className="text-6xl md:text-8xl font-display font-black text-white tracking-tighter leading-[0.8] flex flex-wrap items-center gap-x-4 uppercase">
                  <Translate text="Protection" />
                  <span className="text-white/40 italic font-medium underline-offset-[16px]"><Translate text="Claims" /></span>
               </h1>
               <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20 mt-4 max-w-xl leading-relaxed">
                  <Translate text="Initiate parametric payouts by providing biometric evidence of disruptions." />
               </p>
            </div>
         </div>

         {/* TAB SWITCHER */}
         <div className="animate-header-item opacity-0 bg-white/5 border border-white/5 p-2 rounded-[40px] flex shadow-2xl backdrop-blur-sm self-start xl:self-end">
            <button 
               onClick={() => setActiveTab("form")}
               className={`px-10 py-5 rounded-[32px] text-[10px] font-black uppercase tracking-[0.2em] transition-all flex items-center gap-3 ${activeTab === 'form' ? 'bg-primary text-white shadow-xl shadow-primary/20 neon-primary scale-[1.02]' : 'text-white/30 hover:text-white hover:bg-white/5'}`}
            >
               <Plus className="w-3.5 h-3.5" />
               <Translate text="New Claim" />
            </button>
            <button 
               onClick={() => setActiveTab("history")}
               className={`px-10 py-5 rounded-[32px] text-[10px] font-black uppercase tracking-[0.2em] transition-all flex items-center gap-3 ${activeTab === 'history' ? 'bg-primary text-white shadow-xl shadow-primary/20 neon-primary scale-[1.02]' : 'text-white/30 hover:text-white hover:bg-white/5'}`}
            >
               <History className="w-4 h-4" />
               <Translate text="History" />
            </button>
         </div>
      </section>

      <AnimatePresence mode="wait">
        <motion.div
           key={activeTab}
         initial={{ opacity: 0, y: 30 }}
         animate={{ opacity: 1, y: 0 }}
         exit={{ opacity: 0, y: -30 }}
         transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
         className="px-2 animate-content-section opacity-0"
      >
          {activeTab === "form" ? (
             <div className="grid grid-cols-1 xl:grid-cols-3 gap-10">
                <div className="xl:col-span-2">
                   <ClaimForm onSuccess={handleClaimSuccess} />
                </div>
                
                {/* Protocol Info Panel */}
                <div className="space-y-8">
                   <div className="bg-[#121212]/50 border border-white/5 rounded-[48px] p-10 space-y-8 relative overflow-hidden backdrop-blur-md">
                      <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 blur-[40px] rounded-full" />
                      
                      <div className="space-y-4">
                         <h4 className="text-[10px] font-black text-white/40 uppercase tracking-[0.4em] italic flex items-center gap-3">
                            <Zap className="w-4 h-4 text-primary" />
                            <Translate text="Filing Protocol" />
                         </h4>
                         <div className="space-y-6">
                            {[
                              { title: "Visual Custody", desc: "Always record evidence in real-time within the zone of disruption." },
                              { title: "Metadata Integrity", desc: "Do not edit or compress files. High-fidelity raw data accelerates auditing." },
                              { title: "Parametric Trigger", desc: "Wait for 15 minutes after filing for ISRO satellite reconciliation." }
                            ].map((item, i) => (
                              <div key={i} className="flex gap-5 group/item">
                                 <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-[10px] font-black text-white/20 group-hover/item:text-primary transition-colors border border-white/5 shrink-0 pt-0.5">0{i+1}</div>
                                 <div className="space-y-1.5">
                                    <p className="text-[10px] font-black text-white uppercase italic tracking-wide group-hover/item:text-primary/80 transition-colors"><Translate text={item.title} /></p>
                                    <p className="text-[9px] font-bold text-white/20 uppercase tracking-widest leading-loose"><Translate text={item.desc} /></p>
                                 </div>
                              </div>
                            ))}
                         </div>
                      </div>

                      <div className="p-6 rounded-[32px] bg-primary/5 border border-primary/10 group cursor-pointer hover:border-primary/30 transition-all">
                        <div className="flex items-center justify-between">
                           <div>
                              <p className="text-[9px] font-black text-primary uppercase tracking-widest leading-none mb-1.5">
                                 <Translate text="Priority Support" />
                              </p>
                              <p className="text-[10px] font-black text-white uppercase italic tracking-tight leading-none">
                                 <Translate text="Speak to Auditor" />
                              </p>
                           </div>
                           <ArrowRight className="w-5 h-5 text-primary group-hover:translate-x-2 transition-transform" />
                        </div>
                      </div>
                   </div>

                   <div className="p-10 bg-emerald-500/5 border border-emerald-500/10 rounded-[48px] space-y-4 relative overflow-hidden group">
                      <div className="absolute -bottom-[50%] -right-[20%] w-40 h-40 bg-emerald-500/5 blur-[50px] rounded-full" />
                      <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20 group-hover:scale-110 transition-transform">
                         <ShieldCheck className="w-6 h-6 text-emerald-500 drop-shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                      </div>
                      <div className="space-y-2 relative z-10">
                         <h5 className="text-[10px] font-black text-white uppercase italic tracking-[0.2em]"><Translate text="Trust Tier Active" /></h5>
                         <p className="text-[9px] font-bold text-white/30 uppercase tracking-widest leading-relaxed">
                            <Translate text="Your 98% trust score ensures 5-minute automated payout processing." />
                         </p>
                      </div>
                   </div>
                </div>
             </div>
          ) : (
            <div className="max-w-4xl mx-auto">
               <ClaimHistory claims={claims} />
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Global Ambience Footer */}
      <div className="flex justify-center pt-20">
         <div className="flex items-center gap-5 p-3 px-8 bg-white/5 border border-white/5 rounded-full backdrop-blur-xl group hover:border-white/10 transition-all cursor-default scale-90">
            <Info className="w-4 h-4 text-white/20 group-hover:text-primary transition-colors" />
            <p className="text-[8px] font-black text-white/20 uppercase tracking-[0.4em] leading-none pt-0.5 whitespace-nowrap">
               <Translate text="All claims are subject to biometric and geospatial verification by RideSuraksha AI" />
            </p>
         </div>
      </div>
      
    </div>
  );
}
