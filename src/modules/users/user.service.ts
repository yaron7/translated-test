import * as UserRepository from './user.repository'
import { User } from './user.model'

export const createUser = async (user: Omit<User, 'id'>): Promise<number> => {
  return UserRepository.createUser(user)
}

export const getUserById = async (id: number): Promise<User | undefined> => {
  return UserRepository.getUserById(id)
}

export const getAllUsers = async (limit: number, offset: number): Promise<{ users: User[], totalCount: number }> => {
  return UserRepository.getAllUsers(limit, offset)
}

export const updateUser = async (id: number, user: Omit<User, 'id'>): Promise<boolean> => {
  return UserRepository.updateUser(id, user)
}

export const deleteUser = async (id: number): Promise<boolean> => {
  return UserRepository.deleteUser(id)
}
