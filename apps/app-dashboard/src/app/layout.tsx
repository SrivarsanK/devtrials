import type { Metadata } from "next";
import { Inter, JetBrains_Mono, Nunito } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { AppHeader } from "@/components/app-header";
import { AppShell } from "@/components/AppShell";

const inter = Inter({ variable: "--font-sans", subsets: ["latin"] });
const jetbrainsMono = JetBrains_Mono({ variable: "--font-mono", subsets: ["latin"] });
const nunito = Nunito({ weight: ["400", "700", "900"], variable: "--font-display", subsets: ["latin"] });

import { Toaster } from "sonner";

export const metadata: Metadata = {
  title: "RideSuraksha | Insurer Dashboard",
  description: "Real-time parametric insurance operations monitoring — ShieldLife General Insurance",
};

import { SocketProvider } from "@/components/providers/socket-provider";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={cn(inter.variable, jetbrainsMono.variable, nunito.variable, "dark", "scroll-smooth")}>
      <body className="antialiased min-h-screen bg-background text-foreground font-sans selection:bg-primary/30 overflow-x-hidden">
        <TooltipProvider>
          <SocketProvider>
            <AppShell>
              {children}
            </AppShell>
          </SocketProvider>
          <Toaster position="top-right" richColors theme="dark" closeButton />
        </TooltipProvider>
      </body>
    </html>
  );
}
