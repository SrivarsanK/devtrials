import { create } from 'zustand';
import { ReserveHealthData } from '@/types';

interface DashboardState {
  reserveHealth: ReserveHealthData | null;
  lastUpdated: string;
  pausedZones: Set<string>;
  activeTriggers: any[];
  fraudAlerts: any[];
  forecasts: any[];
  socketConnected: boolean;
  setReserveHealth: (data: ReserveHealthData) => void;
  toggleZonePause: (zoneId: string) => void;
  resolveFraudAlert: (alertId: string, action?: 'approve' | 'investigate' | 'reject') => void;
}

export const useDashboardStore = create<DashboardState>((set) => ({
  reserveHealth: null,
  lastUpdated: new Date().toISOString(),
  pausedZones: new Set(),
  activeTriggers: [],
  fraudAlerts: [],
  forecasts: [],
  socketConnected: true,
  setReserveHealth: (data) => set({ reserveHealth: data }),
  toggleZonePause: (zoneId) => set((state) => {
    const next = new Set(state.pausedZones);
    if (next.has(zoneId)) next.delete(zoneId);
    else next.add(zoneId);
    return { pausedZones: next };
  }),
  resolveFraudAlert: (alertId, action) => {
    console.log(`Resolving alert ${alertId} with action ${action}`);
    set((state) => ({
      fraudAlerts: state.fraudAlerts.filter((a) => a.id !== alertId)
    }));
  },
}));
