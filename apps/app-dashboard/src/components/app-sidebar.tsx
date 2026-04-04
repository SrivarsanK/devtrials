"use client";

import * as React from "react";
import {
  LayoutDashboard,
  Home,
  ShieldCheck,
  Activity,
  Sparkles,
  Map as MapIcon
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
import { getGlobalReserves as fetchHealth } from "@/services/api";
import { createTimeline, stagger } from "animejs";

const data = {
  navMain: [
    {
      title: "Overview",
      url: "/",
      icon: Home,
    },
    {
      title: "Operations",
      url: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      title: "Trigger Stream",
      url: "/triggers",
      icon: Activity,
    },
    {
      title: "Regional Hubs",
      url: "/zones",
      icon: ShieldCheck,
    },
    {
      title: "Live Risk Map",
      url: "/dashboard/risk-map",
      icon: MapIcon,
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
        const status = await fetchHealth();
        setIsOnline(!!status);
      } catch (e) {
        setIsOnline(false);
      }
    };

    checkLiveStatus();
    const interval = setInterval(checkLiveStatus, 5000); // Check every 5s

    // Animations using Anime.js v4 API
    const tl = createTimeline({
      defaults: {
        ease: 'easeOutExpo',
        duration: 800
      }
    });

    tl.add('.anime-sidebar-item', {
      translateX: [-20, 0],
      opacity: [0, 1],
      delay: stagger(60),
    })
    .add('.anime-logo', {
      scale: [0.8, 1],
      opacity: [0, 1],
      rotate: '5deg',
      duration: 1000,
      ease: 'spring(1, 80, 10, 0)'
    }, '-=600');

    return () => clearInterval(interval);
  }, []);

  return (
    <Sidebar collapsible="offcanvas" className="border-r border-white/[0.06] bg-[#0d0d15]/80 backdrop-blur-2xl transition-all duration-300" {...props}>
      <SidebarHeader className="p-4 group-data-[collapsible=icon]:p-2 group-data-[collapsible=icon]:items-center transition-all duration-300">
        <Link href="/" className="flex items-center gap-3 group group-data-[collapsible=icon]:justify-center">
          <div className="flex aspect-square size-10 items-center justify-center shrink-0 rounded-xl bg-primary shadow-[0_0_15px_rgba(255,70,37,0.3)] group-hover:rotate-6 transition-all duration-300 anime-logo opacity-0">
            <ShieldCheck className="size-6 text-white" strokeWidth={2.5} />
          </div>
          <div className="flex flex-col gap-0 leading-tight group-data-[collapsible=icon]:hidden animate-in fade-in slide-in-from-left-2 duration-300">
            <span className="text-2xl font-display font-black tracking-tight text-foreground whitespace-nowrap uppercase">Ride<span className="text-primary italic">Suraksha</span></span>
            <span className="text-[8px] font-bold tracking-[0.2em] text-muted-foreground uppercase opacity-60 whitespace-nowrap">Parametric Oracle</span>
          </div>
        </Link>
      </SidebarHeader>

      <SidebarContent className="py-4 overflow-x-hidden group-data-[collapsible=icon]:items-center">
        <SidebarGroup className="px-3 group-data-[collapsible=icon]:px-0 w-full transition-all">
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
                        <span className={cn("text-sm font-bold truncate group-data-[collapsible=icon]:hidden uppercase", isActive ? "text-foreground" : "text-muted-foreground")}>
                          {item.title}
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
            <span className="text-[9px] font-bold uppercase tracking-[0.12em] text-foreground group-data-[collapsible=icon]:hidden">
              {isOnline ? "Live Monitoring" : "System Offline"}
            </span>
          </div>
          <p className="text-[8px] text-muted-foreground leading-tight opacity-60 group-data-[collapsible=icon]:hidden">
            {isOnline 
              ? "Oracle synchronized. Sensor fusion active." 
              : "Connection lost. Re-establishing link..."}
          </p>
        </div>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
