import { Router } from 'express'
import { reportController } from '../controllers/report.controller.js'
import { authenticateUser } from '../middleware/auth.middleware.js'
import { validateReport } from '../middleware/validation.middleware.js'

const router = Router()

router.post('/', authenticateUser, validateReport, reportController.createReport)
router.get('/user', authenticateUser, reportController.getUserReports)
router.get('/area', reportController.getAreaReports)
router.put('/:id', authenticateUser, reportController.updateReport)

export default router