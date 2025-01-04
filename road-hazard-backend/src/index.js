// routes/index.js
import { Router } from 'express';
import authRoutes from './auth.routes.js';
import reportsRoutes from './reports.routes.js';
import usersRoutes from './users.routes.js';
import dashboardRoutes from './dashboard.routes.js';
import { adminAuthMiddleware } from '../middleware/admin.middleware.js';

const router = Router();

// Public routes
router.use('/auth', authRoutes);

// Protected admin routes
router.use(adminAuthMiddleware);  // All routes below require admin auth
router.use('/reports', reportsRoutes);
router.use('/users', usersRoutes);
router.use('/dashboard', dashboardRoutes);

export default router;