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

  // Task Executions - tracks the execution state of each task
  db.exec(`
    CREATE TABLE IF NOT EXISTS task_executions (
      id TEXT PRIMARY KEY,
      task_id TEXT NOT NULL,
      phase_id TEXT NOT NULL,
      project_id TEXT NOT NULL,
      status TEXT NOT NULL CHECK(status IN ('pending', 'in_progress', 'under_discussion', 'awaiting_consensus', 'awaiting_user', 'completed')),
      primary_agent_id TEXT NOT NULL,
      reviewer_agent_ids TEXT NOT NULL DEFAULT '[]',
      current_round INTEGER NOT NULL DEFAULT 0,
      max_rounds INTEGER NOT NULL DEFAULT 7,
      discussion_thread_id TEXT,
      current_deliverable_id TEXT,
      started_at TEXT,
      completed_at TEXT,
      FOREIGN KEY (project_id) REFERENCES projects(id)
    )
  `)

  // Discussion Threads - agent collaboration conversations
  db.exec(`
    CREATE TABLE IF NOT EXISTS discussion_threads (
      id TEXT PRIMARY KEY,
      task_execution_id TEXT NOT NULL,
      status TEXT NOT NULL CHECK(status IN ('active', 'consensus_reached', 'awaiting_user', 'closed')),
      created_at TEXT NOT NULL,
      FOREIGN KEY (task_execution_id) REFERENCES task_executions(id)
    )
  `)

  // Discussion Messages - individual agent messages in discussions
  db.exec(`
    CREATE TABLE IF NOT EXISTS discussion_messages (
      id TEXT PRIMARY KEY,
      thread_id TEXT NOT NULL,
      agent_id TEXT NOT NULL,
      agent_name TEXT NOT NULL,
      agent_role TEXT NOT NULL,
      round INTEGER NOT NULL,
      message_type TEXT NOT NULL CHECK(message_type IN ('initial_review', 'response', 'revision', 'question', 'approval', 'concern', 'user_feedback')),
      content TEXT NOT NULL,
      deliverable_version INTEGER,
      approval_status TEXT CHECK(approval_status IN ('approved', 'has_concerns', 'pending')),
      timestamp TEXT NOT NULL,
      FOREIGN KEY (thread_id) REFERENCES discussion_threads(id),
      FOREIGN KEY (agent_id) REFERENCES agents(id)
    )
  `)

  // Deliverables - versioned outputs from tasks
  db.exec(`
    CREATE TABLE IF NOT EXISTS deliverables (
      id TEXT PRIMARY KEY,
      task_execution_id TEXT NOT NULL,
      version INTEGER NOT NULL,
      content TEXT NOT NULL,
      created_by TEXT NOT NULL,
      description TEXT NOT NULL,
      created_at TEXT NOT NULL,
      FOREIGN KEY (task_execution_id) REFERENCES task_executions(id),
      FOREIGN KEY (created_by) REFERENCES agents(id)
    )
  `)

  // User Reviews - user feedback on completed tasks
  db.exec(`
    CREATE TABLE IF NOT EXISTS user_reviews (
      id TEXT PRIMARY KEY,
      task_execution_id TEXT NOT NULL,
      status TEXT NOT NULL CHECK(status IN ('pending', 'approved', 'feedback_provided')),
      user_feedback TEXT,
      reviewed_at TEXT,
      FOREIGN KEY (task_execution_id) REFERENCES task_executions(id)
    )
  `)

  console.log('✅ Database tables created successfully')
}

export function dropTables() {
  db.exec(`DROP TABLE IF EXISTS user_reviews`)
  db.exec(`DROP TABLE IF EXISTS deliverables`)
  db.exec(`DROP TABLE IF EXISTS discussion_messages`)
  db.exec(`DROP TABLE IF EXISTS discussion_threads`)
  db.exec(`DROP TABLE IF EXISTS task_executions`)
  db.exec(`DROP TABLE IF EXISTS tasks`)
  db.exec(`DROP TABLE IF EXISTS phases`)
  db.exec(`DROP TABLE IF EXISTS roadmaps`)
  db.exec(`DROP TABLE IF EXISTS chat_messages`)
  db.exec(`DROP TABLE IF EXISTS projects`)
  db.exec(`DROP TABLE IF EXISTS agents`)
  console.log('✅ Database tables dropped')
}
