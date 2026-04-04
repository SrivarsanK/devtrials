import fs from 'fs';
import path from 'path';
import { db } from '../lib/db';

async function syncDb() {
  try {
    const schemaFile = process.argv[2] || 'schema-zones.sql';
    const schemaPath = path.join(process.cwd(), schemaFile);
    if (!fs.existsSync(schemaPath)) {
      console.error('Schema file not found at:', schemaPath);
      process.exit(1);
    }

    const sql = fs.readFileSync(schemaPath, 'utf8');
    console.log('Syncing database with schema...');
    
    // Execute the SQL (split by semicolon if needed for psql imitation, but pg.query handles multiple if config.multiStatement is on - which it is not default)
    // Actually, pg.query supports multiple statements if not using parameters
    await db.query(sql);
    
    console.log('Database sync complete! Monitored zones are up to date.');
    process.exit(0);
  } catch (err) {
    console.error('Database sync failed:', err);
    process.exit(1);
  }
}

syncDb();
