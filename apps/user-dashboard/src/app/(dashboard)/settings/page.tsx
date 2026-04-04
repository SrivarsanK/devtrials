"use client";

import React, { useState } from "react";
import { User, Bell, Shield, MessageSquare, LogOut, ChevronRight, Phone, Fingerprint, Languages, Zap, BadgeCheck } from "lucide-react";
import { Translate } from "@/components/ui/translate";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { useUser } from "@clerk/nextjs";

export default function SettingsPage() {
  const { language, setLanguage } = useLanguage();
  const { user } = useUser();
  const [notifications, setNotifications] = useState(true);
  const [payoutAlerts, setPayoutAlerts] = useState(true);
  const [biometric, setBiometric] = useState(false);

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'ta' : 'en');
  };

  return (
    <div className="space-y-12 pb-12 animate-in fade-in duration-700 max-w-3xl mx-auto pt-4">
      
      {/* PROFILE TERMINAL */}
      <section className="flex flex-col items-center text-center space-y-8 pt-4">
          <div className="relative group">
              <div className="w-32 h-32 rounded-[48px] bg-primary/20 border-2 border-primary/40 flex items-center justify-center text-primary relative z-10 group-hover:scale-105 transition-transform duration-500 shadow-2xl">
                 <User className="w-16 h-16" />
              </div>
              <div className="absolute inset-0 bg-primary/20 blur-[50px] rounded-full group-hover:scale-110 transition-transform -z-10" />
              <div className="absolute -bottom-3 -right-3 w-10 h-10 rounded-2xl bg-[#0e0e0e] border border-white/10 flex items-center justify-center text-primary shadow-2xl">
                 <BadgeCheck className="w-5 h-5 shadow-[0_0_10px_rgba(249,115,22,0.5)]" />
              </div>
          </div>
          
          <div className="space-y-2">
              <h2 className="text-3xl font-manrope font-black text-white tracking-tighter uppercase italic leading-none">{user?.fullName || <Translate text="Worker" />}</h2>
              <div className="flex items-center justify-center gap-4 pt-1">
                 <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20 font-black tracking-widest text-[9px] px-4 py-1.5 uppercase rounded-full">
                    <Translate text="Bio-Shield Plus" />
                 </Badge>
                 <p className="text-[10px] font-black uppercase text-white/30 tracking-[0.3em] leading-none">ID: {user?.id?.slice(-8).toUpperCase() || 'GS-0000-00'}</p>
              </div>
          </div>
      </section>

      {/* SETTINGS MODULES */}
      <div className="grid grid-cols-1 gap-10 pt-4">
          
          {/* Preferences */}
          <div className="space-y-6">
              <h3 className="text-[10px] font-black uppercase tracking-[0.5em] text-white/20 px-6 flex items-center gap-4">
                 <Translate text="Preferences" />
                 <div className="h-px bg-white/5 flex-1" />
              </h3>
              
              <Card className="bg-surface-card border-white/5 rounded-[48px] divide-y divide-white/5 overflow-hidden shadow-2xl">
                 <div 
                   onClick={toggleLanguage}
                   className="p-8 flex items-center justify-between group cursor-pointer hover:bg-white/[0.04] transition-all"
                  >
                    <div className="flex items-center gap-6">
                       <div className="w-14 h-14 rounded-3xl bg-blue-500/10 flex items-center justify-center text-blue-500 group-hover:scale-110 transition-transform shadow-inner">
                          <Languages className="w-6 h-6" />
                       </div>
                       <div className="space-y-1">
                          <p className="text-sm font-black text-white uppercase tracking-tight leading-none"><Translate text="App Language" /></p>
                          <p className="text-[10px] font-bold uppercase text-white/30 tracking-widest italic pt-1"><Translate text={language === 'en' ? "English (Default)" : "Tamil (தமிழ்)"} /></p>
                       </div>
                    </div>
                    <ChevronRight className="w-6 h-6 text-white/10 group-hover:text-primary transition-all translate-x-0 group-hover:translate-x-1" />
                 </div>

                 <div className="p-8 flex items-center justify-between group hover:bg-white/[0.02] transition-colors">
                    <div className="flex items-center gap-6">
                       <div className="w-14 h-14 rounded-3xl bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform shadow-inner">
                          <Bell className="w-6 h-6" />
                       </div>
                       <div className="space-y-1">
                          <p className="text-sm font-black text-white uppercase tracking-tight leading-none"><Translate text="Risk Notifications" /></p>
                          <p className="text-[10px] font-bold uppercase text-white/30 tracking-widest italic pt-1"><Translate text="Alerts for active zones" /></p>
                       </div>
                    </div>
                    <Switch checked={notifications} onCheckedChange={setNotifications} className="data-[state=checked]:bg-primary" />
                 </div>

                 <div className="p-8 flex items-center justify-between group hover:bg-white/[0.02] transition-colors">
                    <div className="flex items-center gap-6">
                       <div className="w-14 h-14 rounded-3xl bg-green-500/10 flex items-center justify-center text-green-500 group-hover:scale-110 transition-transform shadow-inner">
                          <Zap className="w-6 h-6" />
                       </div>
                       <div className="space-y-1">
                          <p className="text-sm font-black text-white uppercase tracking-tight leading-none"><Translate text="Payout Alerts" /></p>
                          <p className="text-[10px] font-bold uppercase text-white/30 tracking-widest italic pt-1"><Translate text="Instant UPI confirmation" /></p>
                       </div>
                    </div>
                    <Switch checked={payoutAlerts} onCheckedChange={setPayoutAlerts} className="data-[state=checked]:bg-green-500" />
                 </div>
              </Card>
          </div>

          {/* Account Security */}
          <div className="space-y-6">
              <h3 className="text-[10px] font-black uppercase tracking-[0.5em] text-white/20 px-6 flex items-center gap-4">
                 <Translate text="Identity Shield" />
                 <div className="h-px bg-white/5 flex-1" />
              </h3>
              
              <Card className="bg-surface-card border-white/5 rounded-[48px] divide-y divide-white/5 overflow-hidden shadow-2xl">
                 <div className="p-8 flex items-center justify-between group hover:bg-white/[0.02] transition-colors">
                    <div className="flex items-center gap-6">
                       <div className="w-14 h-14 rounded-3xl bg-white/5 flex items-center justify-center text-white/40 group-hover:scale-110 transition-transform shadow-inner border border-white/5">
                          <Phone className="w-6 h-6" />
                       </div>
                       <div className="space-y-1">
                          <p className="text-sm font-black text-white uppercase tracking-tight leading-none"><Translate text="Linked Identity" /></p>
                          <p className="text-[10px] font-bold uppercase text-white/30 tracking-widest italic pt-1">{user?.primaryEmailAddress?.emailAddress || '+91 ***** *****'}</p>
                       </div>
                    </div>
                    <Badge className="bg-emerald-500/10 text-emerald-500 border-none font-black text-[9px] tracking-[0.2em] px-4 py-1.5 rounded-full"><Translate text="VERIFIED" /></Badge>
                 </div>

                 <div className="p-8 flex items-center justify-between group hover:bg-white/[0.02] transition-colors">
                    <div className="flex items-center gap-6">
                       <div className="w-14 h-14 rounded-3xl bg-orange-500/10 flex items-center justify-center text-orange-500 group-hover:scale-110 transition-transform shadow-inner">
                          <Fingerprint className="w-6 h-6" />
                       </div>
                       <div className="space-y-1">
                          <p className="text-sm font-black text-white uppercase tracking-tight leading-none"><Translate text="Biometric Lock" /></p>
                          <p className="text-[10px] font-bold uppercase text-white/30 tracking-widest italic pt-1"><Translate text="ID.me Facial Verification" /></p>
                       </div>
                    </div>
                    <Switch checked={biometric} onCheckedChange={setBiometric} className="data-[state=checked]:bg-orange-500" />
                 </div>
              </Card>
          </div>

          {/* Support Module */}
          <div className="pt-10 flex flex-col items-center gap-8">
              <Button className="w-full h-24 bg-surface-card border border-white/5 hover:border-primary/40 rounded-[48px] p-8 flex items-center justify-between group transition-all duration-500 active:scale-98 shadow-2xl">
                 <div className="flex items-center gap-6 text-left">
                    <div className="w-14 h-14 rounded-3xl bg-white/5 flex items-center justify-center text-white/20 group-hover:text-primary group-hover:bg-primary/5 transition-all">
                       <MessageSquare className="w-6 h-6" />
                    </div>
                    <div className="font-black uppercase tracking-tight">
                       <p className="text-xl leading-none mb-1.5"><Translate text="Help & FAQ" /></p>
                       <p className="text-[10px] opacity-20 leading-none italic"><Translate text="Common issues & support" /></p>
                    </div>
                 </div>
                 <ChevronRight className="w-6 h-6 text-white/10 group-hover:text-primary transition-all translate-x-0 group-hover:translate-x-1" />
              </Button>

              <div className="flex flex-col items-center gap-8 w-full pt-4">
                  <Button variant="ghost" className="text-rose-500/40 hover:text-rose-500 hover:bg-rose-500/5 h-16 w-full rounded-[32px] px-8 uppercase font-black tracking-[0.3em] text-[11px] gap-4 transition-all italic border border-transparent hover:border-rose-500/20">
                     <LogOut className="w-5 h-5" /> <Translate text="Terminate Session" />
                  </Button>
                  
                  <div className="flex flex-col items-center gap-3 opacity-20 grayscale hover:grayscale-0 transition-all cursor-default">
                     <p className="text-[9px] font-black uppercase tracking-[1em] text-white flex items-center gap-2">
                        Ride<span className="text-primary italic">Suraksha</span> v8.4.1
                     </p>
                     <p className="text-[8px] font-black text-white/40 leading-none tracking-widest uppercase">Obsidian Protocol Enabled</p>
                  </div>
              </div>
          </div>

      </div>

    </div>
  );
}
