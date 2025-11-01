import { NextRequest, NextResponse } from "next/server"
import { getAllAgents, createAgent } from "@/lib/data/sample-agents"
import type { CreateAgentRequest, AgentListResponse } from "@/lib/types/agent"

// GET /api/agents - List all agents
export async function GET() {
  try {
    const agents = getAllAgents()

    const response: AgentListResponse = {
      agents,
      total: agents.length,
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error("Error fetching agents:", error)
    return NextResponse.json(
      { error: "Failed to fetch agents" },
      { status: 500 }
    )
  }
}

// POST /api/agents - Create a new agent
export async function POST(request: NextRequest) {
  try {
    const body: CreateAgentRequest = await request.json()

    // Basic validation
    if (!body.name || !body.role || !body.goal) {
      return NextResponse.json(
        { error: "Missing required fields: name, role, and goal are required" },
        { status: 400 }
      )
    }

    // Create the agent
    const newAgent = createAgent({
      name: body.name,
      role: body.role,
      goal: body.goal,
      backstory: body.backstory || "",
      tools: body.tools || [],
      llmProvider: body.llmProvider || "openai",
      llmModel: body.llmModel || "gpt-4",
      allowDelegation: body.allowDelegation ?? true,
      verbose: body.verbose ?? true,
    })

    return NextResponse.json(newAgent, { status: 201 })
  } catch (error) {
    console.error("Error creating agent:", error)
    return NextResponse.json(
      { error: "Failed to create agent" },
      { status: 500 }
    )
  }
}
