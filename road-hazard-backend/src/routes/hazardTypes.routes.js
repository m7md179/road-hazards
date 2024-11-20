import { Router } from 'express'
import { hazardTypesController } from '../controllers/hazardTypes.controller.js'
import { authenticateUser } from '../middleware/auth.middleware.js'

const router = Router()

router.get('/', hazardTypesController.getAllTypes)
router.post('/', authenticateUser, hazardTypesController.createType)
router.put('/:id', authenticateUser, hazardTypesController.updateType)
router.delete('/:id', authenticateUser, hazardTypesController.deleteType)

export default router