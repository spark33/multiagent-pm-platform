# Multi-Agent Orchestration Platform

A PM-led conversational platform for building products with AI agents. Users describe their project idea, the PM Agent conducts discovery through chat, then generates a comprehensive roadmap that AI agents execute.

## Features

- **Conversational Discovery**: PM Agent asks intelligent questions to understand your product vision
- **Smart Recommendations**: Context-aware suggestions based on your project description
- **Comprehensive Roadmaps**: Automatically generated roadmaps covering:
  - Market research & competitive analysis
  - Product strategy & positioning
  - UX/UI design
  - Technical architecture
  - Development & testing
  - Launch & marketing
- **AI Agent Execution**: All tasks are executed by specialized AI agents
- **Real-time Progress**: Track phase and task completion in a visual timeline

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4 with OKLCH colors
- **UI Components**: shadcn/ui with Radix UI
- **Markdown**: react-markdown with @tailwindcss/typography

## Getting Started

### Prerequisites

- Node.js 18+
- npm, yarn, pnpm, or bun

### Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

## Project Structure

```
frontend/
├── app/
│   ├── page.tsx                          # Homepage with project creation
│   ├── projects/[id]/
│   │   ├── chat/page.tsx                 # PM Agent discovery chat
│   │   └── roadmap/page.tsx              # Roadmap visualization
│   └── api/
│       └── projects/
│           ├── route.ts                  # Project CRUD
│           └── [id]/
│               ├── route.ts              # Get project by ID
│               ├── chat/route.ts         # Chat messages
│               └── roadmap/route.ts      # Generate roadmap
├── components/
│   ├── ui/                               # shadcn/ui components
│   ├── chat/
│   │   └── pm-message-card.tsx          # PM message with options/actions
│   └── roadmap/
│       └── phase-card.tsx               # Phase timeline visualization
├── lib/
│   ├── types/
│   │   └── project.ts                   # TypeScript types
│   └── data/
│       └── sample-projects.ts           # In-memory data store
└── LLM_INTEGRATION.md                   # Guide for LLM integration
```

## User Flow

1. **Create Project**: User describes their idea in a simple text input
2. **Discovery Chat**: PM Agent asks contextual questions about:
   - Target audience
   - Problems to solve
   - Unique value proposition
3. **Generate Roadmap**: PM creates comprehensive execution plan
4. **View Progress**: Visual timeline shows phases, tasks, and agent assignments

## Current State

The app currently uses:
- **Hardcoded questions** for PM discovery flow (3 questions + action)
- **Sample roadmap generation** based on project description
- **In-memory storage** using globalThis for development

### Ready for LLM Integration

See `LLM_INTEGRATION.md` for complete guide on integrating an LLM to:
- Generate contextual recommendations based on competitor research
- Ask dynamic follow-up questions
- Determine when enough context has been gathered
- Create detailed, personalized roadmaps

## Key Design Decisions

- **No Time Constraints**: AI agents handle everything, so no duration/timeline fields
- **Frontend-First**: UI drives backend requirements
- **Structured Messages**: JSON-based format for PM responses (recommendations, options, actions)
- **Multi-Select Support**: Some questions allow selecting multiple options
- **Flexible Input**: Users can select suggestions OR type custom responses

## Development

```bash
# Run dev server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Type checking
npm run type-check
```

## Future Enhancements

- [ ] LLM integration for intelligent PM conversations
- [ ] Real-time competitor research
- [ ] Actual AI agent execution with status updates
- [ ] Database persistence (PostgreSQL, Supabase, etc.)
- [ ] Authentication and user accounts
- [ ] Streaming LLM responses for better UX
- [ ] Agent collaboration and handoffs
- [ ] Deliverable previews and downloads

## Documentation

- `LLM_INTEGRATION.md` - Guide for integrating LLM into PM flow
- `SITEMAP.md` - Complete sitemap and data models

## License

MIT
