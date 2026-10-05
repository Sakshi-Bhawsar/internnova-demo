import { Request, Response, NextFunction } from 'express';
import { sendSuccess } from '../utils/apiResponse';
import {
  getStudentProfile,
  updateStudentProfile,
  uploadResume,
} from '../services/student.service';

export async function getProfile(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const result = await getStudentProfile(req.user!.userId);
    sendSuccess(res, result);
  } catch (err) {
    next(err);
  }
}

export async function putProfile(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const result = await updateStudentProfile(req.user!.userId, req.body);
    sendSuccess(res, result, 'Profile updated');
  } catch (err) {
    next(err);
  }
}

export async function postResume(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    if (!req.file) {
      res.status(400).json({ success: false, message: 'No file uploaded', error: 'NO_FILE' });
      return;
    }
    const result = await uploadResume(req.user!.userId, req.file);
    sendSuccess(res, result, 'Resume uploaded');
  } catch (err) {
    next(err);
  }
}
