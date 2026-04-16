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
        city: "Chennai",
        zone: "CH-RED-01",
        predictedPayoutLakhs: 12.4,
        riskStatus: "GREEN",
        dominantTrigger: "Precipitation"
      },
      {
        city: "Chennai",
        zone: "CH-RED-02",
        predictedPayoutLakhs: 24.8,
        riskStatus: "AMBER",
        dominantTrigger: "Tidal Surge"
      },
      {
        city: "Chennai",
        zone: "CH-ORG-01",
        predictedPayoutLakhs: 8.2,
        riskStatus: "GREEN",
        dominantTrigger: "AQI Index"
      },
      {
        city: "Chennai",
        zone: "CH-RED-10",
        predictedPayoutLakhs: 32.5,
        riskStatus: "RED",
        dominantTrigger: "Heat Index"
      },
      {
        city: "Chennai",
        zone: "CH-GRN-01",
        predictedPayoutLakhs: 6.8,
        riskStatus: "GREEN",
        dominantTrigger: "Flood Monitoring"
      }
    ];

    setForecasts(mockForecasts);
    setLoading(false);
  }, []);

  return { loading };
}
