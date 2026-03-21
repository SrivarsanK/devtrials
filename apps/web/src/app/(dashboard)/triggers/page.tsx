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
import anime from "animejs";

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

  useEffect(() => {
    if (!loading) {
      const tl = anime.timeline({
        easing: 'easeOutExpo',
        duration: 1000
      });

      tl.add({
        targets: '.anime-header-item',
        translateY: [30, 0],
        opacity: [0, 1],
        delay: anime.stagger(100),
      })
      .add({
        targets: '.anime-trigger-row',
        translateX: [-20, 0],
        opacity: [0, 1],
        delay: anime.stagger(50),
      }, '-=600');
    }
  }, [loading]);

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
    <div className="flex flex-col gap-12">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-10">
        <div className="space-y-4">
          <div className="flex items-center gap-3 opacity-0 anime-header-item">
            <div className="h-[2px] w-10 bg-gradient-to-r from-primary to-transparent rounded-full" />
            <span className="text-[10px] font-medium uppercase tracking-[0.12em] text-muted-foreground opacity-60">Audit logs & event streaming</span>
          </div>
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-display font-black tracking-tight text-foreground uppercase leading-[0.85] opacity-0 anime-header-item">
            Event <br /> <span className="text-secondary italic">Stream</span>
          </h1>
          <p className="max-w-xl text-sm text-muted-foreground leading-relaxed font-medium opacity-0 anime-header-item">
            Detailed immutable log of all environmental events and their corresponding payout adjustments monitored by GigShield.
          </p>
        </div>
        <div className="opacity-0 anime-header-item">
          <Button
            onClick={handleManualPoll}
            disabled={polling}
            size="lg"
            className="rounded-xl bg-secondary text-white font-bold uppercase h-12 px-8 text-sm shadow-[0_0_20px_rgba(0,183,255,0.3)] hover:scale-105 active:scale-95 transition-all flex items-center gap-2.5 border-none"
          >
            {polling ? <RefreshCcw className="animate-spin" size={18} /> : <Zap className="fill-current" size={18} />}
            {polling ? "Requesting..." : "Execute Manual Poll"}
          </Button>
        </div>
      </header>

      <div className="rounded-2xl glass card-glow overflow-hidden relative group">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/3 via-transparent to-secondary/3 opacity-0 group-hover:opacity-100 transition-opacity duration-1000 pointer-events-none" />
        <Table className="relative z-10">
          <TableHeader className="bg-white/[0.02]">
            <TableRow className="hover:bg-transparent border-b border-white/[0.06]">
              <TableHead className="font-display font-black uppercase text-[12px] tracking-wider px-6 h-14 text-fs-blue">Event Source</TableHead>
              <TableHead className="font-display font-black uppercase text-[12px] tracking-wider h-14 text-fs-purple">Geo Area</TableHead>
              <TableHead className="font-display font-black uppercase text-[12px] tracking-wider h-14 text-fs-yellow">Intensity</TableHead>
              <TableHead className="font-display font-black uppercase text-[12px] tracking-wider h-14 text-secondary">Env Metrics</TableHead>
              <TableHead className="font-display font-black uppercase text-[12px] tracking-wider h-14 text-fs-green">Status</TableHead>
              <TableHead className="font-display font-black uppercase text-[12px] tracking-wider text-right pr-6 h-14 text-primary">Impact</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              Array.from({ length: 8 }).map((_, i) => (
                <TableRow key={i} className="border-b border-white/[0.04]">
                  <TableCell colSpan={6} className="h-16 px-6">
                    <div className="w-full h-6 bg-white/[0.03] animate-pulse rounded-lg" />
                  </TableCell>
                </TableRow>
              ))
            ) : triggers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center h-[50vh] py-16">
                  <div className="flex flex-col items-center gap-4">
                    <div className="size-16 rounded-full glass flex items-center justify-center">
                      <AlertCircle size={32} className="text-muted-foreground opacity-40" />
                    </div>
                    <span className="uppercase tracking-widest text-xs text-muted-foreground">No event records detected in the monitoring pipeline.</span>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              triggers.map((t) => (
                <TableRow key={t.id} className="border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors group/row anime-trigger-row opacity-0">
                  <TableCell className="px-6 py-5">
                    <div className="flex items-center gap-3">
                      <div className="flex aspect-square size-10 items-center justify-center rounded-xl glass group-hover/row:border-primary/20 transition-all duration-300">
                        {t.type === "Rainfall" ? <Droplets className="size-5 text-blue-400" /> :
                          t.type === "AQI" ? <Wind className="size-5 text-success" /> :
                            <Flame className="size-5 text-amber-400" />}
                      </div>
                      <div className="flex flex-col gap-0.5">
                        <span className="text-sm font-bold text-foreground uppercase">{t.type}</span>
                        <span className="text-[8px] font-mono text-muted-foreground opacity-50">HASH: {t.id.slice(0, 8)}</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="size-1.5 bg-secondary rounded-full neon-secondary" />
                      <span className="font-medium text-sm text-foreground">{t.zone}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-0.5">
                      <span className="text-xl font-bold text-primary tabular-nums font-mono">
                        {t.magnitude}{t.type === "Rainfall" ? "mm" : t.type === "AQI" ? "" : "°C"}
                      </span>
                      <span className="text-[8px] font-medium uppercase text-muted-foreground tracking-wider opacity-50">Recorded Delta</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-x-4 gap-y-1">
                      {t.metadata?.temperature && (
                        <div className="flex items-center gap-1.5 text-[10px] font-medium text-foreground">
                          <Activity className="size-3 text-amber-400" strokeWidth={2.5} />
                          <span>{t.metadata.temperature.toFixed(1)}°C</span>
                        </div>
                      )}
                      {t.metadata?.humidity && (
                        <div className="flex items-center gap-1.5 text-[10px] font-medium text-foreground">
                          <Droplets className="size-3 text-blue-400" strokeWidth={2.5} />
                          <span>{t.metadata.humidity}%</span>
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={cn(
                      "rounded-lg border-none px-3 py-1 text-[10px] font-black uppercase tracking-wider text-white shadow-sm",
                      t.status === "ACTIVE" || t.status === "PROCESSED"
                        ? "bg-fs-green"
                        : "bg-white/[0.05] text-muted-foreground"
                    )}>
                      {t.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right pr-6">
                    <div className="flex flex-col items-end gap-1">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl font-bold text-foreground tabular-nums font-mono">₹{t.payoutAmount}</span>
                        <ArrowUpRight className="size-4 text-success group-hover/row:translate-x-0.5 group-hover/row:-translate-y-0.5 transition-transform" />
                      </div>
                      <div className="flex items-center gap-1.5 text-[9px] font-medium text-muted-foreground opacity-50">
                        <Clock className="size-2.5" />
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
