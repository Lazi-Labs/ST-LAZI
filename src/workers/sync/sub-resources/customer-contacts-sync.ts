import { Pool } from 'pg';
import { config } from '../../../config/index.js';
import { createLogger } from '../../../utils/logger.js';
import { getSTClient } from '../../../servicetitan/client.js';

const logger = createLogger({ module: 'customer-contacts-sync' });

/**
 * Syncs customer contacts for customers
 * 
 * Strategy: Event-driven sync
 * - When called with customerIds: sync only those specific customers (fast, targeted)
 * - When called with fullSync=true: sync all customers (slow, for backfill)
 * - When called with neither: sync customers modified in last 24 hours
 * 
 * This avoids the N+1 problem of calling 14,000+ customers every sync
 */
export class CustomerContactsSync {
  private db: Pool;
  private stClient: ReturnType<typeof getSTClient>;
  private tenantId: string;

  constructor(db?: Pool) {
    this.db = db || new Pool({ connectionString: config.database.url });
    this.stClient = getSTClient();
    this.tenantId = config.serviceTitan.tenantId;
  }

  /**
   * Sync contacts for specific customers (event-driven)
   * Call this after customer sync completes with the list of synced customer IDs
   */
  async syncForCustomers(customerStIds: number[]): Promise<{ fetched: number; processed: number; errors: number }> {
    if (customerStIds.length === 0) {
      return { fetched: 0, processed: 0, errors: 0 };
    }

    logger.info({ count: customerStIds.length }, 'Syncing contacts for specific customers');
    return this.syncCustomerContacts(customerStIds);
  }

  /**
   * Main sync method - called by scheduled sync
   */
  async sync(fullSync: boolean = false): Promise<{ fetched: number; processed: number; errors: number }> {
    logger.info({ fullSync }, 'Starting customer contacts sync');

    // Get customer IDs to sync
    let query: string;
    if (fullSync) {
      // Full sync: all customers (use with caution - slow!)
      query = `
        SELECT st_id FROM master.customers
        WHERE st_id IS NOT NULL
        ORDER BY st_id
      `;
    } else {
      // Incremental: customers modified in last 24 hours OR customers without contacts
      query = `
        SELECT DISTINCT c.st_id 
        FROM master.customers c
        LEFT JOIN master.customer_contacts cc ON cc.customer_id = c.st_id
        WHERE c.st_id IS NOT NULL
        AND c.active = true
        AND (
          c.modified_on > NOW() - INTERVAL '24 hours'
          OR c.synced_at > NOW() - INTERVAL '1 hour'
          OR cc.id IS NULL
        )
        ORDER BY c.st_id
        LIMIT 500
      `;
    }

    const customersResult = await this.db.query(query);
    const customerIds = customersResult.rows.map(r => r.st_id);
    
    if (customerIds.length === 0) {
      logger.info('No customers need contact sync');
      return { fetched: 0, processed: 0, errors: 0 };
    }

    logger.info({ count: customerIds.length }, 'Found customers needing contact sync');
    return this.syncCustomerContacts(customerIds);
  }

