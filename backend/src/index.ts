import app from './app';
import { config } from './config';
import { connectRedis } from './lib/redis';
import { db } from './lib/db';
import { startTriggerScheduler } from './triggers';

const startServer = async () => {
  try {
    // 1. Connect to Database
    await db.query('SELECT 1');
    console.log('PostgreSQL/TimescaleDB connection verified');

    // 2. Start Listening (Start early so we can respond to health checks)
    app.listen(config.port, () => {
      console.log(`
🛡️ RideSuraksha Core API is running!
🚀 Port: ${config.port}
🌍 Environment: ${config.nodeEnv}
      `);

      // 3. Connect to Redis (Fail-soft background)
      connectRedis().catch(() => {
        console.warn('⚠️ WARNING: Redis connection failed. Deduplication handles this gracefully.');
      });

      // 4. Start Trigger Monitoring Scheduler
      startTriggerScheduler();
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
