import { Router } from 'express';
import { HeatmapService } from '../services/heatmap.service';
import { HeatmapController } from '../controllers/heatmap.controller';

const router = Router();
const heatmapService = new HeatmapService();
const heatmapController = new HeatmapController(heatmapService);

/**
 * GET /api/heatmap — Returns weighted coordinate points for risk visualization.
 * Query params: ?limit=100&includeMock=true
 */
router.get('/', heatmapController.getHeatmap);

export default router;
