"use client";

import React, { useEffect, useState } from "react";
import { fetchFraudRequests, FraudRequest } from "@/lib/api.client";
import { FraudRequestTable } from "@/components/FraudRequestTable";
import { ShieldCheck, Activity, Search } from "lucide-react";

export default function RequestsPage() {
  const [requests, setRequests] = useState<FraudRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function init() {
      try {
        const data = await fetchFraudRequests();
        setRequests(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    init();
  }, []);

  return (
    <div className="flex flex-col gap-8 p-8">
      <header className="flex justify-between items-center bg-zinc-900/50 p-6 rounded-2xl border border-white/5">
        <div className="flex items-center gap-4">
          <div className="size-12 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20">
            <ShieldCheck className="size-7 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-black uppercase tracking-tight text-white">Fraud Verification Audit</h1>
            <p className="text-xs text-muted-foreground font-bold uppercase tracking-widest opacity-60">Real-time risk assessment queue</p>
          </div>
        </div>
      </header>

      <div className="glass rounded-3xl border border-white/5 overflow-hidden">
        {loading ? (
          <div className="h-64 flex flex-col items-center justify-center gap-4">
            <div className="size-10 rounded-full border-2 border-primary/30 border-t-primary animate-spin" />
            <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground animate-pulse">Syncing with Oracle...</span>
          </div>
        ) : (
          <FraudRequestTable initialRequests={requests} />
        )}
      </div>
    </div>
  );
}
