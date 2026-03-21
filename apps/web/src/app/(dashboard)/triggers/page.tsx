"use client";

import React, { useEffect, useState } from "react";
import { fetchTriggers, manualPoll, Trigger } from "@/lib/api";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  RefreshCcw, 
  Droplets, 
  Wind, 
  Flame, 
  Activity, 
  Clock, 
  AlertCircle,
  ArrowUpRight,
  Zap
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function TriggersPage() {
  const [triggers, setTriggers] = useState<Trigger[]>([]);
  const [loading, setLoading] = useState(true);
  const [polling, setPolling] = useState(false);

  async function loadData() {
    try {
      setLoading(true);
      const data = await fetchTriggers();
      setTriggers(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  async function handleManualPoll() {
    try {
      setPolling(true);
      await manualPoll();
      await loadData();
    } catch {
      alert("Poll failed - server connection issue.");
    } finally {
      setPolling(false);
    }
  }

  return (
    <div className="flex flex-col gap-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="h-0.5 w-12 bg-primary rounded-full shadow-[0_0_10px_var(--primary)]" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground opacity-60">Audit logs & event streaming</span>
          </div>
          <h1 className="text-7xl font-bebas tracking-wide text-foreground leading-[0.85]">
            Event <br /> <span className="text-primary italic">Stream</span>
          </h1>
          <p className="max-w-xl text-base font-medium text-muted-foreground leading-relaxed">
            Detailed immutable log of all environmental events and their corresponding payout adjustments monitored by GigShield.
          </p>
        </div>
        <Button 
          onClick={handleManualPoll}
          disabled={polling}
          size="lg"
          className="rounded-2xl bg-secondary hover:bg-secondary/90 text-secondary-foreground font-black uppercase h-16 px-10 shadow-xl shadow-secondary/10 hover:scale-105 active:scale-95 transition-all flex items-center gap-3"
        >
          {polling ? <RefreshCcw className="animate-spin" size={20} /> : <Zap className="fill-current" size={20} />}
          {polling ? "Requesting..." : "Execute Manual Poll"}
        </Button>
      </header>

      <div className="rounded-[2.5rem] border border-border bg-card/30 backdrop-blur-md shadow-2xl overflow-hidden group">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
        <Table className="relative z-10">
          <TableHeader className="bg-muted/30">
            <TableRow className="hover:bg-transparent border-b border-border/50">
              <TableHead className="font-bold uppercase text-[10px] tracking-widest px-8 h-16 text-muted-foreground">Event Source</TableHead>
              <TableHead className="font-bold uppercase text-[10px] tracking-widest h-16 text-muted-foreground">Geo Area</TableHead>
              <TableHead className="font-bold uppercase text-[10px] tracking-widest h-16 text-muted-foreground">Intensity</TableHead>
              <TableHead className="font-bold uppercase text-[10px] tracking-widest h-16 text-muted-foreground">Env Metrics</TableHead>
              <TableHead className="font-bold uppercase text-[10px] tracking-widest h-16 text-muted-foreground">Status</TableHead>
              <TableHead className="font-bold uppercase text-[10px] tracking-widest text-right pr-8 h-16 text-muted-foreground">Impact</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              Array.from({ length: 10 }).map((_, i) => (
                <TableRow key={i} className="border-b border-border/20">
                  <TableCell colSpan={6} className="h-20 px-8">
                    <div className="w-full h-8 bg-muted/40 animate-pulse rounded-lg" />
                  </TableCell>
                </TableRow>
              ))
            ) : triggers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center h-[50vh] py-20 font-bold text-muted-foreground">
                  <div className="flex flex-col items-center gap-6">
                    <div className="size-20 rounded-full bg-muted/20 flex items-center justify-center">
                      <AlertCircle size={40} className="opacity-40" />
                    </div>
                    <span className="uppercase tracking-widest text-xs">No event records detected in the monitoring pipeline.</span>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              triggers.map((t) => (
                <TableRow key={t.id} className="border-b border-border/20 hover:bg-muted/20 transition-colors group/row">
                  <TableCell className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className="flex aspect-square size-12 items-center justify-center rounded-2xl bg-card border border-border shadow-md group-hover/row:scale-110 group-hover/row:border-primary/30 transition-all duration-300">
                        {t.type === "Rainfall" ? <Droplets className="size-6 text-primary" /> : 
                         t.type === "AQI" ? <Wind className="size-6 text-success" /> : 
                         <Flame className="size-6 text-warning" />}
                      </div>
                      <div className="flex flex-col gap-0.5">
                        <span className="text-sm font-black uppercase tracking-tight text-foreground">{t.type}</span>
                        <span className="text-[9px] font-mono font-bold text-muted-foreground opacity-60">HASH: {t.id.slice(0, 8)}</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2.5">
                      <div className="size-2 bg-primary rounded-full shadow-[0_0_8px_var(--primary)]" />
                      <span className="font-bold text-sm tracking-tight text-foreground uppercase">{t.zone}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-0.5">
                      <span className="text-2xl font-black text-secondary italic tabular-nums">
                        {t.magnitude}{t.type === "Rainfall" ? "mm" : t.type === "AQI" ? "" : "°C"}
                      </span>
                      <span className="text-[8px] font-bold uppercase text-muted-foreground tracking-widest opacity-60">Recorded Delta</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-x-6 gap-y-2">
                      {t.metadata?.temperature && (
                        <div className="flex items-center gap-2 text-[10px] font-bold text-foreground">
                          <Activity className="size-3.5 text-warning" strokeWidth={3} />
                          <span>{t.metadata.temperature.toFixed(1)}°C</span>
                        </div>
                      )}
                      {t.metadata?.humidity && (
                        <div className="flex items-center gap-2 text-[10px] font-bold text-foreground">
                          <Droplets className="size-3.5 text-primary" strokeWidth={3} />
                          <span>{t.metadata.humidity}%</span>
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={cn(
                      "rounded-full border-2 px-3 py-1 text-[9px] font-black uppercase tracking-tighter",
                      t.status === "ACTIVE" || t.status === "PROCESSED" 
                        ? "bg-success/10 border-success/20 text-success" 
                        : "bg-muted border-border text-muted-foreground"
                    )}>
                      {t.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right pr-8">
                    <div className="flex flex-col items-end gap-1">
                      <div className="flex items-center gap-2">
                        <span className="text-3xl font-black text-foreground tabular-nums tracking-tighter">₹{t.payoutAmount}</span>
                        <ArrowUpRight className="size-5 text-success group-hover/row:translate-x-1 group-hover/row:-translate-y-1 transition-transform" />
                      </div>
                      <div className="flex items-center gap-2 text-[9px] font-bold uppercase text-muted-foreground tracking-widest opacity-60">
                        <Clock className="size-3" />
                        <span>{new Date(t.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
