// Task Execution Types (matching backend)

export type TaskExecutionStatus = 'pending' | 'in_progress' | 'under_discussion' |
                                  'awaiting_consensus' | 'awaiting_user' | 'completed'

export interface TaskExecution {
  id: string
  taskId: string
  phaseId: string
  projectId: string
  status: TaskExecutionStatus
  primaryAgentId: string
  reviewerAgentIds: string[]
  currentRound: number
  maxRounds: number
  discussionThreadId?: string
  currentDeliverableId?: string
  startedAt?: string
  completedAt?: string
}

export type DiscussionStatus = 'active' | 'consensus_reached' | 'awaiting_user' | 'closed'

export interface DiscussionThread {
  id: string
  taskExecutionId: string
  status: DiscussionStatus
  createdAt: string
}

export type MessageType = 'initial_review' | 'response' | 'revision' |
                         'question' | 'approval' | 'concern' | 'user_feedback'
export type ApprovalStatus = 'approved' | 'has_concerns' | 'pending'

export interface DiscussionMessage {
  id: string
  threadId: string
  agentId: string
  agentName: string
  agentRole: string
  round: number
  messageType: MessageType
  content: string
  deliverableVersion?: number
  approvalStatus?: ApprovalStatus
  timestamp: string
}

export interface Deliverable {
  id: string
  taskExecutionId: string
  version: number
  content: string
  createdBy: string
  description: string
  createdAt: string
}

export type UserReviewStatus = 'pending' | 'approved' | 'feedback_provided'

export interface UserReview {
  id: string
  taskExecutionId: string
  status: UserReviewStatus
  userFeedback?: string
  reviewedAt?: string
}

export interface TaskExecutionState {
  execution: TaskExecution
  discussion: {
    messages: DiscussionMessage[]
    messagesByRound: Record<number, DiscussionMessage[]>
    currentRound: number
  } | null
  deliverables: Deliverable[]
  userReview: UserReview | null
}
