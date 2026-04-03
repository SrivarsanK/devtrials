import { Pool } from 'pg';
import { config } from '../config';

const pool = new Pool({
  connectionString: config.db.url,
});

pool.on('connect', () => {
  console.log('Connected to PostgreSQL/TimescaleDB');
});

pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
  process.exit(-1);
});

export const db = {
  query: (text: string, params?: any[]) => pool.query(text, params),
  pool,
};
