import { Router } from 'express';
import { Pool } from 'pg';
import { config } from '../../config/index.js';

const router = Router();
const db = new Pool({ connectionString: config.database.url });

// GET /api/v1/jobs
router.get('/', async (req, res) => {
  try {
    const {
      customer_id,
      status,
      modified_after,
      limit = '100',
      offset = '0',
      sort = 'created_on',
      order = 'desc',
    } = req.query;

    const conditions: string[] = [];
    const values: any[] = [];
    let paramIndex = 1;

    if (customer_id) {
      conditions.push(`customer_id = $${paramIndex}`);
      values.push(customer_id);
      paramIndex++;
    }
    if (status) {
      conditions.push(`job_status = $${paramIndex}`);
      values.push(status);
      paramIndex++;
    }
    if (modified_after) {
      conditions.push(`modified_on >= $${paramIndex}`);
      values.push(modified_after);
      paramIndex++;
    }

    const whereClause = conditions.length > 0
      ? `WHERE ${conditions.join(' AND ')}`
      : '';

    const safeSort = String(sort).replace(/[^a-zA-Z0-9_]/g, '');
    const safeOrder = order === 'asc' ? 'ASC' : 'DESC';
    const safeLimit = Math.min(Number(limit) || 100, 1000);
    const safeOffset = Number(offset) || 0;

    const countResult = await db.query(
      `SELECT COUNT(*) as total FROM master.jobs ${whereClause}`,
      values
    );
    const total = parseInt(countResult.rows[0].total);

    const dataResult = await db.query(
      `SELECT * FROM master.jobs ${whereClause}
       ORDER BY ${safeSort} ${safeOrder}
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

// GET /api/v1/jobs/:id
router.get('/:id', async (req, res) => {
  try {
    const result = await db.query(
      'SELECT * FROM master.jobs WHERE st_id = $1',
      [req.params.id]
    );
    if (!result.rows[0]) {
      return res.status(404).json({ error: 'Job not found' });
    }
    res.json({ data: result.rows[0] });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
