/**
 * Trigger API Routes — exposes trigger data and manual controls.
 */
import { Router, Request, Response } from 'express';
import { getRecentTriggerEvents, runTriggerCycle, MONITORED_ZONES } from '../triggers';

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
router.get('/zones', (_req: Request, res: Response) => {
  res.json({ zones: MONITORED_ZONES });
});

/**
 * POST /api/triggers/poll — Manually trigger a polling cycle.
 * Useful for testing and demos.
 */
router.post('/poll', async (_req: Request, res: Response) => {
  try {
    const result = await runTriggerCycle();
    res.json({
      message: 'Polling cycle completed',
      ...result,
    });
  } catch (err) {
    console.error('Error running manual poll:', err);
    res.status(500).json({ message: 'Failed to run polling cycle' });
  }
});

export default router;
