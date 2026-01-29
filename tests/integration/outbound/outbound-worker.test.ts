import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { Pool } from 'pg';
import { config } from '../../../src/config/index.js';

describe('Outbound Worker Integration', () => {
  let db: Pool;

  beforeAll(async () => {
    db = new Pool({ connectionString: config.database.url });
  });

  afterAll(async () => {
    await db.query(`DELETE FROM outbound.mutations WHERE initiated_by = 'test-outbound'`);
    await db.end();
  });

  describe('Mutation Queue', () => {
    it('should create mutation with correct status', async () => {
      const result = await db.query(`
        INSERT INTO outbound.mutations 
          (entity_type, entity_id, operation, payload, initiated_by, status)
        VALUES ('pricebook_services', 666001, 'update', '{"price": 99}', 'test-outbound', 'pending')
        RETURNING *
      `);

      expect(result.rows[0].status).toBe('pending');
      expect(result.rows[0].retry_count).toBe(0);
    });

    it('should enforce status constraint', async () => {
      await expect(
        db.query(`
          INSERT INTO outbound.mutations 
            (entity_type, entity_id, operation, payload, initiated_by, status)
          VALUES ('pricebook_services', 666002, 'update', '{}', 'test-outbound', 'invalid_status')
        `)
      ).rejects.toThrow();
    });

    it('should handle idempotency key uniqueness', async () => {
      const idempotencyKey = 'test-idempotency-key-' + Date.now();

      await db.query(`
        INSERT INTO outbound.mutations 
          (entity_type, entity_id, operation, payload, initiated_by, idempotency_key)
        VALUES ('pricebook_services', 666003, 'update', '{}', 'test-outbound', $1)
      `, [idempotencyKey]);

      await expect(
        db.query(`
          INSERT INTO outbound.mutations 
            (entity_type, entity_id, operation, payload, initiated_by, idempotency_key)
          VALUES ('pricebook_services', 666004, 'update', '{}', 'test-outbound', $1)
        `, [idempotencyKey])
      ).rejects.toThrow(/duplicate|unique/i);
    });
  });

  describe('DLQ Trigger', () => {
    it('should support dlq status', async () => {
      const result = await db.query(`
        INSERT INTO outbound.mutations 
          (entity_type, entity_id, operation, payload, initiated_by, status, retry_count)
        VALUES ('pricebook_services', 666010, 'update', '{}', 'test-outbound', 'dlq', 3)
        RETURNING *
      `);

      expect(result.rows[0].status).toBe('dlq');
      expect(result.rows[0].retry_count).toBe(3);
    });
  });

  describe('Conflict Detection', () => {
    it('should store baseline hash for conflict detection', async () => {
      const result = await db.query(`
        INSERT INTO outbound.mutations 
          (entity_type, entity_id, operation, payload, initiated_by, based_on_payload_hash)
        VALUES ('pricebook_services', 666020, 'update', '{}', 'test-outbound', 'abc123hash')
        RETURNING *
      `);

      expect(result.rows[0].based_on_payload_hash).toBe('abc123hash');
    });
  });
});
