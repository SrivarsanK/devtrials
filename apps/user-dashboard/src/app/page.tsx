"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  ShieldCheck,
  CloudRain,
  Eye,
  Banknote,
  Menu,
  X,
  Star,
  ArrowRight,
  ChevronDown,
  ChevronRight,
  Clock,
  Percent,
  Zap,
  Users,
  BadgeIndianRupee,
  Sparkles,
  Globe,
  PlayCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { LanguageProvider, useLanguage } from "@/contexts/LanguageContext";

/* ════════════════════════════════════════════
   TRANSLATIONS
   ════════════════════════════════════════════ */
const content = {
  nav: {
    howItWorks: { en: "How it Works", ta: "எப்படி வேலை செய்கிறது" },
    plans: { en: "Plans", ta: "திட்டங்கள்" },
    getProtected: { en: "Get Protected", ta: "பாதுகாப்பு பெறுங்கள்" },
  },
  hero: {
    badge: { en: "GUIDEWIRE DEVTRAILS 2026", ta: "GUIDEWIRE DEVTRAILS 2026" },
    headlinePart1: { en: "SHIELD THE", ta: "பாதுகாக்கும்" },
    headlinePart2: { en: "DRIVEN.", ta: "சாதகர்களை." },
    subheadline: {
      en: "GigShield pays you the moment rain, floods or curfew stops your deliveries. No forms. No calls. Just money in your UPI.",
      ta: "மழை, வெள்ளம் அல்லது ஊரடங்கால் உங்கள் டெலிவரி நின்றால், GigShield உடனடியாக உங்களுக்கு பணம் செலுத்தும். படிவங்கள் இல்லை. அழைப்புகள் இல்லை. UPI-யில் பணம்.",
    },
    stat1: { en: "11M+ Workers Covered", ta: "11M+ தொழிலாளர்கள் பாதுகாப்பு" },
    stat2: { en: "₹79/wk Starting Premium", ta: "₹79/வாரம் தொடக்க பிரீமியம்" },
    stat3: { en: "2hr Auto Payout", ta: "2 மணி நேர தானியங்கி பணம்" },
    cta: { en: "Get Protected Now", ta: "இப்போது பாதுகாப்பு பெறுங்கள்" },
    secondary: { en: "See how it works", ta: "எப்படி வேலை செய்கிறது பாருங்கள்" },
    protocol: { en: "The Protocol", ta: "நெறிமுறை" },
  },
  howItWorks: {
    label: { en: "HOW IT WORKS", ta: "எப்படி வேலை செய்கிறது" },
    heading: {
      en: "Three steps. Zero paperwork.",
      ta: "மூன்று படிகள். ஆவணங்கள் இல்லை.",
    },
    steps: [
      {
        title: { en: "Sign Up", ta: "பதிவு செய்யுங்கள்" },
        desc: {
          en: "Enter your Partner ID, pick a plan, link your UPI. Under 2 minutes.",
          ta: "உங்கள் பார்ட்னர் ID உள்ளிடுங்கள், ஒரு திட்டத்தைத் தேர்ந்தெடுங்கள், உங்கள் UPI-ஐ இணைக்கவும். 2 நிமிடத்திற்குள்.",
        },
      },
      {
        title: { en: "We Watch", ta: "நாங்கள் கண்காணிக்கிறோம்" },
        desc: {
          en: "Our system monitors rainfall, floods and curfews in your zone 24/7.",
          ta: "எங்கள் அமைப்பு உங்கள் பகுதியில் மழை, வெள்ளம் மற்றும் ஊரடங்கை 24/7 கண்காணிக்கிறது.",
        },
      },
      {
        title: { en: "You Get Paid", ta: "பணம் கிடைக்கும்" },
        desc: {
          en: "Disruption detected → payout sent to your UPI. You do nothing.",
          ta: "இடையூறு கண்டறியப்பட்டது → உங்கள் UPI-க்கு பணம் அனுப்பப்படும். நீங்கள் எதுவும் செய்ய வேண்டாம்.",
        },
      },
    ],
  },
  plans: {
    label: { en: "PLANS", ta: "திட்டங்கள்" },
    heading: {
      en: "Pick the protection that fits you.",
      ta: "உங்களுக்கு பொருத்தமான பாதுகாப்பைத் தேர்ந்தெடுங்கள்.",
    },
    choosePlan: { en: "Choose Plan", ta: "திட்டத்தைத் தேர்ந்தெடுங்கள்" },
    mostPopular: { en: "MOST POPULAR", ta: "மிகவும் பிரபலமானது" },
    items: [
      {
        name: { en: "Guard Lite", ta: "கார்ட் லைட்" },
        price: "₹79",
        period: { en: "/week", ta: "/வாரம்" },
        coverage: "50%",
        payout: { en: "24hr payout", ta: "24 மணி நேர பணம்" },
        benefits: [
          { en: "Rain & flood coverage", ta: "மழை & வெள்ள பாதுகாப்பு" },
          { en: "UPI direct payout", ta: "UPI நேரடி பணம்" },
          { en: "Basic zone monitoring", ta: "அடிப்படை மண்டல கண்காணிப்பு" },
        ],
        popular: false,
      },
      {
        name: { en: "Guard Plus", ta: "கார்ட் பிளஸ்" },
        price: "₹119",
        period: { en: "/week", ta: "/வாரம்" },
        coverage: "70%",
        payout: { en: "12hr payout", ta: "12 மணி நேர பணம்" },
        benefits: [
          {
            en: "Rain, flood & curfew coverage",
            ta: "மழை, வெள்ளம் & ஊரடங்கு பாதுகாப்பு",
          },
          { en: "Priority UPI payout", ta: "முன்னுரிமை UPI பணம்" },
          { en: "Multi-zone monitoring", ta: "பல மண்டல கண்காணிப்பு" },
        ],
        popular: true,
      },
      {
        name: { en: "Guard Max", ta: "கார்ட் மேக்ஸ்" },
        price: "₹159",
        period: { en: "/week", ta: "/வாரம்" },
        coverage: "80%",
        payout: { en: "2hr payout", ta: "2 மணி நேர பணம்" },
        benefits: [
          { en: "All-hazard coverage", ta: "அனைத்து ஆபத்து பாதுகாப்பு" },
          { en: "Instant UPI payout", ta: "உடனடி UPI பணம்" },
          {
            en: "24/7 premium monitoring",
            ta: "24/7 பிரீமியம் கண்காணிப்பு",
          },
        ],
        popular: false,
      },
    ],
  },
  testimonials: {
    label: { en: "STORIES", ta: "கதைகள்" },
    heading: {
      en: "Workers who got paid when it mattered.",
      ta: "தேவையான நேரத்தில் பணம் பெற்ற தொழிலாளர்கள்.",
    },
    items: [
      {
        quote: {
          en: "It rained for 3 days straight. I got ₹8,500 in my UPI before I even checked my phone. GigShield is real.",
          ta: "தொடர்ச்சியாக 3 நாட்கள் மழை பெய்தது. நான் என் போனைப் பார்ப்பதற்கு முன்பே ₹8,500 என் UPI-யில் வந்தது. GigShield உண்மையானது.",
        },
        name: "Ravi K.",
        platform: "Swiggy",
        city: { en: "Chennai", ta: "சென்னை" },
      },
      {
        quote: {
          en: "Floods hit our zone at 6am. By 8am the money was already there. No one called me. Nothing to fill.",
          ta: "காலை 6 மணிக்கு எங்கள் பகுதியில் வெள்ளம். காலை 8 மணிக்கு பணம் ஏற்கனவே வந்துவிட்டது. யாரும் என்னை அழைக்கவில்லை. எதுவும் நிரப்ப வேண்டியதில்லை.",
        },
        name: "Priya S.",
        platform: "Zomato",
        city: { en: "Mumbai", ta: "மும்பை" },
      },
      {
        quote: {
          en: "I was skeptical. Then curfew was announced and ₹3,400 just appeared. Never going back.",
          ta: "நான் சந்தேகமாக இருந்தேன். பின்னர் ஊரடங்கு அறிவிக்கப்பட்டது, ₹3,400 வந்தது. இனி பழையபடி போக மாட்டேன்.",
        },
        name: "Arjun M.",
        platform: "Uber",
        city: { en: "Bengaluru", ta: "பெங்களூரு" },
      },
    ],
  },
  ctaBanner: {
    heading: {
      en: "Every delivery you miss costs money. GigShield gives it back.",
      ta: "நீங்கள் தவறவிடும் ஒவ்வொரு டெலிவரியும் பணம் செலவாகிறது. GigShield அதை திரும்பத் தருகிறது.",
    },
    subtext: {
      en: "Join thousands of delivery workers already protected across India.",
      ta: "இந்தியா முழுவதும் ஏற்கனவே பாதுகாக்கப்பட்ட ஆயிரக்கணக்கான டெலிவரி தொழிலாளர்களுடன் இணையுங்கள்.",
    },
    cta: { en: "Get Protected Now", ta: "இப்போது பாதுகாப்பு பெறுங்கள்" },
    note: {
      en: "Starting at ₹79/week. Cancel anytime.",
      ta: "₹79/வாரம் முதல். எப்போது வேண்டுமானாலும் நிறுத்தலாம்.",
    },
  },
  footer: {
    tagline: {
      en: "Parametric income insurance for India's gig workers.",
      ta: "இந்தியாவின் கிக் தொழிலாளர்களுக்கான பாரமெட்ரிக் வருமான காப்பீடு.",
    },
    builtFor: {
      en: "Built for Guidewire DEVTrails 2026 — Kavach Team",
      ta: "Guidewire DEVTrails 2026 — Kavach அணிக்காக கட்டப்பட்டது",
    },
  },
};

