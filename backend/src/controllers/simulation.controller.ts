import { Request, Response } from 'express';
import { db } from '../lib/db';
import { getIO } from '../lib/socket';
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';
import { config } from '../config';
import { PayoutService } from '../services/payout.service';


export class SimulationController {
  async simulateTrigger(req: Request, res: Response) {
    const { triggerId, zone, intensity, adminId } = req.body;

    if (!['RAIN', 'AQI', 'FLOOD', 'CIVIL', 'HEAT'].includes(triggerId)) {
      return res.status(400).json({ message: 'Invalid trigger ID' });
    }

    const io = getIO();
    io.emit('trigger:firing', { triggerId, zone, timestamp: new Date() });

    try {
      // 1. Determine affected workers
      const workersCount = intensity === 'high' ? 500 : intensity === 'medium' ? 200 : 50;
      const payoutAmount = this.getPayoutAmount(triggerId);

      // 2. Insert into trigger_events
      const triggerEventId = uuidv4();
      await db.query(
        `INSERT INTO trigger_events (id, type, zone_id, metadata, is_simulation, fired_by, created_at)
         VALUES ($1, $2, $3, $4, $5, $6, NOW())`,
        [triggerEventId, triggerId, zone, JSON.stringify({ intensity }), true, adminId]
      );

      // 3. Generate mock claims and call ML (simplified for demo)
      const mockClaims = [];
      for (let i = 0; i < 10; i++) { // Only do small batch for ML demo to stay fast
        mockClaims.push({
          workerId: uuidv4(),
          zone: zone,
          triggerType: triggerId,
          ordersDropPercent: Math.random() * 100,
          gpsVerified: true,
          isSimulation: true
        });
      }

      let fraudScores: any[] = [];
      try {
        const mlResponse = await axios.post(`${config.mlService.url}/api/fraud/batch-score`, {
          claims: mockClaims
        }, { timeout: 2000 });
        fraudScores = mlResponse.data.scores;
      } catch (err) {
        console.warn('ML Service unreachable, using default scores');
        fraudScores = mockClaims.map(c => ({ workerId: c.workerId, anomalyScore: Math.random() * 20 }));
      }

      // 4. Record claims in DB (batching if possible, but here 1 by 1 for simplicity in small demo)
      let totalPayout = 0;
      for (const score of fraudScores) {
        const claimId = uuidv4();
        await db.query(
          `INSERT INTO claims (id, user_id, trigger_id, status, amount, is_simulation, fraud_score, created_at)
           VALUES ($1, $2, $3, $4, $5, $6, $7, NOW())`,
          [claimId, score.workerId, triggerEventId, 'auto_approved', payoutAmount, true, score.anomalyScore]
        );
        totalPayout += payoutAmount;
      }

      // 5. Mock Payout Dispatch
      const payoutResult = await PayoutService.dispatchMockPayout(triggerEventId, payoutAmount, zone);
      console.log(`[SIMULATION] Mock payout dispatched for ${payoutResult.count} workers via UPI`);


      const summary = {
        eventId: triggerEventId,
        triggerId,
        zone,
        intensity,
        affectedWorkers: workersCount,
        payoutAmount,
        totalPayout: fraudScores.length * payoutAmount, // Using the sample size for summary
        avgFraudScore: fraudScores.reduce((acc, s) => acc + s.anomalyScore, 0) / fraudScores.length,
        timestamp: new Date()
      };

      // 6. Socket Broadcast
      io.emit('trigger:simulated', summary);

      return res.status(200).json(summary);

    } catch (error: any) {
      console.error('Simulation failed:', error);
      io.emit('trigger:error', { triggerId, message: error.message });
      return res.status(500).json({ message: 'Simulation failed', error: error.message });
    }
  }

  private getPayoutAmount(triggerId: string): number {
    const payouts: Record<string, number> = {
      'RAIN': 800,
      'AQI': 600,
      'FLOOD': 800,
      'CIVIL': 700,
      'HEAT': 500
    };
    return payouts[triggerId] || 500;
  }
}
