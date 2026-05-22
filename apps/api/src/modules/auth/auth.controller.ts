import { Request, Response } from 'express';
import { sendSuccessResponse } from '../../common/response';
import { clearRefreshTokenCookie, getRefreshTokenFromRequest, setRefreshTokenCookie } from './auth.cookies';
import { refreshSchema } from './auth.schemas';
import { authService } from './auth.service';

function traceFromRequest(req: Request) {
  return {
    traceId: req.traceId,
    ip: req.ip,
    userAgent: req.header('user-agent'),
  };
}

export async function registerController(req: Request, res: Response) {
  const result = await authService.register(req.body, traceFromRequest(req));
  setRefreshTokenCookie(res, result.refreshToken);
  return sendSuccessResponse(res, {
    statusCode: 201,
    data: result,
    traceId: req.traceId,
  });
}

export async function loginController(req: Request, res: Response) {
  const result = await authService.login(req.body, traceFromRequest(req));
  setRefreshTokenCookie(res, result.refreshToken);
  return sendSuccessResponse(res, {
    statusCode: 200,
    data: result,
    traceId: req.traceId,
  });
}

export async function refreshController(req: Request, res: Response) {
  const refreshToken = getRefreshTokenFromRequest(req);
  const input = refreshSchema.parse({ refreshToken });
  const result = await authService.refresh(input, traceFromRequest(req));
  setRefreshTokenCookie(res, result.refreshToken);
  return sendSuccessResponse(res, {
    statusCode: 200,
    data: result,
    traceId: req.traceId,
  });
}

export async function logoutController(req: Request, res: Response) {
  const refreshToken = getRefreshTokenFromRequest(req);
  if (refreshToken) {
    await authService.logout({ refreshToken }, req.user?.id, traceFromRequest(req));
  }
  clearRefreshTokenCookie(res);
  return res.status(204).send();
}
