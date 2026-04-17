"use client";

import { useTriggerSimulationStore } from "@/hooks/use-trigger-simulation-store";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Trash2, History, Radio } from "lucide-react";

export function TriggerEventLog() {
  const { eventLog, clearLog } = useTriggerSimulationStore();

  return (
    <Card className="glass border-white/[0.05] flex flex-col h-[400px]">
      <CardHeader className="flex flex-row items-center justify-between py-4 border-b border-white/[0.05]">
        <div className="flex items-center gap-2">
          <Radio className="size-4 text-primary animate-pulse" />
          <CardTitle className="text-sm font-black uppercase tracking-widest text-white">Live Simulation Feed</CardTitle>
        </div>
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={clearLog}
          className="size-8 rounded-lg hover:bg-white/[0.05] text-white/20 hover:text-white"
        >
          <Trash2 className="size-4" />
        </Button>
      </CardHeader>
      <CardContent className="flex-1 p-0 overflow-hidden">
        <ScrollArea className="h-full">
          <div className="p-4 space-y-2">
            {eventLog.length === 0 ? (
              <div className="flex flex-col items-center justify-center p-8 text-white/10 italic text-xs">
                <History className="size-8 mb-2 opacity-5" />
                No events recorded. Fire a trigger to see simulation logs.
              </div>
            ) : (
              eventLog.map((event, i) => (
                <div 
                  key={event.eventId} 
                  className="group flex flex-col p-3 rounded-xl bg-white/[0.02] border border-white/[0.03] hover:bg-white/[0.04] transition-colors"
                >
                  <div className="flex justify-between items-start mb-1">
                    <span className="text-[10px] font-black text-primary uppercase italic">
                      [{new Date(event.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}] {event.triggerId}
                    </span>
                    <span className="text-[9px] font-bold text-white/20 uppercase tracking-tighter">Event: {event.eventId.slice(0,8)}</span>
                  </div>
                  <div className="flex flex-wrap gap-x-4 gap-y-1">
                    <span className="text-xs font-medium text-white/60">Zone: <span className="text-white font-bold">{event.zone}</span></span>
                    <span className="text-xs font-medium text-white/60">Intensity: <span className="text-white font-bold">{event.intensity}</span></span>
                    <span className="text-xs font-medium text-white/60">Affected: <span className="text-emerald-400 font-bold">{event.affectedWorkers}</span></span>
                    <span className="text-xs font-medium text-white/60">Payout: <span className="text-primary font-bold">₹{event.totalPayout.toLocaleString()}</span></span>
                    <span className="text-xs font-medium text-white/60">Fraud Score: <span className="text-amber-400 font-bold">{event.avgFraudScore.toFixed(1)}</span></span>
                  </div>
                </div>
              ))
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
