import { AgentModel } from '../models/agent'
import { ProjectModel } from '../models/project'
import { ChatModel } from '../models/chat'

console.log('🌱 Seeding database...')

// Seed sample agents
const sampleAgents = [
  {
    name: "PM Agent",
    role: "Product Manager",
    goal: "Guide users through discovery and create comprehensive project roadmaps",
    backstory: "An experienced PM who asks the right questions to understand user needs and translate them into actionable plans. Expert at market research and competitive analysis.",
    tools: ["web_search", "competitor_analysis", "market_research"],
    llmProvider: "anthropic",
    llmModel: "claude-3-5-haiku-20241022",
    allowDelegation: true,
    verbose: false
  },
  {
    name: "Research Agent Alpha",
    role: "Market Analyst",
    goal: "Conduct thorough market research and competitive analysis",
    backstory: "A meticulous researcher with expertise in market analysis, competitive intelligence, and user research. Provides data-driven insights.",
    tools: ["web_search", "data_analysis", "report_generation"],
    llmProvider: "anthropic",
    llmModel: "claude-3-5-haiku-20241022",
    allowDelegation: false,
    verbose: true
  },
  {
    name: "Design Agent Alpha",
    role: "UX Designer",
    goal: "Create intuitive user experiences and interfaces",
    backstory: "A creative UX designer focused on user-centered design. Expert at translating user needs into elegant, functional designs.",
    tools: ["figma", "user_testing", "prototyping"],
    llmProvider: "anthropic",
    llmModel: "claude-3-5-haiku-20241022",
    allowDelegation: false,
    verbose: false
  },
  {
    name: "Dev Agent Alpha",
    role: "Backend Engineer",
    goal: "Build robust, scalable backend systems",
    backstory: "A seasoned backend engineer with expertise in API design, database architecture, and system optimization.",
    tools: ["code_execution", "git", "database_tools"],
    llmProvider: "anthropic",
    llmModel: "claude-3-5-haiku-20241022",
    allowDelegation: false,
    verbose: true
  }
]

// Create agents
sampleAgents.forEach(agent => {
  const created = AgentModel.create(agent)
  console.log(`✅ Created agent: ${created.name}`)
})

// Seed a sample project
const sampleProject = ProjectModel.create(
  "A mobile app that helps busy professionals plan healthy meals using AI"
)
console.log(`✅ Created sample project: ${sampleProject.title}`)

// Add some chat history to the sample project
ChatModel.addMessage(
  sampleProject.id,
  'assistant',
  JSON.stringify({
    type: "recommendations",
    message: "I've analyzed your project idea for an AI-powered meal planning app. Here are three strategic approaches you could take:",
    options: [
      {
        title: "Consumer Mobile App",
        description: "Direct-to-consumer mobile app focused on individual meal planning",
        keyAreas: [
          "AI-powered personalization",
          "Recipe recommendations",
          "Grocery list automation",
          "Nutrition tracking"
        ]
      },
      {
        title: "B2B Wellness Platform",
        description: "Partner with corporate wellness programs and nutritionists",
        keyAreas: [
          "Enterprise integrations",
          "Team meal planning",
          "Nutritionist dashboards",
          "Health metrics reporting"
        ]
      },
      {
        title: "Hybrid Marketplace",
        description: "Connect users with meal prep services and nutritionists",
        keyAreas: [
          "Marketplace features",
          "Meal prep service partnerships",
          "Expert consultations",
          "Delivery integration"
        ]
      }
    ]
  })
)
console.log(`✅ Added initial chat message to sample project`)

console.log('\n🎉 Database seeded successfully!')
console.log(`\nYou can now:`)
console.log(`- Start the server: npm run dev`)
console.log(`- Visit http://localhost:3001/health`)
console.log(`- View projects: http://localhost:3001/api/projects`)
console.log(`- View agents: http://localhost:3001/api/agents`)
