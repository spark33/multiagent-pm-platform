import db from './database'

export function createTables() {
  // Projects table
  db.exec(`
    CREATE TABLE IF NOT EXISTS projects (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      status TEXT NOT NULL CHECK(status IN ('discovery', 'roadmap', 'execution', 'completed')),
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL,
      context TEXT NOT NULL DEFAULT '{}'
    )
  `)

  // Chat messages table
  db.exec(`
    CREATE TABLE IF NOT EXISTS chat_messages (
      id TEXT PRIMARY KEY,
      project_id TEXT NOT NULL,
      role TEXT NOT NULL CHECK(role IN ('user', 'assistant', 'system')),
      content TEXT NOT NULL,
      timestamp TEXT NOT NULL,
      FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
    )
  `)

  // Create index on project_id for faster chat history queries
  db.exec(`
    CREATE INDEX IF NOT EXISTS idx_chat_messages_project_id
    ON chat_messages(project_id)
  `)

  // Roadmaps table
  db.exec(`
    CREATE TABLE IF NOT EXISTS roadmaps (
      id TEXT PRIMARY KEY,
      project_id TEXT NOT NULL UNIQUE,
      summary TEXT NOT NULL,
      generated_at TEXT NOT NULL,
      approved_at TEXT,
      approved_by TEXT,
      FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
    )
  `)

  // Phases table
  db.exec(`
    CREATE TABLE IF NOT EXISTS phases (
      id TEXT PRIMARY KEY,
      roadmap_id TEXT NOT NULL,
      name TEXT NOT NULL CHECK(name IN ('research', 'strategy', 'design', 'architecture', 'development', 'launch')),
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      objective TEXT NOT NULL,
      status TEXT NOT NULL CHECK(status IN ('pending', 'in_progress', 'completed')),
      dependencies TEXT NOT NULL DEFAULT '[]',
      deliverables TEXT NOT NULL DEFAULT '[]',
      position INTEGER NOT NULL,
      FOREIGN KEY (roadmap_id) REFERENCES roadmaps(id) ON DELETE CASCADE
    )
  `)

  // Tasks table
  db.exec(`
    CREATE TABLE IF NOT EXISTS tasks (
      id TEXT PRIMARY KEY,
      phase_id TEXT NOT NULL,
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      status TEXT NOT NULL CHECK(status IN ('pending', 'in_progress', 'completed')),
      assigned_agent TEXT,
      agent_role TEXT,
      dependencies TEXT NOT NULL DEFAULT '[]',
      deliverables TEXT NOT NULL DEFAULT '[]',
      priority TEXT NOT NULL CHECK(priority IN ('high', 'medium', 'low')),
      position INTEGER NOT NULL,
      FOREIGN KEY (phase_id) REFERENCES phases(id) ON DELETE CASCADE
    )
  `)

  // Agents table
  db.exec(`
    CREATE TABLE IF NOT EXISTS agents (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      role TEXT NOT NULL,
      goal TEXT NOT NULL,
      backstory TEXT NOT NULL,
      tools TEXT NOT NULL DEFAULT '[]',
      llm_provider TEXT NOT NULL,
      llm_model TEXT NOT NULL,
      allow_delegation INTEGER NOT NULL DEFAULT 0,
      verbose INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    )
  `)

  console.log('✅ Database tables created successfully')
}

export function dropTables() {
  db.exec(`DROP TABLE IF EXISTS tasks`)
  db.exec(`DROP TABLE IF EXISTS phases`)
  db.exec(`DROP TABLE IF EXISTS roadmaps`)
  db.exec(`DROP TABLE IF EXISTS chat_messages`)
  db.exec(`DROP TABLE IF EXISTS projects`)
  db.exec(`DROP TABLE IF EXISTS agents`)
  console.log('✅ Database tables dropped')
}
