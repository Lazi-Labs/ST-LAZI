#!/usr/bin/env tsx

/**
 * LAZI ServiceTitan Schema Discovery Tool
 * 
 * This tool fetches sample data from ServiceTitan API endpoints,
 * analyzes the response structures, and generates:
 * - Raw table SQL migrations (JSONB storage)
 * - Master table SQL migrations (typed columns)
 * - TypeScript type definitions
 * 
 * Usage:
 *   npm run discovery                    # Full discovery (priority 1-2)
 *   npm run discovery -- --priority 1    # Only critical endpoints
 *   npm run discovery -- --priority 3    # Include more endpoints
 *   npm run discovery -- --module pricebook  # Single module
 *   npm run discovery -- --dry-run       # Show what would be fetched
 */

import { config } from 'dotenv';
config();

import { fetchAllEndpoints } from './fetcher.js';
import { analyzeAllEndpoints } from './analyzer.js';
import { generateRawMigration } from './generators/raw-migration.js';
import { generateMasterMigration } from './generators/master-migration.js';
import { generateTypeScriptTypes } from './generators/typescript-types.js';
import { ST_ENDPOINTS, ENDPOINTS_BY_PRIORITY } from './endpoints.js';

// Parse command line arguments
function parseArgs(): {
  maxPriority: number;
  modules: string[] | undefined;
  dryRun: boolean;
  skipFetch: boolean;
  skipAnalyze: boolean;
} {
  const args = process.argv.slice(2);
  
  let maxPriority = 2;
  let modules: string[] | undefined;
  let dryRun = false;
  let skipFetch = false;
  let skipAnalyze = false;

  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--priority' && args[i + 1]) {
      maxPriority = parseInt(args[i + 1], 10);
      i++;
    } else if (args[i] === '--module' && args[i + 1]) {
      modules = modules || [];
      modules.push(args[i + 1]);
      i++;
    } else if (args[i] === '--dry-run') {
      dryRun = true;
    } else if (args[i] === '--skip-fetch') {
      skipFetch = true;
    } else if (args[i] === '--skip-analyze') {
      skipAnalyze = true;
    }
  }

  return { maxPriority, modules, dryRun, skipFetch, skipAnalyze };
}

async function main() {
  const { maxPriority, modules, dryRun, skipFetch, skipAnalyze } = parseArgs();

  console.log('');
  console.log('╔═══════════════════════════════════════════════════════════════╗');
  console.log('║         LAZI ServiceTitan Schema Discovery Tool               ║');
  console.log('╚═══════════════════════════════════════════════════════════════╝');
  console.log('');

  // Show endpoint statistics
  console.log('Endpoint Statistics:');
  console.log(`  Total defined: ${ST_ENDPOINTS.length}`);
  console.log(`  Priority 1 (critical): ${ENDPOINTS_BY_PRIORITY.priority1}`);
  console.log(`  Priority 2 (important): ${ENDPOINTS_BY_PRIORITY.priority2}`);
  console.log(`  Priority 3 (secondary): ${ENDPOINTS_BY_PRIORITY.priority3}`);
  console.log(`  Priority 4 (reference): ${ENDPOINTS_BY_PRIORITY.priority4}`);
  console.log('');

  const startTime = Date.now();

  // ===========================================
  // STEP 1: Fetch samples from ST API
  // ===========================================
  if (!skipFetch) {
    console.log('┌───────────────────────────────────────────────────────────────┐');
    console.log('│  STEP 1: Fetching samples from ServiceTitan API               │');
    console.log('└───────────────────────────────────────────────────────────────┘');
    console.log('');

    const fetchResults = await fetchAllEndpoints({
      maxPriority,
      modules,
      delayMs: 500,
      dryRun,
    });

    if (dryRun) {
      console.log('Dry run complete. No files written.');
      return;
    }

    const successCount = fetchResults.filter(r => r.success).length;
    if (successCount === 0) {
      console.error('❌ No endpoints fetched successfully. Check your credentials.');
      process.exit(1);
    }
  } else {
    console.log('⏭️  Skipping fetch (--skip-fetch)');
    console.log('');
  }

  // ===========================================
  // STEP 2: Analyze response structures
  // ===========================================
  if (!skipAnalyze) {
    console.log('┌───────────────────────────────────────────────────────────────┐');
    console.log('│  STEP 2: Analyzing response structures                        │');
    console.log('└───────────────────────────────────────────────────────────────┘');
    console.log('');

    const analyses = await analyzeAllEndpoints();
    
    if (analyses.length === 0) {
      console.error('❌ No samples to analyze. Run fetch first.');
      process.exit(1);
    }

    // ===========================================
    // STEP 3: Generate artifacts
    // ===========================================
    console.log('');
    console.log('┌───────────────────────────────────────────────────────────────┐');
    console.log('│  STEP 3: Generating artifacts                                 │');
    console.log('└───────────────────────────────────────────────────────────────┘');
    console.log('');

    console.log('Generating raw table migrations...');
    await generateRawMigration(analyses);

    console.log('Generating master table migrations...');
    await generateMasterMigration(analyses);

    console.log('Generating TypeScript types...');
    await generateTypeScriptTypes(analyses);

  } else {
    console.log('⏭️  Skipping analysis (--skip-analyze)');
  }

  // ===========================================
  // Summary
  // ===========================================
  const duration = ((Date.now() - startTime) / 1000).toFixed(1);

  console.log('');
  console.log('╔═══════════════════════════════════════════════════════════════╗');
  console.log('║                    DISCOVERY COMPLETE                         ║');
  console.log('╚═══════════════════════════════════════════════════════════════╝');
  console.log('');
  console.log(`Duration: ${duration}s`);
  console.log('');
  console.log('Generated files:');
  console.log('  📁 discovery/output/samples/');
  console.log('     └── *.json                  (raw API responses)');
  console.log('  📁 discovery/output/analysis/');
  console.log('     └── *.json                  (field analysis)');
  console.log('  📁 discovery/output/migrations/');
  console.log('     ├── 004_raw_tables.sql');
  console.log('     └── 005_master_tables.sql');
  console.log('  📁 discovery/output/types/');
  console.log('     └── servicetitan.types.ts');
  console.log('');
  console.log('Next steps:');
  console.log('  1. Review generated SQL in discovery/output/migrations/');
  console.log('  2. Adjust column types as needed');
  console.log('  3. Copy migrations to /migrations folder:');
  console.log('     cp discovery/output/migrations/*.sql migrations/');
  console.log('  4. Run migrations against your database');
  console.log('');
}

main().catch((error) => {
  console.error('');
  console.error('❌ Discovery failed:', error.message);
  console.error('');
  
  if (error.message.includes('authentication') || error.message.includes('401')) {
    console.error('Check your ServiceTitan credentials in .env:');
    console.error('  - SERVICE_TITAN_CLIENT_ID');
    console.error('  - SERVICE_TITAN_CLIENT_SECRET');
    console.error('  - SERVICE_TITAN_APP_KEY');
    console.error('  - SERVICE_TITAN_TENANT_ID (or TENANT_ID)');
  } else if (error.message.includes('ENOTFOUND') || error.message.includes('network')) {
    console.error('Network error. Check your internet connection.');
  } else {
    console.error('Stack trace:', error.stack);
  }
  
  console.error('');
  process.exit(1);
});
