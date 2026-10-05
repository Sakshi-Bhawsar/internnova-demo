import { Router } from 'express';
import authRoutes from './auth.routes';
import healthRoutes from './health.routes';
import internshipRoutes from './internship.routes';
import studentRoutes from './student.routes';

const router = Router();

router.use('/health', healthRoutes);
router.use('/auth', authRoutes);
router.use('/internships', internshipRoutes);
router.use('/students', studentRoutes);

export default router;
