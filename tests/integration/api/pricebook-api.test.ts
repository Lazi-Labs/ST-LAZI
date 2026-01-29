import { describe, it, expect, beforeAll } from 'vitest';
import request from 'supertest';
import express from 'express';
import pricebookRoutes from '../../../src/api/v1/pricebook.js';

describe('Pricebook API', () => {
  let app: express.Application;

  beforeAll(() => {
    app = express();
    app.use(express.json());
    app.use('/api/v1/pricebook', pricebookRoutes);
  });

  describe('GET /api/v1/pricebook/services', () => {
    it('should return paginated services', async () => {
      const response = await request(app)
        .get('/api/v1/pricebook/services')
        .query({ limit: 10 });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('data');
      expect(response.body).toHaveProperty('meta');
      expect(response.body.meta).toHaveProperty('total');
      expect(response.body.meta).toHaveProperty('limit', 10);
      expect(Array.isArray(response.body.data)).toBe(true);
    });

    it('should support search', async () => {
      const response = await request(app)
        .get('/api/v1/pricebook/services')
        .query({ search: 'pool', limit: 10 });

      expect(response.status).toBe(200);
    });

    it('should support active_only filter', async () => {
      const response = await request(app)
        .get('/api/v1/pricebook/services')
        .query({ active_only: true, limit: 10 });

      expect(response.status).toBe(200);
    });

    it('should respect limit cap', async () => {
      const response = await request(app)
        .get('/api/v1/pricebook/services')
        .query({ limit: 5000 });

      expect(response.status).toBe(200);
      expect(response.body.meta.limit).toBeLessThanOrEqual(1000);
    });
  });

  describe('GET /api/v1/pricebook/services/:id', () => {
    it('should return 404 for non-existent service', async () => {
      const response = await request(app)
        .get('/api/v1/pricebook/services/999999999');

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('error');
    });
  });

  describe('GET /api/v1/pricebook/categories', () => {
    it('should return categories', async () => {
      const response = await request(app)
        .get('/api/v1/pricebook/categories');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('data');
      expect(Array.isArray(response.body.data)).toBe(true);
    });
  });
});
