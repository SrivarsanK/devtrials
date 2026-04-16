"use client";

import * as React from "react";
import {
  LayoutDashboard,
  Home,
  ShieldCheck,
  Activity,
  Sparkles,
  Map as MapIcon,
  FileText
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
} from "@/components/ui/sidebar";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { TriggerService as ApiService } from "@/lib/api";
import anime from "animejs";
import { Translate } from "@/components/ui/translate";

const data = {
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      title: "Claims",
      url: "/claims",
      icon: FileText,
    },
    {
      title: "Payout History",
      url: "/history",
      icon: Sparkles, // Or another appropriate icon
    },
  ],
};

const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK === 'true';

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname();

  const [isOnline, setIsOnline] = React.useState(true);

  React.useEffect(() => {
    // Health polling
    const checkLiveStatus = async () => {
      if (USE_MOCK) {
        setIsOnline(true);
        return;
      }
      try {
        const status = await ApiService.getZones();
        setIsOnline(!!status && status.length > 0);
      } catch (e) {
        setIsOnline(false);
      }
    };

    checkLiveStatus();
    const interval = setInterval(checkLiveStatus, 5000); // Check every 5s

    // Animations using Anime.js v3 API
    const tl = anime.timeline({
      defaults: {
        ease: 'easeOutExpo',
        duration: 800
      }
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

    return () => clearInterval(interval);
  }, []);

  return (
    <Sidebar collapsible="offcanvas" className="border-r border-white/[0.06] bg-[#0d0d15]/80 backdrop-blur-2xl transition-all duration-300" {...props}>
      <SidebarHeader className="px-5 py-6 group-data-[collapsible=icon]:p-2 group-data-[collapsible=icon]:items-center transition-all duration-300">
        <Link href="/" className="flex items-center gap-2.5 group group-data-[collapsible=icon]:justify-center">
          <div className="flex aspect-square size-10 items-center justify-center shrink-0 rounded-xl bg-primary shadow-[0_0_15px_rgba(255,70,37,0.3)] group-hover:rotate-6 group-hover:scale-105 transition-all duration-300 anime-logo opacity-0">
            <ShieldCheck className="size-6 text-white" strokeWidth={2.5} />
          </div>
          <div className="flex flex-col gap-0 leading-tight group-data-[collapsible=icon]:hidden animate-in fade-in slide-in-from-left-2 duration-300 min-w-0">
            <span className="text-xl sm:text-2xl font-display font-black tracking-tighter text-white whitespace-nowrap uppercase">Ride<span className="text-primary italic">Suraksha</span></span>
            <span className="text-[7px] font-bold tracking-[0.3em] text-muted-foreground uppercase opacity-60 whitespace-nowrap"><Translate text="Driver Protocol" /></span>
          </div>
        </Link>
      </SidebarHeader>

      <SidebarContent className="py-2 overflow-x-hidden group-data-[collapsible=icon]:items-center">
        <SidebarGroup className="px-3 group-data-[collapsible=icon]:px-0 w-full transition-all">
          <p className="text-[9px] font-black uppercase tracking-[0.4em] text-white/20 px-4 mb-4 italic leading-none opacity-50 group-data-[collapsible=icon]:hidden">
            <Translate text="Navigation Terminal" />
          </p>
          <SidebarMenu className="gap-1 group-data-[collapsible=icon]:items-center">
            {data.navMain.map((item) => {
              const isActive = pathname === item.url;
              return (
                <SidebarMenuItem key={item.title} className="anime-sidebar-item opacity-0">
                  <SidebarMenuButton
                    render={<Link href={item.url} />}
                    isActive={isActive}
                    tooltip={item.title}
                    className={cn(
                      "h-11 px-3 transition-all duration-300 rounded-lg group-data-[collapsible=icon]:px-0 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:size-11 group-data-[collapsible=icon]:mx-auto border-none",
                      isActive
                        ? "bg-white/[0.05] text-primary font-bold shadow-[inset_0_0_10px_rgba(255,255,255,0.02)]"
                        : "hover:bg-white/[0.03] text-muted-foreground"
                    )}
                  >
                    <div className="flex items-center justify-between w-full min-w-0 group-data-[collapsible=icon]:justify-center">
                      <div className="flex items-center gap-3">
                        <item.icon className={cn("size-5 shrink-0 transition-all duration-300", isActive ? "text-primary drop-shadow-[0_0_8px_rgba(255,70,37,0.4)]" : "text-muted-foreground")} strokeWidth={isActive ? 2.5 : 2} />
                        <span className={cn("text-sm font-bold truncate group-data-[collapsible=icon]:hidden uppercase", isActive ? "text-white" : "text-muted-foreground")}>
                          <Translate text={item.title} />
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

      <SidebarFooter className="p-4 group-data-[collapsible=icon]:p-2 group-data-[collapsible=icon]:items-center transition-all duration-300">
        <div className="p-3 rounded-xl glass relative overflow-hidden transition-all duration-500 group-data-[collapsible=icon]:p-2 group-data-[collapsible=icon]:rounded-lg group-data-[collapsible=icon]:size-8 group-data-[collapsible=icon]:flex group-data-[collapsible=icon]:items-center group-data-[collapsible=icon]:justify-center">
          <div className="flex items-center gap-2.5 mb-1.5 group-data-[collapsible=icon]:mb-0">
            <div className={cn(
              "size-2 rounded-full animate-pulse transition-colors duration-500 shrink-0",
              isOnline ? "bg-success neon-success" : "bg-destructive shadow-[0_0_12px_rgba(255,45,85,1)]"
            )} />
            <span className="text-[9px] font-bold uppercase tracking-[0.12em] text-white group-data-[collapsible=icon]:hidden">
              <Translate text={isOnline ? "Live Monitoring" : "System Offline"} />
            </span>
          </div>
          <p className="text-[8px] text-muted-foreground leading-tight opacity-60 group-data-[collapsible=icon]:hidden">
            <Translate text={isOnline ? "Oracle synchronized. Sensor fusion active." : "Connection lost. Re-establishing link..."} />
          </p>
        </div>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
