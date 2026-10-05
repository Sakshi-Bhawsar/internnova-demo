import { Request, Response, NextFunction } from 'express';
import { sendError } from '../utils/apiResponse';
import { UserRole } from '../types/enums';

export function requireRoles(...roles: UserRole[]) {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      sendError(res, 'Authentication required', 401, 'UNAUTHORIZED');
      return;
    }
    if (!roles.includes(req.user.role)) {
      sendError(res, 'You do not have permission for this action', 403, 'FORBIDDEN');
      return;
    }
    next();
  };
}
