/**
 * API Service for GigShield DashBoard
 */

export interface TriggerEvent {
  id?: string;
  triggerType: 'RAINFALL' | 'AQI' | 'HEAT_INDEX' | 'FLOOD' | 'CIVIL';
  zoneId: string;
  timestamp: string | Date;
  dataSource: string;
  thresholdValue: number;
  actualValue: number;
  status: 'ACTIVE' | 'RESOLVED';
  metadata?: any;
}

export class TriggerService {
  private static backendState: 'UP' | 'DOWN' | 'UNKNOWN' = 'UNKNOWN';
  private static lastCheck: number = 0;

  /**
   * Fetch recent trigger events for the dashboard with high-fidelity mock fallback
   */
  static async getTriggers(limit = 5): Promise<TriggerEvent[]> {
    // Circuit Breaker Logic: Skip fetch if server was recently down
    if (this.backendState === 'DOWN' && Date.now() - this.lastCheck < 60000) {
      return this.getMockData();
    }

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 2000); // 2s timeout

      const response = await fetch(`/api/triggers?limit=${limit}&includeMock=true`, {
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);

      if (!response.ok) throw new Error('API Response Error');
      
      const data = await response.json();
      this.backendState = 'UP';
      return data.events || [];
    } catch (error) {
      this.backendState = 'DOWN';
      this.lastCheck = Date.now();
      console.warn('TriggerService: Backend unavailable, returning mock fallback data.', error);
      return this.getMockData();
    }
  }

  /**
   * Manually trigger a weather and pollution monitoring cycle
   */
  static async pollTriggers(): Promise<any> {
    if (this.backendState === 'DOWN' && Date.now() - this.lastCheck < 60000) {
      return { message: 'Mock poll executed (offline mode)', results: [], timestamp: new Date().toISOString() };
    }

    try {
      const response = await fetch(`/api/triggers/poll`, {
        method: 'POST',
      });
      if (!response.ok) throw new Error('Manual poll failed');
      return await response.json();
    } catch (error) {
      console.warn('TriggerService: Poll failed, returning offline success.', error);
      return { 
        message: 'Mock poll executed (offline mode)', 
        results: [], 
        timestamp: new Date().toISOString() 
      };
    }
  }

  /**
   * Fetch all monitored zones
   */
  static async getZones(): Promise<any[]> {
    if (this.backendState === 'DOWN' && Date.now() - this.lastCheck < 60000) {
      return this.getMockZones();
    }

    try {
      const response = await fetch(`/api/triggers/zones`);
      if (!response.ok) throw new Error('Failed to fetch zones');
      const data = await response.json();
      this.backendState = 'UP';
      return data.zones || [];
    } catch (error) {
      this.backendState = 'DOWN';
      this.lastCheck = Date.now();
      console.warn('TriggerService: Zones unavailable, returning mock zones.', error);
      return this.getMockZones();
    }
  }

  /**
   * High-fidelity mock zones based on real Chennai flood/risk patterns
   */
  private static getMockZones(): any[] {
    return [
      // RED ZONES (High Risk)
      { id: 'CH-RED-01', name: 'Velachery', city: 'Chennai', region: 'South Chennai', currentRisk: 'High' },
      { id: 'CH-RED-02', name: 'Pallikaranai', city: 'Chennai', region: 'South Chennai', currentRisk: 'High' },
      { id: 'CH-RED-03', name: 'Madipakkam', city: 'Chennai', region: 'South Chennai', currentRisk: 'High' },
      { id: 'CH-RED-04', name: 'Perumbakkam', city: 'Chennai', region: 'South Chennai', currentRisk: 'High' },
      { id: 'CH-RED-05', name: 'Semmencherry', city: 'Chennai', region: 'South Chennai', currentRisk: 'High' },
      { id: 'CH-RED-06', name: 'Sholinganallur', city: 'Chennai', region: 'South Chennai (OMR)', currentRisk: 'High' },
      { id: 'CH-RED-07', name: 'Karapakkam', city: 'Chennai', region: 'South Chennai (OMR)', currentRisk: 'High' },
      { id: 'CH-RED-08', name: 'Thiruvanmiyur', city: 'Chennai', region: 'Coastal South', currentRisk: 'High' },
      { id: 'CH-RED-09', name: 'Adyar Estuarine Belt', city: 'Chennai', region: 'South Chennai', currentRisk: 'High' },
      { id: 'CH-RED-10', name: 'Saidapet', city: 'Chennai', region: 'Central-South', currentRisk: 'High' },
      { id: 'CH-RED-11', name: 'Kotturpuram', city: 'Chennai', region: 'Central-South', currentRisk: 'High' },
      { id: 'CH-RED-12', name: 'Jafferkhanpet', city: 'Chennai', region: 'Central-South', currentRisk: 'High' },
      { id: 'CH-RED-13', name: 'Nandambakkam', city: 'Chennai', region: 'Central-South', currentRisk: 'High' },
      { id: 'CH-RED-14', name: 'Ennore', city: 'Chennai', region: 'North Chennai', currentRisk: 'High' },
      { id: 'CH-RED-15', name: 'Manali', city: 'Chennai', region: 'North Chennai', currentRisk: 'High' },
      { id: 'CH-RED-16', name: 'Kolathur', city: 'Chennai', region: 'North Chennai', currentRisk: 'High' },
      
      // ORANGE ZONES (Medium Risk)
      { id: 'CH-ORG-01', name: 'Guindy', city: 'Chennai', region: 'Central-South', currentRisk: 'Medium' },
      { id: 'CH-ORG-02', name: 'Ambattur', city: 'Chennai', region: 'West Chennai', currentRisk: 'Medium' },
      { id: 'CH-ORG-03', name: 'Porur', city: 'Chennai', region: 'West Chennai', currentRisk: 'Medium' },
      { id: 'CH-ORG-04', name: 'Tambaram', city: 'Chennai', region: 'South-West Chennai', currentRisk: 'Medium' },
      { id: 'CH-ORG-05', name: 'Chrompet', city: 'Chennai', region: 'South-West Chennai', currentRisk: 'Medium' },
      { id: 'CH-ORG-06', name: 'Perungudi', city: 'Chennai', region: 'South Chennai (OMR)', currentRisk: 'Medium' },
      { id: 'CH-ORG-07', name: 'Medavakkam', city: 'Chennai', region: 'South Chennai', currentRisk: 'Medium' },
      { id: 'CH-ORG-08', name: 'Chepauk', city: 'Chennai', region: 'Central-East', currentRisk: 'Medium' },
      { id: 'CH-ORG-09', name: 'Triplicane', city: 'Chennai', region: 'Central-East', currentRisk: 'Medium' },
      { id: 'CH-ORG-10', name: 'Mogappair', city: 'Chennai', region: 'North-West Chennai', currentRisk: 'Medium' },
      
      // GREEN ZONES (Low Risk)
      { id: 'CH-GRN-01', name: 'T Nagar', city: 'Chennai', region: 'Central', currentRisk: 'Low' },
      { id: 'CH-GRN-02', name: 'Anna Nagar Core', city: 'Chennai', region: 'North-West Chennai', currentRisk: 'Low' },
      { id: 'CH-GRN-03', name: 'Nungambakkam Core', city: 'Chennai', region: 'Central', currentRisk: 'Low' },
      { id: 'CH-GRN-04', name: 'Alwarpet', city: 'Chennai', region: 'Central-South', currentRisk: 'Low' },
      { id: 'CH-GRN-05', name: 'Besant Nagar High Ground', city: 'Chennai', region: 'South Coastal', currentRisk: 'Low' },
      { id: 'CH-GRN-06', name: 'Vadapalani', city: 'Chennai', region: 'Central-West', currentRisk: 'Low' },
      { id: 'CH-GRN-07', name: 'Ashok Nagar', city: 'Chennai', region: 'Central-West', currentRisk: 'Low' },
      { id: 'CH-GRN-08', name: 'Kodambakkam', city: 'Chennai', region: 'Central-West', currentRisk: 'Low' },
      { id: 'CH-GRN-09', name: 'Mylapore Core', city: 'Chennai', region: 'Central-East', currentRisk: 'Low' }
    ];
  }

  /**
   * High-fidelity mock fallback so dashboard doesn't look empty during dev
   */
  private static getMockData(): TriggerEvent[] {
    return [
      { 
        id: 'mock-1', 
        triggerType: 'RAINFALL' as const, 
        zoneId: 'T. Nagar', 
        timestamp: new Date().toISOString(), 
        dataSource: 'Offline Engine',
        thresholdValue: 10,
        actualValue: 24,
        status: 'ACTIVE' as const,
        metadata: { payoutAmount: 800, weatherDescription: 'Heavy downpour detected' }
      },
      { 
        id: 'mock-2', 
        triggerType: 'AQI' as const, 
        zoneId: 'Chennai Central', 
        timestamp: new Date(Date.now() - 3600000).toISOString(), 
        dataSource: 'Offline Engine',
        thresholdValue: 100,
        actualValue: 145,
        status: 'ACTIVE' as const,
        metadata: { payoutAmount: 500, weatherDescription: 'Unsafe air quality' }
      }
    ];
  }
}
