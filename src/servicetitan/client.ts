import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { config } from '../config/index.js';
import { createLogger } from '../utils/logger.js';
import { getAccessToken, clearTokenCache } from './auth.js';

const logger = createLogger({ module: 'st-client' });

/**
 * Rate limiter state
 */
interface RateLimitState {
  requestsThisMinute: number;
  minuteStart: number;
}

const RATE_LIMIT = 100; // requests per minute

let rateLimitState: RateLimitState = {
  requestsThisMinute: 0,
  minuteStart: Date.now(),
};

/**
 * Sleep utility
 */
function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Check rate limit and wait if necessary
 */
async function checkRateLimit(): Promise<void> {
  const now = Date.now();

  // Reset counter if minute has passed
  if (now - rateLimitState.minuteStart > 60000) {
    rateLimitState.requestsThisMinute = 0;
    rateLimitState.minuteStart = now;
  }

  // Wait if at limit
  if (rateLimitState.requestsThisMinute >= RATE_LIMIT) {
    const waitTime = 60000 - (now - rateLimitState.minuteStart) + 100;
    logger.warn({ waitTime }, 'Rate limit reached, waiting');
    await sleep(waitTime);
    rateLimitState.requestsThisMinute = 0;
    rateLimitState.minuteStart = Date.now();
  }

  rateLimitState.requestsThisMinute++;
}

/**
 * ServiceTitan API Client
 * 
 * Note: URLs should be FULL URLs including tenant ID
 * (matches the stEndpoints.js pattern from existing LAZI code)
 */
export class ServiceTitanClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
        'ST-App-Key': config.serviceTitan.appKey,
      },
    });

    // Request interceptor: Add auth token
    this.client.interceptors.request.use(
      async (reqConfig) => {
        const token = await getAccessToken();
        reqConfig.headers.Authorization = `Bearer ${token}`;
        return reqConfig;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor: Handle errors and retry on 401
    this.client.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;

        // Retry once on 401 (token might have expired)
        if (error.response?.status === 401 && !originalRequest._retry) {
          logger.warn('Token expired, refreshing and retrying');
          originalRequest._retry = true;
          clearTokenCache();
          const token = await getAccessToken();
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return this.client.request(originalRequest);
        }

        // Log error details
        logger.error({
          status: error.response?.status,
          url: error.config?.url,
          message: error.response?.data?.message || error.message,
          data: error.response?.data,
        }, 'ServiceTitan API error');

        throw error;
      }
    );
  }

  /**
   * GET request
   * @param url Full URL (including tenant ID)
   * @param params Query parameters
   */
  async get<T = unknown>(
    url: string,
    params?: Record<string, unknown>
  ): Promise<AxiosResponse<T>> {
    await checkRateLimit();
    logger.debug({ url, params }, 'GET request');
    return this.client.get<T>(url, { params });
  }

  /**
   * POST request
   */
  async post<T = unknown>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<T>> {
    await checkRateLimit();
    logger.debug({ url }, 'POST request');
    return this.client.post<T>(url, data, config);
  }

  /**
   * PATCH request
   */
  async patch<T = unknown>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<T>> {
    await checkRateLimit();
    logger.debug({ url }, 'PATCH request');
    return this.client.patch<T>(url, data, config);
  }

  /**
   * DELETE request
   */
  async delete<T = unknown>(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<T>> {
    await checkRateLimit();
    logger.debug({ url }, 'DELETE request');
    return this.client.delete<T>(url, config);
  }

  /**
   * Fetch all pages from a paginated endpoint
   */
  async fetchAllPages<T>(
    url: string,
    options: {
      pageSize?: number;
      params?: Record<string, unknown>;
      maxPages?: number;
    } = {}
  ): Promise<T[]> {
    const { pageSize = 100, params = {}, maxPages = 100 } = options;
    const allData: T[] = [];
    let page = 1;
    let hasMore = true;

    while (hasMore && page <= maxPages) {
      logger.debug({ url, page, pageSize }, 'Fetching page');

      const response = await this.get<{ data?: T[]; hasMore?: boolean } | T[]>(url, {
        ...params,
        page,
        pageSize,
      });

      const responseData = response.data;

      // Handle different response structures
      if (Array.isArray(responseData)) {
        allData.push(...responseData);
        hasMore = responseData.length === pageSize;
      } else if (responseData?.data && Array.isArray(responseData.data)) {
        allData.push(...responseData.data);
        hasMore = responseData.hasMore ?? responseData.data.length === pageSize;
      } else {
        hasMore = false;
      }

      page++;

      // Small delay between pages
      if (hasMore) {
        await sleep(100);
      }
    }

    logger.info({ url, totalRecords: allData.length, pages: page - 1 }, 'Fetched all pages');
    return allData;
  }
}

// Singleton instance
let clientInstance: ServiceTitanClient | null = null;

/**
 * Get the ServiceTitan client singleton
 */
export function getSTClient(): ServiceTitanClient {
  if (!clientInstance) {
    clientInstance = new ServiceTitanClient();
  }
  return clientInstance;
}

/**
 * Reset the client (for testing)
 */
export function resetSTClient(): void {
  clientInstance = null;
}
