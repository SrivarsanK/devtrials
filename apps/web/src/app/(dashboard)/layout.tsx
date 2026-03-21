"use client";

import { AppHeader } from "@/components/app-header";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider defaultOpen={true}>
      <AppSidebar />
      <SidebarInset className="bg-background flex flex-col overflow-hidden relative">
        <AppHeader />
        <div className="flex-1 overflow-y-auto px-6 py-12 md:px-12 lg:px-20 max-w-[1600px] mx-auto w-full flex flex-col gap-12 animate-in fade-in duration-700">
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
