import type { Project, ChatMessage } from "@/lib/types/project"

// Sample projects for testing
export const sampleProjects: Project[] = [
  {
    id: "project-001",
    title: "AI-Powered Recipe App",
    description: "A mobile app that suggests recipes based on ingredients users have at home",
    status: "execution",
    createdAt: "2024-01-15T10:00:00Z",
    updatedAt: "2024-01-20T14:30:00Z",
    context: {
      targetAudience: "Home cooks aged 25-45 who want to reduce food waste",
      problemStatement: "People often don't know what to cook with the ingredients they have, leading to food waste",
      valueProposition: "Turn your available ingredients into delicious meals with AI-powered recipe suggestions",
      technicalRequirements: ["Mobile app (iOS/Android)", "Image recognition for ingredients", "Recipe database"],
      constraints: ["Must work offline for basic features", "Budget: $50k", "Timeline: 4 months"],
      goals: ["Launch MVP in 4 months", "Acquire 1000 users in first month", "Achieve 4.5+ app store rating"],
    },
    roadmap: {
      phases: [
        {
          id: "phase-001",
          name: "research",
          title: "Market Research & Analysis",
          description: "Understand the market, competitors, and user needs",
          objective: "Validate market opportunity and identify key success factors for the recipe app",
          status: "completed",
          deliverables: [
            "Competitive analysis report",
            "User research findings",
            "Market size and opportunity assessment"
          ],
          tasks: [
            {
              id: "task-001",
              title: "Competitive Analysis",
              description: "Research existing recipe apps (Yummly, Tasty, SuperCook) and identify gaps",
              status: "completed",
              assignedAgent: "Research Agent Alpha",
              agentRole: "Market Analyst",
              dependencies: [],
              deliverables: ["Competitor feature matrix", "SWOT analysis"],
              priority: "high"
            },
            {
              id: "task-002",
              title: "User Interviews",
              description: "Conduct interviews with 20 home cooks to understand pain points",
              status: "completed",
              assignedAgent: "Research Agent Beta",
              agentRole: "User Researcher",
              dependencies: [],
              deliverables: ["Interview transcripts", "User insights summary"],
              priority: "high"
            },
            {
              id: "task-003",
              title: "Market Sizing",
              description: "Analyze TAM/SAM/SOM for recipe app market in target regions",
              status: "completed",
              assignedAgent: "Research Agent Alpha",
              agentRole: "Market Analyst",
              dependencies: ["task-001"],
              deliverables: ["Market size report", "Growth projections"],
              priority: "medium"
            }
          ],
        },
        {
          id: "phase-002",
          name: "strategy",
          title: "Product Strategy & Positioning",
          description: "Define value proposition and go-to-market strategy",
          objective: "Establish clear product positioning and feature prioritization",
          status: "completed",
          deliverables: [
            "Product positioning document",
            "Feature prioritization matrix",
            "Go-to-market strategy"
          ],
          tasks: [
            {
              id: "task-004",
              title: "Value Proposition Canvas",
              description: "Define clear value props for each user segment",
              status: "completed",
              assignedAgent: "Strategy Agent",
              agentRole: "Product Strategist",
              dependencies: ["task-002"],
              deliverables: ["Value proposition canvas", "Positioning statement"],
              priority: "high"
            },
            {
              id: "task-005",
              title: "Feature Prioritization",
              description: "Use RICE framework to prioritize features for MVP vs future releases",
              status: "completed",
              assignedAgent: "Strategy Agent",
              agentRole: "Product Strategist",
              dependencies: ["task-004"],
              deliverables: ["Feature roadmap", "MVP feature set"],
              priority: "high"
            },
            {
              id: "task-006",
              title: "Monetization Strategy",
              description: "Define pricing model and revenue streams",
              status: "completed",
              assignedAgent: "Strategy Agent",
              agentRole: "Business Analyst",
              dependencies: ["task-003"],
              deliverables: ["Pricing strategy", "Revenue projections"],
              priority: "medium"
            }
          ],
        },
        {
          id: "phase-003",
          name: "design",
          title: "UX/UI Design",
          description: "Create user flows and visual designs",
          objective: "Design intuitive, delightful user experience for ingredient scanning and recipe discovery",
          status: "in_progress",
          deliverables: [
            "User flow diagrams",
            "Wireframes and mockups",
            "Design system",
            "Interactive prototype"
          ],
          tasks: [
            {
              id: "task-007",
              title: "User Journey Mapping",
              description: "Map complete user journeys from ingredient input to recipe selection",
              status: "completed",
              assignedAgent: "Design Agent Alpha",
              agentRole: "UX Designer",
              dependencies: ["task-005"],
              deliverables: ["User journey maps", "User flow diagrams"],
              priority: "high"
            },
            {
              id: "task-008",
              title: "Wireframing",
              description: "Create low-fidelity wireframes for all key screens",
              status: "completed",
              assignedAgent: "Design Agent Alpha",
              agentRole: "UX Designer",
              dependencies: ["task-007"],
              deliverables: ["Wireframe set (20+ screens)"],
              priority: "high"
            },
            {
              id: "task-009",
              title: "Visual Design System",
              description: "Establish color palette, typography, components library",
              status: "in_progress",
              assignedAgent: "Design Agent Beta",
              agentRole: "UI Designer",
              dependencies: ["task-008"],
              deliverables: ["Design system in Figma", "Component library"],
              priority: "high"
            },
            {
              id: "task-010",
              title: "High-Fidelity Mockups",
              description: "Design pixel-perfect screens for all core features",
              status: "pending",
              assignedAgent: "Design Agent Beta",
              agentRole: "UI Designer",
              dependencies: ["task-009"],
              deliverables: ["High-fidelity mockups", "Asset exports"],
              priority: "high"
            },
            {
              id: "task-011",
              title: "Interactive Prototype",
              description: "Build clickable prototype for user testing",
              status: "pending",
              assignedAgent: "Design Agent Alpha",
              agentRole: "UX Designer",
              dependencies: ["task-010"],
              deliverables: ["Interactive Figma prototype"],
              priority: "medium"
            }
          ],
        },
        {
          id: "phase-004",
          name: "architecture",
          title: "Technical Architecture",
          description: "Design system architecture and tech stack",
          objective: "Establish scalable, secure technical foundation for the app",
          status: "pending",
          deliverables: [
            "System architecture diagram",
            "Tech stack documentation",
            "Database schema",
            "API specification"
          ],
          tasks: [
            {
              id: "task-012",
              title: "Tech Stack Selection",
              description: "Choose mobile framework, backend, database, and AI services",
              status: "pending",
              assignedAgent: "Architecture Agent",
              agentRole: "Solutions Architect",
              dependencies: ["task-005"],
              deliverables: ["Tech stack decision document", "Rationale for each choice"],
              priority: "high"
            },
            {
              id: "task-013",
              title: "System Architecture Design",
              description: "Design microservices architecture with mobile clients",
              status: "pending",
              assignedAgent: "Architecture Agent",
              agentRole: "Solutions Architect",
              dependencies: ["task-012"],
              deliverables: ["Architecture diagrams", "Service definitions"],
              priority: "high"
            },
            {
              id: "task-014",
              title: "Database Schema Design",
              description: "Design normalized schema for users, recipes, ingredients, preferences",
              status: "pending",
              assignedAgent: "Architecture Agent",
              agentRole: "Database Architect",
              dependencies: ["task-013"],
              deliverables: ["ER diagrams", "Schema migration scripts"],
              priority: "high"
            },
            {
              id: "task-015",
              title: "API Design",
              description: "Design RESTful API with OpenAPI specification",
              status: "pending",
              assignedAgent: "Architecture Agent",
              agentRole: "API Architect",
              dependencies: ["task-014"],
              deliverables: ["OpenAPI spec", "API documentation"],
              priority: "high"
            }
          ],
        },
        {
          id: "phase-005",
          name: "development",
          title: "Development & Testing",
          description: "Build the application with continuous testing",
          objective: "Deliver production-ready mobile app with all core features",
          status: "pending",
          deliverables: [
            "iOS and Android apps",
            "Backend services",
            "AI model for recipe recommendations",
            "Test coverage reports",
            "CI/CD pipeline"
          ],
          tasks: [
            {
              id: "task-016",
              title: "Backend Development",
              description: "Build API services, authentication, database layer",
              status: "pending",
              assignedAgent: "Dev Agent Alpha",
              agentRole: "Backend Engineer",
              dependencies: ["task-015"],
              deliverables: ["Backend codebase", "API endpoints", "Unit tests"],
              priority: "high"
            },
            {
              id: "task-017",
              title: "AI Model Training",
              description: "Train and deploy recipe recommendation model",
              status: "pending",
              assignedAgent: "AI Agent",
              agentRole: "ML Engineer",
              dependencies: ["task-015"],
              deliverables: ["Trained model", "Model API", "Performance metrics"],
              priority: "high"
            },
            {
              id: "task-018",
              title: "Mobile App Development",
              description: "Build React Native app for iOS and Android",
              status: "pending",
              assignedAgent: "Dev Agent Beta",
              agentRole: "Mobile Engineer",
              dependencies: ["task-010", "task-016"],
              deliverables: ["Mobile app codebase", "Component tests"],
              priority: "high"
            },
            {
              id: "task-019",
              title: "Image Recognition Integration",
              description: "Integrate ingredient recognition using computer vision API",
              status: "pending",
              assignedAgent: "AI Agent",
              agentRole: "ML Engineer",
              dependencies: ["task-018"],
              deliverables: ["Image recognition feature", "Accuracy benchmarks"],
              priority: "high"
            },
            {
              id: "task-020",
              title: "QA & Testing",
              description: "End-to-end testing, performance testing, security audit",
              status: "pending",
              assignedAgent: "QA Agent",
              agentRole: "QA Engineer",
              dependencies: ["task-018", "task-019"],
              deliverables: ["Test reports", "Bug fixes", "Performance metrics"],
              priority: "high"
            }
          ],
        },
        {
          id: "phase-006",
          name: "launch",
          title: "Launch & Marketing",
          description: "Deploy and market the product",
          objective: "Successfully launch app and acquire first 1000 users",
          status: "pending",
          deliverables: [
            "App store submissions",
            "Marketing website",
            "Launch campaign materials",
            "User onboarding analytics"
          ],
          tasks: [
            {
              id: "task-021",
              title: "App Store Submission",
              description: "Submit to Apple App Store and Google Play Store",
              status: "pending",
              assignedAgent: "Launch Agent",
              agentRole: "Release Manager",
              dependencies: ["task-020"],
              deliverables: ["App store listings", "Approved submissions"],
              priority: "high"
            },
            {
              id: "task-022",
              title: "Marketing Website",
              description: "Build landing page with app preview and download links",
              status: "pending",
              assignedAgent: "Dev Agent Alpha",
              agentRole: "Frontend Engineer",
              dependencies: ["task-010"],
              deliverables: ["Marketing website", "SEO optimization"],
              priority: "medium"
            },
            {
              id: "task-023",
              title: "Launch Campaign",
              description: "Execute social media campaign, PR outreach, influencer partnerships",
              status: "pending",
              assignedAgent: "Marketing Agent",
              agentRole: "Growth Marketer",
              dependencies: ["task-021"],
              deliverables: ["Campaign assets", "Press releases", "Social media posts"],
              priority: "high"
            },
            {
              id: "task-024",
              title: "Analytics Setup",
              description: "Implement user analytics and feedback collection",
              status: "pending",
              assignedAgent: "Dev Agent Beta",
              agentRole: "Analytics Engineer",
              dependencies: ["task-021"],
              deliverables: ["Analytics dashboards", "Feedback mechanisms"],
              priority: "medium"
            }
          ],
        },
      ],
      generatedAt: "2024-01-16T09:00:00Z",
      summary: "Comprehensive roadmap for building an AI-powered recipe app from market research through launch. Focuses on understanding user needs, creating delightful UX, and leveraging AI for personalized recipe recommendations.",
      approvedAt: "2024-01-16T09:00:00Z",
    },
  },
  {
    id: "project-002",
    title: "SaaS Analytics Dashboard",
    description: "A real-time analytics platform for e-commerce businesses",
    status: "roadmap",
    createdAt: "2024-01-18T14:00:00Z",
    updatedAt: "2024-01-19T16:20:00Z",
    context: {
      targetAudience: "E-commerce store owners and marketing managers",
      problemStatement: "Current analytics tools are too complex and don't provide actionable insights",
      valueProposition: "Get clear, actionable insights about your e-commerce business in real-time",
      technicalRequirements: ["Web-based dashboard", "Real-time data processing", "Integration with Shopify, WooCommerce"],
      goals: ["Launch beta in 3 months", "Sign up 50 beta customers", "Achieve $10k MRR in 6 months"],
    },
  },
  {
    id: "project-003",
    title: "Fitness Coaching Platform",
    description: "Connect personal trainers with clients for virtual coaching sessions",
    status: "discovery",
    createdAt: "2024-01-20T11:00:00Z",
    updatedAt: "2024-01-20T11:00:00Z",
    context: {},
  },
]

