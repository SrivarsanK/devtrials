import { AccuWeatherService } from '../backend/src/lib/accuWeatherService';
import { MONITORED_ZONES } from '../backend/src/triggers/types';

async function verify() {
  console.log('--- AccuWeather Location Key Verification ---');
  for (const zone of MONITORED_ZONES) {
    const key = await AccuWeatherService.getLocationKey(zone.lat, zone.lon);
    console.log(`Zone: ${zone.name} (${zone.city}) -> Lat/Lon: ${zone.lat}, ${zone.lon} -> AccuWeather Key: ${key}`);
  }
}

verify().catch(console.error);
