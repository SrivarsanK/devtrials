"use client";

import React from "react";
import { Translate } from "@/components/ui/translate";
import { ShieldCheck, Calendar, MapPin, BadgeCheck } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface StatusBadgeProps {
  plan?: string;
  zone?: string;
  expiry?: string;
}

export function StatusBadge({ 
  plan = "Guard Plus", 
  zone = "TN-CHE-CENTRAL", 
  expiry = "2024-04-11" 
}: StatusBadgeProps) {
  return (
    <Card className="glass-subtle card-glow border-white/[0.05] overflow-hidden relative group">
      <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 blur-[50px] -z-10 rounded-full group-hover:bg-primary/20 transition-all duration-700" />
      
      <CardContent className="p-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 rounded-[24px] bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center relative shadow-2xl">
               <ShieldCheck className="w-10 h-10 text-white" />
               <div className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 border-4 border-[#0e0e0e] rounded-full animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">
                  <Translate text="Protection Status" />
                </span>
                <div className="h-0.5 w-8 bg-primary/20" />
              </div>
              <h2 className="text-4xl font-manrope font-black text-white tracking-tighter">
                <Translate text="Active" />
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12 flex-1 md:justify-end">
            <div className="space-y-1">
               <div className="flex items-center gap-2 text-white/30 mb-1">
                  <BadgeCheck className="w-3.5 h-3.5" />
                  <span className="text-[10px] uppercase font-bold tracking-widest"><Translate text="Current Plan" /></span>
               </div>
               <p className="text-white font-manrope font-extrabold text-lg tracking-tight uppercase">
                 <Translate text={plan} />
               </p>
            </div>

            <div className="space-y-1 text-right lg:text-left">
               <div className="flex items-center justify-end lg:justify-start gap-2 text-white/30 mb-1">
                  <MapPin className="w-3.5 h-3.5" />
                  <span className="text-[10px] uppercase font-bold tracking-widest"><Translate text="Active Zone" /></span>
               </div>
               <p className="text-white font-manrope font-extrabold text-lg tracking-tight">
                 <Translate text={zone} />
               </p>
            </div>

            <div className="space-y-1 hidden lg:block text-right">
               <div className="flex items-center justify-end gap-2 text-white/30 mb-1">
                  <Calendar className="w-3.5 h-3.5" />
                  <span className="text-[10px] uppercase font-bold tracking-widest"><Translate text="Renewal Date" /></span>
               </div>
               <p className="text-white font-manrope font-extrabold text-lg tracking-tight">
                 {expiry}
               </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
