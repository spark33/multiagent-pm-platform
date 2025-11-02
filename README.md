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
│   ├── docs/             # Frontend-specific docs
│   │   └── SITEMAP.md   # Sitemap and data models
│   ├── LLM_INTEGRATION.md # LLM integration guide
│   └── README.md         # Frontend setup guide
├── backend/              # (Coming soon) Backend services
├── docs/                 # System-wide documentation
│   ├── ARCHITECTURE.md   # System architecture
│   ├── AGENTS.md         # Agent specifications
│   ├── WORKFLOW.md       # Development workflow
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

### Backend
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: SQLite with better-sqlite3
- **API**: RESTful endpoints for projects, agents, chat, and roadmaps
- **Ready for LLM**: Placeholder functions for OpenAI/Anthropic integration

## Documentation

### System-Wide
- [**ARCHITECTURE**](./docs/ARCHITECTURE.md) - System architecture and technical design
- [**AGENTS**](./docs/AGENTS.md) - Agent roles, responsibilities, and capabilities
- [**WORKFLOW**](./docs/WORKFLOW.md) - Phase-based development workflow
- [**CONTRIBUTING**](./docs/CONTRIBUTING.md) - Development guidelines and standards

### Frontend
- [**Frontend README**](./frontend/README.md) - Frontend setup and architecture
- [**Sitemap**](./frontend/docs/SITEMAP.md) - Complete sitemap and data models
- [**LLM Integration Guide**](./frontend/LLM_INTEGRATION.md) - How to integrate LLMs into the PM flow

### Backend
- [**Backend README**](./backend/README.md) - Backend setup and API documentation

## Current State

**Frontend** is fully functional with:
- ✅ PM-led discovery chat flow
- ✅ Smart recommendations based on project description
- ✅ Interactive chat with structured options/actions
- ✅ Comprehensive roadmap generation
- ✅ Visual timeline with phases and tasks
- ✅ AI agent assignments with roles and deliverables

**Backend** is operational with:
- ✅ Express + TypeScript API server
- ✅ SQLite database with full schema
- ✅ Projects, agents, chat, and roadmap endpoints
- ✅ Sample data seeding
- ✅ Ready for LLM integration

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
- [x] Express.js backend service with TypeScript
- [x] SQLite database for persistence
- [ ] LLM integration for intelligent PM conversations
- [ ] Real-time competitor research
- [ ] Actual AI agent execution with status updates
- [ ] WebSockets for real-time updates

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
# Backend
cd backend
npm install
npm run db:migrate  # Create database tables
npm run db:seed     # Seed sample data
npm run dev         # Start on http://localhost:3001

# Frontend
cd frontend
npm install
npm run dev         # Start on http://localhost:3000
```

## Status

🚧 **In Active Development** 🚧

- ✅ Frontend MVP complete
- ✅ Backend API complete
- 🔄 LLM integration in progress
- 📋 Agent execution orchestration planned

## License

MIT

## Contact

For questions, issues, or contributions, please open an issue on GitHub.
