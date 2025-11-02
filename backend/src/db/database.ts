import Database from 'better-sqlite3'
import path from 'path'
import fs from 'fs'

// Ensure data directory exists
const dataDir = path.join(__dirname, '../../data')
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true })
}

const dbPath = path.join(dataDir, 'multiagent.db')

// Create database connection
export const db = new Database(dbPath, { verbose: console.log })

// Enable foreign keys
db.pragma('foreign_keys = ON')

export default db
