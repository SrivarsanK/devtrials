"use client";

import * as React from "react";
import {
  LayoutDashboard,
  Home,
  ShieldCheck,
  Activity,
  CreditCard,
  History,
  Settings,
  Globe
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
  SidebarRail,
} from "./ui/sidebar";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "../lib/utils";
import { useLanguage } from "./LanguageContext";
import anime from "animejs";

const data = {
  navMain: [
    { label: "Home", url: "/dashboard", icon: Home },
    { label: "Plans", url: "/plan", icon: ShieldCheck },
    { label: "UPI Setup", url: "/upi", icon: CreditCard },
    { label: "Claims", url: "/claims", icon: History },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname();
  const { lang, toggleLang, t } = useLanguage();
  const [isOnline, setIsOnline] = React.useState(true);

  React.useEffect(() => {
    // Initial entrance animations
    const tl = anime.timeline({
      easing: 'easeOutExpo',
      duration: 800
    });

    tl.add({
      targets: '.anime-sidebar-item',
      translateX: [-20, 0],
      opacity: [0, 1],
      delay: anime.stagger(60),
    })
    .add({
      targets: '.anime-logo',
      scale: [0.8, 1],
      opacity: [0, 1],
      rotate: '5deg',
      duration: 1000,
      easing: 'spring(1, 80, 10, 0)'
    }, '-=600');
  }, []);

  return (
    <Sidebar collapsible="offcanvas" className="border-r border-white/[0.06] bg-[#0d0d0d]/80 backdrop-blur-2xl transition-all duration-300" {...props}>
      <SidebarHeader className="p-4 group-data-[collapsible=icon]:p-2 group-data-[collapsible=icon]:items-center transition-all duration-300">
        <Link href="/" className="flex items-center gap-3 group group-data-[collapsible=icon]:justify-center">
          <div className="flex aspect-square size-10 items-center justify-center shrink-0 rounded-xl bg-primary shadow-[0_0_15px_rgba(255,70,37,0.3)] group-hover:rotate-6 transition-all duration-300 anime-logo opacity-0">
            <ShieldCheck className="size-6 text-white" strokeWidth={2.5} />
          </div>
          <div className="flex flex-col gap-0 leading-tight group-data-[collapsible=icon]:hidden animate-in fade-in slide-in-from-left-2 duration-300">
            <span className="text-2xl font-freeroad-black tracking-tighter text-foreground whitespace-nowrap uppercase">Gig<span className="text-primary italic">Shield</span></span>
            <span className="text-[8px] font-black tracking-[0.2em] text-muted-foreground uppercase opacity-60 whitespace-nowrap">Worker Station</span>
          </div>
        </Link>
      </SidebarHeader>

      <SidebarContent className="py-4 overflow-x-hidden group-data-[collapsible=icon]:items-center">
        <SidebarGroup className="px-3 group-data-[collapsible=icon]:px-0 w-full transition-all">
          <SidebarMenu className="gap-1 group-data-[collapsible=icon]:items-center">
            {data.navMain.map((item) => {
              const isActive = pathname === item.url;
              return (
                <SidebarMenuItem key={item.label} className="anime-sidebar-item opacity-0">
                  <SidebarMenuButton
                    render={<Link href={item.url} />}
                    isActive={isActive}
                    tooltip={t(item.label)}
                    className={cn(
                      "h-11 px-3 transition-all duration-300 rounded-lg group-data-[collapsible=icon]:px-0 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:size-11 group-data-[collapsible=icon]:mx-auto border-none",
                      isActive
                        ? "bg-white/[0.05] text-primary font-black shadow-[inset_0_0_10px_rgba(255,255,255,0.02)]"
                        : "hover:bg-white/[0.03] text-muted-foreground"
                    )}
                  >
                    <div className="flex items-center justify-between w-full min-w-0 group-data-[collapsible=icon]:justify-center">
                      <div className="flex items-center gap-3">
                        <item.icon className={cn("size-5 shrink-0 transition-all duration-300", isActive ? "text-primary drop-shadow-[0_0_8px_rgba(255,70,37,0.4)]" : "text-muted-foreground")} strokeWidth={isActive ? 2.5 : 2} />
                        <span className={cn("text-sm font-black truncate group-data-[collapsible=icon]:hidden uppercase tracking-wider", isActive ? "text-foreground" : "text-muted-foreground")}>
                          {t(item.label)}
                        </span>
                      </div>
                      {isActive && (
                        <div className="flex items-center group-data-[collapsible=icon]:hidden translate-x-1">
                          <div className="h-5 w-1 rounded-full bg-primary shadow-[0_0_10px_rgba(255,70,37,0.5)]" />
                        </div>
                      )}
                    </div>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4 flex flex-col gap-4 group-data-[collapsible=icon]:p-2 group-data-[collapsible=icon]:items-center transition-all duration-300">
        {/* Language Toggle */}
        <button 
          onClick={toggleLang}
          className="w-full flex items-center justify-between px-3 py-2 rounded-lg glass-subtle hover:bg-white/[0.05] transition-all group group-data-[collapsible=icon]:hidden"
        >
          <div className="flex items-center gap-2">
            <Globe className="size-3.5 text-secondary group-hover:rotate-12 transition-transform duration-500" />
            <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">Lang</span>
          </div>
          <span className="text-[9px] font-black uppercase tracking-widest text-white">
            {lang === 'en' ? 'EN' : 'TA'}
          </span>
        </button>

        {/* Health Stats */}
        <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.04] transition-all duration-500 group-data-[collapsible=icon]:p-2 group-data-[collapsible=icon]:rounded-lg group-data-[collapsible=icon]:size-8 group-data-[collapsible=icon]:flex group-data-[collapsible=icon]:items-center group-data-[collapsible=icon]:justify-center">
          <div className="flex items-center gap-2.5 mb-1 group-data-[collapsible=icon]:mb-0">
            <div className={cn(
              "size-2 rounded-full animate-pulse transition-colors duration-500 shrink-0",
              isOnline ? "bg-success neon-success" : "bg-destructive shadow-[0_0_12px_rgba(255,45,85,1)]"
            )} />
            <span className="text-[9px] font-black uppercase tracking-[0.12em] text-foreground group-data-[collapsible=icon]:hidden">
              {isOnline ? "Live Monitoring" : "System Offline"}
            </span>
          </div>
          <p className="text-[8px] text-muted-foreground leading-tight opacity-60 group-data-[collapsible=icon]:hidden">
            Oracle v4.2 active. Satellite trigger link stabilized.
          </p>
        </div>

        {/* User Branding */}
        <div className="flex items-center gap-3 px-1 group-data-[collapsible=icon]:hidden">
          <div className="size-8 rounded-full bg-white/[0.05] border border-white/[0.1] flex items-center justify-center shrink-0">
            <Settings className="size-4 text-muted-foreground" />
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-[11px] font-black text-foreground truncate">Ravi Kumar</span>
            <span className="text-[8px] text-muted-foreground uppercase font-black tracking-tighter">Swiggy • Partner</span>
          </div>
        </div>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}

