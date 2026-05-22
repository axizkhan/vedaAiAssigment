import { UserRole } from '@assessment-ai/database';

export interface RegisterInput {
  email: string;
  password: string;
  name: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface RefreshInput {
  refreshToken: string;
}

export interface AuthenticatedUser {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  createdAt: Date;
}

export interface RequestUser {
  id: string;
  email: string;
  role: UserRole;
  sessionId: string;
}

export interface AuthResponse {
  user: AuthenticatedUser;
  accessToken: string;
  refreshToken: string;
}

export interface RefreshResponse {
  accessToken: string;
  refreshToken: string;
}

export interface JwtPayload {
  sub: string;
  role: UserRole;
  email: string;
  sessionId: string;
  tokenVersion: number;
  iat?: number;
  exp?: number;
}

export interface SessionPayload {
  userId: string;
  email: string;
  role: UserRole;
  sessionId: string;
  tokenVersion: number;
}

export interface AuthTraceContext {
  traceId?: string;
  ip?: string;
  userAgent?: string;
}
