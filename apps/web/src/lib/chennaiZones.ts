/**
 * Chennai Zone Classification Data
 * 
 * 62 localities classified into 3 risk tiers:
 *   - RED (18 zones)   — Priority 1, High Scrutiny (Cluster 0)
 *   - ORANGE (28 zones) — Priority 2, Standard (Cluster 1)
 *   - GREEN (16 zones)  — Priority 3, Fast Track (Cluster 2)
 * 
 * Coordinates are approximate centroids for each locality.
 */

export type ZoneTier = 'red' | 'orange' | 'green';

export interface ChennaiZone {
  name: string;
  region: string;
  zone: ZoneTier;
  lat: number;
  lng: number;
  radius?: number;
}

// ── Red Zones (Priority 1 — High Scrutiny — Cluster 0) ────────────────────────
export const RED_ZONES: ChennaiZone[] = [
  { name: "Sholinganallur", region: "South Chennai (OMR)", zone: "red", lat: 12.9010, lng: 80.2279 },
  { name: "Karapakkam", region: "South Chennai (OMR)", zone: "red", lat: 12.9248, lng: 80.2222 },
  { name: "Thiruvanmiyur", region: "Coastal South", zone: "red", lat: 12.9864, lng: 80.2641 },
  { name: "Saidapet", region: "Central-South", zone: "red", lat: 13.0216, lng: 80.2231 },
  { name: "Kotturpuram", region: "Central-South", zone: "red", lat: 13.0158, lng: 80.2419 },
  { name: "Jafferkhanpet", region: "Central-South", zone: "red", lat: 13.0254, lng: 80.2107 },
  { name: "Nandambakkam", region: "Central-South", zone: "red", lat: 13.0150, lng: 80.2004 },
  { name: "Ennore", region: "North Chennai", zone: "red", lat: 13.2131, lng: 80.3214 },
  { name: "Manali", region: "North Chennai", zone: "red", lat: 13.1660, lng: 80.2606 },
  { name: "Kolathur", region: "North Chennai", zone: "red", lat: 13.1237, lng: 80.2176 },
  { name: "Vyasarpadi", region: "North Chennai", zone: "red", lat: 13.1131, lng: 80.2565 },
  { name: "Wimco Nagar", region: "North Chennai", zone: "red", lat: 13.2015, lng: 80.3128 },
  { name: "Tiruvottiyur", region: "North Chennai", zone: "red", lat: 13.1637, lng: 80.3002 },
  { name: "Royapuram", region: "North Chennai (Coastal)", zone: "red", lat: 13.1164, lng: 80.2918 },
  { name: "Tondiarpet", region: "North Chennai", zone: "red", lat: 13.1258, lng: 80.2818 },
  { name: "Guindy", region: "Central-South", zone: "red", lat: 13.0067, lng: 80.2206 },
  { name: "Perungudi", region: "South Chennai (OMR)", zone: "red", lat: 12.9614, lng: 80.2423 },
  { name: "Perambur", region: "North Chennai", zone: "red", lat: 13.1183, lng: 80.2338 },
];

// ── Orange Zones (Priority 2 — Standard — Cluster 1) ──────────────────────────
export const ORANGE_ZONES: ChennaiZone[] = [
  { name: "Velachery", region: "South Chennai", zone: "orange", lat: 12.9813, lng: 80.2209 },
  { name: "Pallikaranai", region: "South Chennai", zone: "orange", lat: 12.9379, lng: 80.2033 },
  { name: "Madipakkam", region: "South Chennai", zone: "orange", lat: 12.9623, lng: 80.2029 },
  { name: "Perumbakkam", region: "South Chennai", zone: "orange", lat: 12.9191, lng: 80.2013 },
  { name: "Semmencherry", region: "South Chennai", zone: "orange", lat: 12.8800, lng: 80.2239 },
  { name: "Adyar Estuarine Belt", region: "South Chennai", zone: "orange", lat: 13.0066, lng: 80.2565 },
  { name: "Sunnambu Kolathur", region: "South Chennai", zone: "orange", lat: 12.9100, lng: 80.2113 },
  { name: "Ambattur", region: "West Chennai", zone: "orange", lat: 13.0985, lng: 80.1604 },
  { name: "Avadi", region: "North-West Chennai", zone: "orange", lat: 13.1145, lng: 80.1011 },
  { name: "Porur", region: "West Chennai", zone: "orange", lat: 13.0383, lng: 80.1563 },
  { name: "Chrompet", region: "South-West Chennai", zone: "orange", lat: 12.9516, lng: 80.1426 },
  { name: "Pallavaram", region: "South-West Chennai", zone: "orange", lat: 12.9675, lng: 80.1498 },
  { name: "Tambaram", region: "South-West Chennai", zone: "orange", lat: 12.9249, lng: 80.1277 },
  { name: "Medavakkam", region: "South Chennai", zone: "orange", lat: 12.9184, lng: 80.1920 },
  { name: "Nanganallur", region: "South Chennai", zone: "orange", lat: 12.9825, lng: 80.1887 },
  { name: "Meenambakkam", region: "South-West Chennai", zone: "orange", lat: 12.9847, lng: 80.1633 },
  { name: "Egmore", region: "Central", zone: "orange", lat: 13.0732, lng: 80.2609 },
  { name: "Chepauk", region: "Central-East", zone: "orange", lat: 13.0627, lng: 80.2828 },
  { name: "Mylapore", region: "Central-East", zone: "orange", lat: 13.0368, lng: 80.2676 },
  { name: "Triplicane", region: "Central-East", zone: "orange", lat: 13.0548, lng: 80.2741 },
  { name: "Royapettah", region: "Central-East", zone: "orange", lat: 13.0498, lng: 80.2635 },
  { name: "Virugambakkam", region: "West Chennai", zone: "orange", lat: 13.0495, lng: 80.1924 },
  { name: "Valasaravakkam", region: "West Chennai", zone: "orange", lat: 13.0427, lng: 80.1717 },
  { name: "Mogappair", region: "North-West Chennai", zone: "orange", lat: 13.0856, lng: 80.1730 },
  { name: "Poonamallee", region: "West Chennai", zone: "orange", lat: 13.0473, lng: 80.0893 },
  { name: "Korattur", region: "North-West Chennai", zone: "orange", lat: 13.1109, lng: 80.2000 },
  { name: "Anna Nagar", region: "North-West Chennai", zone: "orange", lat: 13.0856, lng: 80.2101 },
  { name: "Adyar", region: "South Chennai", zone: "orange", lat: 13.0012, lng: 80.2565 },
];

