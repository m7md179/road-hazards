import { Router } from 'express'
import { reportsController } from '../controllers/reports.controller.js'
import { adminAuthMiddleware } from '../middleware/admin.middleware.js'

const router = Router()

router.use(adminAuthMiddleware)  // Protect all routes

router.get('/', reportsController.getAll)
router.put('/:reportId/status', reportsController.updateStatus)

export default router