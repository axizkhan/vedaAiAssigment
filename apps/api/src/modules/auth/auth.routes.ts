import { Router } from 'express';
import { asyncHandler } from '../../middleware/error.middleware';
import { authenticate } from '../../middleware/auth.middleware';
import { loginController, refreshController, logoutController, logoutAllController } from './auth.controller';
import cookieParser from 'cookie-parser';

export const authRouter = Router();
authRouter.use(cookieParser());

authRouter.post('/login', asyncHandler(loginController));
authRouter.post('/refresh', asyncHandler(refreshController));
authRouter.post('/logout', asyncHandler(logoutController));
authRouter.post('/logout-all', authenticate, asyncHandler(logoutAllController));

export default authRouter;
