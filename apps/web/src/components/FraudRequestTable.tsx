"use client";

import React, { useState } from "react";
import { FraudRequest, scoreFraudRequest } from "@/lib/api.client";
import { 
  ShieldAlert, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Fingerprint, 
  ShieldEllipsis,
  Activity,
  ArrowUpRight
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface FraudRequestTableProps {
  initialRequests: FraudRequest[];
}

export function FraudRequestTable({ initialRequests }: FraudRequestTableProps) {
  const [requests, setRequests] = useState<FraudRequest[]>(initialRequests);
  const [scoringIds, setScoringIds] = useState<Set<string>>(new Set());

  const handleScore = async (id: string) => {
    setScoringIds(prev => new Set(prev).add(id));
    try {
      await scoreFraudRequest(id);
      // Wait for 1s to simulate processing
      await new Promise(r => setTimeout(r, 1000));
      // In a real app we'd re-fetch, but for mock we just update status
      setRequests(current => 
        current.map(r => r.id === id ? { ...r, status: 'PROCESSED', category: 'CLEAN', fraud_score: 0.15 } : r)
      );
    } catch (err) {
      console.error(err);
    } finally {
      setScoringIds(prev => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    }
  };

  return (
    <div className="w-full">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-white/5 border-b border-white/10">
              <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Request ID</th>
              <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Worker ID</th>
              <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Zone</th>
              <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Amount</th>
              <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground">ML Score</th>
              <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Status</th>
              <th className="px-6 py-4 text-right text-[10px] font-black uppercase tracking-widest text-muted-foreground">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {requests.map((request) => {
              const isScoring = scoringIds.has(request.id);
              const score = request.fraud_score;
              const isHighRisk = score !== null && score !== undefined && score > 0.7;
              
              return (
                <tr key={request.id} className="group hover:bg-white/[0.02] transition-all">
                  <td className="px-6 py-5">
                    <span className="text-xs font-black text-white/90 font-mono tracking-tighter">#{request.id.slice(0, 8)}</span>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-2">
                      <div className="size-6 rounded-full bg-secondary/10 flex items-center justify-center border border-secondary/20">
                        <Fingerprint className="size-3 text-secondary" />
                      </div>
                      <span className="text-xs font-bold text-muted-foreground">{request.worker_id}</span>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <span className="text-[10px] font-black uppercase tracking-widest bg-white/5 px-2 py-1 rounded border border-white/5">{request.zone_name}</span>
                  </td>
                  <td className="px-6 py-5">
                    <span className="text-xs font-bold text-white">₹{request.amount.toLocaleString()}</span>
                  </td>
                  <td className="px-6 py-5">
                    {score !== null && score !== undefined ? (
                      <div className={cn(
                        "flex items-center gap-1.5 px-2 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border",
                        isHighRisk ? "bg-danger/10 text-danger border-danger/30 font-glow-danger" : "bg-success/10 text-success border-success/30 font-glow-success"
                      )}>
                        <Activity className="size-3" />
                        {(score * 100).toFixed(0)}%
                      </div>
                    ) : (
                      <span className="text-[9px] font-black uppercase tracking-widest opacity-30">Untested</span>
                    )}
                  </td>
                  <td className="px-6 py-5">
                    <div className={cn(
                      "inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border",
                      request.status === 'PENDING' ? "bg-warning/10 text-warning border-warning/30" : "bg-white/5 text-white/50 border-white/10"
                    )}>
                      {request.status === 'PENDING' ? <Clock className="size-3" /> : <CheckCircle2 className="size-3" />}
                      {request.status}
                    </div>
                  </td>
                  <td className="px-6 py-5 text-right">
                    <Button
                      onClick={() => handleScore(request.id)}
                      disabled={isScoring || request.status !== 'PENDING'}
                      size="sm"
                      className={cn(
                        "h-8 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all",
                        request.status === 'PENDING' 
                          ? "bg-secondary text-white hover:bg-secondary/80 shadow-[0_4px_20px_rgba(0,216,255,0.2)]" 
                          : "bg-white/5 text-white/30 border border-white/5"
                      )}
                    >
                      {isScoring ? (
                        <RefreshCcw className="size-3 animate-spin" />
                      ) : (
                        <>
                          <ShieldEllipsis className="size-3 mr-1.5" />
                          ML Audit
                        </>
                      )}
                    </Button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function RefreshCcw(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8" />
      <path d="M21 3v5h-5" />
    </svg>
  );
}
