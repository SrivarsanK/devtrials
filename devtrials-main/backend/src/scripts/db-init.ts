import { db } from '../lib/db';

async function init() {
  const query = `
    CREATE TABLE IF NOT EXISTS trigger_events (
      id UUID PRIMARY KEY,
      trigger_type TEXT NOT NULL,
      zone_id TEXT NOT NULL,
      timestamp TIMESTAMPTZ NOT NULL,
      data_source TEXT NOT NULL,
      threshold_value DOUBLE PRECISION NOT NULL,
      actual_value DOUBLE PRECISION NOT NULL,
      affected_worker_count INTEGER DEFAULT 0,
      status TEXT NOT NULL,
      metadata JSONB DEFAULT '{}'
    );
  `;
  try {
    await db.query(query);
    console.log('✅ trigger_events table created or already exists.');
    process.exit(0);
  } catch (err) {
    console.error('❌ Failed to create table:', err);
    process.exit(1);
  }
}

init();
