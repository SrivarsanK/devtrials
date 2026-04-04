"use client";

import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Upload, FileText, CheckCircle, AlertCircle, 
  Video, X, Trash2, Shield, Info
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Translate } from "@/components/ui/translate";
import { Badge } from "@/components/ui/badge";

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
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const newClaim = {
      id: Math.random().toString(36).substr(2, 9),
      type: claimType,
      reason,
      status: "Pending",
      date: new Date().toLocaleDateString(),
      videoName: video.name,
      amountRequested: "₹1,200", // Demo amount
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
    <Card className="bg-[#121212] border-white/5 overflow-hidden shadow-2xl relative">
      <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 blur-[60px] rounded-full -z-10" />
      <CardContent className="p-10">
        <div className="mb-10">
          <h2 className="text-2xl font-black text-white uppercase italic tracking-tighter mb-2">
            <Translate text="Initiate Claim Terminal" />
          </h2>
          <p className="text-white/40 text-[10px] font-bold uppercase tracking-widest leading-loose">
            <Translate text="Upload biometric or situational evidence to trigger parametric protection." />
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Video Upload Section */}
          <div className="space-y-4">
            <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30 italic">
              <Translate text="Video Evidence (Required)" />
            </Label>
            
            <div 
              onClick={() => !video && fileInputRef.current?.click()}
              className={`relative h-56 rounded-[32px] border-2 border-dashed transition-all cursor-pointer flex flex-col items-center justify-center overflow-hidden group ${
                video 
                  ? "border-emerald-500/50 bg-emerald-500/5" 
                  : "border-white/10 hover:border-primary/50 bg-white/[0.02] hover:bg-primary/5"
              }`}
            >
              <input 
                type="file" 
                accept="video/*" 
                className="hidden" 
                ref={fileInputRef}
                onChange={handleVideoUpload}
              />
              
              <AnimatePresence mode="wait">
                {video ? (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="flex flex-col items-center gap-4 text-center p-6"
                  >
                    <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 flex items-center justify-center border border-emerald-500/30">
                      <Video className="w-7 h-7 text-emerald-500" />
                    </div>
                    <div>
                      <p className="text-[11px] font-black text-emerald-500 uppercase tracking-tighter italic truncate max-w-[200px]">
                        {video.name}
                      </p>
                      <p className="text-[9px] font-bold text-white/20 uppercase tracking-widest mt-1">
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
                      className="text-white/40 hover:text-red-500 transition-colors h-10 w-10 p-0 rounded-full hover:bg-red-500/10"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </motion.div>
                ) : (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center group-hover:scale-110 transition-transform duration-500"
                  >
                    <div className="w-16 h-16 rounded-3xl bg-white/5 flex items-center justify-center border border-white/5 mx-auto mb-6">
                      <Upload className="w-8 h-8 text-white/20 group-hover:text-primary transition-colors" />
                    </div>
                    <p className="text-[11px] font-black text-white/30 uppercase tracking-[0.2em] group-hover:text-white transition-colors">
                      <Translate text="Drop Evidence Video" />
                    </p>
                    <p className="text-[8px] font-bold text-white/20 uppercase tracking-widest mt-2 px-10 leading-relaxed">
                      <Translate text="Maximum 50MB. Support MP4, MOV, WEBM. Hand-held verification preferred." />
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Claim Type */}
            <div className="space-y-4">
              <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30 italic">
                <Translate text="Protection Type" />
              </Label>
              <div className="flex flex-wrap gap-2">
                {claimTypes.map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setClaimType(type)}
                    className={`px-6 py-3 rounded-2xl text-[9px] font-black uppercase tracking-widest transition-all border ${
                      claimType === type 
                        ? "bg-primary text-white border-primary shadow-[0_10px_20px_-10px_rgba(249,115,22,0.5)]" 
                        : "bg-white/5 text-white/40 border-white/5 hover:bg-white/10"
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
                placeholder="Explain the incident for the AI auditor..."
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="bg-white/5 border-white/10 rounded-[28px] p-6 h-32 focus:border-primary/50 focus:ring-0 text-white placeholder:text-white/10 text-[11px] font-bold tracking-wide"
              />
            </div>
          </div>

          <Button 
            disabled={!video || !reason || isSubmitting || isSuccess}
            className={`w-full h-16 rounded-[28px] uppercase font-black text-[11px] tracking-[0.4em] italic transition-all relative overflow-hidden ${
              isSuccess ? "bg-emerald-500 hover:bg-emerald-600" : "bg-primary hover:bg-primary/90"
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

          <p className="text-center text-[7px] font-bold text-white/10 uppercase tracking-[0.5em] leading-relaxed">
            <Translate text="By submitting, you agree to AI analysis of your biometric metadata and situational data." />
          </p>
        </form>
      </CardContent>
    </Card>
  );
}
