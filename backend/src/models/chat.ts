import db from '../db/database'
import { v4 as uuidv4 } from 'uuid'
import type { ChatMessage, MessageRole } from '../types'

export class ChatModel {
  static getHistory(projectId: string): ChatMessage[] {
    const rows = db.prepare(`
      SELECT * FROM chat_messages
      WHERE project_id = ?
      ORDER BY timestamp ASC
    `).all(projectId) as any[]

    return rows.map(row => ({
      id: row.id,
      role: row.role as MessageRole,
      content: row.content,
      timestamp: row.timestamp
    }))
  }

  static addMessage(projectId: string, role: MessageRole, content: string): ChatMessage {
    const id = uuidv4()
    const timestamp = new Date().toISOString()

    db.prepare(`
      INSERT INTO chat_messages (id, project_id, role, content, timestamp)
      VALUES (?, ?, ?, ?, ?)
    `).run(id, projectId, role, content, timestamp)

    return {
      id,
      role,
      content,
      timestamp
    }
  }

  static deleteByProject(projectId: string): void {
    db.prepare('DELETE FROM chat_messages WHERE project_id = ?').run(projectId)
  }
}
