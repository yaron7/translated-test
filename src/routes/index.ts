import express, { Router } from 'express'
import userRoutes from './user.routes'
import groupRoutes from './group.routes'
import userGroupRoutes from './user_group.routes'

const router: Router = express.Router()

router.use('/users', userRoutes)
router.use('/groups', groupRoutes)
router.use('/user-groups', userGroupRoutes)

export default router
