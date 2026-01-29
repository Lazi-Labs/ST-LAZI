import { Router } from 'express';
import { Pool } from 'pg';
import crypto from 'crypto';
import { config } from '../../config/index.js';
import { createLogger } from '../../utils/logger.js';

const router = Router();
const db = new Pool({ connectionString: config.database.url });
const logger = createLogger({ module: 'mutations-api' });

interface CreateMutationBody {
  entity_type: string;
  entity_id: number;
  operation: 'create' | 'update' | 'delete';
  payload: Record<string, any>;
  initiated_by?: string;
}

// POST /api/v1/mutations - Create a new mutation
router.post('/', async (req, res) => {
  try {
    const { entity_type, entity_id, operation, payload, initiated_by } = req.body as CreateMutationBody;

    // Validate required fields
    if (!entity_type || !entity_id || !operation || !payload) {
      return res.status(400).json({ 
        error: 'Missing required fields: entity_type, entity_id, operation, payload' 
      });
    }

    // Generate idempotency key
    const idempotencyKey = crypto.createHash('sha256')
      .update(`${operation}:${entity_type}:${entity_id}:${JSON.stringify(payload)}:${initiated_by || 'api'}`)
      .digest('hex');

    // Insert mutation directly with idempotency handling
    const result = await db.query(
      `INSERT INTO outbound.mutations (entity_type, entity_id, operation, payload, initiated_by, idempotency_key)
       VALUES ($1, $2, $3, $4::jsonb, $5, $6)
       ON CONFLICT (idempotency_key) WHERE idempotency_key IS NOT NULL
       DO UPDATE SET id = outbound.mutations.id
       RETURNING *`,
      [entity_type, entity_id, operation, JSON.stringify(payload), initiated_by || 'api', idempotencyKey]
    );

    const mutation = { rows: result.rows };

    logger.info({ mutationId: mutation.rows[0]?.id, entity_type, entity_id, operation }, 'Mutation created');

    res.status(201).json({
      data: mutation.rows[0],
      message: 'Mutation queued successfully',
    });
  } catch (error: any) {
    logger.error({ error: error.message }, 'Failed to create mutation');
    res.status(500).json({ error: error.message });
  }
});

// GET /api/v1/mutations/:id - Get mutation status
router.get('/:id', async (req, res) => {
  try {
    const result = await db.query(
      `SELECT * FROM outbound.mutations WHERE id = $1`,
      [req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Mutation not found' });
    }

    res.json({ data: result.rows[0] });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/v1/mutations - List mutations with filters
router.get('/', async (req, res) => {
  try {
    const { status, entity_type, limit = 50, offset = 0 } = req.query;

    let query = `SELECT * FROM outbound.mutations WHERE 1=1`;
    const values: any[] = [];
    let paramIndex = 1;

    if (status) {
      query += ` AND status = $${paramIndex}`;
      values.push(status);
      paramIndex++;
    }

    if (entity_type) {
      query += ` AND entity_type = $${paramIndex}`;
      values.push(entity_type);
      paramIndex++;
    }

    query += ` ORDER BY initiated_at DESC LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
    values.push(Math.min(Number(limit), 100), Number(offset));

    const result = await db.query(query, values);

    // Get total count
    let countQuery = `SELECT COUNT(*) FROM outbound.mutations WHERE 1=1`;
    const countValues: any[] = [];
    let countParamIndex = 1;
    
    if (status) {
      countQuery += ` AND status = $${countParamIndex}`;
      countValues.push(status);
      countParamIndex++;
    }
    if (entity_type) {
      countQuery += ` AND entity_type = $${countParamIndex}`;
      countValues.push(entity_type);
      countParamIndex++;
    }
    
    const countResult = await db.query(countQuery, countValues);

    res.json({
      data: result.rows,
      meta: {
        total: parseInt(countResult.rows[0].count),
        limit: Math.min(Number(limit), 100),
        offset: Number(offset),
      },
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
