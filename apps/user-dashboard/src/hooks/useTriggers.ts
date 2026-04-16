import { useState, useEffect } from 'react';
import { TriggerEvent } from '@/types';

export function useTriggers() {
  const [data, setData] = useState<TriggerEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const mockTriggers: TriggerEvent[] = [
      {
        id: "T1",
        name: "Rainfall Intensity (Chennai South)",
        status: "WATCH",
        progressPercent: 78,
        currentValue: "18mm/h",
        thresholdLabel: "25mm/h"
      },
      {
        id: "T2",
        name: "AQI Index (Chennai Central)",
        status: "NORMAL",
        progressPercent: 42,
        currentValue: "85",
        thresholdLabel: "150"
      },
      {
        id: "T3",
        name: "Flood Sensor (Velachery Hub)",
        status: "TRIGGERED",
        progressPercent: 100,
        currentValue: "LEVEL 3",
        thresholdLabel: "LEVEL 1",
        affectedWorkers: 850,
        estimatedPayoutLakhs: 42.5
      }
    ];

    const timer = setTimeout(() => {
      setData(mockTriggers);
      setLoading(false);
    }, 600);

    return () => clearTimeout(timer);
  }, []);

  return { triggers: data, loading };
}
