'use client';

import { useEffect, useState } from 'react';
import { useDashboardStore } from '@/store/dashboardStore';
import { get72HrForecast } from '@/services/api';
import { ZoneForecast } from '@/types';

const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK === 'true';

export function useForecasts() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [forecasts, setLocalForecasts] = useState<ZoneForecast[]>([]);
  const setForecasts = useDashboardStore((s) => s.setForecasts);

  useEffect(() => {
    async function fetchData() {
      try {
        if (USE_MOCK) {
          await new Promise((r) => setTimeout(r, 500));
          const { mockForecasts } = await import('@/data/mock/forecasts');
          setLocalForecasts(mockForecasts);
          setForecasts(mockForecasts);
        } else {
          const data = await get72HrForecast();
          setLocalForecasts(data);
          setForecasts(data);
        }
      } catch {
        const { mockForecasts } = await import('@/data/mock/forecasts');
        setLocalForecasts(mockForecasts);
        setForecasts(mockForecasts);
        setError('Using fallback data');
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [setForecasts]);

  return { forecasts, loading, error };
}
