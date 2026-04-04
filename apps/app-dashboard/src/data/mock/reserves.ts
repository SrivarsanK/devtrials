import { GlobalReserveHealth } from '@/types';

export const mockReserveHealth: GlobalReserveHealth = {
  reserveBalanceCrores: 4.2,
  activeLiabilityCrores: 3.1,
  coverageRatioPercent: 135,
  lossRatioPercent: 61.3,
  weeklyPremiumInflowLakhs: 48.3,
  weeklyClaimsOutflowLakhs: 29.6,
  globalStatus: 'AMBER',
  globalMessage: 'Chennai northeast monsoon active — Delhi AQI rising',
  cities: [
    {
      city: 'Chennai',
      status: 'AMBER',
      activePolicies: 12450,
      reserveLakhs: 142,
      liabilityLakhs: 168,
      zones: [
        { id: 'CHN_ANNA_NAGAR', name: 'Anna Nagar', city: 'Chennai', status: 'RED', coverageRatioPercent: 75, reserveLakhs: 18.4, liabilityLakhs: 24.6, policies: 1840, predictedClaims7dLakhs: 22.1, issuancesPaused: true },
        { id: 'CHN_T_NAGAR', name: 'T Nagar', city: 'Chennai', status: 'AMBER', coverageRatioPercent: 110, reserveLakhs: 31.2, liabilityLakhs: 28.4, policies: 2210, predictedClaims7dLakhs: 18.6, issuancesPaused: false },
        { id: 'CHN_TAMBARAM', name: 'Tambaram', city: 'Chennai', status: 'GREEN', coverageRatioPercent: 144, reserveLakhs: 44.8, liabilityLakhs: 31.2, policies: 3100, predictedClaims7dLakhs: 8.2, issuancesPaused: false },
      ],
    },
    {
      city: 'Mumbai',
      status: 'GREEN',
      activePolicies: 18230,
      reserveLakhs: 198,
      liabilityLakhs: 142,
      zones: [
        { id: 'MUM_DHARAVI', name: 'Dharavi', city: 'Mumbai', status: 'AMBER', coverageRatioPercent: 109, reserveLakhs: 42.1, liabilityLakhs: 38.6, policies: 3860, predictedClaims7dLakhs: 12.4, issuancesPaused: false },
        { id: 'MUM_ANDHERI', name: 'Andheri', city: 'Mumbai', status: 'GREEN', coverageRatioPercent: 155, reserveLakhs: 68.4, liabilityLakhs: 44.2, policies: 4420, predictedClaims7dLakhs: 6.8, issuancesPaused: false },
      ],
    },
    {
      city: 'Delhi',
      status: 'AMBER',
      activePolicies: 9870,
      reserveLakhs: 80,
      liabilityLakhs: 96,
      zones: [
        { id: 'DEL_LAXMI_NAGAR', name: 'Laxmi Nagar', city: 'Delhi', status: 'AMBER', coverageRatioPercent: 88, reserveLakhs: 28.6, liabilityLakhs: 32.4, policies: 2840, predictedClaims7dLakhs: 14.2, issuancesPaused: false },
        { id: 'DEL_KAROL_BAGH', name: 'Karol Bagh', city: 'Delhi', status: 'GREEN', coverageRatioPercent: 119, reserveLakhs: 34.2, liabilityLakhs: 28.8, policies: 2880, predictedClaims7dLakhs: 7.6, issuancesPaused: false },
      ],
    },
  ],
};
