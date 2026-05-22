import crypto from 'crypto';
import { User } from '@assessment-ai/database';
import { logger } from '@assessment-ai/logger';

export const authSession = {
  hashToken: (token: string) => {
    return crypto.createHash('sha256').update(token).digest('hex');
  },
  createSession: async (userId: string, token: string) => {
    const hash = authSession.hashToken(token);
    await User.findByIdAndUpdate(userId, { $push: { refreshTokens: hash } });
  },
  revokeSession: async (userId: string, token: string) => {
    const hash = authSession.hashToken(token);
    await User.findByIdAndUpdate(userId, { $pull: { refreshTokens: hash } });
  },
  revokeAllSessions: async (userId: string) => {
    await User.findByIdAndUpdate(userId, { $set: { refreshTokens: [] } });
  },
  validateSession: async (userId: string, token: string) => {
    const hash = authSession.hashToken(token);
    const user = await User.findOne({ _id: userId, refreshTokens: hash });
    if (!user) {
      logger.warn('Token reuse detected or invalid session', { userId });
      await authSession.revokeAllSessions(userId); // Revoke everything on reuse
      return false;
    }
    return true;
  }
};
