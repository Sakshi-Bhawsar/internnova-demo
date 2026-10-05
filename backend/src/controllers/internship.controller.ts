import { Request, Response, NextFunction } from 'express';
import { sendError, sendSuccess, sendSuccessWithPagination } from '../utils/apiResponse';

const param = (v: string | string[] | undefined): string => (Array.isArray(v) ? v[0]! : v ?? '');
import {
  createInternship,
  deleteInternship,
  getInternshipByIdAdmin,
  getInternshipBySlugOrId,
  listPublicInternships,
  patchInternshipStatus,
  updateInternship,
} from '../services/internship.service';
import type { InternshipQuery } from '../validators/internship.validator';
import { InternshipStatus } from '../types/enums';

export async function adminCreateInternship(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const internship = await createInternship(req.body);
    sendSuccess(res, internship, 'Internship created', 201);
  } catch (err) {
    next(err);
  }
}

export async function adminGetInternship(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const internship = await getInternshipByIdAdmin(param(req.params.id));
    sendSuccess(res, internship);
  } catch (err) {
    next(err);
  }
}

export async function adminUpdateInternship(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const internship = await updateInternship(param(req.params.id), req.body);
    sendSuccess(res, internship, 'Internship updated');
  } catch (err) {
    next(err);
  }
}

export async function adminDeleteInternship(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    await deleteInternship(param(req.params.id));
    sendSuccess(res, undefined, 'Internship deleted');
  } catch (err) {
    next(err);
  }
}

export async function adminPatchStatus(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const internship = await patchInternshipStatus(
      param(req.params.id),
      req.body.status as InternshipStatus
    );
    sendSuccess(res, internship, 'Status updated');
  } catch (err) {
    next(err);
  }
}

export async function publicListInternships(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { data, pagination } = await listPublicInternships(req.query as unknown as InternshipQuery);
    sendSuccessWithPagination(res, data, pagination);
  } catch (err) {
    next(err);
  }
}

export async function publicGetInternship(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const internship = await getInternshipBySlugOrId(param(req.params.slugOrId));
    if (internship.status !== InternshipStatus.PUBLISHED) {
      sendError(res, 'Internship not found', 404, 'NOT_FOUND');
      return;
    }
    sendSuccess(res, internship);
  } catch (err) {
    next(err);
  }
}
