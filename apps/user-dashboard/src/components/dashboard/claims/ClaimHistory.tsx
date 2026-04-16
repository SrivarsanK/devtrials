"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  History, Clock, AlertCircle, CheckCircle, 
  XCircle, ChevronRight, Video, FileText, 
  MapPin, Shield, Calendar, Info, Play
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Translate } from "@/components/ui/translate";
import { 
  Dialog, DialogContent, DialogDescription, 
  DialogHeader, DialogTitle, DialogTrigger 
} from "@/components/ui/dialog";

interface Claim {
  id: string;
  type: string;
  reason: string;
  status: "Pending" | "Accepted" | "Rejected";
  date: string;
  videoName: string;
  amountRequested: string;
  payoutDate?: string;
  adminNote?: string;
}

const statusConfig = {
  Pending: { 
    icon: Clock, 
    color: "text-amber-500", 
    bg: "bg-amber-500/10", 
    border: "border-amber-500/20",
    glow: "shadow-[0_0_16px_rgba(245,158,11,0.08)]",
    label: "Processing"
  },
  Accepted: { 
    icon: CheckCircle, 
    color: "text-emerald-500", 
    bg: "bg-emerald-500/10", 
    border: "border-emerald-500/20",
    glow: "shadow-[0_0_16px_rgba(16,185,129,0.08)]",
    label: "Settled"
  },
  Rejected: { 
    icon: XCircle, 
    color: "text-red-500", 
    bg: "bg-red-500/10", 
    border: "border-red-500/20",
    glow: "shadow-[0_0_16px_rgba(239,68,68,0.08)]",
    label: "Declined"
  },
};

