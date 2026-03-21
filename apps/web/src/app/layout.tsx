import type { Metadata } from "next";
import { Bebas_Neue, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { TooltipProvider } from "@/components/ui/tooltip";

const jetbrainsMono = JetBrains_Mono({ variable: "--font-sans", subsets: ["latin"] });
const bebasNeue = Bebas_Neue({ weight: "400", variable: "--font-bebas", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "GigShield | Parametric Income Insurance",
  description: "Monitor disaster triggers and manage parametric insurance payouts for the gig economy.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={cn(jetbrainsMono.variable, bebasNeue.variable, "font-sans", "dark", "scroll-smooth")}>
      <body className="antialiased min-h-screen bg-background text-foreground font-sans selection:bg-primary/30">
        <TooltipProvider>
          {children}
        </TooltipProvider>
      </body>
    </html>
  );
}
