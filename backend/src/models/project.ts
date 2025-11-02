import db from '../db/database'
import { v4 as uuidv4 } from 'uuid'
import type { Project, ProjectContext, ProjectStatus, Roadmap, Phase, Task } from '../types'

export class ProjectModel {
  static getAll(): Project[] {
    const rows = db.prepare('SELECT * FROM projects ORDER BY created_at DESC').all() as any[]

    return rows.map(row => this.fromRow(row))
  }

  static getById(id: string): Project | null {
    const row = db.prepare('SELECT * FROM projects WHERE id = ?').get(id) as any

    if (!row) return null

    return this.fromRow(row)
  }

  static create(description: string): Project {
    const id = uuidv4()
    const now = new Date().toISOString()

    // Generate a simple title from description (first 50 chars)
    const title = description.length > 50
      ? description.substring(0, 47) + '...'
      : description

    const context: ProjectContext = {}

    db.prepare(`
      INSERT INTO projects (id, title, description, status, created_at, updated_at, context)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(id, title, description, 'discovery', now, now, JSON.stringify(context))

    return this.getById(id)!
  }

  static update(id: string, updates: Partial<Project>): Project | null {
    const project = this.getById(id)
    if (!project) return null

    const now = new Date().toISOString()
    const fields: string[] = []
    const values: any[] = []

    if (updates.title !== undefined) {
      fields.push('title = ?')
      values.push(updates.title)
    }

    if (updates.description !== undefined) {
      fields.push('description = ?')
      values.push(updates.description)
    }

    if (updates.status !== undefined) {
      fields.push('status = ?')
      values.push(updates.status)
    }

    if (updates.context !== undefined) {
      fields.push('context = ?')
      values.push(JSON.stringify(updates.context))
    }

    fields.push('updated_at = ?')
    values.push(now)

    values.push(id)

    if (fields.length > 1) { // More than just updated_at
      db.prepare(`
        UPDATE projects
        SET ${fields.join(', ')}
        WHERE id = ?
      `).run(...values)
    }

    return this.getById(id)
  }

  static delete(id: string): boolean {
    const result = db.prepare('DELETE FROM projects WHERE id = ?').run(id)
    return result.changes > 0
  }

  private static fromRow(row: any): Project {
    const roadmap = this.getRoadmap(row.id)

    return {
      id: row.id,
      title: row.title,
      description: row.description,
      status: row.status as ProjectStatus,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
      context: JSON.parse(row.context) as ProjectContext,
      roadmap: roadmap || undefined
    }
  }

  private static getRoadmap(projectId: string): Roadmap | null {
    const roadmapRow = db.prepare('SELECT * FROM roadmaps WHERE project_id = ?').get(projectId) as any

    if (!roadmapRow) return null

    const phaseRows = db.prepare('SELECT * FROM phases WHERE roadmap_id = ? ORDER BY position').all(roadmapRow.id) as any[]

    const phases: Phase[] = phaseRows.map(phaseRow => {
      const taskRows = db.prepare('SELECT * FROM tasks WHERE phase_id = ? ORDER BY position').all(phaseRow.id) as any[]

      const tasks: Task[] = taskRows.map(taskRow => ({
        id: taskRow.id,
        title: taskRow.title,
        description: taskRow.description,
        status: taskRow.status,
        assignedAgent: taskRow.assigned_agent || undefined,
        agentRole: taskRow.agent_role || undefined,
        dependencies: JSON.parse(taskRow.dependencies),
        deliverables: JSON.parse(taskRow.deliverables),
        priority: taskRow.priority
      }))

      return {
        id: phaseRow.id,
        name: phaseRow.name,
        title: phaseRow.title,
        description: phaseRow.description,
        objective: phaseRow.objective,
        status: phaseRow.status,
        tasks,
        dependencies: JSON.parse(phaseRow.dependencies),
        deliverables: JSON.parse(phaseRow.deliverables)
      }
    })

    return {
      phases,
      generatedAt: roadmapRow.generated_at,
      approvedAt: roadmapRow.approved_at || undefined,
      approvedBy: roadmapRow.approved_by || undefined,
      summary: roadmapRow.summary
    }
  }

  static saveRoadmap(projectId: string, roadmap: Roadmap): void {
    const roadmapId = uuidv4()

    // Insert roadmap
    db.prepare(`
      INSERT INTO roadmaps (id, project_id, summary, generated_at, approved_at, approved_by)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(
      roadmapId,
      projectId,
      roadmap.summary,
      roadmap.generatedAt,
      roadmap.approvedAt || null,
      roadmap.approvedBy || null
    )

    // Insert phases
    roadmap.phases.forEach((phase, phaseIndex) => {
      const phaseId = phase.id || uuidv4()

      db.prepare(`
        INSERT INTO phases (id, roadmap_id, name, title, description, objective, status, dependencies, deliverables, position)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(
        phaseId,
        roadmapId,
        phase.name,
        phase.title,
        phase.description,
        phase.objective,
        phase.status,
        JSON.stringify(phase.dependencies || []),
        JSON.stringify(phase.deliverables),
        phaseIndex
      )

      // Insert tasks
      phase.tasks.forEach((task, taskIndex) => {
        db.prepare(`
          INSERT INTO tasks (id, phase_id, title, description, status, assigned_agent, agent_role, dependencies, deliverables, priority, position)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `).run(
          task.id || uuidv4(),
          phaseId,
          task.title,
          task.description,
          task.status,
          task.assignedAgent || null,
          task.agentRole || null,
          JSON.stringify(task.dependencies || []),
          JSON.stringify(task.deliverables),
          task.priority,
          taskIndex
        )
      })
    })
  }

  static updatePhaseStatus(projectId: string, phaseId: string, status: 'pending' | 'in_progress' | 'completed'): boolean {
    const result = db.prepare(`
      UPDATE phases
      SET status = ?
      WHERE id = ? AND roadmap_id IN (
        SELECT id FROM roadmaps WHERE project_id = ?
      )
    `).run(status, phaseId, projectId)

    return result.changes > 0
  }
}
