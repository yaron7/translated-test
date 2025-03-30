import { getConnection } from '../../shared/config/database'
import { ResultSetHeader, RowDataPacket } from 'mysql2'
import { UserGroup } from './user-group.model'

export const addUserToGroup = async (userGroup: UserGroup): Promise<boolean> => {
  const pool = await getConnection()
  const [result] = await pool.execute<ResultSetHeader>('INSERT INTO user_groups (user_id, group_id) VALUES (?, ?)', [
    userGroup.user_id,
    userGroup.group_id
  ])
  return result.affectedRows > 0
}

export const removeUserFromGroup = async (userGroup: UserGroup): Promise<boolean> => {
  const pool = await getConnection()
  const [result] = await pool.execute<ResultSetHeader>('DELETE FROM user_groups WHERE user_id = ? AND group_id = ?', [
    userGroup.user_id,
    userGroup.group_id
  ])
  return result.affectedRows > 0
}

export const getUsersInGroup = async (groupId: number): Promise<number[]> => {
  const pool = await getConnection()
  const [rows] = await pool.execute<RowDataPacket[]>('SELECT user_id FROM user_groups WHERE group_id = ?', [groupId])
  return rows.map((row) => row.user_id) as number[]
}

export const getGroupsForUser = async (userId: number): Promise<number[]> => {
  const pool = await getConnection()
  const [rows] = await pool.execute<RowDataPacket[]>('SELECT group_id FROM user_groups WHERE user_id = ?', [userId])
  return rows.map((row) => row.group_id) as number[]
}
