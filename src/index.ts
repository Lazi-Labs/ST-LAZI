/**
 * LAZI ServiceTitan Ingestion Service
 * 
 * This service:
 * 1. Syncs data from ServiceTitan to local PostgreSQL (raw → master)
 * 2. Exposes an internal API for other LAZI services to consume
 * 3. Processes outbound mutations back to ServiceTitan
 */

import { config } from './config/index.js';
import { logger } from './utils/logger.js';

async function main() {
  logger.info({
    env: config.env,
    tenantId: config.serviceTitan.tenantId,
  }, 'Starting LAZI ST Ingestion Service');

  // TODO: Initialize database pools
  // TODO: Start API server
  // TODO: Start worker queues

  logger.info({
    port: config.api.port,
  }, 'Service started');
}

main().catch((error) => {
  logger.fatal({ err: error }, 'Failed to start service');
  process.exit(1);
});
