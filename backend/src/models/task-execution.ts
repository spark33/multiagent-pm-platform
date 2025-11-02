import db from '../db/database'
import { v4 as uuidv4 } from 'uuid'
import type {
  TaskExecution,
  TaskExecutionStatus,
  DiscussionThread,
  DiscussionMessage,
  Deliverable,
  UserReview,
  MessageType,
  ApprovalStatus
} from '../types'

export class TaskExecutionModel {
  // Create a new task execution
  static create(
    taskId: string,
    phaseId: string,
    projectId: string,
    primaryAgentId: string,
    reviewerAgentIds: string[]
  ): TaskExecution {
    const id = uuidv4()
    const now = new Date().toISOString()

    db.prepare(`
      INSERT INTO task_executions (
        id, task_id, phase_id, project_id, status,
        primary_agent_id, reviewer_agent_ids, current_round, max_rounds, started_at
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      id, taskId, phaseId, projectId, 'pending',
      primaryAgentId, JSON.stringify(reviewerAgentIds), 0, 7, now
    )

    return this.getById(id)!
  }

  // Get task execution by ID
  static getById(id: string): TaskExecution | null {
    const row = db.prepare('SELECT * FROM task_executions WHERE id = ?').get(id) as any

    if (!row) return null

    return this.fromRow(row)
  }

  // Get task execution by task ID
  static getByTaskId(taskId: string): TaskExecution | null {
    const row = db.prepare('SELECT * FROM task_executions WHERE task_id = ?').get(taskId) as any

    if (!row) return null

    return this.fromRow(row)
  }

  // Get all task executions for a phase
  static getByPhaseId(phaseId: string): TaskExecution[] {
    const rows = db.prepare('SELECT * FROM task_executions WHERE phase_id = ? ORDER BY started_at').all(phaseId) as any[]

    return rows.map(row => this.fromRow(row))
  }

  // Update task execution status
  static updateStatus(id: string, status: TaskExecutionStatus): boolean {
    const result = db.prepare(`
      UPDATE task_executions
      SET status = ?
      WHERE id = ?
    `).run(status, id)

    return result.changes > 0
  }

  // Update current round
  static updateRound(id: string, round: number): boolean {
    const result = db.prepare(`
      UPDATE task_executions
      SET current_round = ?
      WHERE id = ?
    `).run(round, id)

    return result.changes > 0
  }

  // Update discussion thread ID
  static updateDiscussionThread(id: string, threadId: string): boolean {
    const result = db.prepare(`
      UPDATE task_executions
      SET discussion_thread_id = ?
      WHERE id = ?
    `).run(threadId, id)

    return result.changes > 0
  }

  // Update current deliverable ID
  static updateCurrentDeliverable(id: string, deliverableId: string): boolean {
    const result = db.prepare(`
      UPDATE task_executions
      SET current_deliverable_id = ?
      WHERE id = ?
    `).run(deliverableId, id)

    return result.changes > 0
  }

  // Complete task execution
  static complete(id: string): boolean {
    const now = new Date().toISOString()
    const result = db.prepare(`
      UPDATE task_executions
      SET status = 'completed', completed_at = ?
      WHERE id = ?
    `).run(now, id)

    return result.changes > 0
  }

  private static fromRow(row: any): TaskExecution {
    return {
      id: row.id,
      taskId: row.task_id,
      phaseId: row.phase_id,
      projectId: row.project_id,
      status: row.status as TaskExecutionStatus,
      primaryAgentId: row.primary_agent_id,
      reviewerAgentIds: JSON.parse(row.reviewer_agent_ids),
      currentRound: row.current_round,
      maxRounds: row.max_rounds,
      discussionThreadId: row.discussion_thread_id || undefined,
      currentDeliverableId: row.current_deliverable_id || undefined,
      startedAt: row.started_at || undefined,
      completedAt: row.completed_at || undefined
    }
  }
}

export class DiscussionThreadModel {
  // Create a new discussion thread
  static create(taskExecutionId: string): DiscussionThread {
    const id = uuidv4()
    const now = new Date().toISOString()

    db.prepare(`
      INSERT INTO discussion_threads (id, task_execution_id, status, created_at)
      VALUES (?, ?, ?, ?)
    `).run(id, taskExecutionId, 'active', now)

    return this.getById(id)!
  }

  // Get thread by ID
  static getById(id: string): DiscussionThread | null {
    const row = db.prepare('SELECT * FROM discussion_threads WHERE id = ?').get(id) as any

    if (!row) return null

    return {
      id: row.id,
      taskExecutionId: row.task_execution_id,
      status: row.status,
      createdAt: row.created_at
    }
  }

  // Get thread by task execution ID
  static getByTaskExecutionId(taskExecutionId: string): DiscussionThread | null {
    const row = db.prepare('SELECT * FROM discussion_threads WHERE task_execution_id = ?').get(taskExecutionId) as any

    if (!row) return null

    return {
      id: row.id,
      taskExecutionId: row.task_execution_id,
      status: row.status,
      createdAt: row.created_at
    }
  }

  // Update thread status
  static updateStatus(id: string, status: string): boolean {
    const result = db.prepare(`
      UPDATE discussion_threads
      SET status = ?
      WHERE id = ?
    `).run(status, id)

    return result.changes > 0
  }
}

export class DiscussionMessageModel {
  // Add a message to a discussion
  static create(
    threadId: string,
    agentId: string,
    agentName: string,
    agentRole: string,
    round: number,
    messageType: MessageType,
    content: string,
    deliverableVersion?: number,
    approvalStatus?: ApprovalStatus
  ): DiscussionMessage {
    const id = uuidv4()
    const timestamp = new Date().toISOString()

    db.prepare(`
      INSERT INTO discussion_messages (
        id, thread_id, agent_id, agent_name, agent_role, round,
        message_type, content, deliverable_version, approval_status, timestamp
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      id, threadId, agentId, agentName, agentRole, round,
      messageType, content, deliverableVersion || null, approvalStatus || null, timestamp
    )

    return this.getById(id)!
  }

  // Get message by ID
  static getById(id: string): DiscussionMessage | null {
    const row = db.prepare('SELECT * FROM discussion_messages WHERE id = ?').get(id) as any

    if (!row) return null

    return this.fromRow(row)
  }

  // Get all messages for a thread
  static getByThreadId(threadId: string): DiscussionMessage[] {
    const rows = db.prepare(`
      SELECT * FROM discussion_messages
      WHERE thread_id = ?
      ORDER BY round, timestamp
    `).all(threadId) as any[]

    return rows.map(row => this.fromRow(row))
  }

  // Get messages for a specific round
  static getByRound(threadId: string, round: number): DiscussionMessage[] {
    const rows = db.prepare(`
      SELECT * FROM discussion_messages
      WHERE thread_id = ? AND round = ?
      ORDER BY timestamp
    `).all(threadId, round) as any[]

    return rows.map(row => this.fromRow(row))
  }

  private static fromRow(row: any): DiscussionMessage {
    return {
      id: row.id,
      threadId: row.thread_id,
      agentId: row.agent_id,
      agentName: row.agent_name,
      agentRole: row.agent_role,
      round: row.round,
      messageType: row.message_type as MessageType,
      content: row.content,
      deliverableVersion: row.deliverable_version || undefined,
      approvalStatus: row.approval_status as ApprovalStatus || undefined,
      timestamp: row.timestamp
    }
  }
}

export class DeliverableModel {
  // Create a new deliverable
  static create(
    taskExecutionId: string,
    version: number,
    content: string,
    createdBy: string,
    description: string
  ): Deliverable {
    const id = uuidv4()
    const createdAt = new Date().toISOString()

    db.prepare(`
      INSERT INTO deliverables (
        id, task_execution_id, version, content, created_by, description, created_at
      )
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(id, taskExecutionId, version, content, createdBy, description, createdAt)

    return this.getById(id)!
  }

  // Get deliverable by ID
  static getById(id: string): Deliverable | null {
    const row = db.prepare('SELECT * FROM deliverables WHERE id = ?').get(id) as any

    if (!row) return null

    return {
      id: row.id,
      taskExecutionId: row.task_execution_id,
      version: row.version,
      content: row.content,
      createdBy: row.created_by,
      description: row.description,
      createdAt: row.created_at
    }
  }

  // Get all deliverables for a task execution
  static getByTaskExecutionId(taskExecutionId: string): Deliverable[] {
    const rows = db.prepare(`
      SELECT * FROM deliverables
      WHERE task_execution_id = ?
      ORDER BY version
    `).all(taskExecutionId) as any[]

    return rows.map(row => ({
      id: row.id,
      taskExecutionId: row.task_execution_id,
      version: row.version,
      content: row.content,
      createdBy: row.created_by,
      description: row.description,
      createdAt: row.created_at
    }))
  }

  // Get latest deliverable for a task execution
  static getLatest(taskExecutionId: string): Deliverable | null {
    const row = db.prepare(`
      SELECT * FROM deliverables
      WHERE task_execution_id = ?
      ORDER BY version DESC
      LIMIT 1
    `).get(taskExecutionId) as any

    if (!row) return null

    return {
      id: row.id,
      taskExecutionId: row.task_execution_id,
      version: row.version,
      content: row.content,
      createdBy: row.created_by,
      description: row.description,
      createdAt: row.created_at
    }
  }
}

export class UserReviewModel {
  // Create a user review
  static create(taskExecutionId: string): UserReview {
    const id = uuidv4()

    db.prepare(`
      INSERT INTO user_reviews (id, task_execution_id, status)
      VALUES (?, ?, ?)
    `).run(id, taskExecutionId, 'pending')

    return this.getById(id)!
  }

  // Get review by ID
  static getById(id: string): UserReview | null {
    const row = db.prepare('SELECT * FROM user_reviews WHERE id = ?').get(id) as any

    if (!row) return null

    return {
      id: row.id,
      taskExecutionId: row.task_execution_id,
      status: row.status,
      userFeedback: row.user_feedback || undefined,
      reviewedAt: row.reviewed_at || undefined
    }
  }

  // Get review by task execution ID
  static getByTaskExecutionId(taskExecutionId: string): UserReview | null {
    const row = db.prepare('SELECT * FROM user_reviews WHERE task_execution_id = ?').get(taskExecutionId) as any

    if (!row) return null

    return {
      id: row.id,
      taskExecutionId: row.task_execution_id,
      status: row.status,
      userFeedback: row.user_feedback || undefined,
      reviewedAt: row.reviewed_at || undefined
    }
  }

  // Submit user feedback
  static submitFeedback(id: string, feedback: string): boolean {
    const now = new Date().toISOString()
    const result = db.prepare(`
      UPDATE user_reviews
      SET status = 'feedback_provided', user_feedback = ?, reviewed_at = ?
      WHERE id = ?
    `).run(feedback, now, id)

    return result.changes > 0
  }

  // Approve review
  static approve(id: string): boolean {
    const now = new Date().toISOString()
    const result = db.prepare(`
      UPDATE user_reviews
      SET status = 'approved', reviewed_at = ?
      WHERE id = ?
    `).run(now, id)

    return result.changes > 0
  }
}
