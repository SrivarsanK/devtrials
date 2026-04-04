"use client";

import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { BottomNav } from "@/components/BottomNav";
import { AppSidebar } from "@/components/AppSidebar";
import { SidebarProvider, SidebarInset } from "./ui/sidebar";
import { cn } from "../lib/utils";

interface ResponsiveContainerProps {
  children: React.ReactNode;
}

export function ResponsiveContainer({ children }: ResponsiveContainerProps) {
  const pathname = usePathname();
  const isLandingPage = pathname === "/";
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (isLandingPage) {
    return (
      <div className="min-h-dvh bg-background selection:bg-primary selection:text-white">
        {children}
      </div>
    );
  }

  // Use SidebarProvider only on non-landing pages for the full Station experience
  return (
    <SidebarProvider defaultOpen={true}>
      <div className="min-h-svh bg-background flex w-full overflow-hidden">
        <AppSidebar />
        
        <SidebarInset className="relative flex flex-col min-w-0 flex-1 overflow-x-hidden">
          <main 
            className={cn(
              "flex-1 relative transition-all duration-500 w-full p-4 md:p-8",
              "pb-20 md:pb-8" // Extra padding for mobile bottom nav
            )}
          >
            {children}
          </main>
          
          {/* Keep bottom nav for mobile worker specific ease of access */}
          <div className="md:hidden">
            <BottomNav />
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}

