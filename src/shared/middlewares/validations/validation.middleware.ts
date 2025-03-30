import { Request, Response, NextFunction } from 'express'
import Joi, { ObjectSchema } from 'joi'

/**
 * Define global Joi defaults to ensure consistent validation behavior.
 */
const JoiWithDefaults = Joi.defaults((schema) =>
  schema.options({
    abortEarly: false, // Return all validation errors
    allowUnknown: false, // Disallow unknown keys
    stripUnknown: true // Remove unknown keys
  })
)

/**
 * Defines structured API error response format.
 */
const formatValidationErrors = (error: Joi.ValidationError) => ({
  status: 'error',
  message: 'Validation failed',
  details: error.details.map((detail) => ({
    field: detail.path.join('.'),
    message: detail.message.replace(/['"]/g, '') // Clean up error messages
  }))
})

/**
 * Generic validation middleware generator.
 */
const validate =
  (schema: ObjectSchema) =>
  (req: Request, res: Response, next: NextFunction): any => {
    const { error, value } = schema.validate(req.body)

    if (error) {
      return res.status(422).json(formatValidationErrors(error))
    }

    req.body = value
    next()
  }

const userCreationSchema = JoiWithDefaults.object({
  name: Joi.string().trim().min(2).max(255).required(),
  surname: Joi.string().trim().min(2).max(255).required(),
  birth_date: Joi.date().iso().required(),
  sex: Joi.string().valid('male', 'female', 'other').required()
})

const userUpdateSchema = JoiWithDefaults.object({
  name: Joi.string().trim().min(2).max(255),
  surname: Joi.string().trim().min(2).max(255),
  birth_date: Joi.date().iso(),
  sex: Joi.string().valid('male', 'female', 'other')
})

const groupCreationSchema = JoiWithDefaults.object({
  name: Joi.string().trim().min(2).max(255).required()
})

const groupUpdateSchema = JoiWithDefaults.object({
  name: Joi.string().trim().min(2).max(255)
})

const userGroupSchema = JoiWithDefaults.object({
  user_id: Joi.number().integer().positive().required(),
  group_id: Joi.number().integer().positive().required()
})

const paginationSchema = JoiWithDefaults.object({
  page: Joi.number().integer().positive().default(1), // Default to 1 if not provided
  limit: Joi.number().integer().positive().max(100).default(10) // Default to 10 and max to 100 for safety
})

export const validatePagination = (req: Request, res: Response, next: NextFunction): any => {
  const { error, value } = paginationSchema.validate(req.query)

  if (error) {
    return res.status(422).json(formatValidationErrors(error))
  }

  req.query = value
  next()
}
export const validateUserCreation = validate(userCreationSchema)
export const validateUserUpdate = validate(userUpdateSchema)
export const validateGroupCreation = validate(groupCreationSchema)
export const validateGroupUpdate = validate(groupUpdateSchema)
export const validateUserGroupOperation = validate(userGroupSchema)
