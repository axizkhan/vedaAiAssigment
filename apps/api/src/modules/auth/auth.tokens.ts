import jwt, { SignOptions } from 'jsonwebtoken';
import { apiEnv } from '@assessment-ai/config';
import { InvalidTokenError, TokenExpiredError } from '../../common/errors';
import { AUTH_ACCESS_TOKEN_EXPIRES_IN, AUTH_REFRESH_TOKEN_EXPIRES_IN, AUTH_TOKEN_VERSION } from './auth.constants';
import { JwtPayload, SessionPayload } from './auth.types';

function signToken(payload: Omit<JwtPayload, 'iat' | 'exp'>, secret: string, expiresIn: string): string {
  const options: SignOptions = { expiresIn: expiresIn as SignOptions['expiresIn'] };
  return jwt.sign(payload, secret, options);
}

function verifyToken(token: string, secret: string): JwtPayload {
  try {
    const decoded = jwt.verify(token, secret);
    if (!decoded || typeof decoded === 'string') throw new InvalidTokenError();
    const payload = decoded as Partial<JwtPayload>;
    if (!payload.sub || !payload.email || !payload.role || !payload.sessionId || payload.tokenVersion !== AUTH_TOKEN_VERSION) {
      throw new InvalidTokenError();
    }
    return payload as JwtPayload;
  } catch (error) {
    if (error instanceof TokenExpiredError || (error instanceof Error && error.name === 'TokenExpiredError')) throw new TokenExpiredError();
    throw new InvalidTokenError();
  }
}

function toJwtPayload(session: SessionPayload): Omit<JwtPayload, 'iat' | 'exp'> {
  return {
    sub: session.userId,
    email: session.email,
    role: session.role,
    sessionId: session.sessionId,
    tokenVersion: session.tokenVersion,
  };
}

export function generateAccessToken(session: SessionPayload): string {
  return signToken(toJwtPayload(session), apiEnv.JWT_SECRET, apiEnv.JWT_EXPIRES_IN || AUTH_ACCESS_TOKEN_EXPIRES_IN);
}

export function generateRefreshToken(session: SessionPayload): string {
  return signToken(toJwtPayload(session), apiEnv.REFRESH_TOKEN_SECRET, apiEnv.REFRESH_TOKEN_EXPIRES_IN || AUTH_REFRESH_TOKEN_EXPIRES_IN);
}

export function verifyAccessToken(token: string): JwtPayload {
  return verifyToken(token, apiEnv.JWT_SECRET);
}

export function verifyRefreshToken(token: string): JwtPayload {
  return verifyToken(token, apiEnv.REFRESH_TOKEN_SECRET);
}

export function decodeToken(token: string): JwtPayload | null {
  const decoded = jwt.decode(token);
  return decoded && typeof decoded !== 'string' ? decoded as JwtPayload : null;
}
