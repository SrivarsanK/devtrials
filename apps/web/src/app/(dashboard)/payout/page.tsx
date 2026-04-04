"use client";

import React, { useEffect, useState } from "react";
import { 
  ShieldCheck, 
  HelpCircle, 
  TrendingUp, 
  AlertTriangle, 
  Droplets, 
  Wind, 
  Zap,
  ChevronRight,
  Calculator,
  ArrowUpRight
} from "lucide-react";
import { fetchPrediction, PredictionResponse } from "@/lib/api";
import { cn } from "@/lib/utils";
import anime from "animejs";

export default function PayoutPage() {
  const [prediction, setPrediction] = useState<PredictionResponse | null>(null);
  const [loading, setLoading] = useState(true);

  // Default worker stats
  const BHE = 250; // Baseline Hourly Earning (Mock)
  const CR = 0.85; // Coverage Rate (Mock)

  useEffect(() => {
    async function loadData() {
      const data = await fetchPrediction({
        flood_risk_score: 0.2, // Mock current data
        rainfall_last_7d_mm: 45.0,
        is_monsoon_season: 1
      });
      setPrediction(data);
      setLoading(false);

      // Intro animation
      anime({
        targets: '.anime-payout-card',
        translateY: [20, 0],
        opacity: [0, 1],
        delay: anime.stagger(100),
        easing: 'easeOutExpo',
        duration: 800
      });
    }
    loadData();
  }, []);

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'HIGH': return 'text-destructive shadow-[0_0_15px_rgba(255,45,85,0.4)]';
      case 'MEDIUM': return 'text-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.4)]';
      default: return 'text-success shadow-[0_0_15px_rgba(16,185,129,0.4)]';
    }
  };

  const calculatePotentialPayout = (disruptedHours: number) => {
    if (!prediction) return 0;
    // Payout = BHE × DH × PHM × CR × ZF
    // Using ai_adjustment_factor as ZF (Zone Factor/Risk Multiplier)
    const phm = 1.25; // Peak hour multiplier (Mock)
    return Math.round(BHE * disruptedHours * phm * CR * prediction.ai_adjustment_factor);
  };

  return (
    <div className="flex flex-col gap-8 pb-12">
      {/* Header Section */}
      <section className="flex flex-col gap-2">
        <h1 className="text-4xl font-display font-black tracking-tighter uppercase italic">
          Payout <span className="text-primary">Support</span>
        </h1>
        <p className="text-muted-foreground font-medium max-w-xl">
          Verified income protection for climate disruptions. Your tier and coverage are dynamically adjusted by the ShieldGuard AI.
        </p>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Risk & Prediction */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Main Risk Card */}
          <div className={cn(
            "anime-payout-card glass-strong rounded-3xl p-8 relative overflow-hidden group",
            prediction?.risk_tier === 'HIGH' ? "border-destructive/30" : "border-white/[0.08]"
          )}>
            <div className="flex justify-between items-start mb-8">
              <div className="flex flex-col gap-1">
                <span className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground opacity-60">Current Risk Tier</span>
                <h2 className={cn("text-5xl font-display font-black italic", getTierColor(prediction?.risk_tier || 'MEDIUM'))}>
                  {prediction?.risk_tier || 'ANALYZING...'}
                </h2>
              </div>
              <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.06] backdrop-blur-md">
                <ShieldCheck className="size-8 text-primary" strokeWidth={2.5} />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="flex flex-col gap-1">
                <span className="text-[10px] font-bold text-muted-foreground uppercase">AI Factor</span>
                <span className="text-2xl font-display font-bold">×{prediction?.ai_adjustment_factor.toFixed(2) || '1.00'}</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-[10px] font-bold text-muted-foreground uppercase">Confidence</span>
                <span className="text-2xl font-display font-bold">
                  {prediction ? Math.round(Math.max(...Object.values(prediction.tier_probabilities)) * 100) : '--'}%
                </span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-[10px] font-bold text-muted-foreground uppercase">Weekly Premium</span>
                <span className="text-2xl font-display font-bold text-primary">₹{prediction?.final_premium_rs || '--'}</span>
              </div>
            </div>

            <div className="mt-8 pt-8 border-t border-white/[0.05] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex -space-x-2">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="size-6 rounded-full border border-background bg-muted overflow-hidden">
                      <img src={`https://i.pravatar.cc/100?u=${i+10}`} alt="User" />
                    </div>
                  ))}
                </div>
                <span className="text-xs text-muted-foreground font-medium">1.2k workers protected in this zone</span>
              </div>
              <button className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-primary hover:gap-2 transition-all group">
                Review Policy <ChevronRight className="size-4" />
              </button>
            </div>
          </div>

          {/* Environmental Signals */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="anime-payout-card glass rounded-2xl p-5 border border-white/[0.06]">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2.5 rounded-lg bg-blue-500/10 text-blue-500">
                  <Droplets className="size-5" />
                </div>
                <span className="text-sm font-bold uppercase tracking-wider">Hydraulic Risk</span>
              </div>
              <div className="flex flex-col gap-1">
                <div className="flex justify-between items-end">
                  <span className="text-2xl font-display font-bold">45.0<span className="text-xs text-muted-foreground ml-1">mm</span></span>
                  <span className="text-[10px] font-bold text-blue-500 uppercase">Monsoon Active</span>
                </div>
                <div className="h-1.5 w-full bg-white/[0.05] rounded-full mt-2 overflow-hidden">
                  <div className="h-full bg-blue-500 w-[65%]" />
                </div>
              </div>
            </div>

            <div className="anime-payout-card glass rounded-2xl p-5 border border-white/[0.06]">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2.5 rounded-lg bg-amber-500/10 text-amber-500">
                  <TrendingUp className="size-5" />
                </div>
                <span className="text-sm font-bold uppercase tracking-wider">Forecast Trend</span>
              </div>
              <div className="flex items-center gap-4">
                <div className="size-12 rounded-full border-2 border-amber-500/30 border-t-amber-500 animate-spin" />
                <div className="flex flex-col">
                  <span className="text-sm font-bold">Stable</span>
                  <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">Next 48 Hours</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Payout Calc & Request */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Payout Calculator Card */}
          <div className="anime-payout-card glass rounded-3xl p-8 border border-white/[0.08] relative">
            <div className="absolute top-0 right-0 p-8 opacity-5">
              <Calculator className="size-24 scale-150 rotate-12" />
            </div>

            <div className="flex items-center gap-3 mb-8">
              <div className="p-2 rounded-lg bg-primary/10 text-primary">
                <Zap className="size-5" />
              </div>
              <h3 className="text-lg font-bold uppercase italic tracking-tight">Eligibility Estimator</h3>
            </div>

            <div className="space-y-6 mb-8">
              <div className="flex flex-col gap-3">
                <div className="flex justify-between">
                  <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Disrupted Hours</label>
                  <span className="text-xs font-black text-primary">4.0 h</span>
                </div>
                <input type="range" className="w-full h-1.5 bg-white/[0.05] rounded-full accent-primary" />
              </div>

              <div className="flex flex-col gap-2 p-4 rounded-xl bg-white/[0.03] border border-white/[0.05]">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">Baseline (BHE)</span>
                  <span className="font-mono">₹{BHE}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">Risk Multiplier (ZF)</span>
                  <span className="font-mono">×{prediction?.ai_adjustment_factor.toFixed(2) || '1.00'}</span>
                </div>
                <div className="flex justify-between items-center pt-2 mt-2 border-t border-white/[0.05]">
                  <span className="font-bold text-foreground">Estimated Payout</span>
                  <span className="text-xl font-display font-black text-primary">₹{calculatePotentialPayout(4)}</span>
                </div>
              </div>
            </div>

            <button className="w-full py-4 rounded-2xl bg-primary text-white font-black uppercase tracking-[0.2em] text-sm shadow-[0_10px_30px_rgba(255,70,37,0.3)] hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3 group">
              Submit Payout Request
              <ArrowUpRight className="size-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-all" />
            </button>
          </div>

          {/* Info Card */}
          <div className="anime-payout-card bg-primary/5 rounded-2xl p-6 border border-primary/20">
            <div className="flex gap-4">
              <HelpCircle className="size-6 text-primary shrink-0" />
              <div className="flex flex-col gap-1">
                <span className="text-sm font-bold mb-1">How it works</span>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Payouts are automatically validated by the ShieldGuard Oracle. Your risk multiplier ({prediction?.ai_adjustment_factor.toFixed(2)}) is recalculated weekly based on your activity and regional climate signals.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

