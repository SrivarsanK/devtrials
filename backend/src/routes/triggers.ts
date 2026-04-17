import { Router } from 'express';
import { TriggerController } from '../controllers/trigger.controller';

const router = Router();
const triggerController = new TriggerController();

/**
 * GET /api/triggers — List recent trigger events.
 * Query params: ?type=RAINFALL&zone=chennai_tambaram&limit=50&includeMock=true
 */
router.get('/', triggerController.getEvents);

/**
 * GET /api/triggers/zones — List all monitored zones.
 */
router.get('/zones', triggerController.getZones);

/**
 * POST /api/triggers/zones — Register a new zone.
 */
router.post('/zones', triggerController.addZone);

/**
 * POST /api/triggers/poll — Manually trigger a weather and pollution monitoring cycle.
 */
router.post('/poll', triggerController.poll);

export default router;