  /**
   * Core sync logic - fetches and stores contacts for given customer IDs
   */
  private async syncCustomerContacts(customerStIds: number[]): Promise<{ fetched: number; processed: number; errors: number }> {
    let totalFetched = 0;
    let totalProcessed = 0;
    let errors = 0;

    for (let i = 0; i < customerStIds.length; i++) {
      const customerId = customerStIds[i];
      
      try {
        const contacts = await this.fetchContactsForCustomer(customerId);
        
        if (contacts.length > 0) {
          // Insert to raw table (append-only, no conflict handling needed)
          // Raw tables are immutable by design - just insert new records
          const batchId = crypto.randomUUID();
          for (const contact of contacts) {
            try {
              await this.db.query(`
                INSERT INTO raw.st_customer_contacts (
                  customer_id, payload, batch_id
                )
                VALUES ($1, $2, $3)
              `, [
                customerId,
                JSON.stringify(contact),
                batchId,
              ]);
            } catch (rawErr: any) {
              // Ignore duplicate key errors for raw table (append-only is fine)
              if (!rawErr.message?.includes('duplicate')) {
                throw rawErr;
              }
            }
          }

          // Upsert to master table (Supabase schema: id, customer_id, type, value, memo, active, synced_at)
          for (const contact of contacts) {
            await this.db.query(`
              INSERT INTO master.customer_contacts (
                id, customer_id, type, value, memo, active, synced_at
              )
              VALUES ($1, $2, $3, $4, $5, $6, NOW())
              ON CONFLICT (id) DO UPDATE SET
                type = EXCLUDED.type,
                value = EXCLUDED.value,
                memo = EXCLUDED.memo,
                active = EXCLUDED.active,
                synced_at = NOW()
            `, [
              contact.id,   // ST contact ID
              customerId,   // ST customer ID
              contact.type,
              contact.value,
              contact.memo,
              true,  // active
            ]);
          }

          totalFetched += contacts.length;
          totalProcessed += contacts.length;
        }

        // Progress logging every 50 customers
        if ((i + 1) % 50 === 0) {
          logger.info({ 
            progress: `${i + 1}/${customerStIds.length}`, 
            contacts: totalFetched 
          }, 'Contact sync progress');
        }

        // Rate limiting: 100ms between requests (~600/min, well under ST limit)
        if (i < customerStIds.length - 1) {
          await this.sleep(100);
        }

      } catch (error: any) {
        errors++;
        logger.warn({ customerId, error: error.message }, 'Failed to sync contacts for customer');
      }
    }

    logger.info({ totalFetched, totalProcessed, errors }, 'Customer contacts sync complete');
    return { fetched: totalFetched, processed: totalProcessed, errors };
  }

  /**
   * Fetch contacts for a single customer from ServiceTitan API
   */
  private async fetchContactsForCustomer(customerId: number): Promise<any[]> {
    const { apiBaseUrl, tenantId } = config.serviceTitan;
    const url = `${apiBaseUrl}/crm/v2/tenant/${tenantId}/customers/${customerId}/contacts`;

    try {
      const response = await this.stClient.get<{ data?: any[] } | any[]>(url);
      const responseData = response.data;
      if (Array.isArray(responseData)) {
        return responseData;
      }
      return responseData?.data || [];
    } catch (error: any) {
      if (error.response?.status === 404) {
        return []; // Customer has no contacts
      }
      throw error;
    }
  }

  /**
   * Get contact summary for customers (since master.customers doesn't have contact columns)
   * Returns a map of customer_id -> contact info
   */
  async getContactSummary(): Promise<Map<number, { primaryEmail: string | null; primaryPhone: string | null }>> {
    const result = await this.db.query(`
      SELECT 
        customer_id,
        MAX(value) FILTER (WHERE type = 'Email') as primary_email,
        COALESCE(
          MAX(value) FILTER (WHERE type = 'MobilePhone'),
          MAX(value) FILTER (WHERE type = 'Phone')
        ) as primary_phone
      FROM master.customer_contacts
      GROUP BY customer_id
    `);
    
    const summary = new Map<number, { primaryEmail: string | null; primaryPhone: string | null }>();
    for (const row of result.rows) {
      summary.set(row.customer_id, {
        primaryEmail: row.primary_email,
        primaryPhone: row.primary_phone,
      });
    }
    
    logger.info({ count: summary.size }, 'Generated contact summary');
    return summary;
  }

  /**
   * Placeholder - master.customers doesn't have primary_email/primary_phone columns in Supabase
   * This method is kept for compatibility but does nothing
   */
  async updateCustomerPrimaryContacts(): Promise<number> {
    logger.info('Skipping updateCustomerPrimaryContacts - columns not in Supabase schema');
    return 0;
  }

  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async close() {
    await this.db.end();
  }
}
