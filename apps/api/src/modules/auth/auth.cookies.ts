import { Request, Response } from 'express';
import { REFRESH_COOKIE_MAX_AGE_MS, REFRESH_COOKIE_NAME, REFRESH_COOKIE_PATH } from './auth.constants';
import { parseCookieHeader } from './auth.utils';

function isProduction(): boolean {
  return process.env.NODE_ENV === 'production';
}

export function setRefreshTokenCookie(res: Response, refreshToken: string): void {
  res.cookie(REFRESH_COOKIE_NAME, refreshToken, {
    httpOnly: true,
    secure: isProduction(),
    sameSite: 'strict',
    path: REFRESH_COOKIE_PATH,
    maxAge: REFRESH_COOKIE_MAX_AGE_MS,
  });
}

export function clearRefreshTokenCookie(res: Response): void {
  res.clearCookie(REFRESH_COOKIE_NAME, {
    httpOnly: true,
    secure: isProduction(),
    sameSite: 'strict',
    path: REFRESH_COOKIE_PATH,
  });
}

export function getRefreshTokenFromRequest(req: Request): string | undefined {
  const bodyToken = typeof req.body?.refreshToken === 'string' ? req.body.refreshToken : undefined;
  if (bodyToken) return bodyToken;
  const cookies = parseCookieHeader(req.headers.cookie);
  return cookies[REFRESH_COOKIE_NAME];
}
