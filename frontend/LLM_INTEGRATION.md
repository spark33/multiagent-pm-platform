# LLM Integration Guide

## Overview

The PM Agent discovery flow is currently using hardcoded questions and options. This document outlines how to integrate an LLM to make the conversation intelligent, contextual, and research-driven.

## Current Flow (Temporary)

```typescript
// app/api/projects/[id]/chat/route.ts
// Question 1: Project approach (3 recommendations)
// Question 2: Target audience (4 options)
// Question 3: Problems to solve (4 options, multi-select)
// Question 4: Differentiation (6 options, multi-select)
// Final: Generate Roadmap (2 actions)
```

## Target LLM-Driven Flow

### 1. Initial Recommendations

**Current:** Keyword-based analysis in `generateRecommendations()`

**Target:** LLM analyzes project description and:
- Researches similar products/competitors
- Identifies market positioning opportunities
- Generates 3 contextual approaches with:
  - Title
  - Description
  - 4 key focus areas specific to this project

**Prompt Template:**
```
Analyze this project description: "{description}"

Research competitors and the market landscape. Generate 3 strategic approaches
for building this product, each with a title, description, and 4 key focus areas.

Return as JSON:
{
  "type": "recommendations",
  "message": "Based on your description...",
  "options": [
    {
      "title": "Approach name",
      "description": "Brief description",
      "keyAreas": ["Focus 1", "Focus 2", "Focus 3", "Focus 4"]
    }
  ]
}
```

### 2. Follow-up Questions

**Current:** Hardcoded questions about audience, problems, differentiation

**Target:** LLM generates contextual questions based on:
- Previous user responses
- Competitor analysis
- Market research
- Gaps in understanding

**Prompt Template:**
```
Project context:
- Description: {description}
- User selections: {conversation_history}

Analyze competitors in this space. Generate the next most valuable question
to ask, with 4-6 smart options based on market research.

Return as JSON:
{
  "type": "options",
  "message": "Your question with **markdown**",
  "allowMultiSelect": true/false,
  "options": [
    {
      "label": "Short label",
      "description": "Explanation based on market insight"
    }
  ]
}
```

### 3. Dynamic Question Count

**Current:** Fixed 4 questions

**Target:** LLM decides when to stop based on:
- Completeness of product vision
- Clarity of target market
- Understanding of differentiation
- Ability to create actionable roadmap

**Decision Prompt:**
```
Conversation so far: {full_history}

Do you have enough context to create a comprehensive roadmap covering:
- Market research plan
- Competitive positioning
- Target audience persona
- Product features & differentiation
- Technical architecture approach
- Design requirements

If yes, return type: "action" to generate roadmap.
If no, return type: "options" with your next question.
```

## Response Format

All LLM responses must be valid JSON matching one of these types:

### Type: "recommendations" (Initial)
```json
{
  "type": "recommendations",
  "message": "PM message with **markdown**",
  "options": [
    {
      "title": "Option Title",
      "description": "Brief description",
      "keyAreas": ["Area 1", "Area 2", "Area 3", "Area 4"]
    }
  ]
}
```

### Type: "options" (Follow-up)
```json
{
  "type": "options",
  "message": "Question text",
  "allowMultiSelect": true,
  "options": [
    {
      "label": "Short Label",
      "description": "Explanation"
    }
  ]
}
```

### Type: "action" (Final)
```json
{
  "type": "action",
  "message": "Summary with ✓ checkmarks",
  "actions": [
    {
      "label": "Generate Roadmap",
      "value": "generate_roadmap",
      "primary": true
    },
    {
      "label": "Refine Details",
      "value": "continue_chat",
      "primary": false
    }
  ]
}
```

## Integration Points

### 1. Replace Initial Recommendations
**File:** `frontend/lib/data/sample-projects.ts`
**Function:** `generateRecommendations(description: string)`

Replace keyword matching with:
```typescript
async function generateRecommendations(description: string) {
  const response = await callLLM({
    prompt: `Analyze project: "${description}". Research competitors...`,
    responseFormat: "json"
  })
  return response.options
}
```