// In-memory chat storage
const chatStorage: Record<string, ChatMessage[]> = {
  "project-003": [
    {
      id: "msg-001",
      role: "assistant",
      content: `Hi! I'm your AI Project Manager. I'm excited to help you develop your project idea.

Based on your description, I can see a few different directions we could take this. Here are some options to consider:

**Option 1: Two-Sided Marketplace**
Build a platform connecting two user groups (supply and demand)

Key focus areas:
• Understand both user personas (providers & consumers)
• Solve the chicken-and-egg problem
• Revenue model and commission structure
• Community building strategy

**Option 2: Consumer Mobile App**
Create a mobile-first experience for end users

Key focus areas:
• User experience and app design
• Target audience research
• App store optimization strategy
• Growth and user acquisition plan

**Option 3: SaaS Product Approach**
Build this as a subscription-based software service targeting businesses

Key focus areas:
• Market research to validate B2B demand
• Value proposition and pricing strategy
• Scalable web architecture
• Customer acquisition and retention plan

Which direction resonates most with you, or would you like to explore a different angle? Feel free to share more about what you envision!`,
      timestamp: "2024-01-20T11:01:00Z",
    },
  ],
}

// In-memory project storage (using globalThis to persist across hot reloads)
const globalForProjects = globalThis as unknown as {
  projectStore: Project[] | undefined
  chatStorage: Record<string, ChatMessage[]> | undefined
}

