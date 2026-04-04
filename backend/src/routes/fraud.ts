import { Router } from 'express';
import { db } from '../lib/db';
import { config } from '../config';

const router = Router();

// 1. Get all fraud requests
router.get('/requests', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM fraud_requests ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching fraud requests:', error);
    res.status(500).json({ error: 'Failed to fetch fraud requests' });
  }
});

// 2. Score a specific request using ML API
router.post('/score/:id', async (req, res) => {
  const { id } = req.params;
  try {
    // a. Fetch request details
    const reqResult = await db.query('SELECT * FROM fraud_requests WHERE id = $1', [id]);
    if (reqResult.rows.length === 0) {
      return res.status(404).json({ error: 'Request not found' });
    }
    const fraudRequest = reqResult.rows[0];

    // b. Call ML service
    // Use default features if missing
    const features = {
        worker_id: fraudRequest.worker_id,
        zone_name: fraudRequest.zone_name,
        ...(fraudRequest.raw_features || {})
    };

    const mlResponse = await fetch(`${config.mlService.url}/ml/fraud/score`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(features),
    });
    
    if (!mlResponse.ok) {
        throw new Error(`ML API error: ${mlResponse.statusText}`);
    }
    
    const mlData: any = await mlResponse.json();

    // c. Update database with ML results
    const updateQuery = `
      UPDATE fraud_requests 
      SET 
        status = 'PROCESSED',
        fraud_score = $1,
        category = $2,
        top_signals = $3,
        updated_at = NOW()
      WHERE id = $4
      RETURNING *
    `;
    
    // ML returns "adjusted_score" and "decision"
    const score = mlData.adjusted_score || 0;
    const category = mlData.decision || 'UNKNOWN';
    const topSignals = JSON.stringify(mlData.top_fraud_signals || []);

    const updateResult = await db.query(updateQuery, [score, category, topSignals, id]);

    res.json(updateResult.rows[0]);
  } catch (error) {
    console.error(`Error scoring request ${id}:`, error);
    res.status(500).json({ error: 'Failed to score request' });
  }
});

export default router;
