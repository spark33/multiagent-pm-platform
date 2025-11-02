import db from '../db/database'
import type { Task } from '../types'

export class TaskModel {
  /**
   * Get a task by its ID
   */
  static getById(id: string): Task | null {
    const row = db.prepare('SELECT * FROM tasks WHERE id = ?').get(id) as any

    if (!row) return null

    return {
      id: row.id,
      title: row.title,
      description: row.description,
      status: row.status,
      assignedAgent: row.assigned_agent || undefined,
      agentRole: row.agent_role || undefined,
      dependencies: JSON.parse(row.dependencies),
      deliverables: JSON.parse(row.deliverables),
      priority: row.priority
    }
  }

  /**
   * Get all tasks for a phase
   */
  static getByPhaseId(phaseId: string): Task[] {
    const rows = db.prepare('SELECT * FROM tasks WHERE phase_id = ? ORDER BY position').all(phaseId) as any[]

    return rows.map(row => ({
      id: row.id,
      title: row.title,
      description: row.description,
      status: row.status,
      assignedAgent: row.assigned_agent || undefined,
      agentRole: row.agent_role || undefined,
      dependencies: JSON.parse(row.dependencies),
      deliverables: JSON.parse(row.deliverables),
      priority: row.priority
    }))
  }

  /**
   * Update task status
   */
  static updateStatus(id: string, status: Task['status']): boolean {
    const result = db.prepare(`
      UPDATE tasks
      SET status = ?
      WHERE id = ?
    `).run(status, id)

    return result.changes > 0
  }

  /**
   * Assign an agent to a task
   */
  static assignAgent(id: string, agentName: string, agentRole: string): boolean {
    const result = db.prepare(`
      UPDATE tasks
      SET assigned_agent = ?, agent_role = ?
      WHERE id = ?
    `).run(agentName, agentRole, id)

    return result.changes > 0
  }
}
