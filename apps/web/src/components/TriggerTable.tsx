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
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Activity, Droplets, Thermometer, ShieldAlert, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";

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
    <div className="rounded-xl border border-border bg-card/50 backdrop-blur-sm overflow-hidden shadow-sm">
      <Table>
        <TableHeader className="bg-secondary/30">
          <TableRow className="hover:bg-transparent border-b border-border">
            <TableHead className="font-bold text-primary text-[11px] uppercase tracking-wider">Zone / Area</TableHead>
            <TableHead className="font-bold text-primary text-[11px] uppercase tracking-wider">
              <div className="flex items-center gap-2"><Droplets className="size-3" /> Rainfall</div>
            </TableHead>
            <TableHead className="font-bold text-primary text-[11px] uppercase tracking-wider">
              <div className="flex items-center gap-2"><Activity className="size-3" /> AQI</div>
            </TableHead>
            <TableHead className="font-bold text-primary text-[11px] uppercase tracking-wider">
              <div className="flex items-center gap-2"><Thermometer className="size-3" /> Heat Index</div>
            </TableHead>
            <TableHead className="font-bold text-primary text-[11px] uppercase tracking-wider">Status</TableHead>
            <TableHead className="font-bold text-primary text-[11px] uppercase tracking-wider">Source</TableHead>
            <TableHead className="font-bold text-primary text-[11px] uppercase tracking-wider">Payout</TableHead>
            <TableHead className="font-bold text-primary text-[11px] uppercase tracking-wider text-right">Last Updated</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading ? (
            Array.from({ length: 5 }).map((_, i) => (
              <TableRow key={i}>
                <TableCell colSpan={8}><Skeleton className="h-10 w-full rounded-md" /></TableCell>
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
                <TableRow key={row.zone} className="border-b border-border/50 hover:bg-foreground/5 transition-colors group">
                  <TableCell className="font-semibold text-foreground">{row.zone}</TableCell>
                  <TableCell className="font-mono text-xs opacity-70">{row.latestByType.Rainfall ? Number(row.latestByType.Rainfall.magnitude).toFixed(2) : "-"}</TableCell>
                  <TableCell className="font-mono text-xs opacity-70">{row.latestByType.AQI ? Number(row.latestByType.AQI.magnitude).toFixed(0) : "-"}</TableCell>
                  <TableCell className="font-mono text-xs opacity-70">{row.latestByType.HeatIndex ? Number(row.latestByType.HeatIndex.magnitude).toFixed(2) : "-"}</TableCell>
                  <TableCell>
                    {hasActive ? (
                      <Badge className="rounded-full bg-warning/10 text-warning border-none flex items-center gap-1 w-fit text-[10px] font-bold">
                        <ShieldAlert className="size-3" /> ACTIVE
                      </Badge>
                    ) : (
                      <Badge className="rounded-full bg-success/10 text-success border-none flex items-center gap-1 w-fit text-[10px] font-bold">
                        <ShieldCheck className="size-3" /> STABLE
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-1">
                      <Badge variant="outline" className={cn(
                        "rounded-full border-none font-bold text-[9px] w-fit px-2 py-0",
                        dataMode === "LIVE" ? "bg-success/20 text-success" : "bg-warning/20 text-warning"
                      )}>
                        {dataMode}
                      </Badge>
                      <span className="text-[10px] text-muted-foreground font-medium italic truncate max-w-[100px] opacity-60">
                        {zoneTriggers.map((z) => z.source).filter(Boolean).join(", ") || "Manual Input"}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="font-bold text-primary tabular-nums group-hover:scale-110 transition-transform origin-left">₹{maxPayout}</TableCell>
                  <TableCell className="text-[10px] text-muted-foreground font-medium text-right opacity-60">
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
