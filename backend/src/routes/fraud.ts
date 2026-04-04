import express from 'express';

const router = express.Router();

// Mock data for fraud requests
const MOCK_FRAUD_REQUESTS = [
  {
    id: 'f1',
    worker_id: 'W-9912',
    zone_name: 'East Coast Road',
    request_type: 'Rainfall Claim',
    amount: 1200,
    status: 'PENDING',
    category: 'SUSPICIOUS',
    fraud_score: 0.85,
    top_signals: ['VPN Detected', 'Emulator Used', 'High Rainfall deviation'],
    created_at: new Date().toISOString()
  },
  {
    id: 'f2',
    worker_id: 'W-8823',
    zone_name: 'Mount Road',
    request_type: 'AQI Payout',
    amount: 800,
    status: 'PROCESSED',
    category: 'CLEAN',
    fraud_score: 0.12,
    top_signals: ['Verified Location', 'Device consistency'],
    created_at: new Date().toISOString()
  },
  {
    id: 'f3',
    worker_id: 'W-7745',
    zone_name: 'OMR Corridor',
    request_type: 'HeatIndex Claim',
    amount: 500,
    status: 'PENDING',
    category: 'HOLD_24HR',
    fraud_score: 0.45,
    top_signals: ['Multiple accounts from same device'],
    created_at: new Date().toISOString()
  }
];

// GET /api/fraud/requests
router.get('/requests', (req, res) => {
  res.json(MOCK_FRAUD_REQUESTS);
});

// POST /api/fraud/requests/:id/score
router.post('/requests/:id/score', (req, res) => {
  const { id } = req.params;
  const request = MOCK_FRAUD_REQUESTS.find(r => r.id === id);
  if (!request) {
    return res.status(404).json({ message: 'Request not found' });
  }
  // For mock, just return success
  res.json({
    message: 'Scoring initiated',
    request_id: id,
    status: 'PROCESSED'
  });
});

export default router;
