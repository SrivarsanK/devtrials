"use client";

import { SignIn } from "@clerk/nextjs";
import Link from "next/link";
import React from "react";
import { ShieldCheck, ArrowLeft, Sparkles } from "lucide-react";
import anime from "animejs";
import HeroShield from "@/components/HeroShield";

export default function SignInPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = React.use(params);

  React.useEffect(() => {
    const tl = anime.timeline({
      easing: "easeOutQuint",
    });

    tl.add({
      targets: ".anime-auth-nav",
      translateY: [-10, 0],
      opacity: [0, 1],
      duration: 400,
    })
    .add({
      targets: ".anime-auth-header-item",
      translateY: [10, 0],
      opacity: [0, 1],
      duration: 400,
      delay: anime.stagger(40),
    }, "-=350")
    .add({
      targets: ".anime-auth-card",
      scale: [0.99, 1],
      opacity: [0, 1],
      translateY: [5, 0],
      duration: 450,
    }, "-=380")
    .add({
      targets: ".anime-auth-bg",
      opacity: [0, 0.5],
      duration: 500,
    }, "-=400");
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground overflow-hidden relative">
      {/* 3D Corner Accent - Positioned behind the card */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-1/2 left-1/2 -translate-y-[240px] translate-x-[80px] w-64 h-64 opacity-50 mix-blend-screen anime-auth-bg">
          <HeroShield />
        </div>
      </div>

      {/* Ambient background glow */}
      <div className="fixed inset-0 pointer-events-none z-1 anime-auth-bg opacity-0">
        <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[120px] animate-glow-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-secondary/10 rounded-full blur-[100px] animate-glow-pulse" style={{ animationDelay: '1.5s' }} />
      </div>

      {/* Navigation Header */}
      <nav className="fixed top-0 left-0 right-0 z-50 h-20 flex items-center px-6 md:px-12 justify-between anime-auth-nav opacity-0">
        <Link href={`/${lang}`} className="flex items-center gap-3 group">
          <div className="size-10 rounded-xl bg-primary flex items-center justify-center shadow-[0_0_15px_rgba(255,70,37,0.3)] rotate-6 group-hover:rotate-0 transition-transform duration-500">
            <ShieldCheck className="size-6 text-white" strokeWidth={2.5} />
          </div>
          <div className="flex flex-col gap-0 leading-tight">
            <span className="text-2xl font-display font-black tracking-tight text-foreground whitespace-nowrap uppercase">Ride<span className="text-primary italic">Suraksha</span></span>
            <span className="text-[8px] font-bold tracking-[0.2em] text-muted-foreground uppercase opacity-60 whitespace-nowrap">Parametric Oracle</span>
          </div>
        </Link>
        
        <Link href={`/${lang}`} className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-white transition-colors group">
          <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
          Back to Portal
        </Link>
      </nav>

      <main className="flex-1 flex items-center justify-center p-6 relative z-10">
        <div className="w-full max-w-[440px] anime-auth-card opacity-0">
          <div className="mb-10 flex flex-col items-center text-center space-y-4">
            <div className="inline-flex items-center gap-2.5 glass-subtle border border-white/5 rounded-full px-5 py-2 text-[10px] font-black uppercase tracking-[0.2em] text-secondary shadow-lg anime-auth-header-item opacity-0">
              <Sparkles size={12} className="text-secondary animate-pulse" />
              <span>Identity Synchronization</span>
            </div>
            <h1 className="text-5xl font-display font-black tracking-tighter uppercase leading-[0.8] drop-shadow-2xl anime-auth-header-item opacity-0">Authorized <span className="text-primary italic">Access</span></h1>
            <p className="text-sm text-muted-foreground font-medium max-w-[280px] leading-relaxed opacity-0 anime-auth-header-item">
              Secure authentication for the autonomous safety net protocol.
            </p>
          </div>

          <div className="relative group">
            {/* Tactical Glow */}
            <div className="absolute -inset-4 bg-gradient-to-r from-primary/10 via-secondary/5 to-primary/10 rounded-[2.5rem] blur-2xl opacity-0 group-hover:opacity-100 transition duration-1000" />
            
            <SignIn 
              routing="path" 
              path={`/${lang}/sign-in`} 
              signUpUrl={`/${lang}/sign-up`}
              fallbackRedirectUrl={`/${lang}/dashboard`}
              appearance={{
                elements: {
                  rootBox: "w-full",
                  card: "w-full m-0",
                }
              }}
            />
          </div>
        </div>
      </main>

    </div>
  );
}
