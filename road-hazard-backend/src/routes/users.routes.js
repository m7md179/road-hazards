import { Router } from 'express';
import { usersController } from '../controllers/users.controller.js';

const router = Router();

router.get('/', usersController.getAll);
router.get('/:id', usersController.getById);
router.put('/:id', usersController.update);
router.delete('/:id', usersController.delete);
router.put('/:id/trust-score', usersController.updateTrustScore);
router.put('/:id/ban', usersController.banUser);
router.put('/:id/unban', usersController.unbanUser);

export default router;