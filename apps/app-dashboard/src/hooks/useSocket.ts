'use client';

import { useEffect, useRef } from 'react';
import { useDashboardStore } from '@/store/dashboardStore';
import { createSocket, disconnectSocket, createMockSocketSimulator } from '@/services/socket';

const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK === 'true';

export function useSocket() {
  const cleanupRef = useRef<(() => void) | null>(null);
  const setSocketConnected = useDashboardStore((s) => s.setSocketConnected);
  const setReserveHealth = useDashboardStore((s) => s.setReserveHealth);
  const addTrigger = useDashboardStore((s) => s.addTrigger);
  const clearTrigger = useDashboardStore((s) => s.clearTrigger);
  const addFraudAlert = useDashboardStore((s) => s.addFraudAlert);

  useEffect(() => {
    if (USE_MOCK) {
      // In mock mode, use the simulator to keep the dashboard feeling alive
      const simulator = createMockSocketSimulator({
        onReserveUpdate: () => {
          // Small fluctuations handled by the simulator itself
        },
        onTriggerUpdate: ({ id, progressBump }) => {
          const state = useDashboardStore.getState();
          const existing = state.activeTriggers.find((t) => t.id === id);
          if (existing) {
            const newProgress = Math.min(existing.progressPercent + progressBump, 100);
            const newStatus = newProgress >= 100 ? 'TRIGGERED' : existing.status;
            addTrigger({
              ...existing,
              progressPercent: Math.round(newProgress * 10) / 10,
              status: newStatus,
            });
          }
        },
      });
      setSocketConnected(true);
      cleanupRef.current = () => {
        simulator.stop();
        setSocketConnected(false);
      };
    } else {
      // Real socket connection
      const socket = createSocket();

      socket.on('connect', () => setSocketConnected(true));
      socket.on('disconnect', () => setSocketConnected(false));

      socket.on('trigger:fired', (trigger) => addTrigger(trigger));
      socket.on('trigger:cleared', (triggerId) => clearTrigger(triggerId));
      socket.on('reserve:updated', (data) => setReserveHealth(data));
      socket.on('fraud:flagged', (alert) => addFraudAlert(alert));

      socket.connect();

      cleanupRef.current = () => {
        disconnectSocket(socket);
        setSocketConnected(false);
      };
    }

    return () => {
      if (cleanupRef.current) {
        cleanupRef.current();
      }
    };
  }, [setSocketConnected, setReserveHealth, addTrigger, clearTrigger, addFraudAlert]);
}
