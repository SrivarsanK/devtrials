// apps/user-dashboard/src/services/api.ts

export interface RegisterZonePayload {
  name: string;
  city: string;
  lat: number;
  lon: number;
  accuWeatherKey?: string;
}

export interface Trigger {
  id: string;
  type: 'Rainfall' | 'AQI' | 'HeatIndex';
  status: 'ACTIVE' | 'WATCH' | 'STABLE';
  magnitude: number;
  unit: string;
  timestamp: string;
  zone: string;
  source: string;
  payoutAmount: number;
  metadata?: {
    minuteCast?: string;
    accuWeatherHeadline?: string;
  };
}

export interface Zone {
  id: string;
  name: string;
  city?: string;
  state?: string;
  center: {
    lat: number;
    lng: number;
  };
  radius: number;
  monitoredServices: string[];
}

export async function registerZone(data: RegisterZonePayload) {
  // Mock API call
  console.log("Registering zone:", data);
  return new Promise((resolve) => setTimeout(() => resolve({ success: true, id: "NEW-ZONE-" + Math.random().toString(36).substr(2, 5).toUpperCase() }), 1000));
}

export async function fetchZones(): Promise<Zone[]> {
  // Mock fetching zones
  return [];
}
