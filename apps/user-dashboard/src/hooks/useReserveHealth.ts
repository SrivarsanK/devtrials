'use client';

import { useState, useEffect } from 'react';
import { useDashboardStore } from '@/store/dashboardStore';

export function useReserveHealth() {
  const [loading, setLoading] = useState(true);
  const reserveHealth = useDashboardStore((s) => s.reserveHealth);

  useEffect(() => {
    if (reserveHealth) {
      setLoading(false);
    }
  }, [reserveHealth]);

  return { loading };
}
