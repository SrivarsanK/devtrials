"use client";

import React, { useState } from "react";
import { Translate } from "@/components/ui/translate";
import { useLanguage } from "@/contexts/LanguageContext";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { CreditCard, Loader2, IndianRupee, Smartphone, ShieldAlert } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";

interface UPIStepProps {
  onComplete: (upi: string) => void;
  onBack: () => void;
}

export function UPIStep({ onComplete, onBack }: UPIStepProps) {
  const { t } = useLanguage();
  const [upi, setUpi] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleComplete = () => {
    if (!upi.includes("@")) {
      setError(t("Please enter a valid UPI ID (e.g. worker@bank).", "Please enter a valid UPI ID (e.g. worker@bank)."));
      return;
    }
    if (!agreed) {
      setError(t("You must agree to the auto-deduction to proceed.", "You must agree to the auto-deduction to proceed."));
      return;
    }

    setLoading(true);
    setError("");
    
    // Simulate setup verification
    setTimeout(() => {
      setLoading(false);
      onComplete(upi);
    }, 1500);
  };

  return (
    <Card className="bg-surface-card border-white/5 text-white max-w-xl mx-auto overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-primary-dark" />
      <CardHeader className="text-center pt-8 px-8">
        <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-6">
          <IndianRupee className="w-8 h-8 text-primary" />
        </div>
        <CardTitle className="text-2xl font-manrope font-extrabold uppercase tracking-tight">
          <Translate text="Payout & Payment Setup" />
        </CardTitle>
        <CardDescription className="text-white/50 text-base">
          <Translate text="Link your UPI ID for automatic payouts and weekly premium deductions." />
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-8 px-8 pb-10">
        <div className="space-y-3">
          <label className="text-sm font-bold text-white/40 tracking-wider uppercase ml-1 flex items-center gap-2">
            <Smartphone className="w-4 h-4" /> <Translate text="UPI ID (VPA)" />
          </label>
          <Input 
            value={upi} 
            onChange={(e) => setUpi(e.target.value)}
            placeholder={t("e.g. 9845012345@paytm", "e.g. 9845012345@paytm")} 
            className="bg-[#0e0e0e] border-white/10 h-14 text-lg focus:border-primary transition-all rounded-xl"
            disabled={loading}
          />
        </div>

        <div className="bg-[#0e0e0e] border border-white/5 p-6 rounded-2xl space-y-4">
          <div className="flex items-start gap-4">
             <Checkbox 
              id="agreed" 
              checked={agreed} 
              onCheckedChange={(checked) => setAgreed(checked as boolean)}
              className="mt-1 border-white/20 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
            />
            <div className="space-y-1">
              <label htmlFor="agreed" className="text-sm font-semibold text-white cursor-pointer select-none leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                <Translate text="Enable Auto-Deduction" />
              </label>
              <p className="text-xs text-white/40 leading-relaxed font-medium">
                <Translate text="I authorize GigShield to deduct the weekly premium automatically from my delivery platform earnings or via UPI mandate." />
              </p>
            </div>
          </div>
          
          <div className="pt-2 border-t border-white/5 flex items-center gap-3">
            <ShieldAlert className="w-4 h-4 text-primary shrink-0" />
            <p className="text-[10px] uppercase font-black tracking-widest text-primary/80">
              <Translate text="SECURE RAZORPAY ENCRYPTION ENABLED" />
            </p>
          </div>
        </div>

        {error && <p className="text-red-500 text-xs mt-2 ml-1 font-bold">{error}</p>}
      </CardContent>

      <CardFooter className="bg-[#0e0e0e]/50 border-t border-white/5 py-8 px-10 flex gap-6">
        <Button variant="ghost" onClick={onBack} disabled={loading} className="text-white/40 hover:text-white font-bold h-14 px-8 border-none">
          <Translate text="Back" />
        </Button>
        <Button 
          onClick={handleComplete}
          disabled={loading}
          className="flex-1 h-16 bg-gradient-to-r from-primary to-primary-dark hover:opacity-90 transition-all font-black text-xl rounded-2xl flex items-center justify-center gap-3 shadow-2xl"
        >
          {loading ? (
            <Loader2 className="w-6 h-6 animate-spin" />
          ) : (
            <Translate text="Complete Setup" />
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
