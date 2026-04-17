import { getRecentTriggerEvents, getAllZones } from '../triggers';

export class HeatmapService {
  async getHeatmapData(limit: number, includeMock: boolean) {
    const events = await getRecentTriggerEvents(
      limit,
      undefined,
      undefined,
      includeMock
    );

    const zones = await getAllZones();
    const zoneRisk: Record<string, number> = {};
    
    events.forEach(event => {
      const status = event.status || '';
      if (status === 'ACTIVE' || status === 'PROCESSING') {
        const threshold = Number(event.threshold_value || event.thresholdValue || 1);
        const actual = Number(event.actual_value || event.actualValue || 0);
        const intensity = threshold > 0 ? actual / threshold : 1;
        
        // Handle snake_case or camelCase from DB results
        const zid = event.zone_id || event.zoneId;
        zoneRisk[zid] = (zoneRisk[zid] || 0) + intensity;
      }
    });

    const heatmapData: { lat: number; lng: number; weight: number }[] = [];

    // 1. Process real risks from DB
    Object.entries(zoneRisk).forEach(([zoneId, totalRisk]) => {
      const zone = zones.find(z => z.id === zoneId);
      if (zone) {
        const baseWeight = Math.min(totalRisk, 5);
        const pointCount = 15 + Math.floor(baseWeight * 10);
        
        for (let i = 0; i < pointCount; i++) {
          // Reduced jitter radius from 0.12 (13km) to 0.03 (3.3km) for tighter clusters strictly around the zone
          const latOffset = (Math.random() - 0.5) * 0.03; 
          const lngOffset = (Math.random() - 0.5) * 0.03;
          const jitterWeight = baseWeight * (0.3 + Math.random() * 0.7);

          heatmapData.push({
            lat: Number(zone.lat) + latOffset,
            lng: Number(zone.lon) + lngOffset,
            weight: Number(jitterWeight.toFixed(2))
          });
        }
      }
    });

    // 2. Add high-visibility mock data strictly mimicking Chennai Zones
    if (includeMock) {
      const chennaiMockRisks = [
        { lat: 12.9010, lng: 80.2279, name: 'Sholinganallur', weight: 4.5 },
        { lat: 13.0216, lng: 80.2231, name: 'Saidapet', weight: 3.8 },
        { lat: 13.2131, lng: 80.3214, name: 'Ennore', weight: 3.2 },
        { lat: 12.9813, lng: 80.2209, name: 'Velachery', weight: 2.5 }
      ];

      chennaiMockRisks.forEach(risk => {
        for (let i = 0; i < 20; i++) {
          // Tight cluster bound to 2.2km radius to prevent bleeding out of zone
          const latOffset = (Math.random() - 0.5) * 0.02;
          const lngOffset = (Math.random() - 0.5) * 0.02;
          heatmapData.push({
            lat: risk.lat + latOffset,
            lng: risk.lng + lngOffset,
            weight: risk.weight * (0.5 + Math.random() * 0.5)
          });
        }
      });
    }

    return heatmapData;
  }
}