// ── Green Zones (Priority 3 — Fast Track — Cluster 2) ─────────────────────────
export const GREEN_ZONES: ChennaiZone[] = [
  { name: "Nungambakkam", region: "Central", zone: "green", lat: 13.0569, lng: 80.2425 },
  { name: "T Nagar", region: "Central", zone: "green", lat: 13.0418, lng: 80.2341 },
  { name: "Kilpauk", region: "Central", zone: "green", lat: 13.0782, lng: 80.2452 },
  { name: "Teynampet", region: "Central", zone: "green", lat: 13.0398, lng: 80.2498 },
  { name: "Alwarpet", region: "Central-South", zone: "green", lat: 13.0333, lng: 80.2503 },
  { name: "Thousand Lights", region: "Central", zone: "green", lat: 13.0568, lng: 80.2553 },
  { name: "Choolaimedu", region: "Central-West", zone: "green", lat: 13.0627, lng: 80.2227 },
  { name: "Vadapalani", region: "Central-West", zone: "green", lat: 13.0520, lng: 80.2120 },
  { name: "Saligramam", region: "West Chennai", zone: "green", lat: 13.0537, lng: 80.2036 },
  { name: "Ashok Nagar", region: "Central-West", zone: "green", lat: 13.0383, lng: 80.2141 },
  { name: "Kodambakkam", region: "Central-West", zone: "green", lat: 13.0484, lng: 80.2241 },
  { name: "Purasaiwakkam", region: "North-Central", zone: "green", lat: 13.0879, lng: 80.2538 },
  { name: "Aminjikarai", region: "Central-West", zone: "green", lat: 13.0731, lng: 80.2227 },
  { name: "Besant Nagar", region: "South Coastal", zone: "green", lat: 13.0008, lng: 80.2666 },
  { name: "Nandanam", region: "Central", zone: "green", lat: 13.0263, lng: 80.2412 },
  { name: "Santhome", region: "Central-East", zone: "green", lat: 13.0335, lng: 80.2781 },
];

// ── Combined & Utility ─────────────────────────────────────────────────────────
export const ALL_CHENNAI_ZONES: ChennaiZone[] = [
  ...RED_ZONES,
  ...ORANGE_ZONES,
  ...GREEN_ZONES,
];

/** Zone tier metadata for styling and display */
export const ZONE_TIER_CONFIG = {
  red: {
    label: 'Red Zone',
    priority: 'Priority 1 — High Scrutiny',
    cluster: 'Cluster 0',
    color: '#ff0055',
    glowColor: 'rgba(255, 0, 85, 0.4)',
    bgColor: 'rgba(255, 0, 85, 0.12)',
    borderColor: 'rgba(255, 0, 85, 0.5)',
    count: RED_ZONES.length,
  },
  orange: {
    label: 'Orange Zone',
    priority: 'Priority 2 — Standard',
    cluster: 'Cluster 1',
    color: '#ffcc00',
    glowColor: 'rgba(255, 204, 0, 0.35)',
    bgColor: 'rgba(255, 204, 0, 0.10)',
    borderColor: 'rgba(255, 204, 0, 0.45)',
    count: ORANGE_ZONES.length,
  },
  green: {
    label: 'Green Zone',
    priority: 'Priority 3 — Fast Track',
    cluster: 'Cluster 2',
    color: '#00ffcc',
    glowColor: 'rgba(0, 255, 204, 0.3)',
    bgColor: 'rgba(0, 255, 204, 0.08)',
    borderColor: 'rgba(0, 255, 204, 0.4)',
    count: GREEN_ZONES.length,
  },
} as const;
