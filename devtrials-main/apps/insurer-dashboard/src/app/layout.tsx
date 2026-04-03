import type { Metadata } from "next";
import { Inter, Nunito, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

const inter = Inter({ variable: "--font-sans", subsets: ["latin"] });
const jetbrainsMono = JetBrains_Mono({ variable: "--font-mono", subsets: ["latin"] });
const nunito = Nunito({ weight: ["400", "700", "900"], variable: "--font-display", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ShieldGuard | Insurer Operations Protocol",
  description: "Advanced parametric insurance operations, liquidity management, and risk intelligence for ShieldLife General Insurance.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={cn(inter.variable, jetbrainsMono.variable, nunito.variable, "dark", "scroll-smooth")}>
      <body className="antialiased min-h-screen bg-background text-foreground font-sans selection:bg-primary/30">
        {children}
      </body>
    </html>
  );
}
