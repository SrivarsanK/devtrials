/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5678";

export interface Trigger {
  id: string;
  type: 'Rainfall' | 'AQI' | 'HeatIndex';
  zone: string;
  magnitude: number;
  timestamp: string;
  payoutAmount: number;
  status: 'PENDING' | 'PROCESSED' | 'FAILED' | 'ACTIVE';
  source?: string;
  metadata?: {
    temperature?: number;
    humidity?: number;
    weatherDescription?: string;
    aqiCategory?: string;
    actualTemp?: number;
    minuteCast?: string;
    accuWeatherHeadline?: string;
  };
}

export interface Zone {
  id: string;
  name: string;
  state?: string;
  city?: string;
  center: { lat: number; lng: number };
  radius: number;
  monitoredServices: string[];
}

const MOCK_ZONES: Zone[] = [
  { id: "1", name: "Mumbai Central", state: "Maharashtra", center: { lat: 18.9696, lng: 72.8193 }, radius: 50, monitoredServices: ["Rainfall", "AQI"] },
  { id: "2", name: "South Chennai", state: "Tamil Nadu", center: { lat: 13.0827, lng: 80.2707 }, radius: 45, monitoredServices: ["Rainfall", "HeatIndex"] },
  { id: "3", name: "Bengaluru East", state: "Karnataka", center: { lat: 12.9716, lng: 77.5946 }, radius: 30, monitoredServices: ["AQI", "Rainfall"] },
];

const MOCK_TRIGGERS: Trigger[] = [
  { id: "t1", type: "Rainfall", zone: "East Coast Road", magnitude: 110.5, timestamp: new Date().toISOString(), payoutAmount: 1200, status: "PENDING" },
  { id: "t2", type: "AQI", zone: "Mount Road", magnitude: 92.2, timestamp: new Date().toISOString(), payoutAmount: 800, status: "PENDING" },
  { id: "t3", type: "HeatIndex", zone: "OMR Corridor", magnitude: 86.8, timestamp: new Date().toISOString(), payoutAmount: 500, status: "PROCESSED" },
  { id: "t4", type: "Rainfall", zone: "Velachery Hub", magnitude: 74.0, timestamp: new Date().toISOString(), payoutAmount: 600, status: "PROCESSED" },
];

export async function fetchTriggers(): Promise<Trigger[]> {
  try {
    const res = await fetch(`${BASE_URL}/api/triggers`, { cache: 'no-store' });
    if (!res.ok) throw new Error();
    const data = await res.json();

    const events = Array.isArray(data.events) ? data.events : Array.isArray(data) ? data : [];

    return events.map((e: any) => {
      const typeMap: Record<string, 'Rainfall' | 'AQI' | 'HeatIndex'> = {
        'RAINFALL': 'Rainfall',
        'AQI': 'AQI',
        'HEAT_INDEX': 'HeatIndex'
      };

      let metadata: Record<string, any> = {};
      if (typeof e.metadata === 'string') {
        try {
          metadata = JSON.parse(e.metadata);
        } catch {
          metadata = {};
        }
      } else if (e.metadata && typeof e.metadata === 'object') {
        metadata = e.metadata;
      }

      const triggerType = e.trigger_type || e.triggerType || 'RAINFALL';
      const inferredPayoutByType: Record<string, number> = {
        RAINFALL: 800,
        AQI: 600,
        HEAT_INDEX: 500,
      };

      return {
        id: e.id,
        type: typeMap[triggerType] || 'Rainfall',
        zone: metadata.zoneName || e.zone_id || "Unknown Zone",
        magnitude: Number(e.actual_value ?? e.actualValue ?? 0),
        timestamp: e.timestamp,
        payoutAmount: Number(metadata.payoutAmount ?? inferredPayoutByType[triggerType] ?? 0),
        status: e.status || 'PROCESSED',
        source: e.data_source || e.dataSource || 'Unknown',
        metadata
      };
    });
  } catch (err) {
    console.warn("Backend unaccessible, returning mock triggers");
    return MOCK_TRIGGERS;
  }
}

export async function fetchZones(): Promise<Zone[]> {
  try {
    const res = await fetch(`${BASE_URL}/api/triggers/zones`, { cache: 'no-store' });
    if (!res.ok) throw new Error();
    const data = await res.json();
    // Backend returns { zones } which may have city instead of state
    const rawZones = Array.isArray(data.zones) ? data.zones : Array.isArray(data) ? data : MOCK_ZONES;
    
    return rawZones.map((z: any) => ({
      ...z,
      id: z.id || String(Math.random()),
      name: z.name || "Unknown",
      state: z.state || z.city || "N/A",
      center: {
        lat: z.center?.lat || z.lat || 0,
        lng: z.center?.lng || z.lon || z.lng || 0
      },
      radius: z.radius || 50,
      monitoredServices: Array.isArray(z.monitoredServices) ? z.monitoredServices : ["Rainfall"]
    }));
  } catch (err) {
    console.warn("Backend unaccessible, returning mock zones");
    return MOCK_ZONES;
  }
}

export async function fetchHealth() {
  try {
    const res = await fetch(`${BASE_URL}/health`);
    return res.ok;
  } catch (err) {
    return false;
  }
}

export async function fetchHeatmap(includeMock = true): Promise<{ lat: number; lng: number; weight: number }[]> {
  try {
    const res = await fetch(`${BASE_URL}/api/heatmap?includeMock=${includeMock}`, { cache: 'no-store' });
    if (!res.ok) throw new Error();
    return await res.json();
  } catch (err) {
    console.warn("Backend heatmap unaccessible, returning empty data");
    return [];
  }
}

export async function fetchPriorityAlerts(): Promise<{ zone: string; riskIndex: number; type: string; status: string }[]> {
  try {
    const triggers = await fetchTriggers();
    if (triggers.length === 0) throw new Error("No triggers");
    
    return triggers
      .sort((a, b) => b.magnitude - a.magnitude)
      .slice(0, 5)
      .map(t => ({
        zone: t.zone,
        riskIndex: Math.min(Math.round(t.magnitude), 100),
        type: t.type,
        status: t.status === 'PROCESSED' ? 'MONITORED' : 'ACTIVE'
      }));
  } catch (err) {
    // Return varied mock data for better UI testing
    return [
      { zone: 'East Coast Road', riskIndex: 100, type: 'Tsunami Watch', status: 'CRITICAL' },
      { zone: 'Mount Road', riskIndex: 92, type: 'Protest Alert', status: 'ACTIVE' },
      { zone: 'OMR Corridor', riskIndex: 88, type: 'Flash Flood', status: 'MONITORED' },
      { zone: 'Velachery Hub', riskIndex: 74, type: 'AQI Spike', status: 'OBSERVING' },
    ];
  }
}
export async function registerZone(zone: { name: string; city: string; lat: number; lon: number; accuWeatherKey?: string }) {
  const res = await fetch(`${BASE_URL}/api/triggers/zones`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(zone),
  });
  if (!res.ok) throw new Error("Failed to register zone");
  return await res.json();
}

