/**
 * Trigger Scheduler (TM-004)
 * Node-cron worker that runs every 5 minutes,
 * polling all three parametric monitors and logging results.
 */
import cron from 'node-cron';
import { checkRainfall } from './rainfallMonitor';
import { checkAqi } from './aqiMonitor';
import { checkHeatIndex } from './heatIndexMonitor';
import { getAllZones } from './zoneRepository';

let isRunning = false;

/**
 * Execute a single polling cycle across all monitors.
 */
export async function runTriggerCycle(): Promise<{
  rainfall: number;
  aqi: number;
  heatIndex: number;
  totalTriggered: number;
  cycleTime: number;
}> {
  if (isRunning) {
    console.log('[Trigger Scheduler] Previous cycle still running, skipping.');
    return { rainfall: 0, aqi: 0, heatIndex: 0, totalTriggered: 0, cycleTime: 0 };
  }

  isRunning = true;
  const startTime = Date.now();
  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log(`[Trigger Scheduler] Polling cycle started at ${new Date().toISOString()}`);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

  try {
    // 1. Fetch current zones from DB
    const zones = await getAllZones();
    if (zones.length === 0) {
      console.log('[Trigger Scheduler] No active zones found. Skipping cycle.');
      return { rainfall: 0, aqi: 0, heatIndex: 0, totalTriggered: 0, cycleTime: Date.now() - startTime };
    }

    // 2. Run all monitors concurrently with dynamic zones
    const [rainfallEvents, aqiEvents, heatEvents] = await Promise.all([
      checkRainfall(zones),
      checkAqi(zones),
      checkHeatIndex(zones),
    ]);

    const totalTriggered = rainfallEvents.length + aqiEvents.length + heatEvents.length;
    const cycleTime = Date.now() - startTime;

    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`[Trigger Scheduler] Cycle complete in ${cycleTime}ms`);
    console.log(`  Rainfall triggers:   ${rainfallEvents.length}`);
    console.log(`  AQI triggers:        ${aqiEvents.length}`);
    console.log(`  Heat Index triggers: ${heatEvents.length}`);
    console.log(`  Total triggered:     ${totalTriggered}`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    return {
      rainfall: rainfallEvents.length,
      aqi: aqiEvents.length,
      heatIndex: heatEvents.length,
      totalTriggered,
      cycleTime,
    };
  } catch (err) {
    console.error('[Trigger Scheduler] Cycle failed:', err);
    return { rainfall: 0, aqi: 0, heatIndex: 0, totalTriggered: 0, cycleTime: Date.now() - startTime };
  } finally {
    isRunning = false;
  }
}

/**
 * Start the cron scheduler — runs every 5 minutes.
 */
export function startTriggerScheduler(): void {
  console.log('[Trigger Scheduler] Starting — polling every 5 minutes');

  // Run immediately on startup
  runTriggerCycle();

  // Then schedule every 5 minutes
  cron.schedule('*/5 * * * *', () => {
    runTriggerCycle();
  });
}
