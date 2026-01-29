import { Router } from 'express';
import { Pool } from 'pg';
import { config } from '../../config/index.js';
import { QueryBuilder, ListParams } from '../utils/query-builder.js';

const router = Router();
const db = new Pool({ connectionString: config.database.url });
const qb = new QueryBuilder(db);

// GET /api/v1/pricebook/services
router.get('/services', async (req, res) => {
  try {
    const result = await qb.list('master.pricebook_services', req.query as ListParams, {
      searchFields: ['display_name', 'code', 'description'],
      filterFields: ['business_unit_id'],
      defaultSort: 'display_name',
      activeColumn: 'active',
    });
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/v1/pricebook/services/:id
router.get('/services/:id', async (req, res) => {
  try {
    const service = await qb.getByStId('master.pricebook_services', req.params.id);
    if (!service) {
      return res.status(404).json({ error: 'Service not found' });
    }
    res.json({ data: service });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/v1/pricebook/materials
router.get('/materials', async (req, res) => {
  try {
    const result = await qb.list('master.pricebook_materials', req.query as ListParams, {
      searchFields: ['display_name', 'code', 'description'],
      filterFields: ['vendor_id'],
      defaultSort: 'display_name',
      activeColumn: 'active',
    });
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/v1/pricebook/materials/:id
router.get('/materials/:id', async (req, res) => {
  try {
    const material = await qb.getByStId('master.pricebook_materials', req.params.id);
    if (!material) {
      return res.status(404).json({ error: 'Material not found' });
    }
    res.json({ data: material });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/v1/pricebook/equipment
router.get('/equipment', async (req, res) => {
  try {
    const result = await qb.list('master.pricebook_equipment', req.query as ListParams, {
      searchFields: ['display_name', 'code', 'description'],
      filterFields: [],
      defaultSort: 'display_name',
      activeColumn: 'active',
    });
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/v1/pricebook/equipment/:id
router.get('/equipment/:id', async (req, res) => {
  try {
    const equipment = await qb.getByStId('master.pricebook_equipment', req.params.id);
    if (!equipment) {
      return res.status(404).json({ error: 'Equipment not found' });
    }
    res.json({ data: equipment });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/v1/pricebook/categories
router.get('/categories', async (req, res) => {
  try {
    const result = await qb.list('master.pricebook_categories', req.query as ListParams, {
      searchFields: ['st_id'],
      defaultSort: 'st_id',
      activeColumn: 'active',
    });
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/v1/pricebook/categories/:id
router.get('/categories/:id', async (req, res) => {
  try {
    const category = await qb.getByStId('master.pricebook_categories', req.params.id);
    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }
    res.json({ data: category });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
