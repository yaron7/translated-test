import { Request, Response } from 'express'
import * as GroupService from '../services/group.service'

export const createGroup = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name } = req.body
    const groupId = await GroupService.createGroup({ name })
    res.status(201).json({ id: groupId, message: 'Group created successfully' })
  } catch (error: any) {
    console.error('Error creating group:', error)
    res.status(500).json({ message: 'Failed to create group' })
  }
}

export const getGroupById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params
    const group = await GroupService.getGroupById(parseInt(id, 10))
    if (group) {
      res.json(group)
    } else {
      res.status(404).json({ message: 'Group not found' })
    }
  } catch (error: any) {
    console.error('Error getting group:', error)
    res.status(500).json({ message: 'Failed to get group' })
  }
}

export const getAllGroups = async (req: Request, res: Response): Promise<void> => {
  try {
    const groups = await GroupService.getAllGroups()
    res.json(groups)
  } catch (error: any) {
    console.error('Error getting all groups:', error)
    res.status(500).json({ message: 'Failed to get groups' })
  }
}

export const updateGroup = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params
    const { name } = req.body
    const updated = await GroupService.updateGroup(parseInt(id, 10), { name })
    if (updated) {
      res.json({ message: 'Group updated successfully' })
    } else {
      res.status(404).json({ message: 'Group not found' })
    }
  } catch (error: any) {
    console.error('Error updating group:', error)
    res.status(500).json({ message: 'Failed to update group' })
  }
}

export const deleteGroup = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params
    const deleted = await GroupService.deleteGroup(parseInt(id, 10))
    if (deleted) {
      res.status(204).send()
    } else {
      res.status(404).json({ message: 'Group not found' })
    }
  } catch (error: any) {
    console.error('Error deleting group:', error)
    res.status(500).json({ message: 'Failed to delete group' })
  }
}
