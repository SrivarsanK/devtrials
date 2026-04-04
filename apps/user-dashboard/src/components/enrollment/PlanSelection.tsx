"use client";

import React, { useState } from "react";
import { Translate } from "@/components/ui/translate";
import { Button } from "@/components/ui/button";
import { ShieldCheck, ArrowRight, Zap, Target, Star } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface PlanSelectionProps {
  onSelect: (plan: string) => void;
  onBack: () => void;
}

const plans = [
  {
    id: "lite",
    name: "Guard Lite",
    price: "₹79",
    features: ["50% coverage", "24hr payout", "Rain & Flood only"],
    icon: Target,
  },
  {
    id: "plus",
    name: "Guard Plus",
    price: "₹119",
    features: ["70% coverage", "12hr payout", "All weather & curfews"],
    popular: true,
    icon: Zap,
  },
  {
    id: "max",
    name: "Guard Max",
    price: "₹159",
    features: ["80% coverage", "2hr expedited payout", "All disruptions + VIP support"],
    icon: Star,
  }
];

export function PlanSelection({ onSelect, onBack }: PlanSelectionProps) {
  const [selectedPlan, setSelectedPlan] = useState<string>("plus");

  return (
    <div className="w-full max-w-5xl mx-auto flex flex-col gap-8 pb-12 px-6">
      <div className="text-center mb-4">
         <h2 className="text-3xl font-manrope font-extrabold text-white mb-3">
          <Translate text="Protect your income" />
        </h2>
        <p className="text-white/50 mb-0 font-medium tracking-tight">
          <Translate text="Choose a plan that fits your income and risk level." />
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6 items-center">
        {plans.map((plan) => {
          const isSelected = selectedPlan === plan.id;
          const PlanIcon = plan.icon;

          return (
            <Card 
              key={plan.id}
              onClick={() => setSelectedPlan(plan.id)}
              className={`relative bg-surface-card transition-all cursor-pointer border-2 rounded-2xl overflow-hidden hover:scale-[1.02] transform transition-all active:scale-95 duration-300 ${
                isSelected 
                  ? "border-primary shadow-[0_0_30px_-5px_rgba(249,115,22,0.4)]" 
                  : "border-white/5 hover:border-white/20"
              }`}
            >
              {plan.popular && (
                <div className="absolute top-0 right-0 bg-primary px-4 py-1.5 rounded-bl-xl text-[10px] font-black uppercase tracking-widest text-white z-10">
                  <Translate text="Most Popular" />
                </div>
              )}
              
              <CardHeader className="pt-10 pb-6 text-center">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4 transition-colors ${
                  isSelected ? "bg-primary/20 text-primary" : "bg-white/5 text-white/40"
                }`}>
                  <PlanIcon className="w-6 h-6" />
                </div>
                <CardTitle className={`text-xl font-manrope font-bold ${isSelected ? "text-primary" : "text-white"}`}>
                  <Translate text={plan.name} />
                </CardTitle>
                <div className="mt-4 flex items-baseline justify-center text-4xl font-black text-white">
                  {plan.price}
                  <span className="ml-1 text-sm font-medium text-white/30 tracking-tight">/wk</span>
                </div>
              </CardHeader>

              <CardContent className="space-y-4 pb-8 min-h-[160px] flex flex-col justify-center">
                {plan.features.map((feature, i) => (
                  <div key={i} className={`flex items-center text-sm font-medium ${isSelected ? "text-white/90" : "text-white/50"}`}>
                    <ShieldCheck className={`w-4 h-4 mr-3 shrink-0 ${isSelected ? "text-primary" : "text-white/20"}`} />
                    <Translate text={feature} />
                  </div>
                ))}
              </CardContent>

              <CardFooter className="pb-8">
                <div className={`w-full h-1 my-4 rounded-full transition-all duration-300 ${isSelected ? "bg-primary" : "bg-white/5"}`} />
              </CardFooter>
            </Card>
          );
        })}
      </div>

      <div className="flex items-center justify-between mt-12 bg-surface-card border border-white/5 p-4 rounded-2xl">
        <Button variant="ghost" onClick={onBack} className="text-white/50 hover:text-white font-bold h-12 px-6">
          <Translate text="Back" />
        </Button>
        <Button 
          onClick={() => onSelect(selectedPlan)}
          className="h-14 px-10 bg-gradient-to-r from-primary to-primary-dark text-white font-bold text-lg rounded-xl flex items-center gap-3 shadow-xl"
        >
          <Translate text="Confirm Selection" /> <ArrowRight className="w-5 h-5 pointer-events-none" />
        </Button>
      </div>
    </div>
  );
}
