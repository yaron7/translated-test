import * as UserModel from '../models/user.model'
import { User } from '../models/user.model'

export const createUser = async (user: Omit<User, 'id'>): Promise<number> => {
  return UserModel.createUser(user)
}

export const getUserById = async (id: number): Promise<User | undefined> => {
  return UserModel.getUserById(id)
}

export const getAllUsers = async (limit: number, offset: number): Promise<{ users: User[], totalCount: number }> => {
  return UserModel.getAllUsers(limit, offset)
}

export const updateUser = async (id: number, user: Omit<User, 'id'>): Promise<boolean> => {
  return UserModel.updateUser(id, user)
}

export const deleteUser = async (id: number): Promise<boolean> => {
  return UserModel.deleteUser(id)
}
