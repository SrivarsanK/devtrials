/**
 * Barrel export for the triggers module.
 */
export { checkRainfall } from './rainfallMonitor';
export { checkAqi } from './aqiMonitor';
export { checkHeatIndex } from './heatIndexMonitor';
export { startTriggerScheduler, runTriggerCycle } from './scheduler';
export { getRecentTriggerEvents } from './triggerRepository';
export { getAllZones } from './zoneRepository';
export { MONITORED_ZONES } from './types';
export type { TriggerEvent, TriggerType, ZoneConfig } from './types';
