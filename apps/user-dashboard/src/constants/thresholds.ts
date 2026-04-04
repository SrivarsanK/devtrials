export const LOSS_RATIO_GREEN = 65;
export const LOSS_RATIO_AMBER = 85;

export function getLossRatioStatus(percent: number): 'GREEN' | 'AMBER' | 'RED' {
  if (percent < LOSS_RATIO_GREEN) return 'GREEN';
  if (percent < LOSS_RATIO_AMBER) return 'AMBER';
  return 'RED';
}

export function getCoverageStatus(percent: number): 'GREEN' | 'AMBER' | 'RED' {
  if (percent >= 115) return 'GREEN';
  if (percent >= 90) return 'AMBER';
  return 'RED';
}
