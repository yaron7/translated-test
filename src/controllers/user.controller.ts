import { Request, Response, NextFunction } from 'express'
import * as UserService from '../services/user.service'
import { User } from '../models/user.model' // Import the User model

export const createUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userData: Omit<User, 'id'> = req.body
    const userId = await UserService.createUser(userData)
    res.status(201).json({ id: userId, message: 'User created successfully' })
  } catch (error: any) {
    console.error('Error creating user:', error)
    res.status(500).json({ message: 'Failed to create user' })
    // next(new Error('Failed to create user'))
  }
}

export const getUserById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = parseInt(req.params.id, 10)
    const user = await UserService.getUserById(userId)
    if (user) {
      res.status(200).json(user)
    } else {
      res.status(404).json({ message: 'User not found' })
    }
  } catch (error: any) {
    console.error('Error getting user:', error)
    res.status(500).json({ message: 'Failed to get user' })
    // next(new Error('Failed to get user'))
  }
}

export const getAllUsers = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1
    const limit = parseInt(req.query.limit as string) || 10
    const offset = (page - 1) * limit

    const { users, totalCount } = await UserService.getAllUsers(limit, offset)
    res.status(200).json({
      users,
      totalCount,
      totalPages: Math.ceil(totalCount / limit),
      currentPage: page
    })
  } catch (error: any) {
    console.error('Error getting all users:', error)
    res.status(500).json({ message: 'Failed getting users' })
    // next(new Error('Failed getting users'))
  }
}

export const updateUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = parseInt(req.params.id, 10)
    const userData: Omit<User, 'id'> = req.body
    const updated = await UserService.updateUser(userId, userData)
    if (updated) {
      res.status(200).json({ message: 'User updated successfully' })
    } else {
      res.status(404).json({ message: 'User not found' })
    }
    // No explicit return of res
  } catch (error: any) {
    console.error('Error updating user:', error)
    next(error)
  }
}

export const deleteUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = parseInt(req.params.id, 10)
    const deleted = await UserService.deleteUser(userId)
    if (deleted) {
      res.status(204).send()
    } else {
      res.status(404).json({ message: 'User not found' })
    }
    // No explicit return of res
  } catch (error: any) {
    console.error('Error deleting user:', error)
    next(error)
  }
}
