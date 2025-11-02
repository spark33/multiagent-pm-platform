import type { ChatMessage } from '../types'

/**
 * Generate PM Agent response based on conversation history.
 * TODO: Replace with LLM-based conversation
 */
export function generatePMResponse(chatHistory: ChatMessage[], userMessage: string): string {
  const conversationLength = chatHistory.filter(m => m.role === 'user').length

  // Progressive discovery questions (temporary hardcoded logic)
  if (conversationLength === 1) {
    // After initial selection, ask about target audience
    return JSON.stringify({
      type: "options",
      message: "Great choice! Now let's understand **who this is for**. Select the audience that best describes your target users:",
      options: [
        { label: "Consumers (B2C)", description: "Individual users, personal use cases" },
        { label: "Small Businesses", description: "SMBs, startups, freelancers" },
        { label: "Enterprise", description: "Large organizations, corporate clients" },
        { label: "Mixed/Multiple", description: "Serves different user segments" }
      ]
    })
  } else if (conversationLength === 2) {
    // Ask about the main problem - allow multiple selections
    return JSON.stringify({
      type: "options",
      message: "Perfect! What **problems** are you solving? Select all that apply:",
      allowMultiSelect: true,
      options: [
        { label: "Saves Time", description: "Automates tasks, increases efficiency" },
        { label: "Reduces Costs", description: "Cuts expenses, improves ROI" },
        { label: "Improves Quality", description: "Better outcomes, enhanced experience" },
        { label: "Enables Growth", description: "Unlocks new opportunities, scales impact" }
      ]
    })
  } else if (conversationLength === 3) {
    // Ask about unique value proposition
    return JSON.stringify({
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
    })
  } else {
    // Ready to generate roadmap
    return JSON.stringify({
      type: "action",
      message: "Excellent! I now have a clear picture of your project. Based on our conversation:\n\n" +
        "✓ Project vision and approach\n" +
        "✓ Target audience\n" +
        "✓ Core problems to solve\n" +
        "✓ Unique value proposition\n\n" +
        "I'm ready to create a **comprehensive roadmap** covering market research, competitive analysis, product strategy, design, technical architecture, and development phases. Our AI agents will handle all the execution.",
      actions: [
        { label: "Let's go!", value: "generate_roadmap", primary: true },
        { label: "Refine Details", value: "continue_chat", primary: false }
      ]
    })
  }
}
