import { useState, useEffect } from 'react';
import { LossRatioDataPoint } from '@/types';

export function useLossRatio() {
  const [data, setData] = useState<LossRatioDataPoint[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Generate 30 days of mock data
    const mockData: LossRatioDataPoint[] = [];
    const now = new Date();
    
    for (let i = 29; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      
      const premiums = 40 + Math.random() * 20;
      const claims = 25 + Math.random() * 15;
      const lossRatio = (claims / premiums) * 100;
      
      mockData.push({
        date: date.toISOString(),
        lossRatioPercent: parseFloat(lossRatio.toFixed(1)),
        premiumsCollectedLakhs: parseFloat(premiums.toFixed(1)),
        claimsPaidLakhs: parseFloat(claims.toFixed(1))
      });
    }

    const timer = setTimeout(() => {
      setData(mockData);
      setLoading(false);
    }, 800);

    return () => clearTimeout(timer);
  }, []);

  return { data, loading };
}
