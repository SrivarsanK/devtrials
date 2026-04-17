"use client";

import { useEffect } from "react";
import { useSocket } from "@/components/providers/socket-provider";
import { useTriggerSimulationStore } from "@/hooks/use-trigger-simulation-store";
import { toast } from "sonner";

export function useTriggerSimulation() {
  const { socket, isConnected } = useSocket();
  const { appendEvent, setCardStatus } = useTriggerSimulationStore();

  useEffect(() => {
    if (!socket || !isConnected) return;

    function onTriggerSimulated(data: any) {
      appendEvent(data);
      toast.success(`Simulation Complete: ${data.triggerId} fired`, {
        description: `${data.affectedWorkers} workers impacted in ${data.zone}.`,
      });
    }

    function onTriggerFiring(data: any) {
      setCardStatus(data.triggerId, 'firing');
      toast.info(`Deploying Simulation: ${data.triggerId}...`, {
        description: `Targeting ${data.zone}. High-intensity load incoming.`,
      });
    }

    function onTriggerError(data: any) {
      setCardStatus(data.triggerId, 'error');
      toast.error(`Simulation Error: ${data.triggerId}`, {
        description: data.message,
      });
    }

    socket.on('trigger:simulated', onTriggerSimulated);
    socket.on('trigger:firing', onTriggerFiring);
    socket.on('trigger:error', onTriggerError);

    return () => {
      socket.off('trigger:simulated', onTriggerSimulated);
      socket.off('trigger:firing', onTriggerFiring);
      socket.off('trigger:error', onTriggerError);
    };
  }, [socket, isConnected, appendEvent, setCardStatus]);

  return { isConnected };
}
