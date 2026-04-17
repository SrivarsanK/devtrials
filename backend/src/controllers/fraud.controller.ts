import { FraudService } from '../services/fraud.service';

export class FraudController {
  constructor(private fraudService: FraudService) {}

  getRequests = (req: any, res: any) => {
    try {
      const requests = this.fraudService.getAllRequests();
      res.json(requests);
    } catch (error: any) {
      res.status(500).json({ message: error.message || 'Internal server error' });
    }
  };

  scoreRequest = (req: any, res: any) => {
    try {
      const { id } = req.params;
      const result = this.fraudService.scoreRequest(id);
      res.json(result);
    } catch (error: any) {
      if (error.message === 'Request not found') {
        return res.status(404).json({ message: error.message });
      }
      res.status(500).json({ message: error.message || 'Internal server error' });
    }
  };
}
