import { Router } from 'express';
import { Pool } from 'pg';
import { config } from '../config/index.js';

const router = Router();
const db = new Pool({ connectionString: config.database.url });

interface HealthCheck {
  check_name: string;
  status: 'healthy' | 'degraded' | 'critical' | 'info';
  last_value: string;
  description: string;
}

router.get('/health', async (req, res) => {
  try {
    const result = await db.query<HealthCheck>('SELECT * FROM system.health_status');
    const checks = result.rows;

    const overall = checks.some(c => c.status === 'critical') ? 'critical'
      : checks.some(c => c.status === 'degraded') ? 'degraded'
      : 'healthy';

    const statusCode = overall === 'critical' ? 503 : overall === 'degraded' ? 200 : 200;

    res.status(statusCode).json({
      status: overall,
      timestamp: new Date().toISOString(),
      version: process.env.npm_package_version || '1.0.0',
      checks: checks.filter(c => c.status !== 'info'),
      info: checks.filter(c => c.status === 'info'),
    });
  } catch (error: any) {
    res.status(503).json({
      status: 'critical',
      timestamp: new Date().toISOString(),
      error: error.message,
    });
  }
});

router.get('/health/sync', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM system.sync_status_by_endpoint');
    res.json({
      timestamp: new Date().toISOString(),
      endpoints: result.rows,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/health/tables', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM system.table_sizes LIMIT 50');
    res.json({
      timestamp: new Date().toISOString(),
      tables: result.rows,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
