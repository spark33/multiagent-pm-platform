import Anthropic from '@anthropic-ai/sdk'
import type { ChatMessage, Agent, Task, Deliverable, DiscussionMessage, ApprovalStatus } from '../types'

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

const SYSTEM_PROMPT = `You are an expert AI Project Manager helping users define and plan software projects. Your role is to:

1. **Understand the Project**: Ask intelligent, context-aware questions to deeply understand what the user wants to build
2. **Gather Requirements**: Extract key information about:
   - Target audience (who will use this?)
   - Core problems being solved (why does this need to exist?)
   - Key features and functionality (what should it do?)
   - Success criteria (how will we know it's successful?)
   - Technical constraints or preferences (any specific requirements?)

3. **Adaptive Questioning**:
   - Don't ask questions with obvious answers based on the project description
   - If the user says "personal finance app", don't ask if it's B2B - it's clearly B2C
   - If they mention "enterprise dashboard", don't ask if it's for consumers
   - Tailor your questions to what's genuinely unclear or needs clarification

4. **Response Format**:
   - Use the send_pm_response tool to send your response
   - In the message field: write your question or statement naturally - DO NOT list the options in the message text
   - The options/actions will be rendered as interactive UI elements separately
   - Keep the message focused on the question or context, not the choices

5. **Discovery Flow**:
   - Start by acknowledging their project idea warmly
   - Ask 3-5 targeted questions total (don't overdo it)
   - Focus on what's truly ambiguous or needs clarification
   - **Know when to stop**: Once you understand the core of what they're building, who it's for, and what problems it solves, you have enough
   - **Hard limit**: Maximum 10 conversation turns. If you reach turn 10, you MUST provide the final "action" response
   - After gathering sufficient context (or reaching turn 10), use type "action" to offer roadmap generation
   - For final action responses, summarize what you've learned and use the exact button labels defined in the tool

6. **Conversation Style**:
   - Be enthusiastic and supportive
   - Keep responses concise and focused
   - Use markdown for emphasis (**bold** for key terms)
   - Make questions feel conversational, not like a form

Remember: The goal is to gather just enough context to generate a great project roadmap, not to interrogate the user.`

export interface LLMResponse {
  content: string
}

/**
 * Generate a PM response using Claude based on conversation history
 */
export async function generatePMResponse(
  chatHistory: ChatMessage[],
  userMessage: string
): Promise<string> {
  try {
    // Count user messages to determine conversation turn
    const userMessageCount = chatHistory.filter(m => m.role === 'user').length
    const MAX_TURNS = 10

    // If we've reached max turns, force the final action response
    if (userMessageCount >= MAX_TURNS) {
      return JSON.stringify({
        type: "action",
        message: "Perfect! I have a solid understanding of your project. Let me create a comprehensive roadmap that will guide the development from concept to launch.\n\nReady to see your roadmap?",
        actions: [
          { label: "Let's go!", value: "generate_roadmap", primary: true },
          { label: "Refine Details", value: "continue_chat", primary: false }
        ]
      })
    }

    // Convert chat history to Anthropic message format
    const messages = chatHistory.map(msg => ({
      role: msg.role === 'user' ? 'user' as const : 'assistant' as const,
      content: msg.content
    }))

    // Add current turn number to system prompt for context
    const contextualPrompt = `${SYSTEM_PROMPT}\n\n**Current Status**: This is conversation turn ${userMessageCount} of ${MAX_TURNS}. ${userMessageCount >= 8 ? 'You should wrap up and provide the final action response soon.' : ''}`

    const response = await anthropic.messages.create({
      model: 'claude-3-5-haiku-20241022',
      max_tokens: 1024,
      system: contextualPrompt,
      messages: messages,
      tools: [
        {
          name: 'send_pm_response',
          description: 'Send a structured response to the user with either options to select or actions to take',
          input_schema: {
            type: 'object',
            properties: {
              type: {
                type: 'string',
                enum: ['options', 'action'],
                description: 'Type of response - "options" for questions with choices, "action" for final CTA buttons'
              },
              message: {
                type: 'string',
                description: 'The message to display to the user, can include markdown formatting'
              },
              allowMultiSelect: {
                type: 'boolean',
                description: 'Only for type "options" - whether user can select multiple options'
              },
              options: {
                type: 'array',
                description: 'Only for type "options" - array of choices for the user',
                items: {
                  type: 'object',
                  properties: {
                    label: {
                      type: 'string',
                      description: 'Short label for the option'
                    },
                    description: {
                      type: 'string',
                      description: 'Explanation of what this option means'
                    }
                  },
                  required: ['label', 'description']
                }
              },
              actions: {
                type: 'array',
                description: 'Only for type "action" - array of action buttons. Must include: "Let\'s go!" (primary) and "Refine Details" (secondary)',
                items: {
                  type: 'object',
                  properties: {
                    label: {
                      type: 'string',
                      description: 'Button text - MUST be "Let\'s go!" for primary or "Refine Details" for secondary'
                    },
                    value: {
                      type: 'string',
                      description: 'Action identifier - "generate_roadmap" or "continue_chat"'
                    },
                    primary: {
                      type: 'boolean',
                      description: 'Whether this is the primary action'
                    }
                  },
                  required: ['label', 'value', 'primary']
                }
              }
            },
            required: ['type', 'message']
          }
        }
      ],
      tool_choice: { type: 'tool', name: 'send_pm_response' }
    })

    // Extract tool use from response
    const toolUse = response.content.find(block => block.type === 'tool_use')
    if (!toolUse || toolUse.type !== 'tool_use') {
      throw new Error('No tool use in Claude response')
    }

    // Return the tool input as JSON string
    return JSON.stringify(toolUse.input)
  } catch (error) {
    console.error('Error calling Claude API:', error)

    // Fallback response if LLM fails
    return JSON.stringify({
      type: "options",
      message: "I'm having trouble connecting right now. Let me ask you a basic question: What's the main goal of this project?",
      options: [
        { label: "Solve a problem", description: "Address a specific pain point" },
        { label: "Learn something new", description: "Educational or experimental" },
        { label: "Build a business", description: "Commercial product or service" },
        { label: "Personal use", description: "Just for myself or close contacts" }
      ]
    })
  }
}

