import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { createLogger } from '../src/utils/logger.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const logger = createLogger({ module: 'discovery-analyzer' });

export interface FieldInfo {
  path: string;
  types: string[];
  nullable: boolean;
  isArray: boolean;
  isObject: boolean;
  sampleValues: unknown[];
  occurrenceCount: number;
  totalRecords: number;
  minLength?: number;
  maxLength?: number;
  minValue?: number;
  maxValue?: number;
}

export interface AnalysisResult {
  endpointName: string;
  recordCount: number;
  fields: FieldInfo[];
  rootStructure: 'array' | 'object' | 'paginated';
  paginationFields?: string[];
  idField?: string;
  timestampFields: string[];
  relationshipFields: string[];
  analyzedAt: string;
}

/**
 * Extract all fields from an object recursively
 */
function extractFields(
  obj: unknown,
  prefix: string,
  fieldMap: Map<string, FieldInfo>,
  totalRecords: number
): void {
  if (obj === null || obj === undefined) return;

  if (Array.isArray(obj)) {
    // Analyze array items (sample first 20)
    for (const item of obj.slice(0, 20)) {
      extractFields(item, `${prefix}[]`, fieldMap, totalRecords);
    }
    return;
  }

  if (typeof obj === 'object') {
    for (const [key, value] of Object.entries(obj)) {
      const fieldPath = prefix ? `${prefix}.${key}` : key;

      // Get or create field info
      let fieldInfo = fieldMap.get(fieldPath);
      if (!fieldInfo) {
        fieldInfo = {
          path: fieldPath,
          types: [],
          nullable: false,
          isArray: false,
          isObject: false,
          sampleValues: [],
          occurrenceCount: 0,
          totalRecords,
        };
        fieldMap.set(fieldPath, fieldInfo);
      }

      fieldInfo.occurrenceCount++;

      // Analyze value
      if (value === null || value === undefined) {
        fieldInfo.nullable = true;
        if (!fieldInfo.types.includes('null')) {
          fieldInfo.types.push('null');
        }
      } else if (Array.isArray(value)) {
        fieldInfo.isArray = true;
        if (!fieldInfo.types.includes('array')) {
          fieldInfo.types.push('array');
        }
        extractFields(value, fieldPath, fieldMap, totalRecords);
      } else if (typeof value === 'object') {
        fieldInfo.isObject = true;
        if (!fieldInfo.types.includes('object')) {
          fieldInfo.types.push('object');
        }
        extractFields(value, fieldPath, fieldMap, totalRecords);
      } else {
        const valueType = typeof value;
        if (!fieldInfo.types.includes(valueType)) {
          fieldInfo.types.push(valueType);
        }

        // Collect sample values (max 5 unique)
        if (fieldInfo.sampleValues.length < 5) {
          const exists = fieldInfo.sampleValues.some(
            sv => JSON.stringify(sv) === JSON.stringify(value)
          );
          if (!exists) {
            fieldInfo.sampleValues.push(value);
          }
        }

        // Track min/max for strings (length) and numbers (value)
        if (typeof value === 'string') {
          fieldInfo.minLength = Math.min(fieldInfo.minLength ?? value.length, value.length);
          fieldInfo.maxLength = Math.max(fieldInfo.maxLength ?? value.length, value.length);
        } else if (typeof value === 'number') {
          fieldInfo.minValue = Math.min(fieldInfo.minValue ?? value, value);
          fieldInfo.maxValue = Math.max(fieldInfo.maxValue ?? value, value);
        }
      }
    }
  }
}

/**
 * Analyze a single endpoint's response
 */
export async function analyzeEndpoint(endpointName: string): Promise<AnalysisResult> {
  const samplePath = path.join(__dirname, 'output', 'samples', `${endpointName}.json`);
  
  let raw: string;
  try {
    raw = await fs.readFile(samplePath, 'utf-8');
  } catch (error) {
    throw new Error(`Sample file not found for ${endpointName}. Run fetch first.`);
  }

  const response = JSON.parse(raw);

  // Determine structure and extract records
  let records: unknown[];
  let rootStructure: 'array' | 'object' | 'paginated';
  let paginationFields: string[] | undefined;

  if (Array.isArray(response)) {
    records = response;
    rootStructure = 'array';
  } else if (response && typeof response === 'object' && 'data' in response && Array.isArray(response.data)) {
    records = response.data;
    rootStructure = 'paginated';
    paginationFields = Object.keys(response).filter(k => k !== 'data');
  } else if (response && typeof response === 'object') {
    records = [response];
    rootStructure = 'object';
  } else {
    records = [];
    rootStructure = 'object';
  }

  // Analyze all fields
  const fieldMap = new Map<string, FieldInfo>();
  for (const record of records) {
    extractFields(record, '', fieldMap, records.length);
  }

  const fields = Array.from(fieldMap.values()).sort((a, b) => 
    a.path.localeCompare(b.path)
  );

  // Identify special fields
  const idField = fields.find(f =>
    f.path === 'id' || f.path === 'Id'
  )?.path;

  const timestampFields = fields
    .filter(f =>
      !f.path.includes('.') &&
      (f.path.toLowerCase().includes('date') ||
        f.path.toLowerCase().includes('time') ||
        f.path.toLowerCase().includes('created') ||
        f.path.toLowerCase().includes('modified') ||
        f.path.toLowerCase().includes('updated') ||
        f.sampleValues.some(v => 
          typeof v === 'string' && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}/.test(v)
        ))
    )
    .map(f => f.path);

  const relationshipFields = fields
    .filter(f =>
      !f.path.includes('.') &&
      (f.path.endsWith('Id') ||
        f.path.endsWith('_id') ||
        f.path.endsWith('ID'))
    )
    .map(f => f.path);

  const result: AnalysisResult = {
    endpointName,
    recordCount: records.length,
    fields,
    rootStructure,
    paginationFields,
    idField,
    timestampFields,
    relationshipFields,
    analyzedAt: new Date().toISOString(),
  };

  // Save analysis
  const outputDir = path.join(__dirname, 'output', 'analysis');
  await fs.mkdir(outputDir, { recursive: true });
  await fs.writeFile(
    path.join(outputDir, `${endpointName}.json`),
    JSON.stringify(result, null, 2)
  );

  return result;
}

/**
 * Analyze all fetched endpoints
 */
export async function analyzeAllEndpoints(): Promise<AnalysisResult[]> {
  const samplesDir = path.join(__dirname, 'output', 'samples');
  
  let files: string[];
  try {
    files = await fs.readdir(samplesDir);
  } catch (error) {
    throw new Error('No samples found. Run fetch first.');
  }

  const results: AnalysisResult[] = [];

  for (const file of files) {
    if (file.startsWith('_') || !file.endsWith('.json')) continue;

    const endpointName = file.replace('.json', '');
    console.log(`Analyzing: ${endpointName}`);

    try {
      const result = await analyzeEndpoint(endpointName);
      results.push(result);

      const topLevelFields = result.fields.filter(f => !f.path.includes('.') && !f.path.includes('[]'));
      console.log(`  ✓ ${result.recordCount} records, ${topLevelFields.length} top-level fields`);
    } catch (error: any) {
      console.log(`  ✗ Failed: ${error.message}`);
    }
  }

  // Save combined analysis
  await fs.writeFile(
    path.join(__dirname, 'output', 'analysis', '_all.json'),
    JSON.stringify(results, null, 2)
  );

  // Print summary
  console.log('\n===========================================');
  console.log(`  ANALYSIS COMPLETE: ${results.length} endpoints`);
  console.log('===========================================\n');

  return results;
}
