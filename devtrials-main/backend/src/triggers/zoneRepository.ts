import { db } from '../lib/db';
import { ZoneConfig } from './types';

/**
 * Zone Repository — manages monitored zones in the database.
 */
export async function getAllZones(): Promise<ZoneConfig[]> {
  const query = 'SELECT id, name, city, lat, lon, accuweather_key as "accuWeatherKey" FROM monitored_zones WHERE is_active = TRUE';
  try {
    const result = await db.query(query);
    return result.rows;
  } catch (err) {
    console.error('Failed to fetch zones from DB, falling back to empty list:', err);
    return [];
  }
}

export async function addZone(zone: Omit<ZoneConfig, 'id'>): Promise<ZoneConfig> {
  const id = `${zone.city.toLowerCase()}_${zone.name.toLowerCase().replace(/\s+/g, '_')}`;
  const query = `
    INSERT INTO monitored_zones (id, name, city, lat, lon, accuweather_key)
    VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING id, name, city, lat, lon, accuweather_key as "accuWeatherKey"
  `;
  const values = [id, zone.name, zone.city, zone.lat, zone.lon, zone.accuWeatherKey || null];

  try {
    const result = await db.query(query, values);
    return result.rows[0];
  } catch (err) {
    console.error('Failed to add zone to DB:', err);
    throw err;
  }
}
