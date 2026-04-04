"use client";

import { AppHeader } from "@/components/app-header";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { useSidebar } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Home, Activity, Map as MapIcon } from "lucide-react";
import Link from "next/link";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider defaultOpen={true}>
      <DashboardContent>{children}</DashboardContent>
      <BottomNav />
    </SidebarProvider>
  );
}

function BottomNav() {
  const pathname = usePathname();
  const isMobile = useIsMobile();
  
  if (!isMobile) return null;

  const navItems = [
    { title: "Home", url: "/", icon: Home },
    { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
    { title: "Risk Map", url: "/dashboard/risk-map", icon: MapIcon },
    { title: "Triggers", url: "/triggers", icon: Activity },
    { title: "Payout", url: "/payout", icon: ShieldCheck },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[100] h-16 glass-strong border-t border-white/[0.08] flex items-center justify-around px-4 animate-in slide-in-from-bottom duration-500">
      {navItems.map((item) => {
        const isActive = pathname === item.url;
        return (
          <Link key={item.title} href={item.url} className="flex flex-col items-center gap-1 group">
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
              {item.title}
            </span>
          </Link>
        );
      })}
    </div>
  );
}

function DashboardContent({ children }: { children: React.ReactNode }) {
  const { state, isMobile } = useSidebar();
  const isCollapsed = state === "collapsed";

  return (
    <>
      <AppSidebar />
      <SidebarInset className={cn(
        "bg-background flex flex-col overflow-hidden relative transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]",
        "peer-data-[state=expanded]:md:ml-[var(--sidebar-width)] ml-0",
        isMobile ? "ml-0" : ""
      )}>
        <AppHeader />
        <div className={cn(
          "flex-1 overflow-y-auto py-[clamp(2rem,6vh,4rem)] w-full flex flex-col gap-[clamp(2rem,5vh,4rem)] animate-in fade-in duration-1000",
          isMobile ? "pb-24 px-4" : "px-[clamp(1rem,3vw,3rem)]",
          "md:px-[clamp(2rem,5vw,5rem)] lg:px-[clamp(3rem,8vw,8rem)]",
          "max-w-[1920px] mx-auto"
        )}>
          <div className={cn(
            "w-full transition-all duration-500 ease-out",
            (!isCollapsed && !isMobile) ? "scale-[0.98] origin-left opacity-90" : "scale-100 opacity-100"
          )}>
            {children}
          </div>
        </div>
      </SidebarInset>
    </>
  );
}
