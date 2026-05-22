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
