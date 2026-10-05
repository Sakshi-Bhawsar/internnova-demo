import jwt from 'jsonwebtoken';
import { env } from '../config/env';
import { UserRole } from '../types/enums';

export interface JwtPayload {
  userId: string;
  email: string;
  role: UserRole;
}

export function signAccessToken(payload: JwtPayload): string {
  return jwt.sign(payload, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRES_IN as import('jsonwebtoken').SignOptions['expiresIn'],
  });
}

export function verifyAccessToken(token: string): JwtPayload {
  return jwt.verify(token, env.JWT_SECRET) as JwtPayload;
}
