import { Router } from 'express';
import { Pool } from 'pg';
import { config } from '../../config/index.js';

const router = Router();
const db = new Pool({ connectionString: config.database.url });

// GET /api/v1/audit - Recent changes
router.get('/', async (req, res) => {
  try {
    const { table, record_id, actor_type, limit = 50, offset = 0 } = req.query;

    let query = `
      SELECT timestamp, schema_name, table_name, operation, record_id,
             changed_fields, actor_type, actor_id, mutation_id, sync_batch_id
      FROM audit.log
      WHERE timestamp > NOW() - INTERVAL '7 days'
    `;
    const values: any[] = [];
    let paramIndex = 1;

    if (table) {
      query += ` AND (schema_name || '.' || table_name) = $${paramIndex}`;
      values.push(table);
      paramIndex++;
    }

    if (record_id) {
      query += ` AND record_id = $${paramIndex}`;
      values.push(record_id);
      paramIndex++;
    }

    if (actor_type) {
      query += ` AND actor_type = $${paramIndex}`;
      values.push(actor_type);
      paramIndex++;
    }

    query += ` ORDER BY timestamp DESC LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
    values.push(Math.min(Number(limit), 100), Number(offset));

    const result = await db.query(query, values);
    res.json({ data: result.rows });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/v1/audit/record/:table/:id - History for specific record
router.get('/record/:table/:id', async (req, res) => {
  try {
    const { table, id } = req.params;
    const [schema, tableName] = table.includes('.') ? table.split('.') : ['master', table];

    const result = await db.query(`
      SELECT timestamp, operation, changed_fields, old_data, new_data,
             actor_type, actor_id, mutation_id, sync_batch_id
      FROM audit.log
      WHERE schema_name = $1 AND table_name = $2 AND record_id = $3
      ORDER BY timestamp DESC
      LIMIT 100
    `, [schema, tableName, id]);

    res.json({ 
      data: result.rows,
      record: { schema, table: tableName, id },
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/v1/audit/summary - Daily summary
router.get('/summary', async (req, res) => {
  try {
    const result = await db.query(`SELECT * FROM audit.daily_summary`);
    res.json({ data: result.rows });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
