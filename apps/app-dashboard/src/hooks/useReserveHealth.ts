'use client';

import { useEffect, useState } from 'react';
import { useDashboardStore } from '@/store/dashboardStore';
import { getGlobalReserves } from '@/services/api';

const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK === 'true';

export function useReserveHealth() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const setReserveHealth = useDashboardStore((s) => s.setReserveHealth);

  useEffect(() => {
    async function fetchData() {
      try {
        if (USE_MOCK) {
          await new Promise((r) => setTimeout(r, 600));
          const { mockReserveHealth } = await import('@/data/mock/reserves');
          setReserveHealth(mockReserveHealth);
        } else {
          const data = await getGlobalReserves();
          setReserveHealth(data);
        }
      } catch {
        // Fallback to mock on API failure (demo protection)
        const { mockReserveHealth } = await import('@/data/mock/reserves');
        setReserveHealth(mockReserveHealth);
        setError('Using fallback data');
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [setReserveHealth]);

  return { loading, error };
}
