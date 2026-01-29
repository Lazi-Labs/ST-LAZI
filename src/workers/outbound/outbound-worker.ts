import { Pool } from 'pg';
import { config } from '../../config/index.js';
import { createLogger } from '../../utils/logger.js';
import { getSTClient } from '../../servicetitan/client.js';
import { setAuditContext } from '../../utils/audit-context.js';

const logger = createLogger({ module: 'outbound-worker' });

interface Mutation {
  id: string;
  entity_type: string;
  entity_id: string;
  operation: string; // Extended to support special operations like 'reschedule', 'cancel', etc.
  payload: Record<string, any>;
  status: string;
  retry_count: number;
  based_on_payload_hash: string | null;
  idempotency_key: string | null;
  created_at: Date;
}

const SPECIAL_OPERATIONS: Record<string, {
  module: string;
  pathTemplate: string;
  method: 'POST';
}> = {
  // Appointments
  'appointments:reschedule': { module: 'jpm', pathTemplate: '/appointments/{id}/reschedule', method: 'POST' },
  'appointments:cancel': { module: 'jpm', pathTemplate: '/appointments/{id}/cancel', method: 'POST' },
  'appointments:assign': { module: 'jpm', pathTemplate: '/appointments/{id}/assign', method: 'POST' },
  'appointments:unassign': { module: 'jpm', pathTemplate: '/appointments/{id}/unassign', method: 'POST' },
  'appointments:complete': { module: 'jpm', pathTemplate: '/appointments/{id}/complete', method: 'POST' },
  
  // Jobs
  'jobs:cancel': { module: 'jpm', pathTemplate: '/jobs/{id}/cancel', method: 'POST' },
  'jobs:complete': { module: 'jpm', pathTemplate: '/jobs/{id}/complete', method: 'POST' },
  'jobs:add-note': { module: 'jpm', pathTemplate: '/jobs/{id}/notes', method: 'POST' },
  
  // Estimates
  'estimates:approve': { module: 'sales', pathTemplate: '/estimates/{id}/approve', method: 'POST' },
  'estimates:decline': { module: 'sales', pathTemplate: '/estimates/{id}/decline', method: 'POST' },
  'estimates:convert-to-invoice': { module: 'sales', pathTemplate: '/estimates/{id}/convert-to-invoice', method: 'POST' },
  'estimates:email': { module: 'sales', pathTemplate: '/estimates/{id}/email', method: 'POST' },
  
  // Customers
  'customers:add-contact': { module: 'crm', pathTemplate: '/customers/{id}/contacts', method: 'POST' },
  'customers:add-note': { module: 'crm', pathTemplate: '/customers/{id}/notes', method: 'POST' },
};

const ENTITY_ENDPOINTS: Record<string, { 
  module: string; 
  resource: string;
  supportsCreate?: boolean;
  supportsUpdate?: boolean;
  supportsDelete?: boolean;
}> = {
  'pricebook_services': { 
    module: 'pricebook', 
    resource: 'services',
    supportsCreate: true,
    supportsUpdate: true,
    supportsDelete: true,
  },
  'pricebook_materials': { 
    module: 'pricebook', 
    resource: 'materials',
    supportsCreate: true,
    supportsUpdate: true,
    supportsDelete: true,
  },
  'pricebook_equipment': { 
    module: 'pricebook', 
    resource: 'equipment',
    supportsCreate: true,
    supportsUpdate: true,
    supportsDelete: true,
  },
  'pricebook_categories': { 
    module: 'pricebook', 
    resource: 'categories',
    supportsCreate: true,
    supportsUpdate: true,
    supportsDelete: true,
  },
  'customers': { 
    module: 'crm', 
    resource: 'customers',
    supportsCreate: true,
    supportsUpdate: true,
  },
  'jobs': { 
    module: 'jpm', 
    resource: 'jobs',
    supportsUpdate: true,
  },
  'appointments': { 
    module: 'jpm', 
    resource: 'appointments',
    supportsCreate: true,
    supportsUpdate: true,
  },
  'estimates': { 
    module: 'sales', 
    resource: 'estimates',
    supportsCreate: true,
    supportsUpdate: true,
  },
  'campaigns': { 
    module: 'marketing', 
    resource: 'campaigns',
    supportsCreate: true,
    supportsUpdate: true,
  },
};

