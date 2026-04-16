/**
 * Shared types for the Parametric Trigger Monitoring system.
 */

export type TriggerType = 'RAINFALL' | 'AQI' | 'HEAT_INDEX' | 'FLOOD' | 'CIVIL_DISRUPTION';

export type TriggerStatus = 'ACTIVE' | 'RESOLVED' | 'PROCESSING';

export interface TriggerEvent {
  id?: string;
  triggerType: TriggerType;
  zoneId: string;
  timestamp: Date;
  dataSource: string;
  thresholdValue: number;
  actualValue: number;
  affectedWorkerCount?: number;
  status: TriggerStatus;
  metadata?: Record<string, any>;
}

export interface ZoneConfig {
  id: string;
  name: string;
  city: string;
  lat: number;
  lon: number;
  accuWeatherKey?: string;
}

/** Monitored zones — expandable as RideSuraksha scales. */
export const MONITORED_ZONES: ZoneConfig[] = [
  // RED ZONES (High Risk)
  { id: 'CH-RED-01', name: 'Velachery', city: 'Chennai', lat: 12.9759, lon: 80.2212, accuWeatherKey: '202347' },
  { id: 'CH-RED-02', name: 'Pallikaranai', city: 'Chennai', lat: 12.9366, lon: 80.2173, accuWeatherKey: '3448450' },
  { id: 'CH-RED-03', name: 'Madipakkam', city: 'Chennai', lat: 12.9623, lon: 80.1986 },
  { id: 'CH-RED-10', name: 'Saidapet', city: 'Chennai', lat: 13.0238, lon: 80.2274 },
  { id: 'CH-RED-14', name: 'Ennore', city: 'Chennai', lat: 13.2205, lon: 80.3150 },
  
  // ORANGE ZONES (Medium Risk)
  { id: 'CH-ORG-01', name: 'Guindy', city: 'Chennai', lat: 13.0067, lon: 80.2206, accuWeatherKey: '2799768' },
  { id: 'CH-ORG-04', name: 'Tambaram', city: 'Chennai', lat: 12.9239, lon: 80.1293, accuWeatherKey: '2743513' },
  { id: 'CH-ORG-10', name: 'Mogappair', city: 'Chennai', lat: 13.0768, lon: 80.1856 },
  
  // GREEN ZONES (Low Risk)
  { id: 'CH-GRN-01', name: 'T Nagar', city: 'Chennai', lat: 13.0409, lon: 80.2334, accuWeatherKey: '206671' },
  { id: 'CH-GRN-02', name: 'Anna Nagar Core', city: 'Chennai', lat: 13.0827, lon: 80.2115, accuWeatherKey: '3448041' },
  { id: 'CH-GRN-09', name: 'Mylapore Core', city: 'Chennai', lat: 13.0373, lon: 80.2589 },
];
