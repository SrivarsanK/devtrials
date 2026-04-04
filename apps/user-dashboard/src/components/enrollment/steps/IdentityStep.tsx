"use client";

import React, { useState } from "react";
import { Translate } from "@/components/ui/translate";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Smartphone, MapPin, Bell, ArrowRight, ShieldCheck } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface IdentityStepProps {
  onNext: (data: { mobile: string; location: boolean; notification: boolean }) => void;
  onBack: () => void;
  initialMobile?: string;
}

export function IdentityStep({ onNext, onBack, initialMobile = "" }: IdentityStepProps) {
  const [mobile, setMobile] = useState(initialMobile);
  const [location, setLocation] = useState(true);
  const [notification, setNotification] = useState(true);
  const [error, setError] = useState("");

  const handleNext = () => {
    if (mobile.length !== 10 || !/^\d+$/.test(mobile)) {
      setError("Please enter a valid 10-digit mobile number.");
      return;
    }
    setError("");
    onNext({ mobile, location, notification });
  };

  return (
    <div className="w-full max-w-lg mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-6 duration-700">
      <div className="text-center space-y-4">
        <div className="w-20 h-20 rounded-3xl bg-primary/10 flex items-center justify-center mx-auto relative group">
           <Smartphone className="w-10 h-10 text-primary drop-shadow-[0_0_15px_rgba(249,115,22,0.6)]" />
           <div className="absolute inset-x-[-20%] inset-y-[-20%] bg-primary/5 blur-[40px] rounded-full -z-10 group-hover:bg-primary/10 transition-colors" />
        </div>
        <h2 className="text-3xl font-manrope font-black text-white tracking-tight uppercase">
          <Translate text="Direct Access" /> <br />
          <span className="text-white/40 font-bold italic normal-case text-lg tracking-normal">
             <Translate text="Connect your identity" />
          </span>
        </h2>
      </div>

      <div className="space-y-10">
        {/* Mobile Number */}
        <div className="space-y-4">
          <label className="text-[10px] font-black text-white/30 tracking-[0.3em] uppercase ml-1">
            <Translate text="Secondary Contact Number" />
          </label>
          <div className="relative group/input">
            <span className="absolute left-6 top-1/2 -translate-y-1/2 text-white/20 font-black text-xl">+91</span>
            <Input 
              value={mobile} 
              onChange={(e) => setMobile(e.target.value.replace(/\D/g, '').slice(0, 10))}
              placeholder="9845012345" 
              className="bg-white/5 border-white/10 h-16 text-2xl focus:border-primary transition-all rounded-3xl font-bold tracking-widest text-white placeholder:text-white/5 px-8 pl-20 ring-0 focus-visible:ring-0"
            />
          </div>
          <AnimatePresence>
            {error && (
              <motion.p 
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="text-red-500 text-xs font-bold mt-2 ml-1"
              >
                <Translate text={error} />
              </motion.p>
            )}
          </AnimatePresence>
        </div>

        {/* Permissions */}
        <div className="space-y-3 pt-6 border-t border-white/5">
          <label className="text-[10px] font-black text-white/30 tracking-[0.3em] uppercase mb-4 block">
            <Translate text="System Authorization" />
          </label>
          
          <div className="space-y-4">
            <PermissionToggle 
              icon={MapPin}
              title="Location Services"
              description="Required for micro-zone payout calculation"
              enabled={location}
              setEnabled={setLocation}
            />
            <PermissionToggle 
              icon={Bell}
              title="Push Notifications"
              description="Real-time risk alerts & payment updates"
              enabled={notification}
              setEnabled={setNotification}
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 pt-6">
          <Button 
            onClick={onBack}
            variant="ghost"
            className="h-16 px-8 hover:bg-white/5 text-white/40 hover:text-white transition-all rounded-3xl font-black text-xs uppercase tracking-widest border border-white/5"
          >
             <Translate text="Back" />
          </Button>
          <Button 
            onClick={handleNext}
            className="flex-1 h-16 bg-gradient-to-r from-primary to-primary-dark hover:opacity-90 active:scale-95 transition-all font-black text-xl rounded-3xl flex items-center justify-center gap-3 border-none shadow-[0_0_30px_-5px_rgba(249,115,22,0.4)]"
          >
            <Translate text="Save & Continue" />
            <ArrowRight className="w-5 h-5" />
          </Button>
        </div>
      </div>
      
      <p className="text-center text-[10px] font-black uppercase text-white/20 tracking-[0.4em] pt-4 italic">
        Permissions can be modified later in system settings
      </p>
    </div>
  );
}

function PermissionToggle({ icon: Icon, title, description, enabled, setEnabled }: any) {
  return (
    <div className="flex items-center justify-between p-6 bg-white/5 border border-white/5 rounded-[32px] group hover:border-white/10 transition-colors">
      <div className="flex items-center gap-4">
        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-colors ${enabled ? 'bg-primary/10 text-primary animate-pulse shadow-[0_0_20px_-5px_rgba(249,115,22,0.4)]' : 'bg-white/5 text-white/20'}`}>
          <Icon className="w-5 h-5" />
        </div>
        <div className="flex flex-col gap-0.5">
          <span className="text-sm font-black text-white/80 uppercase tracking-tight group-hover:text-white transition-colors">
            <Translate text={title} />
          </span>
          <span className="text-[10px] font-bold text-white/20 uppercase tracking-widest leading-none">
            <Translate text={description} />
          </span>
        </div>
      </div>
      <Switch 
        checked={enabled}
        onCheckedChange={setEnabled}
        className="data-[state=checked]:bg-primary"
      />
    </div>
  );
}
