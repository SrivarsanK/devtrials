"use client";

import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Upload, FileText, CheckCircle, AlertCircle, 
  Video, X, Trash2, Shield, Info
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Translate } from "@/components/ui/translate";

const claimTypes = [
  "Weather Disruption",
  "Bad Air Quality",
  "Others"
];

export function ClaimForm({ onSuccess }: { onSuccess: (claim: any) => void }) {
  const [video, setVideo] = useState<File | null>(null);
  const [reason, setReason] = useState("");
  const [claimType, setClaimType] = useState(claimTypes[0]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setVideo(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!video || !reason) return;

    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const newClaim = {
      id: Math.random().toString(36).substr(2, 9),
      type: claimType,
      reason,
      status: "Pending",
      date: new Date().toLocaleDateString(),
      videoName: video.name,
      amountRequested: "₹1,200",
    };
    
    setIsSubmitting(false);
    setIsSuccess(true);
    setTimeout(() => {
      onSuccess(newClaim);
      setVideo(null);
      setReason("");
      setIsSuccess(false);
    }, 1500);
  };

  return (
    <Card className="glass-strong border-white/[0.06] rounded-[48px] overflow-hidden shadow-2xl relative backdrop-blur-xl">
      <div className="absolute top-0 right-0 w-40 h-40 bg-primary/5 blur-[80px] rounded-full" />
      <div className="absolute bottom-0 left-0 w-32 h-32 bg-secondary/5 blur-[60px] rounded-full" />
      
      <CardContent className="p-10 md:p-12 relative z-10">
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center border border-primary/20">
              <Shield className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-black text-white uppercase italic tracking-tighter leading-none">
                <Translate text="Initiate Claim" />
              </h2>
              <p className="text-[9px] font-bold text-white/20 uppercase tracking-widest mt-1">
                <Translate text="Upload evidence to trigger parametric protection" />
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-10">
          {/* Video Upload Section */}
          <div className="space-y-4">
            <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30 italic flex items-center gap-2">
              <Video className="w-3.5 h-3.5 text-primary/60" />
              <Translate text="Video Evidence (Required)" />
            </Label>
            
            <div 
              onClick={() => !video && fileInputRef.current?.click()}
              className={`relative h-52 rounded-[36px] border-2 border-dashed transition-all cursor-pointer flex flex-col items-center justify-center overflow-hidden group ${
                video 
                  ? "border-emerald-500/40 bg-emerald-500/5" 
                  : "border-white/[0.08] hover:border-primary/40 bg-white/[0.015] hover:bg-primary/[0.03]"
              }`}
            >
              <input 
                type="file" 
                accept="video/*" 
                className="hidden" 
                ref={fileInputRef}
                onChange={handleVideoUpload}
              />
              
              {/* Corner accents */}
              <div className="absolute top-3 left-3 w-4 h-4 border-t-2 border-l-2 border-white/[0.06] rounded-tl-lg group-hover:border-primary/30 transition-colors" />
              <div className="absolute top-3 right-3 w-4 h-4 border-t-2 border-r-2 border-white/[0.06] rounded-tr-lg group-hover:border-primary/30 transition-colors" />
              <div className="absolute bottom-3 left-3 w-4 h-4 border-b-2 border-l-2 border-white/[0.06] rounded-bl-lg group-hover:border-primary/30 transition-colors" />
              <div className="absolute bottom-3 right-3 w-4 h-4 border-b-2 border-r-2 border-white/[0.06] rounded-br-lg group-hover:border-primary/30 transition-colors" />
              
              <AnimatePresence mode="wait">
                {video ? (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="flex flex-col items-center gap-4 text-center p-6"
                  >
                    <div className="w-14 h-14 rounded-2xl bg-emerald-500/15 flex items-center justify-center border border-emerald-500/25 shadow-[0_0_20px_rgba(16,185,129,0.1)]">
                      <Video className="w-6 h-6 text-emerald-500" />
                    </div>
                    <div>
                      <p className="text-[11px] font-black text-emerald-500 uppercase tracking-tighter italic truncate max-w-[220px]">
                        {video.name}
                      </p>
                      <p className="text-[9px] font-bold text-white/20 uppercase tracking-widest mt-1.5">
                        {(video.size / (1024 * 1024)).toFixed(2)} MB · <Translate text="Evidence Locked" />
                      </p>
                    </div>
                    <Button 
                      type="button"
                      variant="ghost" 
                      size="sm" 
                      onClick={(e) => {
                        e.stopPropagation();
                        setVideo(null);
                      }}
                      className="text-white/30 hover:text-red-500 transition-colors h-10 w-10 p-0 rounded-full hover:bg-red-500/10"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </motion.div>
                ) : (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center group-hover:scale-105 transition-transform duration-500"
                  >
                    <div className="w-14 h-14 rounded-2xl bg-white/[0.04] flex items-center justify-center border border-white/[0.06] mx-auto mb-5 group-hover:bg-primary/10 group-hover:border-primary/20 transition-all duration-500">
                      <Upload className="w-7 h-7 text-white/15 group-hover:text-primary transition-colors duration-500" />
                    </div>
                    <p className="text-[11px] font-black text-white/25 uppercase tracking-[0.15em] group-hover:text-white/60 transition-colors">
                      <Translate text="Drop Evidence Video" />
                    </p>
                    <p className="text-[8px] font-bold text-white/12 uppercase tracking-widest mt-2 px-8 leading-relaxed">
                      <Translate text="Max 50MB · MP4, MOV, WEBM · Hand-held verification preferred" />
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Claim Type */}
          <div className="space-y-4">
            <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30 italic">
              <Translate text="Protection Type" />
            </Label>
            <div className="flex flex-wrap gap-3">
              {claimTypes.map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setClaimType(type)}
                  className={`px-7 py-3.5 rounded-full text-[9px] font-black uppercase tracking-widest transition-all border ${
                    claimType === type 
                      ? "bg-primary text-white border-primary shadow-[0_8px_24px_-6px_rgba(249,115,22,0.4)] scale-[1.03]" 
                      : "bg-white/[0.03] text-white/30 border-white/[0.06] hover:bg-white/[0.06] hover:text-white/60"
                  }`}
                >
                  <Translate text={type} />
                </button>
              ))}
            </div>
          </div>

          {/* Reason */}
          <div className="space-y-4">
            <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30 italic">
              <Translate text="Verification Context" />
            </Label>
            <Textarea 
              placeholder="Describe the disruption for the AI auditor..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="bg-white/[0.025] border-white/[0.06] rounded-3xl p-6 h-36 focus:border-primary/40 focus:ring-0 text-white placeholder:text-white/[0.08] text-[12px] font-medium tracking-wide resize-none"
            />
          </div>

          <Button 
            disabled={!video || !reason || isSubmitting || isSuccess}
            className={`w-full h-16 rounded-full uppercase font-black text-[11px] tracking-[0.3em] italic transition-all relative overflow-hidden border-none ${
              isSuccess 
                ? "bg-emerald-500 hover:bg-emerald-600 shadow-[0_12px_32px_-8px_rgba(16,185,129,0.4)]" 
                : "bg-primary hover:bg-primary/90 shadow-[0_12px_32px_-8px_rgba(249,115,22,0.3)] hover:shadow-[0_16px_40px_-8px_rgba(249,115,22,0.4)]"
            }`}
          >
            <AnimatePresence mode="wait">
              {isSubmitting ? (
                <motion.div 
                  key="submitting"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center gap-3"
                >
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <Translate text="Auditing Claim..." />
                </motion.div>
              ) : isSuccess ? (
                <motion.div 
                  key="success"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-3"
                >
                  <CheckCircle className="w-5 h-5" />
                  <Translate text="Vault Secured" />
                </motion.div>
              ) : (
                <motion.div 
                  key="submit"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex items-center gap-3"
                >
                  <Shield className="w-5 h-5" />
                  <Translate text="Authenticate & Submit" />
                </motion.div>
              )}
            </AnimatePresence>
          </Button>

          <p className="text-center text-[7px] font-bold text-white/[0.08] uppercase tracking-[0.4em] leading-relaxed">
            <Translate text="By submitting, you agree to AI analysis of your biometric metadata and situational data." />
          </p>
        </form>
      </CardContent>
    </Card>
  );
}
