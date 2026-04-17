import { Router } from 'express';
import { auth } from '../middleware/auth';
import { PaymentController } from '../controllers/payment.controller';
import { PaymentService } from '../services/payment.service';

const router = Router();
const paymentService = new PaymentService();
const paymentController = new PaymentController(paymentService);

// 1. Initiate Payment
router.post('/initiate', auth, paymentController.initiate);

// 2. PhonePe Webhook (Callback)
router.post('/webhook', paymentController.webhook);

// 3. Manual Status Check
router.get('/status/:transactionId', auth, paymentController.status);

// 4. Instant Claim (Refund/Payout)
router.post('/claim', auth, paymentController.claim);

export default router;
