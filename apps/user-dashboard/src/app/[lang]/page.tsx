"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Shield, Smartphone, ArrowDown, Droplet, Wind, AlertTriangle, ShieldCheck, Banknote, MapPin, Star, Menu, X, Zap } from "lucide-react";
import { Show, SignInButton, UserButton } from "@clerk/nextjs";
import { Translate } from "@/components/ui/translate";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function LandingPage() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { language, setLanguage } = useLanguage();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
      setMobileMenuOpen(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground font-sans relative overflow-hidden">
      
      {/* Ambient Background Glow */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-primary/8 rounded-full blur-[150px] animate-glow-pulse" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-secondary/6 rounded-full blur-[120px] animate-glow-pulse" style={{ animationDelay: '1.5s' }} />
      </div>

      {/* NAVBAR */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-500 ${scrolled ? "glass-strong border-b border-white/5" : "bg-transparent"} h-20 flex items-center`}>
        <div className="container mx-auto px-6 max-w-7xl flex items-center justify-between">
          
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-xl bg-primary flex items-center justify-center shadow-[0_0_15px_rgba(255,70,37,0.3)] rotate-6">
              <ShieldCheck className="size-6 text-white" strokeWidth={2.5} />
            </div>
            <div className="flex flex-col gap-0 leading-tight">
              <span className="text-2xl font-display font-black tracking-tight text-foreground whitespace-nowrap uppercase">Ride<span className="text-primary italic">Suraksha</span></span>
              <span className="text-[8px] font-bold tracking-[0.2em] text-muted-foreground uppercase opacity-60 whitespace-nowrap">Income Shield</span>
            </div>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            <a href="#how-it-works" onClick={(e) => scrollToSection(e, "how-it-works")} className="text-[11px] font-black uppercase tracking-[0.16em] text-white/50 hover:text-white transition-all duration-300 relative group">
              <Translate text="How it Works" />
              <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-gradient-to-r from-primary to-secondary transition-all duration-500 group-hover:w-full" />
            </a>
            <a href="#plans" onClick={(e) => scrollToSection(e, "plans")} className="text-[11px] font-black uppercase tracking-[0.16em] text-white/50 hover:text-white transition-all duration-300 relative group">
              <Translate text="Plans" />
              <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-gradient-to-r from-primary to-secondary transition-all duration-500 group-hover:w-full" />
            </a>
            
            <div className="flex bg-white/5 rounded-full p-1 border border-white/10">
              <button 
                onClick={() => setLanguage("en")}
                className={`text-xs px-3 py-1.5 rounded-full transition-all ${language === 'en' ? 'bg-primary text-white font-bold' : 'text-white/60 hover:text-white'}`}
              >
                EN
              </button>
              <button 
                onClick={() => setLanguage("ta")}
                className={`text-xs px-3 py-1.5 rounded-full transition-all ${language === 'ta' ? 'bg-primary text-white font-bold' : 'text-white/60 hover:text-white'}`}
              >
                தமிழ்
              </button>
            </div>

            <Show when="signed-in">
               <Link href="/dashboard">
                 <Button variant="ghost" className="text-white/70 hover:text-white"><Translate text="Dashboard" /></Button>
               </Link>
               <UserButton appearance={{ elements: { userButtonAvatarBox: "w-8 h-8 rounded-full" } }} />
            </Show>

            <Show when="signed-out">
               <Link href="/sign-in">
                 <Button variant="ghost" className="text-white/70 hover:text-white"><Translate text="Sign In" /></Button>
               </Link>
               <Link href="/sign-up">
                 <Button className="rounded-xl glass border border-white/10 px-6 font-bold uppercase text-[11px] h-10 hover:bg-primary hover:text-white hover:border-primary/50 hover:neon-primary transition-all">
                   <Translate text="Get Protected" />
                 </Button>
               </Link>
            </Show>
          </div>

          {/* Mobile Nav Toggle */}
          <button className="md:hidden text-white" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>

        {/* Mobile Nav Dropdown */}
        {mobileMenuOpen && (
          <div className="absolute top-full left-0 w-full bg-[#0e0e0e] border-b border-white/10 p-6 flex flex-col gap-6 md:hidden shadow-2xl">
            <a href="#how-it-works" onClick={(e) => scrollToSection(e, "how-it-works")} className="text-lg font-medium text-white">
              <Translate text="How it Works" />
            </a>
            <a href="#plans" onClick={(e) => scrollToSection(e, "plans")} className="text-lg font-medium text-white">
              <Translate text="Plans" />
            </a>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => setLanguage("en")} className={language === 'en' ? 'border-primary text-primary' : 'border-white/20'}>EN</Button>
              <Button variant="outline" size="sm" onClick={() => setLanguage("ta")} className={language === 'ta' ? 'border-primary text-primary' : 'border-white/20'}>தமிழ்</Button>
            </div>
            <Link href="/sign-up" onClick={() => setMobileMenuOpen(false)}>
              <Button className="w-full bg-gradient-to-r from-primary to-primary-dark text-white font-bold py-6 text-lg rounded-xl">
                <Translate text="Get Protected" />
              </Button>
            </Link>
          </div>
        )}
      </nav>

      {/* HERO SECTION */}
      <section className="relative pt-40 pb-20 md:pt-52 md:pb-32 flex flex-col items-center justify-center min-h-[90vh] text-center px-6 z-10">
        
        <div className="inline-flex items-center gap-2.5 glass rounded-full px-5 py-2 text-[10px] font-bold uppercase tracking-[0.1em] text-secondary mb-8">
          <ShieldCheck size={14} className="text-secondary animate-pulse" />
          <Translate text="GUIDEWIRE DEVTRAILS 2026" />
        </div>
        
        <h1 className="font-display font-black text-5xl sm:text-7xl md:text-8xl tracking-tighter leading-[0.85] text-white max-w-4xl mb-6 uppercase">
          <Translate text="Your income." /> <br className="md:hidden" />
          <span className="text-primary italic">
             <Translate text="Protected." />
          </span> <br className="md:hidden" />
          <Translate text="Automatically." />
        </h1>
        <div className="h-1.5 w-32 bg-primary rounded-full shadow-[0_0_20px_rgba(255,70,37,0.6)] mb-6" />
        
        <p className="text-lg md:text-xl text-white/60 max-w-2xl mb-12 leading-relaxed">
          <Translate text="RideSuraksha pays you the moment rain, floods or curfew stops your deliveries. No forms. No calls. Just money in your UPI." />
        </p>

        <div className="flex flex-wrap justify-center gap-4 mb-12">
          <div className="flex items-center gap-2 glass-subtle px-5 py-2.5 rounded-full">
            <ShieldCheck className="w-5 h-5 text-fs-green" />
            <span className="text-[11px] font-black uppercase tracking-widest text-white/80">
              <Translate text="11M+ Workers Covered" />
            </span>
          </div>
          <div className="flex items-center gap-2 glass-subtle px-5 py-2.5 rounded-full">
            <Banknote className="w-5 h-5 text-fs-yellow" />
            <span className="text-[11px] font-black uppercase tracking-widest text-white/80">
              <Translate text="₹20/week Starting Premium" />
            </span>
          </div>
          <div className="flex items-center gap-2 glass-subtle px-5 py-2.5 rounded-full">
            <Smartphone className="w-5 h-5 text-secondary" />
            <span className="text-[11px] font-black uppercase tracking-widest text-white/80">
              <Translate text="2hr Auto Payout" />
            </span>
          </div>
        </div>

        <Link href="/sign-up" className="w-full md:w-auto">
          <Button className="w-full md:w-auto text-sm h-16 md:px-12 bg-primary hover:bg-primary/90 active:scale-95 transition-all text-white rounded-2xl font-bold uppercase shadow-[0_10px_30px_rgba(255,70,37,0.45)] hover:scale-105 border-none">
            <Translate text="Get Protected Now" /> <ArrowDown className="w-5 h-5 ml-2 -rotate-90" />
          </Button>
        </Link>

        <a href="#how-it-works" onClick={(e) => scrollToSection(e, "how-it-works")} className="mt-16 flex flex-col items-center gap-3 text-white/40 hover:text-white/80 transition-colors cursor-pointer">
          <span className="text-sm font-medium"><Translate text="See how it works" /></span>
          <ArrowDown className="w-4 h-4 animate-bounce" />
        </a>
      </section>

      {/* HOW IT WORKS */}
      <section id="how-it-works" className="py-24 px-6 relative z-10 border-t border-white/5">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-20">
            <div className="flex items-center justify-center gap-3 text-secondary font-black uppercase tracking-[0.2em] text-[11px] mb-4">
              <Translate text="HOW IT WORKS" />
            </div>
            <h2 className="font-display font-black text-3xl md:text-6xl text-white tracking-tight uppercase">
              <Translate text="Three steps. " /><span className="text-primary italic"><Translate text="Zero paperwork." /></span>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8 relative">
            {/* Connecting Line Desktop */}
            <div className="hidden md:block absolute top-8 left-[15%] right-[15%] h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent z-0" />

            {/* Step 1 */}
            <div className="relative z-10 flex flex-col items-center text-center group">
              <div className="size-16 rounded-2xl bg-fs-blue flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform">
                <Smartphone className="size-8 text-white" strokeWidth={2.5} />
              </div>
              <div className="text-primary font-black text-xl mb-3">1</div>
              <h3 className="text-2xl font-display font-black tracking-tight text-foreground leading-none uppercase mb-4">
                <Translate text="Sign Up" />
              </h3>
              <p className="text-white/60 leading-relaxed max-w-xs">
                <Translate text="Enter your Partner ID, pick a plan, link your UPI. Under 2 minutes." />
              </p>
            </div>

            {/* Step 2 */}
            <div className="relative z-10 flex flex-col items-center text-center group">
              <div className="size-16 rounded-2xl bg-fs-purple flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform">
                <PinIcon className="size-8 text-white" strokeWidth={2.5} />
              </div>
              <div className="text-primary font-black text-xl mb-3">2</div>
              <h3 className="text-2xl font-display font-black tracking-tight text-foreground leading-none uppercase mb-4">
                <Translate text="We Watch" />
              </h3>
              <p className="text-white/60 leading-relaxed max-w-xs">
                <Translate text="Our system monitors rainfall, floods and curfews in your zone 24/7." />
              </p>
            </div>

            {/* Step 3 */}
            <div className="relative z-10 flex flex-col items-center text-center group">
              <div className="size-16 rounded-2xl bg-fs-green flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform">
                <Banknote className="size-8 text-white" strokeWidth={2.5} />
              </div>
              <div className="text-primary font-black text-xl mb-3">3</div>
              <h3 className="text-2xl font-display font-black tracking-tight text-foreground leading-none uppercase mb-4">
                <Translate text="You Get Paid" />
              </h3>
              <p className="text-white/60 leading-relaxed max-w-xs">
                <Translate text="Disruption detected → payout sent to your UPI. You do nothing." />
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* PLANS */}
      <section id="plans" className="py-24 px-6 relative z-10 border-t border-white/5">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-20">
            <div className="flex items-center justify-center gap-3 text-secondary font-black uppercase tracking-[0.2em] text-[11px] mb-4">
              <Translate text="PLANS" />
            </div>
            <h2 className="font-display font-black text-3xl md:text-6xl text-white tracking-tight uppercase mb-6">
              <Translate text="Pick the " /><span className="text-primary italic"><Translate text="protection." /></span>
            </h2>
            <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8 text-white/50 text-sm font-medium">
              <div className="flex items-center gap-2">
                <MapPin className="size-4 text-primary" />
                <Translate text="Varies by Zone Risk" />
              </div>
              <div className="hidden md:block w-1 h-1 bg-white/20 rounded-full" />
              <div className="flex items-center gap-2">
                <ShieldCheck className="size-4 text-primary" />
                <Translate text="Scales with Insured Days" />
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-8 items-stretch max-w-5xl mx-auto">
            {/* Lite Pass */}
            <Card className="glass-subtle border-white/5 rounded-[40px] flex flex-col p-10 transition-all hover:border-white/10 group relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 blur-3xl rounded-full translate-x-12 -translate-y-12" />
              <div className="mb-8">
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/30 italic">Basic Protection</span>
                </div>
                <h3 className="text-3xl font-display font-black text-white mb-2 uppercase italic tracking-tighter"><Translate text="Lite Pass" /></h3>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-5xl font-display font-black text-white italic">₹20</span>
                  <span className="text-sm font-bold text-white/20 uppercase tracking-widest">/wk*</span>
                </div>
              </div>
              
              <div className="space-y-6 mb-12 flex-grow">
                <div className="flex items-center text-[12px] font-black text-white/60 uppercase tracking-widest">
                  <ShieldCheck className="size-5 mr-4 text-primary" strokeWidth={3} />
                  <Translate text="Rainfall Protection" />
                </div>
                <div className="flex items-center text-[12px] font-black text-white/20 uppercase tracking-widest">
                  <AlertTriangle className="size-5 mr-4 opacity-20" strokeWidth={3} />
                  <Translate text="Standard Payout" />
                </div>
                <div className="flex items-center text-[12px] font-black text-white/20 uppercase tracking-widest">
                  <Droplet className="size-5 mr-4 opacity-20" strokeWidth={3} />
                  <Translate text="Low Risk Zones Only" />
                </div>
              </div>

              <Link href="/sign-up" className="w-full">
                <Button variant="outline" className="w-full h-16 rounded-[28px] border-white/5 bg-white/5 hover:bg-white/10 text-white font-black uppercase text-xs tracking-widest transition-all flex items-center justify-center gap-3 group/btn">
                  <Translate text="Select Pass" /> <ArrowDown className="size-4 -rotate-90 group-hover/btn:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </Card>

            {/* Plus Pass (Popular) */}
            <Card className="relative bg-[#0d0d0d] border-primary/20 ring-1 ring-primary/30 rounded-[48px] flex flex-col p-12 md:scale-105 shadow-[0_50px_100px_rgba(255,70,37,0.2)] z-10 transition-all overflow-hidden group">
              <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-transparent via-primary to-transparent" />
              <div className="absolute -top-20 -right-20 w-64 h-64 bg-primary/10 blur-[100px] rounded-full group-hover:bg-primary/20 transition-all duration-700" />
              
              <div className="mb-10 text-center">
                <div className="inline-flex items-center px-4 py-1.5 bg-primary/10 border border-primary/20 rounded-full mb-6">
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary italic">Most Popular Protocol</span>
                </div>
                <h3 className="text-4xl font-display font-black text-white mb-2 uppercase italic tracking-tighter"><Translate text="Plus Pass" /></h3>
                <div className="flex items-baseline justify-center gap-1.5">
                  <span className="text-7xl font-display font-black text-white italic">₹35</span>
                  <span className="text-sm font-bold text-white/30 uppercase tracking-widest">/wk*</span>
                </div>
              </div>
              
              <div className="space-y-6 mb-12 flex-grow">
                <div className="flex items-center text-[13px] font-black text-white uppercase tracking-widest">
                  <ShieldCheck className="size-6 mr-4 text-primary" strokeWidth={3} />
                  <Translate text="Full Weather Suite" />
                </div>
                <div className="flex items-center text-[13px] font-black text-white uppercase tracking-widest">
                  <Zap className="size-6 mr-4 text-primary animate-pulse" strokeWidth={3} />
                  <Translate text="Instant UPI Settlement" />
                </div>
                <div className="flex items-center text-[13px] font-black text-white uppercase tracking-widest">
                  <Wind className="size-6 mr-4 text-primary" strokeWidth={3} />
                  <Translate text="Mid-High Risk Coverage" />
                </div>
              </div>

              <Link href="/sign-up" className="w-full">
                <Button className="w-full h-20 bg-primary hover:bg-primary/90 text-white font-black uppercase text-sm tracking-widest rounded-[32px] border-none shadow-[0_15px_40px_rgba(255,70,37,0.5)] transition-all flex items-center justify-center gap-3 group/btn active:scale-95">
                  <Translate text="ACTIVATE PLUS" /> <ArrowDown className="size-5 -rotate-90 group-hover/btn:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </Card>

            {/* Elite Pass */}
            <Card className="glass-subtle border-white/5 rounded-[40px] flex flex-col p-10 transition-all hover:border-white/10 group relative overflow-hidden">
              <div className="absolute top-0 left-0 w-32 h-32 bg-primary/5 blur-3xl rounded-full -translate-x-12 -translate-y-12" />
              <div className="mb-8">
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/30 italic">UNLIMITED ESCROW</span>
                </div>
                <h3 className="text-3xl font-display font-black text-white mb-2 uppercase italic tracking-tighter"><Translate text="Elite Pass" /></h3>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-5xl font-display font-black text-white italic">₹50</span>
                  <span className="text-sm font-bold text-white/20 uppercase tracking-widest">/wk*</span>
                </div>
              </div>
              
              <div className="space-y-6 mb-12 flex-grow">
                <div className="flex items-center text-[12px] font-black text-white/60 uppercase tracking-widest">
                  <ShieldCheck className="size-5 mr-4 text-primary" strokeWidth={3} />
                  <Translate text="Global Geofence Coverage" />
                </div>
                <div className="flex items-center text-[12px] font-black text-white/60 uppercase tracking-widest">
                  <AlertTriangle className="size-5 mr-4 text-primary" strokeWidth={3} />
                  <Translate text="Priority Field Support" />
                </div>
                 <div className="flex items-center text-[12px] font-black text-white/60 uppercase tracking-widest">
                  <Wind className="size-5 mr-4 text-primary" strokeWidth={3} />
                  <Translate text="All Risk Zone Profiles" />
                </div>
              </div>

              <Link href="/sign-up" className="w-full">
                <Button variant="outline" className="w-full h-16 rounded-[28px] border-white/5 bg-white/5 hover:bg-white/10 text-white font-black uppercase text-xs tracking-widest transition-all flex items-center justify-center gap-3 group/btn">
                  <Translate text="Select Elite" /> <ArrowDown className="size-4 -rotate-90 group-hover/btn:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </Card>
          </div>

          <div className="mt-16 text-center">
            <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.4em] italic mb-2">
              <Translate text="* Pricing dynamically adjusts based on Zone Risk Indices and Insured Window duration." />
            </p>
            <p className="text-[8px] font-bold text-white/10 uppercase tracking-widest">
              <Translate text="RideSuraksha Protocol v4.2 | Parametric Underwriting Active" />
            </p>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="py-24 px-6 relative z-10 border-t border-white/5">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <div className="flex items-center justify-center gap-3 text-secondary font-black uppercase tracking-[0.2em] text-[11px] mb-4">
              <Translate text="STORIES" />
            </div>
            <h2 className="font-display font-black text-3xl md:text-6xl text-white tracking-tight uppercase">
              <Translate text="Workers who got " /><span className="text-primary italic"><Translate text="paid." /></span>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                text: "It rained for 3 days straight. I got ₹8,500 in my UPI before I even checked my phone. RideSuraksha is real.",
                author: "Ravi",
                platform: "Swiggy",
                city: "Chennai",
                logo: "/logos/swiggy.png"
              },
              {
                text: "Floods hit our zone at 6am. By 8am the money was already there. No one called me. Nothing to fill.",
                author: "Priya",
                platform: "Zomato",
                city: "Mumbai",
                logo: "/logos/zomato.png"
              },
              {
                text: "I was skeptical. Then curfew was announced and ₹3,400 just appeared. Never going back.",
                author: "Arjun",
                platform: "Uber",
                city: "Bengaluru",
                logo: "/logos/uber.svg"
              }
            ].map((st, i) => (
              <div key={i} className="glass-subtle card-glow p-8 rounded-3xl flex flex-col justify-between border-white/[0.05] hover:border-white/[0.1] transition-all hover:translate-y-[-4px] duration-300">
                <div>
                  <div className="flex text-primary mb-6">
                    {[...Array(5)].map((_, j) => <Star key={j} className="w-5 h-5 fill-current" />)}
                  </div>
                  <p className="text-white/80 text-lg leading-relaxed mb-8 italic">
                    "<Translate text={st.text} />"
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center p-2.5 overflow-hidden shadow-lg">
                    <img src={st.logo} alt={st.platform} className="w-full h-full object-contain" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white"><Translate text={st.author} /></h4>
                    <p className="text-sm text-white/50">{st.platform} · {st.city}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA BANNER */}
      <section className="py-24 px-6 relative overflow-hidden z-10">
         <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,70,37,0.08)_0%,transparent_40%)] pointer-events-none" />
         <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_80%,rgba(0,216,255,0.05)_0%,transparent_40%)] pointer-events-none" />
         
         <div className="container mx-auto max-w-4xl relative z-10 text-center">
            <h2 className="font-display font-black text-4xl md:text-6xl text-white mb-6 tracking-tight uppercase">
              <Translate text="Every delivery you miss costs money." /> <br className="hidden md:block"/>
              <Translate text="RideSuraksha gives it back." />
            </h2>
            <p className="text-xl text-white/70 mb-10 max-w-2xl mx-auto">
              <Translate text="Join thousands of delivery workers already protected across India." />
            </p>
            
            <Link href="/sign-up">
              <Button className="h-16 px-12 text-sm bg-primary hover:bg-primary/90 active:scale-95 transition-all text-white rounded-2xl font-bold uppercase shadow-[0_10px_30px_rgba(255,70,37,0.45)] hover:scale-105 border-none">
                <Translate text="Get Protected Now" /> <ArrowDown className="w-5 h-5 ml-2 -rotate-90" />
              </Button>
            </Link>
            
            <p className="mt-6 text-sm text-white/40">
              <Translate text="Starting at ₹20/week. Cancel anytime." />
            </p>
         </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-white/5 py-12 px-6 relative z-10">
        <div className="container mx-auto max-w-7xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex flex-col items-center md:items-start gap-2">
            <div className="flex items-center gap-3">
              <div className="size-9 rounded-xl bg-primary flex items-center justify-center shadow-[0_0_15px_rgba(255,70,37,0.3)]">
                <ShieldCheck className="size-5 text-white" strokeWidth={2.5} />
              </div>
              <span className="text-2xl font-display font-black tracking-tight uppercase">Ride<span className="text-primary italic">Suraksha</span></span>
            </div>
            <p className="text-white/40 text-sm">
              <Translate text="Parametric income insurance for India's gig workers." />
            </p>
          </div>
          
          <div className="text-white/30 text-sm flex items-center gap-2">
            Built for Guidewire DEVTrails 2026 — Kavach Team
          </div>
        </div>
      </footer>

    </div>
  );
}

// MapPin alias for PinIcon semantic consistency
const PinIcon = MapPin;
