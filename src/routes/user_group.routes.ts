import express from 'express'
import * as UserGroupController from '../controllers/user_group.controller'
import { validateUserGroupOperation } from '../middlewares/validations/validation.middleware'

const router = express.Router()

router.post('/join', validateUserGroupOperation, UserGroupController.addUserToGroup)
router.delete('/leave', validateUserGroupOperation, UserGroupController.removeUserFromGroup)
router.get('/group/:group_id/users', UserGroupController.getUsersInGroup)
router.get('/user/:user_id/groups', UserGroupController.getGroupsForUser)

export default router
