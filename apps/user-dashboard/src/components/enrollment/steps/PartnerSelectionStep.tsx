"use client";

import React from "react";
import { Translate } from "@/components/ui/translate";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Smartphone, Zap, Truck, Bike, Car, ShoppingBag, Box, Package } from "lucide-react";

const PARTNERS = [
  { id: "swiggy", name: "Swiggy", logo: "/logos/swiggy.png", color: "text-[#fc8019]" },
  { id: "zomato", name: "Zomato", logo: "/logos/zomato.png", color: "text-[#cb202d]" },
  { id: "uber", name: "Uber / UberEats", logo: "/logos/uber.svg", color: "text-white" },
  { id: "rapido", name: "Rapido", logo: "/logos/rapido.png", color: "text-[#f9c80e]" },
  { id: "zepto", name: "Zepto", logo: "/logos/zepto.png", color: "text-[#8e24aa]" },
  { id: "porter", name: "Porter", logo: "/logos/porter.png", color: "text-[#0052cc]" },
];

interface PartnerSelectionStepProps {
  onNext: (partner: string) => void;
  selectedPartner?: string;
}

export function PartnerSelectionStep({ onNext, selectedPartner }: PartnerSelectionStepProps) {
  return (
    <div className="w-full max-w-3xl mx-auto space-y-8">
      <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
        {PARTNERS.map((partner) => {
          const isSelected = selectedPartner === partner.id;
          
          return (
            <motion.button
              key={partner.id}
              whileHover={{ scale: 1.02, translateY: -4 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onNext(partner.id)}
              className={`p-8 rounded-[40px] border flex flex-col items-center justify-center gap-5 transition-all duration-500 relative overflow-hidden group aspect-[4/3] ${
                isSelected 
                ? 'glass-strong card-glow border-primary' 
                : 'glass-subtle border-white/5 hover:border-white/20'
              }`}
            >
              <div className={`w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center transition-all duration-500 group-hover:bg-white/10 p-3 overflow-hidden ${isSelected ? 'scale-110' : ''}`}>
                <img src={partner.logo} alt={partner.name} className="w-full h-full object-contain" />
              </div>
              <span className="text-xs font-black uppercase tracking-widest text-white/70 group-hover:text-white">
                <Translate text={partner.name} />
              </span>
              
              {isSelected && (
                <div className="absolute top-6 right-6 w-1.5 h-1.5 rounded-full bg-primary shadow-[0_0_10px_rgba(255,70,37,0.8)]" />
              )}
            </motion.button>
          );
        })}
      </div>
      
      <p className="text-center text-[10px] font-bold text-muted-foreground/60 uppercase tracking-[0.2em]">
        <Translate text="Don't see your platform? Contact support for manual onboarding." />
      </p>
    </div>
  );
}
