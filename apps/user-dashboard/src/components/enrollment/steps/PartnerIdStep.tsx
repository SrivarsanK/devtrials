"use client";

import React, { useState } from "react";
import { Translate } from "@/components/ui/translate";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ShieldCheck, ArrowRight, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface PartnerIdStepProps {
  onNext: (id: string) => void;
  onBack: () => void;
  partnerName: string;
}

export function PartnerIdStep({ onNext, onBack, partnerName }: PartnerIdStepProps) {
  const [partnerId, setPartnerId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleVerify = () => {
    if (partnerId.length < 5) {
      setError("Please enter a valid Partner ID (minimum 5 characters).");
      return;
    }

    setLoading(true);
    setError("");
    
    // Simulate API verification
    setTimeout(() => {
      setLoading(false);
      onNext(partnerId);
    }, 1200);
  };

  return (
    <div className="w-full max-w-lg mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4">
      <div className="text-center space-y-4">
        <div className="w-20 h-20 rounded-3xl bg-primary/10 flex items-center justify-center mx-auto relative group">
           <ShieldCheck className="w-10 h-10 text-primary drop-shadow-[0_0_15px_rgba(255,70,37,0.6)]" />
           <div className="absolute inset-0 bg-primary/5 blur-[20px] rounded-full -z-10 group-hover:bg-primary/10 transition-colors" />
        </div>
        <h2 className="text-3xl font-display font-black text-white tracking-tight uppercase">
          <Translate text="Verification" /> <br />
          <span className="text-primary/[0.8] font-bold italic normal-case text-lg tracking-normal">
             <Translate text={`Enter your ${partnerName} ID`} />
          </span>
        </h2>
      </div>

      <div className="space-y-6">
        <div className="space-y-3">
          <label className="text-[10px] font-black text-muted-foreground/70 tracking-[0.3em] uppercase ml-1">
            <Translate text="Partner ID (Platform Assigned)" />
          </label>
          <Input 
            value={partnerId} 
            onChange={(e) => setPartnerId(e.target.value)}
            placeholder={"e.g. SZ-98231"} 
            className="bg-white/5 border-white/10 h-16 text-xl focus:border-primary transition-all rounded-3xl font-bold tracking-tight text-white placeholder:text-white/10 px-8"
            disabled={loading}
          />
          <AnimatePresence>
            {error && (
              <motion.p 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="text-red-500 text-xs font-bold leading-relaxed tracking-wide mt-2 ml-1"
              >
                <Translate text={error} />
              </motion.p>
            )}
          </AnimatePresence>
        </div>

        <div className="flex gap-4">
          <Button 
            onClick={onBack}
            variant="ghost"
            disabled={loading}
            className="h-16 px-8 hover:bg-white/5 text-muted-foreground/80 hover:text-white transition-all rounded-3xl font-black text-xs uppercase tracking-widest border border-white/5"
          >
             <Translate text="Back" />
          </Button>
          <Button 
            onClick={handleVerify}
            disabled={loading}
            className="flex-1 h-16 bg-primary hover:bg-primary/90 text-white transition-all font-black text-xl rounded-3xl flex items-center justify-center gap-3 border-none shadow-[0_0_30px_-5px_rgba(255,70,37,0.4)]"
          >
            {loading ? (
              <Loader2 className="w-6 h-6 animate-spin" />
            ) : (
              <>
                <Translate text="Verify ID" />
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </Button>
        </div>
      </div>
      
      <p className="text-center text-[10px] font-black uppercase text-muted-foreground/60 tracking-[0.4em] pt-4 italic">
        Secured by ShieldLife Encrypted Systems
      </p>
    </div>
  );
}
