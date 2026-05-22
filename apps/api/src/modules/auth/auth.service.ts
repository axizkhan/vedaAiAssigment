import { User } from '@assessment-ai/database';
import { authTokens } from './auth.tokens';
import { authSession } from './auth.session';
import { logger } from '@assessment-ai/logger';
import { socketManager } from '../../socket/socket.manager';

export const authService = {
  login: async (email: string, password: string) => {
    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      throw new Error('UNAUTHORIZED');
    }
    const payload = { sub: user.id, role: user.role, email: user.email };
    const accessToken = authTokens.generateAccessToken(payload);
    const refreshToken = authTokens.generateRefreshToken(payload);
    await authSession.createSession(user.id, refreshToken);
    logger.info('User logged in', { userId: user.id });
    return { user: { id: user.id, email: user.email, role: user.role }, accessToken, refreshToken };
  },
  refresh: async (oldToken: string) => {
    try {
      const decoded = authTokens.verifyRefreshToken(oldToken);
      const isValid = await authSession.validateSession(decoded.sub, oldToken);
      if (!isValid) throw new Error('UNAUTHORIZED');
      
      const user = await User.findById(decoded.sub);
      if (!user) throw new Error('UNAUTHORIZED');

      await authSession.revokeSession(decoded.sub, oldToken);
      
      const payload = { sub: user.id, role: user.role, email: user.email };
      const accessToken = authTokens.generateAccessToken(payload);
      const newRefreshToken = authTokens.generateRefreshToken(payload);
      
      await authSession.createSession(user.id, newRefreshToken);
      return { user: { id: user.id, email: user.email, role: user.role }, accessToken, newRefreshToken };
    } catch (e) {
      throw new Error('UNAUTHORIZED');
    }
  },
  logout: async (token: string) => {
    try {
      const decoded = authTokens.verifyRefreshToken(token);
      await authSession.revokeSession(decoded.sub, token);
      socketManager.disconnectSessionSockets(decoded.sessionId);
    } catch(e) { }
  },
  logoutAll: async (userId: string) => {
    await authSession.revokeAllSessions(userId);
    socketManager.disconnectUserSockets(userId);
  }
};
