import { Router } from 'express';
import { locationsController } from '../controllers/locations.controller.js';

const router = Router();

router.get('/', locationsController.getAll);
router.post('/', locationsController.create);
router.get('/:id', locationsController.getById);
router.put('/:id', locationsController.update);
router.delete('/:id', locationsController.delete);

export default router;