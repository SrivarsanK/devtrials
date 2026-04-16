"use client";

import React, { useState } from "react";
import { CreditCard, Smartphone, Check, Loader2, ArrowRight, ShieldCheck, Zap } from "lucide-react";
import { Translate } from "@/components/ui/translate";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { motion, AnimatePresence } from "framer-motion";

interface UpiAutopayStepProps {
  initialUpi?: string;
  onNext: (upi: string) => void;
  onBack: () => void;
}

export function UpiAutopayStep({ initialUpi = "", onNext, onBack }: UpiAutopayStepProps) {
  const [upi, setUpi] = useState(initialUpi);
  const [status, setStatus] = useState<'idle' | 'verifying' | 'success'>('idle');
  const [error, setError] = useState("");

  const handleVerify = () => {
    if (!upi || !upi.includes("@")) {
      setError("Please enter a valid UPI ID (e.g. name@upi)");
      return;
    }
    
    setError("");
    setStatus('verifying');
    
    // Simulate mandate verification
    setTimeout(() => {
      setStatus('success');
      setTimeout(() => {
        onNext(upi);
      }, 1500);
    }, 2000);
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-5 duration-700">
      
      <div className="text-center space-y-4">
        <div className="w-16 h-16 rounded-3xl bg-primary/10 flex items-center justify-center mx-auto border border-primary/20 shadow-inner group">
          <Smartphone className="w-8 h-8 text-primary group-hover:scale-110 transition-transform" />
        </div>
        <h2 className="text-4xl font-display font-black text-white tracking-tighter leading-tight uppercase italic">
          <Translate text="Payout & Autopay" />
        </h2>
        <p className="text-xs text-muted-foreground/70 font-black uppercase tracking-[0.3em] max-w-md mx-auto leading-relaxed">
          <Translate text="Link your UPI ID for instant parametric payouts and automated coverage renewal." />
        </p>
      </div>

      <Card className="glass-strong border-white/5 rounded-[48px] p-10 shadow-2xl relative overflow-hidden backdrop-blur-md">
         <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 blur-[50px] rounded-full -translate-y-1/2 translate-x-1/2" />
         
         <div className="space-y-8 relative">
            <div className="space-y-4">
               <label className="text-[10px] font-black text-muted-foreground/80 uppercase tracking-[0.3em] px-2 block">
                  <Translate text="Enter UPI ID" />
               </label>
               <div className="relative group">
                  <div className="absolute left-6 top-1/2 -translate-y-1/2 text-muted-foreground/60 group-focus-within:text-primary transition-colors">
                     <CreditCard className="w-5 h-5" />
                  </div>
                  <Input 
                    placeholder="example@upi"
                    className="h-20 bg-white/[0.03] border-white/5 rounded-[32px] pl-16 text-xl font-display font-black text-white placeholder:text-white/10 focus:border-primary/50 transition-all border-dashed"
                    value={upi}
                    onChange={(e) => {
                       setUpi(e.target.value);
                       setError("");
                    }}
                    disabled={status !== 'idle'}
                  />
                  {status === 'success' && (
                     <div className="absolute right-6 top-1/2 -translate-y-1/2 w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center animate-in zoom-in-50">
                        <Check className="w-5 h-5 text-white" />
                     </div>
                  )}
               </div>
               {error && <p className="text-[10px] font-black text-rose-500 uppercase tracking-widest px-6 italic animate-in fade-in">{error}</p>}
            </div>

            <div className="p-8 bg-blue-500/5 border border-blue-500/10 rounded-[32px] flex items-start gap-5 group hover:bg-blue-500/10 transition-all">
               <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center shrink-0 shadow-inner group-hover:scale-110 transition-transform">
                  <Zap className="w-6 h-6 text-blue-400 drop-shadow-[0_0_10px_rgba(96,165,250,0.5)]" />
               </div>
               <div className="space-y-2">
                  <h4 className="text-sm font-black text-white uppercase tracking-tight italic leading-none"><Translate text="2hr Parametric Mandate" /></h4>
                  <p className="text-[10px] font-bold text-muted-foreground/70 uppercase leading-relaxed tracking-wider">
                     <Translate text="By enabling Autopay, you authorize RideSuraksha to automatically deposit verified claims to this ID and renew your policy window." />
                  </p>
               </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-5 pt-4">
               <Button 
                 onClick={onBack} 
                 variant="ghost" 
                 className="h-16 flex-1 px-8 rounded-3xl font-black text-xs uppercase text-muted-foreground/70 border border-white/5 hover:bg-white/5 hover:text-white transition-all shadow-xl active:scale-95"
                 disabled={status !== 'idle'}
               >
                  <Translate text="Back" />
               </Button>
               <Button 
                  onClick={handleVerify}
                  disabled={status !== 'idle' || !upi}
                  className="h-16 flex-[2] bg-gradient-to-r from-primary to-primary-dark hover:opacity-95 transition-all font-black text-lg rounded-3xl flex items-center justify-center gap-3 shadow-[0_20px_40px_-5px_rgba(255,70,37,0.3)] border-none disabled:opacity-50 active:scale-98"
               >
                  {status === 'verifying' ? (
                     <>
                        <Loader2 className="w-6 h-6 animate-spin" />
                        <Translate text="Verifying Mandate..." />
                     </>
                  ) : status === 'success' ? (
                     <>
                        <ShieldCheck className="w-6 h-6" />
                        <Translate text="Mandate Linked" />
                     </>
                  ) : (
                     <>
                        <Translate text="Confirm & Autopay" />
                        <ArrowRight className="w-5 h-5" />
                     </>
                  )}
               </Button>
            </div>
         </div>
      </Card>

      <div className="flex flex-wrap justify-center gap-8 opacity-20">
         <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
            <span className="text-[8px] font-black uppercase tracking-[0.3em] text-white">NPCI Secured</span>
         </div>
         <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
            <span className="text-[8px] font-black uppercase tracking-[0.3em] text-white">BHIM Compliant</span>
         </div>
      </div>

    </div>
  );
}
