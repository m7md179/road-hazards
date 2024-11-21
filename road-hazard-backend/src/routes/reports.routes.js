import { Router } from 'express';
import reportsController from '../controllers/reports.controller.js';
import { authMiddleware } from '../middleware/auth.middleware.js';

const router = Router();

// Protected routes
router.post('/', authMiddleware, reportsController.create);
router.put('/:id/status', authMiddleware, reportsController.updateStatus);
router.delete('/:id', authMiddleware, reportsController.delete);

// Public routes
router.get('/', reportsController.getAll);
router.get('/:id', reportsController.getById);

export default router;