export interface ZoneReserve {
  id: string;
  name: string;
  city: string;
  status: 'GREEN' | 'AMBER' | 'RED';
  reserveLakhs: number;
  liabilityLakhs: number;
  coverageRatioPercent: number;
  policies: number;
  issuancesPaused: boolean;
}

export interface ZonePerformanceMetrics {
  lossRatio: number;
  lapseRate: number;
  fraudIndex: number;
}

export interface CityReserveSummary {
  city: string;
  status: 'GREEN' | 'AMBER' | 'RED';
  reserveLakhs: number;
  liabilityLakhs: number;
  activePolicies: number;
  zones: ZoneReserve[];
  metrics: ZonePerformanceMetrics;
}

export interface LossRatioDataPoint {
  date: string;
  lossRatioPercent: number;
  premiumsCollectedLakhs: number;
  claimsPaidLakhs: number;
}

export interface ReserveHealthData {
  totalReserveCr: number;
  totalLiabilityCr: number;
  globalCoverageRatio: number;
  activePolicies: number;
  reserveBalanceCrores: number;
  activeLiabilityCrores: number;
  coverageRatioPercent: number;
  lossRatioPercent: number;
  weeklyPremiumInflowLakhs: number;
  weeklyClaimsOutflowLakhs: number;
  globalStatus: 'GREEN' | 'AMBER' | 'RED';
  globalMessage: string;
  cities: CityReserveSummary[];
}

export interface TriggerEvent {
  id: string;
  name: string;
  status: 'NORMAL' | 'WATCH' | 'TRIGGERED';
  progressPercent: number;
  currentValue: string;
  thresholdLabel: string;
  affectedWorkers?: number;
  estimatedPayoutLakhs?: number;
}
