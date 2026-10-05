import { Response } from 'express';

export interface ApiSuccessResponse<T = unknown> {
  success: true;
  message?: string;
  data?: T;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface ApiErrorResponse {
  success: false;
  message: string;
  error?: string;
}

export function sendSuccess<T>(
  res: Response,
  data?: T,
  message?: string,
  statusCode = 200
): Response {
  const body: ApiSuccessResponse<T> = { success: true };
  if (message) body.message = message;
  if (data !== undefined) body.data = data;
  return res.status(statusCode).json(body);
}

export function sendSuccessWithPagination<T>(
  res: Response,
  data: T[],
  pagination: ApiSuccessResponse['pagination'],
  message?: string
): Response {
  return res.status(200).json({
    success: true,
    message,
    data,
    pagination,
  });
}

export function sendError(
  res: Response,
  message: string,
  statusCode = 400,
  error?: string
): Response {
  const body: ApiErrorResponse = { success: false, message };
  if (error) body.error = error;
  return res.status(statusCode).json(body);
}
