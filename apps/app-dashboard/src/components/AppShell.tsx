"use client";

import { usePathname } from "next/navigation";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { AppHeader } from "@/components/app-header";

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLanding = pathname === "/";

  if (isLanding) {
    return <>{children}</>;
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="flex flex-col bg-background relative overflow-hidden min-h-screen">
        {/* Global background glow */}
        <div className="fixed inset-0 pointer-events-none z-0 opacity-20">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(#ffffff05_1px,transparent_1px)] [background-size:32px_32px]" />
          <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-[120px] animate-glow-pulse" />
          <div className="absolute top-[20%] -right-[10%] w-[30%] h-[30%] bg-secondary/10 rounded-full blur-[100px] animate-glow-pulse" style={{ animationDelay: '1s' }} />
        </div>
        
        <AppHeader />
        <main className="flex-1 relative z-10 w-full">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
