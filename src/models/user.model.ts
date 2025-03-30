import { getConnection } from '../config/database'
import { ResultSetHeader, RowDataPacket } from 'mysql2'

export enum Sex {
  Male = 'male',
  Female = 'female',
  Other = 'other'
}

export interface User {
  id?: number
  name: string
  surname: string
  birth_date: Date
  sex: Sex
}

interface UserRow extends User, RowDataPacket {}

export const createUser = async (user: Omit<User, 'id'>): Promise<number> => {
  const pool = await getConnection()
  const [result] = await pool.execute<ResultSetHeader>(
    'INSERT INTO users (name, surname, birth_date, sex) VALUES (?, ?, ?, ?)',
    [user.name, user.surname, user.birth_date, user.sex]
  )

  return result.insertId
}

export const getUserById = async (id: number): Promise<User | undefined> => {
  const pool = await getConnection()
  const [rows] = await pool.execute<UserRow[]>('SELECT * FROM users WHERE id = ?', [id])
  return rows[0]
}

export const getAllUsers = async (limit: number, offset: number): Promise<{ users: User[]; totalCount: number }> => {
  const pool = await getConnection()

  const [rowsResult, totalCountResult] = await Promise.all([
    pool.execute<UserRow[]>(`SELECT * FROM users LIMIT ? OFFSET ?`, [limit.toString(), offset.toString()]),
    pool.execute<any>(`SELECT COUNT(*) as count FROM users`)
  ])

  const users = rowsResult[0] as User[]
  const totalCount = totalCountResult[0][0]?.count ?? 0

  return { users, totalCount }
}

export const updateUser = async (id: number, user: Omit<User, 'id'>): Promise<boolean> => {
  const pool = await getConnection()
  const [result] = await pool.execute<ResultSetHeader>(
    'UPDATE users SET name = ?, surname = ?, birth_date = ?, sex = ? WHERE id = ?',
    [user.name, user.surname, user.birth_date, user.sex, id]
  )
  return result.affectedRows > 0
}

export const deleteUser = async (id: number): Promise<boolean> => {
  const pool = await getConnection()
  const [result] = await pool.execute<ResultSetHeader>('DELETE FROM users WHERE id = ?', [id])
  return result.affectedRows > 0
}
