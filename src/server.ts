import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { config } from './config/index.js';
import { createLogger } from './utils/logger.js';
import healthRoutes from './api/health.js';
import pricebookRoutes from './api/v1/pricebook.js';
import customersRoutes from './api/v1/customers.js';
import jobsRoutes from './api/v1/jobs.js';
import mutationsRoutes from './api/v1/mutations.js';
import auditRoutes from './api/v1/audit.js';
import subResourceRoutes from './api/v1/sub-resources.js';
import estimatesRoutes from './api/v1/estimates.js';
import crmRoutes from './api/v1/crm.js';

const logger = createLogger({ module: 'server' });

const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Request logging
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    logger.info({
      method: req.method,
      path: req.path,
      status: res.statusCode,
      duration: Date.now() - start,
    });
  });
  next();
});

// Routes
app.use('/api', healthRoutes);
app.use('/api/v1/pricebook', pricebookRoutes);
app.use('/api/v1/customers', customersRoutes);
app.use('/api/v1/jobs', jobsRoutes);
app.use('/api/v1/estimates', estimatesRoutes);
app.use('/api/v1/mutations', mutationsRoutes);
app.use('/api/v1/audit', auditRoutes);
app.use('/api/v1', subResourceRoutes);
app.use('/api/v1/crm', crmRoutes);

// Error handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  logger.error({ error: err.message, stack: err.stack }, 'Unhandled error');
  res.status(500).json({ error: 'Internal server error' });
});

const PORT = config.server?.port || 3001;

app.listen(PORT, () => {
  logger.info({ port: PORT }, 'ST-Ingestion API server started');
});

export default app;
