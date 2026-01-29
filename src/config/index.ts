import { z } from 'zod';
import { config as dotenvConfig } from 'dotenv';

// Load .env file
dotenvConfig();

/**
 * Environment variable schema matching the existing LAZI .env format
 */
const envSchema = z.object({
  // Server
  PORT: z.coerce.number().default(3001),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),

  // Supabase
  SUPABASE_URL: z.string().url(),
  SUPABASE_SERVICE_KEY: z.string().min(1),
  DATABASE_URL: z.string().min(1),

  // ServiceTitan - Support multiple variable name patterns
  TENANT_ID: z.string().optional(),
  ST_TENANT_ID: z.string().optional(),
  SERVICE_TITAN_TENANT_ID: z.string().optional(),
  
  SERVICE_TITAN_CLIENT_ID: z.string().min(1),
  SERVICE_TITAN_CLIENT_SECRET: z.string().min(1),
  SERVICE_TITAN_APP_KEY: z.string().min(1),
  SERVICE_TITAN_ENV: z.enum(['production', 'integration']).default('production'),

  // Redis (optional for now)
  REDIS_URL: z.string().default('redis://localhost:6379'),

  // Logging
  LOG_LEVEL: z.enum(['trace', 'debug', 'info', 'warn', 'error', 'fatal']).default('info'),
});

export type Env = z.infer<typeof envSchema>;

/**
 * Parse and validate environment variables
 */
function parseEnv(): Env {
  const result = envSchema.safeParse(process.env);

  if (!result.success) {
    console.error('❌ Environment validation failed:');
    for (const error of result.error.errors) {
      console.error(`   ${error.path.join('.')}: ${error.message}`);
    }
    process.exit(1);
  }

  return result.data;
}

const env = parseEnv();

// Resolve tenant ID from any of the possible env vars
const tenantId = env.SERVICE_TITAN_TENANT_ID || env.ST_TENANT_ID || env.TENANT_ID;
if (!tenantId) {
  console.error('❌ No tenant ID found. Set SERVICE_TITAN_TENANT_ID, ST_TENANT_ID, or TENANT_ID');
  process.exit(1);
}

/**
 * ServiceTitan API base URLs
 */
const stApiBaseUrl = env.SERVICE_TITAN_ENV === 'production'
  ? 'https://api.servicetitan.io'
  : 'https://api-integration.servicetitan.io';

const stAuthUrl = env.SERVICE_TITAN_ENV === 'production'
  ? 'https://auth.servicetitan.io/connect/token'
  : 'https://auth-integration.servicetitan.io/connect/token';

/**
 * Application configuration
 */
export const config = {
  env: env.NODE_ENV,
  isDev: env.NODE_ENV === 'development',
  isProd: env.NODE_ENV === 'production',
  isTest: env.NODE_ENV === 'test',

  server: {
    port: env.PORT,
  },

  supabase: {
    url: env.SUPABASE_URL,
    serviceKey: env.SUPABASE_SERVICE_KEY,
  },

  database: {
    url: env.DATABASE_URL,
  },

  serviceTitan: {
    tenantId,
    clientId: env.SERVICE_TITAN_CLIENT_ID,
    clientSecret: env.SERVICE_TITAN_CLIENT_SECRET,
    appKey: env.SERVICE_TITAN_APP_KEY,
    environment: env.SERVICE_TITAN_ENV,
    apiBaseUrl: stApiBaseUrl,
    authUrl: stAuthUrl,
  },

  redis: {
    url: env.REDIS_URL,
  },

  logging: {
    level: env.LOG_LEVEL,
  },
} as const;

export type Config = typeof config;
