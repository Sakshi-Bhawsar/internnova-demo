import { Router, Request, Response } from 'express';
import { sendSuccess } from '../utils/apiResponse';

const router = Router();

router.get('/health', (_req: Request, res: Response) => {
  return sendSuccess(res, {
    status: 'ok',
    service: 'internova-api',
    timestamp: new Date().toISOString(),
  }, 'API is healthy');
});

export default router;
