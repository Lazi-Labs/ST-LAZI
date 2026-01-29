import { Pool, PoolClient } from 'pg';

export interface AuditContext {
  actorType: 'user' | 'sync_worker' | 'outbound_worker' | 'api' | 'system';
  actorId?: string;
  requestId?: string;
  mutationId?: string;
  syncBatchId?: string;
}

export async function setAuditContext(
  client: Pool | PoolClient,
  context: AuditContext
): Promise<void> {
  await client.query(`
    SELECT 
      set_config('app.actor_type', $1, false),
      set_config('app.actor_id', $2, false),
      set_config('app.request_id', $3, false),
      set_config('app.mutation_id', $4, false),
      set_config('app.sync_batch_id', $5, false)
  `, [
    context.actorType,
    context.actorId || '',
    context.requestId || '',
    context.mutationId || '',
    context.syncBatchId || '',
  ]);
}

export async function withAuditContext<T>(
  db: Pool,
  context: AuditContext,
  fn: (client: PoolClient) => Promise<T>
): Promise<T> {
  const client = await db.connect();
  
  try {
    await setAuditContext(client, context);
    return await fn(client);
  } finally {
    await client.query(`
      SELECT 
        set_config('app.actor_type', '', false),
        set_config('app.actor_id', '', false),
        set_config('app.request_id', '', false),
        set_config('app.mutation_id', '', false),
        set_config('app.sync_batch_id', '', false)
    `);
    client.release();
  }
}
