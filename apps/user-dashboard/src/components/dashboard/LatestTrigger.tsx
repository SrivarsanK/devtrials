"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { Translate } from "@/components/ui/translate";
import { AlertCircle, CloudRain, Zap, Loader2, CheckCircle2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ClaimHistoryItem } from "@/lib/types/dashboard";
import { DashboardAPI } from "@/lib/api/dashboard";

interface LatestTriggerProps {
  trigger: ClaimHistoryItem | null;
  upiId: string;
}

export function LatestTrigger({ trigger, upiId }: LatestTriggerProps) {
  const [isApplying, setIsApplying] = useState(false);
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  if (!trigger || trigger.status !== 'PENDING_APP') return null;

  const handleApply = () => {
    if (!trigger) return;

    setIsApplying(true);
    // Pass the type as a query param so ClaimForm can pre-select it
    const claimBaseType = trigger.type === 'RAINFALL' ? 'Weather Disruption' : 
                        trigger.type === 'AQI' ? 'Bad Air Quality' : 'Others';
    
    const params = new URLSearchParams();
    params.set('type', claimBaseType);
    params.set('title', trigger.title || claimBaseType);
    params.set('amount', trigger.amount.toString());
    
    console.log("LatestTrigger: Redirecting to claims with context", { type: claimBaseType, title: trigger.title, amount: trigger.amount });
    router.push(`/claims?${params.toString()}`);
  };

  return (
    <Card className="glass-subtle border-white/[0.05] bg-gradient-to-br from-primary/[0.08] to-transparent card-glow relative shadow-xl group mb-10 rounded-[40px] overflow-visible">
      {/* Background Accents - Compact */}
      <div className="absolute inset-0 rounded-[40px] overflow-hidden pointer-events-none">
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary/15 blur-[100px] rounded-full animate-pulse" />
        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-primary/5 blur-[80px] rounded-full" />
      </div>
      
      <CardContent className="p-8 z-10 relative">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-10">
          
          {/* Content side */}
          <div className="flex flex-col md:flex-row items-center md:items-start gap-8 text-center md:text-left flex-1">
            <div className="relative shrink-0">
              <div className="w-20 h-20 rounded-[28px] bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center border border-primary/30 shadow-lg group-hover:scale-110 transition-transform duration-500">
                <CloudRain className="w-10 h-10 text-primary drop-shadow-[0_0_10px_rgba(249,115,22,0.5)]" />
              </div>
              <div className="absolute -top-1 -right-1 w-6 h-6 bg-primary rounded-full flex items-center justify-center border-2 border-[#0c0c0c] animate-bounce z-20">
                <Zap className="w-3 h-3 text-white fill-current" />
              </div>
            </div>

            <div className="space-y-3 max-w-xl">
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
                <span className="px-4 py-1.5 bg-primary text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-full shadow-lg">
                   <Translate text="Critical Alert" />
                </span>
                <span className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em] flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary/50" />
                  {trigger.zone}
                </span>
              </div>
              
              <div className="space-y-1">
                <h3 className="text-4xl md:text-5xl lg:text-5xl font-display font-black text-white tracking-tighter uppercase leading-none italic">
                  <Translate text={trigger.title || "Disruption"} />
                  <span className="block text-primary"><Translate text="Detected" /></span>
                </h3>
              </div>
            </div>
          </div>

          {/* Action side */}
          <div className="flex flex-col items-center lg:items-end gap-6 w-full lg:w-auto lg:min-w-[280px] shrink-0">
            <div className="text-center lg:text-right space-y-0.5 w-full">
              <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.4em]">
                <Translate text="Automated Payout" />
              </p>
              <div className="flex items-baseline justify-center lg:justify-end gap-1.5">
                <span className="text-xl font-display font-black text-primary/60 italic leading-none">₹</span>
                <span className="text-6xl md:text-7xl lg:text-7xl font-display font-black text-white tracking-tighter italic leading-none">
                  {trigger.amount}
                </span>
                <span className="text-lg font-display font-black text-white/20 italic">.00</span>
              </div>
            </div>
            
            <motion.div 
              whileHover="hover"
              className="w-full"
            >
              <Button 
                onClick={handleApply}
                disabled={isApplying || success}
                className={`w-full group/btn relative h-16 rounded-[28px] font-black text-xl transition-all uppercase tracking-tighter italic overflow-hidden border-none ${
                  success 
                  ? 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg' 
                  : 'bg-primary hover:bg-primary-dark text-white shadow-[0_20px_40px_-10px_rgba(249,115,22,0.4)] active:scale-95'
                }`}
              >
                <div className="relative z-10 flex items-center justify-center gap-3">
                  {isApplying ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <Translate text="Verifying..." />
                    </>
                  ) : success ? (
                    <>
                      <CheckCircle2 className="w-6 h-6" />
                      <Translate text="Sent" />
                    </>
                  ) : (
                    <>
                      <Translate text="Instant Claim" />
                      <Zap className="w-4 h-4 fill-current" />
                    </>
                  )}
                </div>
                {!isApplying && !success && (
                  <motion.div 
                    variants={{
                      hover: { x: '100%', transition: { duration: 0.8, ease: "easeInOut" } }
                    }}
                    initial={{ x: '-100%' }}
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-12 opacity-50 pointer-events-none"
                  />
                )}
              </Button>
            </motion.div>
            
            <p className="text-[9px] font-black text-white/30 uppercase tracking-[0.3em] text-center lg:text-right w-full">
               <span className="text-primary">{upiId}</span>
            </p>
          </div>

        </div>
      </CardContent>
    </Card>
  );
}
