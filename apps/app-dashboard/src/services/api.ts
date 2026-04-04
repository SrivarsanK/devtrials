import {
  GlobalReserveHealth,
  CityReserveSummary,
  ZoneReserve,
  TriggerEvent,
  FraudAlert,
  ZoneForecast,
  LossRatioDataPoint,
} from '@/types';

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

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

async function fetchAPI<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_URL}${endpoint}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  if (!response.ok) throw new Error(`API error: ${response.status}`);
  return response.json();
}

// Reserve endpoints
export const getGlobalReserves = () =>
  fetchAPI<GlobalReserveHealth>('/api/reserves/global');

export const getCityReserves = (city: string) =>
  fetchAPI<CityReserveSummary>(`/api/reserves/city/${city}`);

export const getZoneReserves = (zoneId: string) =>
  fetchAPI<ZoneReserve>(`/api/reserves/zone/${zoneId}`);

// Trigger endpoints
export const getActiveTriggers = () =>
  fetchAPI<TriggerEvent[]>('/api/triggers/active');

// Claims endpoints
export const getFlaggedClaims = () =>
  fetchAPI<FraudAlert[]>('/api/claims/flagged');

export const approveClaim = (id: string) =>
  fetchAPI<void>(`/api/claims/${id}/approve`, { method: 'PATCH' });

export const rejectClaim = (id: string) =>
  fetchAPI<void>(`/api/claims/${id}/reject`, { method: 'PATCH' });

// Forecast endpoints
export const get72HrForecast = () =>
  fetchAPI<ZoneForecast[]>('/api/forecast/72hr');

// Zone control endpoints
export const pauseZone = (zoneId: string) =>
  fetchAPI<void>(`/api/zones/${zoneId}/pause`, { method: 'PATCH' });

export const resumeZone = (zoneId: string) =>
  fetchAPI<void>(`/api/zones/${zoneId}/resume`, { method: 'PATCH' });

// Analytics endpoints
export const getLossRatio = (period: string) =>
  fetchAPI<LossRatioDataPoint[]>(`/api/analytics/loss-ratio?period=${period}`);

// Admin/Registration
export const registerZone = (zone: { name: string; city: string; lat: number; lon: number; accuWeatherKey?: string }) =>
  fetchAPI<Zone>('/api/triggers/zones', {
    method: 'POST',
    body: JSON.stringify(zone),
  });
