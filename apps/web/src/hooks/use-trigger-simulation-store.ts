import { create } from 'zustand';

export interface TriggerEvent {
  eventId: string;
  triggerId: string;
  zone: string;
  intensity: string;
  affectedWorkers: number;
  payoutAmount: number;
  totalPayout: number;
  avgFraudScore: number;
  timestamp: string | Date;
}

interface TriggerSimulationStore {
  cardStatus: Record<string, 'idle' | 'firing' | 'fired' | 'error'>;
  eventLog: TriggerEvent[];
  todayStats: {
    totalEvents: number;
    totalPayout: number;
    avgFraudScore: number;
    reserveImpact: number;
  };
  setCardStatus: (triggerId: string, status: 'idle' | 'firing' | 'fired' | 'error') => void;
  appendEvent: (event: TriggerEvent) => void;
  clearLog: () => void;
  updateStats: (payload: Partial<TriggerSimulationStore['todayStats']>) => void;
}

export const useTriggerSimulationStore = create<TriggerSimulationStore>((set) => ({
  cardStatus: {},
  eventLog: [],
  todayStats: {
    totalEvents: 0,
    totalPayout: 0,
    avgFraudScore: 0,
    reserveImpact: 0,
  },
  setCardStatus: (triggerId, status) =>
    set((state) => ({
      cardStatus: { ...state.cardStatus, [triggerId]: status },
    })),
  appendEvent: (event) =>
    set((state) => {
      const newLog = [event, ...state.eventLog].slice(0, 50);
      const newTotalEvents = state.todayStats.totalEvents + 1;
      const newTotalPayout = state.todayStats.totalPayout + event.totalPayout;
      const newAvgFraudScore = (state.todayStats.avgFraudScore * state.todayStats.totalEvents + event.avgFraudScore) / newTotalEvents;
      
      return {
        eventLog: newLog,
        todayStats: {
          ...state.todayStats,
          totalEvents: newTotalEvents,
          totalPayout: newTotalPayout,
          avgFraudScore: newAvgFraudScore,
          reserveImpact: state.todayStats.reserveImpact + (event.totalPayout * 1.1) // Mock impact incl overhead
        }
      };
    }),
  clearLog: () => set({ eventLog: [] }),
  updateStats: (payload) =>
    set((state) => ({
      todayStats: { ...state.todayStats, ...payload },
    })),
}));
