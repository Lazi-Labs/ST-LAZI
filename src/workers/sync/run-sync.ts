#!/usr/bin/env tsx

/**
 * Sync Runner Script
 * Usage: npm run sync <endpoint> [--full]
 *        npm run sync --list
 * 
 * Examples:
 *   npm run sync pricebook_services --full
 *   npm run sync customers
 *   npm run sync --list
 */

import { config as dotenvConfig } from 'dotenv';
dotenvConfig();

import { Pool } from 'pg';
import { config } from '../../config/index.js';
import { SYNC_WORKERS, AVAILABLE_ENDPOINTS, getWorker } from './worker-registry.js';

const db = new Pool({ connectionString: config.database.url });

async function main() {
  const args = process.argv.slice(2);
  
  // Handle --list flag
  if (args.includes('--list')) {
    console.log('\nAvailable endpoints:');
    AVAILABLE_ENDPOINTS.forEach(e => console.log(`  - ${e}`));
    console.log(`\nTotal: ${AVAILABLE_ENDPOINTS.length} endpoints`);
    return;
  }

  const endpoint = args.find(a => !a.startsWith('--'));
  const fullSync = args.includes('--full');

  if (!endpoint) {
    console.error('❌ No endpoint specified');
    console.log('Usage: npm run sync <endpoint> [--full]');
    console.log('       npm run sync --list');
    process.exit(1);
  }

  console.log(`\n🔄 Starting sync for: ${endpoint}`);
  console.log(`   Mode: ${fullSync ? 'FULL' : 'INCREMENTAL'}`);
  console.log(`   Tenant: ${config.serviceTitan.tenantId}\n`);

  try {
    const worker = getWorker(endpoint, db);
    const result = await worker.sync({ fullSync });

    if (result.success) {
      console.log('\n✅ Sync Complete:');
      console.log(`   Endpoint: ${result.endpoint}`);
      console.log(`   Fetched: ${result.recordsFetched}`);
      console.log(`   Inserted: ${result.recordsInserted}`);
      console.log(`   Updated: ${result.recordsUpdated}`);
      console.log(`   Duration: ${result.durationMs}ms`);
      console.log(`   Batch ID: ${result.batchId}\n`);
    } else {
      console.log('\n❌ Sync Failed:');
      console.log(`   Endpoint: ${result.endpoint}`);
      console.log(`   Errors: ${result.errors.join(', ')}`);
      console.log(`   Duration: ${result.durationMs}ms`);
      console.log(`   Batch ID: ${result.batchId}\n`);
      process.exit(1);
    }

  } catch (error: any) {
    console.error('❌ Sync failed:', error.message);
    process.exit(1);
  } finally {
    await db.end();
  }
}

main();
