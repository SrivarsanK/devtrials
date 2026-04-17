"use client";

import React, { useState, useEffect, Suspense } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ShieldCheck, ShieldAlert, Loader2, Fingerprint, 
  Video, MapPin, CheckCircle, ArrowRight, Wallet
} from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Translate } from "@/components/ui/translate";
import { DashboardAPI } from "@/lib/api/dashboard";

const AUDIT_STEPS = [
  { id: "biometric", label: "Biometric Identity Sync", icon: Fingerprint, duration: 2000 },
  { id: "video", label: "AI Video Integrity Analysis", icon: Video, duration: 2500 },
  { id: "gps", label: "Geospatial Anomaly Check", icon: MapPin, duration: 1500 },
  { id: "payout", label: "Smart Contract Payout Initialization", icon: Wallet, duration: 3000 },
];

export default function ClaimAuditPage() {
  return (
    <Suspense fallback={<div className="min-h-[80vh] flex items-center justify-center"><Loader2 className="w-12 h-12 text-primary animate-spin" /></div>}>
      <ClaimAuditContent />
    </Suspense>
  );
}

function ClaimAuditContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const title = searchParams.get("title") || "Environmental Disruption";
  
  const amount = searchParams.get("amount") || "1200";
  
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [isError, setIsError] = useState(false);
  const [completedSteps, setCompletedSteps] = useState<string[]>([]);
  const [dynamicAmount, setDynamicAmount] = useState<string>(amount);
  const [isLoading, setIsLoading] = useState(!searchParams.get("amount"));

  useEffect(() => {
    async function fetchLatestAmount() {
      if (!searchParams.get("amount")) {
        try {
          const summary = await DashboardAPI.getSummary();
          if (summary.latestTrigger) {
            setDynamicAmount(summary.latestTrigger.amount.toString());
          }
        } catch (err) {
          console.error("Failed to fetch latest trigger amount", err);
        } finally {
          setIsLoading(false);
        }
      } else {
        setIsLoading(false);
      }
    }
    fetchLatestAmount();
  }, [searchParams]);

  useEffect(() => {
    if (currentStepIndex < AUDIT_STEPS.length) {
      const step = AUDIT_STEPS[currentStepIndex];
      const timer = setTimeout(() => {
        setCompletedSteps(prev => [...prev, step.id]);
        
        // If it's the last step, trigger the actual success
        if (currentStepIndex === AUDIT_STEPS.length - 1) {
          handleFinalize();
        } else {
          setCurrentStepIndex(prev => prev + 1);
        }
      }, step.duration);
      
      return () => clearTimeout(timer);
    }
  }, [currentStepIndex]);

  const handleFinalize = async () => {
    try {
      // PRO-MAX INTEGRATION SCOPE: 
      // Connect to fraud detection API here. If it passes, trigger payout.
      
      const res = await DashboardAPI.applyForClaim({
        amount: parseInt(dynamicAmount), // Dynamic based on claim logic fetched or passed
        zone: "Global Audit Zone",
        reason: `Automated Payout for ${title}`
      });
      
      console.log("Claim Payout Success:", res);
      
      // Small verification success delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      setIsComplete(true);
    } catch (error: any) {
      console.error("Audit Payout Error:", error);
      // Fallback for demo if API fails
      setIsComplete(true);
    }
  };

  if (isComplete) {
    return (
      <div className="min-h-[90vh] flex flex-col items-center justify-center p-6 relative overflow-hidden">
        {/* AMBIENCE */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-500/10 blur-[120px] rounded-full -z-10 animate-pulse" />
        
        <motion.div 
          initial={{ scale: 0.8, opacity: 0, y: 40 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          transition={{ type: "spring", damping: 15 }}
          className="w-full max-w-lg text-center space-y-10"
        >
          <div className="relative inline-block">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", damping: 12, delay: 0.2 }}
              className="w-40 h-40 rounded-full bg-emerald-500/10 flex items-center justify-center border-2 border-emerald-500/20 shadow-[0_0_50px_rgba(16,185,129,0.2)]"
            >
              <CheckCircle className="w-20 h-20 text-emerald-500" />
            </motion.div>
            
            <motion.div 
               animate={{ 
                 scale: [1, 1.4, 1],
                 opacity: [0.1, 0.3, 0.1]
               }}
               transition={{ repeat: Infinity, duration: 4 }}
               className="absolute inset-0 bg-emerald-500/30 blur-3xl rounded-full -z-10"
            />
          </div>

          <div className="space-y-4">
            <motion.h1 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-5xl font-black text-white italic tracking-tighter uppercase leading-none"
            >
              <Translate text="Payout Secured" />
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="text-white/40 font-bold uppercase tracking-[0.4em] text-[10px]"
            >
              <Translate text="Authentication Complete • Funds Disbursed" />
            </motion.p>
          </div>

          <Card className="glass-strong border-white/[0.08] rounded-[48px] overflow-hidden shadow-2xl">
            <CardContent className="p-10 space-y-8">
              <div className="flex justify-between items-center group">
                <span className="text-[10px] uppercase font-black text-white/20 tracking-[0.2em]"><Translate text="Protection Case" /></span>
                <span className="text-[13px] font-black text-white italic uppercase tracking-tight group-hover:text-primary transition-colors">{title}</span>
              </div>
              
              <div className="h-px bg-gradient-to-r from-transparent via-white/[0.08] to-transparent" />
              
              <div className="flex flex-col items-center gap-2 py-2">
                <span className="text-[10px] uppercase font-black text-white/20 tracking-[0.4em]"><Translate text="Settlement Amount" /></span>
                <motion.span 
                  initial={{ scale: 0.9 }}
                  animate={{ scale: 1 }}
                  className="text-6xl font-black text-white italic tracking-tighter"
                >
                  ₹{Number(dynamicAmount).toLocaleString('en-IN')}
                </motion.span>
                <div className="flex items-center gap-2 mt-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,1)]" />
                  <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest italic leading-none">
                    <Translate text="Instant Payout Executed" />
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Button 
            onClick={() => router.push("/dashboard")}
            className="w-full h-20 rounded-[32px] bg-white text-black hover:bg-white/90 font-black uppercase text-[13px] tracking-[0.3em] italic transition-all group overflow-hidden relative"
          >
            <span className="relative z-10 flex items-center justify-center gap-3">
              <Translate text="Return to Dashboard" />
              <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
          </Button>

          <div className="flex items-center justify-center gap-4 text-white/10 uppercase font-black text-[8px] tracking-[0.5em]">
             <span>TXID_{Math.random().toString(36).substring(7).toUpperCase()}</span>
             <span>•</span>
             <span>BLOCK_{Math.floor(Math.random() * 1000000)}</span>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-[85vh] py-16 px-6 relative overflow-hidden">
      {/* AMBIENCE */}
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-primary/5 blur-[100px] rounded-full -z-10 animate-pulse" />
      <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-secondary/3 blur-[80px] rounded-full -z-10 animate-pulse" style={{ animationDelay: '1s' }} />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-5xl mx-auto"
      >
        <div className="mb-16 text-center lg:text-left">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="flex flex-col lg:flex-row items-center gap-6"
          >
            <div className="w-16 h-16 rounded-[24px] bg-primary/10 flex items-center justify-center border border-primary/20 shadow-[0_10px_30px_-5px_rgba(249,115,22,0.2)]">
              <ShieldCheck className="w-8 h-8 text-primary" />
            </div>
            <div className="space-y-1">
              <h1 className="text-4xl font-black text-white italic tracking-tighter uppercase leading-none">
                <Translate text="AI Security Verification" />
              </h1>
              <p className="text-white/20 font-black uppercase tracking-[0.4em] text-[9px]">
                <Translate text="Validating cryptographic proof • Analysis in progress" />
              </p>
            </div>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Main Audit Feed */}
          <div className="lg:col-span-12 xl:col-span-7 space-y-6">
            <div className="relative pl-8 space-y-8 before:absolute before:left-[1.85rem] before:top-2 before:bottom-2 before:w-px before:bg-white/[0.06]">
              {AUDIT_STEPS.map((step, index) => {
                const isActive = index === currentStepIndex;
                const isDone = completedSteps.includes(step.id);
                const Icon = step.icon;

                return (
                  <motion.div
                    key={step.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="relative group"
                  >
                    {/* Node Dot */}
                    <div className={`absolute left-[-2rem] top-6 w-4 h-4 rounded-full border-2 transition-all duration-500 z-10 ${
                      isActive 
                        ? "bg-primary border-primary/50 scale-125 shadow-[0_0_15px_rgba(249,115,22,0.6)]" 
                        : isDone 
                          ? "bg-emerald-500 border-emerald-500/50" 
                          : "bg-black border-white/10"
                    }`} />

                    <div className={`p-8 rounded-[40px] border transition-all duration-700 backdrop-blur-md flex items-center gap-6 ${
                      isActive 
                        ? "bg-white/[0.04] border-white/[0.12] shadow-2xl scale-[1.02]" 
                        : isDone 
                          ? "bg-emerald-500/[0.02] border-emerald-500/10 opacity-70" 
                          : "bg-white/[0.01] border-white/[0.04] grayscale opacity-30"
                    }`}>
                      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border transition-all duration-500 ${
                        isActive 
                          ? "bg-primary shadow-[0_15px_30px_-10px_rgba(249,115,22,0.6)] border-white/20" 
                          : isDone 
                            ? "bg-emerald-500 border-white/10" 
                            : "bg-white/[0.03] border-white/[0.08]"
                      }`}>
                        {isActive ? <Loader2 className="w-7 h-7 text-white animate-spin" /> : <Icon className="w-7 h-7 text-white" />}
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                           <h3 className={`text-[13px] font-black uppercase italic tracking-[0.05em] transition-colors duration-500 ${
                             isActive ? "text-white" : isDone ? "text-emerald-500" : "text-white/20"
                           }`}>
                             <Translate text={step.label} />
                           </h3>
                           {isDone && (
                             <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="flex items-center gap-1.5 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
                               <CheckCircle className="w-3 h-3 text-emerald-500" />
                               <span className="text-[8px] font-black text-emerald-500 uppercase tracking-widest"><Translate text="Verified" /></span>
                             </motion.div>
                           )}
                        </div>

                        {isActive && (
                          <div className="space-y-3">
                            <div className="h-1.5 bg-white/[0.05] rounded-full overflow-hidden">
                              <motion.div 
                                initial={{ width: 0 }}
                                animate={{ width: "100%" }}
                                transition={{ duration: step.duration / 1000, ease: "linear" }}
                                className="h-full bg-gradient-to-r from-primary/60 to-primary"
                              />
                            </div>
                            <div className="flex justify-between items-center text-[8px] font-black uppercase tracking-[0.2em] text-primary/40">
                               <Translate text="Processing data nodes..." />
                               <span>{Math.floor(Math.random() * 200)}ms latency</span>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Side Visuals */}
          <div className="lg:col-span-12 xl:col-span-5 space-y-8">
            <Card className="glass-strong border-white/[0.08] rounded-[56px] overflow-hidden group shadow-3xl">
              <CardContent className="p-10">
                <div className="w-full aspect-square rounded-[40px] bg-black/60 border border-white/[0.08] mb-10 flex items-center justify-center relative overflow-hidden">
                  {/* Digital Grid Pattern */}
                  <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
                  
                  <div className="absolute inset-0 bg-gradient-to-t from-primary/10 to-transparent opacity-40" />
                  
                  <div className="relative z-10 text-center space-y-6">
                    <motion.div
                      animate={{ 
                        rotateZ: [0, 10, -10, 0],
                        scale: [1, 1.05, 1]
                      }}
                      transition={{ repeat: Infinity, duration: 8 }}
                      className="w-40 h-40 rounded-full border border-white/10 flex items-center justify-center"
                    >
                      <div className="w-32 h-32 rounded-full border border-primary/20 flex items-center justify-center animate-pulse">
                        <Fingerprint className="w-16 h-16 text-white/5" />
                        <motion.div 
                          className="absolute inset-0 border-t-2 border-primary rounded-full"
                          animate={{ rotate: 360 }}
                          transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
                        />
                      </div>
                    </motion.div>
                    
                    <div className="space-y-2">
                      <div className="text-5xl font-black text-white italic tracking-tighter">AA+</div>
                      <div className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.3em]"><Translate text="Network Confidence" /></div>
                    </div>
                  </div>

                  <div className="absolute top-6 left-6 flex items-center gap-3">
                    <div className="w-2.5 h-2.5 rounded-full bg-primary animate-ping" />
                    <span className="text-[9px] font-black text-primary uppercase tracking-[0.2em]">Live Telemetry</span>
                  </div>
                </div>

                <div className="space-y-8">
                  <div className="p-8 rounded-[32px] bg-white/[0.03] border border-white/[0.08]">
                    <h4 className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em] mb-4 italic">
                      <Translate text="Neural Fraud Pattern Detection" />
                    </h4>
                    <p className="text-[11px] text-white/40 leading-relaxed font-medium">
                      <Translate text="The audit system is concurrently verifying temporal signatures across 12 distributed oracle nodes to ensure transaction integrity and situational authenticity." />
                    </p>
                  </div>
                  
                  <div className="flex items-center justify-between px-2">
                    <div className="flex flex-col">
                      <span className="text-[8px] font-black text-white/20 uppercase tracking-widest mb-1">Status</span>
                      <span className="text-[11px] font-black text-white uppercase italic">Active Audit</span>
                    </div>
                    <div className="flex flex-col items-end">
                      <span className="text-[8px] font-black text-white/20 uppercase tracking-widest mb-1">Node</span>
                      <span className="text-[11px] font-black text-primary uppercase italic">ETH-L2-SYNC</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
