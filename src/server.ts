import express, { Express } from 'express'
import { port } from './shared/config'
import { errorHandler } from './shared/middlewares/errors/error.handler'
import createDatabaseAndTables from './shared/db/setup'
import morgan from 'morgan'
import helmet from 'helmet'
import cors from 'cors'
import rateLimit from 'express-rate-limit'
import compression from 'compression'
import { StatusCodes } from 'http-status-codes'
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import userRoutes from './modules/users/user.routes'
import groupRoutes from './modules/group/group.routes'
import userGroupRoutes from './modules/user-group/user-group.routes'

const app: Express = express()

// Security Middleware
app.use(helmet())
app.use(cors())
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  statusCode: StatusCodes.TOO_MANY_REQUESTS,
  message: 'Too many requests from this IP, please try again after 15 minutes'
})
app.use(limiter)
app.use(compression())

// Logging Middleware (Development only)
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'))
}

// Body Parser Middleware
app.use(express.json())

// Swagger Setup
const swaggerOptions = {
  definition: {
      openapi: '3.0.0',
      info: {
          title: 'Your API Name',
          version: '1.0.0',
          description: 'A description of your API',
      },
  },
  apis: ['./src/routes/*.ts', './src/controllers/*.ts'], // Path to your API route files
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

// Routes
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use('/users', userRoutes)
app.use('/groups', groupRoutes)
app.use('/user-groups', userGroupRoutes)

// Error Handling Middleware
app.use(errorHandler)

// Database Setup and Server Start
createDatabaseAndTables()
  .then(() => {
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`)
    })
  })
  .catch((err: any) => {
    console.error('Failed to start server due to database setup error:', err)
    // Consider exiting the process if the database connection is critical
    process.exit(1)
  })

export default app
