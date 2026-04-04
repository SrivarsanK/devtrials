"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Home, 
  ShieldCheck, 
  CreditCard, 
  History, 
  Settings, 
  Activity,
  Globe
} from "lucide-react";
import { useLanguage } from "./LanguageContext";
import { cn } from "../lib/utils";

const navItems = [
  { label: "Home", href: "/dashboard", icon: Home },
  { label: "Plans", href: "/plan", icon: ShieldCheck },
  { label: "UPI Setup", href: "/upi", icon: CreditCard },
  { label: "Claims", href: "/claims", icon: History },
];

export function DesktopSidebar() {
  const pathname = usePathname();
  const { lang, toggleLang, t } = useLanguage();

  return (
    <aside className="w-72 h-dvh sticky top-0 bg-surface/80 backdrop-blur-2xl border-r border-white/[0.06] flex flex-col p-6 z-40 overflow-hidden">
      {/* Logo */}
      <div className="flex items-center gap-3 mb-12">
        <div className="size-10 rounded-xl bg-primary flex items-center justify-center shadow-[0_0_15px_rgba(255,159,74,0.3)]">
          <ShieldCheck className="size-6 text-white" strokeWidth={2.5} />
        </div>
        <div className="flex flex-col">
          <span className="text-2xl font-freeroad-black tracking-tighter uppercase leading-none">
            Gig<span className="text-primary italic">Shield</span>
          </span>
          <span className="text-[8px] font-black tracking-[0.2em] text-muted-foreground uppercase opacity-60">
            Worker Station
          </span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link 
              key={item.href} 
              href={item.href}
              className={cn(
                "flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all duration-300 group relative",
                isActive 
                  ? "bg-white/[0.05] text-primary" 
                  : "hover:bg-white/[0.03] text-muted-foreground hover:text-foreground"
              )}
            >
              <item.icon className={cn(
                "size-5 transition-transform duration-500 group-hover:scale-110",
                isActive ? "text-primary drop-shadow-[0_0_8px_rgba(255,159,74,0.4)]" : "text-muted-foreground"
              )} />
              <span className={cn(isActive ? "font-black" : "font-medium", "text-sm uppercase tracking-wider")}>
                {t(item.label)}
              </span>
              {isActive && (
                <div className="absolute left-0 w-1 h-6 bg-primary rounded-r-full shadow-[0_0_10px_rgba(255,159,74,1)]" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer Controls */}
      <div className="space-y-4 pt-6 border-t border-white/[0.06]">
        {/* Language Toggle */}
        <button 
          onClick={toggleLang}
          className="w-full flex items-center justify-between px-4 py-3 rounded-xl glass-subtle hover:bg-white/[0.05] transition-all group"
        >
          <div className="flex items-center gap-3">
            <Globe className="size-4 text-secondary group-hover:rotate-12 transition-transform duration-500" />
            <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Language</span>
          </div>
          <span className="text-[10px] font-black uppercase tracking-widest text-white">
            {lang === 'en' ? 'English' : 'தமிழ்'}
          </span>
        </button>

        {/* Health Stats */}
        <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.04]">
          <div className="flex items-center gap-2 mb-2">
            <div className="size-1.5 rounded-full bg-success neon-success animate-pulse" />
            <span className="text-[9px] font-black uppercase tracking-tighter text-foreground/80">System Operational</span>
          </div>
          <p className="text-[9px] text-muted-foreground leading-tight">
            Oracle v4.2 active. Satellite trigger link stabilized.
          </p>
        </div>

        {/* User / Settings Placeholder */}
        <div className="flex items-center gap-3 px-2">
          <div className="size-10 rounded-full bg-white/[0.05] border border-white/[0.1] flex items-center justify-center">
            <Settings className="size-5 text-muted-foreground" />
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-black text-foreground truncate max-w-[120px]">Ravi Kumar</span>
            <span className="text-[9px] text-muted-foreground uppercase font-black">Partner: Swiggy</span>
          </div>
        </div>
      </div>
    </aside>
  );
}

