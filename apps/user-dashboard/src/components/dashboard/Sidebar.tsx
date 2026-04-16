"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Shield, LayoutDashboard, History, Globe, 
  Settings, Zap, ShieldCheck, Info, X, LogOut,
  AlertCircle
} from "lucide-react";
import { Translate } from "@/components/ui/translate";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

interface SidebarProps {
  onClose?: () => void;
}

export function Sidebar({ onClose }: SidebarProps) {
  const pathname = usePathname();

  const menuItems = [
    { name: "Dashboard", icon: LayoutDashboard, href: "/dashboard" },
    { name: "Payout History", icon: History, href: "/history" },
    { name: "Claims", icon: AlertCircle, href: "/claims" },
    { name: "Settings", icon: Settings, href: "/settings" },
  ];

  return (
    <div className="h-full flex flex-col glass-strong w-72 lg:w-80 transition-all duration-500 relative overflow-hidden">
      
      {/* Sidebar Glow Ambience */}
      <div className="absolute -top-[20%] -left-[20%] w-[60%] h-[60%] bg-primary/5 blur-[80px] rounded-full pointer-events-none animate-glow-pulse" />

      {/* Sidebar Header */}
      <div className="p-10 flex items-center justify-between relative">
        <Link href="/dashboard" className="flex items-center gap-3 group">
          <div className="size-11 rounded-xl bg-primary flex items-center justify-center group-hover:scale-110 transition-transform shadow-[0_0_20px_rgba(255,70,37,0.3)] rotate-6">
            <ShieldCheck className="size-6 text-white group-hover:rotate-12 transition-all duration-500" strokeWidth={2.5} />
          </div>
          <div className="flex flex-col gap-0 leading-tight">
            <span className="font-display font-black text-2xl tracking-tight text-foreground uppercase">
              Ride<span className="text-primary italic">Suraksha</span>
            </span>
            <span className="text-[7px] font-bold tracking-[0.2em] text-muted-foreground uppercase opacity-50">Income Shield</span>
          </div>
        </Link>
        {onClose && (
          <Button variant="ghost" size="icon" onClick={onClose} className="lg:hidden text-white/40 hover:bg-white/5 h-12 w-12 rounded-2xl border border-white/5">
            <X className="w-5 h-5" />
          </Button>
        )}
      </div>

      {/* Navigation Links */}
      <div className="flex-1 px-6 py-4 space-y-3 relative">
        <p className="text-[9px] font-black uppercase tracking-[0.5em] text-white/20 px-6 mb-4 italic leading-none opacity-50"><Translate text="Navigation Terminal" /></p>
        
        {menuItems.map((item, idx) => {
          const isActive = pathname === item.href;
          return (
            <Link key={idx} href={item.href} onClick={onClose}>
              <motion.div 
                whileHover={{ x: 6 }}
                whileTap={{ scale: 0.98 }}
                className={`flex items-center gap-5 px-7 py-4 rounded-[32px] transition-all duration-500 group relative overflow-hidden ${
                  isActive 
                  ? "bg-primary/10 text-primary border border-primary/20 neon-primary" 
                  : "text-white/30 hover:text-white hover:bg-white/[0.04] border border-transparent"
                }`}
              >
                {isActive && (
                   <motion.div 
                    layoutId="sidebar-active-glow" 
                    className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent pointer-events-none" 
                   />
                )}
                
                <item.icon className={`w-5 h-5 transition-transform group-hover:scale-110 ${isActive ? "text-primary" : "text-white/20 group-hover:text-white"}`} />
                <span className="text-[11px] font-black uppercase tracking-[0.3em] italic leading-none pt-0.5"><Translate text={item.name} /></span>
                
                {isActive && (
                   <motion.div layoutId="sidebar-active-dot" className="ml-auto w-2 h-2 rounded-full bg-primary shadow-[0_0_15px_rgba(255,70,37,0.8)] border border-white/10" />
                )}
              </motion.div>
            </Link>
          )
        })}

        {/* Premium Upgrade Module */}
        <div className="mt-12 p-8 glass border border-white/5 rounded-[48px] space-y-6 mx-2 shadow-2xl group hover:border-primary/20 transition-all relative overflow-hidden cursor-default">
           <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 blur-[40px] rounded-full animate-glow-pulse" />
           <div className="size-12 rounded-2xl bg-primary/10 flex items-center justify-center border border-primary/20 group-hover:scale-110 transition-transform">
              <ShieldCheck className="size-6 text-primary drop-shadow-[0_0_10px_rgba(255,70,37,0.5)]" />
           </div>
           <div className="space-y-1.5">
              <p className="text-[9px] font-black uppercase text-white/30 tracking-widest leading-none"><Translate text="Identity Verified" /></p>
              <h5 className="text-sm font-black text-white uppercase tracking-tight leading-loose italic"><Translate text="Professional Grade" /></h5>
           </div>
           <p className="text-[8px] font-bold text-white/20 uppercase tracking-widest leading-relaxed"><Translate text="Your biometric insurance coverage is active for current session." /></p>
        </div>
      </div>

      {/* Sidebar Footer */}
      <div className="p-8 border-t border-white/5 space-y-6 relative">
         <div className="flex items-center gap-5 px-6 py-4 glass-subtle rounded-[28px] group hover:bg-white/[0.05] transition-all cursor-pointer">
            <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center border border-white/10 group-hover:text-primary transition-colors">
               <Info className="w-5 h-5 group-hover:rotate-12 transition-transform" />
            </div>
            <div className="flex flex-col">
               <span className="text-[9px] font-black text-white/20 uppercase tracking-widest leading-none mb-1.5"><Translate text="Support" /></span>
               <span className="text-[10px] font-black text-white uppercase tracking-tight leading-none italic"><Translate text="Help Terminal" /></span>
            </div>
         </div>
         
         <div className="flex flex-col items-center gap-2 opacity-10 grayscale hover:grayscale-0 hover:opacity-30 transition-all cursor-default">
            <p className="text-[8px] font-black uppercase tracking-[0.6em] text-white italic">
               Ride<span className="text-primary">Suraksha</span> v8.4.1
            </p>
            <p className="text-[7px] font-black uppercase tracking-widest text-white/40">Obsidiana Engine</p>
         </div>
      </div>
    </div>
  );
}
