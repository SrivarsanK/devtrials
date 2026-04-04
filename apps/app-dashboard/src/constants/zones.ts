import { City } from '@/types';

export interface ZoneDefinition {
  id: string;
  name: string;
  city: City;
  riskScore: number;
  multiplier: number;
  coordinates: { lat: number; lng: number };
}

export const ZONES: ZoneDefinition[] = [
  // Chennai
  { id: 'CHN_ANNA_NAGAR', name: 'Anna Nagar', city: 'Chennai', riskScore: 7, multiplier: 1.20, coordinates: { lat: 13.0850, lng: 80.2101 } },
  { id: 'CHN_T_NAGAR', name: 'T Nagar', city: 'Chennai', riskScore: 9, multiplier: 1.40, coordinates: { lat: 13.0418, lng: 80.2341 } },
  { id: 'CHN_TAMBARAM', name: 'Tambaram', city: 'Chennai', riskScore: 4, multiplier: 1.00, coordinates: { lat: 12.9249, lng: 80.1000 } },
  // Mumbai
  { id: 'MUM_DHARAVI', name: 'Dharavi', city: 'Mumbai', riskScore: 7, multiplier: 1.20, coordinates: { lat: 19.0432, lng: 72.8527 } },
  { id: 'MUM_ANDHERI', name: 'Andheri', city: 'Mumbai', riskScore: 5, multiplier: 1.00, coordinates: { lat: 19.1136, lng: 72.8697 } },
  // Delhi
  { id: 'DEL_LAXMI_NAGAR', name: 'Laxmi Nagar', city: 'Delhi', riskScore: 6, multiplier: 1.00, coordinates: { lat: 28.6304, lng: 77.2772 } },
  { id: 'DEL_KAROL_BAGH', name: 'Karol Bagh', city: 'Delhi', riskScore: 5, multiplier: 1.00, coordinates: { lat: 28.6514, lng: 77.1907 } },
];

export const CITIES: City[] = ['Chennai', 'Mumbai', 'Delhi'];

export function getZonesByCity(city: City): ZoneDefinition[] {
  return ZONES.filter((z) => z.city === city);
}

export function getZoneById(id: string): ZoneDefinition | undefined {
  return ZONES.find((z) => z.id === id);
}