if (!globalForProjects.projectStore) {
  globalForProjects.projectStore = [...sampleProjects]
}

if (!globalForProjects.chatStorage) {
  globalForProjects.chatStorage = {
    "project-003": [
      {
        id: "msg-001",
        role: "assistant",
        content: JSON.stringify({
          type: "recommendations",
          message: "Hi! I'm your AI Project Manager. Based on your project description, I've identified a few directions we could take. **Please select the option that best matches your vision:**",
          options: [
            {
              title: "Two-Sided Marketplace",
              description: "Build a platform connecting two user groups (supply and demand)",
              keyAreas: [
                "Understand both user personas (providers & consumers)",
                "Solve the chicken-and-egg problem",
                "Revenue model and commission structure",
                "Community building strategy"
              ]
            },
            {
              title: "Consumer Mobile App",
              description: "Create a mobile-first experience for end users",
              keyAreas: [
                "User experience and app design",
                "Target audience research",
                "App store optimization strategy",
                "Growth and user acquisition plan"
              ]
            },
            {
              title: "SaaS Product Approach",
              description: "Build this as a subscription-based software service targeting businesses",
              keyAreas: [
                "Market research to validate B2B demand",
                "Value proposition and pricing strategy",
                "Scalable web architecture",
                "Customer acquisition and retention plan"
              ]
            }
          ]
        }),
        timestamp: "2024-01-20T11:01:00Z",
      },
    ],
  }
}

