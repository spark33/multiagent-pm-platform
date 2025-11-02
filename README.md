# Multi-Agent PM Platform

A PM-led conversational platform for building products with AI agents. Users describe their project idea, the PM Agent conducts discovery through chat, then generates a comprehensive roadmap that AI agents execute.

## Overview

This monorepo contains the frontend application and (future) backend services for the multi-agent orchestration platform. The PM Agent guides users through discovery, generates detailed roadmaps, and coordinates specialized AI agents to execute all tasks.

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
- **No Time Constraints**: AI agents handle everything without duration/timeline limitations

## Repository Structure

```
multiagent-v0/
├── frontend/              # Next.js application
│   ├── app/              # Next.js app router
│   ├── components/       # React components
│   ├── lib/              # Utilities and data
│   └── README.md         # Frontend-specific docs
├── backend/              # (Coming soon) Backend services
├── docs/                 # Documentation
│   ├── ARCHITECTURE.md   # System architecture
│   ├── AGENTS.md         # Agent specifications
│   ├── WORKFLOW.md       # Development workflow
│   ├── SITEMAP.md        # Sitemap and data models
│   └── CONTRIBUTING.md   # Contribution guidelines
└── README.md            # This file
```

## Quick Start

### Frontend Development

```bash
cd frontend
npm install
npm run dev
```

Visit http://localhost:3000 to see the application.

## Technology Stack

### Frontend
- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4 with OKLCH colors
- **UI Components**: shadcn/ui with Radix UI
- **Markdown**: react-markdown with @tailwindcss/typography

### Backend (Coming Soon)
- Python FastAPI or Node.js
- PostgreSQL for persistence
- LLM integration (OpenAI/Anthropic)
- Vector database for semantic search

## Documentation

- [**Frontend README**](./frontend/README.md) - Frontend setup and architecture
- [**LLM Integration Guide**](./frontend/LLM_INTEGRATION.md) - How to integrate LLMs into the PM flow
- [**ARCHITECTURE**](./docs/ARCHITECTURE.md) - System architecture and technical design
- [**AGENTS**](./docs/AGENTS.md) - Agent roles, responsibilities, and capabilities
- [**WORKFLOW**](./docs/WORKFLOW.md) - Phase-based development workflow
- [**SITEMAP**](./docs/SITEMAP.md) - Complete sitemap and data models
- [**CONTRIBUTING**](./docs/CONTRIBUTING.md) - Development guidelines and standards

## Current State

The frontend is fully functional with:
- ✅ PM-led discovery chat flow
- ✅ Smart recommendations based on project description
- ✅ Interactive chat with structured options/actions
- ✅ Comprehensive roadmap generation
- ✅ Visual timeline with phases and tasks
- ✅ AI agent assignments with roles and deliverables
- ✅ In-memory storage (ready for backend integration)

**Ready for LLM Integration** - See `frontend/LLM_INTEGRATION.md` for complete integration guide.

## User Flow

1. **Create Project**: User describes their idea in a simple text input
2. **Discovery Chat**: PM Agent asks contextual questions about:
   - Target audience
   - Problems to solve
   - Unique value proposition
3. **Generate Roadmap**: PM creates comprehensive execution plan with phases and tasks
4. **View Progress**: Visual timeline shows phases, tasks, and agent assignments

## Key Design Decisions

- **No Time Constraints**: AI agents handle everything, so no duration/timeline fields needed
- **Frontend-First Development**: UI drives backend requirements
- **Structured Messages**: JSON-based format for PM responses (recommendations, options, actions)
- **Multi-Select Support**: Some questions allow selecting multiple options
- **Flexible Input**: Users can select suggestions OR type custom responses

## Future Enhancements

### Backend
- [ ] FastAPI/Node.js backend service
- [ ] PostgreSQL database for persistence
- [ ] LLM integration for intelligent PM conversations
- [ ] Real-time competitor research
- [ ] Actual AI agent execution with status updates

### Frontend
- [ ] Authentication and user accounts
- [ ] Streaming LLM responses for better UX
- [ ] Agent collaboration and handoffs
- [ ] Deliverable previews and downloads
- [ ] Real-time task updates via WebSockets

## Development

### Contributing

See [CONTRIBUTING.md](./docs/CONTRIBUTING.md) for development guidelines and standards.

### Running the Stack

```bash
# Frontend (currently available)
cd frontend
npm install
npm run dev

# Backend (coming soon)
cd backend
# Setup instructions TBD
```

## Status

🚧 **In Active Development** 🚧

- ✅ Frontend MVP complete
- 🔄 LLM integration in progress
- 📋 Backend services planned

## License

MIT

## Contact

For questions, issues, or contributions, please open an issue on GitHub.
