import { Router, Request, Response } from 'express';
import { getRecentTriggerEvents, getAllZones } from '../triggers';

const router = Router();

/**
 * GET /api/heatmap — Returns weighted coordinate points for risk visualization.
 * Query params: ?limit=100&includeMock=true
 */
router.get('/', async (req: Request, res: Response) => {
  try {
    const { limit, includeMock } = req.query;
    const events = await getRecentTriggerEvents(
      Number(limit) || 200, // Fetch more to ensure we find active risks
      undefined,
      undefined,
      includeMock === 'true'
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
          const latOffset = (Math.random() - 0.5) * 0.12; // Wider spread
          const lngOffset = (Math.random() - 0.5) * 0.12;
          const jitterWeight = baseWeight * (0.3 + Math.random() * 0.7);

          heatmapData.push({
            lat: Number(zone.lat) + latOffset,
            lng: Number(zone.lon) + lngOffset,
            weight: Number(jitterWeight.toFixed(2))
          });
        }
      }
    });

    // 2. Add high-visibility mock data if requested and DB is low on active risks
    // This ensures the "WOW" effect even in "Good Weather" days
    if (includeMock === 'true') {
      const mockRisks = [
        { lat: 19.0178, lng: 72.8478, name: 'Mumbai Dadar (Mock High Risk)', weight: 4.5 },
        { lat: 12.9352, lng: 77.6245, name: 'Bengaluru (Mock Risk)', weight: 2.8 },
        { lat: 28.6315, lng: 77.2167, name: 'Delhi CP (Mock Risk)', weight: 3.2 }
      ];

      mockRisks.forEach(risk => {
        for (let i = 0; i < 20; i++) {
          const latOffset = (Math.random() - 0.5) * 0.15;
          const lngOffset = (Math.random() - 0.5) * 0.15;
          heatmapData.push({
            lat: risk.lat + latOffset,
            lng: risk.lng + lngOffset,
            weight: risk.weight * (0.5 + Math.random() * 0.5)
          });
        }
      });
    }

    res.json(heatmapData);
  } catch (err) {
    console.error('Error generating heatmap data:', err);
    res.status(500).json({ message: 'Failed to generate heatmap data' });
  }
});

export default router;
