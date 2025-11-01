import { NextRequest, NextResponse } from "next/server"
import { getChatHistory, addChatMessage } from "@/lib/data/sample-projects"
import type { SendMessageRequest } from "@/lib/types/project"

// GET /api/projects/[id]/chat - Get chat history
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const messages = getChatHistory(id)

    return NextResponse.json({
      messages,
      projectId: id,
    })
  } catch (error) {
    console.error("Error fetching chat history:", error)
    return NextResponse.json(
      { error: "Failed to fetch chat history" },
      { status: 500 }
    )
  }
}

// POST /api/projects/[id]/chat - Send a message
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body: SendMessageRequest = await request.json()

    if (!body.content || !body.content.trim()) {
      return NextResponse.json(
        { error: "Message content is required" },
        { status: 400 }
      )
    }

    // Add user message
    const userMessage = addChatMessage(id, "user", body.content)

    // Get conversation history to determine next question
    const chatHistory = getChatHistory(id)
    const conversationLength = chatHistory.filter(m => m.role === "user").length

    // Simulate delay for more realistic feel
    await new Promise(resolve => setTimeout(resolve, 500))

    let assistantMessage

    // TODO: Replace this entire logic with LLM-driven conversation
    // The LLM should:
    // 1. Analyze the user's responses so far
    // 2. Research competitors and market positioning
    // 3. Generate contextual follow-up questions with smart options
    // 4. Determine when enough context has been gathered
    // 5. Generate structured JSON responses with type: "options" or "action"

    // TEMPORARY: Simple progressive discovery questions
    if (conversationLength === 1) {
      // After initial selection, ask about target audience
      // TODO: LLM should analyze the project description and generate audience options
      // based on competitor analysis and market research
      assistantMessage = addChatMessage(id, "assistant", JSON.stringify({
        type: "options",
        message: "Great choice! Now let's understand **who this is for**. Select the audience that best describes your target users:",
        options: [
          { label: "Consumers (B2C)", description: "Individual users, personal use cases" },
          { label: "Small Businesses", description: "SMBs, startups, freelancers" },
          { label: "Enterprise", description: "Large organizations, corporate clients" },
          { label: "Mixed/Multiple", description: "Serves different user segments" }
        ]
      }))
    } else if (conversationLength === 2) {
      // Ask about the main problem - allow multiple selections
      // TODO: LLM should identify common pain points based on competitor analysis
      assistantMessage = addChatMessage(id, "assistant", JSON.stringify({
        type: "options",
        message: "Perfect! What **problems** are you solving? Select all that apply:",
        allowMultiSelect: true,
        options: [
          { label: "Saves Time", description: "Automates tasks, increases efficiency" },
          { label: "Reduces Costs", description: "Cuts expenses, improves ROI" },
          { label: "Improves Quality", description: "Better outcomes, enhanced experience" },
          { label: "Enables Growth", description: "Unlocks new opportunities, scales impact" }
        ]
      }))
    } else if (conversationLength === 3) {
      // Ask about unique value proposition
      // TODO: LLM should analyze competitors and suggest differentiation strategies
      assistantMessage = addChatMessage(id, "assistant", JSON.stringify({
        type: "options",
        message: "Excellent! What will make your solution **stand out** from competitors?",
        allowMultiSelect: true,
        options: [
          { label: "Better UX", description: "More intuitive and delightful to use" },
          { label: "AI-Powered", description: "Intelligent automation and insights" },
          { label: "Cost Effective", description: "More affordable than alternatives" },
          { label: "Faster", description: "Quicker results and turnaround" },
          { label: "More Features", description: "Comprehensive all-in-one solution" },
          { label: "Specialized", description: "Focused on a specific niche" }
        ]
      }))
    } else {
      // Ready to generate roadmap
      // TODO: LLM should summarize the gathered context and confirm readiness
      assistantMessage = addChatMessage(id, "assistant", JSON.stringify({
        type: "action",
        message: "Excellent! I now have a clear picture of your project. Based on our conversation:\n\n" +
          "✓ Project vision and approach\n" +
          "✓ Target audience\n" +
          "✓ Core problems to solve\n" +
          "✓ Unique value proposition\n\n" +
          "I'm ready to create a **comprehensive roadmap** covering market research, competitive analysis, product strategy, design, technical architecture, and development phases. Our AI agents will handle all the execution. Would you like me to generate it now?",
        actions: [
          { label: "Generate Roadmap", value: "generate_roadmap", primary: true },
          { label: "Refine Details", value: "continue_chat", primary: false }
        ]
      }))
    }

    return NextResponse.json({
      message: assistantMessage,
    })
  } catch (error) {
    console.error("Error sending message:", error)
    return NextResponse.json(
      { error: "Failed to send message" },
      { status: 500 }
    )
  }
}
