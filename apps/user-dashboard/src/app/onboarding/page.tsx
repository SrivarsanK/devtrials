"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Shield, ArrowRight, ShieldCheck, BadgeCheck } from "lucide-react";
import { Translate } from "@/components/ui/translate";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { StepIndicator } from "@/components/enrollment/StepIndicator";
import { motion, AnimatePresence } from "framer-motion";

// STEP COMPONENTS
import { PartnerSelectionStep } from "@/components/enrollment/steps/PartnerSelectionStep";
import { PartnerIdStep } from "@/components/enrollment/steps/PartnerIdStep";
import { IdentityStep } from "@/components/enrollment/steps/IdentityStep";
import { ZoneSelectionStep } from "@/components/enrollment/steps/ZoneSelectionStep";
import { AadharStep } from "@/components/enrollment/steps/AadharStep";
import { DocumentUploadStep } from "@/components/enrollment/steps/DocumentUploadStep";
import { CaptureStep } from "@/components/enrollment/steps/CaptureStep";
import { RideSurakshaStep } from "@/components/enrollment/steps/RideSurakshaStep";
import { UpiAutopayStep } from "@/components/enrollment/steps/UpiAutopayStep";
import { completeOnboarding } from "./actions";

const PARTNER_LOGOS: Record<string, string> = {
  swiggy: "/logos/swiggy.png",
  zomato: "/logos/zomato.png",
  uber: "/logos/uber.svg",
  rapido: "/logos/rapido.png",
  zepto: "/logos/zepto.png",
  porter: "/logos/porter.png",
};

