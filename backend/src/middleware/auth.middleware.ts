import { Request, Response, NextFunction } from 'express';
import { sendError } from '../utils/apiResponse';
import { verifyAccessToken } from '../utils/jwt';

export function authenticate(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const header = req.headers.authorization;
  if (!header?.startsWith('Bearer ')) {
    sendError(res, 'Authentication required', 401, 'UNAUTHORIZED');
    return;
  }

  const token = header.slice(7);
  try {
    const payload = verifyAccessToken(token);
    req.user = payload;
    next();
  } catch {
    sendError(res, 'Invalid or expired token', 401, 'UNAUTHORIZED');
  }
}
