import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import type { AnalysisResult, FieldInfo } from '../analyzer.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/**
 * Convert string to PascalCase
 */
function toPascalCase(str: string): string {
  return str
    .split(/[_\s-]/)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join('');
}

/**
 * Convert string to camelCase
 */
function toCamelCase(str: string): string {
  const pascal = toPascalCase(str);
  return pascal.charAt(0).toLowerCase() + pascal.slice(1);
}

/**
 * Infer TypeScript type from field analysis
 */
function inferTsType(field: FieldInfo, forMaster = false): string {
  const { types, isArray, isObject, sampleValues, path: fieldPath } = field;

  if (isArray) {
    return 'unknown[]';
  }

  if (isObject) {
    return 'Record<string, unknown>';
  }

  if (types.includes('boolean')) {
    return 'boolean';
  }

  if (types.includes('number')) {
    return 'number';
  }

  if (types.includes('string')) {
    // Check for timestamps
    const looksLikeTimestamp = sampleValues.some(
      v => typeof v === 'string' && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}/.test(v)
    );

    if (looksLikeTimestamp || fieldPath.toLowerCase().includes('date')) {
      return forMaster ? 'Date' : 'string';
    }

    return 'string';
  }

  return 'unknown';
}

/**
 * Generate TypeScript interface for a field
 */
function generateFieldLine(field: FieldInfo, forMaster = false): string {
  const name = forMaster ? toCamelCase(field.path) : field.path;
  const optional = field.nullable || field.occurrenceCount < field.totalRecords ? '?' : '';
  const tsType = inferTsType(field, forMaster);

  return `  ${name}${optional}: ${tsType};`;
}

/**
 * Generate TypeScript types from analysis
 */
export async function generateTypeScriptTypes(analyses: AnalysisResult[]): Promise<string> {
  const lines: string[] = [
    '// ===========================================',
    '// ServiceTitan API Response Types',
    `// Auto-generated: ${new Date().toISOString()}`,
    '// ===========================================',
    '',
    '// DO NOT EDIT MANUALLY - regenerate from discovery',
    '// These types represent the raw API responses from ServiceTitan',
    '',
  ];

  // Generate ST response types
  lines.push('// ===========================================');
  lines.push('// RAW RESPONSE TYPES (as returned by ST API)');
  lines.push('// ===========================================');
  lines.push('');

  for (const analysis of analyses) {
    const typeName = `ST${toPascalCase(analysis.endpointName)}`;

    // Get top-level fields
    const topLevelFields = analysis.fields.filter(
      f => !f.path.includes('.') && !f.path.includes('[]')
    );

    lines.push(`/**`);
    lines.push(` * ${analysis.endpointName} - Raw ServiceTitan response`);
    lines.push(` * Sample size: ${analysis.recordCount} records`);
    lines.push(` */`);
    lines.push(`export interface ${typeName} {`);

    for (const field of topLevelFields) {
      lines.push(generateFieldLine(field, false));
    }

    lines.push('}');
    lines.push('');
  }

  // Generate Master types
  lines.push('// ===========================================');
  lines.push('// MASTER TABLE TYPES (cleaned/typed)');
  lines.push('// ===========================================');
  lines.push('');

  for (const analysis of analyses) {
    const typeName = `Master${toPascalCase(analysis.endpointName)}`;

    const topLevelFields = analysis.fields.filter(
      f => !f.path.includes('.') && !f.path.includes('[]') && f.path !== analysis.idField
    );

    lines.push(`/**`);
    lines.push(` * ${analysis.endpointName} - Master table type`);
    lines.push(` */`);
    lines.push(`export interface ${typeName} {`);
    lines.push('  id: number;');

    if (analysis.idField) {
      lines.push('  stId: number;');
    }

    for (const field of topLevelFields) {
      lines.push(generateFieldLine(field, true));
    }

    lines.push('  syncedAt: Date;');
    lines.push('  syncBatchId: string;');
    lines.push('}');
    lines.push('');
  }

  // Generate paginated response wrapper
  lines.push('// ===========================================');
  lines.push('// COMMON TYPES');
  lines.push('// ===========================================');
  lines.push('');
  lines.push('/**');
  lines.push(' * Paginated response wrapper (common ST pattern)');
  lines.push(' */');
  lines.push('export interface STPaginatedResponse<T> {');
  lines.push('  data: T[];');
  lines.push('  page?: number;');
  lines.push('  pageSize?: number;');
  lines.push('  totalCount?: number;');
  lines.push('  hasMore?: boolean;');
  lines.push('}');
  lines.push('');

  // Generate endpoint name union type
  lines.push('/**');
  lines.push(' * All endpoint names');
  lines.push(' */');
  lines.push('export type STEndpointName =');
  for (let i = 0; i < analyses.length; i++) {
    const comma = i < analyses.length - 1 ? '' : ';';
    lines.push(`  | '${analyses[i].endpointName}'${comma}`);
  }
  lines.push('');

  const ts = lines.join('\n');

  // Save
  const outputPath = path.join(__dirname, '..', 'output', 'types', 'servicetitan.types.ts');
  await fs.mkdir(path.dirname(outputPath), { recursive: true });
  await fs.writeFile(outputPath, ts);

  console.log(`Generated: ${outputPath}`);
  return ts;
}
