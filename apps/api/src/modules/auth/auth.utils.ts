import crypto from 'node:crypto';
import { AUTH_BEARER_PREFIX } from './auth.constants';

export function createSessionId(): string {
  return crypto.randomBytes(24).toString('base64url');
}

export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

export function extractBearerToken(authorization?: string): string | null {
  if (!authorization?.startsWith(AUTH_BEARER_PREFIX)) return null;
  const token = authorization.slice(AUTH_BEARER_PREFIX.length).trim();
  return token.length > 0 ? token : null;
}

export function parseCookieHeader(cookieHeader?: string): Record<string, string> {
  if (!cookieHeader) return {};
  return cookieHeader.split(';').reduce<Record<string, string>>((cookies, pair) => {
    const [rawKey, ...valueParts] = pair.trim().split('=');
    if (!rawKey) return cookies;
    cookies[rawKey] = decodeURIComponent(valueParts.join('='));
    return cookies;
  }, {});
}
