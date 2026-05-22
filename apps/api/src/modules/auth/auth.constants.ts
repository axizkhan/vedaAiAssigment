export const AUTH_ACCESS_TOKEN_EXPIRES_IN = '15m';
export const AUTH_REFRESH_TOKEN_EXPIRES_IN = '7d';
export const AUTH_TOKEN_VERSION = 1;
export const REFRESH_COOKIE_NAME = 'refreshToken';
export const REFRESH_COOKIE_PATH = '/api/v1/auth';
export const REFRESH_COOKIE_MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000;
export const AUTH_BEARER_PREFIX = 'Bearer ';
export const WEAK_PASSWORDS = new Set([
  'password',
  'password1',
  'password123',
  'admin123',
  'qwerty123',
  'letmein123',
  'welcome123',
]);
