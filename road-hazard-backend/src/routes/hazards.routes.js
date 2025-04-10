import { Router } from 'express';
import { hazardTypesController } from '../controllers/hazards.controller.js';

const router = Router();

// Admin routes
router.get('/', hazardTypesController.getAll);
router.post('/', hazardTypesController.create);
router.get('/:id', hazardTypesController.getById);
router.put('/:id', hazardTypesController.update);
router.delete('/:id', hazardTypesController.delete);

// Reports-related routes
router.get('/reports/needs-review', hazardTypesController.getReportsNeedingReview);
router.post('/reports/:reportId/convert', hazardTypesController.convertReport);

// Mobile app routes (these would typically have different auth)
router.get('/types', hazardTypesController.getActiveHazardTypes);
router.get('/alerts', hazardTypesController.getHazardAlerts);
router.get('/nearby', hazardTypesController.getHazardsInRadius);

export default router;