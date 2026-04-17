"use client";

import { useTriggerSimulationStore } from "@/hooks/use-trigger-simulation-store";
import { Card, CardContent } from "@/components/ui/card";
import { Activity, Wallet, ShieldAlert, TrendingDown } from "lucide-react";

export function TriggerStatsRow() {
  const { todayStats } = useTriggerSimulationStore();

  const stats = [
    {
      label: "Simulated Events",
      value: todayStats.totalEvents,
      icon: Activity,
      color: "text-blue-500",
      prefix: ""
    },
    {
      label: "Mock Payouts",
      value: todayStats.totalPayout.toLocaleString(),
      icon: Wallet,
      color: "text-emerald-500",
      prefix: "₹"
    },
    {
      label: "Avg Fraud Score",
      value: todayStats.avgFraudScore.toFixed(1),
      icon: ShieldAlert,
      color: "text-amber-500",
      prefix: ""
    },
    {
      label: "Reserve Impact",
      value: todayStats.reserveImpact.toLocaleString(),
      icon: TrendingDown,
      color: "text-red-500",
      prefix: "₹"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {stats.map((stat, i) => (
        <Card key={i} className="glass overflow-hidden relative group border-white/[0.05]">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] uppercase font-black tracking-widest text-white/40 mb-1">{stat.label}</p>
                <h3 className="text-2xl font-display font-black text-white">
                  {stat.prefix}{stat.value}
                </h3>
              </div>
              <div className={`p-3 rounded-xl bg-white/[0.03] ${stat.color} group-hover:scale-110 transition-transform`}>
                <stat.icon className="size-5" />
              </div>
            </div>
            <div className="absolute bottom-0 left-0 h-[2px] w-full bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
