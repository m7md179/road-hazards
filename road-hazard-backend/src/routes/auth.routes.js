import { Router } from 'express';
import authController from '../controllers/auth.controller.js';

const router = Router();

// Fix function names to match controller implementation
router.post('/signup', authController.mobileRegister);
router.post('/signin', authController.mobileLogin);
router.post('/login', authController.login);
router.post('/logout', authController.logout);
router.get('/profile', authController.getProfile);
router.put('/profile', authController.updateProfile);

export default router;