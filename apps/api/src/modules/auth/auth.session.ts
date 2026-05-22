import { UserAuthService } from '@assessment-ai/database';
import crypto from 'node:crypto';
import { InvalidTokenError } from '../../common/errors';
import { AUTH_TOKEN_VERSION } from './auth.constants';
import { AuthAudit } from './auth.audit';
import { AuthTraceContext, JwtPayload, SessionPayload } from './auth.types';
import { createSessionId } from './auth.utils';
import { generateAccessToken, generateRefreshToken } from './auth.tokens';

export function createSessionPayload(user: { id: string; email: string; role: SessionPayload['role'] }, sessionId = createSessionId()): SessionPayload {
  return {
    userId: user.id,
    email: user.email,
    role: user.role,
    sessionId,
    tokenVersion: AUTH_TOKEN_VERSION,
  };
}

export async function issueTokenPair(session: SessionPayload): Promise<{ accessToken: string; refreshToken: string }> {
  return {
    accessToken: generateAccessToken(session),
    refreshToken: generateRefreshToken(session),
  };
}

function hashRefreshToken(refreshToken: string): string {
  return crypto.createHash('sha256').update(refreshToken).digest('hex');
}

export async function storeRefreshToken(userId: string, refreshToken: string): Promise<void> {
  await UserAuthService.addRefreshToken(userId, hashRefreshToken(refreshToken));
}

export async function rotateRefreshToken(payload: JwtPayload, oldRefreshToken: string, trace?: AuthTraceContext): Promise<{ accessToken: string; refreshToken: string }> {
  const user = await UserAuthService.findById(payload.sub);
  if (!user) throw new InvalidTokenError();

  const session = createSessionPayload({ id: user._id.toString(), email: user.email, role: user.role }, payload.sessionId);
  const tokens = await issueTokenPair(session);
  const oldTokenHash = hashRefreshToken(oldRefreshToken);
  const replaced = await UserAuthService.replaceRefreshToken(user._id.toString(), oldTokenHash, hashRefreshToken(tokens.refreshToken));

  if (!replaced) {
    const tokenExists = await UserAuthService.hasRefreshToken(user._id.toString(), oldTokenHash);
    if (!tokenExists) {
      await UserAuthService.clearRefreshTokens(user._id.toString());
      AuthAudit.replayDetected(user._id.toString(), trace);
    }
    throw new InvalidTokenError();
  }

  return tokens;
}

export async function invalidateRefreshToken(userId: string, refreshToken: string): Promise<void> {
  await UserAuthService.removeRefreshToken(userId, hashRefreshToken(refreshToken));
}
