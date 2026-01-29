import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import express from 'express';
import { Pool } from 'pg';
import { config } from '../../../src/config/index.js';
import mutationsRoutes from '../../../src/api/v1/mutations.js';

describe('Mutations API', () => {
  let app: express.Application;
  let db: Pool;

  beforeAll(() => {
    app = express();
    app.use(express.json());
    app.use('/api/v1/mutations', mutationsRoutes);
    db = new Pool({ connectionString: config.database.url });
  });

  afterAll(async () => {
    await db.query(`DELETE FROM outbound.mutations WHERE initiated_by = 'test'`);
    await db.end();
  });

  describe('POST /api/v1/mutations', () => {
    it('should create a mutation', async () => {
      const response = await request(app)
        .post('/api/v1/mutations')
        .send({
          entity_type: 'pricebook_services',
          entity_id: 777001,
          operation: 'update',
          payload: { price: 199.99 },
          initiated_by: 'test',
        });

      expect(response.status).toBe(201);
      expect(response.body.data).toHaveProperty('id');
      expect(response.body.data.status).toBe('pending');
      expect(response.body.data.entity_type).toBe('pricebook_services');
    });

    it('should return 400 for missing fields', async () => {
      const response = await request(app)
        .post('/api/v1/mutations')
        .send({
          entity_type: 'pricebook_services',
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });

    it('should generate idempotency key', async () => {
      const payload = {
        entity_type: 'pricebook_services',
        entity_id: 777002,
        operation: 'update',
        payload: { price: 99.99 },
        initiated_by: 'test',
      };

      const response1 = await request(app).post('/api/v1/mutations').send(payload);
      const response2 = await request(app).post('/api/v1/mutations').send(payload);

      expect(response1.body.data.idempotency_key).toBe(response2.body.data.idempotency_key);
    });
  });

  describe('GET /api/v1/mutations/:id', () => {
    it('should return mutation by id', async () => {
      const createResponse = await request(app)
        .post('/api/v1/mutations')
        .send({
          entity_type: 'pricebook_services',
          entity_id: 777003,
          operation: 'update',
          payload: { price: 149.99 },
          initiated_by: 'test',
        });

      const mutationId = createResponse.body.data.id;

      const response = await request(app)
        .get(`/api/v1/mutations/${mutationId}`);

      expect(response.status).toBe(200);
      expect(response.body.data.id).toBe(mutationId);
    });

    it('should return 404 for non-existent mutation', async () => {
      const response = await request(app)
        .get('/api/v1/mutations/00000000-0000-0000-0000-000000000000');

      expect(response.status).toBe(404);
    });
  });

  describe('GET /api/v1/mutations', () => {
    it('should list mutations with filters', async () => {
      const response = await request(app)
        .get('/api/v1/mutations')
        .query({ status: 'pending', limit: 10 });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('data');
      expect(response.body).toHaveProperty('meta');
    });
  });
});
