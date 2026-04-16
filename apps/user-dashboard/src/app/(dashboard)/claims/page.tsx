"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ShieldAlert, ShieldCheck, Zap, ArrowRight,
  Info, Plus, History
} from "lucide-react";
import { ClaimForm } from "@/components/dashboard/claims/ClaimForm";
import { ClaimHistory } from "@/components/dashboard/claims/ClaimHistory";
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
    <div className="space-y-10 pb-20 animate-in fade-in duration-700">
      
      {/* HEADER — centered */}
      <section className="text-center pt-4 space-y-6 animate-header-item opacity-0">
        <div className="flex items-center justify-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20">
            <ShieldAlert className="w-4 h-4 text-primary" />
          </div>
          <span className="text-[10px] font-black uppercase text-primary tracking-[0.4em] opacity-80">
            <Translate text="Verification Terminal" />
          </span>
        </div>

        <h1 className="text-6xl md:text-8xl font-display font-black text-white tracking-tighter leading-[0.85] uppercase">
          <Translate text="Protection" />{" "}
          <span className="text-white/40 italic font-medium"><Translate text="Claims" /></span>
        </h1>

        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white/15 max-w-lg mx-auto leading-relaxed">
          <Translate text="Initiate parametric payouts by providing biometric evidence of disruptions." />
        </p>

        {/* TAB SWITCHER — centered */}
        <div className="flex justify-center pt-2">
          <div className="glass-strong border border-white/[0.05] p-1.5 rounded-full flex shadow-2xl">
            <button 
              onClick={() => setActiveTab("form")}
              className={`px-8 py-4 rounded-full text-[10px] font-black uppercase tracking-[0.15em] transition-all flex items-center gap-2.5 ${activeTab === 'form' ? 'bg-primary text-white shadow-[0_8px_24px_-6px_rgba(249,115,22,0.4)]' : 'text-white/25 hover:text-white/60 hover:bg-white/[0.03]'}`}
            >
              <Plus className="w-3.5 h-3.5" />
              <Translate text="New Claim" />
            </button>
            <button 
              onClick={() => setActiveTab("history")}
              className={`px-8 py-4 rounded-full text-[10px] font-black uppercase tracking-[0.15em] transition-all flex items-center gap-2.5 ${activeTab === 'history' ? 'bg-primary text-white shadow-[0_8px_24px_-6px_rgba(249,115,22,0.4)]' : 'text-white/25 hover:text-white/60 hover:bg-white/[0.03]'}`}
            >
              <History className="w-3.5 h-3.5" />
              <Translate text="History" />
            </button>
          </div>
        </div>
      </section>

      {/* CONTENT */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -16 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className="animate-content-section opacity-0"
        >
          {activeTab === "form" ? (
            <div className="max-w-5xl mx-auto space-y-8">
              {/* Main claim form — full width, centered */}
              <ClaimForm onSuccess={handleClaimSuccess} />

              {/* Info cards — symmetric 3-column grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Protocol Steps */}
                {[
                  { num: "01", title: "Visual Custody", desc: "Record evidence in real-time within the zone of disruption.", icon: <ShieldAlert className="w-4 h-4 text-primary/60" /> },
                  { num: "02", title: "Metadata Integrity", desc: "Do not edit or compress files. Raw data accelerates auditing.", icon: <Zap className="w-4 h-4 text-primary/60" /> },
                  { num: "03", title: "Parametric Trigger", desc: "Wait 15 minutes for ISRO satellite reconciliation.", icon: <ShieldCheck className="w-4 h-4 text-emerald-500/60" /> },
                ].map((item) => (
                  <div key={item.num} className="glass-strong border border-white/[0.05] rounded-[36px] p-8 space-y-4 relative overflow-hidden group hover:border-white/[0.08] transition-all">
                    <div className="absolute top-0 right-0 w-20 h-20 bg-primary/[0.03] blur-[40px] rounded-full" />
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-white/[0.04] flex items-center justify-center text-[10px] font-black text-white/15 group-hover:text-primary group-hover:bg-primary/10 transition-all border border-white/[0.06]">
                        {item.num}
                      </div>
                      <h4 className="text-[11px] font-black text-white/70 uppercase italic tracking-wide group-hover:text-primary/80 transition-colors">
                        <Translate text={item.title} />
                      </h4>
                    </div>
                    <p className="text-[9px] font-bold text-white/15 uppercase tracking-widest leading-loose pl-14">
                      <Translate text={item.desc} />
                    </p>
                  </div>
                ))}
              </div>

              {/* Bottom row — symmetric 2-column */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Priority Support */}
                <div className="glass-strong border border-primary/[0.08] rounded-[36px] p-8 group cursor-pointer hover:border-primary/20 transition-all relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-primary/[0.03] blur-[40px] rounded-full" />
                  <div className="flex items-center justify-between relative z-10">
                    <div className="flex items-center gap-5">
                      <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center border border-primary/15">
                        <Zap className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-[9px] font-black text-primary uppercase tracking-widest leading-none mb-1.5">
                          <Translate text="Priority Support" />
                        </p>
                        <p className="text-sm font-black text-white uppercase italic tracking-tight leading-none">
                          <Translate text="Speak to Auditor" />
                        </p>
                      </div>
                    </div>
                    <ArrowRight className="w-5 h-5 text-primary/40 group-hover:text-primary group-hover:translate-x-1 transition-all" />
                  </div>
                </div>

                {/* Trust Tier */}
                <div className="bg-emerald-500/[0.03] border border-emerald-500/[0.08] rounded-[36px] p-8 relative overflow-hidden group hover:border-emerald-500/15 transition-all">
                  <div className="absolute -bottom-[30%] -right-[10%] w-28 h-28 bg-emerald-500/[0.04] blur-[40px] rounded-full" />
                  <div className="flex items-center gap-5 relative z-10">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/15 group-hover:scale-110 transition-transform">
                      <ShieldCheck className="w-5 h-5 text-emerald-500 drop-shadow-[0_0_8px_rgba(16,185,129,0.3)]" />
                    </div>
                    <div className="space-y-1.5">
                      <h5 className="text-[11px] font-black text-white/70 uppercase italic tracking-wide"><Translate text="Trust Tier Active" /></h5>
                      <p className="text-[9px] font-bold text-white/15 uppercase tracking-widest leading-relaxed">
                        <Translate text="98% trust score · 5-minute automated payouts" />
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="max-w-5xl mx-auto">
              <ClaimHistory claims={claims} />
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* FOOTER — centered */}
      <div className="flex justify-center pt-12">
        <div className="flex items-center gap-4 p-3 px-7 bg-white/[0.02] border border-white/[0.04] rounded-full backdrop-blur-xl group hover:border-white/[0.08] transition-all cursor-default">
          <Info className="w-3.5 h-3.5 text-white/12 group-hover:text-primary/50 transition-colors" />
          <p className="text-[8px] font-black text-white/12 uppercase tracking-[0.3em] leading-none pt-0.5 whitespace-nowrap">
            <Translate text="All claims subject to biometric & geospatial verification" />
          </p>
        </div>
      </div>
      
    </div>
  );
}
