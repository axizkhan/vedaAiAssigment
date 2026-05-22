import { logger } from '@assessment-ai/logger';
import { AuthTraceContext } from './auth.types';

type AuthAuditAction = 'register' | 'login' | 'refresh' | 'logout' | 'failed_login' | 'refresh_failed' | 'replay_detected';

function audit(action: AuthAuditAction, metadata: Record<string, unknown>, trace?: AuthTraceContext): void {
  logger.info({
    action,
    traceId: trace?.traceId,
    ip: trace?.ip,
    userAgent: trace?.userAgent,
    ...metadata,
  }, 'auth audit event');
}

export const AuthAudit = {
  registration(userId: string, trace?: AuthTraceContext) {
    audit('register', { userId }, trace);
  },
  login(userId: string, trace?: AuthTraceContext) {
    audit('login', { userId }, trace);
  },
  refresh(userId: string, trace?: AuthTraceContext) {
    audit('refresh', { userId }, trace);
  },
  logout(userId: string, trace?: AuthTraceContext) {
    audit('logout', { userId }, trace);
  },
  failedLogin(email: string, trace?: AuthTraceContext) {
    audit('failed_login', { email }, trace);
  },
  refreshFailed(userId: string | undefined, reason: string, trace?: AuthTraceContext) {
    audit('refresh_failed', { userId, reason }, trace);
  },
  replayDetected(userId: string, trace?: AuthTraceContext) {
    audit('replay_detected', { userId }, trace);
  },
};