export default function EnrollmentWizard() {
  const [step, setStep] = useState(1);
  const [scrolled, setScrolled] = useState(false);
  const { language, setLanguage } = useLanguage();

  const [formData, setFormData] = useState({
    partner: "",
    partnerId: "",
    mobile: "",
    permissions: { location: true, notification: true },
    zones: [] as string[],
    aadhar: "",
    pancard: null as any,
    selfie: null as any,
    policy: null as any,
    upiId: "",
  });

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const nextStep = () => {
    setStep(prev => prev + 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const prevStep = () => {
    setStep(prev => Math.max(1, prev - 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-background text-foreground font-sans relative overflow-x-hidden selection:bg-primary/30">
      
      {/* Ambient background glow */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-secondary/10 rounded-full blur-[120px] animate-glow-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[100px] animate-glow-pulse" style={{ animationDelay: '1.5s' }} />
      </div>

      {/* NAVBAR */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? "glass-subtle border-b border-white/5 py-4" : "bg-transparent py-7"}`}>
        <div className="container mx-auto px-6 max-w-7xl flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group transition-transform active:scale-95">
            <div className="size-10 rounded-xl bg-primary flex items-center justify-center shadow-[0_0_15px_rgba(255,70,37,0.3)] rotate-6 group-hover:rotate-0 transition-transform duration-500">
              <ShieldCheck className="size-6 text-white" strokeWidth={2.5} />
            </div>
            <div className="flex flex-col gap-0 leading-tight">
              <span className="text-2xl font-display font-black tracking-tight text-foreground whitespace-nowrap uppercase">Ride<span className="text-primary italic">Suraksha</span></span>
              <span className="text-[8px] font-bold tracking-[0.2em] text-muted-foreground uppercase opacity-60 whitespace-nowrap hidden sm:block">Parametric Oracle</span>
            </div>
          </Link>

          <div className="flex items-center gap-6">
            <div className="flex bg-white/5 rounded-full p-0.5 border border-white/10">
              <button 
                onClick={() => setLanguage("en")}
                className={`text-[10px] uppercase tracking-widest px-3 py-1.5 rounded-full transition-all duration-300 ${language === 'en' ? 'bg-primary text-white font-black' : 'text-white/40 hover:text-white'}`}
              >
                EN
              </button>
              <button 
                onClick={() => setLanguage("ta")}
                className={`text-[10px] uppercase tracking-widest px-3 py-1.5 rounded-full transition-all duration-300 ${language === 'ta' ? 'bg-primary text-white font-black' : 'text-white/40 hover:text-white'}`}
              >
                தமிழ்
              </button>
            </div>
            
            <Link href="/">
              <Button variant="ghost" size="sm" className="hidden sm:flex text-white/50 hover:text-white text-xs font-bold tracking-widest uppercase border-none hover:bg-white/5">
                <Translate text="Exit Flow" />
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* CONTENT AREA */}
      <main className="container mx-auto px-6 pt-32 pb-24 relative max-w-7xl min-h-[calc(100vh-100px)] flex flex-col items-center">
        
        {step < 10 && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full text-center mb-12"
          >
             <h4 className="text-secondary font-black text-[10px] tracking-[0.3em] uppercase mb-4 opacity-80 decoration-secondary decoration-offset-4 decoration-2">
               <Translate text="Worker Enrollment" />
             </h4>
             <h1 className="text-4xl md:text-5xl font-display font-black text-white tracking-tighter mb-8 leading-tight uppercase">
               <Translate text="Get Protected" /> <br className="sm:hidden" />
               <span className="text-white/20 italic font-medium px-2">—</span>
               <span className="text-primary italic"><Translate text="Step" /> {step}</span>
             </h1>
             <StepIndicator currentStep={step} />
          </motion.div>
        )}

        <div className="w-full relative">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="w-full">
                <PartnerSelectionStep 
                  selectedPartner={formData.partner} 
                  onNext={(p) => { setFormData({...formData, partner: p}); nextStep(); }} 
                />
              </motion.div>
            )}

            {step === 2 && (
              <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="w-full">
                <PartnerIdStep 
                  partnerName={formData.partner} 
                  onNext={(id) => { setFormData({...formData, partnerId: id}); nextStep(); }} 
                  onBack={prevStep} 
                />
              </motion.div>
            )}

            {step === 3 && (
              <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="w-full">
                <IdentityStep 
                  initialMobile={formData.mobile}
                  onNext={(data) => { setFormData({...formData, mobile: data.mobile, permissions: {location: data.location, notification: data.notification}}); nextStep(); }} 
                  onBack={prevStep} 
                />
              </motion.div>
            )}

            {step === 4 && (
              <motion.div key="step4" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="w-full">
                <ZoneSelectionStep 
                  initialSelected={formData.zones}
                  onNext={(z) => { setFormData({...formData, zones: z}); nextStep(); }} 
                  onBack={prevStep} 
                />
              </motion.div>
            )}

            {step === 5 && (
              <motion.div key="step5" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="w-full">
                <AadharStep 
                  initialAadhar={formData.aadhar}
                  onNext={(a) => { setFormData({...formData, aadhar: a}); nextStep(); }} 
                  onBack={prevStep} 
                />
              </motion.div>
            )}

            {step === 6 && (
              <motion.div key="step6" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="w-full">
                <DocumentUploadStep 
                  title="Pancard Upload"
                  description="Verify your PAN details"
                  label="Pancard Front View"
                  onNext={(f) => { setFormData({...formData, pancard: f}); nextStep(); }} 
                  onBack={prevStep} 
                />
              </motion.div>
            )}

            {step === 7 && (
              <motion.div key="step7" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="w-full">
                <CaptureStep 
                  onComplete={(img) => { setFormData({...formData, selfie: img}); nextStep(); }} 
                  onBack={prevStep} 
                />
              </motion.div>
            )}

            {step === 8 && (
              <motion.div key="step8" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="w-full">
                <RideSurakshaStep 
                  selectedZones={formData.zones}
                  onNext={(policy) => { setFormData({...formData, policy}); nextStep(); }} 
                  onBack={prevStep} 
                />
              </motion.div>
            )}

            {step === 9 && (
               <motion.div key="step9" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="w-full">
                 <UpiAutopayStep 
                   initialUpi={formData.upiId}
                   onNext={(upi) => { setFormData({...formData, upiId: upi}); nextStep(); }} 
                   onBack={prevStep} 
                 />
               </motion.div>
            )}

             {step === 10 && (
               <motion.div 
                 key="step10" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                 className="w-full max-w-2xl mx-auto flex flex-col items-center text-center py-20 glass-strong card-glow rounded-[40px] relative overflow-hidden"
               >
                  <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-secondary via-primary to-secondary" />
                  
                  <div className="w-32 h-32 rounded-full bg-primary/10 border-4 border-primary/20 flex items-center justify-center mb-10 shadow-inner group overflow-hidden">
                     <motion.div initial={{ scale: 0, rotate: -45 }} animate={{ scale: 1, rotate: 0 }} transition={{ delay: 0.3, type: "spring" }}>
                       <BadgeCheck className="w-20 h-20 text-primary drop-shadow-[0_0_15px_rgba(255,70,37,0.6)]" />
                     </motion.div>
                  </div>

                  <h2 className="text-4xl md:text-5xl font-display uppercase font-black text-white mb-6 tracking-tight">
                     <span className="gradient-text"><Translate text="Welcome to RideSuraksha" /></span>
                  </h2>
                  <p className="text-lg text-muted-foreground max-w-md mx-auto mb-10 leading-relaxed font-medium">
                     <Translate text="Your identity is verified and income is now protected. Coverage starts in 3 days." />
                  </p>
                  
                  <div className="glass-subtle border border-white/5 rounded-[24px] p-8 w-full max-w-md mb-12 text-left space-y-4">
                     <div className="flex items-center justify-between border-b border-white/5 pb-4">
                        <span className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]"><Translate text="Active Plan" /></span>
                        <span className="text-secondary font-black uppercase tracking-tight text-lg">RideSuraksha</span>
                     </div>
                     <div className="flex items-center justify-between">
                        <span className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em]"><Translate text="Partner" /></span>
                        <div className="flex items-center gap-2">
                           <div className="w-5 h-5 rounded-md bg-white/5 flex items-center justify-center p-1 overflow-hidden">
                              <img src={PARTNER_LOGOS[formData.partner]} alt={formData.partner} className="w-full h-full object-contain" />
                           </div>
                           <span className="text-white font-bold leading-none capitalize">{formData.partner}</span>
                        </div>
                     </div>
                     <div className="flex items-center justify-between">
                        <span className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em]"><Translate text="Coverage" /></span>
                        <span className="text-white font-bold leading-none">{formData.policy?.zonesCovered} <Translate text="Zones" /> · {formData.policy?.days} <Translate text="Days" /></span>
                     </div>
                     <div className="flex items-center justify-between pb-4 border-b border-white/5">
                        <span className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em]"><Translate text="Premium Paid" /></span>
                        <span className="text-primary font-black leading-none">₹{formData.policy?.premium}</span>
                     </div>
                     <div className="flex items-center justify-between">
                        <span className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em]"><Translate text="Payout UPI" /></span>
                        <span className="text-white font-bold leading-none lowercase italic text-xs">{formData.upiId}</span>
                     </div>
                  </div>

                  <div className="w-full px-12">
                      <Button 
                        onClick={async () => {
                           await completeOnboarding();
                           localStorage.setItem('RideSuraksha_upi', formData.upiId);
                           window.location.href = '/dashboard';
                        }}
                        className="w-full h-16 bg-primary hover:bg-primary/90 text-white transition-all font-black uppercase tracking-widest text-sm rounded-full flex items-center justify-center gap-3 shadow-[0_10px_20px_rgba(255,70,37,0.2)] hover:shadow-[0_15px_30px_rgba(255,70,37,0.3)] border-none hover:-translate-y-1"
                     >
                        <Translate text="Go to Dashboard" /> <ArrowRight className="w-5 h-5" />
                     </Button>
                  </div>

                  <p className="mt-8 text-[10px] font-black text-white/20 uppercase tracking-[0.3em] animate-pulse">
                     <Translate text="Your coverage is legally backed by parametric smart contracts" />
                  </p>
               </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      {/* FOOTER */}
      <footer className="py-12 bg-transparent text-center border-t border-white/5">
         <p className="text-white/10 text-[10px] font-black tracking-[0.2em] uppercase">
            ShieldLife Secure Systems · Guidewire DEVTrails 2024
         </p>
      </footer>

    </div>
  );
}
