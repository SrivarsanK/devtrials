"use client";

import React, { useState, useEffect } from "react";
import { 
  BadgeCheck, AlertCircle, Loader2, CloudRain, Zap,
  CalendarDays, CreditCard, CheckCircle2
} from "lucide-react";
import { useUser } from "@clerk/nextjs";
import { Translate } from "@/components/ui/translate";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { motion, AnimatePresence } from "framer-motion";
import anime from "animejs";

// COMPONENTS
import { DisruptionHistory } from "@/components/dashboard/DisruptionHistory";
import { PolicyStatusCard } from "@/components/dashboard/PolicyStatusCard";
import { RecentClaims } from "@/components/dashboard/claims/RecentClaims";
import { LatestTrigger } from "@/components/dashboard/LatestTrigger";

// TYPES & API
import { DashboardAPI } from "@/lib/api/dashboard";
import { DashboardSummary } from "@/lib/types/dashboard";

export default function WorkerDashboardPage() {
  const { user } = useUser();
  const [data, setData] = useState<DashboardSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editDays, setEditDays] = useState(2);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const summary = await DashboardAPI.getSummary();
      setData(summary);
      setLoading(false);
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (!loading && data) {
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
        targets: '.animate-grid-item',
        translateY: [20, 0],
        opacity: [0, 1],
        delay: anime.stagger(100)
      }, '-=600');
    }
  }, [loading, data]);

  const handleUpdatePlan = () => {
    setUpdating(true);
    setTimeout(() => {
      setUpdating(false);
      setIsEditModalOpen(false);
    }, 1500);
  };

  if (loading || !data) {
    return (
      <div className="h-[80vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-6">
          <Loader2 className="w-12 h-12 text-primary animate-spin" />
          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20 animate-pulse">
            <Translate text="Syncing Precision Data..." />
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-12 pb-12 animate-in fade-in duration-700">
      
      {/* WELCOME AREA */}
      <section className="animate-header-item opacity-0 space-y-10">
         {/* Welcome Header */}
         <div className="flex flex-col space-y-6 pt-4">
            <h1 className="text-6xl md:text-8xl lg:text-9xl font-display font-black text-white tracking-tighter leading-[0.8] flex flex-wrap items-center gap-x-4 uppercase">
               <Translate text="Vanakkam," />
               <span className="text-white/40 italic font-medium underline-offset-[16px]">{user?.firstName || <Translate text="Worker" />}</span>
            </h1>
         </div>

         {/* POLICY MEGA CARD - IMAGE 1 STYLE */}
         <PolicyStatusCard 
            policy={data.policy} 
            onEdit={() => setIsEditModalOpen(true)} 
         />
      </section>

      {/* CORE GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
         <div className="lg:col-span-6 space-y-12">
            
             {/* Latest Trigger Section */}
             <div className="animate-grid-item opacity-0">
                <LatestTrigger trigger={data.latestTrigger} />
             </div>
            
             {/* Triggered Disruptions History */}
             <div className="space-y-6 animate-grid-item opacity-0">
                <DisruptionHistory history={data.recentClaims} />
             </div>
         </div>

         {/* Sidebar Widgets */}
         <aside className="lg:col-span-6 space-y-10 flex flex-col">
            <div className="animate-grid-item opacity-0 flex-1">
               <RecentClaims claims={data.recentClaims} />
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
                         <span className="text-xl font-manrope font-black text-primary leading-none">₹5</span>
                      </div>
                      
                      <div className="flex items-center justify-between pt-2 border-t border-white/5">
                         <span className="text-[10px] font-black text-white/40 uppercase tracking-widest"><Translate text="Payout UPI" /></span>
                         <span className="text-[10px] font-black text-white/80 lowercase">{data.policy.upiId}</span>
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
