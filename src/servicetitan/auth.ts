import axios from 'axios';
import { config } from '../config/index.js';
import { createLogger } from '../utils/logger.js';

const logger = createLogger({ module: 'st-auth' });

interface TokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
}

interface TokenCache {
  token: string;
  expiresAt: number;
}

let tokenCache: TokenCache | null = null;

/**
 * Get a valid ServiceTitan access token
 * Uses client_credentials OAuth flow
 */
export async function getAccessToken(): Promise<string> {
  // Return cached token if still valid (with 60s buffer)
  if (tokenCache && tokenCache.expiresAt > Date.now() + 60000) {
    logger.debug('Using cached access token');
    return tokenCache.token;
  }

  logger.info('Requesting new ServiceTitan access token');

  try {
    const response = await axios.post<TokenResponse>(
      config.serviceTitan.authUrl,
      new URLSearchParams({
        grant_type: 'client_credentials',
        client_id: config.serviceTitan.clientId,
        client_secret: config.serviceTitan.clientSecret,
      }),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        timeout: 10000,
      }
    );

    const { access_token, expires_in } = response.data;

    // Cache with expiration buffer
    tokenCache = {
      token: access_token,
      expiresAt: Date.now() + (expires_in * 1000) - 60000,
    };

    logger.info({ expiresIn: expires_in }, 'ServiceTitan token acquired successfully');

    return access_token;
  } catch (error: any) {
    const message = error.response?.data?.error_description || error.message;
    logger.error({ error: message }, 'Failed to get ServiceTitan access token');
    throw new Error(`ServiceTitan authentication failed: ${message}`);
  }
}

/**
 * Clear the token cache (forces re-authentication)
 */
export function clearTokenCache(): void {
  tokenCache = null;
  logger.debug('Token cache cleared');
}

/**
 * Check if we have a valid cached token
 */
export function hasValidToken(): boolean {
  return tokenCache !== null && tokenCache.expiresAt > Date.now();
}

/**
 * Get token expiration time (for monitoring)
 */
export function getTokenExpiration(): Date | null {
  return tokenCache ? new Date(tokenCache.expiresAt) : null;
}
