import { getConnection } from '../config/database'
import { RowDataPacket, ResultSetHeader } from 'mysql2'

export interface Group {
  id?: number
  name: string
}

interface GroupRow extends Group, RowDataPacket {}

export const createGroup = async (group: Omit<Group, 'id'>): Promise<number> => {
  const pool = await getConnection()

  const [rows]: any = await pool.execute('SELECT COUNT(*) as count FROM `groups` WHERE name = ?', [group.name])

  if (rows[0].count > 0) {
    throw new Error('Group name already exists')
  }

  const [result] = await pool.execute<ResultSetHeader>('INSERT INTO `groups` (name) VALUES (?)', [group.name])
  return result.insertId
}

export const getGroupById = async (id: number): Promise<Group | undefined> => {
  const pool = await getConnection()
  const [rows] = await pool.execute<RowDataPacket[]>('SELECT * FROM `groups` WHERE id = ?', [id])
  return (rows as GroupRow[])[0]
}

export const getAllGroups = async (): Promise<Group[]> => {
  const pool = await getConnection()
  const [rows] = await pool.execute<RowDataPacket[]>('SELECT * FROM `groups`')
  return rows as Group[]
}

export const updateGroup = async (id: number, group: Omit<Group, 'id'>): Promise<boolean> => {
  const pool = await getConnection()
  const [result] = await pool.execute<ResultSetHeader>('UPDATE `groups` SET name = ? WHERE id = ?', [group.name, id])
  return result.affectedRows > 0
}

export const deleteGroup = async (id: number): Promise<boolean> => {
  const pool = await getConnection()
  const [result] = await pool.execute<ResultSetHeader>('DELETE FROM `groups` WHERE id = ?', [id])
  return result.affectedRows > 0
}
