"use client";

import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { useIsMobile } from "@/hooks/use-mobile";
import Link from "next/link";
import { 
  Bell,
  Search,
  Settings,
  Database,
  Globe,
  ShieldCheck,
  Activity
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSidebar } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";

import { Translate } from "@/components/ui/translate";
import { useLanguage } from "@/contexts/LanguageContext";

export function AppHeader() {
  const isMobile = useIsMobile();
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";
  const [hasNotifications, setHasNotifications] = useState(true);
  const { language, setLanguage } = useLanguage();

  return (
    <header className={cn(
      "sticky top-0 z-30 flex h-16 w-full shrink-0 items-center justify-between border-b border-white/[0.06] bg-[#0d0d15]/70 backdrop-blur-2xl transition-all duration-500",
      "px-4 md:px-8"
    )}>
      <div className="flex items-center gap-4">
        {isMobile ? (
          <Link href="/" className="flex items-center gap-2 group mr-2">
            <div className="flex aspect-square size-8 items-center justify-center shrink-0 rounded-lg bg-primary shadow-[0_0_10px_rgba(255,70,37,0.2)]">
              <ShieldCheck className="size-5 text-white" strokeWidth={2.5} />
            </div>
            <span className="text-sm font-display font-black tracking-tight text-foreground uppercase">Ride<span className="text-primary italic">Suraksha</span></span>
          </Link>
        ) : (
          <SidebarTrigger className="hover:bg-primary/10 transition-colors rounded-lg" />
        )}
        <Separator orientation="vertical" className="h-4 bg-white/[0.06] hidden md:block" />
        <div className="hidden lg:flex items-center gap-4">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg glass-subtle text-[10px] font-black uppercase tracking-[0.12em] border-none">
            <Globe className="size-3.5 text-secondary animate-pulse" />
            <span className="text-white"><Translate text="Active Shield Protocol" /></span>
          </div>
          <div className="flex items-center gap-2 group cursor-pointer hover:bg-white/[0.03] p-2 rounded-lg transition-colors">
            <Activity className="size-3.5 text-muted-foreground group-hover:text-secondary transition-colors" />
            <span className="text-[10px] font-black uppercase tracking-widest text-white group-hover:text-foreground">
              <Translate text="Oracle Synced" />
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* Language Switcher - REINSTATED */}
        <div className="hidden sm:flex glass rounded-xl p-1 gap-1 border border-white/[0.03] mr-2 scale-90">
            <button onClick={() => setLanguage('en')} className={`px-3 py-1.5 rounded-lg text-[8px] font-black tracking-[0.2em] transition-all ${language === 'en' ? 'bg-primary text-white shadow-lg neon-primary' : 'text-white/30 hover:text-white'}`}>EN</button>
            <button onClick={() => setLanguage('ta')} className={`px-3 py-1.5 rounded-lg text-[8px] font-black tracking-widest transition-all ${language === 'ta' ? 'bg-primary text-white shadow-lg neon-primary' : 'text-white/30 hover:text-white'}`}>தமிழ்</button>
        </div>

        <div className="hidden md:flex relative group border-none">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground group-focus-within:text-primary transition-colors" />
          <input
            type="text"
            placeholder="Search Intelligence..."
            className="h-9 pl-9 pr-4 w-64 glass rounded-lg text-xs font-medium focus:outline-none hover:bg-white/[0.05] transition-all placeholder:text-muted-foreground/50 border-none text-white"
          />
        </div>

        <div className="flex items-center gap-1">
             <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => setHasNotifications(false)}
                className="size-9 rounded-lg hover:bg-primary/10 hover:text-primary group relative border-none"
            >
                <Bell className={cn("size-4 text-muted-foreground group-hover:text-primary", hasNotifications && "animate-pulse")} />
                {hasNotifications && (
                <span className="absolute top-2.5 right-2.5 size-1.5 bg-primary rounded-full border border-[#0d0d15] shadow-[0_0_8px_rgba(255,70,37,0.5)]" />
                )}
            </Button>

            <Button variant="ghost" size="icon" className="size-9 rounded-lg hover:bg-secondary/10 hover:text-secondary group border-none">
              <Settings className="size-4 text-muted-foreground group-hover:text-secondary group-hover:rotate-45 transition-transform" />
            </Button>
        </div>

        <Separator orientation="vertical" className="h-5 bg-white/[0.06] hidden sm:block" />
        
        <div className="flex items-center gap-3 pl-1">
            <div className="size-9 rounded-xl bg-gradient-to-br from-primary/40 to-secondary/40 border border-white/10 flex items-center justify-center font-display font-black text-[10px] text-white shadow-lg uppercase">
                OPS
            </div>
            <div className="hidden sm:flex flex-col">
                <span className="text-[10px] font-black uppercase tracking-widest leading-none text-white">
                  <Translate text="Field Agent" />
                </span>
                <span className="text-[8px] font-bold text-muted-foreground uppercase tracking-widest mt-1 opacity-60">
                  <Translate text="Driver Profile" />
                </span>
            </div>
        </div>
      </div>
    </header>
  );
}
