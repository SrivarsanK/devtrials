import dotenv from 'dotenv';
import path from 'path';

// Load environment variables from .env file ONLY if it exists (for local dev)
import fs from 'fs';
const envPath = path.join(__dirname, '../../.env');
if (fs.existsSync(envPath)) {
  dotenv.config({ path: envPath });
}

export const config = {
  port: process.env.PORT || 3001,
  nodeEnv: process.env.NODE_ENV || 'development',
  jwt: {
    secret: process.env.JWT_SECRET || 'fallback_secret_not_for_production',
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  },
  db: {
    url: process.env.DATABASE_URL || 'postgresql://postgres:password@localhost:5432/gigshield',
  },
  redis: {
    url: process.env.REDIS_URL || 'redis://localhost:6379',
  },
  mlService: {
    url: process.env.ML_API_URL || 'http://localhost:8000',
  },
  apis: {
    openWeather: {
      key: process.env.OPENWEATHER_API_KEY || '',
      baseUrl: 'https://api.openweathermap.org/data/2.5',
    },
    aqicn: {
      key: process.env.AQICN_API_KEY || '',
      baseUrl: 'https://api.waqi.info',
    },
    accuWeather: {
      key: process.env.ACCUWEATHER_API_KEY || '',
      baseUrl: 'https://dataservice.accuweather.com',
    },
  },
  triggers: {
    pollingIntervalMs: 5 * 60 * 1000, // 5 minutes
    rainfall: {
      thresholdMm: 10, // Lowered from 50 for testing
      windowHrs: 3,
      payoutAmount: 800,
    },
    aqi: {
      threshold: 100, // Lowered from 300 for testing
      sustainedHrs: 4,
      payoutAmount: 600,
    },
    heatIndex: {
      thresholdCelsius: 35, // Lowered from 45 for testing
      sustainedHrs: 3,
      payoutAmount: 500,
    },
  },
};