function useIsOnboarded() {
  const [isOnboarded, setIsOnboarded] = useState(false);
  useEffect(() => {
    const onboarded = localStorage.getItem("gigshield_onboarded") === "true";
    setIsOnboarded(onboarded);
  }, []);
  return isOnboarded;
}

/* ════════════════════════════════════════════
   LANDING PAGE
   ════════════════════════════════════════════ */
export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground overflow-x-hidden">
      {/* Ambient background glow — same as apps/web */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-primary/8 rounded-full blur-[150px] animate-glow-pulse" />
        <div
          className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-secondary/6 rounded-full blur-[120px] animate-glow-pulse"
          style={{ animationDelay: "1.5s" }}
        />
      </div>

      <Navbar />
      <main className="flex-1 relative z-10">
        <HeroSection />
        <BannerStrip />
        <HowItWorksSection />
        <PlansSection />
        <TestimonialsSection />
        <StatsSection />
        <CTABannerSection />
      </main>
      <Footer />
    </div>
  );
}

/* ════════════════════════════════════════════
   NAVBAR — same glass-strong style as apps/web
   ════════════════════════════════════════════ */
function Navbar() {
  const { language, setLanguage, t } = useLanguage();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const isOnboarded = useIsOnboarded();

  useEffect(() => {
    const handle = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handle, { passive: true });
    return () => window.removeEventListener("scroll", handle);
  }, []);

  return (
    <nav
      id="navbar"
      className={cn(
        "fixed top-0 left-0 right-0 z-50 h-20 flex items-center px-6 md:px-12 transition-all duration-500",
        scrolled ? "glass-strong shadow-lg shadow-black/20" : "bg-transparent"
      )}
    >
      <div className="max-w-[1400px] mx-auto w-full flex items-center justify-between">
        {/* Logo — same as apps/web */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="size-10 rounded-xl bg-primary flex items-center justify-center shadow-[0_0_15px_rgba(255,70,37,0.3)] rotate-6 group-hover:rotate-0 transition-transform">
            <ShieldCheck className="size-6 text-white" strokeWidth={2.5} />
          </div>
          <div className="flex flex-col gap-0 leading-tight">
            <span className="text-2xl font-display font-black tracking-tight text-foreground whitespace-nowrap uppercase">
              Gig<span className="text-primary italic">Shield</span>
            </span>
            <span className="text-[8px] font-bold tracking-[0.2em] text-muted-foreground uppercase opacity-60 whitespace-nowrap">
              Parametric Oracle
            </span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden lg:flex items-center gap-10">
          {[
            {
              label: t(content.nav.howItWorks.en, content.nav.howItWorks.ta),
              href: "#how-it-works",
            },
            {
              label: t(content.nav.plans.en, content.nav.plans.ta),
              href: "#plans",
            },
          ].map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="text-[11px] font-black uppercase tracking-[0.16em] text-white/50 hover:text-white transition-all duration-300 relative group"
            >
              {item.label}
              <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-gradient-to-r from-primary to-secondary transition-all duration-500 group-hover:w-full" />
            </a>
          ))}

          {/* Language Toggle */}
          <button
            onClick={() => setLanguage(language === "en" ? "ta" : "en")}
            className="text-[11px] font-black uppercase tracking-[0.16em] text-white/50 hover:text-white transition-all duration-300 cursor-pointer"
            aria-label="Toggle language"
          >
            {language === "en" ? "EN / தமிழ்" : "தமிழ் / EN"}
          </button>
        </div>

        {/* Desktop CTA */}
        <div className="hidden lg:flex items-center gap-3">
          <Link href={isOnboarded ? "/dashboard" : "/onboarding"}>
            <button className="rounded-xl glass border border-white/10 px-6 font-bold uppercase text-[11px] h-10 hover:bg-primary hover:text-white hover:border-primary/50 hover:neon-primary transition-all cursor-pointer">
              {isOnboarded 
                ? t("Go to Dashboard", "டேஷ்போர்டுக்குச் செல்லுங்கள்")
                : t(content.nav.getProtected.en, content.nav.getProtected.ta)}
            </button>
          </Link>
        </div>

        {/* Mobile Hamburger */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="lg:hidden text-foreground p-2 cursor-pointer"
          aria-label="Toggle mobile menu"
        >
          {mobileOpen ? (
            <X className="size-6" />
          ) : (
            <Menu className="size-6" />
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="lg:hidden absolute top-20 left-0 right-0 glass-strong animate-fade-in">
          <div className="px-6 py-6 flex flex-col gap-4">
            <a
              href="#how-it-works"
              onClick={() => setMobileOpen(false)}
              className="text-sm font-bold uppercase tracking-wider text-white/60 hover:text-white transition-colors py-2"
            >
              {t(content.nav.howItWorks.en, content.nav.howItWorks.ta)}
            </a>
            <a
              href="#plans"
              onClick={() => setMobileOpen(false)}
              className="text-sm font-bold uppercase tracking-wider text-white/60 hover:text-white transition-colors py-2"
            >
              {t(content.nav.plans.en, content.nav.plans.ta)}
            </a>
            <button
              onClick={() => setLanguage(language === "en" ? "ta" : "en")}
              className="text-sm font-bold uppercase tracking-wider text-white/60 hover:text-white transition-colors py-2 text-left cursor-pointer"
            >
              {language === "en" ? "EN / தமிழ்" : "தமிழ் / EN"}
            </button>
            <Link href={isOnboarded ? "/dashboard" : "/onboarding"} onClick={() => setMobileOpen(false)}>
              <button className="w-full rounded-2xl bg-primary hover:bg-primary/90 text-white font-bold uppercase h-12 text-sm shadow-[0_10px_30px_rgba(255,70,37,0.45)] hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-3 border-none mt-2 cursor-pointer">
                {isOnboarded 
                  ? t("Go to Dashboard", "டேஷ்போர்டுக்குச் செல்லுங்கள்")
                  : t(content.nav.getProtected.en, content.nav.getProtected.ta)}
                <ArrowRight className="size-4" />
              </button>
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}

/* ════════════════════════════════════════════
   HERO — same layout style as apps/web home
   ════════════════════════════════════════════ */
function HeroSection() {
  const { t } = useLanguage();
  const isOnboarded = useIsOnboarded();

  return (
    <section
      id="hero"
      className="relative flex flex-col items-start min-h-screen gap-8 pt-24 pb-12 px-6 md:px-12 max-w-[1400px] mx-auto w-full"
    >
      {/* Background glow behind headline */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-primary/8 rounded-full blur-[200px] animate-glow-pulse pointer-events-none" />

      <div className="w-full lg:w-4/5 relative z-10 flex flex-col items-start text-left pt-12 md:pt-20">
        <div className="space-y-10 w-full">
          {/* Badge */}
          <div className="animate-fade-in-up inline-flex items-center gap-2.5 glass rounded-full px-5 py-2 text-[10px] font-bold uppercase tracking-[0.1em] text-secondary self-start">
            <Sparkles size={14} className="text-secondary animate-pulse" />
            <span>
              {t(content.hero.badge.en, content.hero.badge.ta)}
            </span>
          </div>

          {/* Headline — apps/web style */}
          <div className="animate-fade-in-up delay-100 space-y-6 relative">
            <h1 className="text-5xl sm:text-7xl md:text-8xl lg:text-[110px] font-display font-black tracking-tighter leading-[0.85] text-white uppercase drop-shadow-2xl flex flex-col">
              <span className="relative">
                {t(content.hero.headlinePart1.en, content.hero.headlinePart1.ta)}
              </span>
              <span className="text-primary italic">
                {t(content.hero.headlinePart2.en, content.hero.headlinePart2.ta)}
              </span>
            </h1>
            <div className="h-2 w-48 bg-primary rounded-full shadow-[0_0_20px_rgba(255,70,37,0.6)]" />
          </div>

          {/* Subheadline — same border-l style as apps/web */}
          <p className="animate-fade-in-up delay-200 max-w-xl text-base md:text-lg text-white/70 leading-relaxed border-l-2 border-primary/40 pl-8 py-3 backdrop-blur-sm bg-white/[0.02] rounded-r-2xl">
            {t(content.hero.subheadline.en, content.hero.subheadline.ta)}
          </p>

          {/* Stat pills */}
          <div className="animate-fade-in-up delay-300 flex flex-wrap gap-3 sm:gap-4">
            <StatPill icon={<Users className="size-3.5" />}>
              {t(content.hero.stat1.en, content.hero.stat1.ta)}
            </StatPill>
            <StatPill icon={<BadgeIndianRupee className="size-3.5" />}>
              {t(content.hero.stat2.en, content.hero.stat2.ta)}
            </StatPill>
            <StatPill icon={<Clock className="size-3.5" />}>
              {t(content.hero.stat3.en, content.hero.stat3.ta)}
            </StatPill>
          </div>

          {/* CTA Row — same layout as apps/web */}
          <div className="animate-fade-in-up delay-400 flex flex-row items-center gap-3 md:gap-6 pt-6">
            <Link href={isOnboarded ? "/dashboard" : "/onboarding"} className="flex-1 sm:flex-none">
              <button className="w-full sm:w-auto rounded-xl sm:rounded-2xl bg-primary hover:bg-primary/90 text-white font-bold uppercase h-12 sm:h-16 px-4 sm:px-12 text-[10px] sm:text-sm shadow-[0_10px_30px_rgba(255,70,37,0.45)] hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2 sm:gap-4 border-none cursor-pointer">
                {isOnboarded 
                  ? t("Go to Dashboard", "டேஷ்போர்டுக்குச் செல்லுங்கள்")
                  : t(content.hero.cta.en, content.hero.cta.ta)}
                <ArrowRight className="size-4 sm:size-5" />
              </button>
            </Link>
            <a href="#how-it-works" className="flex-1 sm:flex-none">
              <button className="w-full sm:w-auto rounded-xl sm:rounded-2xl font-bold uppercase h-12 sm:h-16 px-4 sm:px-10 text-[10px] sm:text-sm hover:bg-secondary/10 hover:text-secondary transition-all flex items-center justify-center gap-2 sm:gap-4 group border border-white/5 backdrop-blur-md cursor-pointer text-foreground bg-transparent">
                <div className="size-6 sm:size-10 rounded-full glass flex items-center justify-center group-hover:neon-secondary transition-all shadow-inner">
                  <PlayCircle className="size-4 sm:size-6 text-secondary fill-current" />
                </div>
                {t(content.hero.secondary.en, content.hero.secondary.ta)}
              </button>
            </a>
          </div>
        </div>
      </div>

      {/* Floating tactical card — same as apps/web */}
      <div className="absolute right-6 md:right-12 bottom-24 group hidden lg:block z-20 animate-float">
        <div className="p-8 rounded-[2rem] glass-strong border border-white/10 flex items-center gap-10 shadow-2xl backdrop-blur-3xl">
          <div className="space-y-2">
            <p className="text-[10px] uppercase font-black text-muted-foreground tracking-[0.25em]">
              Payout Velocity
            </p>
            <div className="flex items-center gap-4">
              <p className="text-5xl font-bold text-white tabular-nums font-mono tracking-tighter shrink-0 leading-none">
                0.14s
              </p>
              <div className="px-3 py-1.5 rounded-full bg-success/15 border border-success/20 text-[10px] font-black text-success uppercase neon-success whitespace-nowrap">
                Instant
              </div>
            </div>
          </div>
          <div className="size-16 rounded-[1.25rem] bg-primary/15 flex items-center justify-center border border-primary/20 shrink-0 shadow-[0_0_30px_rgba(255,70,37,0.2)]">
            <ShieldCheck className="size-9 text-primary" />
          </div>
        </div>
      </div>
    </section>
  );
}

function StatPill({
  icon,
  children,
}: {
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-2 px-4 py-2.5 rounded-full glass-subtle text-[11px] sm:text-sm font-semibold text-foreground">
      <span className="text-primary">{icon}</span>
      {children}
    </div>
  );
}

/* ════════════════════════════════════════════
   BANNER STRIP — same as apps/web
   ════════════════════════════════════════════ */
function BannerStrip() {
  const bannerItems = [
    "AQI MONITORING",
    "PRECIPITATION ORACLE",
    "HEATWAVE PROTECTION",
    "SMART CONTRACT PAYOUTS",
  ];

  return (
    <section className="py-8 border-y border-white/5 relative overflow-hidden group max-w-[1400px] mx-auto w-full px-6 md:px-12">
      <div className="absolute inset-0 bg-gradient-to-r from-primary/[0.03] via-transparent to-secondary/[0.03]" />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-y-6 lg:gap-8 relative z-10">
        {bannerItems.map((item, i) => (
          <div
            key={i}
            className="flex items-center justify-center lg:justify-start gap-3 opacity-60 group-hover:opacity-100 transition-all duration-500 py-1 px-2"
          >
            <div className="size-1.5 bg-secondary rounded-full neon-secondary animate-pulse shrink-0" />
            <span className="text-[8px] md:text-[10px] lg:text-[11px] font-black uppercase tracking-[0.15em] lg:tracking-[0.25em] text-white/40 group-hover:text-white/80 transition-colors text-center whitespace-nowrap">
              {item}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════
   HOW IT WORKS — glass-subtle cards like apps/web features
   ════════════════════════════════════════════ */
function HowItWorksSection() {
  const { t } = useLanguage();

  const steps = content.howItWorks.steps;
  const stepIcons = [
    { icon: ShieldCheck, color: "bg-fs-blue" },
    { icon: Eye, color: "bg-fs-purple" },
    { icon: Banknote, color: "bg-fs-yellow" },
  ];

  return (
    <section
      id="how-it-works"
      className="py-20 sm:py-32 max-w-[1400px] mx-auto w-full px-6 md:px-12"
    >
      {/* Header */}
      <div className="text-center mb-16 sm:mb-20">
        <div className="flex items-center justify-center gap-3 text-secondary font-black uppercase tracking-[0.2em] text-[10px] sm:text-[11px] mb-6">
          <Sparkles className="size-4 text-secondary animate-pulse" />
          {t(content.howItWorks.label.en, content.howItWorks.label.ta)}
        </div>
        <h2 className="text-4xl sm:text-5xl md:text-6xl font-display font-black tracking-tight leading-[0.85] uppercase text-foreground">
          {t(content.howItWorks.heading.en, content.howItWorks.heading.ta)}
        </h2>
      </div>

      {/* Step Cards — glass-subtle with card-glow (same as apps/web feature cards) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {steps.map((step, i) => {
          const IconComp = stepIcons[i].icon;
          return (
            <div
              key={i}
              className="group p-8 rounded-3xl glass-subtle card-glow flex flex-col gap-6 hover:translate-y-[-4px] transition-all duration-300"
            >
              <div
                className={cn(
                  "size-16 rounded-2xl flex items-center justify-center shadow-lg transition-transform group-hover:scale-110",
                  stepIcons[i].color
                )}
              >
                <IconComp className="size-8 text-white" strokeWidth={2.5} />
              </div>
              <div className="space-y-3">
                <h3 className="text-3xl font-display font-black tracking-tight text-foreground leading-none uppercase">
                  {t(step.title.en, step.title.ta)}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed font-medium">
                  {t(step.desc.en, step.desc.ta)}
                </p>
              </div>
              <div className="mt-auto pt-4">
                <div className="flex items-center gap-2 text-primary text-[11px] font-bold uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-all group-hover:translate-x-1 duration-500">
                  {i === 0
                    ? "Start Now"
                    : i === 1
                      ? "Learn More"
                      : "View Payouts"}{" "}
                  <ChevronRight size={14} />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════
   PLANS
   ════════════════════════════════════════════ */
function PlansSection() {
  const { t } = useLanguage();
  const isOnboarded = useIsOnboarded();

  return (
    <section
      id="plans"
      className="py-20 sm:py-32 max-w-[1400px] mx-auto w-full px-6 md:px-12"
    >
      <div className="text-center mb-16 sm:mb-20">
        <p className="section-label mb-4">
          {t(content.plans.label.en, content.plans.label.ta)}
        </p>
        <h2 className="text-4xl sm:text-5xl md:text-6xl font-display font-black tracking-tight leading-[0.85] uppercase text-foreground">
          {t(content.plans.heading.en, content.plans.heading.ta)}
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {content.plans.items.map((plan, i) => (
          <div
            key={i}
            className={cn(
              "relative rounded-3xl p-8 flex flex-col gap-6 transition-all duration-300 group card-glow",
              plan.popular
                ? "glass-strong ring-1 ring-primary/30 scale-[1.02] shadow-[0_0_50px_-15px_rgba(255,70,37,0.2)]"
                : "glass-subtle hover:translate-y-[-4px]"
            )}
          >
            {/* Popular badge */}
            {plan.popular && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
                <span className="bg-primary text-white text-[9px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full neon-primary shadow-lg">
                  {t(
                    content.plans.mostPopular.en,
                    content.plans.mostPopular.ta
                  )}
                </span>
              </div>
            )}

            {/* Plan name */}
            <h3 className="text-2xl font-display font-black tracking-tight text-foreground uppercase">
              {t(plan.name.en, plan.name.ta)}
            </h3>

            {/* Price */}
            <div className="flex items-baseline gap-1">
              <span className="text-5xl font-display font-black text-white tabular-nums tracking-tighter leading-none">
                {plan.price}
              </span>
              <span className="text-muted-foreground text-sm font-medium">
                {t(plan.period.en, plan.period.ta)}
              </span>
            </div>

            {/* Coverage & Payout */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                <Percent className="size-4 text-primary" />
                <span className="font-semibold text-foreground">
                  {plan.coverage}
                </span>{" "}
                coverage
              </div>
              <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                <Clock className="size-4 text-secondary" />
                {t(plan.payout.en, plan.payout.ta)}
              </div>
            </div>

            {/* Benefits */}
            <ul className="flex flex-col gap-3 flex-1">
              {plan.benefits.map((benefit, j) => (
                <li
                  key={j}
                  className="flex items-start gap-3 text-sm text-muted-foreground"
                >
                  <div className="size-5 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                    <ShieldCheck className="size-3 text-primary" />
                  </div>
                  {t(benefit.en, benefit.ta)}
                </li>
              ))}
            </ul>

            {/* CTA */}
            <Link href={isOnboarded ? "/dashboard" : "/onboarding"}>
              <button
                className={cn(
                  "w-full font-bold text-sm py-3.5 rounded-xl transition-all active:scale-95 uppercase tracking-wider cursor-pointer",
                  plan.popular
                    ? "bg-primary hover:bg-primary/90 text-white shadow-[0_10px_20px_rgba(255,70,37,0.2)] neon-primary"
                    : "glass border border-white/10 text-foreground hover:bg-primary hover:text-white hover:border-primary/50 hover:neon-primary"
                )}
              >
                {isOnboarded 
                  ? t("Go to Dashboard", "டேஷ்போர்டுக்குச் செல்லுங்கள்")
                  : t(content.plans.choosePlan.en, content.plans.choosePlan.ta)} →
              </button>
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════
   TESTIMONIALS — glass-subtle cards
   ════════════════════════════════════════════ */
function TestimonialsSection() {
  const { t } = useLanguage();

  return (
    <section
      id="testimonials"
      className="py-20 sm:py-32 max-w-[1400px] mx-auto w-full px-6 md:px-12"
    >
      <div className="text-center mb-16 sm:mb-20">
        <p className="section-label mb-4">
          {t(content.testimonials.label.en, content.testimonials.label.ta)}
        </p>
        <h2 className="text-4xl sm:text-5xl md:text-6xl font-display font-black tracking-tight leading-[0.85] uppercase text-foreground">
          {t(
            content.testimonials.heading.en,
            content.testimonials.heading.ta
          )}
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {content.testimonials.items.map((item, i) => (
          <div
            key={i}
            className="group p-8 rounded-3xl glass-subtle card-glow flex flex-col gap-6 hover:translate-y-[-4px] transition-all duration-300"
          >
            {/* Stars */}
            <div className="flex gap-1">
              {[...Array(5)].map((_, j) => (
                <Star
                  key={j}
                  className="size-4 text-accent fill-accent"
                />
              ))}
            </div>

            {/* Quote */}
            <blockquote className="text-foreground text-base leading-relaxed flex-1 font-medium">
              &ldquo;{t(item.quote.en, item.quote.ta)}&rdquo;
            </blockquote>

            {/* Author */}
            <div className="flex items-center gap-3 pt-4 border-t border-white/5">
              <div className="size-10 rounded-full bg-primary/15 flex items-center justify-center border border-primary/20">
                <span className="text-primary font-bold text-sm">
                  {item.name.charAt(0)}
                </span>
              </div>
              <div>
                <p className="text-sm font-bold text-foreground">
                  {item.name}
                </p>
                <p className="text-[10px] font-black uppercase tracking-[0.15em] text-muted-foreground">
                  {item.platform} · {t(item.city.en, item.city.ta)}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════
   STATS — same glass + radial gradient style as apps/web
   ════════════════════════════════════════════ */
function StatsSection() {
  const { t } = useLanguage();
  const isOnboarded = useIsOnboarded();

  return (
    <section className="py-20 sm:py-32 max-w-[1400px] mx-auto w-full px-6 md:px-12">
      <div className="p-8 md:p-14 rounded-2xl md:rounded-3xl glass card-glow relative overflow-hidden flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-14 group">
        {/* Background radials — same as apps/web */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,70,37,0.08)_0%,transparent_40%)] pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_80%,rgba(0,216,255,0.05)_0%,transparent_40%)] pointer-events-none" />

        <div className="w-full lg:max-w-xl flex flex-col items-start text-left space-y-8 relative z-10">
          <div className="flex items-center gap-3 text-secondary font-black uppercase tracking-[0.2em] text-[10px] sm:text-[11px]">
            <Globe className="size-4 animate-spin text-secondary" style={{ animationDuration: '12s' }} />
            {t("Coverage Network", "பாதுகாப்பு வலையமைப்பு")}
          </div>
          <h2 className="text-5xl sm:text-6xl md:text-7xl font-display font-black tracking-tight leading-[0.85] uppercase">
            {t("Covering the", "உள்ளடக்கும்")} <br />
            <span className="text-secondary italic">
              {t("Pan-India", "அகில இந்திய")}
            </span>
          </h2>
          <p className="text-sm sm:text-base text-white/60 leading-relaxed font-medium max-w-lg">
            {t(
              "By EOFY 2026, GigShield will provide parametric protection to over 11 million gig workers across India. Starting with major metros and expanding nationwide.",
              "EOFY 2026-க்குள், GigShield இந்தியா முழுவதும் 11 மில்லியனுக்கும் அதிகமான கிக் தொழிலாளர்களுக்கு பாரமெட்ரிக் பாதுகாப்பை வழங்கும்."
            )}
          </p>
          <Link href={isOnboarded ? "/dashboard" : "/onboarding"}>
            <button className="h-14 px-10 rounded-xl bg-secondary hover:bg-secondary/90 text-white font-black uppercase shadow-[0_10px_30px_rgba(0,216,255,0.3)] border-none transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-3 cursor-pointer">
              {isOnboarded 
                ? t("Go to Dashboard", "டேஷ்போர்டுக்குச் செல்லுங்கள்")
                : t("Explore Coverage", "பாதுகாப்பு பாருங்கள்")}
              <ArrowRight size={18} />
            </button>
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:gap-6 w-full lg:w-auto relative z-10">
          {[
            { label: "Active Riders", val: "11M+" },
            { label: "Platform Nodes", val: "84" },
            { label: "Safety Payouts", val: "₹4.1Cr" },
            { label: "Response Time", val: "2s" },
          ].map((stat, i) => (
            <div
              key={i}
              className="p-5 md:p-8 rounded-2xl glass-subtle border border-white/5 hover:border-secondary/30 transition-all duration-500 flex flex-col justify-center items-center lg:items-start min-w-[140px] md:min-w-[180px]"
            >
              <p className="text-3xl md:text-5xl font-display font-black text-white tabular-nums tracking-tighter leading-none shrink-0">
                {stat.val}
              </p>
              <div className="h-0.5 w-6 bg-secondary/30 my-3 lg:my-4 hidden lg:block" />
              <p className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] text-white/40 mt-1">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════
   CTA BANNER
   ════════════════════════════════════════════ */
function CTABannerSection() {
  const { t } = useLanguage();
  const isOnboarded = useIsOnboarded();

  return (
    <section className="py-20 sm:py-32 relative overflow-hidden max-w-[1400px] mx-auto w-full px-6 md:px-12">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-primary/8 rounded-full blur-[200px] animate-glow-pulse" />
      </div>

      <div className="relative z-10 text-center max-w-3xl mx-auto">
        <h2 className="text-4xl sm:text-5xl md:text-6xl font-display font-black tracking-tight leading-[0.85] uppercase text-foreground mb-6">
          {t(content.ctaBanner.heading.en, content.ctaBanner.heading.ta)}
        </h2>
        <p className="text-base sm:text-lg text-white/60 mb-10 max-w-2xl mx-auto font-medium">
          {t(content.ctaBanner.subtext.en, content.ctaBanner.subtext.ta)}
        </p>
        <Link href={isOnboarded ? "/dashboard" : "/onboarding"}>
          <button className="rounded-2xl bg-primary hover:bg-primary/90 text-white font-bold uppercase h-16 px-14 text-sm shadow-[0_10px_30px_rgba(255,70,37,0.45)] hover:scale-105 active:scale-95 transition-all inline-flex items-center justify-center gap-4 border-none cursor-pointer">
            {isOnboarded 
              ? t("Go to Dashboard", "டேஷ்போர்டுக்குச் செல்லுங்கள்")
              : t(content.ctaBanner.cta.en, content.ctaBanner.cta.ta)}
            <ArrowRight className="size-5" />
          </button>
        </Link>
        <p className="text-sm text-muted-foreground mt-5">
          {t(content.ctaBanner.note.en, content.ctaBanner.note.ta)}
        </p>
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════
   FOOTER — same structure as apps/web
   ════════════════════════════════════════════ */
function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="relative z-10 border-t border-white/5">
      <div className="max-w-[1400px] mx-auto w-full px-6 md:px-12 pt-20 flex flex-col gap-14">
        <div className="flex flex-col md:flex-row justify-between items-start gap-12">
          {/* Logo + Tagline */}
          <div className="space-y-4 max-w-sm">
            <div className="flex items-center gap-3">
              <div className="size-9 rounded-xl bg-primary flex items-center justify-center shadow-[0_0_15px_rgba(255,70,37,0.3)]">
                <Zap className="size-5 text-white fill-current" />
              </div>
              <h4 className="text-3xl font-display font-black tracking-tight uppercase">
                GigShield
              </h4>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {t(content.footer.tagline.en, content.footer.tagline.ta)}
            </p>
          </div>

          {/* Footer Links — same grid as apps/web */}
          <div className="grid grid-cols-3 gap-6 md:gap-14 w-full md:w-auto">
            {[
              {
                title: "Protocol",
                links: ["Documentation", "Audit", "GitHub", "Paper"],
              },
              {
                title: "Company",
                links: ["Ecosystem", "Founders", "Regions", "Careers"],
              },
              {
                title: "Legal",
                links: ["Privacy", "Standard", "AML", "Terms"],
              },
            ].map((section) => (
              <div key={section.title} className="space-y-4">
                <h5 className="text-[11px] font-bold uppercase tracking-[0.15em] text-foreground">
                  {section.title}
                </h5>
                <ul className="space-y-3">
                  {section.links.map((link) => (
                    <li key={link}>
                      <a
                        href="#"
                        className="text-xs text-muted-foreground hover:text-secondary transition-colors"
                      >
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col md:flex-row justify-between items-center py-10 border-t border-white/5 gap-6">
          <span className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground opacity-40">
            {t(content.footer.builtFor.en, content.footer.builtFor.ta)}
          </span>
          <div className="flex items-center gap-6">
            <span className="text-[9px] font-bold uppercase tracking-widest px-3 py-1 glass rounded-full text-success border border-success/20 neon-success">
              Oracle Sync: Active
            </span>
            <div className="flex gap-5">
              <Globe className="size-4 text-muted-foreground hover:text-secondary transition-colors cursor-pointer" />
              <Zap className="size-4 text-muted-foreground hover:text-primary transition-colors cursor-pointer" />
              <ShieldCheck className="size-4 text-muted-foreground hover:text-secondary transition-colors cursor-pointer" />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
