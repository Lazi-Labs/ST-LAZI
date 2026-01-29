import { Router } from 'express';
import { Pool } from 'pg';
import { config } from '../../config/index.js';

const router = Router();
const db = new Pool({ connectionString: config.database.url });

// GET /api/v1/estimates/open - Open estimates from crm.open_estimates view
router.get('/open', async (req, res) => {
  try {
    const { urgency, limit = '100' } = req.query;
    const safeLimit = Math.min(Number(limit) || 100, 500);

    const conditions: string[] = [];
    const values: any[] = [];
    let paramIndex = 1;

    if (urgency) {
      conditions.push(`urgency = $${paramIndex}`);
      values.push(urgency);
      paramIndex++;
    }

    const whereClause = conditions.length > 0
      ? `WHERE ${conditions.join(' AND ')}`
      : '';

    const result = await db.query(
      `SELECT * FROM crm.open_estimates ${whereClause}
       ORDER BY estimate_value DESC
       LIMIT $${paramIndex}`,
      [...values, safeLimit]
    );

    res.json({ data: result.rows, meta: { total: result.rows.length } });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/v1/estimates - List estimates from master.estimates
router.get('/', async (req, res) => {
  try {
    const {
      customer_id,
      job_id,
      status,
      modified_after,
      limit = '100',
      offset = '0',
    } = req.query;

    const conditions: string[] = ['active = true'];
    const values: any[] = [];
    let paramIndex = 1;

    if (customer_id) {
      conditions.push(`customer_id = $${paramIndex}`);
      values.push(customer_id);
      paramIndex++;
    }
    if (job_id) {
      conditions.push(`job_id = $${paramIndex}`);
      values.push(job_id);
      paramIndex++;
    }
    if (status) {
      conditions.push(`status->>'name' = $${paramIndex}`);
      values.push(status);
      paramIndex++;
    }
    if (modified_after) {
      conditions.push(`modified_on >= $${paramIndex}`);
      values.push(modified_after);
      paramIndex++;
    }

    const whereClause = `WHERE ${conditions.join(' AND ')}`;
    const safeLimit = Math.min(Number(limit) || 100, 1000);
    const safeOffset = Number(offset) || 0;

    const countResult = await db.query(
      `SELECT COUNT(*) as total FROM master.estimates ${whereClause}`,
      values
    );
    const total = parseInt(countResult.rows[0].total);

    const dataResult = await db.query(
      `SELECT * FROM master.estimates ${whereClause}
       ORDER BY modified_on DESC
       LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`,
      [...values, safeLimit, safeOffset]
    );

    res.json({
      data: dataResult.rows,
      meta: {
        total,
        limit: safeLimit,
        offset: safeOffset,
        has_more: safeOffset + dataResult.rows.length < total,
      },
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
