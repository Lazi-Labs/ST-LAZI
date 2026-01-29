import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import type { AnalysisResult } from '../analyzer.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/**
 * Generate SQL migration for raw tables
 * Raw tables store the EXACT response from ServiceTitan as JSONB
 */
export async function generateRawMigration(analyses: AnalysisResult[]): Promise<string> {
  const lines: string[] = [
    '-- ===========================================',
    '-- RAW TABLES (Auto-generated from ST API discovery)',
    `-- Generated: ${new Date().toISOString()}`,
    '-- ===========================================',
    '',
    '-- These tables store the EXACT response from ServiceTitan',
    '-- DO NOT modify this schema manually - regenerate from discovery',
    '-- Raw tables are APPEND-ONLY - no updates or deletes allowed',
    '',
  ];

  // Group by category for organization
  const byCategory = new Map<string, AnalysisResult[]>();
  for (const analysis of analyses) {
    const category = analysis.endpointName.split('_')[0] || 'other';
    if (!byCategory.has(category)) {
      byCategory.set(category, []);
    }
    byCategory.get(category)!.push(analysis);
  }

  for (const [category, categoryAnalyses] of byCategory) {
    lines.push(`-- ===========================================`);
    lines.push(`-- ${category.toUpperCase()}`);
    lines.push(`-- ===========================================`);
    lines.push('');

    for (const analysis of categoryAnalyses) {
      const tableName = `st_${analysis.endpointName}`;

      lines.push(`-- ${analysis.endpointName}`);
      lines.push(`-- Sample: ${analysis.recordCount} records, ${analysis.fields.length} total fields`);
      lines.push(`-- ID field: ${analysis.idField || 'none detected'}`);
      lines.push(`-- Timestamps: ${analysis.timestampFields.join(', ') || 'none'}`);
      lines.push(`-- Relationships: ${analysis.relationshipFields.join(', ') || 'none'}`);
      lines.push(`CREATE TABLE IF NOT EXISTS raw.${tableName} (`);
      lines.push('    id BIGSERIAL PRIMARY KEY,');

      // Add computed ST ID column if ID field exists
      if (analysis.idField) {
        lines.push(`    st_id BIGINT GENERATED ALWAYS AS ((payload->>'${analysis.idField}')::bigint) STORED,`);
      }

      lines.push('    payload JSONB NOT NULL,');
      lines.push('    synced_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),');
      lines.push('    sync_batch_id UUID NOT NULL');
      lines.push(');');
      lines.push('');

      // Indexes
      if (analysis.idField) {
        lines.push(`CREATE INDEX IF NOT EXISTS idx_raw_${analysis.endpointName}_st_id`);
        lines.push(`    ON raw.${tableName} (st_id);`);
      }
      lines.push(`CREATE INDEX IF NOT EXISTS idx_raw_${analysis.endpointName}_synced`);
      lines.push(`    ON raw.${tableName} (synced_at DESC);`);
      lines.push(`CREATE INDEX IF NOT EXISTS idx_raw_${analysis.endpointName}_batch`);
      lines.push(`    ON raw.${tableName} (sync_batch_id);`);
      lines.push('');
    }
  }

  // Add protection triggers
  lines.push('-- ===========================================');
  lines.push('-- PROTECTION TRIGGERS');
  lines.push('-- ===========================================');
  lines.push('');
  lines.push('-- Function to prevent modifications');
  lines.push('CREATE OR REPLACE FUNCTION raw.prevent_modification()');
  lines.push('RETURNS TRIGGER AS $$');
  lines.push('BEGIN');
  lines.push("    RAISE EXCEPTION 'Raw tables are immutable. % operations not allowed on %.%',");
  lines.push('        TG_OP, TG_TABLE_SCHEMA, TG_TABLE_NAME');
  lines.push("    USING HINT = 'Raw tables only accept INSERTs from the sync worker';");
  lines.push('END;');
  lines.push('$$ LANGUAGE plpgsql;');
  lines.push('');
  lines.push('-- Apply protection to all raw tables');
  lines.push('DO $$');
  lines.push('DECLARE');
  lines.push('    tbl TEXT;');
  lines.push('BEGIN');
  lines.push("    FOR tbl IN SELECT tablename FROM pg_tables WHERE schemaname = 'raw'");
  lines.push('    LOOP');
  lines.push("        EXECUTE format('");
  lines.push('            DROP TRIGGER IF EXISTS protect_%I ON raw.%I;');
  lines.push('            CREATE TRIGGER protect_%I');
  lines.push('                BEFORE UPDATE OR DELETE ON raw.%I');
  lines.push('                FOR EACH ROW EXECUTE FUNCTION raw.prevent_modification();');
  lines.push("        ', tbl, tbl, tbl, tbl);");
  lines.push('    END LOOP;');
  lines.push('END $$;');

  const sql = lines.join('\n');

  // Save
  const outputPath = path.join(__dirname, '..', 'output', 'migrations', '004_raw_tables.sql');
  await fs.mkdir(path.dirname(outputPath), { recursive: true });
  await fs.writeFile(outputPath, sql);

  console.log(`Generated: ${outputPath}`);
  return sql;
}
