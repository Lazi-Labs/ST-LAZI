#!/usr/bin/env tsx

/**
 * Sync Worker Generator
 * 
 * Generates sync worker classes for all discovered endpoints
 * Uses analysis data to build proper raw→master transforms
 * 
 * Usage:
 *   npm run generate:workers           # Generate all workers
 *   npm run generate:workers -- --dry  # Preview without writing
 */

import { config as dotenvConfig } from 'dotenv';
dotenvConfig();

import * as fs from 'fs';
import * as path from 'path';
import { ST_ENDPOINTS, EndpointDefinition } from '../../../discovery/endpoints.js';

const ANALYSIS_DIR = path.join(process.cwd(), 'discovery/output/analysis');
const WORKERS_DIR = path.join(process.cwd(), 'src/workers/sync/entities');

interface FieldAnalysis {
  path: string;
  types: string[];
  nullable: boolean;
  isArray: boolean;
  isObject: boolean;
  sampleValues: any[];
}

interface EndpointAnalysis {
  endpointName: string;
  recordCount: number;
  fields: FieldAnalysis[];
  idField?: string;
  timestampFields?: string[];
}

/**
 * Convert camelCase to snake_case
 */
function toSnakeCase(str: string): string {
  return str.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
}

/**
 * Convert snake_case to PascalCase
 */
function toPascalCase(str: string): string {
  return str
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join('');
}

/**
 * PostgreSQL reserved keywords that need quoting
 */
const PG_RESERVED_KEYWORDS = new Set([
  'end', 'start', 'limit', 'order', 'offset', 'user', 'group', 'table', 
  'column', 'index', 'constraint', 'default', 'check', 'primary', 'foreign',
  'references', 'unique', 'null', 'true', 'false', 'and', 'or', 'not',
  'select', 'from', 'where', 'join', 'on', 'as', 'in', 'is', 'like',
  'between', 'case', 'when', 'then', 'else', 'cast', 'all', 'any', 'some'
]);

/**
 * Quote column name if it's a reserved keyword
 */
function quoteIfReserved(name: string): string {
  return PG_RESERVED_KEYWORDS.has(name.toLowerCase()) ? `"${name}"` : name;
}

/**
 * Map JS/JSON types to PostgreSQL cast expressions
 */
function getPgCast(field: FieldAnalysis): string {
  const types = field.types.filter(t => t !== 'null');
  const mainType = types[0] || 'string';
  const fieldName = field.path;
  const snakeName = toSnakeCase(fieldName);
  const quotedName = quoteIfReserved(snakeName);

  // Handle arrays and objects as JSONB
  if (field.isArray || field.isObject) {
    return `payload->'${fieldName}' as ${quotedName}`;
  }

  // Scalar types
  switch (mainType) {
    case 'boolean':
      return `(payload->>'${fieldName}')::boolean as ${quotedName}`;
    case 'number':
      // Only use bigint for fields explicitly ending in 'Id' or named 'id'
      // All other numbers use numeric to handle decimals safely
      if (fieldName.toLowerCase().endsWith('id') || fieldName === 'id') {
        return `(payload->>'${fieldName}')::bigint as ${quotedName}`;
      }
      // Use numeric for all other numbers (handles decimals)
      return `(payload->>'${fieldName}')::numeric as ${quotedName}`;
    case 'string':
      // Check for timestamp patterns - field name hints
      const lowerField = fieldName.toLowerCase();
      const isTimestampField = lowerField.includes('on') || 
          lowerField.includes('at') ||
          lowerField.includes('date') ||
          lowerField.includes('time') ||
          lowerField.endsWith('start') ||
          lowerField.endsWith('end') ||
          lowerField.includes('window');
      
      if (isTimestampField) {
        const samples = field.sampleValues || [];
        if (samples.some(s => typeof s === 'string' && s.match(/^\d{4}-\d{2}-\d{2}T/))) {
          return `(payload->>'${fieldName}')::timestamptz as ${quotedName}`;
        }
      }
      return `payload->>'${fieldName}' as ${quotedName}`;
    default:
      return `payload->>'${fieldName}' as ${quotedName}`;
  }
}

/**
 * Generate worker class for an endpoint
 */
