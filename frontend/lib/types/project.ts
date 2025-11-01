// Project-related types

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
