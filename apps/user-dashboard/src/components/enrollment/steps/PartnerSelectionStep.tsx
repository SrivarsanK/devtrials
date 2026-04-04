"use client";

import React from "react";
import { Translate } from "@/components/ui/translate";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Smartphone, Zap, Truck, Bike, Car, ShoppingBag, Box, Package } from "lucide-react";

const PARTNERS = [
  { id: "swiggy", name: "Swiggy", icon: ShoppingBag, color: "text-[#fc8019]" },
  { id: "zomato", name: "Zomato", icon: Zap, color: "text-[#cb202d]" },
  { id: "uber", name: "Uber / UberEats", icon: Car, color: "text-white" },
  { id: "ola", name: "Ola", icon: Car, color: "text-[#cddc39]" },
  { id: "rapido", name: "Rapido", icon: Bike, color: "text-[#f9c80e]" },
  { id: "zepto", name: "Zepto", icon: Zap, color: "text-[#8e24aa]" },
  { id: "dunzo", name: "Dunzo", icon: Box, color: "text-[#00d290]" },
  { id: "porter", name: "Porter", icon: Truck, color: "text-[#0052cc]" },
];

interface PartnerSelectionStepProps {
  onNext: (partner: string) => void;
  selectedPartner?: string;
}

export function PartnerSelectionStep({ onNext, selectedPartner }: PartnerSelectionStepProps) {
  return (
    <div className="w-full space-y-8">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {PARTNERS.map((partner) => {
          const Icon = partner.icon;
          const isSelected = selectedPartner === partner.id;
          
          return (
            <motion.button
              key={partner.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onNext(partner.id)}
              className={`p-6 rounded-[32px] border flex flex-col items-center gap-4 transition-all duration-300 relative overflow-hidden group ${
                isSelected 
                ? 'bg-primary/10 border-primary shadow-[0_0_30px_rgba(16,185,129,0.1)]' 
                : 'bg-white/5 border-white/5 hover:border-white/20'
              }`}
            >
              <div className={`w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center transition-colors group-hover:bg-white/10 ${partner.color}`}>
                <Icon className="w-6 h-6" />
              </div>
              <span className="text-xs font-black uppercase tracking-widest text-white/70 group-hover:text-white">
                <Translate text={partner.name} />
              </span>
              
              {isSelected && (
                <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-primary shadow-[0_0_10px_rgba(16,185,129,1)]" />
              )}
            </motion.button>
          );
        })}
      </div>
      
      <p className="text-center text-[10px] font-bold text-white/20 uppercase tracking-[0.2em]">
        <Translate text="Don't see your platform? Contact support for manual onboarding." />
      </p>
    </div>
  );
}
