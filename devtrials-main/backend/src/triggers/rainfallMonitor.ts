/**
 * Rainfall Monitor (TM-001)
 * Pulls rainfall data from OpenWeatherMap API.
 * Threshold: >50mm in 3hrs in a worker's GPS zone.
 * Payout: ₹800
 */
import { config } from '../config';
import { TriggerEvent, ZoneConfig } from './types';
import { isAlreadyProcessed, markAsProcessed, logTriggerEvent } from './triggerRepository';
import { AccuWeatherService } from '../lib/accuWeatherService';

interface WeatherApiResponse {
  rain?: { '1h'?: number; '3h'?: number };
  name: string;
  main: { temp: number; feels_like: number; humidity: number };
  weather: Array<{ main: string; description: string }>;
}

/**
 * Fetch current weather data for a zone from OpenWeatherMap.
 */
async function fetchWeatherData(zone: ZoneConfig): Promise<WeatherApiResponse | null> {
  const { key, baseUrl } = config.apis.openWeather;

  // In development without an API key, return mock data
  if (!key) {
    console.error(`[Rainfall Monitor] No API key for ${zone.name}`);
    return null;
  }

  try {
    const url = `${baseUrl}/weather?lat=${zone.lat}&lon=${zone.lon}&appid=${key}&units=metric`;
    const response = await fetch(url);
    if (!response.ok) {
      console.error(`OpenWeather API error for ${zone.name}: ${response.statusText}`);
      return null;
    }
    return await response.json() as WeatherApiResponse;
  } catch (err) {
    console.error(`Failed to fetch weather for ${zone.name}:`, err);
    return null;
  }
}

/**
 * Evaluate specified zones for rainfall threshold breaches using live OpenWeatherMap data.
 */
export async function checkRainfall(zones: ZoneConfig[]): Promise<TriggerEvent[]> {
  const triggeredEvents: TriggerEvent[] = [];
  const threshold = config.triggers.rainfall.thresholdMm;
  const apiKey = config.apis.openWeather.key;

  if (!apiKey) {
    console.error('[Rainfall Monitor] CRITICAL: OPENWEATHER_API_KEY is missing. Skipping live poll.');
    return [];
  }

  console.log(`[Rainfall Monitor] Checking ${zones.length} zones via live API (threshold: ${threshold}mm/3hrs)`);

  for (const zone of zones) {
    const data = await fetchWeatherData(zone);
    if (!data) continue;

    const rainfall3h = data.rain?.['3h'] || 0;
    console.log(`  [${zone.name}] Live Rainfall 3h: ${rainfall3h}mm`);

    // Fetch AccuWeather MinuteCast as supplemental data
    let minuteCastSummary = 'N/A';
    try {
      const mc = await AccuWeatherService.getMinuteCast(zone.lat, zone.lon);
      if (mc) {
        minuteCastSummary = mc.Summary.Phrase;
        console.log(`  [${zone.name}] MinuteCast: ${minuteCastSummary}`);
      }
    } catch (mcErr) {
      console.warn(`  [${zone.name}] Failed to fetch MinuteCast supplemental data`);
    }

    const breached = rainfall3h > threshold;
    const alreadyProcessed = breached ? await isAlreadyProcessed('RAINFALL', zone.id) : false;

    const event: TriggerEvent = {
      triggerType: 'RAINFALL',
      zoneId: zone.id,
      timestamp: new Date(),
      dataSource: 'OpenWeatherMap',
      thresholdValue: threshold,
      actualValue: rainfall3h,
      status: breached ? 'ACTIVE' : 'RESOLVED',
      metadata: {
        city: zone.city,
        zoneName: zone.name,
        weatherDescription: data.weather[0]?.description,
        temperature: data.main.temp,
        minuteCast: minuteCastSummary,
        payoutAmount: breached ? config.triggers.rainfall.payoutAmount : 0,
        triggerBreached: breached,
        duplicateSuppressed: alreadyProcessed,
      },
    };

    try {
      const saved = await logTriggerEvent(event);
      if (breached && !alreadyProcessed) {
        await markAsProcessed('RAINFALL', zone.id);
        triggeredEvents.push(saved);
        console.log(`  🌧️ TRIGGER FIRED: ${zone.name} — ${rainfall3h}mm rainfall!`);
      }
    } catch (err) {
      console.error(`  Failed to log rainfall trigger for ${zone.name}:`, err);
    }
  }

  return triggeredEvents;
}
