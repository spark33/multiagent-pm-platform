import { v4 as uuidv4 } from 'uuid'
import type { Roadmap, Phase, ProjectContext, PhaseName, ChatMessage } from '../types'

/**
 * Generate a sample roadmap based on project description, context, and discovery conversation.
 * TODO: Replace with LLM-based generation using chat history
 */
export function generateRoadmap(
  description: string,
  context: ProjectContext,
  chatHistory: ChatMessage[] = []
): Roadmap {
  const now = new Date().toISOString()

  // Extract key insights from chat history for roadmap customization
  const conversationSummary = chatHistory
    .filter(m => m.role === 'user')
    .map(m => m.content)
    .join(' ')
    .toLowerCase()

  const phases: Phase[] = [
    {
      id: uuidv4(),
      name: "research",
      title: "Market Research & Analysis",
      description: "Understand the market, competitors, and user needs",
      objective: "Validate market opportunity and identify key success factors",
      status: "pending",
      deliverables: [
        "Competitive analysis report",
        "User research findings",
        "Market size and opportunity assessment"
      ],
      tasks: [
        {
          id: uuidv4(),
          title: "Competitive Analysis",
          description: "Research existing solutions and identify market gaps",
          status: "pending",
          assignedAgent: "Research Agent Alpha",
          agentRole: "Market Analyst",
          dependencies: [],
          deliverables: ["Competitor feature matrix", "SWOT analysis"],
          priority: "high"
        },
        {
          id: uuidv4(),
          title: "User Research",
          description: "Conduct user interviews and surveys to understand needs",
          status: "pending",
          assignedAgent: "Research Agent Beta",
          agentRole: "User Researcher",
          dependencies: [],
          deliverables: ["User interview insights", "Persona definitions"],
          priority: "high"
        },
        {
          id: uuidv4(),
          title: "Market Sizing",
          description: "Analyze total addressable market and growth potential",
          status: "pending",
          assignedAgent: "Research Agent Alpha",
          agentRole: "Market Analyst",
          dependencies: [],
          deliverables: ["Market size report", "Growth projections"],
          priority: "medium"
        }
      ]
    },
    {
      id: uuidv4(),
      name: "strategy",
      title: "Product Strategy & Positioning",
      description: "Define value proposition and go-to-market strategy",
      objective: "Establish clear product positioning and feature prioritization",
      status: "pending",
      deliverables: [
        "Product positioning document",
        "Feature prioritization matrix",
        "Go-to-market strategy"
      ],
      tasks: [
        {
          id: uuidv4(),
          title: "Value Proposition Design",
          description: "Define clear value propositions for target segments",
          status: "pending",
          assignedAgent: "Strategy Agent",
          agentRole: "Product Strategist",
          dependencies: [],
          deliverables: ["Value proposition canvas", "Positioning statement"],
          priority: "high"
        },
        {
          id: uuidv4(),
          title: "Feature Prioritization",
          description: "Prioritize features using RICE framework",
          status: "pending",
          assignedAgent: "Strategy Agent",
          agentRole: "Product Strategist",
          dependencies: [],
          deliverables: ["Prioritized feature list", "MVP scope"],
          priority: "high"
        },
        {
          id: uuidv4(),
          title: "GTM Strategy",
          description: "Define go-to-market channels and tactics",
          status: "pending",
          assignedAgent: "Strategy Agent",
          agentRole: "Business Analyst",
          dependencies: [],
          deliverables: ["GTM plan", "Launch timeline"],
          priority: "medium"
        }
      ]
    },
    {
      id: uuidv4(),
      name: "design",
      title: "UX/UI Design",
      description: "Create user flows and visual designs",
      objective: "Design intuitive, delightful user experience",
      status: "pending",
      deliverables: [
        "User flow diagrams",
        "Wireframes and mockups",
        "Design system",
        "Interactive prototype"
      ],
      tasks: [
        {
          id: uuidv4(),
          title: "User Journey Mapping",
          description: "Map complete user journeys and identify touchpoints",
          status: "pending",
          assignedAgent: "Design Agent Alpha",
          agentRole: "UX Designer",
          dependencies: [],
          deliverables: ["User journey maps", "User flow diagrams"],
          priority: "high"
        },
        {
          id: uuidv4(),
          title: "Wireframing",
          description: "Create low-fidelity wireframes for key screens",
          status: "pending",
          assignedAgent: "Design Agent Alpha",
          agentRole: "UX Designer",
          dependencies: [],
          deliverables: ["Wireframe set"],
          priority: "high"
        },
        {
          id: uuidv4(),
          title: "Visual Design",
          description: "Design high-fidelity mockups and design system",
          status: "pending",
          assignedAgent: "Design Agent Beta",
          agentRole: "UI Designer",
          dependencies: [],
          deliverables: ["High-fidelity mockups", "Design system"],
          priority: "high"
        },
        {
          id: uuidv4(),
          title: "Prototyping",
          description: "Build interactive prototype for testing",
          status: "pending",
          assignedAgent: "Design Agent Alpha",
          agentRole: "UX Designer",
          dependencies: [],
          deliverables: ["Interactive prototype"],
          priority: "medium"
        }
      ]
    },
    {
      id: uuidv4(),
      name: "architecture",
      title: "Technical Architecture",
      description: "Design system architecture and tech stack",
      objective: "Establish scalable, secure technical foundation",
      status: "pending",
      deliverables: [
        "System architecture diagram",
        "Tech stack documentation",
        "Database schema",
        "API specification"
      ],
      tasks: [
        {
          id: uuidv4(),
          title: "Tech Stack Selection",
          description: "Choose optimal technologies for the project",
          status: "pending",
          assignedAgent: "Architecture Agent",
          agentRole: "Solutions Architect",
          dependencies: [],
          deliverables: ["Tech stack decision document"],
          priority: "high"
        },
        {
          id: uuidv4(),
          title: "System Design",
          description: "Design overall system architecture",
          status: "pending",
          assignedAgent: "Architecture Agent",
          agentRole: "Solutions Architect",
          dependencies: [],
          deliverables: ["Architecture diagrams", "Component specs"],
          priority: "high"
        },
        {
          id: uuidv4(),
          title: "API Design",
          description: "Design RESTful or GraphQL API specification",
          status: "pending",
          assignedAgent: "Architecture Agent",
          agentRole: "API Architect",
          dependencies: [],
          deliverables: ["API specification", "Data models"],
          priority: "high"
        }
      ]
    },
    {
      id: uuidv4(),
      name: "development",
      title: "Development & Testing",
      description: "Build and test the application",
      objective: "Deliver production-ready application with all core features",
      status: "pending",
      deliverables: [
        "Application codebase",
        "Automated tests",
        "Documentation",
        "CI/CD pipeline"
      ],
      tasks: [
        {
          id: uuidv4(),
          title: "Backend Development",
          description: "Build server-side logic and APIs",
          status: "pending",
          assignedAgent: "Dev Agent Alpha",
          agentRole: "Backend Engineer",
          dependencies: [],
          deliverables: ["Backend codebase", "API endpoints"],
          priority: "high"
        },
        {
          id: uuidv4(),
          title: "Frontend Development",
          description: "Build user interface and client logic",
          status: "pending",
          assignedAgent: "Dev Agent Beta",
          agentRole: "Frontend Engineer",
          dependencies: [],
          deliverables: ["Frontend codebase", "UI components"],
          priority: "high"
        },
        {
          id: uuidv4(),
          title: "Testing & QA",
          description: "Comprehensive testing and quality assurance",
          status: "pending",
          assignedAgent: "QA Agent",
          agentRole: "QA Engineer",
          dependencies: [],
          deliverables: ["Test suite", "Bug reports"],
          priority: "high"
        }
      ]
    },
    {
      id: uuidv4(),
      name: "launch",
      title: "Launch & Marketing",
      description: "Deploy and market the product",
      objective: "Successfully launch and acquire initial users",
      status: "pending",
      deliverables: [
        "Production deployment",
        "Marketing materials",
        "Launch campaign",
        "Analytics setup"
      ],
      tasks: [
        {
          id: uuidv4(),
          title: "Deployment",
          description: "Deploy application to production",
          status: "pending",
          assignedAgent: "DevOps Agent",
          agentRole: "DevOps Engineer",
          dependencies: [],
          deliverables: ["Production environment", "Monitoring setup"],
          priority: "high"
        },
        {
          id: uuidv4(),
          title: "Marketing Campaign",
          description: "Execute launch marketing campaign",
          status: "pending",
          assignedAgent: "Marketing Agent",
          agentRole: "Growth Marketer",
          dependencies: [],
          deliverables: ["Campaign materials", "Content calendar"],
          priority: "high"
        },
        {
          id: uuidv4(),
          title: "Analytics & Monitoring",
          description: "Set up analytics and user feedback systems",
          status: "pending",
          assignedAgent: "Dev Agent Alpha",
          agentRole: "Analytics Engineer",
          dependencies: [],
          deliverables: ["Analytics dashboards", "Feedback tools"],
          priority: "medium"
        }
      ]
    }
  ]

  // Generate context-aware summary based on chat history
  let summary = `Comprehensive roadmap for: ${description}. `

  if (chatHistory.length > 0) {
    summary += `Based on our discovery conversation, this roadmap is tailored to your specific needs and goals. `
  }

  summary += `Covers market research, product strategy, design, architecture, development, and launch phases with AI agents handling all execution.`

  return {
    phases,
    generatedAt: now,
    summary
  }
}
