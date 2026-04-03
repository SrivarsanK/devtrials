import { config } from '../config';
import { redis } from './redis';

interface LocationResponse {
  Key: string;
  LocalizedName: string;
  EnglishName: string;
  Country: { ID: string; LocalizedName: string };
  AdministrativeArea: { ID: string; LocalizedName: string };
}

interface DailyForecast {
  Date: string;
  EpochDate: number;
  Temperature: {
    Minimum: { Value: number; Unit: string };
    Maximum: { Value: number; Unit: string };
  };
  Day: { Icon: number; IconPhrase: string; HasPrecipitation: boolean };
  Night: { Icon: number; IconPhrase: string; HasPrecipitation: boolean };
}

interface ForecastResponse {
  Headline: { Text: string; Category: string };
  DailyForecasts: DailyForecast[];
}

interface MinuteCastResponse {
  Summary: { Phrase: string; ColorCode: string };
  Intervals: Array<{
    Minute: number;
    DateTime: string;
    RainValue: number;
    SnowValue: number;
    IceValue: number;
    CloudCover: number;
  }>;
}

/**
 * AccuWeather Service to handle location keys and weather forecasts.
 */
export class AccuWeatherService {
  private static apiKey = config.apis.accuWeather.key;
  private static baseUrl = config.apis.accuWeather.baseUrl;

  /**
   * Get Location Key from coordinates (Geoposition Search).
   */
  static async getLocationKey(lat: number, lng: number): Promise<string | null> {
    if (!this.apiKey) return null;

    // Standardize lat/lng to 2 decimal places for better cache reuse
    const roundedLat = lat.toFixed(2);
    const roundedLng = lng.toFixed(2);
    const cacheKey = `accuweather:location:${roundedLat}:${roundedLng}`;

    try {
      // Check Redis cache first
      if (redis.isOpen) {
        const cachedKey = await redis.get(cacheKey);
        if (cachedKey) return cachedKey;
      }

      const url = `${this.baseUrl}/locations/v1/cities/geoposition/search?apikey=${this.apiKey}&q=${lat},${lng}`;
      const response = await fetch(url);
      if (!response.ok) {
        console.error(`AccuWeather Location Search Error: ${response.statusText}`);
        return null;
      }
      const data = await response.json() as LocationResponse;
      const locationKey = data.Key;

      // Store in Redis cache for 24 hours
      if (redis.isOpen && locationKey) {
        await redis.set(cacheKey, locationKey, { EX: 86400 });
      }

      return locationKey;
    } catch (err) {
      console.error('Failed to fetch AccuWeather Location Key:', err);
      return null;
    }
  }

  /**
   * Get 5-day daily forecast for a specific location key.
   */
  static async get5DayForecast(locationKey: string): Promise<ForecastResponse | null> {
    if (!this.apiKey) return null;

    const cacheKey = `accuweather:forecast:${locationKey}`;
    try {
      if (redis.isOpen) {
        const cached = await redis.get(cacheKey);
        if (cached) return JSON.parse(cached);
      }

      const url = `${this.baseUrl}/forecasts/v1/daily/5day/${locationKey}?apikey=${this.apiKey}&metric=true`;
      const response = await fetch(url);
      if (!response.ok) {
        console.error(`AccuWeather Forecast Error: ${response.statusText}`);
        return null;
      }
      const data = await response.json() as ForecastResponse;

      if (redis.isOpen && data) {
        await redis.set(cacheKey, JSON.stringify(data), { EX: 10800 }); // 3 hours cache to fit 50 calls/day limit
      }

      return data;
    } catch (err) {
      console.error('Failed to fetch AccuWeather 5-day forecast:', err);
      return null;
    }
  }

  /**
   * Get 120-minute MinuteCast for coordinates.
   */
  static async getMinuteCast(lat: number, lng: number): Promise<MinuteCastResponse | null> {
    if (!this.apiKey) return null;

    // Use standardized lat/lng for cache key
    const roundedLat = lat.toFixed(2);
    const roundedLng = lng.toFixed(2);
    const cacheKey = `accuweather:minutecast:${roundedLat}:${roundedLng}`;

    try {
      if (redis.isOpen) {
        const cached = await redis.get(cacheKey);
        if (cached) return JSON.parse(cached);
      }

      const url = `${this.baseUrl}/forecasts/v1/minute?apikey=${this.apiKey}&q=${lat},${lng}`;
      const response = await fetch(url);
      if (!response.ok) {
        console.error(`AccuWeather MinuteCast Error: ${response.statusText}`);
        return null;
      }
      const data = await response.json() as MinuteCastResponse;

      if (redis.isOpen && data) {
        await redis.set(cacheKey, JSON.stringify(data), { EX: 10800 }); // 3 hours cache
      }

      return data;
    } catch (err) {
      console.error('Failed to fetch AccuWeather MinuteCast:', err);
      return null;
    }
  }
}
