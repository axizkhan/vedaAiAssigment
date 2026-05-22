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
