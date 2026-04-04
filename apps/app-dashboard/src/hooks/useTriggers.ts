'use client';

import { useEffect, useState } from 'react';
import { useDashboardStore } from '@/store/dashboardStore';
import { getActiveTriggers } from '@/services/api';
import { TriggerEvent } from '@/types';

const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK === 'true';

export function useTriggers() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [triggers, setTriggers] = useState<TriggerEvent[]>([]);
  const addTrigger = useDashboardStore((s) => s.addTrigger);

  useEffect(() => {
    async function fetchData() {
      try {
        if (USE_MOCK) {
          await new Promise((r) => setTimeout(r, 400));
          const { mockTriggers } = await import('@/data/mock/triggers');
          setTriggers(mockTriggers);
          mockTriggers.forEach((t) => addTrigger(t));
        } else {
          const data = await getActiveTriggers();
          setTriggers(data);
          data.forEach((t) => addTrigger(t));
        }
      } catch {
        const { mockTriggers } = await import('@/data/mock/triggers');
        setTriggers(mockTriggers);
        mockTriggers.forEach((t) => addTrigger(t));
        setError('Using fallback data');
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [addTrigger]);

  return { triggers, loading, error };
}
