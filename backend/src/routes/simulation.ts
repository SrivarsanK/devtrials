import { Router } from 'express';
import { SimulationController } from '../controllers/simulation.controller';

const router = Router();
const simulationController = new SimulationController();

/**
 * POST /api/simulation/trigger — Manually fire a parametric disruption event.
 */
router.post('/trigger', (req, res) => simulationController.simulateTrigger(req, res));

export default router;
