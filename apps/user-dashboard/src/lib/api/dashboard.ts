import { TriggerService, TriggerEvent } from "../api";
import { DashboardSummary, UserPolicy, ClaimHistoryItem } from "../types/dashboard";

/**
 * High-level API for Dashboard UI
 */
export class DashboardAPI {
  /**
   * Fetch complete dashboard summary
   */
  static async getSummary(): Promise<DashboardSummary> {
    try {
      // In a real app, this would be a single optimized endpoint
      // For now, we aggregate from TriggerService and use mocks
      const triggers = await TriggerService.getTriggers(5);
      
      return {
        policy: this.getMockPolicy(),
        recentClaims: this.mapTriggerEventsToClaims(triggers),
        stats: {
          revenueProtected: 1450,
          coverageZones: 24,
          contractTrust: 98.2,
          nodeUptime: 100
        },
        latestTrigger: {
          id: "trg_99",
          type: "RAINFALL",
          amount: 250,
          timestamp: new Date().toISOString(),
          status: "PENDING_APP",
          zone: "Chennai South",
          verificationSource: "IMD_API"
        }
      };
    } catch (error) {
      console.error("DashboardAPI: Error fetching summary", error);
      return this.getFallbackSummary();
    }
  }

  /**
   * Map backend TriggerEvent to UI ClaimHistoryItem
   */
  private static mapTriggerEventsToClaims(events: TriggerEvent[]): ClaimHistoryItem[] {
    return events.map(e => ({
      id: e.id || Math.random().toString(36).substr(2, 9),
      type: e.triggerType,
      amount: e.metadata?.payoutAmount || 0,
      timestamp: typeof e.timestamp === 'string' ? e.timestamp : e.timestamp.toISOString(),
      status: e.status === 'ACTIVE' ? 'PAID' : 'EXPIRED', // Simplified mapping
      zone: e.zoneId,
      verificationSource: e.dataSource
    }));
  }

  /**
   * Mock User Policy Data
   */
  private static getMockPolicy(): UserPolicy {
    let storedPremium = 35;
    if (typeof window !== 'undefined') {
      const p = localStorage.getItem('RideSuraksha_premiumAmount');
      if (p) storedPremium = Number(p);
    }
    
    return {
      plan: "RideSuraksha",
      tier: "Bio-Shield",
      status: "Active",
      zone: "Velachery Corridor",
      expiryDate: new Date(Date.now() + 86400000 * 2).toISOString(), // 2 days rem
      premiumAmount: storedPremium,
      totalPremiumPaid: 450,
      upiId: typeof window !== 'undefined' ? localStorage.getItem('RideSuraksha_pending_upi') || "" : "",
      partner: "swiggy",
      autoDeduct: true
    };
  }

  /**
   * Fallback for serious failures
   */
  private static getFallbackSummary(): DashboardSummary {
    return {
      policy: this.getMockPolicy(),
      recentClaims: [],
      stats: {
        revenueProtected: 0,
        coverageZones: 0,
        contractTrust: 0,
        nodeUptime: 0
      },
      latestTrigger: null
    };
  }
}
