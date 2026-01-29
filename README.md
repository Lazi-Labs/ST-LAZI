# ST-LAZI: ServiceTitan Data Ingestion Service

A comprehensive data ingestion and synchronization service that bridges ServiceTitan (field service management platform) with the LAZI platform. This service provides bidirectional data flow: pulling data from ServiceTitan into PostgreSQL and pushing mutations back to ServiceTitan.

---

## Table of Contents

1. [Overview](#overview)
2. [Architecture](#architecture)
3. [Core Components](#core-components)
4. [Data Flow](#data-flow)
5. [Database Schema](#database-schema)
6. [API Reference](#api-reference)
7. [Workers](#workers)
8. [Discovery System](#discovery-system)
9. [Configuration](#configuration)
10. [Deployment](#deployment)
11. [Development](#development)
12. [Commands Reference](#commands-reference)

---

## Overview

**ST-LAZI** is a TypeScript/Node.js service that:

- **Syncs 60+ ServiceTitan entities** (pricebook, customers, jobs, invoices, etc.) to PostgreSQL
- **Provides a REST API** for internal services to access synchronized data
- **Handles outbound mutations** to push changes back to ServiceTitan
- **Maintains audit trails** for all data changes
- **Supports priority-based scheduling** for different sync frequencies

### Key Features

- **Bidirectional sync**: Pull from ST, push mutations back
- **Immutable raw storage**: Original ST data preserved in JSONB
- **Typed master tables**: Extracted, cleaned data with proper types
- **CRM 360 views**: Materialized views for customer analytics
- **Conflict detection**: Prevents overwrites of concurrent ST changes
- **Rate limiting**: Respects ST API limits (100 req/min)
- **Schema discovery**: Auto-generates migrations from ST API responses

---

## Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              ST-LAZI SERVICE                                │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌──────────────┐     ┌──────────────┐     ┌──────────────┐                │
│  │  Scheduled   │     │   Express    │     │   Outbound   │                │
│  │ Sync Worker  │     │   API Server │     │    Worker    │                │
│  │              │     │   (Port 3001)│     │              │                │
│  └──────┬───────┘     └──────┬───────┘     └──────┬───────┘                │
│         │                    │                    │                         │
│         ▼                    ▼                    ▼                         │
│  ┌──────────────────────────────────────────────────────────────────┐      │
│  │                      PostgreSQL (Supabase)                        │      │
│  │  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐ │      │
│  │  │  raw.*  │  │ master.*│  │  crm.*  │  │outbound.│  │ audit.* │ │      │
│  │  │ (JSONB) │─▶│ (typed) │─▶│ (views) │  │mutations│  │  (log)  │ │      │
│  │  └─────────┘  └─────────┘  └─────────┘  └─────────┘  └─────────┘ │      │
│  └──────────────────────────────────────────────────────────────────┘      │
│         ▲                                         │                         │
└─────────┼─────────────────────────────────────────┼─────────────────────────┘
          │                                         │
          │ Pull (OAuth 2.0)                        │ Push (OAuth 2.0)
          ▼                                         ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                         SERVICETITAN API                                    │
│  https://api.servicetitan.io/{module}/v2/tenant/{tenantId}/{resource}       │
│                                                                             │
│  Modules: pricebook, crm, jpm, accounting, settings, dispatch,              │
│           inventory, marketing, payroll, forms, telecom, etc.               │
└─────────────────────────────────────────────────────────────────────────────┘
          │
          ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                           CONSUMERS                                         │
│  ┌─────────────┐     ┌─────────────┐     ┌─────────────┐                   │
│  │  lazi-core  │     │     n8n     │     │  Reporting  │                   │
│  │  (Main App) │     │ Automations │     │  Dashboard  │                   │
│  └─────────────┘     └─────────────┘     └─────────────┘                   │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Core Components

### 1. ServiceTitan Client (`src/servicetitan/`)

Handles all communication with ServiceTitan API:

| File | Purpose |
|------|---------|
| `auth.ts` | OAuth 2.0 client credentials flow, token caching with 60s buffer |
| `client.ts` | Axios-based HTTP client with rate limiting, retry logic, pagination |

**Key Features:**
- **Rate limiting**: 100 requests/minute with automatic throttling
- **Token refresh**: Automatic retry on 401 with fresh token
- **Pagination**: `fetchAllPages()` handles ST's page-based responses
- **Error handling**: Structured logging for all API errors

### 2. Configuration (`src/config/`)

Zod-validated environment configuration:

```typescript
// Key configuration sections:
config.serviceTitan  // ST credentials, API URLs
config.database      // PostgreSQL connection
config.redis         // Redis for queues (optional)
config.server        // Express server settings
```

### 3. API Server (`src/api/`)

Express.js REST API with versioned endpoints:

| Route Module | Base Path | Purpose |
|--------------|-----------|---------|
| `health.ts` | `/api/health` | Health checks, sync status, table sizes |
| `pricebook.ts` | `/api/v1/pricebook` | Services, materials, equipment, categories |
| `customers.ts` | `/api/v1/customers` | Customer records with filtering |
| `jobs.ts` | `/api/v1/jobs` | Job records |
| `estimates.ts` | `/api/v1/estimates` | Estimate records |
| `crm.ts` | `/api/v1/crm` | CRM 360 views, contacts, open estimates, stats |
| `mutations.ts` | `/api/v1/mutations` | Queue mutations for outbound sync |
| `audit.ts` | `/api/v1/audit` | Audit log queries |
| `sub-resources.ts` | `/api/v1/` | Sub-resource endpoints |

### 4. Utilities (`src/utils/`)

| File | Purpose |
|------|---------|
| `logger.ts` | Pino-based structured logging |
| `audit-context.ts` | Sets PostgreSQL session variables for audit tracking |

---

## Data Flow

### Inbound Sync (ST → PostgreSQL)

```
1. Scheduled Sync Worker triggers based on priority schedule
2. BaseSyncWorker.sync() orchestrates the process:
   a. Create sync batch record
   b. Fetch all pages from ST API
   c. Insert raw JSONB to raw.st_* table
   d. Transform to typed master.* table
   e. Complete batch with statistics
3. Sub-resource syncs run after parent entities (e.g., contacts after customers)
4. CRM materialized views refreshed
```

### Outbound Mutations (PostgreSQL → ST)

```
1. Client POSTs to /api/v1/mutations with entity_type, operation, payload
2. Mutation inserted to outbound.mutations with idempotency key
3. Outbound Worker polls for pending mutations every 5 seconds
4. For each mutation:
   a. Check for conflicts (payload hash comparison)
   b. Send to appropriate ST endpoint (CRUD or special operation)
   c. Mark completed/failed with retry logic
   d. Trigger resync of affected entity type
```

### Supported Operations

**Standard CRUD:**
- `create`, `update`, `delete` for pricebook, customers, jobs, etc.

**Special Operations:**
- `appointments:reschedule`, `appointments:cancel`, `appointments:assign`
- `jobs:cancel`, `jobs:complete`, `jobs:add-note`
- `estimates:approve`, `estimates:decline`, `estimates:convert-to-invoice`
- `customers:add-contact`, `customers:add-note`

---

## Database Schema

### Schema Hierarchy

| Schema | Purpose | Access Pattern |
|--------|---------|----------------|
| `raw.*` | Immutable ST data mirror | Sync worker INSERT only |
| `master.*` | Typed, cleaned data | Sync worker UPSERT, API read |
| `crm.*` | Business logic views | Materialized views, API read |
| `outbound.*` | Mutation queue | API insert, Worker process |
| `audit.*` | Change tracking | Trigger-populated, API read |
| `system.*` | Sync state, health | Workers read/write |

### Raw Tables (Immutable)

```sql
-- Example: raw.st_pricebook_services
CREATE TABLE raw.st_pricebook_services (
  id SERIAL PRIMARY KEY,
  payload JSONB NOT NULL,           -- Full ST API response
  sync_batch_id UUID NOT NULL,      -- Links to sync batch
  synced_at TIMESTAMPTZ DEFAULT NOW()
);
```

**Key principle**: Raw tables are append-only. Each sync creates new records, preserving complete history.

### Master Tables (Typed)

```sql
-- Example: master.pricebook_services
CREATE TABLE master.pricebook_services (
  id SERIAL PRIMARY KEY,
  st_id BIGINT UNIQUE NOT NULL,     -- ServiceTitan ID
  display_name TEXT,
  code TEXT,
  description TEXT,
  price NUMERIC(12,2),
  cost NUMERIC(12,2),
  active BOOLEAN DEFAULT true,
  business_unit_id BIGINT,
  -- ... extracted fields
  created_at TIMESTAMPTZ,
  modified_at TIMESTAMPTZ,
  synced_at TIMESTAMPTZ DEFAULT NOW()
);
```

### CRM Views

```sql
-- crm.customer_360: Aggregated customer view
-- Includes: customer data, job counts, estimate values, engagement status, value tier

-- crm.open_estimates: Estimates pending follow-up
-- crm.contacts: Flat contact list across customers
```

### Outbound Mutations

```sql
CREATE TABLE outbound.mutations (
  id UUID PRIMARY KEY,
  entity_type TEXT NOT NULL,        -- e.g., 'pricebook_services'
  entity_id TEXT NOT NULL,          -- ST entity ID
  operation TEXT NOT NULL,          -- 'create', 'update', 'delete', or special
  payload JSONB NOT NULL,
  status TEXT DEFAULT 'pending',    -- pending, processing, completed, failed, conflict
  retry_count INT DEFAULT 0,
  idempotency_key TEXT UNIQUE,
  based_on_payload_hash TEXT,       -- For conflict detection
  initiated_by TEXT,
  initiated_at TIMESTAMPTZ DEFAULT NOW(),
  processed_at TIMESTAMPTZ,
  st_response JSONB,
  error_message TEXT
);
```

---

## API Reference

### Health & Monitoring

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/health` | GET | Overall health status with checks |
| `/api/health/sync` | GET | Sync status by endpoint |
| `/api/health/tables` | GET | Table sizes and row counts |

### Pricebook

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/v1/pricebook/services` | GET | List services (search, filter, paginate) |
| `/api/v1/pricebook/services/:id` | GET | Get service by ST ID |
| `/api/v1/pricebook/materials` | GET | List materials |
| `/api/v1/pricebook/materials/:id` | GET | Get material by ST ID |
| `/api/v1/pricebook/equipment` | GET | List equipment |
| `/api/v1/pricebook/equipment/:id` | GET | Get equipment by ST ID |
| `/api/v1/pricebook/categories` | GET | List categories |
| `/api/v1/pricebook/categories/:id` | GET | Get category by ST ID |

**Query Parameters:**
- `search` - Full-text search on name, code, description
- `active` - Filter by active status
- `limit`, `offset` - Pagination
- `sort`, `order` - Sorting

### Customers

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/v1/customers` | GET | List customers with CRM 360 data |
| `/api/v1/customers/:id` | GET | Get customer by ID |

**Query Parameters:**
- `search` - Search name, email, phone
- `city`, `state` - Location filters
- `value_tier` - high, medium, low
- `engagement_status` - active, recent, dormant, inactive, new
- `has_open_estimates` - Boolean filter

### CRM

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/v1/crm/customers` | GET | Customer 360 view with sorting |
| `/api/v1/crm/customers/:id` | GET | Single customer detail |
| `/api/v1/crm/open-estimates` | GET | Estimates needing follow-up |
| `/api/v1/crm/contacts` | GET | Flat contact list |
| `/api/v1/crm/stats` | GET | Summary statistics |
| `/api/v1/crm/refresh` | POST | Refresh materialized views |

### Mutations

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/v1/mutations` | POST | Queue a new mutation |
| `/api/v1/mutations` | GET | List mutations with filters |
| `/api/v1/mutations/:id` | GET | Get mutation status |

**POST Body:**
```json
{
  "entity_type": "pricebook_services",
  "entity_id": 12345,
  "operation": "update",
  "payload": { "price": 199.99 },
  "initiated_by": "user@example.com"
}
```

### Audit

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/v1/audit` | GET | Recent audit log entries |
| `/api/v1/audit/record/:table/:id` | GET | History for specific record |
| `/api/v1/audit/summary` | GET | Daily change summary |

---

## Workers

### Scheduled Sync Worker

**Location:** `src/workers/sync/scheduled-sync.ts`

Runs continuous sync jobs on priority-based schedules:

| Priority | Interval | Entities |
|----------|----------|----------|
| Priority 1 | 5 min | Pricebook (services, materials, equipment, categories), Customers, Jobs, Appointments |
| Priority 2 | 15 min | Estimates, Invoices, Payments, Employees, Technicians, Business Units, Teams |
| Priority 3 | 1 hour | Inventory, Marketing, Forms, Installed Equipment + Sub-resources (contacts, notes) |
| Priority 4 | 6 hours | Reference data (job types, payment terms, tax zones, etc.) |

**Features:**
- Staggered initial delays to prevent thundering herd
- Graceful shutdown with job completion
- Automatic sub-resource sync after parent entities
- CRM view refresh after customer syncs

### Base Sync Worker

**Location:** `src/workers/sync/base-sync-worker.ts`

Abstract base class for all entity sync workers:

```typescript
abstract class BaseSyncWorker {
  abstract readonly endpointName: string;
  abstract readonly stEndpointPath: string;
  abstract readonly rawTable: string;
  abstract readonly masterTable: string;
  
  async sync(options: SyncOptions): Promise<SyncResult>;
  protected async fetchFromST(options): Promise<any[]>;
  protected async upsertToRaw(records, batchId): Promise<{inserted, updated}>;
  protected abstract transformToMaster(batchId): Promise<{inserted, updated}>;
}
```

### Entity Sync Workers

**Location:** `src/workers/sync/entities/`

62 auto-generated entity-specific workers, including:
- `pricebook_services-sync.ts`
- `customers-sync.ts`
- `jobs-sync.ts`
- `invoices-sync.ts`
- `employees-sync.ts`
- ... and 57 more

### Sub-Resource Sync Workers

**Location:** `src/workers/sync/sub-resources/`

| Worker | Purpose |
|--------|---------|
| `customer-contacts-sync.ts` | Syncs contacts for recently synced customers |
| `job-notes-sync.ts` | Syncs notes for recently synced jobs |

### Outbound Worker

**Location:** `src/workers/outbound/outbound-worker.ts`

Processes pending mutations and sends to ServiceTitan:

- Polls every 5 seconds for pending mutations
- Conflict detection via payload hash comparison
- Exponential backoff retry (2^n minutes, max 3 retries)
- Supports both CRUD and special operations
- Triggers resync after successful mutations

---

## Discovery System

**Location:** `discovery/`

Auto-generates database schema from ServiceTitan API responses.

### Components

| File | Purpose |
|------|---------|
| `endpoints.ts` | Defines 90+ ST API endpoints across 18 modules |
| `fetcher.ts` | Fetches sample data from ST API |
| `analyzer.ts` | Analyzes JSON structure, infers types |
| `run-discovery.ts` | Orchestrates full discovery process |
| `generators/` | Generates SQL migrations and TypeScript types |

### Endpoint Priorities

| Priority | Description | Count |
|----------|-------------|-------|
| 1 | Critical (pricebook, customers, jobs) | ~10 |
| 2 | Important (invoices, employees, estimates) | ~15 |
| 3 | Secondary (inventory, marketing, forms) | ~30 |
| 4 | Reference (lookup tables, settings) | ~35 |

### Usage

```bash
# Full discovery (priority 1-2)
npm run discovery

# Only critical endpoints
npm run discovery -- --priority 1

# Include more endpoints
npm run discovery -- --priority 3

# Single module
npm run discovery -- --module pricebook

# Dry run (show what would be fetched)
npm run discovery -- --dry-run
```

### Output

```
discovery/output/
├── samples/           # Raw API responses (*.json)
├── analysis/          # Field analysis (*.json)
├── migrations/        # Generated SQL
│   ├── 004_raw_tables.sql
│   └── 005_master_tables.sql
└── types/             # TypeScript definitions
    └── servicetitan.types.ts
```

---

## Configuration

### Environment Variables

```bash
# Server
PORT=3001
NODE_ENV=development|production|test

# Supabase/PostgreSQL
SUPABASE_URL=https://xxx.supabase.co
SUPABASE_SERVICE_KEY=eyJ...
DATABASE_URL=postgresql://postgres:password@host:5432/postgres

# ServiceTitan
SERVICE_TITAN_CLIENT_ID=xxx
SERVICE_TITAN_CLIENT_SECRET=xxx
SERVICE_TITAN_APP_KEY=xxx
SERVICE_TITAN_TENANT_ID=3222348440
SERVICE_TITAN_ENV=production|integration

# Redis (optional)
REDIS_URL=redis://localhost:6379

# Logging
LOG_LEVEL=trace|debug|info|warn|error|fatal
```

### ServiceTitan API URLs

| Environment | API Base | Auth URL |
|-------------|----------|----------|
| Production | `https://api.servicetitan.io` | `https://auth.servicetitan.io/connect/token` |
| Integration | `https://api-integration.servicetitan.io` | `https://auth-integration.servicetitan.io/connect/token` |

---

## Deployment

### Docker Compose (Development)

```bash
docker-compose up -d
```

Services:
- `lazi-st-api` - API server on port 3005
- `lazi-st-sync` - Scheduled sync worker
- `lazi-st-outbound` - Outbound mutation worker

### Docker Compose (Production)

```bash
docker-compose -f docker-compose.prod.yml up -d
```

Services:
- `lazi-st-ingestion` - API server with Traefik labels
- `lazi-st-ingestion-sync` - Sync worker (2 CPU, 1GB RAM)
- `lazi-st-ingestion-outbound` - Outbound worker (0.5 CPU, 256MB RAM)
- `lazi-st-ingestion-redis` - Redis for queues

**Production Features:**
- Traefik integration with Let's Encrypt TLS
- Health checks with auto-restart
- Resource limits and reservations
- External network connectivity

### Dockerfile

```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
CMD ["npm", "run", "start"]
```

---

## Development

### Prerequisites

- Node.js 18+
- PostgreSQL (via Supabase or local)
- ServiceTitan API credentials

### Setup

```bash
# Install dependencies
npm install

# Configure environment
cp .env.example .env
# Edit .env with your credentials

# Run schema discovery (first time)
npm run discovery

# Apply migrations
npm run migrate

# Start development server
npm run dev
```

### Testing

```bash
# Run all tests
npm test

# Watch mode
npm run test:watch

# Coverage report
npm run test:coverage

# Unit tests only
npm run test:unit

# Integration tests only
npm run test:integration
```

### Code Quality

```bash
# Lint
npm run lint
npm run lint:fix

# Type check
npm run typecheck
```

---

## Commands Reference

| Command | Description |
|---------|-------------|
| **Server** | |
| `npm run dev` | Start with hot reload (tsx watch) |
| `npm run build` | Compile TypeScript |
| `npm start` | Start production server |
| **Discovery** | |
| `npm run discovery` | Full schema discovery |
| `npm run discovery:fetch` | Only fetch ST samples |
| `npm run discovery:analyze` | Only analyze samples |
| `npm run discovery:generate` | Only generate artifacts |
| **Database** | |
| `npm run migrate` | Run migrations |
| `npm run migrate:rollback` | Rollback last migration |
| `npm run db:generate-types` | Generate DB types |
| **Sync** | |
| `npm run sync` | Run one-time sync |
| `npm run sync:bulk` | Bulk sync all entities |
| `npm run sync:scheduled` | Start scheduled sync service |
| `npm run worker:sync` | Run sync worker |
| **Outbound** | |
| `npm run outbound` | Start outbound worker |
| `npm run outbound:dev` | Outbound worker with watch |
| **Workers** | |
| `npm run generate:workers` | Generate sync worker files |
| **Testing** | |
| `npm test` | Run tests |
| `npm run test:watch` | Watch mode |
| `npm run test:coverage` | Coverage report |
| `npm run test:ui` | Vitest UI |
| **Quality** | |
| `npm run lint` | ESLint check |
| `npm run lint:fix` | ESLint auto-fix |
| `npm run typecheck` | TypeScript check |

---

## Tech Stack

| Category | Technology |
|----------|------------|
| Runtime | Node.js 20 |
| Language | TypeScript 5.2 |
| Framework | Express 4.18 |
| Database | PostgreSQL (Supabase) |
| Queue | BullMQ + Redis |
| HTTP Client | Axios |
| Validation | Zod |
| Logging | Pino |
| Testing | Vitest |
| Containerization | Docker |

---

## ServiceTitan API Coverage

### Modules Supported (18)

| Module | Entities | Priority Range |
|--------|----------|----------------|
| pricebook | 7 | 1-3 |
| crm | 2 | 1-2 |
| jpm | 10 | 1-4 |
| sales | 2 | 2 |
| accounting | 14 | 2-4 |
| settings | 5 | 2-4 |
| dispatch | 9 | 2-4 |
| inventory | 11 | 3-4 |
| marketing | 6 | 3-4 |
| marketingads | 6 | 4 |
| payroll | 8 | 4 |
| equipmentsystems | 1 | 3 |
| forms | 2 | 3 |
| telecom | 2 | 3-4 |
| timesheets | 3 | 4 |
| taskmanagement | 1 | 4 |
| reporting | 1 | 4 |
| jbce | 1 | 4 |

**Total: 90+ endpoints defined, 62 sync workers implemented**
