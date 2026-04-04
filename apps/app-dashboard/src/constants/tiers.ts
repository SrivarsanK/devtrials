import { TierName } from '@/types';

export interface TierDefinition {
  name: TierName;
  baseWeeklyPremiumInr: number;
  coverageRatePercent: number;
  monthlyEventCap: number;
  maxPayoutPerEventInr: number;
  peakHourWeighting: boolean;
  triggersCovered: number;
  payoutSpeedHours: number;
  carryForward: boolean;
}

export const TIERS: TierDefinition[] = [
  {
    name: 'Basic Shield',
    baseWeeklyPremiumInr: 79,
    coverageRatePercent: 50,
    monthlyEventCap: 2,
    maxPayoutPerEventInr: 500,
    peakHourWeighting: false,
    triggersCovered: 4,
    payoutSpeedHours: 24,
    carryForward: false,
  },
  {
    name: 'Standard Shield',
    baseWeeklyPremiumInr: 119,
    coverageRatePercent: 70,
    monthlyEventCap: 3,
    maxPayoutPerEventInr: 800,
    peakHourWeighting: true,
    triggersCovered: 6,
    payoutSpeedHours: 12,
    carryForward: false,
  },
  {
    name: 'Full Shield',
    baseWeeklyPremiumInr: 159,
    coverageRatePercent: 80,
    monthlyEventCap: 4,
    maxPayoutPerEventInr: 1200,
    peakHourWeighting: true,
    triggersCovered: 6,
    payoutSpeedHours: 2,
    carryForward: true,
  },
];

export const PEAK_HOUR_MULTIPLIERS = [
  { window: '11:30 AM – 2:30 PM', multiplier: 1.5, reason: 'Lunch rush' },
  { window: '2:30 PM – 6:30 PM', multiplier: 0.7, reason: 'Afternoon lull' },
  { window: '6:30 PM – 10:30 PM', multiplier: 2.0, reason: 'Dinner rush' },
  { window: '10:30 PM – 11:30 AM', multiplier: 0.5, reason: 'Off-peak' },
];
