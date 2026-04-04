'use client';

import { useState, useEffect } from 'react';
import { useDashboardStore } from '@/store/dashboardStore';

export function useForecasts() {
  const [loading, setLoading] = useState(true);
  const setForecasts = (data: any[]) => useDashboardStore.setState({ forecasts: data });

  useEffect(() => {
    // Neural Forecast Mocks (LSTM Model v4.0)
    const mockForecasts = [
      {
        city: "Mumbai",
        zone: "MUM-01",
        predictedPayoutLakhs: 12.4,
        riskStatus: "GREEN",
        dominantTrigger: "Precipitation"
      },
      {
        city: "Mumbai",
        zone: "MUM-02",
        predictedPayoutLakhs: 24.8,
        riskStatus: "AMBER",
        dominantTrigger: "Tidal Surge"
      },
      {
        city: "Delhi",
        zone: "DEL-01",
        predictedPayoutLakhs: 8.2,
        riskStatus: "GREEN",
        dominantTrigger: "AQI Index"
      },
      {
        city: "Delhi",
        zone: "DEL-02",
        predictedPayoutLakhs: 32.5,
        riskStatus: "RED",
        dominantTrigger: "AQI Index"
      },
      {
        city: "Chennai",
        zone: "CHN-01",
        predictedPayoutLakhs: 6.8,
        riskStatus: "GREEN",
        dominantTrigger: "Cyclone"
      }
    ];

    setForecasts(mockForecasts);
    setLoading(false);
  }, []);

  return { loading };
}
