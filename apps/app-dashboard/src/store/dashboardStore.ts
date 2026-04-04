'use client';

import { create } from 'zustand';
import { devtools, subscribeWithSelector } from 'zustand/middleware';
import {
  GlobalReserveHealth,
  TriggerEvent,
  FraudAlert,
  ZoneForecast,
  ZoneStatus,
  City,
} from '@/types';

interface DashboardState {
  // Data state
  reserveHealth: GlobalReserveHealth | null;
  activeTriggers: TriggerEvent[];
  fraudAlerts: FraudAlert[];
  forecasts: ZoneForecast[];

  // UI state
  pausedZones: Set<string>;
  selectedCity: City | 'ALL';
  socketConnected: boolean;
  lastUpdated: Date | null;

  // Actions
  setReserveHealth: (data: GlobalReserveHealth) => void;
  addTrigger: (trigger: TriggerEvent) => void;
  clearTrigger: (triggerId: string) => void;
  addFraudAlert: (alert: FraudAlert) => void;
  resolveFraudAlert: (id: string, resolution: 'approve' | 'reject' | 'investigate') => void;
  setForecasts: (forecasts: ZoneForecast[]) => void;
  toggleZonePause: (zoneId: string) => void;
  setSelectedCity: (city: City | 'ALL') => void;
  setSocketConnected: (connected: boolean) => void;

  // Computed
  getZoneStatus: (zoneId: string) => ZoneStatus | undefined;
  getPendingFraudCount: () => number;
  getActiveTriggerCount: () => number;
}

export const useDashboardStore = create<DashboardState>()(
  devtools(
    subscribeWithSelector((set, get) => ({
      // Initial state
      reserveHealth: null,
      activeTriggers: [],
      fraudAlerts: [],
      forecasts: [],
      pausedZones: new Set<string>(),
      selectedCity: 'ALL' as City | 'ALL',
      socketConnected: false,
      lastUpdated: null,

      // Actions
      setReserveHealth: (data) =>
        set({ reserveHealth: data, lastUpdated: new Date() }, false, 'setReserveHealth'),

      addTrigger: (trigger) =>
        set(
          (state) => ({
            activeTriggers: [...state.activeTriggers.filter((t) => t.id !== trigger.id), trigger],
            lastUpdated: new Date(),
          }),
          false,
          'addTrigger'
        ),

      clearTrigger: (triggerId) =>
        set(
          (state) => ({
            activeTriggers: state.activeTriggers.filter((t) => t.id !== triggerId),
            lastUpdated: new Date(),
          }),
          false,
          'clearTrigger'
        ),

      addFraudAlert: (alert) =>
        set(
          (state) => ({
            fraudAlerts: [...state.fraudAlerts.filter((f) => f.id !== alert.id), alert],
            lastUpdated: new Date(),
          }),
          false,
          'addFraudAlert'
        ),

      resolveFraudAlert: (id, resolution) =>
        set(
          (state) => ({
            fraudAlerts: state.fraudAlerts.filter((f) => f.id !== id),
            lastUpdated: new Date(),
          }),
          false,
          'resolveFraudAlert'
        ),

      setForecasts: (forecasts) =>
        set({ forecasts, lastUpdated: new Date() }, false, 'setForecasts'),

      toggleZonePause: (zoneId) =>
        set(
          (state) => {
            const newPaused = new Set(state.pausedZones);
            if (newPaused.has(zoneId)) {
              newPaused.delete(zoneId);
            } else {
              newPaused.add(zoneId);
            }
            return { pausedZones: newPaused, lastUpdated: new Date() };
          },
          false,
          'toggleZonePause'
        ),

      setSelectedCity: (city) => set({ selectedCity: city }, false, 'setSelectedCity'),

      setSocketConnected: (connected) =>
        set({ socketConnected: connected }, false, 'setSocketConnected'),

      // Computed values
      getZoneStatus: (zoneId) => {
        const state = get();
        if (!state.reserveHealth) return undefined;
        for (const city of state.reserveHealth.cities) {
          const zone = city.zones.find((z) => z.id === zoneId);
          if (zone) return zone.status;
        }
        return undefined;
      },

      getPendingFraudCount: () => {
        return get().fraudAlerts.filter((a) => a.status === 'PENDING_REVIEW').length;
      },

      getActiveTriggerCount: () => {
        return get().activeTriggers.filter((t) => t.status === 'TRIGGERED').length;
      },
    })),
    { name: 'ShieldGuard Dashboard' }
  )
);
