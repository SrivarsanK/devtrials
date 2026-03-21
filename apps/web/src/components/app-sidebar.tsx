"use client";

import * as React from "react";
import {
  LayoutDashboard,
  Home,
  ShieldCheck,
  Activity
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

const data = {
  navMain: [
    {
      title: "Home",
      url: "/",
      icon: Home,
    },
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      title: "Triggers",
      url: "/triggers",
      icon: Activity,
    },
    {
      title: "Monitored Zones",
      url: "/zones",
      icon: LayoutDashboard,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname();

  return (
    <Sidebar collapsible="icon" className="border-r border-border bg-card/60 backdrop-blur-md transition-all duration-300" {...props}>
      <SidebarHeader className="p-4 group-data-[collapsible=icon]:p-2 group-data-[collapsible=icon]:items-center transition-all duration-300">
        <Link href="/" className="flex items-center gap-3 group group-data-[collapsible=icon]:justify-center">
          <div className="flex aspect-square size-9 items-center justify-center shrink-0 rounded-xl bg-gradient-to-br from-primary to-[#ff8c00] shadow-lg shadow-primary/20 group-hover:scale-110 transition-transform duration-300">
            <ShieldCheck className="size-5 text-white" strokeWidth={2.5} />
          </div>
          <div className="flex flex-col gap-0 leading-none group-data-[collapsible=icon]:hidden animate-in fade-in slide-in-from-left-2 duration-300">
            <span className="text-3xl font-bebas tracking-wide text-foreground whitespace-nowrap">Gig<span className="text-primary">Shield</span></span>
            <span className="text-[10px] font-medium tracking-widest text-muted-foreground uppercase opacity-70 whitespace-nowrap mt-1">Parametric Protection</span>
          </div>
        </Link>
      </SidebarHeader>
      
      <SidebarContent className="py-6 overflow-x-hidden group-data-[collapsible=icon]:items-center">
        <SidebarGroup className="px-3 group-data-[collapsible=icon]:px-0 w-full transition-all">
          <SidebarMenu className="gap-1.5 group-data-[collapsible=icon]:items-center">
            {data.navMain.map((item) => {
              const isActive = pathname === item.url;
              return (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    render={<Link href={item.url} />}
                    isActive={isActive}
                    tooltip={item.title}
                    className={cn(
                      "h-11 px-3 transition-all duration-300 rounded-lg group-data-[collapsible=icon]:px-0 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:size-10 group-data-[collapsible=icon]:mx-auto",
                      isActive 
                        ? "bg-primary/10 text-primary font-bold border border-primary/20 shadow-[0_0_15px_-5px_var(--primary)]" 
                        : "hover:bg-foreground/5 font-semibold text-muted-foreground"
                    )}
                  >
                    <div className="flex items-center justify-between w-full min-w-0 group-data-[collapsible=icon]:justify-center">
                      <div className="flex items-center gap-3 group-data-[collapsible=icon]:gap-0">
                        <item.icon className={cn("size-5 shrink-0 transition-all duration-300 group-hover:scale-110", isActive ? "text-primary drop-shadow-[0_0_3px_var(--primary)]" : "text-muted-foreground")} strokeWidth={isActive ? 2.5 : 2} />
                        <span className="text-sm font-bold truncate group-data-[collapsible=icon]:hidden ml-1">
                          {item.title}
                        </span>
                      </div>
                      {isActive && (
                        <div className="flex items-center group-data-[collapsible=icon]:hidden">
                          <div className="h-1.5 w-1.5 rounded-full bg-primary shadow-[0_0_8px_var(--primary)] shrink-0" />
                          <div className="absolute right-0 h-8 w-1 bg-primary rounded-l-full shadow-[0_0_8px_var(--primary)]" />
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

      <SidebarFooter className="p-4 group-data-[collapsible=icon]:hidden">
        <div className="p-3 rounded-lg border border-border bg-secondary/20 backdrop-blur-sm relative overflow-hidden group/footer">
          <div className="absolute top-0 right-0 w-2 h-2 bg-primary/20 rounded-bl-lg" />
          <div className="flex items-center gap-3 mb-2">
            <div className="size-2 rounded-full bg-success shadow-[0_0_10px_var(--success)] animate-pulse" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-foreground">Live Monitoring</span>
          </div>
          <p className="text-[9px] text-muted-foreground font-medium leading-tight opacity-70">
            Oracle synchronized. High-precision sensor fusion enabled.
          </p>
        </div>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