export function getAllProjects(): Project[] {
  return globalForProjects.projectStore!.sort((a, b) =>
    new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  )
}

export function getProjectById(id: string): Project | undefined {
  return globalForProjects.projectStore!.find(project => project.id === id)
}

export function createProject(description: string): Project {
  const now = new Date().toISOString()
  const newProject: Project = {
    id: `project-${Date.now()}`,
    title: description.slice(0, 60) + (description.length > 60 ? "..." : ""),
    description,
    status: "discovery",
    createdAt: now,
    updatedAt: now,
    context: {},
  }

  globalForProjects.projectStore!.push(newProject)

  // Generate smart recommendations based on project description
  const recommendations = generateRecommendations(description)

  // Initialize chat with welcome message and recommendations
  globalForProjects.chatStorage![newProject.id] = [
    {
      id: `msg-${Date.now()}`,
      role: "assistant",
      content: JSON.stringify({
        type: "recommendations",
        message: "Hi! I'm your AI Project Manager. Based on your project description, I've identified a few directions we could take. **Please select the option that best matches your vision:**",
        options: recommendations
      }),
      timestamp: now,
    },
  ]

  return newProject
}

// Generate smart recommendations based on project description
function generateRecommendations(description: string): Array<{
  title: string
  description: string
  keyAreas: string[]
}> {
  const lowerDesc = description.toLowerCase()

  // Detect keywords to provide contextual recommendations
  const isMobile = /mobile|app|ios|android/.test(lowerDesc)
  const isWeb = /web|website|saas|platform|dashboard/.test(lowerDesc)
  const isAI = /ai|ml|machine learning|intelligence|llm/.test(lowerDesc)
  const isEcommerce = /ecommerce|e-commerce|shop|store|commerce/.test(lowerDesc)
  const isSocial = /social|community|connect|network/.test(lowerDesc)
  const isB2B = /b2b|business|enterprise|saas/.test(lowerDesc)
  const isMarketplace = /marketplace|platform|connect/.test(lowerDesc)

  // Generate 3 contextual recommendations
  const recommendations = []

  if (isB2B || isWeb) {
    recommendations.push({
      title: "SaaS Product Approach",
      description: "Build this as a subscription-based software service targeting businesses",
      keyAreas: [
        "Market research to validate B2B demand",
        "Value proposition and pricing strategy",
        "Scalable web architecture",
        "Customer acquisition and retention plan"
      ]
    })
  }

  if (isMobile || (!isB2B && !isWeb)) {
    recommendations.push({
      title: "Consumer Mobile App",
      description: "Create a mobile-first experience for end users",
      keyAreas: [
        "User experience and app design",
        "Target audience research",
        "App store optimization strategy",
        "Growth and user acquisition plan"
      ]
    })
  }

  if (isMarketplace || isSocial) {
    recommendations.push({
      title: "Two-Sided Marketplace",
      description: "Build a platform connecting two user groups (supply and demand)",
      keyAreas: [
        "Understand both user personas (providers & consumers)",
        "Solve the chicken-and-egg problem",
        "Revenue model and commission structure",
        "Community building strategy"
      ]
    })
  }

  if (isAI || recommendations.length < 2) {
    recommendations.push({
      title: "AI-Enhanced Solution",
      description: "Leverage AI/ML to provide intelligent, automated value",
      keyAreas: [
        "Define the AI's core value proposition",
        "Data requirements and model training",
        "Technical architecture for AI integration",
        "Competitive differentiation through AI"
      ]
    })
  }

  if (recommendations.length < 3) {
    recommendations.push({
      title: "MVP (Minimum Viable Product)",
      description: "Start with the simplest version to validate the idea quickly",
      keyAreas: [
        "Identify the single most important problem to solve",
        "Design the minimum feature set",
        "Quick validation with target users",
        "Iterative development based on feedback"
      ]
    })
  }

  return recommendations.slice(0, 3)
}

