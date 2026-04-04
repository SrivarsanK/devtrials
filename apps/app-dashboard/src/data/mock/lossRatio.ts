import { LossRatioDataPoint } from '@/types';

// Generate 30 days of loss ratio data with realistic variation
// Mostly 55-65%, spiking to 72-78% in last 5 days (monsoon pressure)
function generateLossRatioData(): LossRatioDataPoint[] {
  const data: LossRatioDataPoint[] = [];
  const now = new Date();

  for (let i = 29; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);

    let lossRatio: number;
    let premiums: number;
    let claims: number;

    if (i <= 4) {
      // Last 5 days — monsoon spike
      lossRatio = 72 + Math.random() * 6; // 72-78%
      premiums = 6.2 + Math.random() * 0.8;
      claims = premiums * (lossRatio / 100);
    } else if (i <= 9) {
      // Days 6-10 — transitional
      lossRatio = 62 + Math.random() * 8; // 62-70%
      premiums = 6.8 + Math.random() * 0.6;
      claims = premiums * (lossRatio / 100);
    } else {
      // Days 11-30 — stable
      lossRatio = 52 + Math.random() * 10; // 52-62%
      premiums = 7.0 + Math.random() * 0.5;
      claims = premiums * (lossRatio / 100);
    }

    data.push({
      date: date.toISOString().split('T')[0],
      lossRatioPercent: Math.round(lossRatio * 10) / 10,
      premiumsCollectedLakhs: Math.round(premiums * 10) / 10,
      claimsPaidLakhs: Math.round(claims * 10) / 10,
    });
  }

  return data;
}

export const mockLossRatioData: LossRatioDataPoint[] = generateLossRatioData();
