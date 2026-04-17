import { Pool } from 'pg';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(__dirname, '../.env') });

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

async function checkPayments() {
  try {
    const res = await pool.query('SELECT * FROM payments WHERE status = \'SUCCESS\' ORDER BY created_at DESC LIMIT 5');
    console.log('SUCCESSFUL PAYMENTS:', JSON.stringify(res.rows, null, 2));
    
    const claims = await pool.query('SELECT * FROM claims ORDER BY created_at DESC LIMIT 5');
    console.log('CLAIMS:', JSON.stringify(claims.rows, null, 2));
  } catch (err) {
    console.error('Error querying DB:', err);
  } finally {
    await pool.end();
  }
}

checkPayments();
