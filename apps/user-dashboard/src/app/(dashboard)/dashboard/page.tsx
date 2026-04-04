"use client";

import React, { useState, useMemo, useEffect } from "react";
import { 
  ShieldCheck, Zap, TrendingUp, CloudRain, Globe, 
  BadgeCheck, Edit3, AlertCircle, Loader2
} from "lucide-react";
import { useUser } from "@clerk/nextjs";
import { Translate } from "@/components/ui/translate";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { motion, AnimatePresence } from "framer-motion";

// COMPONENTS
import { RiskFeed } from "@/components/dashboard/RiskFeed";
import { StatsHistory } from "@/components/dashboard/StatsHistory";

export default function WorkerDashboardPage() {
  const { user } = useUser();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editDays, setEditDays] = useState(2);
  const [updating, setUpdating] = useState(false);

  // MOCK ENROLLMENT DATA
  const [enrollmentData, setEnrollmentData] = useState({
    plan: "RideSuraksha",
    status: "Active",
    verificationLevel: "Bio-Shield",
    coveredZones: ["Velachery", "Pallikaranai", "Guindy"],
    activeDaysRem: 2,
    premium: 35,
    upiId: "ramesh.kumar@upi"
  });

  // SYNC WITH LOCALSTORAGE (POST-ONBOARDING)
  useEffect(() => {
    const savedUpi = localStorage.getItem('gigshield_upi');
    if (savedUpi) {
      setEnrollmentData(prev => ({ ...prev, upiId: savedUpi }));
    }
  }, []);

  const adminFee = useMemo(() => {
    return Math.round(enrollmentData.premium * 0.02);
  }, [enrollmentData.premium]);

  const handleUpdatePlan = () => {
    setUpdating(true);
    setTimeout(() => {
      setEnrollmentData(prev => ({
        ...prev,
        activeDaysRem: editDays,
        premium: prev.premium + adminFee
      }));
      setUpdating(false);
      setIsEditModalOpen(false);
    }, 1500);
  };

  return (
    <div className="space-y-12 pb-12 animate-in fade-in duration-700">
      
      {/* WELCOME AREA */}
      <section className="flex flex-col xl:flex-row xl:items-end justify-between gap-8 pt-4">
         <div className="space-y-3">
            <div className="flex items-center gap-3">
               <BadgeCheck className="w-5 h-5 text-primary animate-pulse" />
               <span className="text-[10px] font-black uppercase text-primary tracking-[0.4em] opacity-80">
                  <Translate text="Verification Tier: Bio-Shield ✅" />
               </span>
            </div>
            <h1 className="text-5xl md:text-7xl font-manrope font-black text-white tracking-tighter leading-[0.9] flex flex-wrap items-center gap-x-4">
               <Translate text="Vanakkam," />
               <span className="text-white/40 italic font-medium underline decoration-primary decoration-8 underline-offset-[16px]">{user?.firstName || <Translate text="Worker" />}</span>
            </h1>
         </div>

         {/* INTERACTIVE PLAN CARD */}
         <div className="bg-surface-card border border-white/5 rounded-[40px] p-8 flex flex-col sm:flex-row items-center gap-8 group hover:border-primary/40 transition-all shadow-2xl relative overflow-hidden backdrop-blur-sm min-w-[320px]">
            <div className="absolute top-0 left-0 w-1.5 h-full bg-primary" />
            <div className="flex items-center gap-6">
               <div className="w-16 h-16 rounded-3xl bg-primary/10 flex items-center justify-center border border-primary/20 shadow-inner group-hover:scale-110 transition-transform">
                  <Zap className="w-8 h-8 text-primary drop-shadow-[0_0_15px_rgba(249,115,22,0.8)]" />
               </div>
               <div>
                  <p className="text-[10px] font-black uppercase text-white/20 tracking-widest leading-none mb-1.5 flex items-center gap-2">
                     <Translate text="Coverage Active" /> <span className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse" />
                  </p>
                  <h4 className="text-2xl font-manrope font-black text-white tracking-tight uppercase leading-none">RideSuraksha</h4>
                  <div className="flex flex-col gap-1.5 mt-3">
                     <p className="text-[10px] font-black text-primary uppercase tracking-widest leading-none flex items-center gap-2">
                        <Translate text="Premium" />: <span>₹{enrollmentData.premium}</span>
                     </p>
                     <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest leading-none flex items-center gap-2">
                        {enrollmentData.activeDaysRem} <Translate text="Days Rem." />
                     </p>
                     <div className="flex items-center gap-2 pt-1">
                        <div className="w-1 h-1 rounded-full bg-white/20" />
                        <p className="text-[9px] font-black text-white/30 uppercase tracking-[0.1em] flex items-center gap-2">
                           <Translate text="Linked UPI" />: <span className="text-white/60 lowercase">{enrollmentData.upiId}</span>
                        </p>
                     </div>
                  </div>
               </div>
            </div>
            <Button 
               onClick={() => setIsEditModalOpen(true)}
               className="h-12 px-6 bg-white/5 border border-white/10 hover:bg-white/10 text-white rounded-2xl flex items-center gap-3 transition-all active:scale-95"
            >
               <Edit3 className="w-4 h-4 text-primary" />
               <span className="text-[10px] font-black uppercase tracking-widest"><Translate text="Edit Plan" /></span>
            </Button>
         </div>
      </section>

      {/* CORE GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
         <div className="lg:col-span-8 space-y-12">
            
            {/* Real-time Zone Disruptions */}
            <div className="space-y-6">
               <div className="flex items-center justify-between px-2">
                  <h3 className="text-xl font-manrope font-black text-white tracking-tight uppercase flex items-center gap-3 leading-none">
                     <CloudRain className="w-6 h-6 text-primary" />
                     <Translate text="Real-time Zone Disruptions" />
                  </h3>
                  <Button variant="ghost" className="text-[9px] font-black uppercase tracking-[0.2em] text-white/20 hover:text-white transition-colors h-10 border border-white/5 rounded-xl px-4">
                    <Translate text="See All" />
                  </Button>
               </div>
               <RiskFeed />
            </div>
            
            {/* Insights Section */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 pt-4">
               <Card className="bg-surface-card border-white/5 p-8 rounded-[48px] hover:border-primary/40 transition-all group shadow-2xl relative overflow-hidden backdrop-blur-sm">
                  <div className="w-14 h-14 rounded-2xl bg-primary/5 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                     <TrendingUp className="w-7 h-7 text-primary" />
                  </div>
                  <h5 className="text-xl font-manrope font-black text-white uppercase mb-2 leading-tight"><Translate text="Revenue Protection" /></h5>
                  <p className="text-xs text-white/30 font-bold uppercase leading-relaxed tracking-widest italic leading-normal"><Translate text="Total payouts of ₹1,450 secured this month" /></p>
               </Card>
               <Card className="bg-surface-card border-white/5 p-8 rounded-[48px] hover:border-white/20 transition-all group shadow-2xl relative overflow-hidden backdrop-blur-sm">
                  <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center mb-6 group-hover:bg-white/10 transition-all group-hover:scale-110">
                     <Globe className="w-7 h-7 text-white/40" />
                  </div>
                  <h5 className="text-xl font-manrope font-black text-white uppercase mb-2 leading-tight"><Translate text="Smart Coverage Map" /></h5>
                  <p className="text-xs text-white/30 font-bold uppercase leading-relaxed tracking-widest italic leading-normal"><Translate text="Explore high-volatility earning zones" /></p>
               </Card>
            </div>
         </div>

         {/* Sidebar Widgets */}
         <aside className="lg:col-span-4 space-y-10">
            <StatsHistory />
            
            {/* Manual Trigger Button */}
            <Button className="w-full h-24 bg-red-500/10 border border-red-500/20 hover:bg-red-500/15 text-red-500 rounded-[40px] p-8 flex items-center justify-between group transition-all duration-500 active:scale-98">
               <div className="text-left font-black uppercase tracking-tight">
                  <p className="text-lg leading-none mb-1.5"><Translate text="Signal Disruption" /></p>
                  <p className="text-[10px] opacity-40 leading-none"><Translate text="Manual Override" /></p>
               </div>
               <div className="w-11 h-11 bg-red-500 rounded-2xl flex items-center justify-center shadow-[0_0_20px_rgba(239,68,68,0.3)] group-hover:scale-110 transition-transform">
                  <ShieldCheck className="w-6 h-6 text-white" />
               </div>
            </Button>
         </aside>
      </div>

      {/* PLAN EDIT MODAL */}
      <AnimatePresence>
        {isEditModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
             <motion.div 
               initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
               onClick={() => setIsEditModalOpen(false)}
               className="fixed inset-0 bg-black/90 backdrop-blur-md" 
             />
             <motion.div 
               initial={{ opacity: 0, scale: 0.95, y: 30 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 30 }}
               className="bg-[#121212] border border-white/10 w-full max-w-lg rounded-[60px] p-12 relative z-10 shadow-[0_0_120px_rgba(249,115,22,0.15)] overflow-hidden"
             >
                {/* Modal Glow */}
                <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary/10 blur-[80px] rounded-full" />
                
                <div className="text-center space-y-5 mb-10 relative">
                   <div className="w-20 h-20 rounded-[32px] bg-primary/10 flex items-center justify-center mx-auto border border-primary/20 shadow-inner">
                      <Zap className="w-10 h-10 text-primary drop-shadow-[0_0_10px_rgba(249,115,22,0.5)]" />
                   </div>
                   <h3 className="text-3xl font-manrope font-black text-white leading-none uppercase tracking-tighter"><Translate text="Plan Modification" /></h3>
                   <p className="text-[10px] text-white/30 font-black uppercase tracking-[0.2em]"><Translate text="Adjust coverage on the fly" /></p>
                </div>

                <div className="space-y-10 relative">
                   <div className="space-y-5">
                      <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em] px-1"><Translate text="Coverage Window" /></p>
                      <div className="flex gap-4">
                         {[1, 2, 3].map(d => (
                            <button 
                              key={d} onClick={() => setEditDays(d)}
                              className={`flex-1 h-16 rounded-3xl font-black text-sm transition-all relative overflow-hidden flex flex-col items-center justify-center gap-1 ${
                                editDays === d 
                                ? 'bg-primary text-white shadow-2xl shadow-primary/30 scale-105 border-b-4 border-primary-dark/40' 
                                : 'bg-white/5 text-white/20 hover:bg-white/10 hover:text-white border border-white/5'
                              }`}
                            >
                               <span className="text-lg leading-none">{d}</span>
                               <span className="text-[8px] uppercase tracking-widest"><Translate text="Day" />{d > 1 ? 's' : ''}</span>
                            </button>
                         ))}
                      </div>
                   </div>

                   <div className="p-8 bg-primary/[0.03] border border-primary/20 rounded-[40px] space-y-6">
                      <div className="flex items-center justify-between">
                         <span className="text-[10px] font-black text-white/40 uppercase tracking-widest"><Translate text="Admin Modification Fee" /></span>
                         <span className="text-xl font-manrope font-black text-primary leading-none">₹{adminFee}</span>
                      </div>
                      
                      <div className="flex items-center justify-between pt-2 border-t border-white/5">
                         <span className="text-[10px] font-black text-white/40 uppercase tracking-widest"><Translate text="Payout UPI" /></span>
                         <span className="text-[10px] font-black text-white/80 lowercase">{enrollmentData.upiId}</span>
                      </div>

                      <div className="flex items-start gap-4">
                         <div className="w-4 h-4 rounded-full bg-primary/20 flex items-center justify-center shrink-0 mt-0.5">
                            <AlertCircle className="w-3 h-3 text-primary" />
                         </div>
                         <p className="text-[10px] font-bold text-primary/60 uppercase leading-relaxed tracking-wider">
                            <Translate text="Every policy change incurs a +2% Admin Surcharge on your current premium base." />
                         </p>
                      </div>
                   </div>

                   <div className="flex flex-col sm:flex-row gap-5">
                      <Button onClick={() => setIsEditModalOpen(false)} variant="ghost" className="h-20 flex-1 px-8 rounded-[32px] font-black text-[11px] uppercase text-white/20 border border-white/5 hover:bg-white/5 hover:text-white transition-all">
                         <Translate text="Cancel" />
                      </Button>
                      <Button 
                         onClick={handleUpdatePlan} 
                         disabled={updating}
                         className="h-20 flex-[1.5] bg-primary hover:bg-primary-dark text-white rounded-[32px] font-black text-xl transition-all shadow-[0_20px_40px_-10px_rgba(249,115,22,0.4)] border-none disabled:opacity-50"
                      >
                         {updating ? <Loader2 className="w-7 h-7 animate-spin" /> : <Translate text="Confirm Changes" />}
                      </Button>
                   </div>
                </div>
             </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
