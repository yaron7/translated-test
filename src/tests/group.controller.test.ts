import express from 'express'
import request from 'supertest'
import * as GroupController from '../controllers/group.controller'
import * as GroupService from '../services/group.service'
import { validateGroupCreation, validateGroupUpdate } from '../middlewares/validations/validation.middleware'
import { Group } from '../models/group.model'

// Mock the GroupService and validation middleware
jest.mock('../services/group.service')
jest.mock('../middlewares/validations/validation.middleware', () => ({
  validateGroupCreation: jest.fn((req, res, next) => next()),
  validateGroupUpdate: jest.fn((req, res, next) => next())
}))

describe('GroupController', () => {
  let app: express.Application

  beforeAll(() => {
    app = express()
    app.use(express.json())
    app.post('/', validateGroupCreation, GroupController.createGroup)
    app.get('/:id', GroupController.getGroupById)
    app.get('/', GroupController.getAllGroups)
    app.put('/:id', validateGroupUpdate, GroupController.updateGroup)
    app.delete('/:id', GroupController.deleteGroup)
  })

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('createGroup', () => {
    it('should create a group and return 201 with the group ID', async () => {
      const mockGroupData: Omit<Group, 'id'> = { name: 'Test Group' }
      const mockGroupId = 1
      ;(GroupService.createGroup as jest.Mock).mockResolvedValue(mockGroupId)

      const response = await request(app).post('/').send(mockGroupData)

      expect(response.status).toBe(201)
      expect(response.body).toEqual({ id: mockGroupId, message: 'Group created successfully' })
      expect(GroupService.createGroup).toHaveBeenCalledWith(mockGroupData)
    })

    it('should return 500 if group creation fails', async () => {
      const mockGroupData: Omit<Group, 'id'> = { name: 'Test Group' }
      ;(GroupService.createGroup as jest.Mock).mockRejectedValue(new Error('Database error'))

      const response = await request(app).post('/').send(mockGroupData)

      expect(response.status).toBe(500)
      expect(response.body).toEqual({ message: 'Failed to create group' })
    })
  })

  describe('getGroupById', () => {
    it('should return 200 with the group if found', async () => {
      const mockGroupId = 1
      const mockGroup: Group = { id: mockGroupId, name: 'Test Group' }
      ;(GroupService.getGroupById as jest.Mock).mockResolvedValue(mockGroup)

      const response = await request(app).get(`/${mockGroupId}`)

      expect(response.status).toBe(200)
      expect(response.body).toEqual(mockGroup)
      expect(GroupService.getGroupById).toHaveBeenCalledWith(mockGroupId)
    })

    it('should return 404 if group is not found', async () => {
      const mockGroupId = 1
      ;(GroupService.getGroupById as jest.Mock).mockResolvedValue(undefined)

      const response = await request(app).get(`/${mockGroupId}`)

      expect(response.status).toBe(404)
      expect(response.body).toEqual({ message: 'Group not found' })
    })

    it('should return 500 if there is an error getting the group', async () => {
      const mockGroupId = 1
      ;(GroupService.getGroupById as jest.Mock).mockRejectedValue(new Error('Database error'))

      const response = await request(app).get(`/${mockGroupId}`)

      expect(response.status).toBe(500)
      expect(response.body).toEqual({ message: 'Failed to get group' })
    })
  })

  describe('getAllGroups', () => {
    it('should return 200 with all groups', async () => {
      const mockGroups: Group[] = [
        { id: 1, name: 'Group 1' },
        { id: 2, name: 'Group 2' }
      ]
      ;(GroupService.getAllGroups as jest.Mock).mockResolvedValue(mockGroups)

      const response = await request(app).get('/')

      expect(response.status).toBe(200)
      expect(response.body).toEqual(mockGroups)
      expect(GroupService.getAllGroups).toHaveBeenCalled()
    })

    it('should return 500 if there is an error getting all groups', async () => {
      ;(GroupService.getAllGroups as jest.Mock).mockRejectedValue(new Error('Database error'))

      const response = await request(app).get('/')

      expect(response.status).toBe(500)
      expect(response.body).toEqual({ message: 'Failed to get groups' })
    })
  })

  describe('updateGroup', () => {
    it('should return 200 with a success message if the group is updated', async () => {
      const mockGroupId = 1
      const mockGroupData: Omit<Group, 'id'> = { name: 'Updated Group' }
      ;(GroupService.updateGroup as jest.Mock).mockResolvedValue(true)

      const response = await request(app).put(`/${mockGroupId}`).send(mockGroupData)

      expect(response.status).toBe(200)
      expect(response.body).toEqual({ message: 'Group updated successfully' })
      expect(GroupService.updateGroup).toHaveBeenCalledWith(mockGroupId, mockGroupData)
    })

    it('should return 404 if the group is not found', async () => {
      const mockGroupId = 1
      const mockGroupData: Omit<Group, 'id'> = { name: 'Updated Group' }
      ;(GroupService.updateGroup as jest.Mock).mockResolvedValue(false)

      const response = await request(app).put(`/${mockGroupId}`).send(mockGroupData)

      expect(response.status).toBe(404)
      expect(response.body).toEqual({ message: 'Group not found' })
    })

    it('should return 500 if there is an error updating the group', async () => {
      const mockGroupId = 1
      const mockGroupData: Omit<Group, 'id'> = { name: 'Updated Group' }
      ;(GroupService.updateGroup as jest.Mock).mockRejectedValue(new Error('Database error'))

      const response = await request(app).put(`/${mockGroupId}`).send(mockGroupData)

      expect(response.status).toBe(500)
      expect(response.body).toEqual({ message: 'Failed to update group' })
    })
  })

  describe('deleteGroup', () => {
    it('should return 204 if the group is deleted', async () => {
      const mockGroupId = 1
      ;(GroupService.deleteGroup as jest.Mock).mockResolvedValue(true)

      const response = await request(app).delete(`/${mockGroupId}`)

      expect(response.status).toBe(204)
      expect(GroupService.deleteGroup).toHaveBeenCalledWith(mockGroupId)
    })

    it('should return 404 if the group is not found', async () => {
      const mockGroupId = 1
      ;(GroupService.deleteGroup as jest.Mock).mockResolvedValue(false)

      const response = await request(app).delete(`/${mockGroupId}`)

      expect(response.status).toBe(404)
      expect(response.body).toEqual({ message: 'Group not found' })
    })

    it('should return 500 if there is an error deleting the group', async () => {
      const mockGroupId = 1
      ;(GroupService.deleteGroup as jest.Mock).mockRejectedValue(new Error('Database error'))

      const response = await request(app).delete(`/${mockGroupId}`)

      expect(response.status).toBe(500)
      expect(response.body).toEqual({ message: 'Failed to delete group' })
    })
  })
})
