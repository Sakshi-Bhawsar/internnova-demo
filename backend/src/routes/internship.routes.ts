import { Router } from 'express';
import {
  adminCreateInternship,
  adminDeleteInternship,
  adminGetInternship,
  adminPatchStatus,
  adminUpdateInternship,
  publicGetInternship,
  publicListInternships,
} from '../controllers/internship.controller';
import { authenticate } from '../middleware/auth.middleware';
import { requireRoles } from '../middleware/rbac.middleware';
import { validateBody, validateQuery } from '../middleware/validate.middleware';
import {
  createInternshipSchema,
  internshipQuerySchema,
  publishSchema,
  updateInternshipSchema,
} from '../validators/internship.validator';
import { UserRole } from '../types/enums';

const router = Router();

// Public
router.get('/', validateQuery(internshipQuerySchema), publicListInternships);
router.get('/:slugOrId', publicGetInternship);

// Admin only
router.use(authenticate, requireRoles(UserRole.ADMIN));
router.post('/', validateBody(createInternshipSchema), adminCreateInternship);
router.get('/admin/:id', adminGetInternship);
router.put('/:id', validateBody(updateInternshipSchema), adminUpdateInternship);
router.delete('/:id', adminDeleteInternship);
router.patch('/:id/status', validateBody(publishSchema), adminPatchStatus);

export default router;
