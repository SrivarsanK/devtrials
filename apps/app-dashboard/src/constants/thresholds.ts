// Rainfall trigger thresholds
export const RAINFALL_THRESHOLD_3HR = 35; // mm
export const RAINFALL_THRESHOLD_24HR = 64.5; // mm

// Heat trigger thresholds
export const HEAT_TEMP_THRESHOLD = 42; // °C
export const HEAT_INDEX_THRESHOLD = 54; // °C

// AQI threshold
export const AQI_THRESHOLD = 300;

// Coverage ratio thresholds (as decimal ratios)
export const COVERAGE_RATIO_GREEN = 1.2; // >= 120% is GREEN
export const COVERAGE_RATIO_AMBER = 0.9; // >= 90% is AMBER, below is RED

// Loss ratio thresholds (as percentages)
export const LOSS_RATIO_GREEN = 65; // <= 65% is GREEN
export const LOSS_RATIO_AMBER = 80; // <= 80% is AMBER, above is RED

// Fraud score thresholds
export const FRAUD_SCORE_AUTO_APPROVE = 0.3;
export const FRAUD_SCORE_MANUAL_REVIEW = 0.6;
export const FRAUD_SCORE_AUTO_DENY = 0.8;

// Reinsurance trigger
export const REINSURANCE_LOSS_RATIO_TRIGGER = 90; // percent
export const REINSURANCE_COVERAGE_LIMIT_CRORES = 5;

// Helper functions
export function getCoverageRatioStatus(ratio: number): 'GREEN' | 'AMBER' | 'RED' {
  if (ratio >= COVERAGE_RATIO_GREEN) return 'GREEN';
  if (ratio >= COVERAGE_RATIO_AMBER) return 'AMBER';
  return 'RED';
}

export function getLossRatioStatus(ratio: number): 'GREEN' | 'AMBER' | 'RED' {
  if (ratio <= LOSS_RATIO_GREEN) return 'GREEN';
  if (ratio <= LOSS_RATIO_AMBER) return 'AMBER';
  return 'RED';
}
