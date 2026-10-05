import { Request, Response, NextFunction } from 'express';
import { getCurrentUser, loginUser, registerUser } from '../services/auth.service';
import { sendSuccess } from '../utils/apiResponse';

export async function register(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const result = await registerUser(req.body);
    sendSuccess(res, result, 'Registration successful', 201);
  } catch (error) {
    next(error);
  }
}

export async function login(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const result = await loginUser(req.body);
    sendSuccess(res, result, 'Login successful');
  } catch (error) {
    next(error);
  }
}

export async function logout(_req: Request, res: Response): Promise<void> {
  sendSuccess(res, undefined, 'Logged out successfully');
}

export async function me(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    if (!req.user) {
      return next();
    }
    const user = await getCurrentUser(req.user.userId);
    sendSuccess(res, { user }, 'User fetched successfully');
  } catch (error) {
    next(error);
  }
}
