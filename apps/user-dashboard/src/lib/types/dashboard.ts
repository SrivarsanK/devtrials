/**
 * User Policy Data Model
 */
export interface UserPolicy {
  plan: string;
  tier: 'Lite' | 'Plus' | 'Max' | 'Bio-Shield';
  status: 'Active' | 'Pending' | 'Expired';
  zone: string;
  expiryDate: string;
  premiumAmount: number;
  totalPremiumPaid: number;
  upiId: string;
  partner: string;
  autoDeduct: boolean;
}

/**
 * Claim/Trigger History Item
 */
export interface ClaimHistoryItem {
  id: string;
  type: 'RAINFALL' | 'AQI' | 'HEAT_INDEX' | 'FLOOD' | 'CIVIL';
  amount: number;
  timestamp: string;
  status: 'PAID' | 'PROCESSING' | 'FAILED' | 'EXPIRED';
  zone: string;
  verificationSource: string;
}

/**
 * Dashboard Overview Aggregation
 */
export interface DashboardSummary {
  policy: UserPolicy;
  recentClaims: ClaimHistoryItem[];
  stats: {
    revenueProtected: number;
    coverageZones: number;
    contractTrust: number;
    nodeUptime: number;
  };
}