function generateWorkerClass(endpoint: EndpointDefinition, analysis: EndpointAnalysis | null): string {
  const className = `${toPascalCase(endpoint.name)}SyncWorker`;
  const rawTable = `raw.st_${endpoint.name}`;
  const masterTable = `master.${endpoint.name}`;
  
  // Get top-level fields only (not nested)
  const topLevelFields = analysis?.fields.filter(f => !f.path.includes('[') && !f.path.includes('.')) || [];
  
  // Build column list and SELECT expressions
  const selectExpressions: string[] = [];
  const columnNames: string[] = [];
  const updateExpressions: string[] = [];

  // st_id is handled separately in the template
  columnNames.push('st_id');

  for (const field of topLevelFields) {
    if (field.path === 'id') continue; // Already handled as st_id in template
    
    const snakeName = toSnakeCase(field.path);
    const quotedName = quoteIfReserved(snakeName);
    columnNames.push(quotedName);
    selectExpressions.push(`        ${getPgCast(field)}`);
    updateExpressions.push(`        ${quotedName} = EXCLUDED.${quotedName}`);
  }

  // Add sync metadata columns
  columnNames.push('synced_at', 'sync_batch_id', 'payload_hash');
  selectExpressions.push(
    `        NOW() as synced_at`,
    `        $1::uuid as sync_batch_id`,
    `        md5(payload::text) as payload_hash`
  );
  updateExpressions.push(
    `        synced_at = NOW()`,
    `        sync_batch_id = EXCLUDED.sync_batch_id`,
    `        payload_hash = EXCLUDED.payload_hash`
  );

  const columnsStr = columnNames.join(',\n        ');
  const selectStr = selectExpressions.join(',\n');
  const updateStr = updateExpressions.join(',\n');

  return `/**
 * Sync worker for ${endpoint.description}
 * Auto-generated from discovery analysis
 */

import { Pool } from 'pg';
import { BaseSyncWorker } from '../base-sync-worker.js';
import { config } from '../../../config/index.js';

export class ${className} extends BaseSyncWorker {
  readonly endpointName = '${endpoint.name}';
  readonly stEndpointPath = '${endpoint.path}';
  readonly rawTable = '${rawTable}';
  readonly masterTable = '${masterTable}';
  readonly stIdField = 'id';

  protected async transformToMaster(batchId: string): Promise<{ inserted: number; updated: number }> {
    const result = await this.db.query(\`
      INSERT INTO \${this.masterTable} (
        ${columnsStr}
      )
      SELECT 
        (payload->>'id')::bigint as st_id,
${selectStr}
      FROM \${this.rawTable}
      WHERE sync_batch_id = $1
      ON CONFLICT (st_id) DO UPDATE SET
${updateStr}
      RETURNING (xmax = 0) as is_insert
    \`, [batchId]);

    const inserted = result.rows.filter(r => r.is_insert).length;
    const updated = result.rows.filter(r => !r.is_insert).length;

    return { inserted, updated };
  }
}
`;
}

/**
 * Generate the worker registry/index file
 */
function generateWorkerIndex(endpoints: EndpointDefinition[]): string {
  const imports: string[] = [];
  const registryEntries: string[] = [];

  for (const endpoint of endpoints) {
    const className = `${toPascalCase(endpoint.name)}SyncWorker`;
    imports.push(`import { ${className} } from './entities/${endpoint.name}-sync.js';`);
    registryEntries.push(`  '${endpoint.name}': ${className},`);
  }

  return `/**
 * Sync Worker Registry
 * Auto-generated - maps endpoint names to worker classes
 */

import { Pool } from 'pg';
import { BaseSyncWorker } from './base-sync-worker.js';

${imports.join('\n')}

export const SYNC_WORKERS: Record<string, new (db: Pool) => BaseSyncWorker> = {
${registryEntries.join('\n')}
};

export const AVAILABLE_ENDPOINTS = Object.keys(SYNC_WORKERS);

export function getWorker(endpoint: string, db: Pool): BaseSyncWorker {
  const WorkerClass = SYNC_WORKERS[endpoint];
  if (!WorkerClass) {
    throw new Error(\`Unknown endpoint: \${endpoint}. Available: \${AVAILABLE_ENDPOINTS.join(', ')}\`);
  }
  return new WorkerClass(db);
}
`;
}

async function main() {
  const args = process.argv.slice(2);
  const dryRun = args.includes('--dry');

  console.log('');
  console.log('╔═══════════════════════════════════════════════════════════════╗');
  console.log('║           Sync Worker Generator                               ║');
  console.log('╚═══════════════════════════════════════════════════════════════╝');
  console.log('');

  // Load all analysis files
  const analysisMap = new Map<string, EndpointAnalysis>();
  
  if (fs.existsSync(ANALYSIS_DIR)) {
    const files = fs.readdirSync(ANALYSIS_DIR).filter(f => f.endsWith('.json') && f !== '_all.json');
    for (const file of files) {
      try {
        const content = fs.readFileSync(path.join(ANALYSIS_DIR, file), 'utf-8');
        const analysis = JSON.parse(content) as EndpointAnalysis;
        analysisMap.set(analysis.endpointName, analysis);
      } catch (e) {
        // Skip invalid files
      }
    }
  }

  console.log(`Found ${analysisMap.size} analysis files`);
  console.log(`Found ${ST_ENDPOINTS.length} endpoint definitions`);
  console.log('');

  // Filter to endpoints that have analysis data
  const endpointsWithData = ST_ENDPOINTS.filter(e => {
    const analysis = analysisMap.get(e.name);
    return analysis && analysis.recordCount > 0 && analysis.fields.length > 0;
  });

  console.log(`Endpoints with data: ${endpointsWithData.length}`);
  console.log('');

  if (dryRun) {
    console.log('DRY RUN - Would generate workers for:');
    endpointsWithData.forEach(e => console.log(`  - ${e.name}`));
    return;
  }

  // Create entities directory
  if (!fs.existsSync(WORKERS_DIR)) {
    fs.mkdirSync(WORKERS_DIR, { recursive: true });
  }

  // Generate individual worker files
  let generated = 0;
  for (const endpoint of endpointsWithData) {
    const analysis = analysisMap.get(endpoint.name) || null;
    const workerCode = generateWorkerClass(endpoint, analysis);
    const filePath = path.join(WORKERS_DIR, `${endpoint.name}-sync.ts`);
    
    fs.writeFileSync(filePath, workerCode);
    console.log(`✅ Generated: ${endpoint.name}-sync.ts`);
    generated++;
  }

  // Generate worker registry
  const registryCode = generateWorkerIndex(endpointsWithData);
  const registryPath = path.join(process.cwd(), 'src/workers/sync/worker-registry.ts');
  fs.writeFileSync(registryPath, registryCode);
  console.log(`✅ Generated: worker-registry.ts`);

  console.log('');
  console.log(`Generated ${generated} worker files`);
  console.log('');
}

main().catch(console.error);
