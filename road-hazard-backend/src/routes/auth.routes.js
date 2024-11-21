import { Router } from 'express';
import authController from '../controllers/auth.controller.js';

const router = Router();

router.post('/signup', authController.signUp);
router.post('/signin', authController.signIn);
router.get('/profile', authController.getProfile);
router.put('/profile', authController.updateProfile);

export default router;