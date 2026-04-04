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
  { id: 'chennai_tambaram', name: 'Tambaram', city: 'Chennai', lat: 12.9249, lon: 80.1000, accuWeatherKey: '2799768' },
  { id: 'chennai_tnagar', name: 'T. Nagar', city: 'Chennai', lat: 13.0418, lon: 80.2341, accuWeatherKey: '206671' },
  { id: 'mumbai_andheri', name: 'Andheri', city: 'Mumbai', lat: 19.1197, lon: 72.8464, accuWeatherKey: '3352413' },
  { id: 'mumbai_dadar', name: 'Dadar', city: 'Mumbai', lat: 19.0178, lon: 72.8478, accuWeatherKey: '3352500' },
  { id: 'bengaluru_koramangala', name: 'Koramangala', city: 'Bengaluru', lat: 12.9352, lon: 77.6245, accuWeatherKey: '3352271' },
  { id: 'delhi_connaught', name: 'Connaught Place', city: 'Delhi', lat: 28.6315, lon: 77.2167, accuWeatherKey: '893664' },
];
