import { Router } from 'express'
import { locationController } from '../controllers/location.controller.js'
import { authenticateUser } from '../middleware/auth.middleware.js'
import { validateLocation } from '../middleware/validation.middleware.js'

const router = Router()

router.post('/', authenticateUser, validateLocation, locationController.addLocation)
router.get('/:id', locationController.getLocation)
router.get('/nearby', locationController.getNearbyLocations)

export default router