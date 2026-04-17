import { HeatmapService } from '../services/heatmap.service';

export class HeatmapController {
  constructor(private heatmapService: HeatmapService) {}

  getHeatmap = async (req: any, res: any) => {
    try {
      const limit = Number(req.query.limit) || 200;
      const includeMock = req.query.includeMock === 'true';
      
      const data = await this.heatmapService.getHeatmapData(limit, includeMock);
      res.json(data);
    } catch (err: any) {
      console.error('Error generating heatmap data:', err);
      res.status(500).json({ message: 'Failed to generate heatmap data' });
    }
  };
}
