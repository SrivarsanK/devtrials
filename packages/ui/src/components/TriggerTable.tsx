"use client";

import React from "react";
import { Trigger } from "@/lib/api";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import { Badge } from "./ui/badge";
import { Skeleton } from "./ui/skeleton";
import { Activity, Droplets, Thermometer, ShieldAlert, ShieldCheck } from "lucide-react";
import { cn } from "../lib/utils";

interface TriggerTableProps {
  triggers: Trigger[];
  loading: boolean;
}

export default function TriggerTable({ triggers, loading }: TriggerTableProps) {
  const getDataMode = (source?: string) => {
    const normalized = (source || "").toLowerCase();
    if (!normalized) return "MOCK";
    if (normalized.includes("mock") || normalized.includes("manual")) return "MOCK";
    return "LIVE";
  };

  const typeOrder: Array<Trigger["type"]> = ["Rainfall", "AQI", "HeatIndex"];

  const zoneRows = React.useMemo(() => {
    const grouped = new Map<string, { zone: string; latestByType: Partial<Record<Trigger["type"], Trigger>>; lastUpdated: string }>();
    const sorted = [...triggers].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    for (const trigger of sorted) {
      const zoneKey = trigger.zone || "Unknown Zone";
      if (!grouped.has(zoneKey)) {
        grouped.set(zoneKey, {
          zone: zoneKey,
          latestByType: {},
          lastUpdated: trigger.timestamp,
        });
      }
      const entry = grouped.get(zoneKey)!;
      if (!entry.latestByType[trigger.type]) {
        entry.latestByType[trigger.type] = trigger;
      }
      if (new Date(trigger.timestamp).getTime() > new Date(entry.lastUpdated).getTime()) {
        entry.lastUpdated = trigger.timestamp;
      }
    }

    return Array.from(grouped.values()).sort((a, b) => a.zone.localeCompare(b.zone));
  }, [triggers]);

  return (
    <div className="rounded-2xl glass overflow-hidden">
      <Table>
        <TableHeader className="bg-white/[0.03] border-b border-white/[0.1]">
          <TableRow className="hover:bg-transparent border-none">
            <TableHead className="font-display font-black text-secondary text-[11px] uppercase tracking-wider px-6 h-14">Zone / Area</TableHead>
            <TableHead className="font-display font-black text-secondary text-[11px] uppercase tracking-wider h-14">
              <div className="flex items-center gap-2"><Droplets className="size-4 text-fs-blue" /> Rainfall</div>
            </TableHead>
            <TableHead className="font-display font-black text-secondary text-[11px] uppercase tracking-wider h-14">
              <div className="flex items-center gap-2"><Activity className="size-4 text-fs-purple" /> AQI</div>
            </TableHead>
            <TableHead className="font-display font-black text-secondary text-[11px] uppercase tracking-wider h-14">
              <div className="flex items-center gap-2"><Thermometer className="size-4 text-fs-yellow" /> Heat Index</div>
            </TableHead>
            <TableHead className="font-display font-black text-secondary text-[11px] uppercase tracking-wider h-14">Status</TableHead>
            <TableHead className="font-display font-black text-secondary text-[11px] uppercase tracking-wider h-14">Source</TableHead>
            <TableHead className="font-display font-black text-secondary text-[11px] uppercase tracking-wider h-14">Payout</TableHead>
            <TableHead className="font-display font-black text-secondary text-[11px] uppercase tracking-wider text-right pr-6 h-14">Last Updated</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading ? (
            Array.from({ length: 5 }).map((_, i) => (
              <TableRow key={i} className="border-b border-white/[0.04]">
                <TableCell colSpan={8}><Skeleton className="h-8 w-full rounded-lg bg-white/[0.03]" /></TableCell>
              </TableRow>
            ))
          ) : zoneRows.length === 0 ? (
            <TableRow>
              <TableCell colSpan={8} className="text-center h-32 font-medium text-muted-foreground opacity-50">
                No active monitored data found.
              </TableCell>
            </TableRow>
          ) : (
            zoneRows.map((row) => {
              const zoneTriggers = typeOrder
                .map((t) => row.latestByType[t])
                .filter((v): v is Trigger => Boolean(v));
              const hasActive = zoneTriggers.some((z) => z.status === "ACTIVE");
              const maxPayout = zoneTriggers.reduce((acc, z) => Math.max(acc, z.payoutAmount || 0), 0);
              const dataMode = zoneTriggers.every((z) => getDataMode(z.source) === "LIVE") ? "LIVE" : "MOCK";

              return (
                <TableRow key={row.zone} className="border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors group">
                  <TableCell className="font-display font-black text-foreground px-6 py-5">{row.zone}</TableCell>
                  <TableCell className="font-mono text-sm text-muted-foreground/80 font-black">
                    <div className="flex flex-col">
                      <span>{row.latestByType.Rainfall ? Number(row.latestByType.Rainfall.magnitude).toFixed(2) : "-"}</span>
                      {row.latestByType.Rainfall?.metadata?.minuteCast && (
                        <span className="text-[9px] text-fs-blue/70 font-display uppercase tracking-[0.2px] leading-tight mt-0.5">
                          {row.latestByType.Rainfall.metadata.minuteCast}
                        </span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="font-mono text-sm text-muted-foreground/80 font-black">{row.latestByType.AQI ? Number(row.latestByType.AQI.magnitude).toFixed(0) : "-"}</TableCell>
                  <TableCell className="font-mono text-sm text-muted-foreground/80 font-black">
                    <div className="flex flex-col">
                      <span>{row.latestByType.HeatIndex ? Number(row.latestByType.HeatIndex.magnitude).toFixed(2) : "-"}</span>
                      {row.latestByType.HeatIndex?.metadata?.accuWeatherHeadline && (
                        <span className="text-[9px] text-fs-yellow/70 font-display uppercase tracking-[0.2px] leading-tight mt-0.5 max-w-[120px] truncate">
                          {row.latestByType.HeatIndex.metadata.accuWeatherHeadline}
                        </span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    {hasActive ? (
                      <Badge className="rounded-lg bg-fs-red text-white border-none flex items-center gap-1.5 w-fit text-[10px] font-black px-2.5 py-1 uppercase shadow-[0_0_10px_rgba(255,59,48,0.25)]">
                        <ShieldAlert className="size-3.5" /> ACTIVE
                      </Badge>
                    ) : (
                      <Badge className="rounded-lg bg-fs-green text-white border-none flex items-center gap-1.5 w-fit text-[10px] font-black px-2.5 py-1 uppercase shadow-[0_0_10px_rgba(40,167,69,0.25)]">
                        <ShieldCheck className="size-3.5" /> STABLE
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-1">
                      <Badge variant="outline" className={cn(
                        "rounded-full border-none font-black text-[8px] w-fit px-2 py-0",
                        dataMode === "LIVE" ? "bg-success/15 text-success" : "bg-warning/15 text-warning"
                      )}>
                        {dataMode}
                      </Badge>
                      <span className="text-[9px] text-muted-foreground font-medium truncate max-w-[100px] opacity-50">
                        {zoneTriggers.map((z) => z.source).filter(Boolean).join(", ") || "Manual Input"}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="font-black text-primary tabular-nums font-mono group-hover:scale-105 transition-transform origin-left">₹{maxPayout}</TableCell>
                  <TableCell className="text-[10px] text-muted-foreground font-medium text-right pr-5 opacity-50">
                    {new Date(row.lastUpdated).toLocaleTimeString()}
                  </TableCell>
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>
    </div>
  );
}

