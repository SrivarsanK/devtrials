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
        city: "Chennai",
        zone: "CH-RED-01",
        claimAmountInr: 12500,
        description: "Satellite imagery confirms dry conditions in Velachery area. GPS ping clustering detected."
      },
      {
        id: "FLD-98213",
        type: "Identity Synthesis",
        fraudScore: 0.82,
        city: "Chennai",
        zone: "CH-ORG-04",
        claimAmountInr: 45000,
        description: "Multiple accounts linked to same biometric hash in Tambaram corridor. Claim velocity exceeding 300% historical average."
      },
      {
        id: "FLD-98214",
        type: "Oracle Conflict",
        fraudScore: 0.68,
        city: "Chennai",
        zone: "CH-GRN-01",
        claimAmountInr: 8500,
        description: "Local sensor cluster reporting GREEN status in T Nagar while peer nodes report AMBER. Hardware tampering suspected."
      }
    ];

    setFraudAlerts(mockAlerts);
    setLoading(false);
  }, []);

  return { loading };
}
