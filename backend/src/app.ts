import express from 'express';
import { errorHandler } from './middleware/error-handler';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { auth } from './middleware/auth';
import triggerRoutes from './routes/triggers';
import heatmapRoutes from './routes/heatmap';
import fraudRoutes from './routes/fraud';
import paymentRoutes from './routes/payments';
import simulationRoutes from './routes/simulation';


const app = express();

// Trust proxy for rate limiting (e.g. if behind Nginx/Vercel/etc)
app.set('trust proxy', 1);

// Security & Rate Limiting
app.use(helmet());

// Production CORS: restrict to dashboard origins from env var
const corsOrigins = process.env.CORS_ORIGINS
  ? process.env.CORS_ORIGINS.split(',').map(o => o.trim())
  : '*';
app.use(cors({ origin: corsOrigins }));

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
    message: '🛡️ RideSuraksha Core API is active',
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
    service: 'RideSuraksha Core API'
  });
});

// Trigger Routes (Protected by strict rate limiting)
app.use('/api/triggers', triggerLimiter, triggerRoutes);
app.use('/api/heatmap', triggerLimiter, heatmapRoutes);
app.use('/api/fraud', triggerLimiter, fraudRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/simulation', simulationRoutes);


// Protected Test Route
app.get('/api/protected-test', auth, (req, res) => {
  res.json({
    message: 'Authentication successful',
    user: (req as any).user
  });
});

// Global Error Handling Middleware
app.use(errorHandler);

export default app;

