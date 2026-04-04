import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { auth } from './middleware/auth';
import triggerRoutes from './routes/triggers';
import heatmapRoutes from './routes/heatmap';

const app = express();

// Security & Rate Limiting
app.use(helmet());
app.use(cors());
app.use(express.json());

// Global Rate Limiter: 500 requests / 15 min (increased for dev)
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 500,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Too many requests, please try again later.' }
});
app.use(globalLimiter);

// Stricter limiter for triggers: 100 requests / 15 min
const triggerLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { message: 'High traffic on triggers, rate limited.' }
});

// Root Route
app.get('/', (req, res) => {
  res.json({
    message: '🛡️ GigShield Core API is active',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      triggers: '/api/triggers',
      zones: '/api/triggers/zones'
    }
  });
});

// Public Routes
app.get('/health', (req, res) => {
  res.json({
    status: 'UP',
    timestamp: new Date().toISOString(),
    service: 'GigShield Core API'
  });
});

// Trigger Routes (Protected by strict rate limiting)
app.use('/api/triggers', triggerLimiter, triggerRoutes);
app.use('/api/heatmap', triggerLimiter, heatmapRoutes);

// Protected Test Route
app.get('/api/protected-test', auth, (req, res) => {
  res.json({
    message: 'Authentication successful',
    user: (req as any).user
  });
});

export default app;

