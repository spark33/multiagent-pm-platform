import type { Agent } from "@/lib/types/agent"

// Sample agent data for testing and development
export const sampleAgents: Agent[] = [
  {
    id: "agent-001",
    name: "Research Analyst",
    role: "Senior Market Research Analyst",
    goal: "Conduct comprehensive market research and provide data-driven insights to support strategic decision-making",
    backstory: "You are an experienced market research analyst with 10+ years of experience in data analysis and competitive intelligence. You excel at finding patterns in data and translating complex findings into actionable recommendations.",
    tools: ["web_search", "data_analyzer", "report_generator"],
    llmProvider: "openai",
    llmModel: "gpt-4",
    allowDelegation: true,
    verbose: true,
    createdAt: "2024-01-15T10:30:00Z",
    updatedAt: "2024-01-15T10:30:00Z",
  },
  {
    id: "agent-002",
    name: "Content Writer",
    role: "Professional Content Writer",
    goal: "Create engaging, well-researched content that resonates with the target audience and achieves communication objectives",
    backstory: "You are a skilled content writer with expertise in multiple formats including blog posts, articles, and technical documentation. You have a knack for adapting your writing style to different audiences and purposes.",
    tools: ["web_search", "text_editor", "grammar_checker", "seo_analyzer"],
    llmProvider: "anthropic",
    llmModel: "claude-3-opus",
    allowDelegation: false,
    verbose: false,
    createdAt: "2024-01-16T14:20:00Z",
    updatedAt: "2024-01-18T09:15:00Z",
  },
  {
    id: "agent-003",
    name: "Code Reviewer",
    role: "Senior Software Engineer",
    goal: "Review code for quality, security, and best practices, providing constructive feedback to improve code maintainability",
    backstory: "You are a senior software engineer with deep expertise in code quality, security best practices, and software architecture. You have a keen eye for potential issues and excel at mentoring developers through code reviews.",
    tools: ["code_analyzer", "security_scanner", "file_reader", "git_diff"],
    llmProvider: "openai",
    llmModel: "gpt-4-turbo",
    allowDelegation: false,
    verbose: true,
    createdAt: "2024-01-17T11:45:00Z",
    updatedAt: "2024-01-17T11:45:00Z",
  },
  {
    id: "agent-004",
    name: "Project Coordinator",
    role: "Agile Project Coordinator",
    goal: "Coordinate team activities, manage task assignments, and ensure smooth project execution across multiple workstreams",
    backstory: "You are an experienced project coordinator who excels at breaking down complex projects into manageable tasks, delegating work effectively, and keeping teams aligned on goals and timelines.",
    tools: ["task_manager", "calendar", "team_communicator", "progress_tracker"],
    llmProvider: "openai",
    llmModel: "gpt-4",
    allowDelegation: true,
    verbose: false,
    createdAt: "2024-01-18T08:00:00Z",
    updatedAt: "2024-01-20T16:30:00Z",
  },
  {
    id: "agent-005",
    name: "Data Scientist",
    role: "Machine Learning Engineer",
    goal: "Analyze datasets, build predictive models, and extract meaningful insights from complex data",
    backstory: "You are a data scientist with strong expertise in statistical analysis, machine learning, and data visualization. You approach problems methodically and always validate your findings with rigorous testing.",
    tools: ["python_executor", "data_analyzer", "visualization_tool", "sql_query"],
    llmProvider: "ollama",
    llmModel: "llama3.2",
    allowDelegation: false,
    verbose: true,
    createdAt: "2024-01-19T13:15:00Z",
    updatedAt: "2024-01-19T13:15:00Z",
  },
]

// In-memory storage for new agents (will be replaced with database)
let agentStore: Agent[] = [...sampleAgents]

export function getAllAgents(): Agent[] {
  return agentStore
}

export function getAgentById(id: string): Agent | undefined {
  return agentStore.find(agent => agent.id === id)
}

export function createAgent(agentData: Omit<Agent, "id" | "createdAt" | "updatedAt">): Agent {
  const now = new Date().toISOString()
  const newAgent: Agent = {
    ...agentData,
    id: `agent-${Date.now()}`,
    createdAt: now,
    updatedAt: now,
  }
  agentStore.push(newAgent)
  return newAgent
}

export function updateAgent(id: string, updates: Partial<Agent>): Agent | null {
  const index = agentStore.findIndex(agent => agent.id === id)
  if (index === -1) return null

  const updatedAgent: Agent = {
    ...agentStore[index],
    ...updates,
    id: agentStore[index].id, // Ensure ID doesn't change
    createdAt: agentStore[index].createdAt, // Preserve creation date
    updatedAt: new Date().toISOString(),
  }

  agentStore[index] = updatedAgent
  return updatedAgent
}

export function deleteAgent(id: string): boolean {
  const initialLength = agentStore.length
  agentStore = agentStore.filter(agent => agent.id !== id)
  return agentStore.length < initialLength
}

// Reset store (useful for testing)
export function resetAgentStore(): void {
  agentStore = [...sampleAgents]
}
