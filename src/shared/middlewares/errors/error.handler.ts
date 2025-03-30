import { Request, Response, NextFunction } from 'express'

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(`[ERROR] ${req.method} ${req.originalUrl} -`, err)

  const statusCode = typeof err.status === 'number' ? err.status : 500
  const message = err instanceof Error ? err.message : 'Internal Server Error'

  res.status(statusCode).json({ message })
}
