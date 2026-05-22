import { Router } from 'express';
import { asyncHandler } from '../../middleware/error.middleware';
import { optionalAuthMiddleware } from '../../middleware/optional-auth.middleware';
import { loginController, logoutController, refreshController, registerController } from './auth.controller';
import { loginSchema, registerSchema } from './auth.schemas';
import { validateBody } from './auth.validators';

export const authRouter: Router = Router();

authRouter.post('/register', validateBody(registerSchema), asyncHandler(registerController));
authRouter.post('/login', validateBody(loginSchema), asyncHandler(loginController));
authRouter.post('/refresh', asyncHandler(refreshController));
authRouter.post('/logout', optionalAuthMiddleware, asyncHandler(logoutController));
