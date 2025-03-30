import { UserGroup } from './user-group.model.js'
import * as UserGroupRepository from './user-group.repository'

export const addUserToGroup = async (userGroup: UserGroup): Promise<boolean> => {
  return UserGroupRepository.addUserToGroup(userGroup)
}

export const removeUserFromGroup = async (userGroup: UserGroup): Promise<boolean> => {
  return UserGroupRepository.removeUserFromGroup(userGroup)
}

export const getUsersInGroup = async (groupId: number): Promise<number[]> => {
  return UserGroupRepository.getUsersInGroup(groupId)
}

export const getGroupsForUser = async (userId: number): Promise<number[]> => {
  return UserGroupRepository.getGroupsForUser(userId)
}