export function ClaimHistory({ claims }: { claims: Claim[] }) {
  const [selectedClaim, setSelectedClaim] = useState<Claim | null>(null);

  return (
    <div className="space-y-8">
      {/* Section Header */}
      <div className="flex items-center justify-between px-2">
        <h2 className="text-sm font-black text-white/30 uppercase tracking-[0.3em] italic flex items-center gap-3 leading-none">
          <div className="w-8 h-8 rounded-xl bg-white/5 flex items-center justify-center border border-white/[0.06]">
            <History className="w-4 h-4 text-primary/70" />
          </div>
          <Translate text="Claim History" />
        </h2>
        <Badge className="bg-white/[0.04] border-white/[0.06] text-white/20 text-[8px] font-black uppercase tracking-widest px-5 py-2 rounded-full">
           {claims.length} <Translate text="Records" />
        </Badge>
      </div>

      {/* Claims List */}
      <div className="space-y-4">
        <AnimatePresence mode="popLayout">
          {claims.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="p-20 glass-strong border border-white/[0.04] rounded-[48px] text-center"
            >
              <div className="w-20 h-20 rounded-[28px] bg-white/[0.03] flex items-center justify-center border border-white/[0.05] mx-auto mb-8">
                <Shield className="w-10 h-10 text-white/[0.06]" />
              </div>
              <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em] leading-relaxed max-w-xs mx-auto">
                <Translate text="No historical claim records detected. File your first claim to get started." />
              </p>
            </motion.div>
          ) : (
            claims.map((claim, idx) => {
              const config = statusConfig[claim.status];
              const StatusIcon = config.icon;
              
              return (
                <motion.div
                  key={claim.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.06, ease: [0.22, 1, 0.36, 1] }}
                  onClick={() => setSelectedClaim(claim)}
                  className={`group glass-strong border border-white/[0.05] hover:border-white/[0.1] rounded-[36px] p-7 md:p-8 flex flex-col md:flex-row md:items-center gap-5 cursor-pointer transition-all duration-500 relative overflow-hidden ${config.glow}`}
                >
                  {/* Status accent line */}
                  <div className={`absolute top-0 left-0 bottom-0 w-[3px] rounded-full ${config.bg.replace('/10', '/60')}`} />
                  
                  <div className="flex-1 flex flex-col md:flex-row md:items-center gap-5 pl-3">
                    {/* Type Icon */}
                    <div className={`w-14 h-14 rounded-2xl ${config.bg} flex items-center justify-center border ${config.border} group-hover:scale-110 transition-transform duration-500 shrink-0`}>
                      <FileText className={`w-6 h-6 ${config.color}`} />
                    </div>

                    {/* Claim Info */}
                    <div className="flex-1 space-y-2.5 min-w-0">
                      <div className="flex items-center gap-3 flex-wrap">
                        <span className="text-sm font-black text-white uppercase tracking-tight leading-none italic">
                          <Translate text={claim.type} />
                        </span>
                        <Badge className={`${config.bg} ${config.color} border ${config.border} text-[8px] font-black uppercase tracking-widest px-3.5 py-1.5 rounded-xl`}>
                          <StatusIcon className="w-2.5 h-2.5 mr-1.5" />
                          <Translate text={config.label} />
                        </Badge>
                      </div>
                      <p className="text-[11px] font-medium text-white/20 italic truncate max-w-lg">
                        "{claim.reason}"
                      </p>
                    </div>

                    {/* Amount + Date */}
                    <div className="flex flex-row md:flex-col items-end gap-2 md:gap-2.5 shrink-0">
                      <p className="text-base font-black text-white/50 uppercase tracking-tight leading-none tabular-nums">
                        {claim.amountRequested}
                      </p>
                      <div className="flex items-center gap-2 text-[8px] font-bold text-white/[0.12] uppercase tracking-widest">
                        <Calendar className="w-3 h-3 opacity-50" />
                        {claim.date}
                      </div>
                    </div>
                  </div>

                  {/* Chevron */}
                  <div className="w-12 h-12 rounded-2xl bg-white/[0.03] flex items-center justify-center border border-white/[0.05] group-hover:bg-primary group-hover:border-primary transition-all duration-300 self-end md:self-center shrink-0">
                    <ChevronRight className="w-5 h-5 text-white/15 group-hover:text-white transition-colors" />
                  </div>
                </motion.div>
              );
            })
          )}
        </AnimatePresence>
      </div>

      {/* Claim Detail Modal */}
      <Dialog open={!!selectedClaim} onOpenChange={() => setSelectedClaim(null)}>
        <DialogContent className="bg-[#0a0a0e] border-white/[0.08] rounded-[48px] p-0 overflow-hidden max-w-2xl shadow-[0_0_100px_rgba(0,0,0,0.8)]">
          {selectedClaim && (
            <div className="relative">
              {/* Header Visual */}
              <div className="h-44 bg-gradient-to-br from-primary/15 via-transparent to-transparent relative overflow-hidden flex items-center justify-center">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(249,115,22,0.08),transparent_70%)]" />
                <div className="w-20 h-20 rounded-[28px] bg-[#121218] border border-white/[0.08] flex items-center justify-center shadow-2xl relative z-10 group cursor-pointer hover:scale-110 transition-transform duration-500">
                  <Play className="w-8 h-8 text-primary fill-primary/20 group-hover:fill-primary/50 transition-all" />
                </div>
                <div className="absolute bottom-5 left-8">
                  <Badge className="bg-primary/15 text-primary border-primary/15 uppercase text-[8px] font-black tracking-widest rounded-xl px-4 py-2 backdrop-blur-md">
                     <Video className="w-3 h-3 mr-2" />
                     <Translate text="Evidence Attached" />
                  </Badge>
                </div>
              </div>

              <div className="p-10 space-y-10">
                {/* Title + Status */}
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-2">
                    <p className="text-[10px] font-black text-primary uppercase tracking-[0.3em] leading-none mb-3">
                      <Translate text="Claim" /> #{selectedClaim.id}
                    </p>
                    <h3 className="text-3xl font-black text-white italic tracking-tighter uppercase leading-none">
                      <Translate text={selectedClaim.type} />
                    </h3>
                  </div>
                  <Badge className={`${statusConfig[selectedClaim.status].bg} ${statusConfig[selectedClaim.status].color} border ${statusConfig[selectedClaim.status].border} text-[9px] font-black uppercase tracking-widest px-5 py-2.5 rounded-2xl shrink-0`}>
                    <Translate text={statusConfig[selectedClaim.status].label} />
                  </Badge>
                </div>

                {/* Meta Grid */}
                <div className="grid grid-cols-2 gap-5">
                  <div className="p-6 rounded-[28px] bg-white/[0.02] border border-white/[0.04] space-y-3">
                    <p className="text-[9px] font-black text-white/20 uppercase tracking-widest leading-none flex items-center gap-2">
                      <Clock className="w-3 h-3" />
                      <Translate text="Submitted" />
                    </p>
                    <p className="text-sm font-bold text-white uppercase italic tabular-nums">{selectedClaim.date}</p>
                  </div>
                  <div className="p-6 rounded-[28px] bg-white/[0.02] border border-white/[0.04] space-y-3">
                    <p className="text-[9px] font-black text-white/20 uppercase tracking-widest leading-none flex items-center gap-2">
                      <Shield className="w-3 h-3" />
                      <Translate text="Requested" />
                    </p>
                    <p className="text-sm font-bold text-emerald-500 uppercase italic leading-none tabular-nums">{selectedClaim.amountRequested}</p>
                  </div>
                </div>

                {/* Reason */}
                <div className="space-y-4">
                  <h4 className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em] italic flex items-center gap-3">
                    <Info className="w-3.5 h-3.5 text-primary/60" />
                    <Translate text="Verification Summary" />
                  </h4>
                  <div className="bg-white/[0.02] border border-white/[0.04] rounded-[28px] p-8 relative overflow-hidden">
                    <p className="text-[13px] font-medium text-white/50 italic leading-relaxed relative z-10">
                      "{selectedClaim.reason}"
                    </p>
                    <div className="absolute -bottom-8 -right-8 w-28 h-28 bg-primary/[0.03] blur-[40px] rounded-full" />
                  </div>
                </div>

                {/* Admin Note */}
                {selectedClaim.adminNote && (
                  <div className="space-y-4">
                     <h4 className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em] italic">
                        <Translate text="Auditor Comments" />
                     </h4>
                     <div className="text-[11px] font-bold text-amber-500/80 uppercase tracking-wide leading-relaxed bg-amber-500/[0.04] p-7 rounded-[28px] border border-amber-500/[0.08]">
                        {selectedClaim.adminNote}
                     </div>
                  </div>
                )}

                {/* Close */}
                <Button 
                   onClick={() => setSelectedClaim(null)}
                   className="w-full h-14 rounded-full bg-white/[0.04] hover:bg-white/[0.08] text-white/40 hover:text-white uppercase font-black text-[10px] tracking-[0.3em] border border-white/[0.06] transition-all"
                >
                  <Translate text="Close" />
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
