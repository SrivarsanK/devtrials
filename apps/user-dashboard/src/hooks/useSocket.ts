'use client';

import { useEffect } from 'react';
import { useDashboardStore } from '@/store/dashboardStore';

export function useSocket() {
  const setReserveHealth = useDashboardStore((s) => s.setReserveHealth);

  useEffect(() => {
    // High-fidelity mock for RideSuraksha Protocol v4.2.0 (ZRM-772)
    const mockData = {
      totalReserveCr: 124.5,
      totalLiabilityCr: 132.2,
      globalCoverageRatio: 94.2,
      activePolicies: 184501,
      reserveBalanceCrores: 124.5,
      activeLiabilityCrores: 132.2,
      coverageRatioPercent: 94.2,
      lossRatioPercent: 62.4,
      weeklyPremiumInflowLakhs: 84.5,
      weeklyClaimsOutflowLakhs: 42.8,
      globalStatus: 'GREEN' as const,
      globalMessage: "All node clusters reporting normal claim velocity and healthy reserve levels.",
      cities: [
        {
          city: "Mumbai",
          status: "GREEN" as const,
          reserveLakhs: 4850,
          liabilityLakhs: 5120,
          activePolicies: 74200,
          zones: [
            { id: "MUM-01", name: "Andheri-West", city: "Mumbai", status: "GREEN" as const, reserveLakhs: 1200, liabilityLakhs: 1250, coverageRatioPercent: 96, policies: 18500, issuancesPaused: false },
            { id: "MUM-02", name: "Bandra-Kurla", city: "Mumbai", status: "AMBER" as const, reserveLakhs: 2400, liabilityLakhs: 2650, coverageRatioPercent: 90, policies: 32000, issuancesPaused: false }
          ],
          metrics: { lossRatio: 61.5, lapseRate: 4.2, fraudIndex: 0.8 }
        },
        {
          city: "Delhi",
          status: "AMBER" as const,
          reserveLakhs: 3240,
          liabilityLakhs: 3850,
          activePolicies: 52100,
          zones: [
            { id: "DEL-01", name: "Connaught-P", city: "Delhi", status: "GREEN" as const, reserveLakhs: 1800, liabilityLakhs: 1900, coverageRatioPercent: 95, policies: 24000, issuancesPaused: false },
            { id: "DEL-02", name: "Gurgaon-Sec", city: "Delhi", status: "RED" as const, reserveLakhs: 1440, liabilityLakhs: 1950, coverageRatioPercent: 74, policies: 28100, issuancesPaused: true }
          ],
          metrics: { lossRatio: 72.8, lapseRate: 6.5, fraudIndex: 2.1 }
        },
        {
          city: "Chennai",
          status: "GREEN" as const,
          reserveLakhs: 2150,
          liabilityLakhs: 2320,
          activePolicies: 38200,
          zones: [
            { id: "CHN-01", name: "Adyar-Main", city: "Chennai", status: "GREEN" as const, reserveLakhs: 1050, liabilityLakhs: 1120, coverageRatioPercent: 94, policies: 19200, issuancesPaused: false },
            { id: "CHN-02", name: "OMR-Tech", city: "Chennai", status: "GREEN" as const, reserveLakhs: 1100, liabilityLakhs: 1200, coverageRatioPercent: 92, policies: 19000, issuancesPaused: false }
          ],
          metrics: { lossRatio: 54.2, lapseRate: 3.1, fraudIndex: 0.4 }
        }
      ]
    };

    setReserveHealth(mockData);
  }, [setReserveHealth]);
}
