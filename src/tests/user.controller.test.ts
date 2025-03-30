import request from 'supertest'
import express from 'express'
import * as UserController from '../controllers/user.controller'
import * as UserService from '../services/user.service'
import userRoutes from '../routes/user.routes'
import { Sex } from '../models/user.model'

// Mock the UserService module
jest.mock('../services/user.service')

describe('UserController', () => {
  let app: express.Application

  beforeAll(() => {
    app = express()
    app.use(express.json())
    app.use('/users', userRoutes)
  })

  beforeEach(() => {
    // Reset the mock before each test
    jest.clearAllMocks()
  })

  describe('createUser', () => {
    it('should create a user and return 201 with the user ID', async () => {
      const mockUserId = 1
      ;(UserService.createUser as jest.Mock).mockResolvedValue(mockUserId)

      const response = await request(app)
        .post('/users')
        .send({ name: 'John', surname: 'Doe', birth_date: '2000-01-01', sex: 'male' })

      expect(response.status).toBe(201)
      expect(response.body).toEqual({ id: mockUserId, message: 'User created successfully' })
      expect(UserService.createUser).toHaveBeenCalledTimes(1)
      expect(UserService.createUser).toHaveBeenCalledWith({
        name: 'John',
        surname: 'Doe',
        birth_date: new Date('2000-01-01'),
        sex: 'male'
      })
    })

    it('should return 500 if user creation fails', async () => {
      ;(UserService.createUser as jest.Mock).mockRejectedValue(new Error('Database error'))

      const response = await request(app)
        .post('/users')
        .send({ name: 'John', surname: 'Doe', birth_date: '2000-01-01', sex: 'male' })

      expect(response.status).toBe(500)
      expect(response.body).toEqual({ message: 'Failed to create user' })
      expect(UserService.createUser).toHaveBeenCalledTimes(1)
    })
  })

  describe('getUserById', () => {
    it('should return 200 with the user if found', async () => {
      const mockUser = {
        id: 1,
        name: 'John',
        surname: 'Doe',
        birth_date: new Date('2000-01-01').toISOString(),
        sex: Sex.Male
      }
      ;(UserService.getUserById as jest.Mock).mockResolvedValue(mockUser)

      const response = await request(app).get('/users/1')

      expect(response.status).toBe(200)
      expect(response.body).toEqual(mockUser)
      expect(UserService.getUserById).toHaveBeenCalledTimes(1)
      expect(UserService.getUserById).toHaveBeenCalledWith(1)
    })

    it('should return 404 if user is not found', async () => {
      ;(UserService.getUserById as jest.Mock).mockResolvedValue(undefined)

      const response = await request(app).get('/users/1')

      expect(response.status).toBe(404)
      expect(response.body).toEqual({ message: 'User not found' })
      expect(UserService.getUserById).toHaveBeenCalledTimes(1)
      expect(UserService.getUserById).toHaveBeenCalledWith(1)
    })

    it('should return 500 if there is an error', async () => {
      ;(UserService.getUserById as jest.Mock).mockRejectedValue(new Error('Database error'))

      const response = await request(app).get('/users/1')

      expect(response.status).toBe(500)
      expect(response.body).toEqual({ message: 'Failed to get user' })
      expect(UserService.getUserById).toHaveBeenCalledTimes(1)
    })
  })

  describe('getAllUsers', () => {
    it('should return 200 with all users and pagination', async () => {
      const mockUsers = [
        { id: 1, name: 'John', surname: 'Doe', birth_date: '2000-01-01', sex: 'male' },
        { id: 2, name: 'Jane', surname: 'Doe', birth_date: '2000-02-01', sex: 'female' }
      ]
      const mockTotalCount = 50 // Assume we have 50 total users
      const mockResponse = {
        users: mockUsers,
        totalCount: mockTotalCount,
        totalPages: Math.ceil(mockTotalCount / 10), // Assuming default limit is 10
        currentPage: 1
      }

      // Mocking the UserService to return paginated users
      ;(UserService.getAllUsers as jest.Mock).mockResolvedValue({
        users: mockUsers,
        totalCount: mockTotalCount
      })

      const response = await request(app).get('/users?page=1&limit=10')

      expect(response.status).toBe(200)
      expect(response.body).toEqual(mockResponse)
      expect(UserService.getAllUsers).toHaveBeenCalledWith(10, 0) // Verifying the offset and limit passed to service
      expect(UserService.getAllUsers).toHaveBeenCalledTimes(1)
    })

    it('should return 200 with correct pagination when a different page is requested', async () => {
      const mockUsers = [
        { id: 1, name: 'John', surname: 'Doe', birth_date: '2000-01-01', sex: 'male' },
        { id: 2, name: 'Jane', surname: 'Doe', birth_date: '2000-02-01', sex: 'female' }
      ]
      const mockTotalCount = 50
      const mockResponse = {
        users: mockUsers,
        totalCount: mockTotalCount,
        totalPages: Math.ceil(mockTotalCount / 10),
        currentPage: 2
      }

      ;(UserService.getAllUsers as jest.Mock).mockResolvedValue({
        users: mockUsers,
        totalCount: mockTotalCount
      })

      const response = await request(app).get('/users?page=2&limit=10')

      expect(response.status).toBe(200)
      expect(response.body).toEqual(mockResponse)
      expect(UserService.getAllUsers).toHaveBeenCalledWith(10, 10) // Verifying the offset (page 2 * limit 10)
      expect(UserService.getAllUsers).toHaveBeenCalledTimes(1)
    })

    it('should return 200 with default pagination if no page or limit is provided', async () => {
      const mockUsers = [
        { id: 1, name: 'John', surname: 'Doe', birth_date: '2000-01-01', sex: 'male' },
        { id: 2, name: 'Jane', surname: 'Doe', birth_date: '2000-02-01', sex: 'female' }
      ]
      const mockTotalCount = 50
      const mockResponse = {
        users: mockUsers,
        totalCount: mockTotalCount,
        totalPages: Math.ceil(mockTotalCount / 10),
        currentPage: 1
      }

      ;(UserService.getAllUsers as jest.Mock).mockResolvedValue({
        users: mockUsers,
        totalCount: mockTotalCount
      })

      const response = await request(app).get('/users')

      expect(response.status).toBe(200)
      expect(response.body).toEqual(mockResponse)
      expect(UserService.getAllUsers).toHaveBeenCalledWith(10, 0) // Verifying the default offset and limit
      expect(UserService.getAllUsers).toHaveBeenCalledTimes(1)
    })
  })

  describe('updateUser', () => {
    it('should return 200 if user is updated successfully', async () => {
      const updatedUser = { id: 1, name: 'John', surname: 'Doe', birth_date: '2000-01-01', sex: 'male' }
      ;(UserService.updateUser as jest.Mock).mockResolvedValue(true)

      const response = await request(app)
        .put('/users/1')
        .send({ name: 'John', surname: 'Doe', birth_date: '2000-01-01', sex: 'male' })

      expect(response.status).toBe(200)
      expect(response.body).toEqual({ message: 'User updated successfully' })
      expect(UserService.updateUser).toHaveBeenCalledTimes(1)
      expect(UserService.updateUser).toHaveBeenCalledWith(1, {
        name: 'John',
        surname: 'Doe',
        birth_date: new Date('2000-01-01'),
        sex: 'male'
      })
    })

    it('should return 404 if user is not found', async () => {
      ;(UserService.updateUser as jest.Mock).mockResolvedValue(false)

      const response = await request(app)
        .put('/users/1')
        .send({ name: 'John', surname: 'Doe', birth_date: '2000-01-01', sex: 'male' })

      expect(response.status).toBe(404)
      expect(response.body).toEqual({ message: 'User not found' })
      expect(UserService.updateUser).toHaveBeenCalledTimes(1)
    })
  })

  describe('deleteUser', () => {
    it('should return 204 if user is deleted successfully', async () => {
      ;(UserService.deleteUser as jest.Mock).mockResolvedValue(true)

      const response = await request(app).delete('/users/1')

      expect(response.status).toBe(204)
      expect(UserService.deleteUser).toHaveBeenCalledTimes(1)
    })

    it('should return 404 if user is not found', async () => {
      ;(UserService.deleteUser as jest.Mock).mockResolvedValue(false)

      const response = await request(app).delete('/users/1')

      expect(response.status).toBe(404)
      expect(response.body).toEqual({ message: 'User not found' })
      expect(UserService.deleteUser).toHaveBeenCalledTimes(1)
    })
  })
})
