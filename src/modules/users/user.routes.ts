import express from 'express'
import * as UserController from './user.controller'
import {
  validateUserCreation,
  validateUserUpdate,
  validatePagination
} from '../../shared/middlewares/validations/validation.middleware'

const router = express.Router()

router.post('/', validateUserCreation, UserController.createUser)
router.get('/:id', UserController.getUserById)
router.get('/', validatePagination, UserController.getAllUsers)
router.put('/:id', validateUserUpdate, UserController.updateUser)
router.delete('/:id', UserController.deleteUser)

export default router
