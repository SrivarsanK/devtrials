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
import { TriggerService as ApiService } from "@/lib/api";
import anime from "animejs";

// COMPONENTS
import { RiskFeed } from "@/components/dashboard/RiskFeed";
import { StatsHistory } from "@/components/dashboard/StatsHistory";
import StatsCard from "@/components/dashboard/shared/StatsCard";

const PARTNER_LOGOS: Record<string, string> = {
  swiggy: "/logos/swiggy.png",
  zomato: "/logos/zomato.png",
  uber: "/logos/uber.svg",
  rapido: "/logos/rapido.png",
  zepto: "/logos/zepto.png",
  porter: "/logos/porter.png",
};

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
    upiId: "ramesh.kumar@upi",
    partner: "swiggy"
  });

  // SYNC WITH LOCALSTORAGE (POST-ONBOARDING)
  useEffect(() => {
    const savedUpi = localStorage.getItem('RideSuraksha_upi');
    if (savedUpi) {
      setEnrollmentData(prev => ({ ...prev, upiId: savedUpi }));
    }
  }, []);

  const adminFee = useMemo(() => {
    return Math.round(enrollmentData.premium * 0.02);
  }, [enrollmentData.premium]);

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
      targets: '.animate-plan-card',
      scale: [0.95, 1],
      opacity: [0, 1],
      duration: 800,
      easing: 'spring(1, 80, 10, 0)'
    }, '-=600')
    .add({
      targets: '.animate-grid-item',
      translateY: [20, 0],
      opacity: [0, 1],
      delay: anime.stagger(100)
    }, '-=600');
  }, []);

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
      <section className="animate-header-item opacity-0">
         <div className="flex flex-col lg:flex-row gap-8 items-stretch pt-4">
            {/* Welcome Text Area */}
            <div className="flex-1 flex flex-col justify-end space-y-6 pb-2">
               <div className="flex items-center gap-3">
                  <BadgeCheck className="w-5 h-5 text-primary animate-pulse" />
                  <span className="text-[10px] font-black uppercase text-primary tracking-[0.4em] opacity-80">
                     <Translate text="Verification Tier: Bio-Shield ✅" />
                  </span>
               </div>
               <h1 className="text-6xl md:text-8xl lg:text-9xl font-display font-black text-white tracking-tighter leading-[0.8] flex flex-wrap items-center gap-x-4 uppercase">
                  <Translate text="Vanakkam," />
                  <span className="text-white/40 italic font-medium underline-offset-[16px]">{user?.firstName || <Translate text="Worker" />}</span>
               </h1>
               <p className="text-[10px] font-black uppercase tracking-[0.5em] text-white/20 px-1 opacity-80 leading-relaxed max-w-xl">
                  <Translate text="Precision parametric coverage active for your current geofence." />
               </p>
            </div>

            {/* INTERACTIVE PLAN CARD */}
            <div className="lg:w-[420px] bg-surface-card border border-white/5 rounded-[48px] p-10 flex flex-col justify-between gap-10 group hover:border-primary/40 transition-all shadow-2xl relative overflow-hidden backdrop-blur-sm">
               <div className="absolute top-0 right-0 w-40 h-40 bg-primary/10 blur-[80px] rounded-full -translate-y-1/2 translate-x-1/2 group-hover:bg-primary/20 transition-all" />
               <div className="absolute top-0 left-0 w-1.5 h-full bg-primary" />
               
               <div className="relative z-10 flex items-center justify-between">
                  <div className="flex items-center gap-6">
                     <div className="relative">
                        <div className="w-16 h-16 rounded-3xl bg-primary/10 flex items-center justify-center border border-primary/20 shadow-inner group-hover:scale-110 transition-transform">
                           <Zap className="w-8 h-8 text-primary drop-shadow-[0_0_15px_rgba(249,115,22,0.8)]" />
                        </div>
                        <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-xl bg-white/10 border border-white/20 backdrop-blur-md flex items-center justify-center p-1.5 shadow-xl">
                           <img src={PARTNER_LOGOS[enrollmentData.partner]} alt={enrollmentData.partner} className="w-full h-full object-contain" />
                        </div>
                     </div>
                     <div>
                        <p className="text-[10px] font-black uppercase text-white/20 tracking-widest leading-none mb-1.5 flex items-center gap-2">
                           <Translate text="Coverage Active" /> <span className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse" />
                        </p>
                        <h4 className="text-2xl font-manrope font-black text-white tracking-tight uppercase leading-none italic">RideSuraksha</h4>
                     </div>
                  </div>
                  <Button 
                     onClick={() => setIsEditModalOpen(true)}
                     size="icon"
                     className="w-12 h-12 bg-white/5 border border-white/10 hover:bg-white hover:text-black rounded-2xl transition-all shadow-xl"
                  >
                     <Edit3 className="w-4 h-4" />
                  </Button>
               </div>
               
               <div className="relative z-10 space-y-6">
                  <div className="flex items-end justify-between">
                     <div className="space-y-3">
                        <div className="flex flex-col gap-1.5">
                           <p className="text-[10px] font-black text-primary uppercase tracking-widest leading-none flex items-center gap-2">
                              <Translate text="Premium" />: <span>₹{enrollmentData.premium}</span>
                           </p>
                           <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest leading-none">
                              {enrollmentData.activeDaysRem} <Translate text="Days Rem." />
                           </p>
                        </div>
                        <div className="flex items-center gap-2">
                           <div className="w-1 h-1 rounded-full bg-emerald-500" />
                           <p className="text-[9px] font-black text-white/30 uppercase tracking-[0.1em]">
                              <span className="text-white/60 lowercase">{enrollmentData.upiId}</span>
                           </p>
                        </div>
                     </div>
                     <div className="flex -space-x-3">
                        {[1, 2, 3].map(i => (
                           <div key={i} className="w-9 h-9 rounded-full border-4 border-[#0a0a0a] bg-white/5 flex items-center justify-center overflow-hidden shadow-lg">
                              <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i+10}`} alt="avatar" className="w-full h-full object-cover" />
                           </div>
                        ))}
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </section>

      {/* KEY METRICS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
         {[
           { title: "Revenue Protected", value: "₹1,450", sub: "Monthly Yield secured", icon: "rupee", status: "active" },
           { title: "Coverage Map", value: "24 Zones", sub: "Volatility hotspots", icon: "map" },
           { title: "Contract Trust", value: "98.2%", sub: "Automated payout rate", icon: "check", status: "active" },
           { title: "Node Uptime", value: "100%", sub: "Satellite verification", icon: "zap" }
         ].map((stat, i) => (
           <div key={i} className="animate-grid-item opacity-0 h-full">
             <StatsCard 
               title={stat.title}
               value={stat.value}
               subtitle={stat.sub}
               icon={stat.icon}
               status={stat.status as any}
             />
           </div>
         ))}
      </div>

      {/* CORE GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
         <div className="lg:col-span-8 flex flex-col gap-12">
            
            {/* Real-time Zone Disruptions */}
            <div className="space-y-6 animate-grid-item opacity-0 flex-1 flex flex-col">
               <div className="flex items-center justify-between px-2">
                  <h3 className="text-3xl font-display font-black text-white tracking-tight uppercase flex items-center gap-3 leading-none italic">
                     <CloudRain className="w-7 h-7 text-primary" />
                     <Translate text="Zone Disruptions" />
                  </h3>
                  <Button variant="ghost" className="text-[9px] font-black uppercase tracking-[0.2em] text-white/20 hover:text-white transition-colors h-10 border border-white/5 rounded-xl px-4">
                    <Translate text="See All" />
                  </Button>
               </div>
               <div className="flex-1">
                  <RiskFeed />
               </div>
            </div>
         </div>

         {/* Sidebar Widgets */}
         <aside className="lg:col-span-4 space-y-10 flex flex-col">
            <div className="animate-grid-item opacity-0">
               <StatsHistory />
            </div>
            
            {/* Manual Trigger Button */}
            <div className="animate-grid-item opacity-0">
               <Button className="w-full h-32 bg-rose-500/5 border border-rose-500/10 hover:bg-rose-500/10 text-rose-500 rounded-[48px] p-8 flex items-center justify-between group transition-all duration-500 active:scale-98 shadow-xl">
                  <div className="flex items-center gap-6">
                     <div className="w-16 h-16 rounded-3xl bg-rose-500/10 flex items-center justify-center border border-rose-500/20 group-hover:scale-110 transition-transform">
                        <AlertCircle className="w-8 h-8 text-rose-500" />
                     </div>
                     <div className="text-left font-black uppercase tracking-tight italic">
                        <p className="text-[10px] opacity-60 leading-none mb-1.5"><Translate text="Emergency Override" /></p>
                        <p className="text-2xl leading-none"><Translate text="Signal Loss" /></p>
                     </div>
                  </div>
                  <div className="w-12 h-12 rounded-full border border-rose-500/20 flex items-center justify-center group-hover:bg-rose-500 group-hover:text-white transition-all">
                     <Zap className="w-5 h-5" />
                  </div>
               </Button>
            </div>
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
