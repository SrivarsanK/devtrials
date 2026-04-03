/**
 * Trigger API Routes — exposes trigger data and manual controls.
 */
import { Router, Request, Response } from 'express';
import { getRecentTriggerEvents, runTriggerCycle } from '../triggers';
import { getAllZones, addZone } from '../triggers/zoneRepository';

const router = Router();

/**
 * GET /api/triggers — List recent trigger events.
 * Query params: ?type=RAINFALL&zone=chennai_tambaram&limit=50&includeMock=true
 */
router.get('/', async (req: Request, res: Response) => {
  try {
    const { type, zone, limit, includeMock } = req.query;
    const events = await getRecentTriggerEvents(
      Number(limit) || 50,
      type as string,
      zone as string,
      includeMock === 'true'
    );
    res.json({ events, count: events.length });
  } catch (err) {
    console.error('Error fetching trigger events:', err);
    res.status(500).json({ message: 'Failed to fetch trigger events' });
  }
});

/**
 * GET /api/triggers/zones — List all monitored zones.
 */
router.get('/zones', async (_req: Request, res: Response) => {
  try {
    const zones = await getAllZones();
    res.json({ zones });
  } catch (err) {
    console.error('Error fetching monitored zones:', err);
    res.status(500).json({ message: 'Failed to fetch monitored zones' });
  }
});

/**
 * POST /api/triggers/zones — Register a new zone.
 */
router.post('/zones', async (req: Request, res: Response) => {
  try {
    const { name, city, lat, lon, accuWeatherKey } = req.body;
    if (!name || !city || typeof lat !== 'number' || typeof lon !== 'number') {
      return res.status(400).json({ message: 'Missing required zone fields (name, city, lat, lon)' });
    }
    const newZone = await addZone({ name, city, lat, lon, accuWeatherKey });
    res.status(201).json({ zone: newZone });
  } catch (err) {
    console.error('Error adding new zone:', err);
    res.status(500).json({ message: 'Failed to register new zone' });
  }
});

export default router;
