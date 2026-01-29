import { Router } from 'express';
import { Pool } from 'pg';
import { config } from '../../config/index.js';
import { QueryBuilder } from '../utils/query-builder.js';

const router = Router();
const db = new Pool({ connectionString: config.database.url });
const qb = new QueryBuilder(db);

// Customer Contacts
router.get('/customers/:customerId/contacts', async (req, res) => {
  try {
    const { customerId } = req.params;
    const result = await db.query(
      `SELECT * FROM master.customer_contacts WHERE customer_id = $1 ORDER BY id`,
      [customerId]
    );
    res.json({ data: result.rows });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Customer Notes
router.get('/customers/:customerId/notes', async (req, res) => {
  try {
    const { customerId } = req.params;
    const result = await db.query(
      `SELECT * FROM master.customer_notes WHERE customer_id = $1 ORDER BY created_on DESC`,
      [customerId]
    );
    res.json({ data: result.rows });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Job Notes
router.get('/jobs/:jobId/notes', async (req, res) => {
  try {
    const { jobId } = req.params;
    const result = await db.query(
      `SELECT * FROM master.job_notes WHERE job_id = $1 ORDER BY created_on DESC`,
      [jobId]
    );
    res.json({ data: result.rows });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Job History
router.get('/jobs/:jobId/history', async (req, res) => {
  try {
    const { jobId } = req.params;
    const result = await db.query(
      `SELECT * FROM master.job_history WHERE job_id = $1 ORDER BY created_on DESC`,
      [jobId]
    );
    res.json({ data: result.rows });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Location Equipment
router.get('/locations/:locationId/equipment', async (req, res) => {
  try {
    const { locationId } = req.params;
    const result = await db.query(
      `SELECT * FROM master.location_equipment WHERE location_id = $1 ORDER BY name`,
      [locationId]
    );
    res.json({ data: result.rows });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Single resource endpoints
router.get('/appointments/:id', async (req, res) => {
  try {
    const result = await qb.getById('master.appointments', req.params.id);
    if (!result) return res.status(404).json({ error: 'Appointment not found' });
    res.json({ data: result });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/estimates/:id', async (req, res) => {
  try {
    const result = await qb.getById('master.estimates', req.params.id);
    if (!result) return res.status(404).json({ error: 'Estimate not found' });
    res.json({ data: result });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/locations/:id', async (req, res) => {
  try {
    const result = await qb.getById('master.locations', req.params.id);
    if (!result) return res.status(404).json({ error: 'Location not found' });
    res.json({ data: result });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
