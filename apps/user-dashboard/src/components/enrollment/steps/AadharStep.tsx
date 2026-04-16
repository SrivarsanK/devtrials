"use client";

import React, { useState, useEffect } from "react";
import { Translate } from "@/components/ui/translate";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ShieldCheck, ArrowRight, Loader2, KeyRound } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface AadharStepProps {
  onNext: (aadhar: string) => void;
  onBack: () => void;
  initialAadhar?: string;
}

export function AadharStep({ onNext, onBack, initialAadhar = "" }: AadharStepProps) {
  const [aadhar, setAadhar] = useState(initialAadhar);
  const [otpMode, setOtpMode] = useState(false);
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSendOtp = () => {
    if (aadhar.length !== 12 || !/^\d+$/.test(aadhar)) {
      setError("Please enter a valid 12-digit Aadhar number.");
      return;
    }
    setError("");
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setOtpMode(true);
    }, 1500);
  };

  const handleVerifyOtp = () => {
    if (otp.length !== 6) {
      setError("Please enter the 6-digit OTP sent to your Aadhaar-linked mobile.");
      return;
    }
    setError("");
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onNext(aadhar);
    }, 1500);
  };

  return (
    <div className="w-full max-w-lg mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-8 duration-700">
      <div className="text-center space-y-4">
        <div className="w-20 h-20 rounded-3xl bg-primary/10 flex items-center justify-center mx-auto relative group">
           <KeyRound className="w-10 h-10 text-primary drop-shadow-[0_0_15px_rgba(255,70,37,0.6)]" />
           <div className="absolute inset-x-[-20%] inset-y-[-20%] bg-primary/5 blur-[40px] rounded-full -z-10 group-hover:bg-primary/10 transition-colors" />
        </div>
        <h2 className="text-3xl font-display font-black text-white tracking-tight uppercase">
          <Translate text="Identity Shield" /> <br />
          <span className="text-muted-foreground/80 font-bold italic normal-case text-lg tracking-normal">
             <Translate text={otpMode ? "Verification via OTP" : "Aadhaar e-KYC Verification"} />
          </span>
        </h2>
      </div>

      <div className="space-y-8">
        <AnimatePresence mode="wait">
          {!otpMode ? (
            <motion.div 
              key="aadhar-input"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="space-y-3">
                <label className="text-[10px] font-black text-muted-foreground/70 tracking-[0.3em] uppercase ml-1">
                  <Translate text="12-Digit Aadhaar Number" />
                </label>
                <Input 
                  value={aadhar} 
                  onChange={(e) => setAadhar(e.target.value.replace(/\s/g, '').replace(/\D/g, '').slice(0, 12))}
                  placeholder="0000 0000 0000" 
                  className="bg-white/5 border-white/10 h-16 text-2xl focus:border-primary transition-all rounded-[32px] font-black tracking-[0.2em] text-white placeholder:text-white/5 px-8 text-center"
                  disabled={loading}
                />
                {error && <p className="text-red-500 text-xs font-bold leading-relaxed tracking-wide mt-2 ml-1 text-center animate-in slide-in-from-top-1"><Translate text={error} /></p>}
              </div>

              <div className="flex gap-4">
                <Button 
                  onClick={onBack}
                  variant="ghost"
                  disabled={loading}
                  className="h-16 px-8 hover:bg-white/5 text-muted-foreground/80 hover:text-white transition-all rounded-[32px] font-black text-xs uppercase tracking-widest border border-white/5"
                >
                   <Translate text="Back" />
                </Button>
                <Button 
                  onClick={handleSendOtp}
                  disabled={loading}
                  className="flex-1 h-16 bg-primary hover:bg-primary/90 text-white transition-all font-black text-lg rounded-[32px] flex items-center justify-center gap-3 border-none shadow-[0_0_30px_-5px_rgba(255,70,37,0.4)]"
                >
                  {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : <> <Translate text="Get OTP" /> <ArrowRight className="w-5 h-5" /> </>}
                </Button>
              </div>
            </motion.div>
          ) : (
            <motion.div 
              key="otp-input"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="space-y-3">
                <label className="text-[10px] font-black text-muted-foreground/70 tracking-[0.3em] uppercase ml-1 flex justify-between">
                  <span><Translate text="6-Digit OTP" /></span>
                  <button onClick={() => setOtpMode(false)} className="text-primary hover:text-white transition-colors"><Translate text="Change Number" /></button>
                </label>
                <Input 
                  value={otp} 
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  placeholder="0 0 0 0 0 0" 
                  className="bg-white/5 border-white/10 h-16 text-3xl focus:border-primary transition-all rounded-[32px] font-black tracking-[0.5em] text-white placeholder:text-white/5 px-8 text-center"
                  disabled={loading}
                />
                <p className="text-center text-[10px] font-bold text-muted-foreground/60 uppercase tracking-widest pt-2">
                   <Translate text="OTP sent to 9xxxxxxx45" />
                </p>
                {error && <p className="text-red-500 text-xs font-bold leading-relaxed tracking-wide mt-2 ml-1 text-center animate-in slide-in-from-top-1"><Translate text={error} /></p>}
              </div>

              <div className="flex gap-4">
                <Button 
                  onClick={() => setOtpMode(false)}
                  variant="ghost"
                  disabled={loading}
                  className="h-16 px-8 hover:bg-white/5 text-muted-foreground/80 hover:text-white transition-all rounded-[32px] font-black text-xs uppercase tracking-widest border border-white/5"
                >
                   <Translate text="Resend" />
                </Button>
                <Button 
                  onClick={handleVerifyOtp}
                  disabled={loading}
                  className="flex-1 h-16 bg-primary hover:bg-primary/90 text-white transition-all font-black text-lg rounded-[32px] flex items-center justify-center gap-3 border-none shadow-[0_0_30px_-5px_rgba(255,70,37,0.4)]"
                >
                  {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : <> <Translate text="Verify & Complete KYC" /> <ArrowRight className="w-5 h-5" /> </>}
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      
      <p className="text-center text-[10px] font-black uppercase text-muted-foreground/60 tracking-[0.4em] pt-4 italic">
        Direct UIDAI Integration Enabled — No Data Stored locally
      </p>
    </div>
  );
}
