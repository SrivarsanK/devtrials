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
    label: "Processing"
  },
  Accepted: { 
    icon: CheckCircle, 
    color: "text-emerald-500", 
    bg: "bg-emerald-500/10", 
    border: "border-emerald-500/20",
    label: "Settled"
  },
  Rejected: { 
    icon: XCircle, 
    color: "text-red-500", 
    bg: "bg-red-500/10", 
    border: "border-red-500/20",
    label: "Declined"
  },
};

export function ClaimHistory({ claims }: { claims: Claim[] }) {
  const [selectedClaim, setSelectedClaim] = useState<Claim | null>(null);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between px-2 mb-4">
        <h2 className="text-sm font-black text-white/40 uppercase tracking-[0.4em] italic flex items-center gap-3 leading-none pt-0.5">
          <History className="w-4 h-4" />
          <Translate text="History Terminal" />
        </h2>
        <Badge className="bg-white/5 border-white/5 text-white/20 text-[8px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full">
           {claims.length} <Translate text="Records" />
        </Badge>
      </div>

      <div className="space-y-3">
        <AnimatePresence mode="popLayout">
          {claims.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="p-20 bg-white/[0.02] border border-white/5 rounded-[48px] text-center"
            >
              <div className="w-16 h-16 rounded-3xl bg-white/5 flex items-center justify-center border border-white/5 mx-auto mb-6">
                <Shield className="w-8 h-8 text-white/10" />
              </div>
              <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em] leading-relaxed">
                <Translate text="No historical claim records detected in your partition." />
              </p>
            </motion.div>
          ) : (
            claims.map((claim, idx) => {
              const config = statusConfig[claim.status];
              const StatusIcon = config.icon;
              
              return (
                <motion.div
                  key={claim.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  onClick={() => setSelectedClaim(claim)}
                  className="group bg-[#121212] hover:bg-white/[0.04] border border-white/5 hover:border-white/10 rounded-[32px] p-6 flex flex-col md:flex-row md:items-center gap-6 cursor-pointer transition-all duration-500 relative overflow-hidden"
                >
                  {/* Status Indicator Bar */}
                  <div className={`absolute top-0 left-0 bottom-0 w-1 ${config.bg.replace('/10', '/50')}`} />
                  
                  <div className="flex-1 flex flex-col md:flex-row md:items-center gap-6">
                    {/* Visual Type Indicator */}
                    <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                      <FileText className="w-6 h-6 text-white/20 group-hover:text-primary transition-colors" />
                    </div>

                    <div className="flex-1 space-y-1.5">
                      <div className="flex items-center gap-3">
                        <span className="text-[10px] font-black text-white uppercase tracking-tight leading-none italic">
                          <Translate text={claim.type} />
                        </span>
                        <Badge className={`${config.bg} ${config.color} border-0 text-[8px] font-black uppercase tracking-widest px-3 py-1 rounded-lg`}>
                          <StatusIcon className="w-2.5 h-2.5 mr-1.5" />
                          <Translate text={config.label} />
                        </Badge>
                      </div>
                      <p className="text-[11px] font-bold text-white/20 italic truncate max-w-sm">
                        "{claim.reason}"
                      </p>
                    </div>

                    <div className="flex flex-col md:items-end gap-1.5">
                      <p className="text-[10px] font-black text-white/40 uppercase tracking-widest leading-none pt-0.5">
                        {claim.amountRequested}
                      </p>
                      <div className="flex items-center gap-2 text-[8px] font-bold text-white/10 uppercase tracking-widest">
                        <Calendar className="w-3 h-3 opacity-50" />
                        {claim.date}
                      </div>
                    </div>
                  </div>

                  <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center border border-white/5 group-hover:bg-primary group-hover:border-primary transition-all self-end md:self-center">
                    <ChevronRight className="w-5 h-5 text-white/20 group-hover:text-white" />
                  </div>
                </motion.div>
              );
            })
          )}
        </AnimatePresence>
      </div>

      {/* Claim Detail Modal */}
      <Dialog open={!!selectedClaim} onOpenChange={() => setSelectedClaim(null)}>
        <DialogContent className="bg-[#0e0e0e] border-white/10 rounded-[48px] p-0 overflow-hidden max-w-2xl shadow-2xl">
          {selectedClaim && (
            <div className="relative">
              {/* Header Visual */}
              <div className="h-48 bg-gradient-to-br from-primary/20 via-[#0e0e0e] to-transparent relative overflow-hidden flex items-center justify-center">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(249,115,22,0.1),transparent_70%)]" />
                <div className="w-20 h-20 rounded-[32px] bg-[#121212] border border-white/10 flex items-center justify-center shadow-2xl relative z-10 group cursor-pointer hover:scale-105 transition-transform duration-500">
                  <Play className="w-8 h-8 text-primary fill-primary/20 group-hover:fill-primary group-hover:scale-125 transition-all" />
                </div>
                <div className="absolute bottom-6 left-8">
                  <Badge className="bg-primary/20 text-primary border-primary/20 uppercase text-[8px] font-black tracking-widest rounded-lg px-4 py-1.5 backdrop-blur-md">
                     <Translate text="Video Evidence Attached" />
                  </Badge>
                </div>
              </div>

              <div className="p-10 space-y-10">
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <p className="text-[10px] font-black text-primary uppercase tracking-[0.3em] leading-none mb-2">
                      <Translate text="Claim Partition" />: {selectedClaim.id}
                    </p>
                    <h3 className="text-3xl font-black text-white italic tracking-tighter uppercase leading-none">
                      <Translate text={selectedClaim.type} />
                    </h3>
                  </div>
                  <Badge className={`${statusConfig[selectedClaim.status].bg} ${statusConfig[selectedClaim.status].color} border-0 text-[9px] font-black uppercase tracking-widest px-6 py-2.5 rounded-2xl`}>
                    <Translate text={statusConfig[selectedClaim.status].label} />
                  </Badge>
                </div>

                <div className="grid grid-cols-2 gap-8">
                  <div className="p-6 rounded-[32px] bg-white/[0.02] border border-white/5 space-y-2.5">
                    <p className="text-[9px] font-black text-white/30 uppercase tracking-widest leading-none flex items-center gap-2">
                      <Clock className="w-3 h-3" />
                      <Translate text="Submission Date" />
                    </p>
                    <p className="text-[11px] font-bold text-white uppercase italic">{selectedClaim.date}</p>
                  </div>
                  <div className="p-6 rounded-[32px] bg-white/[0.02] border border-white/5 space-y-2.5">
                    <p className="text-[9px] font-black text-white/30 uppercase tracking-widest leading-none flex items-center gap-2">
                      <Shield className="w-3 h-3" />
                      <Translate text="Requested Value" />
                    </p>
                    <p className="text-[11px] font-bold text-emerald-500 uppercase italic leading-none">{selectedClaim.amountRequested}</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="text-[10px] font-black text-white/40 uppercase tracking-[0.4em] italic flex items-center gap-3">
                    <Info className="w-4 h-4 text-primary" />
                    <Translate text="Verification Summary" />
                  </h4>
                  <div className="bg-white/[0.03] border border-white/5 rounded-[32px] p-8 relative overflow-hidden">
                    <p className="text-[14px] font-medium text-white/70 italic leading-relaxed relative z-10">
                      "{selectedClaim.reason}"
                    </p>
                    <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-primary/5 blur-[50px] rounded-full" />
                  </div>
                </div>

                {selectedClaim.adminNote && (
                  <div className="space-y-4">
                     <h4 className="text-[10px] font-black text-white/40 uppercase tracking-[0.4em] italic">
                        <Translate text="Auditor Comments" />
                     </h4>
                     <p className="text-[11px] font-bold text-amber-500 uppercase tracking-wide leading-relaxed bg-amber-500/5 p-6 rounded-[28px] border border-amber-500/10">
                        {selectedClaim.adminNote}
                     </p>
                  </div>
                )}

                <Button 
                   onClick={() => setSelectedClaim(null)}
                   className="w-full h-16 rounded-[28px] bg-white/5 hover:bg-white/10 text-white uppercase font-black text-[10px] tracking-[0.4em] border border-white/10 transition-all border-dashed"
                >
                  <Translate text="Close Terminal" />
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
