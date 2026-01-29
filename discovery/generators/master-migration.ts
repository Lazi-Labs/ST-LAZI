import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import type { AnalysisResult, FieldInfo } from '../analyzer.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/**
 * Convert camelCase to snake_case
 */
function camelToSnake(str: string): string {
  return str
    .replace(/([A-Z])/g, '_$1')
    .toLowerCase()
    .replace(/^_/, '')
    .replace(/__+/g, '_');
}

/**
 * Infer SQL column type from field analysis
 */
function inferSqlType(field: FieldInfo): string | null {
  const { types, sampleValues, isArray, isObject, minValue, maxValue, path: fieldPath } = field;

  // Skip nested fields (will be in JSONB or separate tables)
  if (fieldPath.includes('.') || fieldPath.includes('[]')) {
    return null;
  }

  // Arrays and objects become JSONB
  if (isArray || isObject) {
    return 'JSONB';
  }

  // Check for boolean
  if (types.includes('boolean')) {
    return 'BOOLEAN';
  }

  // Check for number
  if (types.includes('number')) {
    // Check if it has decimals
    const hasDecimals = sampleValues.some(
      v => typeof v === 'number' && !Number.isInteger(v)
    );

    if (hasDecimals) {
      return 'DECIMAL(12,2)';
    }

    // Check for large numbers (likely IDs)
    if ((maxValue && maxValue > 2147483647) || (minValue && minValue > 2147483647)) {
      return 'BIGINT';
    }

    return 'INT';
  }

  // Check for string
  if (types.includes('string')) {
    // Check if it looks like a timestamp
    const looksLikeTimestamp = sampleValues.some(
      v => typeof v === 'string' && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}/.test(v)
    );

    if (looksLikeTimestamp) {
      return 'TIMESTAMPTZ';
    }

    // Check field name for date hints
    const lowerPath = fieldPath.toLowerCase();
    if (
      lowerPath.includes('date') ||
      lowerPath.includes('time') ||
      lowerPath.endsWith('at') ||
      lowerPath.endsWith('on')
    ) {
      // Only if samples look like dates
      const hasDateSamples = sampleValues.some(
        v => typeof v === 'string' && /\d{4}-\d{2}-\d{2}/.test(v)
      );
      if (hasDateSamples) {
        return 'TIMESTAMPTZ';
      }
    }

    return 'TEXT';
  }

  return 'TEXT';
}

/**
 * Generate SQL migration for master tables
 */
export async function generateMasterMigration(analyses: AnalysisResult[]): Promise<string> {
  const lines: string[] = [
    '-- ===========================================',
    '-- MASTER TABLES (Auto-generated from ST API discovery)',
    `-- Generated: ${new Date().toISOString()}`,
    '-- ===========================================',
    '',
    '-- These tables contain typed, cleaned data extracted from raw',
    '-- REVIEW CAREFULLY before running - adjust types as needed',
    '-- This is a starting point, not a final schema',
    '',
  ];

  for (const analysis of analyses) {
    const tableName = analysis.endpointName;

    // Get top-level fields only
    const topLevelFields = analysis.fields.filter(
      f => !f.path.includes('.') && !f.path.includes('[]') && f.path !== analysis.idField
    );

    lines.push(`-- ===========================================`);
    lines.push(`-- ${tableName.toUpperCase()}`);
    lines.push(`-- ===========================================`);
    lines.push(`-- Source: ${analysis.recordCount} sample records`);
    lines.push(`-- Fields: ${topLevelFields.length} top-level (${analysis.fields.length} total including nested)`);
    lines.push('');
    lines.push(`CREATE TABLE IF NOT EXISTS master.${tableName} (`);
    lines.push('    id BIGSERIAL PRIMARY KEY,');

    // Add ST ID if detected
    if (analysis.idField) {
      lines.push(`    st_id BIGINT NOT NULL UNIQUE,`);
    }

    lines.push('');

    // Add columns for each top-level field
    const columnLines: string[] = [];
    for (const field of topLevelFields) {
      const sqlType = inferSqlType(field);
      if (!sqlType) continue;

      const colName = camelToSnake(field.path);
      const nullable = field.nullable || field.occurrenceCount < field.totalRecords;

      // Build column definition
      let colDef = `    ${colName} ${sqlType}`;
      if (!nullable && !field.isArray && !field.isObject) {
        // Only add NOT NULL for simple types that were always present
        // Be conservative - many fields might be null in practice
      }

      // Add comment with sample values
      const sampleStr = field.sampleValues
        .slice(0, 3)
        .map(v => JSON.stringify(v))
        .join(', ');
      if (sampleStr) {
        colDef += `,  -- Samples: ${sampleStr.slice(0, 60)}${sampleStr.length > 60 ? '...' : ''}`;
      } else {
        colDef += ',';
      }

      columnLines.push(colDef);
    }

    lines.push(...columnLines);
    lines.push('');

    // Add tracking fields
    lines.push('    -- Sync tracking');
    lines.push('    synced_at TIMESTAMPTZ NOT NULL,');
    lines.push('    sync_batch_id UUID NOT NULL,');
    lines.push('    payload_hash TEXT NOT NULL');
    lines.push(');');
    lines.push('');

    // Generate indexes
    if (analysis.idField) {
      lines.push(`CREATE INDEX IF NOT EXISTS idx_master_${tableName}_st_id`);
      lines.push(`    ON master.${tableName} (st_id);`);
    }

    // Index relationship fields
    for (const relField of analysis.relationshipFields) {
      if (!relField.includes('.')) {
        const colName = camelToSnake(relField);
        lines.push(`CREATE INDEX IF NOT EXISTS idx_master_${tableName}_${colName}`);
        lines.push(`    ON master.${tableName} (${colName});`);
      }
    }

    // Index common filter fields
    const commonFilters = ['status', 'type', 'active', 'is_active'];
    for (const filter of commonFilters) {
      const hasField = topLevelFields.some(
        f => camelToSnake(f.path) === filter || camelToSnake(f.path) === `is_${filter}`
      );
      if (hasField) {
        lines.push(`CREATE INDEX IF NOT EXISTS idx_master_${tableName}_${filter}`);
        lines.push(`    ON master.${tableName} (${filter});`);
      }
    }

    lines.push(`CREATE INDEX IF NOT EXISTS idx_master_${tableName}_synced`);
    lines.push(`    ON master.${tableName} (synced_at DESC);`);
    lines.push('');
  }

  const sql = lines.join('\n');

  // Save
  const outputPath = path.join(__dirname, '..', 'output', 'migrations', '005_master_tables.sql');
  await fs.mkdir(path.dirname(outputPath), { recursive: true });
  await fs.writeFile(outputPath, sql);

  console.log(`Generated: ${outputPath}`);
  return sql;
}
