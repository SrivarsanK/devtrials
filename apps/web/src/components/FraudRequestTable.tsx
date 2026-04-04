"use client";

import React from "react";
import { FraudRequest, scoreFraudRequest } from "@/lib/api";
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
import { Button } from "@/components/ui/button";
import { ShieldAlert, ShieldCheck, ShieldQuestion, BrainCircuit, Fingerprint } from "lucide-react";
import { cn } from "@/lib/utils";

interface FraudRequestTableProps {
  requests: FraudRequest[];
  loading: boolean;
  onRefresh: () => void;
}

export default function FraudRequestTable({ requests, loading, onRefresh }: FraudRequestTableProps) {
  const [scoringId, setScoringId] = React.useState<string | null>(null);

  const handleScore = async (id: string) => {
    setScoringId(id);
    try {
      await scoreFraudRequest(id);
      onRefresh();
    } catch (err) {
      console.error("Score failed", err);
    } finally {
      setScoringId(null);
    }
  };

  const getStatusBadge = (status: string, category?: string) => {
    if (status === 'PENDING') {
        return (
            <Badge className="rounded-lg bg-fs-blue/20 text-fs-blue hover:bg-fs-blue/30 border-none flex items-center gap-1.5 w-fit text-[10px] font-black px-2.5 py-1 uppercase">
                <ShieldQuestion className="size-3.5" /> UNPROCESSED
            </Badge>
        );
    }

    if (category === 'FRAUD' || category === 'SUSPICIOUS') {
        return (
            <Badge className="rounded-lg bg-fs-red text-white border-none flex items-center gap-1.5 w-fit text-[10px] font-black px-2.5 py-1 uppercase shadow-[0_0_10px_rgba(255,59,48,0.25)]">
                <ShieldAlert className="size-3.5" /> {category}
            </Badge>
        );
    }

    if (category === 'HOLD_24HR') {
        return (
            <Badge className="rounded-lg bg-fs-yellow text-black border-none flex items-center gap-1.5 w-fit text-[10px] font-black px-2.5 py-1 uppercase">
                <ShieldAlert className="size-3.5 text-black" /> {category}
            </Badge>
        );
    }

    return (
        <Badge className="rounded-lg bg-fs-green text-white border-none flex items-center gap-1.5 w-fit text-[10px] font-black px-2.5 py-1 uppercase shadow-[0_0_10px_rgba(40,167,69,0.25)]">
            <ShieldCheck className="size-3.5" /> {category || 'SAFE'}
        </Badge>
    );
  };

  return (
    <div className="rounded-2xl glass overflow-hidden">
      <Table>
        <TableHeader className="bg-white/[0.03] border-b border-white/[0.1]">
          <TableRow className="hover:bg-transparent border-none">
            <TableHead className="font-display font-black text-secondary text-[11px] uppercase tracking-wider px-6 h-14">Worker ID</TableHead>
            <TableHead className="font-display font-black text-secondary text-[11px] uppercase tracking-wider h-14">Zone</TableHead>
            <TableHead className="font-display font-black text-secondary text-[11px] uppercase tracking-wider h-14">Type / Amount</TableHead>
            <TableHead className="font-display font-black text-secondary text-[11px] uppercase tracking-wider h-14">Fraud Score</TableHead>
            <TableHead className="font-display font-black text-secondary text-[11px] uppercase tracking-wider h-14">Decision</TableHead>
            <TableHead className="font-display font-black text-secondary text-[11px] uppercase tracking-wider h-14">Signals</TableHead>
            <TableHead className="font-display font-black text-secondary text-[11px] uppercase tracking-wider text-right pr-6 h-14">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading ? (
            Array.from({ length: 5 }).map((_, i) => (
              <TableRow key={i} className="border-b border-white/[0.04]">
                <TableCell colSpan={7}><Skeleton className="h-8 w-full rounded-lg bg-white/[0.03]" /></TableCell>
              </TableRow>
            ))
          ) : requests.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center h-32 font-medium text-muted-foreground opacity-50">
                No fraud requests found.
              </TableCell>
            </TableRow>
          ) : (
            requests.map((req) => (
              <TableRow key={req.id} className="border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors group">
                <TableCell className="font-mono font-bold text-foreground px-6 py-5">
                  <div className="flex items-center gap-2">
                    <Fingerprint className="size-4 text-fs-blue/50" />
                    #{req.worker_id}
                  </div>
                </TableCell>
                <TableCell className="font-display font-black text-muted-foreground/90">{req.zone_name}</TableCell>
                <TableCell>
                    <div className="flex flex-col">
                        <span className="font-display font-black text-[11px] text-secondary opacity-70 uppercase tracking-tighter">{req.request_type}</span>
                        <span className="font-mono font-bold text-primary">₹{req.amount}</span>
                    </div>
                </TableCell>
                <TableCell>
                  {req.fraud_score !== undefined ? (
                    <div className="flex flex-col gap-1">
                        <div className="w-24 bg-white/[0.05] h-1.5 rounded-full overflow-hidden">
                            <div 
                                className={cn(
                                    "h-full transition-all",
                                    (req.fraud_score || 0) > 0.7 ? "bg-fs-red" : (req.fraud_score || 0) > 0.4 ? "bg-fs-yellow" : "bg-fs-green"
                                )} 
                                style={{ width: `${(req.fraud_score || 0) * 100}%` }}
                            />
                        </div>
                        <span className="font-mono text-[10px] font-bold text-muted-foreground">{(req.fraud_score * 100).toFixed(1)}% risk</span>
                    </div>
                  ) : "-"}
                </TableCell>
                <TableCell>
                  {getStatusBadge(req.status, req.category)}
                </TableCell>
                <TableCell>
                    <div className="flex flex-wrap gap-1 max-w-[200px]">
                        {Array.isArray(req.top_signals) && req.top_signals.map((s, idx) => (
                            <Badge key={idx} variant="outline" className="text-[8px] border-white/10 bg-white/5 opacity-60">
                                {s}
                            </Badge>
                        ))}
                        {(!req.top_signals || req.top_signals.length === 0) && <span className="text-[10px] text-muted-foreground opacity-30">None detected</span>}
                    </div>
                </TableCell>
                <TableCell className="text-right pr-6">
                  {req.status === 'PENDING' ? (
                    <Button 
                        size="sm" 
                        variant="secondary"
                        disabled={scoringId === req.id}
                        onClick={() => handleScore(req.id)}
                        className="bg-fs-purple hover:bg-fs-purple/80 text-white border-none h-8 font-black text-[10px] px-4 rounded-lg flex items-center gap-2"
                    >
                        <BrainCircuit className={cn("size-3.5", scoringId === req.id && "animate-spin")} />
                        {scoringId === req.id ? "SCOURING..." : "ML SCORE"}
                    </Button>
                  ) : (
                    <span className="text-[10px] font-mono text-muted-foreground/40 italic">Audit Log: {new Date(req.created_at).toLocaleDateString()}</span>
                  )}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
