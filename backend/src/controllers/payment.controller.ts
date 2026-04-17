import { PaymentService } from '../services/payment.service';

export class PaymentController {
  constructor(private paymentService: PaymentService) {}

  initiate = async (req: any, res: any) => {
    try {
      const { amount } = req.body;
      const userId = req.user.id;
      const result = await this.paymentService.initiatePayment(userId, amount);
      res.json(result);
    } catch (error: any) {
      res.status(500).json({ message: error.message || 'Internal server error' });
    }
  };

  webhook = async (req: any, res: any) => {
    try {
      // Pass the raw body as a string since PhonePe signature requires the exact raw payload
      await this.paymentService.processWebhook(req.headers, JSON.stringify(req.body));
      res.status(200).send('OK');
    } catch (error: any) {
      if (error.message === 'Unauthorized' || error.message === 'Invalid webhook payload') {
        res.status(401).json({ message: error.message });
      } else {
        res.status(500).send('Internal Server Error');
      }
    }
  };

  status = async (req: any, res: any) => {
    try {
      const { transactionId } = req.params;
      const status = await this.paymentService.checkStatus(transactionId);
      res.json(status);
    } catch (error: any) {
      res.status(500).json({ message: error.message || 'Status check failed' });
    }
  };

  claim = async (req: any, res: any) => {
    try {
      const userId = req.user.id;
      const { amount, reason, zone } = req.body;
      const result = await this.paymentService.processClaim(userId, amount, reason, zone);
      res.json(result);
    } catch (error: any) {
      if (error.message === 'No successful subscription found. Please subscribe to a plan first.') {
        res.status(404).json({ message: error.message });
      } else if (error.message === 'Amount is required') {
        res.status(400).json({ message: error.message });
      } else {
        res.status(500).json({ message: error.message || 'Internal server error' });
      }
    }
  };
}