/**
 * Generate a project roadmap using Claude based on the gathered context
 */
export async function generateRoadmapWithLLM(
  projectDescription: string,
  chatHistory: ChatMessage[]
): Promise<any> {
  try {
    const conversationContext = chatHistory
      .map(m => `${m.role === 'user' ? 'User' : 'PM'}: ${m.content}`)
      .join('\n\n')

    const roadmapPrompt = `Based on this discovery conversation about a project, generate a comprehensive project roadmap.

Project Description: ${projectDescription}

Discovery Conversation:
${conversationContext}

Generate a detailed roadmap with 6 phases: Research, Strategy, Design, Architecture, Development, and Launch.

For each phase, include:
- Specific tasks tailored to this project
- Clear deliverables
- Agent assignments
- Dependencies between tasks

Return the roadmap in JSON format matching this structure:
{
  "phases": [
    {
      "name": "research|strategy|design|architecture|development|launch",
      "title": "Phase Title",
      "description": "What this phase accomplishes",
      "objective": "Key objective",
      "status": "pending",
      "deliverables": ["deliverable1", "deliverable2"],
      "tasks": [
        {
          "title": "Task name",
          "description": "What needs to be done",
          "status": "pending",
          "assignedAgent": "Agent name",
          "agentRole": "Role title",
          "dependencies": [],
          "deliverables": ["specific deliverable"],
          "priority": "high|medium|low"
        }
      ]
    }
  ],
  "summary": "Brief summary of the roadmap"
}`

    const response = await anthropic.messages.create({
      model: 'claude-3-5-haiku-20241022',
      max_tokens: 4096,
      system: 'You are an expert project manager creating detailed, actionable roadmaps. Generate comprehensive roadmaps tailored to the specific project context.',
      messages: [
        {
          role: 'user',
          content: roadmapPrompt
        }
      ]
    })

    const textContent = response.content.find(block => block.type === 'text')
    if (!textContent || textContent.type !== 'text') {
      throw new Error('No text content in Claude response')
    }

    // Parse and return the JSON roadmap
    const roadmapData = JSON.parse(textContent.text)
    return roadmapData
  } catch (error) {
    console.error('Error generating roadmap with LLM:', error)
    // Return null to fall back to the mock generator
    return null
  }
}

/**
 * Generate initial deliverable for a task
 * Agent creates their first version of the deliverable
 */
export async function generateInitialDeliverable(
  agent: Agent,
  task: Task
): Promise<string> {
  try {
    const prompt = `You are ${agent.name}, a ${agent.role}.

Your goal: ${agent.goal}
Your backstory: ${agent.backstory}

You have been assigned to complete the following task:

**Task:** ${task.title}
**Description:** ${task.description}
**Deliverables:** ${task.deliverables.join(', ')}

Create a comprehensive deliverable for this task. Be specific, detailed, and actionable.
Format your response in markdown with clear sections.`

    const response = await anthropic.messages.create({
      model: 'claude-3-5-haiku-20241022',
      max_tokens: 2048,
      system: 'You are a helpful AI agent working on a project task. Create high-quality, detailed deliverables.',
      messages: [{ role: 'user', content: prompt }]
    })

    const textContent = response.content.find(block => block.type === 'text')
    if (!textContent || textContent.type !== 'text') {
      throw new Error('No text content in response')
    }

    return textContent.text
  } catch (error) {
    console.error('Error generating initial deliverable:', error)
    return `# ${task.title}\n\n${task.description}\n\n*Deliverable content would be generated here*`
  }
}

/**
 * Generate review feedback from a reviewer agent
 * Reviewer analyzes the deliverable and provides structured feedback
 */