export function updateProject(id: string, updates: Partial<Project>): Project | null {
  const index = globalForProjects.projectStore!.findIndex(project => project.id === id)
  if (index === -1) return null

  const updatedProject: Project = {
    ...globalForProjects.projectStore![index],
    ...updates,
    id: globalForProjects.projectStore![index].id,
    createdAt: globalForProjects.projectStore![index].createdAt,
    updatedAt: new Date().toISOString(),
  }

  globalForProjects.projectStore![index] = updatedProject
  return updatedProject
}

export function deleteProject(id: string): boolean {
  const initialLength = globalForProjects.projectStore!.length
  globalForProjects.projectStore = globalForProjects.projectStore!.filter(project => project.id !== id)
  delete globalForProjects.chatStorage![id]
  return globalForProjects.projectStore.length < initialLength
}

// Chat functions
export function getChatHistory(projectId: string): ChatMessage[] {
  return globalForProjects.chatStorage![projectId] || []
}

export function addChatMessage(projectId: string, role: MessageRole, content: string): ChatMessage {
  if (!globalForProjects.chatStorage![projectId]) {
    globalForProjects.chatStorage![projectId] = []
  }

  const message: ChatMessage = {
    id: `msg-${Date.now()}-${Math.random()}`,
    role,
    content,
    timestamp: new Date().toISOString(),
  }

  globalForProjects.chatStorage![projectId].push(message)
  return message
}

export function resetProjectStore(): void {
  globalForProjects.projectStore = [...sampleProjects]
}
