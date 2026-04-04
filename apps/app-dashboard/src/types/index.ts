// Zone status enum
export type ZoneStatus = 'GREEN' | 'AMBER' | 'RED';

// Trigger status enum
export type TriggerStatus = 'NORMAL' | 'WATCH' | 'TRIGGERED';

// City type
export type City = 'Chennai' | 'Mumbai' | 'Delhi';

// Tier names
export type TierName = 'Basic Shield' | 'Standard Shield' | 'Full Shield';

// Zone reserve data
export interface ZoneReserve {
  id: string;
  name: string;
  city: City;
  status: ZoneStatus;
  coverageRatioPercent: number;
  reserveLakhs: number;
  liabilityLakhs: number;
  policies: number;
  predictedClaims7dLakhs: number;
  issuancesPaused: boolean;
}

// City-level reserve summary
export interface CityReserveSummary {
  city: City;
  status: ZoneStatus;
  activePolicies: number;
  reserveLakhs: number;
  liabilityLakhs: number;
  zones: ZoneReserve[];
}

// Global reserve health (top-level data shape)
export interface GlobalReserveHealth {
  reserveBalanceCrores: number;
  activeLiabilityCrores: number;
  coverageRatioPercent: number;
  lossRatioPercent: number;
  weeklyPremiumInflowLakhs: number;
  weeklyClaimsOutflowLakhs: number;
  globalStatus: ZoneStatus;
  globalMessage: string;
  cities: CityReserveSummary[];
}

// Trigger event
export interface TriggerEvent {
  id: string;
  name: string;
  thresholdLabel: string;
  currentValue: string;
  progressPercent: number;
  status: TriggerStatus;
  cities: City[];
  affectedWorkers?: number;
  estimatedPayoutLakhs?: number;
}

// Claim
export interface Claim {
  id: string;
  workerId: string;
  zoneId: string;
  city: City;
  triggerType: string;
  amountInr: number;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'FLAGGED';
  timestamp: string;
}

// Fraud alert
export interface FraudAlert {
  id: string;
  type: 'GPS_SPOOF' | 'ANOMALY' | 'DUPLICATE' | 'CLUSTER';
  description: string;
  city: City;
  zone: string;
  fraudScore: number;
  claimAmountInr: number;
  status: 'PENDING_REVIEW' | 'APPROVED' | 'REJECTED' | 'INVESTIGATING';
  autoAction: string;
}

// Zone forecast
export interface ZoneForecast {
  zone: string;
  city: City;
  predictedPayoutLakhs: number;
  riskStatus: ZoneStatus;
  circuitBreaker: 'ACTIVE' | 'PAUSED';
  dominantTrigger: string;
}

// Weekly forecast
export interface WeeklyForecast {
  total72hrPredictedLiabilityLakhs: number;
  zones: ZoneForecast[];
}

// Policy summary
export interface Policy {
  id: string;
  workerId: string;
  tier: TierName;
  city: City;
  zone: string;
  weeklyPremiumInr: number;
  status: 'ACTIVE' | 'PAUSED' | 'EXPIRED';
  startDate: string;
}

// Reinsurance alert
export interface ReinsuranceAlert {
  partner: string;
  triggerLossRatioPercent: number;
  currentStatus: 'Normal' | 'Pre-alerted' | 'Claim Initiated';
  coverageLimitCrores: number;
  alertSentTimestamp?: string;
}

// Loss ratio data point (for chart)
export interface LossRatioDataPoint {
  date: string;
  lossRatioPercent: number;
  premiumsCollectedLakhs: number;
  claimsPaidLakhs: number;
}

// Analytics summary
export interface AnalyticsSummary {
  activePolicies: number;
  totalPremiumsCollectedCrores: number;
  totalClaimsPaidCrores: number;
  overallLossRatioPercent: number;
}
