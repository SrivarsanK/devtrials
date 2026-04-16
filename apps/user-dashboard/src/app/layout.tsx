import type { Metadata, Viewport } from "next";
import { Inter, Nunito, JetBrains_Mono, Manrope } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import { LanguageProvider } from "@/contexts/LanguageContext";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });
const jetbrainsMono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono" });
const nunito = Nunito({ weight: ["400", "700", "900"], variable: "--font-display", subsets: ["latin"] });
const manrope = Manrope({ subsets: ["latin"], variable: "--font-manrope-var", weight: ["400", "500", "600", "700", "800"] });

export const metadata: Metadata = {
  title: "RideSuraksha | Your income. Protected. Automatically.",
  description: "Advanced income protection for India's gig economy workers.",
  manifest: "/manifest.json",
  icons: {
    icon: "/icon.svg",
    apple: "/icon.svg",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "RideSuraksha",
  },
};

export const viewport: Viewport = {
  themeColor: "#0d0d0d",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider
      signInUrl="/sign-in"
      signUpUrl="/sign-up"
      signInFallbackRedirectUrl="/onboarding"
      signUpFallbackRedirectUrl="/onboarding"
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
          footer: "hidden",
          footerPortion: "hidden",
          devModeBadge: "hidden",
          internal: "hidden",
        }
      }}
    >
      <html
        lang="en"
        className={`${inter.variable} ${nunito.variable} ${jetbrainsMono.variable} ${manrope.variable} h-full antialiased dark scroll-smooth`}
      >
        <body className="min-h-full flex flex-col font-sans bg-background text-foreground selection:bg-primary/30">
          <LanguageProvider>
            {children}
          </LanguageProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
