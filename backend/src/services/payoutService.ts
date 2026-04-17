import { db } from "../lib/db";
import { v4 as uuidv4 } from 'uuid';

export class PayoutService {
  /**
   * Dispatches a mock payout for a simulation event.
   * In production, this would integrate with PhonePe / Bank API.
   * For simulation, we create a 'mock_payout' record.
   */
  static async dispatchMockPayout(triggerEvent: any) {
    const { id: eventId, payoutAmount, zone } = triggerEvent;
    
    // 1. Fetch eligible workers in that zone (from DB)
    const workers = await db.user.findMany({
      where: {
        currentZone: zone,
        status: 'ACTIVE'
      }
    });

    if (workers.length === 0) return { count: 0, total: 0 };

    // 2. Create payout records in a transaction
    const mockPayouts = workers.map(worker => ({
      userId: worker.id,
      triggerEventId: eventId,
      amount: payoutAmount,
      status: 'PAID',
      method: 'PHONEPE_MOCK',
      transactionId: `MOCK-TXN-${uuidv4().slice(0, 8)}`,
      timestamp: new Date()
    }));

    // Save to DB (using batch create)
    // Assuming 'payout' table exists
    try {
        await (db as any).payout.createMany({
            data: mockPayouts
        });
    } catch (err) {
        console.error("Failed to persist mock payouts:", err);
    }

    return {
      count: workers.length,
      total: workers.length * payoutAmount
    };
  }
}
