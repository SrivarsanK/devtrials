"use client";

import { TRIGGER_CONFIGS } from "./triggerConfig";
import { TriggerCard } from "./TriggerCard";
import { TriggerEventLog } from "./TriggerEventLog";
import { TriggerStatsRow } from "./TriggerStatsRow";
import { useTriggerSimulation } from "./useTriggerSimulation";
import { AlertCircle, Zap } from "lucide-react";

export function TriggerSimulation() {
  useTriggerSimulation();

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-display font-black text-white flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10 text-primary">
              <Zap className="size-5" />
            </div>
            Trigger Simulation Control Panel
          </h2>
          <p className="text-white/40 text-sm font-medium mt-1 uppercase tracking-widest">
            Fire parametric disruptions for testing, QA, and stress-testing
          </p>
        </div>
      </div>

      {/* Warning Banner */}
      <div className="bg-amber-500/10 border border-amber-500/20 rounded-2xl p-4 flex items-center gap-4">
        <div className="p-2 rounded-lg bg-amber-500/20 text-amber-500">
          <AlertCircle className="size-5" />
        </div>
        <div>
          <p className="text-xs font-black uppercase tracking-widest text-amber-500/80">Simulation mode active</p>
          <p className="text-[11px] font-medium text-white/40">
            Fired triggers will create real database entries, call ML services, and dispatch mock payouts to the system.
          </p>
        </div>
      </div>

      {/* Stats */}
      <TriggerStatsRow />

      {/* Responsive Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
        {TRIGGER_CONFIGS.map(config => (
          <TriggerCard key={config.id} config={config} />
        ))}
      </div>

      {/* Log */}
      <div className="grid grid-cols-1 gap-6">
        <TriggerEventLog />
      </div>
    </div>
  );
}
