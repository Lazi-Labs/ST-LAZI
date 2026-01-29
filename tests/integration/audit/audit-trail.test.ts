import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { Pool } from 'pg';
import { config } from '../../../src/config/index.js';

describe('Audit Trail Integration', () => {
  let db: Pool;

  beforeAll(async () => {
    db = new Pool({ connectionString: config.database.url });
  });

  afterAll(async () => {
    await db.end();
  });

  describe('Audit Log', () => {
    it('should be immutable (no updates)', async () => {
      await expect(
        db.query(`UPDATE audit.log SET actor_type = 'hacker' WHERE id = 1`)
      ).rejects.toThrow(/immutable/i);
    });

    it('should be immutable (no deletes)', async () => {
      await expect(
        db.query(`DELETE FROM audit.log WHERE id = 1`)
      ).rejects.toThrow(/immutable/i);
    });

    it('should allow inserts', async () => {
      const result = await db.query(`
        INSERT INTO audit.log 
          (schema_name, table_name, operation, record_id, actor_type)
        VALUES ('test', 'test_table', 'INSERT', '1', 'system')
        RETURNING id
      `);

      expect(result.rows[0].id).toBeDefined();
    });
  });

  describe('Audit Views', () => {
    it('should have recent_changes view', async () => {
      const result = await db.query(`SELECT * FROM audit.recent_changes LIMIT 1`);
      expect(result.rows).toBeDefined();
    });

    it('should have daily_summary view', async () => {
      const result = await db.query(`SELECT * FROM audit.daily_summary LIMIT 1`);
      expect(result.rows).toBeDefined();
    });
  });

  describe('Changed Fields Detection', () => {
    it('should detect changed fields correctly', async () => {
      const result = await db.query(`
        SELECT audit.get_changed_fields(
          '{"name": "old", "price": 100}'::jsonb,
          '{"name": "new", "price": 100}'::jsonb
        ) as changed
      `);

      expect(result.rows[0].changed).toContain('name');
      expect(result.rows[0].changed).not.toContain('price');
    });
  });
});
