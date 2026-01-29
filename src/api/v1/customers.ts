import { Router } from 'express';
import { Pool } from 'pg';
import { config } from '../../config/index.js';

const router = Router();
const db = new Pool({ connectionString: config.database.url });

// GET /api/v1/customers
router.get('/', async (req, res) => {
  try {
    const {
      modified_after,
      limit = '100',
      offset = '0',
      search,
      city,
      state,
      value_tier,
      engagement_status,
      has_open_estimates,
    } = req.query;

    const conditions: string[] = [];
    const values: any[] = [];
    let paramIndex = 1;

    if (modified_after) {
      conditions.push(`customer_modified >= $${paramIndex}`);
      values.push(modified_after);
      paramIndex++;
    }
    if (search) {
      conditions.push(
        `(full_name ILIKE $${paramIndex} OR primary_email ILIKE $${paramIndex} OR primary_phone ILIKE $${paramIndex})`
      );
      values.push(`%${search}%`);
      paramIndex++;
    }
    if (city) {
      conditions.push(`city ILIKE $${paramIndex}`);
      values.push(`%${city}%`);
      paramIndex++;
    }
    if (state) {
      conditions.push(`state = $${paramIndex}`);
      values.push(state);
      paramIndex++;
    }
    if (value_tier) {
      conditions.push(`value_tier = $${paramIndex}`);
      values.push(value_tier);
      paramIndex++;
    }
    if (engagement_status) {
      conditions.push(`engagement_status = $${paramIndex}`);
      values.push(engagement_status);
      paramIndex++;
    }
    if (has_open_estimates === 'true') {
      conditions.push('has_open_estimates = true');
    }

    const whereClause = conditions.length > 0
      ? `WHERE ${conditions.join(' AND ')}`
      : '';

    const safeLimit = Math.min(Number(limit) || 100, 1000);
    const safeOffset = Number(offset) || 0;

    const countResult = await db.query(
      `SELECT COUNT(*) as total FROM crm.customer_360 ${whereClause}`,
      values
    );
    const total = parseInt(countResult.rows[0].total);

    const dataResult = await db.query(
      `SELECT * FROM crm.customer_360 ${whereClause}
       ORDER BY customer_modified DESC
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

// GET /api/v1/customers/:id
router.get('/:id', async (req, res) => {
  try {
    const result = await db.query(
      'SELECT * FROM crm.customer_360 WHERE customer_id = $1',
      [req.params.id]
    );
    if (!result.rows[0]) {
      return res.status(404).json({ error: 'Customer not found' });
    }
    res.json({ data: result.rows[0] });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
