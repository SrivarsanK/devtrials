"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ShieldCheck,
  ArrowRight,
  ArrowLeft,
  CloudRain,
  Eye,
  Zap,
  CheckCircle2,
  ChevronDown,
  Percent,
  Clock,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";

/* ════════════════════════════════════════════
   ONBOARDING — 3-step flow
   Step 1: Welcome
   Step 2: Link Your Account
   Step 3: Choose Plan + UPI
   ════════════════════════════════════════════ */

const platforms = ["Swiggy", "Zomato", "Uber", "Dunzo", "Rapido", "Porter"];
const cities = [
  "Chennai",
  "Mumbai",
  "Bengaluru",
  "Delhi",
  "Hyderabad",
  "Kolkata",
  "Pune",
  "Ahmedabad",
];

const plans = [
  {
    id: "lite",
    name: "Guard Lite",
    price: "₹79",
    period: "/week",
    coverage: "50%",
    payout: "24hr payout",
    color: "secondary",
    benefits: [
      "Rain & flood coverage",
      "UPI direct payout",
      "Basic zone monitoring",
    ],
  },
  {
    id: "plus",
    name: "Guard Plus",
    price: "₹119",
    period: "/week",
    coverage: "70%",
    payout: "12hr payout",
    color: "primary",
    popular: true,
    benefits: [
      "Rain, flood & curfew coverage",
      "Priority UPI payout",
      "Multi-zone monitoring",
    ],
  },
  {
    id: "max",
    name: "Guard Max",
    price: "₹159",
    period: "/week",
    coverage: "80%",
    payout: "2hr payout",
    color: "accent",
    benefits: [
      "All-hazard coverage",
      "Instant UPI payout",
      "24/7 premium monitoring",
    ],
  },
];

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    partnerId: "",
    platform: "",
    city: "",
    plan: "plus",
    upiId: "",
  });
  const [platformOpen, setPlatformOpen] = useState(false);
  const [cityOpen, setCityOpen] = useState(false);

  const canProceedStep2 =
    formData.partnerId.trim() !== "" &&
    formData.platform !== "" &&
    formData.city !== "";
  const canProceedStep3 = formData.plan !== "" && formData.upiId.trim() !== "";

  const handleComplete = () => {
    // Simulate saving and redirect to dashboard
    localStorage.setItem("gigshield_onboarded", "true");
    localStorage.setItem("gigshield_user", JSON.stringify(formData));
    router.push("/dashboard");
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center px-4 sm:px-6 relative overflow-hidden">
      {/* Ambient glow */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-1/4 left-1/3 w-[500px] h-[500px] bg-primary/6 rounded-full blur-[180px] animate-glow-pulse" />
        <div
          className="absolute bottom-1/4 right-1/3 w-[400px] h-[400px] bg-secondary/5 rounded-full blur-[140px] animate-glow-pulse"
          style={{ animationDelay: "1.5s" }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-xl flex flex-col items-center">
        {/* Logo */}
        <div className="flex items-center gap-3 mb-10 animate-fade-in">
          <div className="size-10 rounded-xl bg-primary flex items-center justify-center shadow-[0_0_20px_rgba(255,70,37,0.3)] rotate-6">
            <ShieldCheck className="size-6 text-white" strokeWidth={2.5} />
          </div>
          <span className="text-2xl font-display font-black tracking-tight uppercase text-foreground">
            Gig<span className="text-primary italic">Shield</span>
          </span>
        </div>

        {/* Step Indicator */}
        <StepIndicator currentStep={step} />

        {/* Step Content */}
        <div className="w-full mt-10 animate-fade-in-up">
          {step === 1 && <StepWelcome />}
          {step === 2 && (
            <StepLinkAccount
              formData={formData}
              setFormData={setFormData}
              platformOpen={platformOpen}
              setPlatformOpen={setPlatformOpen}
              cityOpen={cityOpen}
              setCityOpen={setCityOpen}
            />
          )}
          {step === 3 && (
            <StepChoosePlan formData={formData} setFormData={setFormData} />
          )}
        </div>

        {/* Navigation Buttons */}
        <div className="w-full flex items-center gap-4 mt-10 animate-fade-in-up delay-200">
          {step > 1 && (
            <button
              onClick={() => setStep(step - 1)}
              className="h-14 px-6 rounded-xl bg-muted hover:bg-muted/80 text-foreground font-bold uppercase text-sm flex items-center gap-2 transition-all active:scale-95 cursor-pointer"
            >
              <ArrowLeft className="size-4" />
              Back
            </button>
          )}

          {step < 3 && (
            <button
              onClick={() => setStep(step + 1)}
              disabled={step === 2 && !canProceedStep2}
              className={cn(
                "flex-1 h-14 rounded-xl font-bold uppercase text-sm flex items-center justify-center gap-3 transition-all active:scale-95 cursor-pointer",
                step === 2 && !canProceedStep2
                  ? "bg-muted text-muted-foreground cursor-not-allowed opacity-50"
                  : "bg-primary hover:bg-primary/90 text-white shadow-[0_10px_25px_rgba(255,70,37,0.3)] neon-primary"
              )}
            >
              {step === 1 ? "Get Started" : "Continue"}
              <ArrowRight className="size-4" />
            </button>
          )}

          {step === 3 && (
            <button
              onClick={handleComplete}
              disabled={!canProceedStep3}
              className={cn(
                "flex-1 h-14 rounded-xl font-bold uppercase text-sm flex items-center justify-center gap-3 transition-all active:scale-95 cursor-pointer",
                !canProceedStep3
                  ? "bg-muted text-muted-foreground cursor-not-allowed opacity-50"
                  : "bg-primary hover:bg-primary/90 text-white shadow-[0_10px_25px_rgba(255,70,37,0.3)] neon-primary"
              )}
            >
              <Zap className="size-4 fill-current" />
              Activate Protection
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

/* ─── Step Indicator ─── */
function StepIndicator({ currentStep }: { currentStep: number }) {
  const steps = [
    { num: 1, label: "Welcome" },
    { num: 2, label: "Link Account" },
    { num: 3, label: "Choose Plan" },
  ];

  return (
    <div className="flex items-center gap-3">
      {steps.map((s, i) => (
        <React.Fragment key={s.num}>
          <div className="flex items-center gap-2">
            <div
              className={cn(
                "size-8 rounded-full flex items-center justify-center text-xs font-black transition-all duration-300",
                currentStep >= s.num
                  ? "bg-primary text-white neon-primary"
                  : "bg-muted text-muted-foreground"
              )}
            >
              {currentStep > s.num ? (
                <CheckCircle2 className="size-4" />
              ) : (
                s.num
              )}
            </div>
            <span
              className={cn(
                "text-[10px] font-bold uppercase tracking-widest hidden sm:block transition-colors",
                currentStep >= s.num
                  ? "text-foreground"
                  : "text-muted-foreground"
              )}
            >
              {s.label}
            </span>
          </div>
          {i < steps.length - 1 && (
            <div
              className={cn(
                "w-8 sm:w-14 h-0.5 rounded-full transition-colors",
                currentStep > s.num ? "bg-primary" : "bg-muted"
              )}
            />
          )}
        </React.Fragment>
      ))}
    </div>
  );
}

/* ─── Step 1: Welcome ─── */
function StepWelcome() {
  return (
    <div className="text-center space-y-8">
      {/* Hero Shield */}
      <div className="flex justify-center">
        <div className="relative">
          <div className="size-32 rounded-3xl bg-primary/10 flex items-center justify-center border border-primary/20 shadow-[0_0_60px_rgba(255,70,37,0.15)]">
            <ShieldCheck className="size-16 text-primary" strokeWidth={1.5} />
          </div>
          <div className="absolute -top-2 -right-2 size-8 rounded-full bg-success flex items-center justify-center neon-success animate-pulse">
            <Zap className="size-4 text-white fill-current" />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h1 className="text-4xl sm:text-5xl font-display font-black tracking-tight text-foreground leading-tight uppercase">
          Welcome to{" "}
          <span className="text-primary italic">GigShield</span>
        </h1>
        <p className="text-lg text-muted-foreground leading-relaxed max-w-md mx-auto">
          Your income. Protected. Automatically.
        </p>
      </div>

      {/* Feature pills */}
      <div className="flex flex-wrap justify-center gap-3">
        {[
          { icon: CloudRain, text: "Weather Protection" },
          { icon: Eye, text: "24/7 Monitoring" },
          { icon: Zap, text: "Instant Payouts" },
        ].map((f, i) => (
          <div
            key={i}
            className="flex items-center gap-2 px-4 py-2.5 rounded-full glass-subtle text-sm font-semibold text-foreground"
          >
            <f.icon className="size-4 text-secondary" />
            {f.text}
          </div>
        ))}
      </div>

      <p className="text-xs text-muted-foreground/60 pt-4">
        Takes less than 2 minutes to set up. No paperwork needed.
      </p>
    </div>
  );
}

/* ─── Step 2: Link Account ─── */
function StepLinkAccount({
  formData,
  setFormData,
  platformOpen,
  setPlatformOpen,
  cityOpen,
  setCityOpen,
}: {
  formData: any;
  setFormData: any;
  platformOpen: boolean;
  setPlatformOpen: any;
  cityOpen: boolean;
  setCityOpen: any;
}) {
  return (
    <div className="space-y-8">
      <div className="text-center space-y-3">
        <h2 className="text-3xl font-display font-black tracking-tight text-foreground uppercase">
          Link Your Account
        </h2>
        <p className="text-sm text-muted-foreground">
          Enter your delivery partner details so we can monitor your zone.
        </p>
      </div>

      <div className="space-y-6">
        {/* Partner ID */}
        <div className="space-y-2">
          <label
            htmlFor="partnerId"
            className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground"
          >
            Partner ID <span className="text-primary">*</span>
          </label>
          <input
            id="partnerId"
            type="text"
            value={formData.partnerId}
            onChange={(e) =>
              setFormData({ ...formData, partnerId: e.target.value })
            }
            placeholder="e.g. SW-1234567"
            className="w-full h-14 px-5 rounded-xl bg-muted/60 text-foreground placeholder:text-muted-foreground/40 font-medium focus:outline-none focus:ring-2 focus:ring-secondary/50 transition-all text-base"
          />
        </div>

        {/* Platform Selector */}
        <div className="space-y-2 relative">
          <label className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">
            Platform <span className="text-primary">*</span>
          </label>
          <button
            onClick={() => {
              setPlatformOpen(!platformOpen);
              setCityOpen(false);
            }}
            className="w-full h-14 px-5 rounded-xl bg-muted/60 text-left font-medium flex items-center justify-between focus:outline-none focus:ring-2 focus:ring-secondary/50 transition-all cursor-pointer text-base"
          >
            <span
              className={
                formData.platform
                  ? "text-foreground"
                  : "text-muted-foreground/40"
              }
            >
              {formData.platform || "Select your platform"}
            </span>
            <ChevronDown
              className={cn(
                "size-4 text-muted-foreground transition-transform",
                platformOpen && "rotate-180"
              )}
            />
          </button>
          {platformOpen && (
            <div className="absolute top-full mt-2 left-0 right-0 z-50 rounded-xl glass-strong overflow-hidden shadow-2xl animate-fade-in max-h-60 overflow-y-auto">
              {platforms.map((p) => (
                <button
                  key={p}
                  onClick={() => {
                    setFormData({ ...formData, platform: p });
                    setPlatformOpen(false);
                  }}
                  className={cn(
                    "w-full text-left px-5 py-3.5 text-sm font-medium transition-colors cursor-pointer",
                    formData.platform === p
                      ? "bg-primary/20 text-primary"
                      : "text-foreground hover:bg-white/5"
                  )}
                >
                  {p}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* City Selector */}
        <div className="space-y-2 relative">
          <label className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">
            City <span className="text-primary">*</span>
          </label>
          <button
            onClick={() => {
              setCityOpen(!cityOpen);
              setPlatformOpen(false);
            }}
            className="w-full h-14 px-5 rounded-xl bg-muted/60 text-left font-medium flex items-center justify-between focus:outline-none focus:ring-2 focus:ring-secondary/50 transition-all cursor-pointer text-base"
          >
            <span
              className={
                formData.city ? "text-foreground" : "text-muted-foreground/40"
              }
            >
              {formData.city || "Select your city"}
            </span>
            <ChevronDown
              className={cn(
                "size-4 text-muted-foreground transition-transform",
                cityOpen && "rotate-180"
              )}
            />
          </button>
          {cityOpen && (
            <div className="absolute top-full mt-2 left-0 right-0 z-50 rounded-xl glass-strong overflow-hidden shadow-2xl animate-fade-in max-h-60 overflow-y-auto">
              {cities.map((c) => (
                <button
                  key={c}
                  onClick={() => {
                    setFormData({ ...formData, city: c });
                    setCityOpen(false);
                  }}
                  className={cn(
                    "w-full text-left px-5 py-3.5 text-sm font-medium transition-colors cursor-pointer",
                    formData.city === c
                      ? "bg-primary/20 text-primary"
                      : "text-foreground hover:bg-white/5"
                  )}
                >
                  {c}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ─── Step 3: Choose Plan ─── */
function StepChoosePlan({
  formData,
  setFormData,
}: {
  formData: any;
  setFormData: any;
}) {
  return (
    <div className="space-y-8">
      <div className="text-center space-y-3">
        <h2 className="text-3xl font-display font-black tracking-tight text-foreground uppercase">
          Choose Your Plan
        </h2>
        <p className="text-sm text-muted-foreground">
          Select coverage and enter your UPI ID for instant payouts.
        </p>
      </div>

      {/* Plan Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {plans.map((plan) => (
          <button
            key={plan.id}
            onClick={() => setFormData({ ...formData, plan: plan.id })}
            className={cn(
              "relative p-5 rounded-2xl flex flex-col gap-4 text-left transition-all duration-300 cursor-pointer group",
              formData.plan === plan.id
                ? "glass-strong ring-2 ring-primary/50 scale-[1.02] shadow-[0_0_40px_-10px_rgba(255,70,37,0.2)]"
                : "glass-subtle hover:bg-white/5"
            )}
          >
            {plan.popular && (
              <span className="absolute -top-2 left-1/2 -translate-x-1/2 bg-primary text-white text-[8px] font-black uppercase tracking-widest px-3 py-1 rounded-full neon-primary">
                Recommended
              </span>
            )}

            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold uppercase tracking-wider text-foreground">
                {plan.name}
              </h3>
              <div
                className={cn(
                  "size-5 rounded-full border-2 flex items-center justify-center transition-colors",
                  formData.plan === plan.id
                    ? "border-primary bg-primary"
                    : "border-muted-foreground/30"
                )}
              >
                {formData.plan === plan.id && (
                  <CheckCircle2 className="size-3 text-white" />
                )}
              </div>
            </div>

            <div className="flex items-baseline gap-0.5">
              <span className="text-3xl font-display font-black text-foreground tabular-nums tracking-tighter leading-none">
                {plan.price}
              </span>
              <span className="text-xs text-muted-foreground font-medium">
                {plan.period}
              </span>
            </div>

            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <Percent className="size-3 text-primary" />
                {plan.coverage}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="size-3 text-secondary" />
                {plan.payout}
              </span>
            </div>

            <ul className="space-y-2 flex-1">
              {plan.benefits.map((b, j) => (
                <li
                  key={j}
                  className="flex items-start gap-2 text-xs text-muted-foreground"
                >
                  <ShieldCheck className="size-3 text-primary shrink-0 mt-0.5" />
                  {b}
                </li>
              ))}
            </ul>
          </button>
        ))}
      </div>

      {/* UPI ID */}
      <div className="space-y-2">
        <label
          htmlFor="upiId"
          className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground"
        >
          UPI ID <span className="text-primary">*</span>
        </label>
        <input
          id="upiId"
          type="text"
          value={formData.upiId}
          onChange={(e) =>
            setFormData({ ...formData, upiId: e.target.value })
          }
          placeholder="e.g. yourname@upi"
          className="w-full h-14 px-5 rounded-xl bg-muted/60 text-foreground placeholder:text-muted-foreground/40 font-medium focus:outline-none focus:ring-2 focus:ring-secondary/50 transition-all text-base"
        />
        <p className="text-[10px] text-muted-foreground/50 pl-1">
          Payouts will be sent directly to this UPI ID.
        </p>
      </div>
    </div>
  );
}
