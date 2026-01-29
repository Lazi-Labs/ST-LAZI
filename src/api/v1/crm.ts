import { Router } from 'express';
import { Pool } from 'pg';
import { config } from '../../config/index.js';

const router = Router();
const db = new Pool({ connectionString: config.database.url });

// GET /api/v1/crm/customers - List customers with filtering
router.get('/customers', async (req, res) => {
  try {
    const {
      limit = '100',
      offset = '0',
      has_open_estimates,
      value_tier,
      engagement_status,
      city,
      state,
      search,
      sort = 'customer_modified',
      order = 'desc',
    } = req.query;

    const conditions: string[] = [];
    const values: any[] = [];
    let paramIndex = 1;

    if (has_open_estimates === 'true') {
      conditions.push('has_open_estimates = true');
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
    if (search) {
      conditions.push(
        `(full_name ILIKE $${paramIndex} OR primary_email ILIKE $${paramIndex} OR primary_phone ILIKE $${paramIndex})`
      );
      values.push(`%${search}%`);
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
      `SELECT COUNT(*) as total FROM crm.customer_360 ${whereClause}`,
      values
    );
    const total = parseInt(countResult.rows[0].total);

    const dataResult = await db.query(
      `SELECT * FROM crm.customer_360 ${whereClause}
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

// GET /api/v1/crm/customers/:id - Single customer
router.get('/customers/:id', async (req, res) => {
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

// GET /api/v1/crm/open-estimates - Open estimates for follow-up
router.get('/open-estimates', async (req, res) => {
  try {
    const { urgency, limit = '50' } = req.query;
    const safeLimit = Math.min(Number(limit) || 50, 500);

    let query = 'SELECT * FROM crm.open_estimates';
    const values: any[] = [];

    if (urgency) {
      query += ' WHERE urgency = $1';
      values.push(urgency);
    }

    query += ` ORDER BY estimate_value DESC LIMIT $${values.length + 1}`;
    values.push(safeLimit);

    const result = await db.query(query, values);
    res.json({ data: result.rows, meta: { total: result.rows.length } });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/v1/crm/contacts - Flat contact list
router.get('/contacts', async (req, res) => {
  try {
    const { customer_id, type, limit = '100', offset = '0' } = req.query;
    const conditions: string[] = [];
    const values: any[] = [];
    let paramIndex = 1;

    if (customer_id) {
      conditions.push(`customer_id = $${paramIndex}`);
      values.push(customer_id);
      paramIndex++;
    }
    if (type) {
      conditions.push(`type = $${paramIndex}`);
      values.push(type);
      paramIndex++;
    }

    const whereClause = conditions.length > 0
      ? `WHERE ${conditions.join(' AND ')}`
      : '';

    const safeLimit = Math.min(Number(limit) || 100, 1000);
    const safeOffset = Number(offset) || 0;

    const result = await db.query(
      `SELECT * FROM crm.contacts ${whereClause}
       ORDER BY customer_id, type
       LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`,
      [...values, safeLimit, safeOffset]
    );

    res.json({ data: result.rows, meta: { total: result.rows.length } });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/v1/crm/refresh - Refresh materialized view
router.post('/refresh', async (req, res) => {
  try {
    await db.query('REFRESH MATERIALIZED VIEW CONCURRENTLY crm.customer_360');
    res.json({ success: true, message: 'CRM views refreshed', refreshed_at: new Date().toISOString() });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/v1/crm/stats - Summary statistics
router.get('/stats', async (req, res) => {
  try {
    const result = await db.query(`
      SELECT
        COUNT(*) as total_customers,
        COUNT(*) FILTER (WHERE has_open_estimates = true) as with_open_estimates,
        COUNT(*) FILTER (WHERE engagement_status = 'active') as active,
        COUNT(*) FILTER (WHERE engagement_status = 'recent') as recent,
        COUNT(*) FILTER (WHERE engagement_status = 'dormant') as dormant,
        COUNT(*) FILTER (WHERE engagement_status = 'inactive') as inactive,
        COUNT(*) FILTER (WHERE engagement_status = 'new') as new_customers,
        COUNT(*) FILTER (WHERE value_tier = 'high') as high_value,
        COUNT(*) FILTER (WHERE value_tier = 'medium') as medium_value,
        COUNT(*) FILTER (WHERE value_tier = 'low') as low_value,
        COALESCE(SUM(open_value), 0)::numeric(12,2) as total_open_pipeline,
        COALESCE(SUM(sold_value), 0)::numeric(12,2) as total_sold_value,
        MAX(view_refreshed_at) as last_refresh
      FROM crm.customer_360
    `);
    res.json({ data: result.rows[0] });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
