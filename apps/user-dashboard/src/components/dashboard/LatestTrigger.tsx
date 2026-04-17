"use client";

import React, { useState } from "react";
import { Translate } from "@/components/ui/translate";
import { AlertCircle, CloudRain, Zap, Loader2, CheckCircle2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ClaimHistoryItem } from "@/lib/types/dashboard";

interface LatestTriggerProps {
  trigger: ClaimHistoryItem | null;
}

export function LatestTrigger({ trigger }: LatestTriggerProps) {
  const [isApplying, setIsApplying] = useState(false);
  const [success, setSuccess] = useState(false);

  if (!trigger || trigger.status !== 'PENDING_APP') return null;

  const handleApply = async () => {
    setIsApplying(true);
    // Simulate API call
    try {
      // In Phase 12 we will connect this to /api/payout/apply
      await new Promise(resolve => setTimeout(resolve, 2000));
      setSuccess(true);
    } catch (e) {
      console.error(e);
    } finally {
      setIsApplying(false);
    }
  };

  return (
    <Card className="glass-subtle border-primary/20 bg-primary/[0.02] card-glow-primary relative overflow-hidden shadow-2xl group mb-10">
      <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 blur-[100px] rounded-full -translate-y-1/2 translate-x-1/2" />
      
      <CardContent className="p-8 z-10 relative">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 rounded-[32px] bg-primary/20 flex items-center justify-center border border-primary/30 shadow-[0_0_30px_rgba(249,115,22,0.2)]">
              <CloudRain className="w-10 h-10 text-primary animate-pulse" />
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <span className="px-3 py-1 bg-primary/20 text-primary text-[10px] font-black uppercase tracking-widest rounded-full border border-primary/20">
                  <Translate text="Active Disruption" />
                </span>
                <span className="text-[10px] font-bold text-white/30 uppercase tracking-widest">
                  {trigger.zone}
                </span>
              </div>
              <h3 className="text-3xl font-display font-black text-white tracking-tighter uppercase italic leading-none">
                <Translate text="Heavy Rainfall Alert" />
              </h3>
              <p className="text-[10px] font-bold text-white/40 uppercase tracking-[0.2em]">
                <Translate text="Eligibility Confirmed · Automatic Payout Available" />
              </p>
            </div>
          </div>

          <div className="flex flex-col items-end gap-4 min-w-[240px]">
            <div className="text-right">
              <p className="text-[10px] font-black text-primary uppercase tracking-[0.3em] mb-1">
                <Translate text="Estimated Payout" />
              </p>
              <p className="text-5xl font-black text-white tracking-tighter italic leading-none">
                ₹{trigger.amount}.00
              </p>
            </div>
            
            <Button 
              onClick={handleApply}
              disabled={isApplying || success}
              className={`w-full h-16 rounded-[28px] font-black text-lg transition-all uppercase tracking-tighter italic ${
                success 
                ? 'bg-emerald-500 hover:bg-emerald-600 text-white border-none' 
                : 'bg-primary hover:bg-primary-dark text-white shadow-[0_20px_40px_-10px_rgba(249,115,22,0.4)] border-none'
              }`}
            >
              {isApplying ? (
                <Loader2 className="w-6 h-6 animate-spin" />
              ) : success ? (
                <span className="flex items-center gap-2">
                  <CheckCircle2 className="w-6 h-6" />
                  <Translate text="Application Sent" />
                </span>
              ) : (
                <Translate text="Apply for Claim" />
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
