"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Shield, Smartphone, ArrowDown, Droplet, Wind, AlertTriangle, ShieldCheck, Banknote, MapPin, Star, Menu, X } from "lucide-react";
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
    <div className="min-h-screen bg-[#0e0e0e] text-foreground font-sans relative overflow-hidden">
      
      {/* Background Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-[1000px] h-[500px] bg-primary/20 blur-[120px] rounded-full pointer-events-none -z-10" />

      {/* NAVBAR */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? "bg-[#0e0e0e]/80 backdrop-blur-md border-b border-white/5 py-4" : "bg-transparent py-6"}`}>
        <div className="container mx-auto px-6 max-w-7xl flex items-center justify-between">
          
          <div className="flex items-center gap-2">
            <Shield className="w-8 h-8 text-primary" />
            <span className="font-manrope font-extrabold text-2xl tracking-tight text-white">Gig<span className="text-primary">Shield</span></span>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            <a href="#how-it-works" onClick={(e) => scrollToSection(e, "how-it-works")} className="text-sm font-medium text-white/70 hover:text-white transition-colors">
              <Translate text="How it Works" />
            </a>
            <a href="#plans" onClick={(e) => scrollToSection(e, "plans")} className="text-sm font-medium text-white/70 hover:text-white transition-colors">
              <Translate text="Plans" />
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
               <div className="p-0.5 rounded-full border border-white/5 bg-white/5 hover:bg-white/10 transition-colors">
                  <UserButton appearance={{ elements: { userButtonAvatarBox: "w-8 h-8 rounded-full" } }} />
               </div>
            </Show>

            <Show when="signed-out">
               <Link href="/sign-in">
                 <Button variant="ghost" className="text-white/70 hover:text-white"><Translate text="Sign In" /></Button>
               </Link>
               <Link href="/onboarding">
                 <Button className="bg-gradient-to-r from-primary to-primary-dark hover:opacity-90 active:scale-95 transition-all text-white rounded-full px-6 font-semibold border-none">
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
            <Link href="/onboarding" onClick={() => setMobileMenuOpen(false)}>
              <Button className="w-full bg-gradient-to-r from-primary to-primary-dark text-white font-bold py-6 text-lg rounded-xl">
                <Translate text="Get Protected" />
              </Button>
            </Link>
          </div>
        )}
      </nav>

      {/* HERO SECTION */}
      <section className="relative pt-40 pb-20 md:pt-52 md:pb-32 flex flex-col items-center justify-center min-h-[90vh] text-center px-6">
        
        <Badge variant="outline" className="text-primary border-primary/50 mb-8 px-4 py-1.5 rounded-full text-xs font-semibold tracking-widest uppercase bg-primary/10">
          <Translate text="GUIDEWIRE DEVTRAILS 2026" />
        </Badge>
        
        <h1 className="font-manrope font-extrabold text-[3.5rem] leading-[1.1] md:text-[5rem] tracking-tight text-white max-w-4xl mb-6">
          <Translate text="Your income." /> <br className="md:hidden" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-orange-300">
             <Translate text="Protected." />
          </span> <br className="md:hidden" />
          <Translate text="Automatically." />
        </h1>
        
        <p className="text-lg md:text-xl text-white/60 max-w-2xl mb-12 leading-relaxed">
          <Translate text="GigShield pays you the moment rain, floods or curfew stops your deliveries. No forms. No calls. Just money in your UPI." />
        </p>

        <div className="flex flex-wrap justify-center gap-4 mb-12">
          <div className="flex items-center gap-2 bg-surface-card border border-white/5 px-5 py-2.5 rounded-full shadow-lg">
            <ShieldCheck className="w-5 h-5 text-primary" />
            <span className="text-sm font-medium text-white/90">
              <Translate text="11M+ Workers Covered" />
            </span>
          </div>
          <div className="flex items-center gap-2 bg-surface-card border border-white/5 px-5 py-2.5 rounded-full shadow-lg">
            <Banknote className="w-5 h-5 text-primary" />
            <span className="text-sm font-medium text-white/90">
              <Translate text="₹79/wk Starting Premium" />
            </span>
          </div>
          <div className="flex items-center gap-2 bg-surface-card border border-white/5 px-5 py-2.5 rounded-full shadow-lg">
            <Smartphone className="w-5 h-5 text-primary" />
            <span className="text-sm font-medium text-white/90">
              <Translate text="2hr Auto Payout" />
            </span>
          </div>
        </div>

        <Link href="/onboarding" className="w-full md:w-auto">
          <Button className="w-full md:w-auto text-lg h-16 md:px-12 bg-gradient-to-r from-primary to-primary-dark hover:opacity-90 active:scale-95 transition-all text-white rounded-full font-bold shadow-[0_0_40px_-10px_rgba(249,115,22,0.5)]">
            <Translate text="Get Protected Now" /> <ArrowDown className="w-5 h-5 ml-2 -rotate-90" />
          </Button>
        </Link>

        <a href="#how-it-works" onClick={(e) => scrollToSection(e, "how-it-works")} className="mt-16 flex flex-col items-center gap-3 text-white/40 hover:text-white/80 transition-colors cursor-pointer">
          <span className="text-sm font-medium"><Translate text="See how it works" /></span>
          <ArrowDown className="w-4 h-4 animate-bounce" />
        </a>
      </section>

      {/* HOW IT WORKS */}
      <section id="how-it-works" className="py-24 px-6 relative z-10 bg-[#0a0a0a]">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-20">
            <div className="text-primary font-bold text-sm tracking-widest uppercase mb-4">
              <Translate text="HOW IT WORKS" />
            </div>
            <h2 className="font-manrope font-extrabold text-3xl md:text-5xl text-white">
              <Translate text="Three steps. Zero paperwork." />
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8 relative">
            {/* Connecting Line Desktop */}
            <div className="hidden md:block absolute top-[60px] left-[15%] right-[15%] h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent z-0" />

            {/* Step 1 */}
            <div className="relative z-10 flex flex-col items-center text-center group">
              <div className="w-16 h-16 rounded-2xl bg-surface-card border border-white/10 flex items-center justify-center mb-6 shadow-xl relative overflow-hidden group-hover:border-primary/50 transition-colors">
                <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                <Smartphone className="w-8 h-8 text-primary relative z-10" />
              </div>
              <div className="text-primary font-black text-xl mb-3">1</div>
              <h3 className="text-xl font-bold text-white mb-4 font-manrope">
                <Translate text="Sign Up" />
              </h3>
              <p className="text-white/60 leading-relaxed max-w-xs">
                <Translate text="Enter your Partner ID, pick a plan, link your UPI. Under 2 minutes." />
              </p>
            </div>

            {/* Step 2 */}
            <div className="relative z-10 flex flex-col items-center text-center group">
              <div className="w-16 h-16 rounded-2xl bg-surface-card border border-white/10 flex items-center justify-center mb-6 shadow-xl relative overflow-hidden group-hover:border-primary/50 transition-colors">
                 <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                <PinIcon className="w-8 h-8 text-primary relative z-10" />
              </div>
              <div className="text-primary font-black text-xl mb-3">2</div>
              <h3 className="text-xl font-bold text-white mb-4 font-manrope">
                <Translate text="We Watch" />
              </h3>
              <p className="text-white/60 leading-relaxed max-w-xs">
                <Translate text="Our system monitors rainfall, floods and curfews in your zone 24/7." />
              </p>
            </div>

            {/* Step 3 */}
            <div className="relative z-10 flex flex-col items-center text-center group">
              <div className="w-16 h-16 rounded-2xl bg-surface-card border border-white/10 flex items-center justify-center mb-6 shadow-xl relative overflow-hidden group-hover:border-primary/50 transition-colors">
                <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                <Banknote className="w-8 h-8 text-primary relative z-10" />
              </div>
              <div className="text-primary font-black text-xl mb-3">3</div>
              <h3 className="text-xl font-bold text-white mb-4 font-manrope">
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
      <section id="plans" className="py-24 px-6 relative bg-gradient-to-b from-[#0a0a0a] to-[#0e0e0e]">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-20">
            <div className="text-primary font-bold text-sm tracking-widest uppercase mb-4">
              <Translate text="PLANS" />
            </div>
            <h2 className="font-manrope font-extrabold text-3xl md:text-5xl text-white">
              <Translate text="Pick the protection that fits you." />
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8 items-center max-w-5xl mx-auto">
            {/* Guard Lite */}
            <Card className="bg-surface-card border-white/10 hover:border-white/20 transition-all text-white rounded-2xl">
              <CardHeader>
                <CardTitle className="text-2xl font-manrope"><Translate text="Guard Lite" /></CardTitle>
                <div className="mt-4 flex items-baseline text-4xl font-extrabold">
                  ₹79
                  <span className="ml-1 text-xl font-medium text-white/50">/wk</span>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center text-white/80"><ShieldCheck className="w-5 h-5 mr-3 text-primary" /> <Translate text="50% coverage" /></div>
                <div className="flex items-center text-white/80"><AlertTriangle className="w-5 h-5 mr-3 text-white/40" /> <Translate text="24hr payout" /></div>
                <div className="flex items-center text-white/80"><Droplet className="w-5 h-5 mr-3 text-white/40" /> <Translate text="Rain & Flood only" /></div>
              </CardContent>
              <CardFooter>
                 <Link href="/onboarding" className="w-full">
                  <Button variant="outline" className="w-full h-12 rounded-xl border-white/20 hover:bg-white/10">
                    <Translate text="Choose Plan" /> <ArrowDown className="w-4 h-4 ml-2 -rotate-90" />
                  </Button>
                </Link>
              </CardFooter>
            </Card>

            {/* Guard Plus (Popular) */}
            <Card className="relative bg-surface-card border-primary ring-1 ring-primary/50 shadow-[0_0_30px_-5px_rgba(249,115,22,0.3)] hover:shadow-[0_0_40px_-5px_rgba(249,115,22,0.4)] transition-all md:-translate-y-4 text-white rounded-2xl transform">
              <div className="absolute -top-4 left-0 right-0 flex justify-center">
                <span className="bg-primary text-white text-xs font-bold px-3 py-1 uppercase tracking-wider rounded-full">
                  <Translate text="MOST POPULAR" />
                </span>
              </div>
              <CardHeader className="pt-8">
                <CardTitle className="text-2xl font-manrope text-primary"><Translate text="Guard Plus" /></CardTitle>
                <div className="mt-4 flex items-baseline text-5xl font-extrabold text-white">
                  ₹119
                  <span className="ml-1 text-xl font-medium text-white/50">/wk</span>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                 <div className="flex items-center text-white/90"><ShieldCheck className="w-5 h-5 mr-3 text-primary" /> <span className="font-bold"><Translate text="70% coverage" /></span></div>
                 <div className="flex items-center text-white/90"><AlertTriangle className="w-5 h-5 mr-3 text-primary" /> <Translate text="12hr payout" /></div>
                 <div className="flex items-center text-white/90"><Wind className="w-5 h-5 mr-3 text-primary" /> <Translate text="All weather & curfews" /></div>
              </CardContent>
              <CardFooter>
                 <Link href="/onboarding" className="w-full">
                  <Button className="w-full h-12 bg-gradient-to-r from-primary to-primary-dark hover:opacity-90 active:scale-95 text-white rounded-xl font-bold border-none transition-all">
                    <Translate text="Choose Plan" /> <ArrowDown className="w-4 h-4 ml-2 -rotate-90" />
                  </Button>
                </Link>
              </CardFooter>
            </Card>

            {/* Guard Max */}
            <Card className="bg-surface-card border-white/10 hover:border-white/20 transition-all text-white rounded-2xl">
              <CardHeader>
                <CardTitle className="text-2xl font-manrope"><Translate text="Guard Max" /></CardTitle>
                <div className="mt-4 flex items-baseline text-4xl font-extrabold">
                  ₹159
                  <span className="ml-1 text-xl font-medium text-white/50">/wk</span>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                 <div className="flex items-center text-white/80"><ShieldCheck className="w-5 h-5 mr-3 text-primary" /> <span className="font-bold"><Translate text="80% coverage" /></span></div>
                 <div className="flex items-center text-white/80"><AlertTriangle className="w-5 h-5 mr-3 text-white/40" /> <span className="font-bold"><Translate text="2hr expedited payout" /></span></div>
                 <div className="flex items-center text-white/80"><Wind className="w-5 h-5 mr-3 text-white/40" /> <Translate text="All disruptions + VIP support" /></div>
              </CardContent>
              <CardFooter>
                 <Link href="/onboarding" className="w-full">
                  <Button variant="outline" className="w-full h-12 rounded-xl border-white/20 hover:bg-white/10">
                    <Translate text="Choose Plan" /> <ArrowDown className="w-4 h-4 ml-2 -rotate-90" />
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="py-24 px-6 relative bg-[#0e0e0e]">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <div className="text-primary font-bold text-sm tracking-widest uppercase mb-4">
              <Translate text="STORIES" />
            </div>
            <h2 className="font-manrope font-extrabold text-3xl md:text-5xl text-white">
              <Translate text="Workers who got paid when it mattered." />
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                text: "It rained for 3 days straight. I got ₹8,500 in my UPI before I even checked my phone. GigShield is real.",
                author: "Ravi",
                platform: "Swiggy",
                city: "Chennai"
              },
              {
                text: "Floods hit our zone at 6am. By 8am the money was already there. No one called me. Nothing to fill.",
                author: "Priya",
                platform: "Zomato",
                city: "Mumbai"
              },
              {
                text: "I was skeptical. Then curfew was announced and ₹3,400 just appeared. Never going back.",
                author: "Arjun",
                platform: "Uber",
                city: "Bengaluru"
              }
            ].map((st, i) => (
              <div key={i} className="bg-surface-card border border-white/10 p-8 rounded-2xl flex flex-col justify-between hover:border-white/20 transition-colors">
                <div>
                  <div className="flex text-primary mb-6">
                    {[...Array(5)].map((_, j) => <Star key={j} className="w-5 h-5 fill-current" />)}
                  </div>
                  <p className="text-white/80 text-lg leading-relaxed mb-8 italic">
                    "<Translate text={st.text} />"
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center font-bold text-white uppercase overflow-hidden">
                    {st.author[0]}
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
      <section className="py-24 px-6 relative overflow-hidden">
         <div className="absolute inset-0 bg-primary/10" />
         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[800px] h-full bg-primary/20 blur-[100px] pointer-events-none" />
         
         <div className="container mx-auto max-w-4xl relative z-10 text-center">
            <h2 className="font-manrope font-extrabold text-4xl md:text-5xl text-white mb-6">
              <Translate text="Every delivery you miss costs money." /> <br className="hidden md:block"/>
              <Translate text="GigShield gives it back." />
            </h2>
            <p className="text-xl text-white/70 mb-10 max-w-2xl mx-auto">
              <Translate text="Join thousands of delivery workers already protected across India." />
            </p>
            
            <Link href="/onboarding">
              <Button className="h-16 px-12 text-lg bg-gradient-to-r from-primary to-primary-dark hover:opacity-90 active:scale-95 transition-all text-white rounded-full font-bold shadow-[0_0_40px_-5px_rgba(249,115,22,0.4)] border-none">
                <Translate text="Get Protected Now" /> <ArrowDown className="w-5 h-5 ml-2 -rotate-90" />
              </Button>
            </Link>
            
            <p className="mt-6 text-sm text-white/40">
              <Translate text="Starting at ₹79/week. Cancel anytime." />
            </p>
         </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-[#0a0a0a] border-t border-white/5 py-12 px-6">
        <div className="container mx-auto max-w-7xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex flex-col items-center md:items-start gap-2">
            <div className="flex items-center gap-2">
              <Shield className="w-6 h-6 text-primary" />
              <span className="font-manrope font-bold text-xl text-white">Gig<span className="text-primary">Shield</span></span>
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
