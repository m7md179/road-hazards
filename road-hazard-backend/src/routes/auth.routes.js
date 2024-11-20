import { Router } from 'express'
import { authController } from '../controllers/auth.controller.js'
import { validatePhone } from '../middleware/validation.middleware.js'

const router = Router()

router.post('/signup', validatePhone, authController.signUp)
router.post('/verify', authController.verifyOTP)
router.post('/login', validatePhone, authController.signIn)
router.post('/signout', authController.signOut)

export default router