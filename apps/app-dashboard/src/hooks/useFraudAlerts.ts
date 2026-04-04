'use client';

import { useEffect, useState } from 'react';
import { useDashboardStore } from '@/store/dashboardStore';
import { getFlaggedClaims } from '@/services/api';
import { FraudAlert } from '@/types';

const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK === 'true';

export function useFraudAlerts() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [alerts, setAlerts] = useState<FraudAlert[]>([]);
  const addFraudAlert = useDashboardStore((s) => s.addFraudAlert);

  useEffect(() => {
    async function fetchData() {
      try {
        if (USE_MOCK) {
          await new Promise((r) => setTimeout(r, 500));
          const { mockFraudAlerts } = await import('@/data/mock/fraud');
          setAlerts(mockFraudAlerts);
          mockFraudAlerts.forEach((a) => addFraudAlert(a));
        } else {
          const data = await getFlaggedClaims();
          setAlerts(data);
          data.forEach((a) => addFraudAlert(a));
        }
      } catch {
        const { mockFraudAlerts } = await import('@/data/mock/fraud');
        setAlerts(mockFraudAlerts);
        mockFraudAlerts.forEach((a) => addFraudAlert(a));
        setError('Using fallback data');
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [addFraudAlert]);

  return { alerts, loading, error };
}
