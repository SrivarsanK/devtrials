import type { Metadata } from "next";
import { Inter, Nunito, Manrope } from "next/font/google";
import { cn } from "@/lib/utils";
import "./globals.css";

/* ─── Font Loading — matches apps/web ─── */
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const nunito = Nunito({
  weight: ["400", "700", "900"],
  variable: "--font-nunito",
  subsets: ["latin"],
  display: "swap",
});

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "GigShield — Parametric Income Insurance for Gig Workers",
  description:
    "GigShield pays you the moment rain, floods or curfew stops your deliveries. No forms. No calls. Just money in your UPI. Starting at ₹79/week.",
  keywords: [
    "gig worker insurance",
    "parametric insurance India",
    "delivery worker protection",
    "Swiggy insurance",
    "Zomato insurance",
    "income protection",
  ],
};

import { LanguageProvider } from "@/contexts/LanguageContext";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={cn(
        inter.variable,
        nunito.variable,
        manrope.variable,
        "dark",
        "scroll-smooth"
      )}
    >
      <body className="antialiased min-h-screen bg-background text-foreground font-sans selection:bg-primary/30">
        <LanguageProvider>
          {children}
        </LanguageProvider>
      </body>
    </html>
  );
}
