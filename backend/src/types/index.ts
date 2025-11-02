// Shared types - copied from frontend for consistency

export type ProjectStatus = "discovery" | "roadmap" | "execution" | "completed"

export type PhaseName = "research" | "strategy" | "design" | "architecture" | "development" | "launch"

export interface ProjectContext {
  targetAudience?: string
  problemStatement?: string
  valueProposition?: string
  technicalRequirements?: string[]
  constraints?: string[]
  goals?: string[]
}

export interface Task {
  id: string
  title: string
  description: string
  status: "pending" | "in_progress" | "completed"
  assignedAgent?: string
  agentRole?: string
  dependencies?: string[]
  deliverables: string[]
  priority: "high" | "medium" | "low"
}

export interface Phase {
  id: string
  name: PhaseName
  title: string
  description: string
  objective: string
  tasks: Task[]
  dependencies?: string[]
  status: "pending" | "in_progress" | "completed"
  deliverables: string[]
}

export interface Roadmap {
  phases: Phase[]
  approvedAt?: string
  approvedBy?: string
  generatedAt: string
  summary: string
}

export interface Project {
  id: string
  title: string
  description: string
  status: ProjectStatus
  createdAt: string
  updatedAt: string
  context: ProjectContext
  roadmap?: Roadmap
}

export interface CreateProjectRequest {
  description: string
}

export interface ProjectListResponse {
  projects: Project[]
  total: number
}

// Chat-related types
export type MessageRole = "user" | "assistant" | "system"

export interface ChatMessage {
  id: string
  role: MessageRole
  content: string
  timestamp: string
}

export interface ChatHistoryResponse {
  messages: ChatMessage[]
  projectId: string
}

export interface SendMessageRequest {
  content: string
}

export interface SendMessageResponse {
  message: ChatMessage
  projectContext?: Partial<ProjectContext>
}

// Agent types
export interface Agent {
  id: string
  name: string
  role: string
  goal: string
  backstory: string
  tools: string[]
  llmProvider: string
  llmModel: string
  allowDelegation: boolean
  verbose: boolean
  createdAt: string
  updatedAt: string
}

export interface CreateAgentRequest {
  name: string
  role: string
  goal: string
  backstory: string
  tools: string[]
  llmProvider: string
  llmModel: string
  allowDelegation: boolean
  verbose: boolean
}

export interface UpdateAgentRequest extends Partial<CreateAgentRequest> {}

export interface AgentListResponse {
  agents: Agent[]
  total: number
}

// Task Execution Types
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

// Discussion Types
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

// Deliverable Types
export interface Deliverable {
  id: string
  taskExecutionId: string
  version: number
  content: string
  createdBy: string
  description: string
  createdAt: string
}

// User Review Types
export type UserReviewStatus = 'pending' | 'approved' | 'feedback_provided'

export interface UserReview {
  id: string
  taskExecutionId: string
  status: UserReviewStatus
  userFeedback?: string
  reviewedAt?: string
}
