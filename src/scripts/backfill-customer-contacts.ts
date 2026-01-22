#!/usr/bin/env tsx
/**
 * Backfill Customer Contacts
 * 
 * Syncs contacts for all customers that don't have contacts yet.
 * Run: npx tsx src/scripts/backfill-customer-contacts.ts
 * 
 * Options:
 *   --full     Sync ALL customers (even those with contacts)
 *   --limit=N  Limit to N customers per batch (default: 500)
 *   --test     Test mode - sync only 5 customers
 */

import { config as dotenvConfig } from 'dotenv';
dotenvConfig();

import { Pool } from 'pg';
import { config } from '../config/index.js';
import { CustomerContactsSync } from '../workers/sync/sub-resources/customer-contacts-sync.js';

async function main() {
  const args = process.argv.slice(2);
  const isFullSync = args.includes('--full');
  const isTest = args.includes('--test');
  const limitArg = args.find(a => a.startsWith('--limit='));
  const limit = limitArg ? parseInt(limitArg.split('=')[1]) : 500;

  console.log('═'.repeat(60));
  console.log('CUSTOMER CONTACTS BACKFILL');
  console.log('═'.repeat(60));
  console.log(`Mode: ${isTest ? 'TEST (5 customers)' : isFullSync ? 'FULL SYNC' : 'INCREMENTAL'}`);
  console.log(`Batch limit: ${isTest ? 5 : limit}`);
  console.log('═'.repeat(60));

  const db = new Pool({ connectionString: config.database.url });
  const sync = new CustomerContactsSync(db);

  const startTime = Date.now();
  let totalProcessed = 0;
  let totalContacts = 0;
  let totalErrors = 0;
  let batchNumber = 0;

  try {
    if (isTest) {
      // Test mode: just sync 5 customers
      const result = await db.query(`
        SELECT st_id FROM master.customers 
        WHERE st_id IS NOT NULL 
        ORDER BY st_id 
        LIMIT 5
      `);
      const testIds = result.rows.map(r => r.st_id);
      console.log(`\nTest customers: ${testIds.join(', ')}`);
      
      const syncResult = await sync.syncForCustomers(testIds);
      totalProcessed = testIds.length;
      totalContacts = syncResult.fetched;
      totalErrors = syncResult.errors;
    } else {
      // Production mode: batch processing
      while (true) {
        batchNumber++;
        console.log(`\n--- Batch ${batchNumber} ---`);

        // Get customers needing sync
        let query: string;
        if (isFullSync) {
          query = `
            SELECT st_id FROM master.customers
            WHERE st_id IS NOT NULL
            AND st_id NOT IN (
              SELECT DISTINCT customer_st_id FROM master.customer_contacts
            )
            ORDER BY st_id
            LIMIT ${limit}
          `;
        } else {
          query = `
            SELECT DISTINCT c.st_id 
            FROM master.customers c
            LEFT JOIN master.customer_contacts cc ON cc.customer_st_id = c.st_id
            WHERE c.st_id IS NOT NULL
            AND cc.id IS NULL
            ORDER BY c.st_id
            LIMIT ${limit}
          `;
        }

        const customersResult = await db.query(query);
        const customerIds = customersResult.rows.map(r => r.st_id);

        if (customerIds.length === 0) {
          console.log('No more customers to process');
          break;
        }

        console.log(`Processing ${customerIds.length} customers...`);
        const result = await sync.syncForCustomers(customerIds);

        totalProcessed += customerIds.length;
        totalContacts += result.fetched;
        totalErrors += result.errors;

        const elapsed = ((Date.now() - startTime) / 1000 / 60).toFixed(1);
        console.log(`Batch ${batchNumber} complete.`);
        console.log(`Running total: ${totalProcessed} customers, ${totalContacts} contacts, ${totalErrors} errors`);
        console.log(`Elapsed time: ${elapsed} minutes`);

        // If we processed less than the batch size, we're done
        if (customerIds.length < limit) {
          break;
        }

        // Pause between batches
        console.log('Pausing 5 seconds before next batch...');
        await new Promise(resolve => setTimeout(resolve, 5000));
      }
    }

    // Update customer primary contacts
    console.log('\nUpdating customer primary contacts...');
    const updated = await sync.updateCustomerPrimaryContacts();
    console.log(`Updated ${updated} customers with primary contact info`);

    const totalTime = ((Date.now() - startTime) / 1000 / 60).toFixed(1);

    console.log('\n' + '═'.repeat(60));
    console.log('BACKFILL COMPLETE');
    console.log('═'.repeat(60));
    console.log(`Total customers processed: ${totalProcessed}`);
    console.log(`Total contacts synced: ${totalContacts}`);
    console.log(`Total errors: ${totalErrors}`);
    console.log(`Total time: ${totalTime} minutes`);
    console.log('═'.repeat(60));

  } catch (error) {
    console.error('Backfill failed:', error);
    process.exit(1);
  } finally {
    // Only close the db pool once (sync uses the same pool)
    await db.end();
  }
}

main()
  .then(() => process.exit(0))
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
