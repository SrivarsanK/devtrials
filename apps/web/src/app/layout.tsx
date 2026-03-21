import type { Metadata } from "next";
import { Inter, Nunito, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ClerkProvider } from "@clerk/nextjs";
import { dark } from "@clerk/themes";

const inter = Inter({ variable: "--font-sans", subsets: ["latin"] });
const jetbrainsMono = JetBrains_Mono({ variable: "--font-mono", subsets: ["latin"] });
const nunito = Nunito({ weight: ["400", "700", "900"], variable: "--font-display", subsets: ["latin"] });

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
    <ClerkProvider
      appearance={{
        baseTheme: dark,
        variables: {
          colorPrimary: "#ff4625",
          colorBackground: "#0a0a12",
          colorInputBackground: "rgba(255, 255, 255, 0.03)",
          colorInputText: "#ffffff",
          colorText: "#ffffff",
          colorTextSecondary: "#cbd5e1",
        },
        elements: {
          card: "rounded-[2.5rem] border border-white/5 shadow-2xl glass-strong anime-auth-card",
          formButtonPrimary: "bg-primary hover:bg-primary/90 rounded-2xl h-12 uppercase tracking-widest font-black transition-all border-none shadow-[0_10px_20px_rgba(255,70,37,0.2)]",
          headerTitle: "font-display font-black tracking-tighter text-3xl uppercase text-white",
          headerSubtitle: "text-slate-400 font-medium",
          socialButtonsBlockButton: "rounded-2xl border border-white/5 bg-white/5 hover:bg-white/10 transition-colors h-12 text-white font-bold",
          formFieldLabel: "text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2",
          formFieldInput: "rounded-2xl border-white/5 bg-white/[0.03] h-12 px-4 transition-all focus:bg-white/[0.06] focus:border-primary/30 text-white",
          footerActionText: "text-slate-400 font-medium",
          footerActionLink: "text-primary hover:text-primary/80 font-bold transition-colors",
          identityPreviewText: "text-white font-bold",
          identityPreviewEditButton: "text-primary font-bold",
          badge: "bg-white/10 text-slate-300 font-bold border border-white/10 px-2 py-0.5 rounded-full text-[10px]",
          footerPortion: "hidden",
          internal: "hidden",
        }
      }}
    >
      <html lang="en" className={cn(inter.variable, jetbrainsMono.variable, nunito.variable, "dark", "scroll-smooth")}>
        <body className="antialiased min-h-screen bg-background text-foreground font-sans selection:bg-primary/30">
          <TooltipProvider>
            {children}
          </TooltipProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
