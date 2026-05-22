export interface AuthenticatedUser {
  id: string;
  role: string;
  email: string;
  sessionId?: string;
}

export interface AuthContext {
  traceId?: string;
  sessionId?: string;
  userId?: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthenticatedUser;
      authContext?: AuthContext;
      traceId?: string;
    }
  }
}
