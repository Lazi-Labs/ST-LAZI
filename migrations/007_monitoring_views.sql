-- ============================================
-- HEALTH & MONITORING VIEWS
-- ============================================

-- Overall system health
CREATE OR REPLACE VIEW system.health_status AS

-- Sync freshness check
SELECT 
    'sync_freshness' as check_name,
    CASE 
        WHEN MAX(completed_at) > NOW() - INTERVAL '15 minutes' THEN 'healthy'
        WHEN MAX(completed_at) > NOW() - INTERVAL '1 hour' THEN 'degraded'
        ELSE 'critical'
    END as status,
    COALESCE(MAX(completed_at)::text, 'never') as last_value,
    'Time since last successful sync' as description
FROM system.sync_batches 
WHERE status = 'completed'

UNION ALL

-- Pending mutations check
SELECT 
    'pending_mutations',
    CASE 
        WHEN COUNT(*) < 10 THEN 'healthy'
        WHEN COUNT(*) < 50 THEN 'degraded'
        ELSE 'critical'
    END,
    COUNT(*)::text,
    'Mutations waiting to send to ServiceTitan'
FROM outbound.mutations 
WHERE status = 'pending'

UNION ALL

-- Failed mutations (DLQ) check
SELECT 
    'failed_mutations',
    CASE WHEN COUNT(*) = 0 THEN 'healthy' ELSE 'critical' END,
    COUNT(*)::text,
    'Mutations that failed permanently'
FROM outbound.dead_letter_queue 
WHERE resolved_at IS NULL

UNION ALL

-- Sync error rate (last 24h)
SELECT 
    'sync_error_rate',
    CASE 
        WHEN COALESCE(failed::float / NULLIF(total, 0), 0) < 0.05 THEN 'healthy'
        WHEN COALESCE(failed::float / NULLIF(total, 0), 0) < 0.20 THEN 'degraded'
        ELSE 'critical'
    END,
    COALESCE(ROUND(failed::numeric / NULLIF(total, 0) * 100, 1)::text || '%', '0%'),
    'Sync failure rate in last 24 hours'
FROM (
    SELECT 
        COUNT(*) FILTER (WHERE status = 'failed') as failed,
        COUNT(*) as total
    FROM system.sync_batches
    WHERE started_at > NOW() - INTERVAL '24 hours'
) stats

UNION ALL

-- Raw table record count
SELECT 
    'raw_records_total',
    'info',
    (SELECT COALESCE(SUM(n_live_tup), 0)::text FROM pg_stat_user_tables WHERE schemaname = 'raw'),
    'Total records across all raw tables'

UNION ALL

-- Master table record count  
SELECT 
    'master_records_total',
    'info',
    (SELECT COALESCE(SUM(n_live_tup), 0)::text FROM pg_stat_user_tables WHERE schemaname = 'master'),
    'Total records across all master tables';

-- Sync status by endpoint
CREATE OR REPLACE VIEW system.sync_status_by_endpoint AS
SELECT 
    entity_type as endpoint,
    COUNT(*) FILTER (WHERE status = 'completed') as successful_syncs,
    COUNT(*) FILTER (WHERE status = 'failed') as failed_syncs,
    MAX(completed_at) FILTER (WHERE status = 'completed') as last_success,
    MAX(started_at) FILTER (WHERE status = 'failed') as last_failure,
    COALESCE(SUM(records_fetched) FILTER (WHERE status = 'completed' AND completed_at > NOW() - INTERVAL '24 hours'), 0) as records_synced_24h
FROM system.sync_batches
GROUP BY entity_type
ORDER BY last_success DESC NULLS LAST;

-- Table sizes
CREATE OR REPLACE VIEW system.table_sizes AS
SELECT 
    schemaname as schema,
    tablename as table_name,
    pg_size_pretty(pg_total_relation_size(schemaname || '.' || tablename)) as total_size,
    pg_size_pretty(pg_relation_size(schemaname || '.' || tablename)) as data_size,
    pg_size_pretty(pg_indexes_size((schemaname || '.' || tablename)::regclass)) as index_size,
    (SELECT n_live_tup FROM pg_stat_user_tables t WHERE t.schemaname = pg_tables.schemaname AND t.relname = pg_tables.tablename) as row_count
FROM pg_tables
WHERE schemaname IN ('raw', 'master', 'system', 'outbound')
ORDER BY pg_total_relation_size(schemaname || '.' || tablename) DESC;
