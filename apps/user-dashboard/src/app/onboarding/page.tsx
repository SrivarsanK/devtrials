"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Shield, ArrowRight, CheckCircle2, ChevronLeft, Smartphone, Globe, ShieldCheck, BadgeCheck } from "lucide-react";
import { Translate } from "@/components/ui/translate";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { StepIndicator } from "@/components/enrollment/StepIndicator";
import { VerificationStep } from "@/components/enrollment/VerificationStep";
import { PlanSelection } from "@/components/enrollment/PlanSelection";
import { UPIStep } from "@/components/enrollment/UPIStep";
import { motion, AnimatePresence } from "framer-motion";

export default function EnrollmentWizard() {
  const [step, setStep] = useState(1);
  const [scrolled, setScrolled] = useState(false);
  const [formData, setFormData] = useState({
    partnerId: "",
    plan: "plus",
    upiId: "",
  });

  const { language, setLanguage } = useLanguage();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleVerificationNext = (id: string) => {
    setFormData({ ...formData, partnerId: id });
    setStep(2);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handlePlanNext = (plan: string) => {
    setFormData({ ...formData, plan });
    setStep(3);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleUPINext = (upi: string) => {
    setFormData({ ...formData, upiId: upi });
    setStep(4);
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
            <span className="font-manrope font-extrabold text-2xl tracking-tighter text-white">Gig<span className="text-primary">Shield</span></span>
          </Link>

          <div className="flex items-center gap-6">
            {/* Lang Toggle */}
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
        
        {step < 4 && (
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
              <motion.div 
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.4 }}
                className="w-full"
              >
                <VerificationStep onNext={handleVerificationNext} />
              </motion.div>
            )}

            {step === 2 && (
              <motion.div 
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.4 }}
                className="w-full"
              >
                <PlanSelection onSelect={handlePlanNext} onBack={() => setStep(1)} />
              </motion.div>
            )}

            {step === 3 && (
              <motion.div 
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.4 }}
                className="w-full"
              >
                <UPIStep onComplete={handleUPINext} onBack={() => setStep(2)} />
              </motion.div>
            )}

            {step === 4 && (
              <motion.div 
                key="step4"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 20 }}
                className="w-full max-w-2xl mx-auto flex flex-col items-center text-center py-20 bg-surface-card border-white/5 rounded-[40px] shadow-2xl relative overflow-hidden"
              >
                 <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-primary via-orange-300 to-primary-dark" />
                 
                 <div className="w-32 h-32 rounded-full bg-primary/10 border-4 border-primary/20 flex items-center justify-center mb-10 shadow-inner group overflow-hidden">
                    <motion.div
                       initial={{ scale: 0, rotate: -45 }}
                       animate={{ scale: 1, rotate: 0 }}
                       transition={{ delay: 0.3, type: "spring" }}
                    >
                      <BadgeCheck className="w-20 h-20 text-primary drop-shadow-[0_0_15px_rgba(249,115,22,0.6)]" />
                    </motion.div>
                 </div>

                 <h2 className="text-4xl md:text-5xl font-manrope font-black text-white mb-6 tracking-tight">
                    <Translate text="Welcome to GigShield" />
                 </h2>
                 <p className="text-xl text-white/50 max-w-md mx-auto mb-10 leading-relaxed font-medium">
                    <Translate text="Your income is now protected. Automatic payouts will arrive via your UPI for any disruptions in your zone." />
                 </p>
                 
                 <div className="bg-[#0e0e0e] border border-white/5 rounded-3xl p-8 w-full max-w-sm mb-12 text-left space-y-4">
                    <div className="flex items-center justify-between">
                       <span className="text-sm font-bold text-white/30 uppercase tracking-widest"><Translate text="Active Plan" /></span>
                       <span className="text-primary font-black uppercase tracking-tight text-lg">{formData.plan}</span>
                    </div>
                    <div className="flex items-center justify-between">
                       <span className="text-sm font-bold text-white/30 uppercase tracking-widest"><Translate text="Partner ID" /></span>
                       <span className="text-white font-bold tracking-tight">{formData.partnerId}</span>
                    </div>
                    <div className="flex items-center justify-between">
                       <span className="text-sm font-bold text-white/30 uppercase tracking-widest"><Translate text="UPI Linked" /></span>
                       <span className="text-white font-bold tracking-tight truncate max-w-[150px]">{formData.upiId}</span>
                    </div>
                 </div>

                 <Link href="/dashboard" className="w-full px-12">
                   <Button className="w-full h-16 bg-gradient-to-r from-primary to-primary-dark hover:opacity-90 transition-all font-black text-xl rounded-full flex items-center justify-center gap-3 shadow-[0_0_50px_-5px_rgba(249,115,22,0.5)] border-none">
                     <Translate text="Go to Dashboard" /> <ArrowRight className="w-6 h-6" />
                   </Button>
                 </Link>

                 <p className="mt-8 text-xs text-white/20 font-bold uppercase tracking-widest animate-pulse">
                    <Translate text="Coverage activated: 3-day waiting period started" />
                 </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      {/* FOOTER */}
      <footer className="py-12 bg-transparent text-center">
         <p className="text-white/20 text-[10px] font-black tracking-[0.2em] uppercase">
            Built for Guidewire DEVTrails 2024 — ShieldLife Secure Systems
         </p>
      </footer>

    </div>
  );
}