export class OutboundWorker {
  private db: Pool;
  private stClient: ReturnType<typeof getSTClient>;
  private isRunning = false;
  private pollInterval = 5000;

  constructor() {
    this.db = new Pool({ connectionString: config.database.url });
    this.stClient = getSTClient();
  }

  async start() {
    logger.info('Starting outbound worker');
    this.isRunning = true;

    while (this.isRunning) {
      try {
        await this.processPendingMutations();
      } catch (error: any) {
        logger.error({ error: error.message }, 'Error in outbound worker loop');
      }

      await this.sleep(this.pollInterval);
    }
  }

  stop() {
    logger.info('Stopping outbound worker');
    this.isRunning = false;
  }

  private async processPendingMutations() {
    const result = await this.db.query<Mutation>(`
      SELECT * FROM outbound.mutations 
      WHERE status = 'pending'
        AND (next_retry_at IS NULL OR next_retry_at <= NOW())
      ORDER BY initiated_at ASC
      LIMIT 10
      FOR UPDATE SKIP LOCKED
    `);

    if (result.rows.length === 0) {
      return;
    }

    logger.info({ count: result.rows.length }, 'Processing pending mutations');

    for (const mutation of result.rows) {
      await this.processMutation(mutation);
    }
  }

  private async processMutation(mutation: Mutation) {
    const logContext = { 
      mutationId: mutation.id, 
      entityType: mutation.entity_type,
      entityId: mutation.entity_id,
      operation: mutation.operation,
    };

    logger.info(logContext, 'Processing mutation');

    try {
      await this.db.query(
        `UPDATE outbound.mutations SET status = 'processing', processed_at = NOW() WHERE id = $1`,
        [mutation.id]
      );

      // Set audit context
      await setAuditContext(this.db, {
        actorType: 'outbound_worker',
        actorId: 'outbound-worker',
        mutationId: mutation.id,
      });

      const hasConflict = await this.checkForConflict(mutation);
      if (hasConflict) {
        await this.markConflict(mutation);
        return;
      }

      const stResponse = await this.sendToServiceTitan(mutation);

      await this.db.query(`
        UPDATE outbound.mutations SET 
          status = 'completed',
          processed_at = NOW(),
          st_response = $2
        WHERE id = $1
      `, [mutation.id, JSON.stringify(stResponse)]);

      logger.info({ ...logContext, stResponse }, 'Mutation completed successfully');

      await this.triggerResync(mutation.entity_type);

    } catch (error: any) {
      logger.error({ ...logContext, error: error.message }, 'Mutation failed');
      await this.handleFailure(mutation, error);
    }
  }

  private async checkForConflict(mutation: Mutation): Promise<boolean> {
    if (!mutation.based_on_payload_hash) {
      return false;
    }

    try {
      const result = await this.db.query(`
        SELECT md5(payload::text) as current_hash
        FROM raw.st_${mutation.entity_type}
        WHERE (payload->>'id')::text = $1
        ORDER BY synced_at DESC
        LIMIT 1
      `, [mutation.entity_id]);

      if (result.rows.length === 0) {
        return false;
      }

      const currentHash = result.rows[0].current_hash;
      return currentHash !== mutation.based_on_payload_hash;
    } catch (error) {
      return false;
    }
  }

  private async markConflict(mutation: Mutation) {
    await this.db.query(`
      UPDATE outbound.mutations SET 
        status = 'conflict',
        error_message = 'Entity was modified in ServiceTitan since mutation was created. Please review and retry.',
        processed_at = NOW()
      WHERE id = $1
    `, [mutation.id]);

    logger.warn({ mutationId: mutation.id }, 'Mutation marked as conflict');
  }

