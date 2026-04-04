"use client";

import React from "react";
import { Translate } from "@/components/ui/translate";
import { Check } from "lucide-react";

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
    <div className="w-full max-w-2xl mx-auto mb-12">
      <div className="flex items-center justify-between relative">
        {/* Connection Line */}
        <div className="absolute top-1/2 left-0 w-full h-0.5 bg-white/5 -translate-y-1/2 -z-10" />
        <div 
          className="absolute top-1/2 left-0 h-0.5 bg-primary -translate-y-1/2 -z-10 transition-all duration-500" 
          style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
        />

        {steps.map((step) => {
          const isCompleted = currentStep > step.id;
          const isActive = currentStep === step.id;

          return (
            <div key={step.id} className="flex flex-col items-center gap-3">
              <div 
                className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                  isCompleted 
                    ? "bg-primary border-primary text-white" 
                    : isActive 
                    ? "bg-[#0e0e0e] border-primary text-primary" 
                    : "bg-[#0e0e0e] border-white/10 text-white/40"
                }`}
              >
                {isCompleted ? <Check className="w-5 h-5" /> : <span className="font-bold">{step.id}</span>}
              </div>
              <span className={`text-[10px] font-black tracking-widest uppercase transition-colors ${
                isActive ? "text-primary" : isCompleted ? "text-white/80" : "text-white/10"
              } ${!isActive && 'hidden md:block'}`}>
                <Translate text={step.name} />
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
