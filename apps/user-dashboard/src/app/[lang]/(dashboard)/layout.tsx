"use client";

import React from "react";
import { SidebarProvider, SidebarInset, useSidebar } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { AppHeader } from "@/components/app-header";
import { useUser } from "@clerk/nextjs";
import { Loader2, LayoutDashboard, ShieldCheck, Map as MapIcon, Settings as SettingsIcon, FileText, Sparkles } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Translate } from "@/components/ui/translate";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { useIsMobile } from "@/hooks/use-mobile";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { isLoaded } = useUser();

  if (!isLoaded) {
    return (
      <div className="h-screen w-full bg-background flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-primary/30" />
      </div>
    );
  }

  return (
    <SidebarProvider defaultOpen={true}>
      <AppSidebar />
      <SidebarInset className="bg-background flex flex-col relative transition-all duration-500 ease-in-out min-h-svh">
        <AppHeader />
        
        {/* AMBIENCE - Premium Glows */}
        <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
          <div className="absolute top-[-10%] right-[-10%] w-[60%] h-[60%] bg-primary/[0.05] blur-[150px] rounded-full animate-glow-pulse" />
          <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-secondary/[0.03] blur-[150px] rounded-full animate-glow-pulse" style={{ animationDelay: '2s' }} />
        </div>

        <main className="flex-1 w-full pt-6 pb-24 lg:pb-12 scroll-smooth">
          <div className="container mx-auto px-4 md:px-6 max-w-7xl">
             {children}
          </div>
        </main>
        
        <BottomNav />
      </SidebarInset>
    </SidebarProvider>
  );
}

function BottomNav() {
  const pathname = usePathname();
  const isMobile = useIsMobile();
  const { language } = useLanguage();
  
  if (!isMobile) return null;

  const navItems = [
    { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
    { title: "Zones", url: "/zones", icon: ShieldCheck },
    { title: "Claims", url: "/claims", icon: FileText },
    { title: "History", url: "/history", icon: Sparkles },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[100] h-16 glass-strong border-t border-white/[0.08] flex items-center justify-around px-4 animate-in slide-in-from-bottom duration-500">
      {navItems.map((item) => {
        const localizedUrl = `/${language}${item.url}`;
        const isActive = pathname === localizedUrl;
        return (
          <Link key={item.title} href={localizedUrl} className="flex flex-col items-center gap-1 group">
            <div className={cn(
              "p-2 rounded-xl transition-all duration-300",
              isActive ? "bg-primary/10 text-primary scale-110 shadow-[0_0_10px_rgba(255,70,37,0.2)]" : "text-muted-foreground"
            )}>
              <item.icon className="size-5" strokeWidth={isActive ? 2.5 : 2} />
            </div>
            <span className={cn(
              "text-[8px] font-black uppercase tracking-widest transition-all",
              isActive ? "text-primary opacity-100" : "text-muted-foreground opacity-40 group-hover:opacity-100"
            )}>
              <Translate text={item.title} />
            </span>
          </Link>
        );
      })}
    </div>
  );
}

