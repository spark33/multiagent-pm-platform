import { DiscussionMessageModel, DeliverableModel } from '../models/task-execution'
import { TaskModel } from '../models/task'
import type { Agent, Deliverable, DiscussionMessage } from '../types'
import {
  generateInitialDeliverable,
  generateReviewFeedback,
  generatePrimaryAgentResponse,
  generateRevisedDeliverable
} from './llm-service'

/**
 * AgentCollaboration handles agent-to-agent interactions
 * Manages discussion messages, reviews, and deliverable creation
 */
export class AgentCollaboration {
  /**
   * Start initial work on a task
   * Primary agent creates the first deliverable
   */
  static async startInitialWork(
    executionId: string,
    primaryAgent: Agent,
    taskId: string
  ): Promise<void> {
    // Get task details
    const task = TaskModel.getById(taskId)
    if (!task) throw new Error('Task not found')

    // Generate initial deliverable using LLM
    const deliverableContent = await generateInitialDeliverable(
      primaryAgent,
      task
    )

    // Create deliverable record
    const deliverable = DeliverableModel.create(
      executionId,
      1, // version 1
      deliverableContent,
      primaryAgent.id,
      `Initial deliverable for: ${task.title}`
    )

    // Update current deliverable reference
    const { TaskExecutionModel } = await import('../models/task-execution')
    TaskExecutionModel.updateCurrentDeliverable(executionId, deliverable.id)
  }

  /**
   * Collect reviews from reviewer agents
   * Each reviewer analyzes the deliverable and provides feedback
   */
  static async collectReviews(
    threadId: string,
    reviewers: Agent[],
    deliverable: Deliverable,
    round: number
  ): Promise<void> {
    // Get all previous discussion messages for context
    const previousMessages = DiscussionMessageModel.getByThreadId(threadId)

    // Each reviewer provides feedback
    for (const reviewer of reviewers) {
      const review = await generateReviewFeedback(
        reviewer,
        deliverable,
        previousMessages
      )

      // Add review message to discussion
      DiscussionMessageModel.create(
        threadId,
        reviewer.id,
        reviewer.name,
        reviewer.role,
        round,
        'initial_review',
        review.content,
        deliverable.version,
        review.approvalStatus
      )
    }
  }

  /**
   * Check if all reviewers have approved
   * Returns true if consensus reached
   */
  static async checkConsensus(
    threadId: string,
    round: number
  ): Promise<boolean> {
    const messages = DiscussionMessageModel.getByRound(threadId, round)

    // Filter to review messages only
    const reviews = messages.filter(m =>
      m.messageType === 'initial_review' || m.messageType === 'approval'
    )

    if (reviews.length === 0) return false

    // Check if all reviews are approved
    return reviews.every(r => r.approvalStatus === 'approved')
  }

  /**
   * Primary agent responds to reviewer feedback
   * May create revised deliverable or just respond to concerns
   */
  static async primaryAgentRespond(
    threadId: string,
    primaryAgent: Agent,
    currentDeliverable: Deliverable,
    round: number
  ): Promise<boolean> {
    // Get reviewer feedback from this round
    const roundMessages = DiscussionMessageModel.getByRound(threadId, round)
    const allMessages = DiscussionMessageModel.getByThreadId(threadId)

    // Generate primary agent's response
    const response = await generatePrimaryAgentResponse(
      primaryAgent,
      currentDeliverable,
      roundMessages,
      allMessages
    )

    // Add response message
    DiscussionMessageModel.create(
      threadId,
      primaryAgent.id,
      primaryAgent.name,
      primaryAgent.role,
      round,
      'response',
      response.content,
      currentDeliverable.version
    )

    // If response indicates need for revision, create new deliverable
    if (response.needsRevision) {
      const revisedContent = await generateRevisedDeliverable(
        primaryAgent,
        currentDeliverable,
        roundMessages,
        allMessages
      )

      const newVersion = currentDeliverable.version + 1

      const newDeliverable = DeliverableModel.create(
        currentDeliverable.taskExecutionId,
        newVersion,
        revisedContent,
        primaryAgent.id,
        `Revision ${newVersion} based on reviewer feedback`
      )

      // Update current deliverable reference
      const { TaskExecutionModel } = await import('../models/task-execution')
      TaskExecutionModel.updateCurrentDeliverable(
        currentDeliverable.taskExecutionId,
        newDeliverable.id
      )

      // Add revision message
      DiscussionMessageModel.create(
        threadId,
        primaryAgent.id,
        primaryAgent.name,
        primaryAgent.role,
        round,
        'revision',
        `Created version ${newVersion} with the following changes:\n${response.revisionSummary || 'Updated based on feedback'}`,
        newVersion
      )

      return true // Indicates new deliverable created
    }

    return false // No new deliverable, just addressed concerns
  }

  /**
   * Add user feedback to the discussion
   */
  static async addUserFeedback(
    threadId: string,
    feedback: string,
    round: number
  ): Promise<void> {
    DiscussionMessageModel.create(
      threadId,
      'user',
      'User',
      'Product Owner',
      round,
      'user_feedback',
      feedback
    )
  }

  /**
   * Get the complete discussion state
   * Returns all messages organized by round
   */
  static getDiscussionState(threadId: string) {
    const messages = DiscussionMessageModel.getByThreadId(threadId)

    // Group messages by round
    const messagesByRound: Record<number, DiscussionMessage[]> = {}

    for (const message of messages) {
      if (!messagesByRound[message.round]) {
        messagesByRound[message.round] = []
      }
      messagesByRound[message.round].push(message)
    }

    return {
      messages,
      messagesByRound,
      currentRound: Math.max(...messages.map(m => m.round), 0)
    }
  }
}
