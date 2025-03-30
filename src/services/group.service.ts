import * as GroupModel from '../models/group.model'
import { Group } from '../models/group.model'

export const createGroup = async (group: Omit<Group, 'id'>): Promise<number> => {
  return GroupModel.createGroup(group)
}

export const getGroupById = async (id: number): Promise<Group | undefined> => {
  return GroupModel.getGroupById(id)
}

export const getAllGroups = async (): Promise<Group[]> => {
  return GroupModel.getAllGroups()
}

export const updateGroup = async (id: number, group: Omit<Group, 'id'>): Promise<boolean> => {
  return GroupModel.updateGroup(id, group)
}

export const deleteGroup = async (id: number): Promise<boolean> => {
  return GroupModel.deleteGroup(id)
}
