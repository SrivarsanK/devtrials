"use client";

import React, { useState, useEffect } from "react";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { useUser, UserButton } from "@clerk/nextjs";
import { Loader2, Menu, Bell, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { Translate } from "@/components/ui/translate";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { isLoaded } = useUser();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { language, setLanguage } = useLanguage();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (!isLoaded) {
    return (
      <div className="h-screen w-full bg-[#0e0e0e] flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-primary/20" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0e0e0e] text-foreground font-sans flex relative overflow-x-hidden selection:bg-primary/30">
      
      {/* SIDEBAR - DESKTOP */}
      <aside className="hidden lg:block sticky top-0 h-screen shrink-0">
        <Sidebar aria-label="Main Navigation" />
      </aside>

      {/* MOBILE SIDEBAR OVERLAY */}
      <AnimatePresence>
        {isSidebarOpen && (
          <>
            <motion.div 
               initial={{ opacity: 0 }} 
               animate={{ opacity: 1 }} 
               exit={{ opacity: 0 }}
               onClick={() => setIsSidebarOpen(false)}
               className="fixed inset-0 bg-black/80 backdrop-blur-md z-[60] lg:hidden" 
               aria-hidden="true"
            />
            <motion.div 
               initial={{ x: "-100%" }} 
               animate={{ x: 0 }} 
               exit={{ x: "-100%" }}
               transition={{ type: "spring", damping: 25, stiffness: 200 }}
               className="fixed top-0 left-0 bottom-0 z-[70] lg:hidden"
            >
               <Sidebar onClose={() => setIsSidebarOpen(false)} />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <div className="flex-1 flex flex-col min-h-screen relative overflow-hidden">
        
        {/* AMBIENCE */}
        <div className="fixed inset-0 pointer-events-none -z-10">
          <div className="absolute top-[10%] right-[10%] w-[40%] h-[40%] bg-primary/[0.03] blur-[150px] rounded-full animate-pulse" />
          <div className="absolute bottom-[20%] left-[5%] w-[50%] h-[50%] bg-orange-500/[0.02] blur-[150px] rounded-full animate-pulse" />
        </div>

        {/* PERSISTENT TOP NAV */}
        <nav className={`sticky top-0 w-full z-50 transition-all duration-500 border-b border-transparent ${
          scrolled ? "bg-[#0e0e0e]/90 backdrop-blur-2xl border-white/5 py-4" : "bg-transparent py-8"
        }`}>
          <div className="container mx-auto px-6 max-w-7xl flex items-center justify-between">
            <div className="flex items-center gap-4">
               <Button variant="ghost" size="icon" onClick={() => setIsSidebarOpen(true)} className="lg:hidden text-white/40 hover:bg-white/5 h-12 w-12 rounded-2xl border border-white/5">
                  <Menu className="w-6 h-6" />
               </Button>
               
               <div className="hidden lg:flex bg-white/5 border border-white/10 rounded-2xl px-6 py-2 items-center gap-3 h-12">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                  <span className="text-[10px] font-black uppercase text-white/40 tracking-widest"><Translate text="Active Zone" />: </span>
                  <span className="text-[10px] font-black text-white uppercase tracking-widest leading-none">Chennai Central</span>
               </div>
            </div>

            {/* BRAND LOGO FOR TABLET (Hidden on Mobile/Huge Desktop) */}
            <div className="lg:hidden xl:hidden flex items-center gap-3">
               <Shield className="w-6 h-6 text-primary" />
               <span className="font-manrope font-black text-xl tracking-tighter text-white uppercase italic">Gig<span className="text-primary NOT-italic">Shield</span></span>
            </div>

            <div className="flex items-center gap-4">
              {/* Language Switcher */}
              <div className="hidden sm:flex bg-white/5 border border-white/5 rounded-2xl p-1 gap-1 h-12">
                 <button onClick={() => setLanguage('en')} className={`px-5 rounded-xl text-[10px] font-black tracking-widest transition-all ${language === 'en' ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-white/40 hover:text-white'}`}>EN</button>
                 <button onClick={() => setLanguage('ta')} className={`px-5 rounded-xl text-[10px] font-black tracking-widest transition-all ${language === 'ta' ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-white/40 hover:text-white'}`}>தமிழ்</button>
              </div>

              {/* Notifications */}
              <Button variant="ghost" size="icon" className="w-12 h-12 rounded-2xl bg-white/5 border border-white/5 text-white/40 hover:text-white hover:bg-white/10 relative">
                 <Bell className="w-5 h-5 transition-transform group-hover:rotate-12" />
                 <span className="absolute top-3.5 right-3.5 w-1.5 h-1.5 bg-primary rounded-full" />
              </Button>

              {/* User Identity */}
              <div className="p-1 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-all cursor-pointer">
                 <UserButton appearance={{ elements: { userButtonAvatarBox: "w-10 h-10 rounded-xl" } }} />
              </div>
            </div>
          </div>
        </nav>

        {/* SCROLLABLE MAIN CONTENT AREA */}
        <main className="flex-1 w-full overflow-y-auto overflow-x-hidden pt-4 pb-24 lg:pb-12 custom-scrollbar">
          <div className="container mx-auto px-6 max-w-7xl">
             {children}
          </div>
        </main>

        {/* MOBILE HUD - FLOATING BOTTOM BAR (REMAINING NAV ON MOBILE) */}
        <footer className="fixed bottom-6 left-6 right-6 z-40 lg:hidden">
           <div className="bg-[#0e0e0e]/80 backdrop-blur-2xl border border-white/10 rounded-[32px] p-2 flex items-center justify-around shadow-2xl mx-auto max-w-md">
              <Link href="/dashboard" className="p-4 bg-primary/10 text-primary rounded-2xl border border-primary/20 transition-all active:scale-95">
                 <LayoutDashboard className="w-5 h-5" />
              </Link>
              <Link href="/zones" className="p-4 text-white/20 hover:text-white transition-colors active:scale-95">
                 <ShieldCheck className="w-5 h-5" />
              </Link>
              <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center text-white/10 border border-white/5 pointer-events-none opacity-20">
                 <Shield className="w-5 h-5" />
              </div>
              <Link href="/settings" className="p-4 text-white/20 hover:text-white transition-colors active:scale-95">
                 <SettingsIcon className="w-5 h-5" />
              </Link>
           </div>
        </footer>

      </div>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 0px;
        }
        .custom-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}

// ICON IMPORTS FOR FOOTER
import { ShieldCheck, History as HistoryIcon, LayoutDashboard, Settings as SettingsIcon } from "lucide-react";
