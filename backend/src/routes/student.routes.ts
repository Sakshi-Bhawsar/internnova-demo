import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import { getProfile, postResume, putProfile } from '../controllers/student.controller';
import { authenticate } from '../middleware/auth.middleware';
import { requireRoles } from '../middleware/rbac.middleware';
import { validateBody } from '../middleware/validate.middleware';
import { updateStudentProfileSchema } from '../validators/student.validator';
import { UserRole } from '../types/enums';
import { env } from '../config/env';

const storage = multer.diskStorage({
  destination: path.join(process.cwd(), env.UPLOAD_DIR),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `resume-${Date.now()}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: env.MAX_FILE_SIZE_MB * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const allowed = ['.pdf', '.doc', '.docx'];
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowed.includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error('Only PDF, DOC, and DOCX files are allowed'));
    }
  },
});

const router = Router();

router.use(authenticate, requireRoles(UserRole.STUDENT));

router.get('/profile', getProfile);
router.put('/profile', validateBody(updateStudentProfileSchema), putProfile);
router.post('/resume', upload.single('resume'), postResume);

export default router;
