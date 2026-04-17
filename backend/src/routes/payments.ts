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
router.post('/initiate', auth, async (req, res) => {
  try {
    const { amount } = req.body;
    const userId = (req as any).user.id;

    if (!amount || amount <= 0) {
      return res.status(400).json({ message: 'Invalid amount' });
    }

    const merchantTransactionId = `MT${Date.now()}${Math.floor(Math.random() * 1000)}`;

    // Save initial transaction state
    await db.query(
      'INSERT INTO payments (user_id, amount, status, merchant_transaction_id) VALUES ($1, $2, $3, $4)',
      [userId, amount, 'PENDING', merchantTransactionId]
    );

    const result = await PhonePe.setupSubscription({
      amount,
      merchantOrderId: merchantTransactionId,
      mobileNumber: req.body.mobileNumber
    });

    res.json({
      success: true,
      url: result.redirectUrl,
      transactionId: merchantTransactionId,
      subscriptionId: result.merchantSubscriptionId
    });
  } catch (error: any) {
    console.error('Payment initiation error:', error);
    res.status(500).json({ message: error.message || 'Internal server error' });
  }
});

// 2. PhonePe Webhook (Callback)
router.post('/webhook', async (req, res) => {
  try {
    const { response } = req.body;
    const signature = req.headers['x-verify'] as string;

    if (!response || !signature) {
      return res.status(400).json({ message: 'Invalid webhook payload' });
    }

    const { isValid, payload } = await PhonePe.verifyWebhookSignature(req.headers, JSON.stringify(req.body));
    
    if (!isValid || !payload) {
      console.warn('⚠️ Invalid PhonePe webhook signature');
      return res.status(401).json({ message: 'Unauthorized' });
    }

    console.log('PhonePe Webhook Payload:', payload);

    const { state, merchantOrderId, transactionId, subscriptionDetails } = payload as any;

    if (state === 'COMPLETED') {
      console.log(`✅ Payment & Mandate successful for ${merchantOrderId}`);
      
      const metadata = subscriptionDetails ? { subscriptionId: subscriptionDetails.subscriptionId } : {};

      await db.query(
        'UPDATE payments SET status = $1, phonepe_transaction_id = $2, metadata = $3, updated_at = NOW() WHERE merchant_transaction_id = $4',
        ['SUCCESS', transactionId, JSON.stringify(metadata), merchantOrderId]
      );
    } else {
      console.log(`❌ Payment failed/pending for ${merchantOrderId}: ${state}`);
      await db.query(
        'UPDATE payments SET status = $1, updated_at = NOW() WHERE merchant_transaction_id = $3',
        ['FAILED', merchantOrderId]
      );
    }

    res.status(200).send('OK');
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(500).send('Internal Server Error');
  }
});

// 3. Manual Status Check
router.get('/status/:transactionId', auth, paymentController.status);

// 4. Instant Claim (Refund/Payout)
router.post('/claim', auth, paymentController.claim);

export default router;
