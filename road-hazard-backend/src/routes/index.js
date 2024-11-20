import { Router } from 'express'
import hazardRoutes from './hazard.routes.js'
import locationRoutes from './location.routes.js'
import reportRoutes from './report.routes.js'

const router = Router()

router.use('/hazards', hazardRoutes)
router.use('/locations', locationRoutes)
router.use('/reports', reportRoutes)

export default router