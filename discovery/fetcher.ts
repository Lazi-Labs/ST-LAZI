import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { ST_ENDPOINTS, type EndpointDefinition } from './endpoints.js';
import { getSTClient } from '../src/servicetitan/client.js';
import { createLogger } from '../src/utils/logger.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const logger = createLogger({ module: 'discovery-fetcher' });

export interface FetchResult {
  endpoint: EndpointDefinition;
  success: boolean;
  sampleCount: number;
  response: unknown;
  error?: string;
  fetchedAt: string;
  durationMs: number;
}

/**
 * Sleep utility
 */
function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Fetch sample data from a single endpoint
 */
export async function fetchEndpoint(endpoint: EndpointDefinition): Promise<FetchResult> {
  const client = getSTClient();
  const startTime = Date.now();

  try {
    logger.info({ 
      name: endpoint.name, 
      path: endpoint.path,
      module: endpoint.module 
    }, 'Fetching endpoint');

    // Fetch first page with reasonable sample size
    const response = await client.get<unknown>(endpoint.path, {
      pageSize: 100,
      page: 1,
    });

    const data = response.data;
    let sampleCount = 0;

    // Handle different response structures
    if (Array.isArray(data)) {
      sampleCount = data.length;
    } else if (data && typeof data === 'object') {
      if ('data' in data && Array.isArray((data as any).data)) {
        sampleCount = (data as any).data.length;
      } else {
        // Single object response
        sampleCount = 1;
      }
    }

    logger.info({ 
      name: endpoint.name, 
      sampleCount,
      durationMs: Date.now() - startTime 
    }, 'Fetch successful');

    return {
      endpoint,
      success: true,
      sampleCount,
      response: data,
      fetchedAt: new Date().toISOString(),
      durationMs: Date.now() - startTime,
    };
  } catch (error: any) {
    const errorMessage = error.response?.data?.message 
      || error.response?.data?.error
      || error.message;

    logger.error({ 
      name: endpoint.name, 
      error: errorMessage,
      status: error.response?.status 
    }, 'Fetch failed');

    return {
      endpoint,
      success: false,
      sampleCount: 0,
      response: null,
      error: `${error.response?.status || 'ERR'}: ${errorMessage}`,
      fetchedAt: new Date().toISOString(),
      durationMs: Date.now() - startTime,
    };
  }
}

/**
 * Fetch all endpoints and save results
 */
export async function fetchAllEndpoints(options: {
  maxPriority?: number;
  modules?: string[];
  delayMs?: number;
  dryRun?: boolean;
} = {}): Promise<FetchResult[]> {
  const { maxPriority = 2, modules, delayMs = 500, dryRun = false } = options;

  // Filter endpoints by priority and optionally by module
  let endpoints = ST_ENDPOINTS.filter(e => e.priority <= maxPriority);
  if (modules && modules.length > 0) {
    endpoints = endpoints.filter(e => modules.includes(e.module));
  }

  // Sort by priority
  endpoints.sort((a, b) => a.priority - b.priority);

  const outputDir = path.join(__dirname, 'output', 'samples');
  await fs.mkdir(outputDir, { recursive: true });

  const results: FetchResult[] = [];

  console.log('');
  console.log('╔═══════════════════════════════════════════════════════════════╗');
  console.log('║           ServiceTitan API Discovery - Fetch Phase            ║');
  console.log('╚═══════════════════════════════════════════════════════════════╝');
  console.log('');
  console.log(`Endpoints to fetch: ${endpoints.length}`);
  console.log(`Max priority: ${maxPriority}`);
  console.log(`Delay between requests: ${delayMs}ms`);
  if (dryRun) {
    console.log('DRY RUN - No actual API calls will be made');
  }
  console.log('');

  for (let i = 0; i < endpoints.length; i++) {
    const endpoint = endpoints[i];

    console.log(`[${i + 1}/${endpoints.length}] ${endpoint.name}`);
    console.log(`  Module: ${endpoint.module}`);
    console.log(`  Path: ${endpoint.path}`);
    console.log(`  Priority: ${endpoint.priority}`);

    if (dryRun) {
      console.log('  ⏭️  Skipped (dry run)');
      continue;
    }

    const result = await fetchEndpoint(endpoint);
    results.push(result);

    if (result.success) {
      console.log(`  ✓ Success: ${result.sampleCount} records (${result.durationMs}ms)`);

      // Save raw response
      const filename = `${endpoint.name}.json`;
      await fs.writeFile(
        path.join(outputDir, filename),
        JSON.stringify(result.response, null, 2)
      );
    } else {
      console.log(`  ✗ Failed: ${result.error}`);
    }

    // Rate limiting delay
    if (i < endpoints.length - 1) {
      await sleep(delayMs);
    }
  }

  // Save summary
  const summary = results.map(r => ({
    name: r.endpoint.name,
    module: r.endpoint.module,
    priority: r.endpoint.priority,
    success: r.success,
    sampleCount: r.sampleCount,
    durationMs: r.durationMs,
    error: r.error,
  }));

  await fs.writeFile(
    path.join(outputDir, '_summary.json'),
    JSON.stringify(summary, null, 2)
  );

  // Print summary
  const successCount = results.filter(r => r.success).length;
  const failedResults = results.filter(r => !r.success);

  console.log('');
  console.log('═══════════════════════════════════════════════════════════════');
  console.log(`  FETCH COMPLETE: ${successCount}/${results.length} successful`);
  console.log('═══════════════════════════════════════════════════════════════');

  if (failedResults.length > 0) {
    console.log('');
    console.log('Failed endpoints:');
    for (const f of failedResults) {
      console.log(`  - ${f.endpoint.name}: ${f.error}`);
    }
  }

  console.log('');
  console.log(`Output saved to: ${outputDir}`);
  console.log('');

  return results;
}

/**
 * Fetch only critical endpoints (priority 1)
 */
export async function fetchCriticalEndpoints(): Promise<FetchResult[]> {
  return fetchAllEndpoints({ maxPriority: 1 });
}

/**
 * Fetch endpoints for a specific module
 */
export async function fetchModuleEndpoints(module: string): Promise<FetchResult[]> {
  return fetchAllEndpoints({ maxPriority: 4, modules: [module] });
}
