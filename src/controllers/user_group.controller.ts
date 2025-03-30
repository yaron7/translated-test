import { Request, Response } from 'express'
import * as UserGroupService from '../services/user_group.service'

export const addUserToGroup = async (req: Request, res: Response): Promise<void> => {
  try {
    const { user_id, group_id } = req.body
    const added = await UserGroupService.addUserToGroup({ user_id, group_id })
    if (added) {
      res.status(201).json({ message: 'User added to group successfully' })
    } else {
      res.status(400).json({ message: 'Failed to add user to group' })
    }
  } catch (error: any) {
    console.error('Error adding user to group:', error)
    res.status(500).json({ message: 'Failed to add user to group' })
  }
}

export const removeUserFromGroup = async (req: Request, res: Response): Promise<void> => {
  try {
    const { user_id, group_id } = req.body
    const removed = await UserGroupService.removeUserFromGroup({ user_id, group_id })
    if (removed) {
      res.status(200).json({ message: 'User removed from group successfully' })
    } else {
      res.status(400).json({ message: 'Failed to remove user from group' })
    }
  } catch (error: any) {
    console.error('Error removing user from group:', error)
    res.status(500).json({ message: 'Failed to remove user from group' })
  }
}

export const getUsersInGroup = async (req: Request, res: Response): Promise<void> => {
  try {
    const { group_id } = req.params
    const userIds = await UserGroupService.getUsersInGroup(parseInt(group_id, 10))
    res.json(userIds)
  } catch (error: any) {
    console.error('Error getting users in group:', error)
    res.status(500).json({ message: 'Failed to get users in group' })
  }
}

export const getGroupsForUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { user_id } = req.params
    const groupIds = await UserGroupService.getGroupsForUser(parseInt(user_id, 10))
    res.json(groupIds)
  } catch (error: any) {
    console.error('Error getting groups for user:', error)
    res.status(500).json({ message: 'Failed to get groups for user' })
  }
}
