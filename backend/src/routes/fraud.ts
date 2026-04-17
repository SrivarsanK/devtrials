import express from 'express';
import { FraudController } from '../controllers/fraud.controller';
import { FraudService } from '../services/fraud.service';

const router = express.Router();

const fraudService = new FraudService();
const fraudController = new FraudController(fraudService);

// GET /api/fraud/requests
router.get('/requests', fraudController.getRequests);

// POST /api/fraud/requests/:id/score
router.post('/requests/:id/score', fraudController.scoreRequest);

export default router;
