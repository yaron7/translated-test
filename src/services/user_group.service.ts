import * as UserGroupModel from '../models/user_group.model'

interface UserGroup {
  user_id: number
  group_id: number
}

export const addUserToGroup = async (userGroup: UserGroup): Promise<boolean> => {
  return UserGroupModel.addUserToGroup(userGroup)
}

export const removeUserFromGroup = async (userGroup: UserGroup): Promise<boolean> => {
  return UserGroupModel.removeUserFromGroup(userGroup)
}

export const getUsersInGroup = async (groupId: number): Promise<number[]> => {
  return UserGroupModel.getUsersInGroup(groupId)
}

export const getGroupsForUser = async (userId: number): Promise<number[]> => {
  return UserGroupModel.getGroupsForUser(userId)
}
