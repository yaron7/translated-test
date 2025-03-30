import mysql from 'mysql2/promise'
import { getConnection } from '../config/database'
import { dbConfig } from '../config/index'

const createDatabaseAndTables = async () => {
  let tempConnection: mysql.Connection | null = null
  try {
    console.log('⏳ Connecting to MySQL to ensure the database exists...')

    // Create a direct connection (NOT a pool) for database creation
    tempConnection = await mysql.createConnection({
      host: dbConfig.host,
      user: dbConfig.user,
      password: dbConfig.password
    })

    await tempConnection.query('CREATE DATABASE IF NOT EXISTS user_management')
    console.log('✅ Database user_management is ready.')

    // Close temporary connection
    await tempConnection.end()

    // Now use the connection pool
    const pool = await getConnection()

    // Ensure database is selected
    await pool.query('USE user_management')

    const tables = [
      {
        name: 'users',
        createQuery: `
          CREATE TABLE IF NOT EXISTS users (
            id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            surname VARCHAR(255) NOT NULL,
            birth_date DATE NOT NULL,
            sex ENUM('male', 'female', 'other') NOT NULL,
            INDEX idx_name (name),
            INDEX idx_surname (surname)
          )
        `
      },
      {
        name: 'groups',
        createQuery: `
          CREATE TABLE IF NOT EXISTS \`groups\` (
            id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            UNIQUE INDEX idx_group_name (name)
          )
        `
      },
      {
        name: 'user_groups',
        createQuery: `
          CREATE TABLE IF NOT EXISTS user_groups (
            user_id INT NOT NULL,
            group_id INT NOT NULL,
            PRIMARY KEY (user_id, group_id),
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
            FOREIGN KEY (group_id) REFERENCES \`groups\`(id) ON DELETE CASCADE
          )
        `
      }
    ]

    for (const table of tables) {
      console.log(`⏳ Checking table: ${table.name}`)
      const [exists] = await pool.query(`SHOW TABLES LIKE ?`, [table.name])
      if ((exists as any[]).length === 0) {
        console.log(`🛠️ Creating ${table.name} table...`)
        await pool.query(table.createQuery)
        console.log(`✅ ${table.name} table created.`)
      } else {
        console.log(`✅ ${table.name} table already exists.`)
      }
    }

    console.log('✨ Database setup complete.')
  } catch (error: any) {
    console.error('❌ Database setup failed:', error.message)
    throw error
  }
}

export default createDatabaseAndTables
