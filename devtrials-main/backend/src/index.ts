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

    // 2. Connect to Redis
    await connectRedis();

    // 3. Start Listening
    app.listen(config.port, () => {
      console.log(`
🛡️ GigShield Core API is running!
🚀 Port: ${config.port}
🌍 Environment: ${config.nodeEnv}
      `);

      // 4. Start Trigger Monitoring Scheduler //
      startTriggerScheduler();
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
