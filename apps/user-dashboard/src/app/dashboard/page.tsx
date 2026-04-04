"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ShieldCheck,
  LayoutDashboard,
  FileText,
  Map,
  Settings,
  User,
  CloudRain,
  CloudDrizzle,
  Sun,
  Zap,
  TrendingUp,
  ArrowUpRight,
  Clock,
  Percent,
  Bell,
  ChevronRight,
  Activity,
  MapPin,
  Droplets,
  Thermometer,
  Wind,
  IndianRupee,
  AlertTriangle,
  CheckCircle2,
  LogOut,
  Menu,
  X,
  Eye,
  Upload,
} from "lucide-react";
import { cn } from "@/lib/utils";

/* ════════════════════════════════════════════
   MOCK DATA
   ════════════════════════════════════════════ */
const recentPayouts = [
  {
    date: "29 Mar 2026",
    amount: "₹8,500",
    trigger: "Heavy Rain",
    triggerIcon: CloudRain,
    status: "Paid",
    statusColor: "success",
  },
  {
    date: "22 Mar 2026",
    amount: "₹5,200",
    trigger: "Flood Warning",
    triggerIcon: Droplets,
    status: "Paid",
    statusColor: "success",
  },
  {
    date: "15 Mar 2026",
    amount: "₹3,400",
    trigger: "Curfew",
    triggerIcon: AlertTriangle,
    status: "Paid",
    statusColor: "success",
  },
  {
    date: "08 Mar 2026",
    amount: "₹6,100",
    trigger: "Heavy Rain",
    triggerIcon: CloudRain,
    status: "Pending",
    statusColor: "warning",
  },
];

const quickActions = [
  {
    label: "File a Claim",
    icon: FileText,
    href: "#",
    color: "text-primary",
    bg: "bg-primary/10",
  },
  {
    label: "Upgrade Plan",
    icon: TrendingUp,
    href: "#",
    color: "text-secondary",
    bg: "bg-secondary/10",
  },
  {
    label: "Coverage Map",
    icon: Map,
    href: "#",
    color: "text-accent",
    bg: "bg-accent/10",
  },
  {
    label: "Get Support",
    icon: Eye,
    href: "#",
    color: "text-success",
    bg: "bg-success/10",
  },
];

const navItems = [
  { label: "Dashboard", icon: LayoutDashboard, href: "/dashboard", active: true },
  { label: "Claims", icon: FileText, href: "#" },
  { label: "Coverage", icon: Map, href: "#" },
  { label: "Settings", icon: Settings, href: "#" },
];

