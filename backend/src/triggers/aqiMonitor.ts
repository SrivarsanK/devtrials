/**
 * AQI Monitor (TM-002)
 * Pulls air quality data from AQICN / WAQI API.
 * Threshold: AQI > 300 (Hazardous) sustained 4hrs.
 * Payout: ₹600
 */
import { config } from '../config';
import { TriggerEvent, ZoneConfig, MONITORED_ZONES } from './types';
import { isAlreadyProcessed, markAsProcessed, logTriggerEvent } from './triggerRepository';

interface AqiApiResponse {
  status: string;
  data: {
    aqi: number;
    city: { name: string };
    dominentpol?: string;
    iaqi?: Record<string, { v: number }>;
  };
}

/**
 * Fetch AQI data for a zone from the WAQI API.
 */
async function fetchAqiData(zone: ZoneConfig): Promise<number | null> {
  const { key, baseUrl } = config.apis.aqicn;

  if (!key) {
    console.error(`[AQI Monitor] No API key for ${zone.name}`);
    return null;
  }

  try {
    const url = `${baseUrl}/feed/geo:${zone.lat};${zone.lon}/?token=${key}`;
    const response = await fetch(url);
    if (!response.ok) {
      console.error(`AQICN API error for ${zone.name}: ${response.statusText}`);
      return null;
    }
    const json = await response.json() as AqiApiResponse;
    if (json.status !== 'ok') return null;
    return json.data.aqi;
  } catch (err) {
    console.error(`Failed to fetch AQI for ${zone.name}:`, err);
    return null;
  }
}

/**
 * Generate mock AQI data for development/testing.
 * Delhi gets higher AQI values to reflect real-world patterns.
 */
function generateMockAqiData(zone: ZoneConfig): number {
  return 0; // Mock disabled
}

/**
 * Evaluate all monitored zones for AQI threshold breaches using live AQICN/WAQI API.
 */
export async function checkAqi(): Promise<TriggerEvent[]> {
  const triggeredEvents: TriggerEvent[] = [];
  const threshold = config.triggers.aqi.threshold;
  const apiKey = config.apis.aqicn.key;

  if (!apiKey) {
    console.error('[AQI Monitor] CRITICAL: AQICN_API_KEY is missing. Skipping live poll.');
    return [];
  }

  console.log(`[AQI Monitor] Checking ${MONITORED_ZONES.length} zones via live API (threshold: AQI > ${threshold})`);

  for (const zone of MONITORED_ZONES) {
    const aqi = await fetchAqiData(zone);
    if (aqi === null) continue;

    console.log(`  [${zone.name}] Live AQI: ${aqi}`);

    const breached = aqi > threshold;
    const alreadyProcessed = breached ? await isAlreadyProcessed('AQI', zone.id) : false;

    const event: TriggerEvent = {
      triggerType: 'AQI',
      zoneId: zone.id,
      timestamp: new Date(),
      dataSource: 'AQICN',
      thresholdValue: threshold,
      actualValue: aqi,
      status: breached ? 'ACTIVE' : 'RESOLVED',
      metadata: {
        city: zone.city,
        zoneName: zone.name,
        aqiCategory: breached ? 'Hazardous' : 'Normal',
        sustainedHrsRequired: config.triggers.aqi.sustainedHrs,
        payoutAmount: breached ? config.triggers.aqi.payoutAmount : 0,
        triggerBreached: breached,
        duplicateSuppressed: alreadyProcessed,
      },
    };

    try {
      const saved = await logTriggerEvent(event);
      if (breached && !alreadyProcessed) {
        await markAsProcessed('AQI', zone.id);
        triggeredEvents.push(saved);
        console.log(`  🏭 TRIGGER FIRED: ${zone.name} — AQI ${aqi} (Hazardous)!`);
      }
    } catch (err) {
      console.error(`  Failed to log AQI trigger for ${zone.name}:`, err);
    }
  }

  return triggeredEvents;
}
