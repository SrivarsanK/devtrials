const fs = require('fs');

const redZones = [
  "Sholinganallur", "Karapakkam", "Thiruvanmiyur", "Saidapet", "Kotturpuram", "Jafferkhanpet", "Nandambakkam", "Ennore", "Manali", "Kolathur", "Vyasarpadi", "Wimco Nagar", "Tiruvottiyur", "Royapuram", "Tondiarpet", "Guindy", "Perungudi", "Perambur"
];
const orangeZones = [
  "Velachery", "Pallikaranai", "Madipakkam", "Perumbakkam", "Semmencherry", "Adyar Estuarine Belt", "Sunnambu Kolathur", "Ambattur", "Avadi", "Porur", "Chrompet", "Pallavaram", "Tambaram", "Medavakkam", "Nanganallur", "Meenambakkam", "Egmore", "Chepauk", "Mylapore", "Triplicane", "Royapettah", "Virugambakkam", "Valasaravakkam", "Mogappair", "Poonamallee", "Korattur", "Anna Nagar", "Adyar"
];
const greenZones = [
  "Nungambakkam", "T Nagar", "Kilpauk", "Teynampet", "Alwarpet", "Thousand Lights", "Choolaimedu", "Vadapalani", "Saligramam", "Ashok Nagar", "Kodambakkam", "Purasaiwakkam", "Aminjikarai", "Besant Nagar", "Nandanam", "Santhome"
];

function toId(name) { return 'CHN_' + name.toUpperCase().replace(/\s+/g, '_'); }

let zonesOutput = `export interface ZoneGeoData {
  id: string;
  name: string;
  city: string;
  lat: number;
  lng: number;
  radiusMeters: number;
}

export const ZONE_GEO_DATA: ZoneGeoData[] = [\n`;

function genGeo(list, status) {
  list.forEach((z) => {
    let lat = 13.0 + (Math.random() * 0.2 - 0.1);
    let lng = 80.2 + (Math.random() * 0.2 - 0.1);
    zonesOutput += `  { id: '${toId(z)}', name: '${z}', city: 'Chennai', lat: ${lat.toFixed(4)}, lng: ${lng.toFixed(4)}, radiusMeters: ${1500 + Math.floor(Math.random() * 1000)} },\n`;
  });
}
genGeo(redZones, 'RED');
genGeo(orangeZones, 'ORANGE');
genGeo(greenZones, 'GREEN');
zonesOutput += '];\n';

fs.writeFileSync('src/data/zones.ts', zonesOutput);


let reservesOutput = `import { GlobalReserveHealth } from '@/types';\n\nexport const mockReserveHealth: GlobalReserveHealth = {
  reserveBalanceCrores: 4.2,
  activeLiabilityCrores: 3.1,
  coverageRatioPercent: 135,
  lossRatioPercent: 61.3,
  weeklyPremiumInflowLakhs: 48.3,
  weeklyClaimsOutflowLakhs: 29.6,
  globalStatus: 'AMBER',
  globalMessage: 'Chennai northeast monsoon active — continuous monitoring',
  cities: [
    {
      city: 'Chennai',
      status: 'AMBER',
      activePolicies: 12450,
      reserveLakhs: 142,
      liabilityLakhs: 168,
      zones: [\n`;

function genRes(list, status) {
  list.forEach(z => {
    let pol = 1000 + Math.floor(Math.random() * 3000);
    let res = 20 + Math.random() * 30;
    let lia = res * (0.8 + Math.random() * 0.5);
    let cov = (res / lia) * 100;
    let pred = lia * (0.1 + Math.random() * 0.2);
    let paused = status === 'RED' ? (Math.random() > 0.5) : false;
    let outStatus = status === 'ORANGE' ? 'AMBER' : status;
    reservesOutput += `        { id: '${toId(z)}', name: '${z}', city: 'Chennai', status: '${outStatus}', coverageRatioPercent: ${Math.floor(cov)}, reserveLakhs: ${res.toFixed(1)}, liabilityLakhs: ${lia.toFixed(1)}, policies: ${pol}, predictedClaims7dLakhs: ${pred.toFixed(1)}, issuancesPaused: ${paused} },\n`;
  });
}
genRes(redZones, 'RED');
genRes(orangeZones, 'ORANGE');
genRes(greenZones, 'GREEN');

reservesOutput += `      ]
    }
  ]
};\n`;
fs.writeFileSync('src/data/mock/reserves.ts', reservesOutput);
