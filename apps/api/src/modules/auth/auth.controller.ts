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
