import { EMAIL_ALREADY_EXISTS, UserAuthService, UserRole } from '@assessment-ai/database';
import { comparePassword, hashPassword } from '@assessment-ai/database';
import { DuplicateResourceError, InvalidCredentialsError, InvalidTokenError } from '../../common/errors';
import { AuthAudit } from './auth.audit';
import { mapUserToAuthUser } from './auth.mapper';
import { createSessionPayload, invalidateRefreshToken, issueTokenPair, rotateRefreshToken, storeRefreshToken } from './auth.session';
import { verifyRefreshToken } from './auth.tokens';
import { AuthResponse, AuthTraceContext, LoginInput, RefreshInput, RefreshResponse, RegisterInput } from './auth.types';
import { normalizeEmail } from './auth.utils';

export class AuthService {
  async register(input: RegisterInput, trace?: AuthTraceContext): Promise<AuthResponse> {
    const email = normalizeEmail(input.email);
    const existing = await UserAuthService.findByEmail(email);
    if (existing) throw new DuplicateResourceError('Email is already registered');

    try {
      const passwordHash = await hashPassword(input.password);
      const user = await UserAuthService.createUser({
        email,
        passwordHash,
        name: input.name.trim(),
        role: UserRole.TEACHER,
        refreshTokens: [],
        dailyGenerationCount: 0,
        lastGenerationReset: new Date(),
      });

      const authUser = mapUserToAuthUser(user);
      const session = createSessionPayload({ id: authUser.id, email: authUser.email, role: authUser.role });
      const tokens = await issueTokenPair(session);
      await storeRefreshToken(authUser.id, tokens.refreshToken);
      AuthAudit.registration(authUser.id, trace);

      return { user: authUser, ...tokens };
    } catch (error) {
      if (error instanceof EMAIL_ALREADY_EXISTS) throw new DuplicateResourceError('Email is already registered');
      throw error;
    }
  }

  async login(input: LoginInput, trace?: AuthTraceContext): Promise<AuthResponse> {
    const email = normalizeEmail(input.email);
    const user = await UserAuthService.findByEmailWithPassword(email);

    if (!user) {
      AuthAudit.failedLogin(email, trace);
      throw new InvalidCredentialsError();
    }

    const validPassword = await comparePassword(input.password, user.passwordHash);
    if (!validPassword) {
      AuthAudit.failedLogin(email, trace);
      throw new InvalidCredentialsError();
    }

    const authUser = mapUserToAuthUser(user);
    const session = createSessionPayload({ id: authUser.id, email: authUser.email, role: authUser.role });
    const tokens = await issueTokenPair(session);
    await storeRefreshToken(authUser.id, tokens.refreshToken);
    AuthAudit.login(authUser.id, trace);

    return { user: authUser, ...tokens };
  }

  async refresh(input: RefreshInput, trace?: AuthTraceContext): Promise<RefreshResponse> {
    try {
      const payload = verifyRefreshToken(input.refreshToken);
      const tokens = await rotateRefreshToken(payload, input.refreshToken, trace);
      AuthAudit.refresh(payload.sub, trace);
      return tokens;
    } catch (error) {
      const userId = error instanceof Error ? undefined : undefined;
      AuthAudit.refreshFailed(userId, 'invalid_refresh_token', trace);
      throw new InvalidTokenError();
    }
  }

  async logout(input: RefreshInput, userId?: string, trace?: AuthTraceContext): Promise<void> {
    try {
      const payload = verifyRefreshToken(input.refreshToken);
      await invalidateRefreshToken(payload.sub, input.refreshToken);
      AuthAudit.logout(payload.sub, trace);
      return;
    } catch {
      if (userId) AuthAudit.logout(userId, trace);
    }
  }
}

export const authService = new AuthService();
