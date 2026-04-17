import { db } from "../lib/db";
import { v4 as uuidv4 } from 'uuid';

export class PayoutService {
  /**
   * Dispatches mock payouts for a simulation event using pg pool.
   */
  static async dispatchMockPayout(triggerEventId: string, payoutAmount: number, zone: string) {
    try {
      // 1. Fetch eligible workers in that zone (from DB)
      // Using a fallback if user table structure differs
      const result = await db.query(
        `SELECT id FROM users WHERE current_zone = $1 AND status = 'ACTIVE' LIMIT 20`,
        [zone]
      );
      
      const workers = result.rows;

      if (workers.length === 0) {
        console.log(`[SIMULATION] No active workers found in ${zone} for payouts.`);
        return { count: 0, total: 0 };
      }

      // 2. Create payout records
      for (const worker of workers) {
        const payoutId = uuidv4();
        const txnId = `MOCK-TXN-${uuidv4().slice(0, 8)}`;
        
        await db.query(
          `INSERT INTO payouts (id, user_id, trigger_event_id, amount, status, method, transaction_id, created_at)
           VALUES ($1, $2, $3, $4, $5, $6, $7, NOW())`,
          [payoutId, worker.id, triggerEventId, payoutAmount, 'PAID', 'PHONEPE_MOCK', txnId]
        );
      }

      return {
        count: workers.length,
        total: workers.length * payoutAmount
      };
    } catch (err) {
      console.error("Failed to dispatch mock payouts:", err);
      return { count: 0, total: 0 };
    }
  }
}
