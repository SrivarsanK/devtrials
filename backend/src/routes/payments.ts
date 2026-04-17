import { Router } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { auth } from '../middleware/auth';
import PhonePe from '../lib/phonepe';
import { db } from '../lib/db';
import { config } from '../config';

const router = Router();

// 1. Initiate Payment
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

    const result = await PhonePe.initiatePayment({
      amount,
      merchantOrderId: merchantTransactionId,
      metadata: { userId }
    });

    res.json({
      success: true,
      url: result.redirectUrl,
      transactionId: merchantTransactionId
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

    const { state, merchantOrderId, transactionId } = payload as any;

    if (state === 'COMPLETED') {
      console.log(`✅ Payment successful for ${merchantOrderId}`);
      await db.query(
        'UPDATE payments SET status = $1, phonepe_transaction_id = $2, updated_at = NOW() WHERE merchant_transaction_id = $3',
        ['SUCCESS', transactionId, merchantOrderId]
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
router.get('/status/:transactionId', auth, async (req, res) => {
  try {
    const { transactionId } = req.params;
    const status = await PhonePe.checkStatus(transactionId);
    
    res.json(status);
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Status check failed' });
  }
});

// 4. Instant Claim (Refund/Payout)
router.post('/claim', auth, async (req, res) => {
  try {
    const userId = (req as any).user.id;
    const { amount, reason, zone } = req.body;

    if (!amount) {
      return res.status(400).json({ message: 'Amount is required' });
    }

    // Find the original merchant transaction ID for this user's payment to perform a refund
    // In a production app, we would link this to a specific policy or disruption event
    const lastPayment = await db.query(
      'SELECT merchant_transaction_id FROM payments WHERE user_id = $1 AND status = $2 ORDER BY created_at DESC LIMIT 1',
      [userId, 'SUCCESS']
    );

    if (lastPayment.rows.length === 0) {
      return res.status(404).json({ 
        message: 'No successful subscription found. Please subscribe to a plan first.' 
      });
    }

    const originalTransactionId = lastPayment.rows[0].merchant_transaction_id;

    const result = await PhonePe.handleRefund({
      originalTransactionId,
      refundAmount: amount,
      merchantUserId: userId
    });

    if (result.success || config.nodeEnv === 'development') {
      const isMock = !result.success;
      const refundId = result.refundTransactionId || `MOCK_R${Date.now()}`;
      
      // Record the claim in the database
      try {
        await db.query(
          'INSERT INTO claims (user_id, amount, reason, zone, status, refund_transaction_id) VALUES ($1, $2, $3, $4, $5, $6)',
          [userId, amount, reason || 'Automated Payout', zone || 'Unknown', 'PAID', refundId]
        );
      } catch (dbError) {
        console.warn('⚠️ Warning: Could not record claim in DB:', dbError);
      }

      res.json({
        success: true,
        message: isMock ? 'Claim processed (Simulation Mode)' : 'Claim processed successfully',
        transactionId: refundId,
        isMock
      });
    } else {
      res.status(400).json({ 
        success: false, 
        message: result.data?.message || 'Refund processing failed (PhonePe side)' 
      });
    }
  } catch (error: any) {
    console.error('Claim processing error:', error);
    res.status(500).json({ message: error.message || 'Internal server error' });
  }
});

export default router;
