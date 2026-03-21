/**
 * Trigger Repository — persists and queries trigger events in TimescaleDB.
 * Also handles Redis-based deduplication to prevent re-processing the same event.
 */
import crypto from 'crypto';
import { db } from '../lib/db';
import { redis } from '../lib/redis';
import { TriggerEvent } from './types';

const DEDUP_TTL_SECONDS = 60 * 60; // 1 hour

/**
 * Check if this trigger event was already processed (dedup via Redis).
 */
export async function isAlreadyProcessed(triggerType: string, zoneId: string): Promise<boolean> {
  const key = `trigger:dedup:${triggerType}:${zoneId}`;
  try {
    const exists = await redis.get(key);
    return exists !== null;
  } catch {
    // If Redis is down, allow processing (fail-open for the hackathon)
    return false;
  }
}

/**
 * Mark a trigger as processed in Redis with a TTL.
 */
export async function markAsProcessed(triggerType: string, zoneId: string): Promise<void> {
  const key = `trigger:dedup:${triggerType}:${zoneId}`;
  try {
    await redis.set(key, '1', { EX: DEDUP_TTL_SECONDS });
  } catch (err) {
    console.error('Redis markAsProcessed error:', err);
  }
}

/**
 * Log a trigger event to the database.
 */
export async function logTriggerEvent(event: TriggerEvent): Promise<TriggerEvent> {
  const id = crypto.randomUUID();
  const query = `
    INSERT INTO trigger_events (id, trigger_type, zone_id, timestamp, data_source, threshold_value, actual_value, affected_worker_count, status, metadata)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
    RETURNING *;
  `;
  const values = [
    id,
    event.triggerType,
    event.zoneId,
    event.timestamp,
    event.dataSource,
    event.thresholdValue,
    event.actualValue,
    event.affectedWorkerCount || 0,
    event.status,
    JSON.stringify(event.metadata || {}),
  ];

  try {
    const result = await db.query(query, values);
    return { ...event, id: result.rows[0].id };
  } catch (err) {
    console.error('Failed to log trigger event:', err);
    throw err;
  }
}

/**
 * Fetch recent trigger events, optionally filtered by type and zone.
 */
export async function getRecentTriggerEvents(
  limit: number = 50,
  triggerType?: string,
  zoneId?: string,
  includeMock: boolean = false
): Promise<any[]> {
  let query = 'SELECT * FROM trigger_events WHERE 1=1';
  const params: any[] = [];
  let paramIdx = 1;

  if (triggerType) {
    query += ` AND trigger_type = $${paramIdx++}`;
    params.push(triggerType);
  }
  if (zoneId) {
    query += ` AND zone_id = $${paramIdx++}`;
    params.push(zoneId);
  }
  if (!includeMock) {
    query += ` AND data_source NOT IN ('MockData', 'manual_seed')`;
  }

  query += ` ORDER BY timestamp DESC LIMIT $${paramIdx}`;
  params.push(limit);

  const result = await db.query(query, params);
  return result.rows;
}
