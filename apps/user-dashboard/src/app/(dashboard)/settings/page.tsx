"use client";

import React, { useState } from "react";
import { 
  User, Bell, Shield, MessageSquare, LogOut, 
  ChevronRight, Phone, Fingerprint, Languages, 
  Zap, BadgeCheck, CreditCard, BellRing, Settings,
  ShieldAlert, Sparkles, LogOut as LogOutIcon
} from "lucide-react";
import { Translate } from "@/components/ui/translate";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { useUser, SignOutButton } from "@clerk/nextjs";
import { motion } from "framer-motion";

export default function SettingsPage() {
  const { language, setLanguage } = useLanguage();
  const { user } = useUser();
  const [notifications, setNotifications] = useState(true);
  const [payoutAlerts, setPayoutAlerts] = useState(true);
  const [biometric, setBiometric] = useState(true);
  const [autoDeduct, setAutoDeduct] = useState(true);

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'ta' : 'en');
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="space-y-12 pb-24 max-w-4xl mx-auto pt-6"
    >
      
      {/* HEADER AREA */}
      <motion.div variants={itemVariants} className="flex flex-col space-y-4">
          <div className="flex items-center gap-3">
             <Settings className="w-5 h-5 text-primary animate-pulse" />
             <span className="text-[10px] font-black uppercase text-primary tracking-[0.4em] opacity-80">
                <Translate text="System Configuration" />
             </span>
          </div>
          <h1 className="text-6xl md:text-8xl font-display font-black text-white tracking-tighter leading-[0.8] uppercase italic">
             <Translate text="Control" />
             <span className="text-white/40 font-medium ml-4">Terminal</span>
          </h1>
      </motion.div>

      {/* DRIVER IDENTITY CARD */}
      <motion.div variants={itemVariants}>
        <Card className="glass-strong border-white/[0.08] rounded-[48px] overflow-hidden relative group p-1 shadow-2xl">
          <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2 group-hover:bg-primary/20 transition-all duration-1000" />
          
          <div className="relative z-10 p-10 flex flex-col md:flex-row items-center gap-12">
            <div className="relative">
               <div className="w-40 h-40 rounded-[48px] bg-gradient-to-br from-primary/30 to-secondary/30 border-2 border-white/10 flex items-center justify-center text-white relative shadow-2xl group-hover:scale-105 transition-transform duration-700">
                  {user?.imageUrl ? (
                    <img src={user.imageUrl} className="w-full h-full object-cover rounded-[46px]" alt="Profile" />
                  ) : (
                    <User className="w-20 h-20 opacity-20" />
                  )}
               </div>
               <div className="absolute -bottom-4 -right-4 w-14 h-14 rounded-2xl bg-[#0d0d15] border border-white/10 flex items-center justify-center shadow-2xl">
                  <BadgeCheck className="w-7 h-7 text-primary drop-shadow-[0_0_8px_rgba(255,70,37,0.5)]" />
               </div>
            </div>

            <div className="flex-1 text-center md:text-left space-y-4">
              <div className="space-y-1">
                <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white/30 italic"><Translate text="Active Personnel" /></p>
                <h2 className="text-4xl md:text-6xl font-display font-black text-white tracking-tighter uppercase leading-none italic">{user?.fullName || "Field Agent"}</h2>
              </div>
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
                 <Badge className="bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 font-black tracking-widest text-[10px] px-5 py-2 uppercase rounded-full">
                    <Translate text="Bio-Shield Max Tier" />
                 </Badge>
                 <Badge variant="outline" className="border-white/10 text-white/40 font-black tracking-widest text-[10px] px-5 py-2 uppercase rounded-full">
                    ID: {user?.id?.slice(-12).toUpperCase()}
                 </Badge>
              </div>
            </div>
            
            <div className="w-full md:w-auto">
               <Button variant="ghost" className="w-full md:w-auto h-16 rounded-3xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.05] text-white/40 hover:text-white transition-all px-8 text-xs font-black uppercase tracking-widest gap-3">
                  <Sparkles className="w-4 h-4 text-primary" />
                  <Translate text="Edit Profile" />
               </Button>
            </div>
          </div>
        </Card>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        
        {/* APP PREFERENCES */}
        <motion.div variants={itemVariants} className="space-y-8">
           <div className="flex items-center gap-4 px-6">
              <span className="text-[10px] font-black uppercase tracking-[0.5em] text-white/20 whitespace-nowrap italic"><Translate text="Application Protocol" /></span>
              <div className="h-px bg-white/5 flex-1" />
           </div>

           <Card className="bg-[#0e0e12]/60 border-white/[0.05] rounded-[48px] overflow-hidden divide-y divide-white/[0.03] shadow-2xl backdrop-blur-xl">
              <div 
                onClick={toggleLanguage}
                className="p-10 flex items-center justify-between group cursor-pointer hover:bg-white/[0.02] transition-all"
              >
                <div className="flex items-center gap-8">
                   <div className="w-16 h-16 rounded-[28px] bg-blue-500/10 flex items-center justify-center text-blue-500 border border-blue-500/10 group-hover:scale-110 transition-transform">
                      <Languages className="w-7 h-7" />
                   </div>
                   <div className="space-y-1.5">
                      <p className="text-base font-black text-white uppercase tracking-tight leading-none italic"><Translate text="Interface Language" /></p>
                      <p className="text-[10px] font-bold uppercase text-white/30 tracking-widest opacity-60"><Translate text={language === 'en' ? "English (Global Standard)" : "Tamil (தமிழ் - மண்டலம்)"} /></p>
                   </div>
                </div>
                <ChevronRight className="w-6 h-6 text-white/10 group-hover:text-primary transition-all translate-x-0 group-hover:translate-x-1" />
              </div>

              <div className="p-10 flex items-center justify-between group">
                <div className="flex items-center gap-8">
                   <div className="w-16 h-16 rounded-[28px] bg-primary/10 flex items-center justify-center text-primary border border-primary/10 group-hover:scale-110 transition-transform">
                      <BellRing className="w-7 h-7" />
                   </div>
                   <div className="space-y-1.5">
                      <p className="text-base font-black text-white uppercase tracking-tight leading-none italic"><Translate text="Neural Alerts" /></p>
                      <p className="text-[10px] font-bold uppercase text-white/30 tracking-widest opacity-60"><Translate text="Push notifications for zone disruptions" /></p>
                   </div>
                </div>
                <Switch checked={notifications} onCheckedChange={setNotifications} className="data-[state=checked]:bg-primary" />
              </div>

              <div className="p-10 flex items-center justify-between group">
                <div className="flex items-center gap-8">
                   <div className="w-16 h-16 rounded-[28px] bg-emerald-500/10 flex items-center justify-center text-emerald-500 border border-emerald-500/10 group-hover:scale-110 transition-transform">
                      <Zap className="w-7 h-7" />
                   </div>
                   <div className="space-y-1.5">
                      <p className="text-base font-black text-white uppercase tracking-tight leading-none italic"><Translate text="Instant Payouts" /></p>
                      <p className="text-[10px] font-bold uppercase text-white/30 tracking-widest opacity-60"><Translate text="Auto-transfer to linked UPI wallet" /></p>
                   </div>
                </div>
                <Switch checked={payoutAlerts} onCheckedChange={setPayoutAlerts} className="data-[state=checked]:bg-emerald-500" />
              </div>
           </Card>
        </motion.div>

        {/* SECURITY & FINANCE */}
        <motion.div variants={itemVariants} className="space-y-8">
           <div className="flex items-center gap-4 px-6">
              <span className="text-[10px] font-black uppercase tracking-[0.5em] text-white/20 whitespace-nowrap italic"><Translate text="Security & Settlement" /></span>
              <div className="h-px bg-white/5 flex-1" />
           </div>

           <Card className="bg-[#0e0e12]/60 border-white/[0.05] rounded-[48px] overflow-hidden divide-y divide-white/[0.03] shadow-2xl backdrop-blur-xl">
              <div className="p-10 flex items-center justify-between group hover:bg-white/[0.01] transition-colors">
                <div className="flex items-center gap-8">
                   <div className="w-16 h-16 rounded-[28px] bg-orange-500/10 flex items-center justify-center text-orange-500 border border-orange-500/10 group-hover:scale-110 transition-transform">
                      <Fingerprint className="w-7 h-7" />
                   </div>
                   <div className="space-y-1.5">
                      <p className="text-base font-black text-white uppercase tracking-tight leading-none italic"><Translate text="Bio-Lock" /></p>
                      <p className="text-[10px] font-bold uppercase text-white/30 tracking-widest opacity-60"><Translate text="Biometric verification for withdrawals" /></p>
                   </div>
                </div>
                <Switch checked={biometric} onCheckedChange={setBiometric} className="data-[state=checked]:bg-orange-500" />
              </div>

              <div className="p-10 flex items-center justify-between group hover:bg-white/[0.01] transition-colors">
                <div className="flex items-center gap-8">
                   <div className="w-16 h-16 rounded-[28px] bg-secondary/10 flex items-center justify-center text-secondary border border-secondary/10 group-hover:scale-110 transition-transform">
                      <CreditCard className="w-7 h-7" />
                   </div>
                   <div className="space-y-1.5">
                      <p className="text-base font-black text-white uppercase tracking-tight leading-none italic"><Translate text="Auto-Deduct" /></p>
                      <p className="text-[10px] font-bold uppercase text-white/30 tracking-widest opacity-60"><Translate text="Next deduction: Tomorrow, 9:00 AM" /></p>
                   </div>
                </div>
                <Switch checked={autoDeduct} onCheckedChange={setAutoDeduct} className="data-[state=checked]:bg-secondary" />
              </div>

              <div className="p-10 flex items-center justify-between group cursor-pointer hover:bg-white/[0.02] transition-all">
                <div className="flex items-center gap-8">
                   <div className="w-16 h-16 rounded-[28px] bg-white/5 flex items-center justify-center text-white/20 border border-white/5 group-hover:text-primary transition-colors">
                      <ShieldAlert className="w-7 h-7" />
                   </div>
                   <div className="space-y-1.5">
                      <p className="text-base font-black text-white uppercase tracking-tight leading-none italic"><Translate text="Contract Terms" /></p>
                      <p className="text-[10px] font-bold uppercase text-white/30 tracking-widest opacity-60"><Translate text="View your parametric shield policy" /></p>
                   </div>
                </div>
                <ChevronRight className="w-6 h-6 text-white/10 group-hover:text-primary transition-all translate-x-0 group-hover:translate-x-1" />
              </div>
           </Card>
        </motion.div>
      </div>

      {/* SUPPORT & LOGOUT */}
      <motion.div variants={itemVariants} className="pt-8 space-y-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
           <Button className="h-32 bg-white/[0.03] border border-white/5 hover:border-primary/40 rounded-[48px] p-10 flex items-center justify-between group transition-all duration-500 active:scale-98 shadow-2xl">
              <div className="flex items-center gap-8 text-left">
                 <div className="w-16 h-16 rounded-[28px] bg-white/5 flex items-center justify-center text-white/20 group-hover:text-primary group-hover:bg-primary/5 transition-all">
                    <MessageSquare className="w-7 h-7" />
                 </div>
                 <div className="font-black uppercase tracking-tight italic">
                    <p className="text-2xl leading-none mb-1.5"><Translate text="Support" /></p>
                    <p className="text-[10px] opacity-20 leading-none"><Translate text="24/7 Field Agent Helpline" /></p>
                 </div>
              </div>
              <ChevronRight className="w-6 h-6 text-white/10 group-hover:text-primary transition-all translate-x-0 group-hover:translate-x-1" />
           </Button>

           <SignOutButton>
              <Button variant="ghost" className="h-32 bg-rose-500/5 border border-rose-500/10 hover:bg-rose-500/10 text-rose-500/60 hover:text-rose-500 rounded-[48px] p-10 flex items-center justify-between group transition-all duration-500 active:scale-98 shadow-xl">
                <div className="flex items-center gap-8 text-left">
                   <div className="w-16 h-16 rounded-[28px] bg-rose-500/10 flex items-center justify-center border border-rose-500/20 group-hover:bg-rose-500 group-hover:text-white transition-all">
                      <LogOutIcon className="w-7 h-7" />
                   </div>
                   <div className="font-black uppercase tracking-tight italic">
                      <p className="text-2xl leading-none mb-1.5"><Translate text="Sign Out" /></p>
                      <p className="text-[10px] opacity-20 leading-none"><Translate text="Terminate active session" /></p>
                   </div>
                </div>
                <div className="w-12 h-12 rounded-full border border-rose-500/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                   <ChevronRight className="w-6 h-6" />
                </div>
              </Button>
           </SignOutButton>
        </div>

        <div className="text-center space-y-4 pt-8 opacity-20 grayscale hover:grayscale-0 transition-all duration-1000">
           <p className="text-xs font-black uppercase tracking-[1.5em] text-white">Ride<span className="text-primary italic">Suraksha</span></p>
           <div className="flex items-center justify-center gap-4 text-[8px] font-black uppercase tracking-widest text-white/60">
              <span>Build v8.4.1</span>
              <span className="size-1 rounded-full bg-white/20" />
              <span>Core Protocol 4.2</span>
              <span className="size-1 rounded-full bg-white/20" />
              <span>Encrypted Session</span>
           </div>
        </div>
      </motion.div>

    </motion.div>
  );
}
