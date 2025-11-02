import { TaskExecutionModel, DiscussionThreadModel, DeliverableModel, UserReviewModel } from '../models/task-execution'
import { AgentModel } from '../models/agent'
import type { TaskExecution, Agent } from '../types'
import { AgentCollaboration } from './agent-collaboration'

/**
 * TaskOrchestrator manages the lifecycle of task executions
 * Coordinates between agents, discussion rounds, and user reviews
 */
export class TaskOrchestrator {
  /**
   * Start execution of a task
   * Assigns primary agent and reviewers, creates discussion thread
   */
  static async startTaskExecution(
    taskId: string,
    phaseId: string,
    projectId: string
  ): Promise<TaskExecution> {
    // Get available agents
    const agents = AgentModel.getAll()

    if (agents.length < 2) {
      throw new Error('Need at least 2 agents to execute tasks (1 primary + 1 reviewer)')
    }

    // Assign primary agent (first agent)
    const primaryAgent = agents[0]

    // Assign reviewer agents (remaining agents, up to 3)
    const reviewerAgents = agents.slice(1, 4)
    const reviewerAgentIds = reviewerAgents.map(a => a.id)

    // Create task execution record
    const execution = TaskExecutionModel.create(
      taskId,
      phaseId,
      projectId,
      primaryAgent.id,
      reviewerAgentIds
    )

    // Update status to in_progress
    TaskExecutionModel.updateStatus(execution.id, 'in_progress')

    // Create discussion thread
    const thread = DiscussionThreadModel.create(execution.id)
    TaskExecutionModel.updateDiscussionThread(execution.id, thread.id)

    // Start agent collaboration - primary agent creates initial deliverable
    await AgentCollaboration.startInitialWork(execution.id, primaryAgent, taskId)

    return TaskExecutionModel.getById(execution.id)!
  }

  /**
   * Process a discussion round
   * Reviews provide feedback, primary agent may revise
   */
  static async processRound(executionId: string): Promise<void> {
    const execution = TaskExecutionModel.getById(executionId)
    if (!execution) throw new Error('Task execution not found')

    // Check if we've exceeded max rounds
    if (execution.currentRound >= execution.maxRounds) {
      await this.forceConsensus(executionId)
      return
    }

    // Increment round
    const newRound = execution.currentRound + 1
    TaskExecutionModel.updateRound(executionId, newRound)

    // Update status to under_discussion
    TaskExecutionModel.updateStatus(executionId, 'under_discussion')

    // Get reviewers to provide feedback
    const reviewerAgents = AgentModel.getByIds(execution.reviewerAgentIds)
    const latestDeliverable = DeliverableModel.getLatest(executionId)

    if (!latestDeliverable) {
      throw new Error('No deliverable to review')
    }

    // Collect reviews from all reviewers
    await AgentCollaboration.collectReviews(
      execution.discussionThreadId!,
      reviewerAgents,
      latestDeliverable,
      newRound
    )

    // Check for consensus
    const hasConsensus = await AgentCollaboration.checkConsensus(
      execution.discussionThreadId!,
      newRound
    )

    if (hasConsensus) {
      // All reviewers approved
      await this.moveToUserReview(executionId)
    } else {
      // Get primary agent to respond and revise
      const primaryAgent = AgentModel.getById(execution.primaryAgentId)
      if (!primaryAgent) throw new Error('Primary agent not found')

      const needsRevision = await AgentCollaboration.primaryAgentRespond(
        execution.discussionThreadId!,
        primaryAgent,
        latestDeliverable,
        newRound
      )

      if (needsRevision) {
        // Primary agent will create new deliverable version
        // Then process next round
        await this.processRound(executionId)
      } else {
        // Primary agent addressed concerns without new deliverable
        // Check consensus again in next round
        await this.processRound(executionId)
      }
    }
  }

  /**
   * Force consensus when max rounds reached
   * Move to user review with current deliverable
   */
  private static async forceConsensus(executionId: string): Promise<void> {
    const execution = TaskExecutionModel.getById(executionId)
    if (!execution || !execution.discussionThreadId) return

    // Update thread status
    DiscussionThreadModel.updateStatus(execution.discussionThreadId, 'consensus_reached')

    // Move to user review
    await this.moveToUserReview(executionId)
  }

  /**
   * Move task to user review phase
   * Creates user review record and updates status
   */
  private static async moveToUserReview(executionId: string): Promise<void> {
    const execution = TaskExecutionModel.getById(executionId)
    if (!execution) return

    // Update execution status
    TaskExecutionModel.updateStatus(executionId, 'awaiting_user')

    // Update thread status
    if (execution.discussionThreadId) {
      DiscussionThreadModel.updateStatus(execution.discussionThreadId, 'awaiting_user')
    }

    // Create user review
    UserReviewModel.create(executionId)
  }

  /**
   * Submit user feedback on a task
   * If approved, complete the task
   * If feedback provided, agents continue discussion
   */
  static async submitUserFeedback(
    executionId: string,
    approved: boolean,
    feedback?: string
  ): Promise<void> {
    const execution = TaskExecutionModel.getById(executionId)
    if (!execution) throw new Error('Task execution not found')

    const review = UserReviewModel.getByTaskExecutionId(executionId)
    if (!review) throw new Error('User review not found')

    if (approved) {
      // User approved - complete the task
      UserReviewModel.approve(review.id)
      await this.completeTask(executionId)
    } else if (feedback) {
      // User provided feedback - add to discussion and continue
      UserReviewModel.submitFeedback(review.id, feedback)

      // Add user feedback to discussion
      await AgentCollaboration.addUserFeedback(
        execution.discussionThreadId!,
        feedback,
        execution.currentRound
      )

      // Reset status and continue discussion
      TaskExecutionModel.updateStatus(executionId, 'under_discussion')
      if (execution.discussionThreadId) {
        DiscussionThreadModel.updateStatus(execution.discussionThreadId, 'active')
      }

      // Process next round with user input
      await this.processRound(executionId)
    }
  }

  /**
   * Complete a task execution
   * Marks as completed and closes discussion
   */
  private static async completeTask(executionId: string): Promise<void> {
    const execution = TaskExecutionModel.getById(executionId)
    if (!execution) return

    // Mark execution as completed
    TaskExecutionModel.complete(executionId)

    // Close discussion thread
    if (execution.discussionThreadId) {
      DiscussionThreadModel.updateStatus(execution.discussionThreadId, 'closed')
    }
  }

  /**
   * Get the current state of a task execution
   * Includes execution details, discussion, and deliverables
   */
  static getExecutionState(executionId: string) {
    const execution = TaskExecutionModel.getById(executionId)
    if (!execution) return null

    return {
      execution,
      discussion: execution.discussionThreadId
        ? AgentCollaboration.getDiscussionState(execution.discussionThreadId)
        : null,
      deliverables: DeliverableModel.getByTaskExecutionId(executionId),
      userReview: UserReviewModel.getByTaskExecutionId(executionId)
    }
  }
}
