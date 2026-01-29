import { Pool } from 'pg';

export async function insertTestRawRecord(
  db: Pool,
  table: string,
  payload: any,
  batchId: string = 'test-batch-001'
) {
  const result = await db.query(`
    INSERT INTO ${table} (payload, sync_batch_id, synced_at)
    VALUES ($1, $2, NOW())
    RETURNING id, st_id
  `, [JSON.stringify(payload), batchId]);
  
  return result.rows[0];
}

export async function getMasterRecord(
  db: Pool,
  table: string,
  id: number | string
) {
  const result = await db.query(`
    SELECT * FROM ${table} WHERE id = $1
  `, [id]);
  
  return result.rows[0] || null;
}

export async function createTestMutation(
  db: Pool,
  entityType: string,
  entityId: number,
  operation: string,
  payload: any
) {
  const result = await db.query(`
    INSERT INTO outbound.mutations 
      (entity_type, entity_id, operation, payload, initiated_by, status)
    VALUES ($1, $2, $3, $4, 'test', 'pending')
    RETURNING *
  `, [entityType, entityId, operation, JSON.stringify(payload)]);
  
  return result.rows[0];
}
