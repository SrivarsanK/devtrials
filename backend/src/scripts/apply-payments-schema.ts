import { Client } from 'pg';
import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';

dotenv.config({ path: path.join(__dirname, '../../.env') });

async function runSchema() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });

  try {
    await client.connect();
    console.log('Connected to DB');
    const sql = fs.readFileSync(path.join(__dirname, '../../schema-payments.sql'), 'utf-8');
    await client.query(sql);
    console.log('Schema applied successfully');
  } catch (err) {
    console.error('Error applying schema', err);
  } finally {
    await client.end();
  }
}

runSchema();
