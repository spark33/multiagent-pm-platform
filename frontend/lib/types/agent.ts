// Shared types for Agent data across frontend and API
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