export async function generateReviewFeedback(
  reviewer: Agent,
  deliverable: Deliverable,
  previousMessages: DiscussionMessage[]
): Promise<{ content: string; approvalStatus: ApprovalStatus }> {
  try {
    // Build context from previous discussion
    const discussionContext = previousMessages.length > 0
      ? `\n\nPrevious discussion:\n${previousMessages.map(m =>
          `**${m.agentName} (${m.agentRole})**: ${m.content}`
        ).join('\n\n')}`
      : ''

    const prompt = `You are ${reviewer.name}, a ${reviewer.role}.

Your goal: ${reviewer.goal}
Your backstory: ${reviewer.backstory}

You are reviewing the following deliverable:

${deliverable.content}

${discussionContext}

Provide a thorough review with:
1. What works well
2. Specific concerns or suggestions for improvement
3. Whether you approve this deliverable or request changes

End your review with either:
- "APPROVED" if this deliverable meets quality standards
- "NEEDS_REVISION" if changes are required

Be constructive, specific, and focus on helping improve the deliverable.`

    const response = await anthropic.messages.create({
      model: 'claude-3-5-haiku-20241022',
      max_tokens: 1024,
      system: 'You are a thorough reviewer providing constructive feedback on project deliverables.',
      messages: [{ role: 'user', content: prompt }]
    })

    const textContent = response.content.find(block => block.type === 'text')
    if (!textContent || textContent.type !== 'text') {
      throw new Error('No text content in response')
    }

    const content = textContent.text
    const approvalStatus: ApprovalStatus = content.includes('APPROVED')
      ? 'approved'
      : 'has_concerns'

    return { content, approvalStatus }
  } catch (error) {
    console.error('Error generating review feedback:', error)
    return {
      content: 'Error generating review. Defaulting to approval.',
      approvalStatus: 'approved'
    }
  }
}

/**
 * Generate primary agent's response to reviewer feedback
 * Determines if revision is needed and how to address concerns
 */
export async function generatePrimaryAgentResponse(
  primaryAgent: Agent,
  deliverable: Deliverable,
  reviewerFeedback: DiscussionMessage[],
  allMessages: DiscussionMessage[]
): Promise<{ content: string; needsRevision: boolean; revisionSummary?: string }> {
  try {
    const feedbackSummary = reviewerFeedback.map(m =>
      `**${m.agentName} (${m.agentRole})**:\n${m.content}`
    ).join('\n\n')

    const prompt = `You are ${primaryAgent.name}, a ${primaryAgent.role}.

Your goal: ${primaryAgent.goal}

You created this deliverable:
${deliverable.content}

The review team provided this feedback:
${feedbackSummary}

Respond to the feedback:
1. Acknowledge valid points
2. Explain your approach where needed
3. Determine if you need to create a revised version

End your response with either:
- "REVISION_NEEDED" if you will create an updated deliverable
- "NO_REVISION" if concerns can be addressed without changing the deliverable

If revision is needed, briefly summarize what you'll change.`

    const response = await anthropic.messages.create({
      model: 'claude-3-5-haiku-20241022',
      max_tokens: 1024,
      system: 'You are responding to feedback on your work. Be professional and collaborative.',
      messages: [{ role: 'user', content: prompt }]
    })

    const textContent = response.content.find(block => block.type === 'text')
    if (!textContent || textContent.type !== 'text') {
      throw new Error('No text content in response')
    }

    const content = textContent.text
    const needsRevision = content.includes('REVISION_NEEDED')

    // Extract revision summary if present
    let revisionSummary: string | undefined
    if (needsRevision) {
      const summaryMatch = content.match(/will (create|make|update|revise|change).*?(?=\n\n|$)/i)
      revisionSummary = summaryMatch ? summaryMatch[0] : 'Addressing reviewer feedback'
    }

    return { content, needsRevision, revisionSummary }
  } catch (error) {
    console.error('Error generating primary agent response:', error)
    return {
      content: 'Thank you for the feedback. I will review and make necessary updates.',
      needsRevision: true,
      revisionSummary: 'Updating based on feedback'
    }
  }
}

/**
 * Generate revised deliverable based on feedback
 */
export async function generateRevisedDeliverable(
  primaryAgent: Agent,
  currentDeliverable: Deliverable,
  reviewerFeedback: DiscussionMessage[],
  allMessages: DiscussionMessage[]
): Promise<string> {
  try {
    const feedbackSummary = reviewerFeedback.map(m =>
      `**${m.agentName}**: ${m.content}`
    ).join('\n\n')

    const prompt = `You are ${primaryAgent.name}, a ${primaryAgent.role}.

Your current deliverable:
${currentDeliverable.content}

Reviewer feedback to address:
${feedbackSummary}

Create an improved version of the deliverable that addresses all valid concerns.
Maintain the same format and structure, but incorporate the suggested improvements.`

    const response = await anthropic.messages.create({
      model: 'claude-3-5-haiku-20241022',
      max_tokens: 2048,
      system: 'You are revising a deliverable based on peer feedback. Maintain quality while addressing concerns.',
      messages: [{ role: 'user', content: prompt }]
    })

    const textContent = response.content.find(block => block.type === 'text')
    if (!textContent || textContent.type !== 'text') {
      throw new Error('No text content in response')
    }

    return textContent.text
  } catch (error) {
    console.error('Error generating revised deliverable:', error)
    return currentDeliverable.content + '\n\n---\n*Revision in progress*'
  }
}
