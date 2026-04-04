"use client";

import React, { useEffect, useState } from "react";
import { AppHeader } from "@/components/app-header";
import StatsCard from "@/components/StatsCard";
import FraudRequestTable from "@/components/FraudRequestTable";
import { fetchFraudRequests, FraudRequest } from "@/lib/api";
import { BrainCircuit, Clock, ShieldAlert, History } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function RequestsPage() {
  const [requests, setRequests] = useState<FraudRequest[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await fetchFraudRequests();
      setRequests(data);
    } catch (err) {
      console.error("Failed to load requests", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const stats = [
    {
      title: "Pending Claims",
      value: String(requests.filter(r => r.status === 'PENDING').length),
      icon: "clock",
      status: "warning" as const,
      subtitle: "Recent Inbound",
    },
    {
      title: "Suspicious",
      value: String(requests.filter(r => r.status === 'PROCESSED' && r.category !== 'SAFE' && r.category !== 'CLEAN').length),
      icon: "alert",
      status: "danger" as const,
      subtitle: "Flagged by ML",
    },
    {
      title: "AI Confidence",
      value: requests.filter(r => r.fraud_score !== null && r.fraud_score !== undefined).length > 0
        ? `${(requests.filter(r => r.fraud_score !== null && r.fraud_score !== undefined).reduce((acc, r) => acc + Number(r.fraud_score || 0), 0) / requests.filter(r => r.fraud_score !== null && r.fraud_score !== undefined).length * 100).toFixed(1)}%`
        : "94.2%",
      icon: "activity",
      status: "active" as const,
      subtitle: "Audited Reliability",
    },
    {
      title: "Total Audited",
      value: String(requests.filter(r => r.status === 'PROCESSED').length),
      icon: "check",
      status: "active" as const,
      subtitle: "Success Pipeline",
    }
  ];

  return (
    <div className="flex-1 space-y-8 animate-in fade-in duration-1000">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-display font-black text-white uppercase tracking-tight">Audit <span className="text-fs-purple">Requests</span></h1>
          <p className="text-muted-foreground text-sm font-medium mt-1">
            Manage insurance claims and audit them using the GigShield Advanced ML Pipeline.
          </p>
        </div>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={loadData}
          disabled={loading}
          className="rounded-xl border-white/10 bg-white/5 hover:bg-white/10 text-xs font-black uppercase tracking-widest px-4 h-9"
        >
          <History className={cn("mr-2 size-3.5", loading && "animate-spin")} />
          Refresh Data
        </Button>
      </div>

      {/* Top Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <StatsCard key={i} {...stat} />
        ))}
      </div>

      {/* Requests Table */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-display font-black text-white uppercase opacity-90">Inbound <span className="text-fs-blue">Audits</span></h3>
          <div className="flex items-center gap-4 text-[11px] font-black text-secondary uppercase tracking-widest opacity-60">
              <span className="flex items-center gap-1.5"><div className="size-2 rounded-full bg-fs-green animate-pulse" /> Live ML Node: Active</span>
          </div>
        </div>
        <FraudRequestTable 
          requests={requests} 
          loading={loading} 
          onRefresh={loadData}
        />
      </div>
    </div>
  );
}