export default function DashboardPage() {
  const router = useRouter();
  const [userName, setUserName] = useState("Ravi");
  const [userPlan, setUserPlan] = useState("Guard Plus");
  const [userCity, setUserCity] = useState("Chennai");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("gigshield_user");
    if (stored) {
      try {
        const data = JSON.parse(stored);
        setUserCity(data.city || "Chennai");
        const planMap: Record<string, string> = {
          lite: "Guard Lite",
          plus: "Guard Plus",
          max: "Guard Max",
        };
        setUserPlan(planMap[data.plan] || "Guard Plus");
      } catch {}
    }
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground flex">
      {/* ─── Sidebar ─── */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 bg-card flex flex-col p-6 transition-transform duration-300 lg:translate-x-0 lg:static lg:w-72",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 mb-12">
          <div className="size-9 rounded-xl bg-primary flex items-center justify-center shadow-[0_0_16px_rgba(255,70,37,0.3)]">
            <ShieldCheck className="size-5 text-white" strokeWidth={2.5} />
          </div>
          <span className="text-xl font-display font-black tracking-tight uppercase">
            Gig<span className="text-primary italic">Shield</span>
          </span>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden ml-auto text-muted-foreground hover:text-foreground cursor-pointer"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Nav */}
        <nav className="space-y-2 flex-1">
          {navItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all",
                item.active
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:text-foreground hover:bg-white/5"
              )}
            >
              <item.icon className="size-4" />
              {item.label}
            </Link>
          ))}
        </nav>

        {/* User + Logout */}
        <div className="mt-auto space-y-3 pt-6">
          <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-muted/40">
            <div className="size-8 rounded-full bg-primary/20 flex items-center justify-center text-primary text-xs font-black">
              {userName[0]}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-foreground truncate">
                {userName} K.
              </p>
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider">
                {userPlan}
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              localStorage.removeItem("gigshield_onboarded");
              localStorage.removeItem("gigshield_user");
              router.push("/");
            }}
            className="flex items-center gap-2 px-4 py-2 text-xs text-muted-foreground hover:text-destructive transition-colors cursor-pointer w-full"
          >
            <LogOut className="size-3" />
            Sign out
          </button>
        </div>
      </aside>

      {/* ─── Main Content ─── */}
      <main className="flex-1 min-h-screen">
        {/* Top bar */}
        <header className="sticky top-0 z-40 glass-strong px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden text-muted-foreground hover:text-foreground cursor-pointer"
            >
              <Menu className="size-5" />
            </button>
            <div>
              <h1 className="text-lg sm:text-xl font-display font-black text-foreground">
                Good morning, {userName}
              </h1>
              <p className="text-xs text-muted-foreground">
                Here&apos;s your protection overview for today
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full glass-subtle">
              <CloudDrizzle className="size-3.5 text-secondary" />
              <span className="text-xs font-semibold text-secondary">
                Light Rain
              </span>
              <span className="text-[10px] text-muted-foreground">
                · {userCity}
              </span>
            </div>
            <button className="relative size-9 rounded-full bg-muted/50 flex items-center justify-center hover:bg-muted transition-colors cursor-pointer">
              <Bell className="size-4 text-muted-foreground" />
              <span className="absolute -top-0.5 -right-0.5 size-3 rounded-full bg-primary animate-pulse neon-primary" />
            </button>
          </div>
        </header>

        {/* Dashboard Grid */}
        <div className="p-4 sm:p-6 lg:p-8 space-y-6">
          {/* Row 1: Status + Weather */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Protection Status Card */}
            <div className="glass-strong rounded-2xl p-6 space-y-6 card-glow">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <span className="section-label">Protection Status</span>
                  <h3 className="text-xl font-display font-black text-foreground">
                    Active Coverage
                  </h3>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-success/10">
                  <span className="size-2 rounded-full bg-success animate-pulse" />
                  <span className="text-xs font-bold text-success uppercase tracking-wider">
                    Active
                  </span>
                </div>
              </div>

              {/* Stat grid */}
              <div className="grid grid-cols-2 gap-4">
                <StatCell
                  label="Coverage"
                  value="70%"
                  icon={Percent}
                  iconColor="text-primary"
                />
                <StatCell
                  label="Plan"
                  value={userPlan}
                  icon={ShieldCheck}
                  iconColor="text-secondary"
                />
                <StatCell
                  label="Payout Speed"
                  value="0.14s"
                  icon={Zap}
                  iconColor="text-accent"
                />
                <StatCell
                  label="Next Premium"
                  value="Apr 7"
                  icon={Clock}
                  iconColor="text-muted-foreground"
                />
              </div>

              {/* Progress bar */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground font-medium">
                    Coverage utilization this month
                  </span>
                  <span className="font-bold text-primary tabular-nums">
                    42%
                  </span>
                </div>
                <div className="h-2 rounded-full bg-muted overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-primary to-primary-light transition-all duration-500"
                    style={{ width: "42%" }}
                  />
                </div>
              </div>
            </div>

            {/* Weather Radar Card */}
            <div className="glass-strong rounded-2xl p-6 space-y-6 card-glow">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <span className="section-label">Weather Radar</span>
                  <h3 className="text-xl font-display font-black text-foreground">
                    Zone Status
                  </h3>
                </div>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <MapPin className="size-3" />
                  {userCity}
                </div>
              </div>

              {/* Weather grid */}
              <div className="grid grid-cols-3 gap-4">
                <WeatherCell icon={CloudRain} label="Rain" value="12mm/hr" status="warning" />
                <WeatherCell icon={Thermometer} label="Temp" value="28°C" status="ok" />
                <WeatherCell icon={Wind} label="Wind" value="18km/h" status="ok" />
              </div>

              {/* Alert */}
              <div className="flex items-start gap-3 p-4 rounded-xl bg-accent/5 border border-accent/10">
                <AlertTriangle className="size-4 text-accent shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="text-xs font-bold text-accent uppercase tracking-wider">
                    Weather Advisory
                  </p>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Heavy rain expected in {userCity} zone between 2 PM – 6 PM.
                    Your coverage will auto-trigger if conditions match your
                    plan parameters.
                  </p>
                </div>
              </div>

              {/* Zone mini-viz */}
              <div className="flex items-center justify-between p-4 rounded-xl bg-muted/40">
                <div className="flex items-center gap-3">
                  <Activity className="size-4 text-secondary" />
                  <div>
                    <p className="text-xs font-bold text-foreground">
                      Oracle Signal
                    </p>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wider">
                      Monitoring 84 nodes
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="size-2 rounded-full bg-success animate-pulse" />
                  <span className="text-xs font-bold text-success">LIVE</span>
                </div>
              </div>
            </div>
          </div>

          {/* Row 2: Recent Payouts + Quick Actions */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Recent Payouts */}
            <div className="lg:col-span-2 glass-strong rounded-2xl p-6 space-y-5 card-glow">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <span className="section-label">Recent Payouts</span>
                  <h3 className="text-xl font-display font-black text-foreground">
                    Transaction History
                  </h3>
                </div>
                <Link
                  href="#"
                  className="text-xs text-primary hover:text-primary/80 font-bold flex items-center gap-1 transition-colors"
                >
                  View All <ChevronRight className="size-3" />
                </Link>
              </div>

              {/* Table-like layout */}
              <div className="space-y-1">
                {/* Header */}
                <div className="grid grid-cols-4 px-4 py-2 text-[10px] text-muted-foreground/50 font-bold uppercase tracking-widest">
                  <span>Date</span>
                  <span>Amount</span>
                  <span>Trigger</span>
                  <span className="text-right">Status</span>
                </div>

                {/* Rows */}
                {recentPayouts.map((payout, i) => (
                  <div
                    key={i}
                    className="grid grid-cols-4 items-center px-4 py-3.5 rounded-xl bg-muted/20 hover:bg-muted/40 transition-colors group"
                  >
                    <span className="text-sm text-muted-foreground font-medium">
                      {payout.date}
                    </span>
                    <span className="text-sm font-bold text-foreground tabular-nums">
                      {payout.amount}
                    </span>
                    <span className="flex items-center gap-2 text-sm text-muted-foreground">
                      <payout.triggerIcon className="size-3.5 text-secondary" />
                      {payout.trigger}
                    </span>
                    <span className="text-right">
                      <span
                        className={cn(
                          "inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider",
                          payout.statusColor === "success"
                            ? "bg-success/10 text-success"
                            : "bg-accent/10 text-accent"
                        )}
                      >
                        {payout.statusColor === "success" ? (
                          <CheckCircle2 className="size-3" />
                        ) : (
                          <Clock className="size-3" />
                        )}
                        {payout.status}
                      </span>
                    </span>
                  </div>
                ))}
              </div>

              {/* Summary */}
              <div className="flex items-center justify-between pt-2">
                <span className="text-xs text-muted-foreground">
                  Total this month
                </span>
                <span className="text-lg font-display font-black text-foreground tabular-nums flex items-center gap-1">
                  <IndianRupee className="size-4" />
                  23,200
                </span>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="glass-strong rounded-2xl p-6 space-y-5 card-glow">
              <div className="space-y-1">
                <span className="section-label">Quick Actions</span>
                <h3 className="text-xl font-display font-black text-foreground">
                  Shortcuts
                </h3>
              </div>

              <div className="space-y-3">
                {quickActions.map((action, i) => (
                  <Link
                    key={i}
                    href={action.href}
                    className="flex items-center gap-4 p-4 rounded-xl bg-muted/20 hover:bg-muted/40 transition-all group"
                  >
                    <div
                      className={cn(
                        "size-10 rounded-xl flex items-center justify-center",
                        action.bg
                      )}
                    >
                      <action.icon className={cn("size-5", action.color)} />
                    </div>
                    <span className="text-sm font-semibold text-foreground flex-1">
                      {action.label}
                    </span>
                    <ArrowUpRight className="size-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                  </Link>
                ))}
              </div>

              {/* Trust badge */}
              <div className="flex items-center gap-3 p-4 rounded-xl bg-primary/5 border border-primary/10 mt-auto">
                <ShieldCheck className="size-5 text-primary shrink-0" />
                <div>
                  <p className="text-xs font-bold text-primary">
                    Parametric Oracle is Active
                  </p>
                  <p className="text-[10px] text-muted-foreground">
                    Monitoring your zone 24/7
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Row 3: Earnings Overview */}
          <div className="glass-strong rounded-2xl p-6 space-y-5 card-glow">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <span className="section-label">Earnings Overview</span>
                <h3 className="text-xl font-display font-black text-foreground">
                  Monthly Protection Impact
                </h3>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full glass-subtle">
                <TrendingUp className="size-3.5 text-success" />
                <span className="text-xs font-bold text-success">
                  +34% vs last month
                </span>
              </div>
            </div>

            {/* Bar chart visualization */}
            <div className="flex items-end gap-3 h-40 pt-4">
              {[
                { month: "Oct", value: 35, amount: "₹12K" },
                { month: "Nov", value: 50, amount: "₹17K" },
                { month: "Dec", value: 30, amount: "₹10K" },
                { month: "Jan", value: 65, amount: "₹22K" },
                { month: "Feb", value: 55, amount: "₹19K" },
                { month: "Mar", value: 90, amount: "₹23K" },
                { month: "Apr", value: 42, amount: "₹9K" },
              ].map((bar, i) => (
                <div
                  key={i}
                  className="flex-1 flex flex-col items-center gap-2 group cursor-pointer"
                >
                  <span className="text-[10px] font-bold text-foreground opacity-0 group-hover:opacity-100 transition-opacity tabular-nums">
                    {bar.amount}
                  </span>
                  <div className="w-full relative rounded-t-lg overflow-hidden bg-muted">
                    <div
                      className={cn(
                        "w-full rounded-t-lg transition-all duration-500",
                        bar.month === "Mar"
                          ? "bg-gradient-to-t from-primary to-primary-light"
                          : i === 6
                            ? "bg-gradient-to-t from-secondary/50 to-secondary/30"
                            : "bg-gradient-to-t from-muted-foreground/20 to-muted-foreground/10"
                      )}
                      style={{ height: `${bar.value}%`, minHeight: 8 }}
                    />
                  </div>
                  <span
                    className={cn(
                      "text-[10px] font-bold uppercase tracking-wider",
                      bar.month === "Mar"
                        ? "text-primary"
                        : "text-muted-foreground"
                    )}
                  >
                    {bar.month}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}

/* ─── Stat Cell ─── */
function StatCell({
  label,
  value,
  icon: Icon,
  iconColor,
}: {
  label: string;
  value: string;
  icon: any;
  iconColor: string;
}) {
  return (
    <div className="p-4 rounded-xl bg-muted/40 space-y-2">
      <div className="flex items-center gap-2">
        <Icon className={cn("size-3.5", iconColor)} />
        <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
          {label}
        </span>
      </div>
      <p className="text-lg font-display font-black text-foreground tabular-nums leading-none">
        {value}
      </p>
    </div>
  );
}

/* ─── Weather Cell ─── */
function WeatherCell({
  icon: Icon,
  label,
  value,
  status,
}: {
  icon: any;
  label: string;
  value: string;
  status: "ok" | "warning" | "danger";
}) {
  return (
    <div className="text-center p-4 rounded-xl bg-muted/30 space-y-3 group hover:bg-muted/50 transition-colors">
      <div
        className={cn(
          "size-10 mx-auto rounded-xl flex items-center justify-center",
          status === "warning"
            ? "bg-accent/10"
            : status === "danger"
              ? "bg-destructive/10"
              : "bg-secondary/10"
        )}
      >
        <Icon
          className={cn(
            "size-5",
            status === "warning"
              ? "text-accent"
              : status === "danger"
                ? "text-destructive"
                : "text-secondary"
          )}
        />
      </div>
      <div className="space-y-0.5">
        <p className="text-sm font-bold text-foreground tabular-nums leading-none">
          {value}
        </p>
        <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">
          {label}
        </p>
      </div>
    </div>
  );
}
