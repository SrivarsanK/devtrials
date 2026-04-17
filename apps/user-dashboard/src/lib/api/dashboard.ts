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
      
      // Check if our hardcoded trigger has been processed
      const filedClaimsRaw = typeof window !== 'undefined' ? localStorage.getItem('RideSuraksha_filed_claims') : null;
      const filedClaims = filedClaimsRaw ? JSON.parse(filedClaimsRaw) : [];
      const isProcessed = filedClaims.some((c: any) => c.triggerId === "trg_99");

      const history = this.mapTriggerEventsToClaims(triggers);

      return {
        policy: this.getMockPolicy(),
        recentClaims: history,
        stats: {
          revenueProtected: 1450 + (filedClaims.length * 250),
          coverageZones: 24,
          contractTrust: 98.2,
          nodeUptime: 100
        },
        latestTrigger: isProcessed ? null : {
          id: "trg_99",
          title: "Heavy Rainfall",
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
      title: e.triggerType === 'RAINFALL' ? 'Heavy Rainfall' : 
             e.triggerType === 'AQI' ? 'Poor Air Quality' : 'Environmental Disruption',
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
    let storedPremium = 23;
    if (typeof window !== 'undefined') {
      const p = localStorage.getItem('RideSuraksha_premiumAmount');
      if (p) storedPremium = Number(p);
    }
    
    return {
      plan: "RideSuraksha",
      tier: "Premium",
      status: "Active",
      zone: "Chennai Central",
      expiryDate: new Date(Date.now() + 86400000 * 7).toISOString(), // 7 days rem (1 week cycle)
      premiumAmount: storedPremium,
      totalPremiumPaid: 450,
      upiId: typeof window !== 'undefined' ? localStorage.getItem('RideSuraksha_pending_upi') || "" : "",
      partner: "swiggy",
      autoDeduct: true
    };
  }

  /**
   * Submit a claim request to the backend (triggers PhonePe Refund/Payout)
   */
  static async applyForClaim(claimData: { amount: number, zone: string, reason: string }): Promise<any> {
    try {
      console.log("DashboardAPI: Initiating claim simulation state...");
      
      // Simulation Logic - Store immediately so it reflects even if fetch fails
      const newClaim = {
        id: `CL-${Math.floor(Math.random() * 90000 + 10000)}`,
        triggerId: "trg_99",
        title: "Heavy Rainfall",
        type: "RAINFALL" as const,
        amount: claimData.amount,
        timestamp: new Date().toISOString(),
        zone: claimData.zone
      };

      if (typeof window !== 'undefined') {
        const filedClaimsRaw = localStorage.getItem('RideSuraksha_filed_claims');
        const filedClaims = filedClaimsRaw ? JSON.parse(filedClaimsRaw) : [];
        filedClaims.push(newClaim);
        localStorage.setItem('RideSuraksha_filed_claims', JSON.stringify(filedClaims));
        console.log("DashboardAPI: Local simulation state updated", newClaim);
      }

      // Attempt real backend call
      try {
        const response = await fetch('/api/payments/claim', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(claimData)
        });
        
        if (response.ok) {
          const data = await response.json();
          return { ...data, simulated: false };
        }
      } catch (networkError) {
        console.warn("DashboardAPI: Backend endpoint /api/payments/claim unavailable, continuing with simulation.");
      }
      
      return { success: true, message: "Claim simulation successful", claim: newClaim, simulated: true };
    } catch (error) {
      console.error("DashboardAPI: Error applying for claim", error);
      throw error;
    }
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
