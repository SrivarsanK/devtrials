import { Router, Request, Response } from 'express';
import { getRecentTriggerEvents, MONITORED_ZONES } from '../triggers';

const router = Router();

/**
 * GET /api/heatmap — Returns weighted coordinate points for risk visualization.
 * Query params: ?limit=100&includeMock=true
 */
router.get('/', async (req: Request, res: Response) => {
  try {
    const { limit, includeMock } = req.query;
    const events = await getRecentTriggerEvents(
      Number(limit) || 100,
      undefined,
      undefined,
      includeMock === 'true'
    );

    // Group events by zone to calculate aggregate risk
    const zoneRisk: Record<string, number> = {};
    events.forEach(event => {
      if (event.status === 'ACTIVE') {
        const intensity = event.actualValue / event.thresholdValue;
        zoneRisk[event.zoneId] = (zoneRisk[event.zoneId] || 0) + intensity;
      }
    });

    const heatmapData: { lat: number; lng: number; weight: number }[] = [];

    // Generate clusters for active risks
    Object.entries(zoneRisk).forEach(([zoneId, totalRisk]) => {
      const zone = MONITORED_ZONES.find(z => z.id === zoneId);
      if (zone) {
        // Base weight capped for visualization
        const baseWeight = Math.min(totalRisk, 5);

        // Generate a "Cloud" of points around the center to make the heatmap look natural
        for (let i = 0; i < 15; i++) {
          const latOffset = (Math.random() - 0.5) * 0.05; // ~5km spread
          const lngOffset = (Math.random() - 0.5) * 0.05;
          const jitterWeight = baseWeight * (0.5 + Math.random() * 0.5);

          heatmapData.push({
            lat: zone.lat + latOffset,
            lng: zone.lon + lngOffset,
            weight: jitterWeight
          });
        }
      }
    });

    res.json(heatmapData);
  } catch (err) {
    console.error('Error generating heatmap data:', err);
    res.status(500).json({ message: 'Failed to generate heatmap data' });
  }
});

export default router;
