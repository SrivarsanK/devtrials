import request from 'supertest';
import jwt from 'jsonwebtoken';
import app from './app';
import { config } from './config';

describe('API Endpoints', () => {
  describe('GET /health', () => {
    it('should return 200 and UP status', async () => {
      const res = await request(app).get('/health');
      expect(res.status).toBe(200);
      expect(res.body.status).toBe('UP');
      expect(res.body.service).toBe('GigShield Core API');
    });
  });

  describe('GET /api/protected-test', () => {
    it('should return 401 if no token is provided', async () => {
      const res = await request(app).get('/api/protected-test');
      expect(res.status).toBe(401);
      expect(res.body.message).toBe('No token, authorization denied');
    });

    it('should return 401 if an invalid token is provided', async () => {
      const res = await request(app)
        .get('/api/protected-test')
        .set('Authorization', 'Bearer invalid_token');
      expect(res.status).toBe(401);
      expect(res.body.message).toBe('Token is not valid');
    });

    it('should return 200 if a valid token is provided', async () => {
      const payload = { id: 'test_user_id', role: 'worker' };
      const token = jwt.sign(payload, config.jwt.secret);

      const res = await request(app)
        .get('/api/protected-test')
        .set('Authorization', `Bearer ${token}`);
      
      expect(res.status).toBe(200);
      expect(res.body.message).toBe('Authentication successful');
      expect(res.body.user).toMatchObject(payload);
    });
  });
});
