import * as GroupRepository from './group.repository'
import { Group } from './group.model'

export const createGroup = async (group: Omit<Group, 'id'>): Promise<number> => {
  return GroupRepository.createGroup(group)
}

export const getGroupById = async (id: number): Promise<Group | undefined> => {
  return GroupRepository.getGroupById(id)
}

export const getAllGroups = async (): Promise<Group[]> => {
  return GroupRepository.getAllGroups()
}

export const updateGroup = async (id: number, group: Omit<Group, 'id'>): Promise<boolean> => {
  return GroupRepository.updateGroup(id, group)
}

export const deleteGroup = async (id: number): Promise<boolean> => {
  return GroupRepository.deleteGroup(id)
}
