import PhonePe from '../lib/phonepe';
import { db } from '../lib/db';
import { config } from '../config';

export class PaymentService {
  async initiatePayment(userId: string, amount: number) {
    if (!amount || amount <= 0) {
      throw new Error('Invalid amount');
    }

    const merchantTransactionId = `MT${Date.now()}${Math.floor(Math.random() * 1000)}`;

    await db.query(
      'INSERT INTO payments (user_id, amount, status, merchant_transaction_id) VALUES ($1, $2, $3, $4)',
      [userId, amount, 'PENDING', merchantTransactionId]
    );

    const result = await PhonePe.initiatePayment({
      amount,
      merchantOrderId: merchantTransactionId,
      metadata: { userId }
    });

    return {
      success: true,
      url: result.redirectUrl,
      transactionId: merchantTransactionId
    };
  }

  async processWebhook(headers: any, bodyRaw: any) {
    const { response } = JSON.parse(bodyRaw);
    const signature = headers['x-verify'] as string;

    if (!response || !signature) {
      throw new Error('Invalid webhook payload');
    }

    const { isValid, payload } = await PhonePe.verifyWebhookSignature(headers, bodyRaw);
    
    if (!isValid || !payload) {
      throw new Error('Unauthorized');
    }

    const { state, merchantOrderId, transactionId } = payload as any;

    if (state === 'COMPLETED') {
      await db.query(
        'UPDATE payments SET status = $1, phonepe_transaction_id = $2, updated_at = NOW() WHERE merchant_transaction_id = $3',
        ['SUCCESS', transactionId, merchantOrderId]
      );
    } else {
      await db.query(
        'UPDATE payments SET status = $1, updated_at = NOW() WHERE merchant_transaction_id = $3',
        ['FAILED', merchantOrderId]
      );
    }
  }

  async checkStatus(transactionId: string) {
    return await PhonePe.checkStatus(transactionId);
  }

  async processClaim(userId: string, amount: number, reason: string, zone: string) {
    if (!amount) {
      throw new Error('Amount is required');
    }

    const lastPayment = await db.query(
      'SELECT merchant_transaction_id FROM payments WHERE user_id = $1 AND status = $2 ORDER BY created_at DESC LIMIT 1',
      [userId, 'SUCCESS']
    );

    if (lastPayment.rows.length === 0) {
      throw new Error('No successful subscription found. Please subscribe to a plan first.');
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
      
      try {
        await db.query(
          'INSERT INTO claims (user_id, amount, reason, zone, status, refund_transaction_id) VALUES ($1, $2, $3, $4, $5, $6)',
          [userId, amount, reason || 'Automated Payout', zone || 'Unknown', 'PAID', refundId]
        );
      } catch (dbError) {
        console.warn('⚠️ Warning: Could not record claim in DB:', dbError);
      }

      return {
        success: true,
        message: isMock ? 'Claim processed (Simulation Mode)' : 'Claim processed successfully',
        transactionId: refundId,
        isMock
      };
    } else {
      throw new Error(result.data?.message || 'Refund processing failed (PhonePe side)');
    }
  }
}
