'use client';

import { useEffect, useState } from 'react';
import { getLossRatio } from '@/services/api';
import { LossRatioDataPoint } from '@/types';

const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK === 'true';

export function useLossRatio() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<LossRatioDataPoint[]>([]);

  useEffect(() => {
    async function fetchData() {
      try {
        if (USE_MOCK) {
          await new Promise((r) => setTimeout(r, 400));
          const { mockLossRatioData } = await import('@/data/mock/lossRatio');
          setData(mockLossRatioData);
        } else {
          const result = await getLossRatio('30d');
          setData(result);
        }
      } catch {
        const { mockLossRatioData } = await import('@/data/mock/lossRatio');
        setData(mockLossRatioData);
        setError('Using fallback data');
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  return { data, loading, error };
}
