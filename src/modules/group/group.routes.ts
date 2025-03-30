import express from 'express'
import * as GroupController from './group.controller'
import { validateGroupCreation, validateGroupUpdate } from '../../shared/middlewares/validations/validation.middleware'

const router = express.Router()

router.post('/', validateGroupCreation, GroupController.createGroup)
router.get('/:id', GroupController.getGroupById)
router.get('/', GroupController.getAllGroups)
router.put('/:id', validateGroupUpdate, GroupController.updateGroup)
router.delete('/:id', GroupController.deleteGroup)

export default router
