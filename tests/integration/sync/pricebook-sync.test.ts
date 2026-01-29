import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { Pool } from 'pg';
import { config } from '../../../src/config/index.js';
import { mockPricebookService } from '../../fixtures/servicetitan.js';

describe('Pricebook Sync Integration', () => {
  let db: Pool;

  beforeAll(async () => {
    db = new Pool({ connectionString: config.database.url });
  });

  afterAll(async () => {
    await db.end();
  });

  describe('Raw Table', () => {
    it('should have immutability protection', async () => {
      const insertResult = await db.query(`
        INSERT INTO raw.st_pricebook_services (payload, sync_batch_id, synced_at)
        VALUES ($1, $2, NOW())
        RETURNING id
      `, [JSON.stringify(mockPricebookService), '00000000-0000-0000-0000-000000000001']);

      const id = insertResult.rows[0].id;

      await expect(
        db.query(`UPDATE raw.st_pricebook_services SET payload = '{}' WHERE id = $1`, [id])
      ).rejects.toThrow(/immutable/i);

      await expect(
        db.query(`DELETE FROM raw.st_pricebook_services WHERE id = $1`, [id])
      ).rejects.toThrow(/immutable/i);
    });

    it('should compute st_id from payload', async () => {
      const result = await db.query(`
        INSERT INTO raw.st_pricebook_services (payload, sync_batch_id, synced_at)
        VALUES ($1, $2, NOW())
        RETURNING st_id
      `, [JSON.stringify({ ...mockPricebookService, id: 888001 }), '00000000-0000-0000-0000-000000000002']);

      expect(result.rows[0].st_id).toBe('888001');
    });
  });

  describe('Master Table', () => {
    it('should have correct schema', async () => {
      const result = await db.query(`
        SELECT column_name, data_type 
        FROM information_schema.columns 
        WHERE table_schema = 'master' AND table_name = 'pricebook_services'
        ORDER BY ordinal_position
      `);

      const columns = result.rows.map(r => r.column_name);
      expect(columns).toContain('id');
      expect(columns).toContain('synced_at');
    });

    it('should trigger audit log on insert', async () => {
      await db.query(`SELECT set_config('app.actor_type', 'system', false)`);

      const testStId = 888000 + Math.floor(Math.random() * 1000);

      await db.query(`
        INSERT INTO master.pricebook_services (st_id, display_name, synced_at, sync_batch_id, payload_hash)
        VALUES ($1, 'Audit Test Service', NOW(), $2, 'testhash')
        ON CONFLICT (st_id) DO UPDATE SET display_name = 'Audit Test Service Updated'
      `, [testStId, '00000000-0000-0000-0000-000000000003']);

      await new Promise(resolve => setTimeout(resolve, 100));

      const auditResult = await db.query(`
        SELECT * FROM audit.log 
        WHERE table_name = 'pricebook_services' 
        ORDER BY timestamp DESC 
        LIMIT 5
      `);

      expect(auditResult.rows.length).toBeGreaterThan(0);
    });
  });

  describe('Sync Batch Tracking', () => {
    it('should create and track sync batches', async () => {
      const createResult = await db.query(`
        INSERT INTO system.sync_batches (entity_type, status, started_at)
        VALUES ('test_entity', 'running', NOW())
        RETURNING id
      `);

      const batchId = createResult.rows[0].id;

      await db.query(`
        UPDATE system.sync_batches 
        SET status = 'completed', completed_at = NOW(), records_fetched = 100
        WHERE id = $1
      `, [batchId]);

      const result = await db.query(`
        SELECT * FROM system.sync_batches WHERE id = $1
      `, [batchId]);

      expect(result.rows[0].status).toBe('completed');
      expect(result.rows[0].records_fetched).toBe(100);
    });
  });
});
