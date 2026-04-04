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
    <div className="min-h-screen bg-[#0e0e0e] text-foreground font-sans relative overflow-x-hidden selection:bg-primary/30">
      
      {/* Dynamic Background */}
      <div className="fixed inset-0 pointer-events-none -z-10">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/10 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary/5 blur-[120px] rounded-full animate-pulse decoration-[10s]" />
      </div>

      {/* NAVBAR */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? "bg-[#0e0e0e]/95 backdrop-blur-md border-b border-white/5 py-4" : "bg-transparent py-7"}`}>
        <div className="container mx-auto px-6 max-w-7xl flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group transition-transform active:scale-95">
            <Shield className="w-8 h-8 text-primary group-hover:rotate-12 transition-transform" />
            <span className="font-manrope font-extrabold text-2xl tracking-tighter text-white">Ride<span className="text-primary">Suraksha</span></span>
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
             <h4 className="text-primary font-black text-xs tracking-[0.3em] uppercase mb-4 opacity-80 decoration-primary decoration-offset-4 decoration-2">
               <Translate text="Worker Enrollment" />
             </h4>
             <h1 className="text-4xl md:text-5xl font-manrope font-black text-white tracking-tighter mb-8 leading-tight">
               <Translate text="Get Protected" /> <br className="sm:hidden" />
               <span className="text-white/20 italic font-medium px-2">—</span>
               <Translate text="Step" /> {step}
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
                 className="w-full max-w-2xl mx-auto flex flex-col items-center text-center py-20 bg-surface-card border-white/5 rounded-[40px] shadow-2xl relative overflow-hidden"
               >
                  <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-primary via-orange-300 to-primary-dark" />
                  
                  <div className="w-32 h-32 rounded-full bg-primary/10 border-4 border-primary/20 flex items-center justify-center mb-10 shadow-inner group overflow-hidden">
                     <motion.div initial={{ scale: 0, rotate: -45 }} animate={{ scale: 1, rotate: 0 }} transition={{ delay: 0.3, type: "spring" }}>
                       <BadgeCheck className="w-20 h-20 text-primary drop-shadow-[0_0_15px_rgba(249,115,22,0.6)]" />
                     </motion.div>
                  </div>

                  <h2 className="text-4xl md:text-5xl font-manrope font-black text-white mb-6 tracking-tight">
                     <Translate text="Welcome to RideSuraksha" />
                  </h2>
                  <p className="text-xl text-white/50 max-w-md mx-auto mb-10 leading-relaxed font-medium">
                     <Translate text="Your identity is verified and income is now protected. Coverage starts in 3 days." />
                  </p>
                  
                  <div className="bg-[#0e0e0e] border border-white/5 rounded-3xl p-8 w-full max-w-md mb-12 text-left space-y-4">
                     <div className="flex items-center justify-between border-b border-white/5 pb-4">
                        <span className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em]"><Translate text="Active Plan" /></span>
                        <span className="text-primary font-black uppercase tracking-tight text-lg">RideSuraksha</span>
                     </div>
                     <div className="flex items-center justify-between">
                        <span className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em]"><Translate text="Partner" /></span>
                        <span className="text-white font-bold leading-none">{formData.partner}</span>
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
                        onClick={() => {
                           localStorage.setItem('RideSuraksha_upi', formData.upiId);
                           window.location.href = '/dashboard';
                        }}
                        className="w-full h-16 bg-gradient-to-r from-primary to-primary-dark hover:opacity-90 transition-all font-black text-xl rounded-[32px] flex items-center justify-center gap-3 shadow-[0_0_50px_-5px_rgba(249,115,22,0.5)] border-none"
                     >
                        <Translate text="Go to Dashboard" /> <ArrowRight className="w-6 h-6" />
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
