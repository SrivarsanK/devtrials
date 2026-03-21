const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

export interface Trigger {
  id: string;
  type: 'Rainfall' | 'AQI' | 'HeatIndex';
  zone: string;
  magnitude: number;
  timestamp: string;
  payoutAmount: number;
  status: 'PENDING' | 'PROCESSED' | 'FAILED';
}

export interface Zone {
  id: string;
  name: string;
  state: string;
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
  { id: "t1", type: "Rainfall", zone: "Mumbai Central", magnitude: 110.5, timestamp: new Date().toISOString(), payoutAmount: 1200, status: "PROCESSED" },
  { id: "t2", type: "AQI", zone: "South Chennai", magnitude: 305.2, timestamp: new Date().toISOString(), payoutAmount: 800, status: "PENDING" },
  { id: "t3", type: "HeatIndex", zone: "Bengaluru East", magnitude: 44.8, timestamp: new Date().toISOString(), payoutAmount: 500, status: "PROCESSED" },
];

export async function fetchTriggers(): Promise<Trigger[]> {
  try {
    const res = await fetch(`${BASE_URL}/api/triggers`, { cache: 'no-store' });
    if (!res.ok) throw new Error();
    return await res.json();
  } catch (err) {
    console.warn("Backend unaccessible, returning mock triggers");
    return MOCK_TRIGGERS;
  }
}

export async function fetchZones(): Promise<Zone[]> {
  try {
    const res = await fetch(`${BASE_URL}/api/triggers/zones`, { cache: 'no-store' });
    if (!res.ok) throw new Error();
    return await res.json();
  } catch (err) {
    console.warn("Backend unaccessible, returning mock zones");
    return MOCK_ZONES;
  }
}

export async function manualPoll() {
  try {
    const res = await fetch(`${BASE_URL}/api/triggers/poll`, { method: "POST" });
    if (!res.ok) throw new Error();
    return await res.json();
  } catch (err) {
    console.warn("Backend unaccessible, mock poll successful");
    return { success: true, message: "Mock poll completed" };
  }
}

export async function checkHealth() {
  try {
    const res = await fetch(`${BASE_URL}/health`);
    return res.ok;
  } catch (err) {
    return false;
  }
}
