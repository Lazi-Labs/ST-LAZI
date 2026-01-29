import { describe, it, expect, beforeAll } from 'vitest';
import request from 'supertest';
import express from 'express';
import healthRoutes from '../../../src/api/health.js';

describe('Health API', () => {
  let app: express.Application;

  beforeAll(() => {
    app = express();
    app.use(express.json());
    app.use('/api', healthRoutes);
  });

  describe('GET /api/health', () => {
    it('should return health status', async () => {
      const response = await request(app).get('/api/health');

      expect(response.status).toBeLessThanOrEqual(503);
      expect(response.body).toHaveProperty('status');
      expect(response.body).toHaveProperty('timestamp');
      expect(response.body).toHaveProperty('checks');
      expect(Array.isArray(response.body.checks)).toBe(true);
    });

    it('should include required health checks', async () => {
      const response = await request(app).get('/api/health');

      const checkNames = response.body.checks.map((c: any) => c.check_name);
      expect(checkNames).toContain('sync_freshness');
      expect(checkNames).toContain('pending_mutations');
    });
  });

  describe('GET /api/health/sync', () => {
    it('should return sync status by endpoint', async () => {
      const response = await request(app).get('/api/health/sync');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('endpoints');
      expect(Array.isArray(response.body.endpoints)).toBe(true);
    });
  });

  describe('GET /api/health/tables', () => {
    it('should return table sizes', async () => {
      const response = await request(app).get('/api/health/tables');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('tables');
      expect(Array.isArray(response.body.tables)).toBe(true);
    });
  });
});
