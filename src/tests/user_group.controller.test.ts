import request from 'supertest'
import express from 'express'
import * as UserGroupController from '../controllers/user_group.controller'
import * as UserGroupService from '../services/user_group.service'
import userGroupRoutes from '../routes/user_group.routes'

jest.mock('../services/user_group.service')

describe('UserGroupController', () => {
  let app: express.Application

  beforeAll(() => {
    app = express()
    app.use(express.json())
    app.use('/user-groups', userGroupRoutes)
  })

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('addUserToGroup', () => {
    it('should add a user to a group and return 201', async () => {
      ;(UserGroupService.addUserToGroup as jest.Mock).mockResolvedValue(true)

      const response = await request(app).post('/user-groups/join').send({ user_id: 1, group_id: 2 })

      expect(response.status).toBe(201)
      expect(response.body).toEqual({ message: 'User added to group successfully' })
      expect(UserGroupService.addUserToGroup).toHaveBeenCalledTimes(1)
      expect(UserGroupService.addUserToGroup).toHaveBeenCalledWith({ user_id: 1, group_id: 2 })
    })

    it('should return 400 if adding user to group fails', async () => {
      ;(UserGroupService.addUserToGroup as jest.Mock).mockResolvedValue(false)

      const response = await request(app).post('/user-groups/join').send({ user_id: 1, group_id: 2 })

      expect(response.status).toBe(400)
      expect(response.body).toEqual({ message: 'Failed to add user to group' })
      expect(UserGroupService.addUserToGroup).toHaveBeenCalledTimes(1)
    })

    it('should return 500 if there is an error', async () => {
      ;(UserGroupService.addUserToGroup as jest.Mock).mockRejectedValue(new Error('Database error'))

      const response = await request(app).post('/user-groups/join').send({ user_id: 1, group_id: 2 })

      expect(response.status).toBe(500)
      expect(response.body).toEqual({ message: 'Failed to add user to group' })
      expect(UserGroupService.addUserToGroup).toHaveBeenCalledTimes(1)
    })
  })

  // Add tests for removeUserFromGroup, getUsersInGroup, and getGroupsForUser similarly
})
