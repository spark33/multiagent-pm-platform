import db from '../db/database'
import { v4 as uuidv4 } from 'uuid'
import type { Agent, CreateAgentRequest } from '../types'

export class AgentModel {
  static getAll(): Agent[] {
    const rows = db.prepare('SELECT * FROM agents ORDER BY created_at DESC').all() as any[]

    return rows.map(row => this.fromRow(row))
  }

  static getById(id: string): Agent | null {
    const row = db.prepare('SELECT * FROM agents WHERE id = ?').get(id) as any

    if (!row) return null

    return this.fromRow(row)
  }

  static getByIds(ids: string[]): Agent[] {
    if (ids.length === 0) return []

    const placeholders = ids.map(() => '?').join(', ')
    const rows = db.prepare(`SELECT * FROM agents WHERE id IN (${placeholders})`).all(...ids) as any[]

    return rows.map(row => this.fromRow(row))
  }

  static create(data: CreateAgentRequest): Agent {
    const id = uuidv4()
    const now = new Date().toISOString()

    db.prepare(`
      INSERT INTO agents (
        id, name, role, goal, backstory, tools, llm_provider, llm_model,
        allow_delegation, verbose, created_at, updated_at
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      id,
      data.name,
      data.role,
      data.goal,
      data.backstory,
      JSON.stringify(data.tools),
      data.llmProvider,
      data.llmModel,
      data.allowDelegation ? 1 : 0,
      data.verbose ? 1 : 0,
      now,
      now
    )

    return this.getById(id)!
  }

  static update(id: string, data: Partial<CreateAgentRequest>): Agent | null {
    const agent = this.getById(id)
    if (!agent) return null

    const now = new Date().toISOString()
    const fields: string[] = []
    const values: any[] = []

    if (data.name !== undefined) {
      fields.push('name = ?')
      values.push(data.name)
    }

    if (data.role !== undefined) {
      fields.push('role = ?')
      values.push(data.role)
    }

    if (data.goal !== undefined) {
      fields.push('goal = ?')
      values.push(data.goal)
    }

    if (data.backstory !== undefined) {
      fields.push('backstory = ?')
      values.push(data.backstory)
    }

    if (data.tools !== undefined) {
      fields.push('tools = ?')
      values.push(JSON.stringify(data.tools))
    }

    if (data.llmProvider !== undefined) {
      fields.push('llm_provider = ?')
      values.push(data.llmProvider)
    }

    if (data.llmModel !== undefined) {
      fields.push('llm_model = ?')
      values.push(data.llmModel)
    }

    if (data.allowDelegation !== undefined) {
      fields.push('allow_delegation = ?')
      values.push(data.allowDelegation ? 1 : 0)
    }

    if (data.verbose !== undefined) {
      fields.push('verbose = ?')
      values.push(data.verbose ? 1 : 0)
    }

    fields.push('updated_at = ?')
    values.push(now)

    values.push(id)

    if (fields.length > 1) {
      db.prepare(`
        UPDATE agents
        SET ${fields.join(', ')}
        WHERE id = ?
      `).run(...values)
    }

    return this.getById(id)
  }

  static delete(id: string): boolean {
    const result = db.prepare('DELETE FROM agents WHERE id = ?').run(id)
    return result.changes > 0
  }

  private static fromRow(row: any): Agent {
    return {
      id: row.id,
      name: row.name,
      role: row.role,
      goal: row.goal,
      backstory: row.backstory,
      tools: JSON.parse(row.tools),
      llmProvider: row.llm_provider,
      llmModel: row.llm_model,
      allowDelegation: Boolean(row.allow_delegation),
      verbose: Boolean(row.verbose),
      createdAt: row.created_at,
      updatedAt: row.updated_at
    }
  }
}