### 2. Replace Chat Response Logic
**File:** `frontend/app/api/projects/[id]/chat/route.ts`
**Function:** `POST` handler

Replace `if (conversationLength === X)` logic with:
```typescript
const llmResponse = await generateNextQuestion({
  projectDescription: project.description,
  conversationHistory: chatHistory,
  userMessage: body.content
})

const assistantMessage = addChatMessage(
  id,
  "assistant",
  JSON.stringify(llmResponse)
)
```

## LLM Capabilities Needed

1. **Market Research**
   - Search competitors
   - Analyze positioning
   - Identify differentiation opportunities

2. **Conversation Management**
   - Track conversation state
   - Determine information gaps
   - Generate contextual questions

3. **Structured Output**
   - Return valid JSON
   - Follow response format exactly
   - Include markdown in messages

4. **Decision Making**
   - Know when to stop asking questions
   - Determine if ready for roadmap generation

## Recommended LLM Setup

### Option 1: OpenAI (GPT-4)
```typescript
import OpenAI from "openai"

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

const response = await openai.chat.completions.create({
  model: "gpt-4-turbo-preview",
  messages: [
    { role: "system", content: PM_SYSTEM_PROMPT },
    ...conversationHistory
  ],
  response_format: { type: "json_object" }
})
```

### Option 2: Anthropic (Claude)
```typescript
import Anthropic from "@anthropic-ai/sdk"

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY
})

const response = await anthropic.messages.create({
  model: "claude-3-opus-20240229",
  messages: conversationHistory,
  system: PM_SYSTEM_PROMPT
})
```

## System Prompt Template

```
You are an AI Project Manager helping users develop their product ideas.

Your role:
1. Analyze project descriptions and research competitors
2. Ask insightful questions to understand:
   - Target audience and market fit
   - Core problems being solved
   - Unique value proposition
   - Product differentiation
3. Generate smart multiple-choice options based on market research
4. Know when you have enough context to create a roadmap

Response Format:
- Always return valid JSON
- Use "type": "recommendations", "options", or "action"
- Include markdown formatting in messages
- Base options on actual market research and competitor analysis

When you have enough information about:
✓ Project vision
✓ Target market
✓ Problems to solve
✓ Differentiation strategy

Then return type: "action" to generate the roadmap.
```

## Environment Variables

Add to `.env.local`:
```bash
# Choose one
OPENAI_API_KEY=sk-...
ANTHROPIC_API_KEY=sk-ant-...

# Optional: For market research
SERPER_API_KEY=...  # Google search API
EXA_API_KEY=...     # Semantic search
```

## Testing LLM Integration

1. **Test Initial Recommendations:**
   ```bash
   # Should return 3 contextual approaches
   POST /api/projects
   { "description": "A mobile app for meal planning" }
   ```

2. **Test Follow-up Questions:**
   ```bash
   # Should ask contextual questions based on selection
   POST /api/projects/{id}/chat
   { "content": "I'm interested in: Consumer Mobile App" }
   ```

3. **Test Conversation Completion:**
   ```bash
   # After 3-5 exchanges, should offer to generate roadmap
   POST /api/projects/{id}/chat
   { "content": "Better UX, AI-Powered" }
   ```

## Migration Path

1. ✅ **Phase 1: Current** - Hardcoded questions (working)
2. **Phase 2: Hybrid** - LLM for recommendations only
3. **Phase 3: Full LLM** - All questions dynamically generated
4. **Phase 4: Research-Enhanced** - Add real-time competitor research

## Next Steps

1. Choose LLM provider (OpenAI/Anthropic)
2. Set up API keys
3. Create `lib/llm/pm-agent.ts` with LLM functions
4. Replace `generateRecommendations()` first
5. Replace chat route handler
6. Test and iterate on prompts
7. Add competitor research capabilities

## Notes

- Keep fallback to hardcoded questions if LLM fails
- Log all LLM interactions for debugging
- Monitor token usage and costs
- Consider streaming responses for better UX
- Cache competitor research results
