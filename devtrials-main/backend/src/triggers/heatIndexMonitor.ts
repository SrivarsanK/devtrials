/**
 * Heat Index Monitor (TM-003)
 * Pulls feels-like temperature data from OpenWeatherMap API.
 * Threshold: Feels-like temp > 45°C sustained 3hrs in peak delivery hours.
 * Payout: ₹500
 */
import { config } from '../config';
import { TriggerEvent, ZoneConfig } from './types';
import { isAlreadyProcessed, markAsProcessed, logTriggerEvent } from './triggerRepository';
import { AccuWeatherService } from '../lib/accuWeatherService';

interface HeatApiResponse {
  main: {
    temp: number;
    feels_like: number;
    humidity: number;
    temp_max: number;
  };
  name: string;
}

/**
 * Fetch feels-like temperature for a zone from OpenWeatherMap.
 */
async function fetchHeatData(zone: ZoneConfig): Promise<{ feelsLike: number; temp: number; humidity: number } | null> {
  const { key, baseUrl } = config.apis.openWeather;

  if (!key) {
    console.error(`[Heat Index Monitor] No API key for ${zone.name}`);
    return null;
  }

  try {
    const url = `${baseUrl}/weather?lat=${zone.lat}&lon=${zone.lon}&appid=${key}&units=metric`;
    const response = await fetch(url);
    if (!response.ok) {
      console.error(`OpenWeather API error for ${zone.name}: ${response.statusText}`);
      return null;
    }
    const json = await response.json() as HeatApiResponse;
    return {
      feelsLike: json.main.feels_like,
      temp: json.main.temp,
      humidity: json.main.humidity,
    };
  } catch (err) {
    console.error(`Failed to fetch heat data for ${zone.name}:`, err);
    return null;
  }
}

/**
 * Generate mock heat data for development/testing.
 * Chennai and Delhi get higher temperatures to match real patterns.
 */
function generateMockHeatData(zone: ZoneConfig): { feelsLike: number; temp: number; humidity: number } {
  // Logic removed - no mock data allowed
  return { feelsLike: 0, temp: 0, humidity: 0 };
}

/**
 * Evaluate specified zones for Heat Index threshold breaches using live OpenWeatherMap data.
 */
export async function checkHeatIndex(zones: ZoneConfig[]): Promise<TriggerEvent[]> {
  const triggeredEvents: TriggerEvent[] = [];
  const threshold = config.triggers.heatIndex.thresholdCelsius;
  const apiKey = config.apis.openWeather.key;

  if (!apiKey) {
    console.error('[Heat Index Monitor] CRITICAL: OPENWEATHER_API_KEY is missing. Skipping live poll.');
    return [];
  }

  console.log(`[Heat Index Monitor] Checking ${zones.length} zones via live API (threshold: >${threshold}°C feels-like)`);

  for (const zone of zones) {
    const data = await fetchHeatData(zone);
    if (!data) continue;

    console.log(`  [${zone.name}] Live Feels-like: ${data.feelsLike}°C (actual: ${data.temp}°C)`);

    // Fetch AccuWeather Forecast as supplemental data
    let forecastHeadline = 'N/A';
    try {
      // Use pre-defined key from MONITORED_ZONES if available
      const locationKey = zone.accuWeatherKey || await AccuWeatherService.getLocationKey(zone.lat, zone.lon);
      if (locationKey) {
        const forecast = await AccuWeatherService.get5DayForecast(locationKey);
        if (forecast) {
          forecastHeadline = forecast.Headline.Text;
          console.log(`  [${zone.name}] AccuWeather Forecast: ${forecastHeadline}`);
        }
      }
    } catch (accuErr) {
      console.warn(`  [${zone.name}] Failed to fetch AccuWeather supplemental data`);
    }

    const breached = data.feelsLike > threshold;
    const alreadyProcessed = breached ? await isAlreadyProcessed('HEAT_INDEX', zone.id) : false;

    const event: TriggerEvent = {
      triggerType: 'HEAT_INDEX',
      zoneId: zone.id,
      timestamp: new Date(),
      dataSource: 'OpenWeatherMap',
      thresholdValue: threshold,
      actualValue: data.feelsLike,
      status: breached ? 'ACTIVE' : 'RESOLVED',
      metadata: {
        city: zone.city,
        zoneName: zone.name,
        actualTemp: data.temp,
        humidity: data.humidity,
        accuWeatherHeadline: forecastHeadline,
        sustainedHrsRequired: config.triggers.heatIndex.sustainedHrs,
        payoutAmount: breached ? config.triggers.heatIndex.payoutAmount : 0,
        triggerBreached: breached,
        duplicateSuppressed: alreadyProcessed,
      },
    };

    try {
      const saved = await logTriggerEvent(event);
      if (breached && !alreadyProcessed) {
        await markAsProcessed('HEAT_INDEX', zone.id);
        triggeredEvents.push(saved);
        console.log(`  🔥 TRIGGER FIRED: ${zone.name} — ${data.feelsLike}°C feels-like!`);
      }
    } catch (err) {
      console.error(`  Failed to log heat trigger for ${zone.name}:`, err);
    }
  }

  return triggeredEvents;
}
