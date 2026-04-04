export interface ZoneGeoData {
  id: string;
  name: string;
  city: string;
  lat: number;
  lng: number;
  radiusMeters: number;
}

export const ZONE_GEO_DATA: ZoneGeoData[] = [
  { id: 'CHN_ANNA_NAGAR', name: 'Anna Nagar', city: 'Chennai', lat: 13.0850, lng: 80.2101, radiusMeters: 2000 },
  { id: 'CHN_T_NAGAR', name: 'T Nagar', city: 'Chennai', lat: 13.0418, lng: 80.2341, radiusMeters: 1800 },
  { id: 'CHN_TAMBARAM', name: 'Tambaram', city: 'Chennai', lat: 12.9249, lng: 80.1000, radiusMeters: 2200 },
  { id: 'MUM_DHARAVI', name: 'Dharavi', city: 'Mumbai', lat: 19.0330, lng: 72.8570, radiusMeters: 1600 },
  { id: 'MUM_ANDHERI', name: 'Andheri', city: 'Mumbai', lat: 19.1136, lng: 72.8697, radiusMeters: 2000 },
  { id: 'DEL_LAXMI_NAGAR', name: 'Laxmi Nagar', city: 'Delhi', lat: 28.6310, lng: 77.2780, radiusMeters: 1800 },
  { id: 'DEL_KAROL_BAGH', name: 'Karol Bagh', city: 'Delhi', lat: 28.6520, lng: 77.1900, radiusMeters: 1800 },
];
