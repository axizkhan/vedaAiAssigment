import { Request, Response } from 'express';
import { healthService } from './health.service';
import { sendSuccessResponse } from '../../../common/response';

export const getHealthController = async (req: Request, res: Response) => {
  const result = await healthService.getSystemHealth();
  const statusCode = result.status === 'unhealthy' ? 503 : 200;
  return sendSuccessResponse(res, { statusCode, data: result });
};
