import mysql from 'mysql2/promise'
import { dbConfig } from './index'

let pool: mysql.Pool | null = null

export const getConnection = async (): Promise<mysql.Pool> => {
  if (!pool) {    
    pool = mysql.createPool(dbConfig)
    console.log('Database pool created')
  }
  return pool
}

export const closeConnection = async (): Promise<void> => {
  if (pool) {
    await pool.end()
    console.log('Database pool closed')
    pool = null
  }
}
