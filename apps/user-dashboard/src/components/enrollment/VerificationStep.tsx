"use client";

import React, { useState } from "react";
import { Translate } from "@/components/ui/translate";
import { useLanguage } from "@/contexts/LanguageContext";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ShieldCheck, Loader2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface VerificationStepProps {
  onNext: (id: string) => void;
}

export function VerificationStep({ onNext }: VerificationStepProps) {
  const { t } = useLanguage();
  const [partnerId, setPartnerId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleVerify = () => {
    if (partnerId.length < 5) {
      setError(t("Please enter a valid Partner ID (minimum 5 characters)."));
      return;
    }

    setLoading(true);
    setError("");
    
    // Simulate API verification
    setTimeout(() => {
      setLoading(false);
      onNext(partnerId);
    }, 1200);
  };

  return (
    <Card className="bg-surface-card border-white/5 text-white max-w-lg mx-auto overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-primary-dark" />
      <CardHeader className="text-center pt-8">
        <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-6">
          <ShieldCheck className="w-8 h-8 text-primary" />
        </div>
        <CardTitle className="text-2xl font-manrope font-extrabold uppercase tracking-tight">
          <Translate text="Worker Verification" />
        </CardTitle>
        <CardDescription className="text-white/50 text-base">
          <Translate text="Enter your platform-assigned Partner ID to link your RideSuraksha account." />
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6 pb-12 px-8">
        <div className="space-y-2">
          <label className="text-sm font-bold text-white/40 tracking-wider uppercase ml-1">
            <Translate text="Partner ID (Swiggy / Zomato / Zepto)" />
          </label>
          <Input 
            value={partnerId} 
            onChange={(e) => setPartnerId(e.target.value)}
            placeholder={t("e.g. SZ-98231")} 
            className="bg-[#0e0e0e] border-white/10 h-14 text-lg focus:border-primary transition-all rounded-xl"
            disabled={loading}
          />
          {error && <p className="text-red-500 text-xs mt-2 ml-1">{error}</p>}
        </div>

        <Button 
          onClick={handleVerify}
          disabled={loading}
          className="w-full h-14 bg-gradient-to-r from-primary to-primary-dark hover:opacity-90 transition-all font-bold text-lg rounded-xl flex items-center justify-center gap-2"
        >
          {loading ? (
            <Loader2 className="w-6 h-6 animate-spin" />
          ) : (
            <Translate text="Verify ID" />
          )}
        </Button>

        <p className="text-center text-xs text-white/30 italic">
          <Translate text="Your data is encrypted and handled according to privacy standards." />
        </p>
      </CardContent>
    </Card>
  );
}
