import { beforeAll, afterAll } from 'vitest';
import { Pool } from 'pg';
import { config } from '../src/config/index.js';

export const testDb = new Pool({ 
  connectionString: process.env.TEST_DATABASE_URL || config.database.url 
});

beforeAll(async () => {
  console.log('Test setup complete');
});

afterAll(async () => {
  await testDb.end();
});

export async function cleanTestData(table: string) {
  if (table.startsWith('test.')) {
    await testDb.query(`TRUNCATE ${table} CASCADE`);
  }
}

export async function setTestAuditContext(client: Pool) {
  await client.query(`
    SELECT 
      set_config('app.actor_type', 'test', false),
      set_config('app.actor_id', 'test-runner', false)
  `);
}
