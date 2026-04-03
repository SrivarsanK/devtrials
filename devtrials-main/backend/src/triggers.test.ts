/**
 * Tests for the Parametric Trigger Monitoring system (Phase 2).
 * Tests the mock data generation, trigger configuration, and API routes.
 */
import request from 'supertest';
import app from './app';
import { MONITORED_ZONES } from './triggers/types';
import { config } from './config';

describe('Phase 2: Parametric Trigger Monitoring', () => {

  describe('Trigger Configuration', () => {
    it('should have correct rainfall thresholds', () => {
      expect(config.triggers.rainfall.thresholdMm).toBe(10);
      expect(config.triggers.rainfall.windowHrs).toBe(3);
      expect(config.triggers.rainfall.payoutAmount).toBe(800);
    });

    it('should have correct AQI thresholds', () => {
      expect(config.triggers.aqi.threshold).toBe(100);
      expect(config.triggers.aqi.sustainedHrs).toBe(4);
      expect(config.triggers.aqi.payoutAmount).toBe(600);
    });

    it('should have correct Heat Index thresholds', () => {
      expect(config.triggers.heatIndex.thresholdCelsius).toBe(35);
      expect(config.triggers.heatIndex.sustainedHrs).toBe(3);
      expect(config.triggers.heatIndex.payoutAmount).toBe(500);
    });
  });

  describe('Monitored Zones', () => {
    it('should have at least 4 monitored zones', () => {
      expect(MONITORED_ZONES.length).toBeGreaterThanOrEqual(4);
    });

    it('should have required properties for each zone', () => {
      for (const zone of MONITORED_ZONES) {
        expect(zone).toHaveProperty('id');
        expect(zone).toHaveProperty('name');
        expect(zone).toHaveProperty('city');
        expect(zone).toHaveProperty('lat');
        expect(zone).toHaveProperty('lon');
        expect(typeof zone.lat).toBe('number');
        expect(typeof zone.lon).toBe('number');
      }
    });

    it('should include key cities (Chennai, Mumbai, Bengaluru)', () => {
      const cities = MONITORED_ZONES.map(z => z.city);
      expect(cities).toContain('Chennai');
      expect(cities).toContain('Mumbai');
      expect(cities).toContain('Bengaluru');
    });
  });

  describe('API Routes', () => {
    it('GET /api/triggers/zones should return monitored zones', async () => {
      const res = await request(app).get('/api/triggers/zones');
      expect(res.status).toBe(200);
      expect(res.body.zones).toBeInstanceOf(Array);
      expect(res.body.zones.length).toBeGreaterThanOrEqual(4);
      expect(res.body.zones[0]).toHaveProperty('id');
      expect(res.body.zones[0]).toHaveProperty('lat');
    });

    it('GET /health should still work after trigger routes are added', async () => {
      const res = await request(app).get('/health');
      expect(res.status).toBe(200);
      expect(res.body.status).toBe('UP');
    });
  });
});
