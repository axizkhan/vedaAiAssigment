const fs = require('fs');
const path = require('path');

const files = {
  // BACKEND API
  "apps/api/src/modules/auth/auth.tokens.ts": `
import jwt from 'jsonwebtoken';
import { apiEnv } from '@assessment-ai/config';

export const authTokens = {
  generateAccessToken: (payload: any) => {
    return jwt.sign({ ...payload, type: 'access' }, apiEnv.JWT_SECRET, { expiresIn: '15m' });
  },
  generateRefreshToken: (payload: any) => {
    return jwt.sign({ ...payload, type: 'refresh' }, apiEnv.REFRESH_TOKEN_SECRET, { expiresIn: '7d' });
  },
  verifyAccessToken: (token: string) => {
    return jwt.verify(token, apiEnv.JWT_SECRET) as any;
  },
  verifyRefreshToken: (token: string) => {
    return jwt.verify(token, apiEnv.REFRESH_TOKEN_SECRET) as any;
  }
};
  `,
  "apps/api/src/modules/auth/auth.session.ts": `
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
  `,
  "apps/api/src/modules/auth/auth.cookies.ts": `
import { Response } from 'express';

export const authCookies = {
  setRefreshCookie: (res: Response, token: string) => {
    res.cookie('refreshToken', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/api/v1/auth',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });
  },
  clearRefreshCookie: (res: Response) => {
    res.clearCookie('refreshToken', { path: '/api/v1/auth' });
  }
};
  `,
  "apps/api/src/modules/auth/auth.controller.ts": `
import { Request, Response } from 'express';
import { authService } from './auth.service';
import { authCookies } from './auth.cookies';
import { sendSuccessResponse } from '../../common/response';

export const loginController = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const { user, accessToken, refreshToken } = await authService.login(email, password);
  authCookies.setRefreshCookie(res, refreshToken);
  return sendSuccessResponse(res, { statusCode: 200, data: { user, accessToken } });
};

export const refreshController = async (req: Request, res: Response) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) throw new Error('UNAUTHORIZED');
  const { user, accessToken, newRefreshToken } = await authService.refresh(refreshToken);
  authCookies.setRefreshCookie(res, newRefreshToken);
  return sendSuccessResponse(res, { statusCode: 200, data: { user, accessToken } });
};

export const logoutController = async (req: Request, res: Response) => {
  const refreshToken = req.cookies.refreshToken;
  if (refreshToken) await authService.logout(refreshToken);
  authCookies.clearRefreshCookie(res);
  return sendSuccessResponse(res, { statusCode: 200, data: { success: true } });
};

export const logoutAllController = async (req: Request, res: Response) => {
  await authService.logoutAll(req.user!.id);
  authCookies.clearRefreshCookie(res);
  return sendSuccessResponse(res, { statusCode: 200, data: { success: true } });
};
  `,
  "apps/api/src/modules/auth/auth.service.ts": `
import { User } from '@assessment-ai/database';
import { authTokens } from './auth.tokens';
import { authSession } from './auth.session';
import { logger } from '@assessment-ai/logger';

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
    } catch(e) { }
  },
  logoutAll: async (userId: string) => {
    await authSession.revokeAllSessions(userId);
  }
};
  `,
  "apps/api/src/modules/auth/auth.routes.ts": `
import { Router } from 'express';
import { asyncHandler } from '../../middleware/error.middleware';
import { authMiddleware } from '../../middleware/auth.middleware';
import { loginController, refreshController, logoutController, logoutAllController } from './auth.controller';
import cookieParser from 'cookie-parser';

export const authRouter = Router();
authRouter.use(cookieParser());

authRouter.post('/login', asyncHandler(loginController));
authRouter.post('/refresh', asyncHandler(refreshController));
authRouter.post('/logout', asyncHandler(logoutController));
authRouter.post('/logout-all', authMiddleware, asyncHandler(logoutAllController));

export default authRouter;
  `,
  "apps/api/src/middleware/auth.middleware.ts": `
import { Request, Response, NextFunction } from 'express';
import { authTokens } from '../modules/auth/auth.tokens';

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      return res.status(401).json({ success: false, error: { code: 'UNAUTHORIZED', message: 'Missing token' } });
    }
    const token = authHeader.split(' ')[1];
    const decoded = authTokens.verifyAccessToken(token);
    req.user = { id: decoded.sub, role: decoded.role, email: decoded.email };
    next();
  } catch (error: any) {
    const code = error.name === 'TokenExpiredError' ? 'TOKEN_EXPIRED' : 'INVALID_TOKEN';
    return res.status(401).json({ success: false, error: { code, message: 'Authentication failed' } });
  }
};
  `,

  // FRONTEND STORE & CLIENT
  "apps/web/src/store/auth.store.ts": `
import { create } from 'zustand';

interface AuthState {
  user: any | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isRefreshing: boolean;
  setAuth: (user: any, token: string) => void;
  clearAuth: () => void;
  setRefreshing: (state: boolean) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  accessToken: null,
  isAuthenticated: false,
  isRefreshing: false,
  setAuth: (user, token) => set({ user, accessToken: token, isAuthenticated: true }),
  clearAuth: () => set({ user: null, accessToken: null, isAuthenticated: false }),
  setRefreshing: (state) => set({ isRefreshing: state })
}));
  `,
  "apps/web/src/services/api.client.ts": `
import axios from 'axios';
import { useAuthStore } from '../store/auth.store';

export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || '/api/v1',
  withCredentials: true
});

apiClient.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken;
  if (token) {
    config.headers.Authorization = \`Bearer \${token}\`;
  }
  return config;
});

let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach(prom => {
    if (error) prom.reject(error);
    else prom.resolve(token);
  });
  failedQueue = [];
};

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise(function(resolve, reject) {
          failedQueue.push({ resolve, reject });
        }).then(token => {
          originalRequest.headers.Authorization = 'Bearer ' + token;
          return apiClient(originalRequest);
        }).catch(err => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;
      useAuthStore.getState().setRefreshing(true);

      try {
        const res = await axios.post('/api/v1/auth/refresh', {}, { withCredentials: true, baseURL: apiClient.defaults.baseURL });
        const newToken = res.data.data.accessToken;
        useAuthStore.getState().setAuth(res.data.data.user, newToken);
        processQueue(null, newToken);
        originalRequest.headers.Authorization = 'Bearer ' + newToken;
        return apiClient(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        useAuthStore.getState().clearAuth();
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
        useAuthStore.getState().setRefreshing(false);
      }
    }
    return Promise.reject(error);
  }
);
  `,
  "apps/web/src/services/auth.service.ts": `
import { apiClient } from './api.client';

export const authService = {
  login: async (email: string, password: string) => {
    const res = await apiClient.post('/auth/login', { email, password });
    return res.data;
  },
  logout: async () => {
    await apiClient.post('/auth/logout');
  }
};
  `,
  "apps/web/src/hooks/useAuth.ts": `
import { useAuthStore } from '../store/auth.store';
import { authService } from '../services/auth.service';

export const useAuth = () => {
  const store = useAuthStore();
  
  return {
    ...store,
    login: authService.login,
    logout: async () => {
      await authService.logout();
      store.clearAuth();
    }
  };
};
  `,
  "apps/web/src/providers/AuthProvider.tsx": `
import React, { useEffect, useState } from 'react';
import { useAuthStore } from '../store/auth.store';
import { apiClient } from '../services/api.client';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, setAuth, clearAuth } = useAuthStore();
  const [loading, setLoading] = useState(!isAuthenticated);

  useEffect(() => {
    const restoreSession = async () => {
      if (!isAuthenticated) {
        try {
          const res = await apiClient.post('/auth/refresh');
          setAuth(res.data.data.user, res.data.data.accessToken);
        } catch {
          clearAuth();
        }
      }
      setLoading(false);
    };
    restoreSession();
  }, []);

  if (loading) return null; // or a loading spinner
  return <>{children}</>;
};
  `
};

for (const [filePath, content] of Object.entries(files)) {
  const absolutePath = path.join(process.cwd(), filePath);
  fs.mkdirSync(path.dirname(absolutePath), { recursive: true });
  fs.writeFileSync(absolutePath, content.trim() + '\n');
  console.log('Created ' + filePath);
}