  private async sendToServiceTitan(mutation: Mutation): Promise<any> {
    const operationKey = `${mutation.entity_type}:${mutation.operation}`;
    
    // Check for special operation first
    const specialOp = SPECIAL_OPERATIONS[operationKey];
    if (specialOp) {
      return this.sendSpecialOperation(mutation, specialOp);
    }
    
    // Fall back to standard CRUD
    const endpointConfig = ENTITY_ENDPOINTS[mutation.entity_type];
    
    if (!endpointConfig) {
      throw new Error(`Unknown entity type: ${mutation.entity_type}`);
    }

    const { module, resource, supportsCreate, supportsUpdate, supportsDelete } = endpointConfig;
    const { apiBaseUrl, tenantId } = config.serviceTitan;
    const baseUrl = `${apiBaseUrl}/${module}/v2/tenant/${tenantId}/${resource}`;

    switch (mutation.operation) {
      case 'create':
        if (!supportsCreate) {
          throw new Error(`Create operation not supported for ${mutation.entity_type}`);
        }
        return this.stClient.post(baseUrl, mutation.payload);

      case 'update':
        if (!supportsUpdate) {
          throw new Error(`Update operation not supported for ${mutation.entity_type}`);
        }
        return this.stClient.patch(`${baseUrl}/${mutation.entity_id}`, mutation.payload);

      case 'delete':
        if (!supportsDelete) {
          throw new Error(`Delete operation not supported for ${mutation.entity_type}`);
        }
        return this.stClient.delete(`${baseUrl}/${mutation.entity_id}`);

      default:
        throw new Error(`Unknown operation: ${mutation.operation}`);
    }
  }

  private async sendSpecialOperation(
    mutation: Mutation,
    opConfig: { module: string; pathTemplate: string; method: 'POST' }
  ): Promise<any> {
    const { apiBaseUrl, tenantId } = config.serviceTitan;
    const path = opConfig.pathTemplate.replace('{id}', mutation.entity_id);
    const url = `${apiBaseUrl}/${opConfig.module}/v2/tenant/${tenantId}${path}`;

    logger.info({ url, operation: mutation.operation }, 'Sending special operation');
    const response = await this.stClient.post(url, mutation.payload);
    return response.data;
  }

  private async handleFailure(mutation: Mutation, error: Error) {
    const newRetryCount = mutation.retry_count + 1;
    const maxRetries = 3;

    if (newRetryCount >= maxRetries) {
      await this.db.query(`
        UPDATE outbound.mutations SET 
          status = 'failed',
          retry_count = $2,
          error_message = $3,
          processed_at = NOW()
        WHERE id = $1
      `, [mutation.id, newRetryCount, error.message]);

      logger.error({ mutationId: mutation.id, retries: newRetryCount }, 'Mutation moved to DLQ after max retries');
    } else {
      const retryMinutes = Math.pow(2, newRetryCount);
      await this.db.query(`
        UPDATE outbound.mutations SET 
          status = 'pending',
          retry_count = $2,
          error_message = $3,
          next_retry_at = NOW() + INTERVAL '${retryMinutes} minutes'
        WHERE id = $1
      `, [mutation.id, newRetryCount, error.message]);

      logger.info({ mutationId: mutation.id, retries: newRetryCount, nextRetryMinutes: retryMinutes }, 'Mutation scheduled for retry');
    }
  }

  private async triggerResync(entityType: string) {
    logger.info({ entityType }, 'Would trigger resync for entity type');
  }

  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async close() {
    this.stop();
    await this.db.end();
  }
}

async function main() {
  const worker = new OutboundWorker();

  process.on('SIGINT', async () => {
    console.log('\nShutting down...');
    await worker.close();
    process.exit(0);
  });

  process.on('SIGTERM', async () => {
    await worker.close();
    process.exit(0);
  });

  await worker.start();
}

main().catch(console.error);
