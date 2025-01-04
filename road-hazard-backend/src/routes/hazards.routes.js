import { Router } from 'express';
import { hazardTypesController } from '../controllers/hazardTypes.controller.js';

const router = Router();

router.get('/', hazardTypesController.getAll);
router.post('/', hazardTypesController.create);
router.get('/:id', hazardTypesController.getById);
router.put('/:id', hazardTypesController.update);
router.delete('/:id', hazardTypesController.delete);

export default router;