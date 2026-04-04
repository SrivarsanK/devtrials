'use client';

import { io, Socket } from 'socket.io-client';
import { GlobalReserveHealth, TriggerEvent, FraudAlert } from '@/types';

// Server → Client events
export interface ServerToClientEvents {
  'trigger:fired': (trigger: TriggerEvent) => void;
  'trigger:cleared': (triggerId: string) => void;
  'reserve:updated': (data: GlobalReserveHealth) => void;
  'fraud:flagged': (alert: FraudAlert) => void;
  'zone:status-changed': (data: { zoneId: string; status: string }) => void;
  'claim:auto-initiated': (data: { claimId: string; zoneId: string; amount: number }) => void;
  'reinsurance:alert-triggered': (data: { partner: string; lossRatio: number }) => void;
}

// Client → Server events
export interface ClientToServerEvents {
  'zone:pause-toggle': (data: { zoneId: string; action: 'pause' | 'resume' }) => void;
  'claim:manual-review-complete': (data: { claimId: string; decision: 'approve' | 'reject' }) => void;
}

type TypedSocket = Socket<ServerToClientEvents, ClientToServerEvents>;

const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:4000';

export function createSocket(): TypedSocket {
  const socket: TypedSocket = io(SOCKET_URL, {
    autoConnect: false,
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 1000,
  });

  return socket;
}

export function disconnectSocket(socket: TypedSocket): void {
  if (socket.connected) {
    socket.disconnect();
  }
}

export interface TriggerUpdateEvent {
  id: string;
  progressBump: number;
}

// Mock socket simulator for demo mode — makes the dashboard feel alive
export function createMockSocketSimulator(callbacks: {
  onReserveUpdate?: (data: Partial<GlobalReserveHealth>) => void;
  onTriggerUpdate?: (update: TriggerUpdateEvent) => void;
}) {
  const intervalId = setInterval(() => {
    // Simulate slight reserve balance fluctuations
    if (callbacks.onReserveUpdate && Math.random() > 0.5) {
      callbacks.onReserveUpdate({
        reserveBalanceCrores: 4.2 + (Math.random() - 0.5) * 0.1,
        coverageRatioPercent: 135 + (Math.random() - 0.5) * 2,
      });
    }

    // Trigger progress simulation — every 5-8 seconds
    if (callbacks.onTriggerUpdate && Math.random() > 0.3) {
      // Pick a random trigger from mock data
      const triggers = ['TRIGGER_RAINFALL', 'TRIGGER_HEAT', 'TRIGGER_AQI'];
      const randomId = triggers[Math.floor(Math.random() * triggers.length)];
      // Bump progress by 2-5%
      const bump = 2 + Math.random() * 3;
      callbacks.onTriggerUpdate({ id: randomId, progressBump: bump });
    }
  }, 5000 + Math.random() * 3000); // 5-8 seconds

  return {
    stop: () => clearInterval(intervalId),
  };
}
