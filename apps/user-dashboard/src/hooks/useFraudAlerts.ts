'use client';

import { useState, useEffect } from 'react';
import { useDashboardStore } from '@/store/dashboardStore';

export function useFraudAlerts() {
  const [loading, setLoading] = useState(true);
  const setFraudAlerts = (data: any[]) => useDashboardStore.setState({ fraudAlerts: data });

  useEffect(() => {
    // High-Risk Security Queue Mocks (ZRM-901)
    const mockAlerts = [
      {
        id: "FLD-98212",
        type: "Geometric Anomaly",
        fraudScore: 0.94,
        city: "Mumbai",
        zone: "MUM-02",
        claimAmountInr: 12500,
        description: "Satellite imagery confirms dry conditions at reported flood node location. GPS ping clustering detected."
      },
      {
        id: "FLD-98213",
        type: "Identity Synthesis",
        fraudScore: 0.82,
        city: "Delhi",
        zone: "DEL-02",
        claimAmountInr: 45000,
        description: "Multiple accounts linked to same biometric hash. Claim velocity exceeding 300% historical average."
      },
      {
        id: "FLD-98214",
        type: "Oracle Conflict",
        fraudScore: 0.68,
        city: "Mumbai",
        zone: "MUM-01",
        claimAmountInr: 8500,
        description: "Local sensor cluster reporting GREEN status while peer nodes report AMBER. Hardware tampering suspected."
      }
    ];

    setFraudAlerts(mockAlerts);
    setLoading(false);
  }, []);

  return { loading };
}
