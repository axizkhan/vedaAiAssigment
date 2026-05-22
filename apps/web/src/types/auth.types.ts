export interface AuthenticatedUser {
  id: string;
  email: string;
  role: string;
}

export interface AuthTokens {
  accessToken: string;
}

export interface RefreshResult {
  success: boolean;
  data?: {
    accessToken: string;
    user: AuthenticatedUser;
  };
  error?: any;
}
