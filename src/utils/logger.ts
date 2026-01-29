import pino from 'pino';
import { config } from '../config/index.js';

/**
 * Application logger using Pino
 * Structured JSON logging in production, pretty printing in development
 */
export const logger = pino({
  level: config.logging.level,
  transport: config.isDev
    ? {
        target: 'pino-pretty',
        options: {
          colorize: true,
          translateTime: 'SYS:standard',
          ignore: 'pid,hostname',
        },
      }
    : undefined,
  base: {
    service: 'lazi-st-ingestion',
    env: config.env,
  },
  formatters: {
    level: (label) => ({ level: label }),
  },
});

/**
 * Create a child logger with additional context
 */
export function createLogger(context: Record<string, unknown>) {
  return logger.child(context);
}

/**
 * Log and throw an error (useful for error handling)
 */
export function logError(error: Error, context?: Record<string, unknown>): never {
  logger.error({ err: error, ...context }, error.message);
  throw error;
}
