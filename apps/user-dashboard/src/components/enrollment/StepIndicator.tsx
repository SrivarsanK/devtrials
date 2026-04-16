"use client";

import React from "react";
import { Translate } from "@/components/ui/translate";
import { motion } from "framer-motion";

interface StepIndicatorProps {
  currentStep: number;
}

const steps = [
  { id: 1, name: "Partner" },
  { id: 2, name: "ID" },
  { id: 3, name: "Mobile" },
  { id: 4, name: "Zones" },
  { id: 5, name: "Aadhaar" },
  { id: 6, name: "PAN" },
  { id: 7, name: "Selfie" },
  { id: 8, name: "Policy" },
  { id: 9, name: "UPI" },
];

export function StepIndicator({ currentStep }: StepIndicatorProps) {
  return (
    <div className="w-full max-w-4xl mx-auto mb-16 px-4">
      <div className="flex items-center justify-between relative">
        {/* Connection Line Background */}
        <div className="absolute top-5 left-0 w-full h-0.5 bg-white/5 -translate-y-1/2" />
        
        {/* Active Progress Line */}
        <motion.div 
          className="absolute top-5 left-0 h-0.5 bg-primary -translate-y-1/2 origin-left shadow-[0_0_10px_rgba(255,70,37,0.5)]"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: (currentStep - 1) / (steps.length - 1) }}
          transition={{ duration: 0.8, ease: "circOut" }}
          style={{ width: '100%' }}
        />

        {steps.map((step) => {
          const isCompleted = currentStep > step.id;
          const isActive = currentStep === step.id;
          const isUpcoming = currentStep < step.id;

          return (
            <div key={step.id} className="flex flex-col items-center gap-4 relative z-10">
              <div 
                className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-500 relative ${
                  isCompleted 
                    ? "bg-primary border-primary text-white shadow-[0_0_15px_rgba(255,70,37,0.6)]" 
                    : isActive 
                    ? "bg-[#0a0a0a] border-primary text-primary shadow-[0_0_10px_rgba(255,70,37,0.3)]" 
                    : "bg-[#0a0a0a] border-white/10 text-white/20"
                }`}
              >
                <span className="text-xs font-black">{step.id}</span>
              </div>
              <span className={`text-[9px] font-black tracking-[0.2em] uppercase transition-all duration-500 whitespace-nowrap ${
                isActive ? "text-primary translate-y-0 opacity-100" : isCompleted ? "text-white/60 opacity-80" : "text-white/10 opacity-40"
              } ${!isActive && 'hidden lg:block'}`}>
                <Translate text={step.name} />
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
