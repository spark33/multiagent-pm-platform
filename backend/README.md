# Multi-Agent Platform Backend

Express + TypeScript backend API with SQLite database for the multi-agent PM orchestration platform.

## Features

- **RESTful API** - Projects, agents, chat, and roadmap endpoints
- **SQLite Database** - Lightweight, file-based database with better-sqlite3
- **TypeScript** - Full type safety shared with frontend
- **Express.js** - Fast, unopinionated web framework
- **Sample Data** - Pre-seeded agents and example project

## Quick Start

### Installation

```bash
cd backend
npm install
```

### Database Setup

Create tables and seed sample data:

```bash
npm run db:migrate
npm run db:seed
```

### Development

Start the development server with hot reload:

```bash
npm run dev
```

The server will start at `http://localhost:3001`

### Production

Build and run:

```bash
npm run build
npm start
```

## API Endpoints

### Projects

- `GET /api/projects` - List all projects
- `POST /api/projects` - Create a new project
  ```json
  { "description": "Your project description" }
  ```
- `GET /api/projects/:id` - Get project by ID
- `GET /api/projects/:id/chat` - Get chat history
- `POST /api/projects/:id/chat` - Send a chat message
  ```json
  { "content": "Your message" }
  ```
- `POST /api/projects/:id/roadmap` - Generate roadmap for project

### Agents

- `GET /api/agents` - List all agents
- `POST /api/agents` - Create a new agent
- `GET /api/agents/:id` - Get agent by ID
- `PUT /api/agents/:id` - Update an agent
- `DELETE /api/agents/:id` - Delete an agent

### Health Check

- `GET /health` - Server health status

## Project Structure

```
backend/
├── src/
│   ├── db/
│   │   ├── database.ts      # Database connection
│   │   ├── schema.ts        # Table definitions
│   │   ├── migrate.ts       # Migration script
│   │   └── seed.ts          # Sample data seeding
│   ├── models/
│   │   ├── project.ts       # Project data access
│   │   ├── chat.ts          # Chat message access
│   │   └── agent.ts         # Agent data access
│   ├── routes/
│   │   ├── projects.ts      # Project API routes
│   │   └── agents.ts        # Agent API routes
│   ├── services/
│   │   ├── roadmap-generator.ts  # Roadmap generation logic
│   │   └── chat-service.ts       # PM chat logic
│   ├── types/
│   │   └── index.ts         # Shared TypeScript types
│   └── server.ts            # Express app entry point
├── data/
│   └── multiagent.db        # SQLite database (generated)
├── package.json
├── tsconfig.json
└── README.md
```

## Database Schema

### Tables

- **projects** - Main project data with status and context
- **chat_messages** - Conversation history per project
- **roadmaps** - Generated roadmaps linked to projects
- **phases** - Roadmap phases (research, strategy, design, etc.)
- **tasks** - Tasks within each phase with agent assignments
- **agents** - System agents with capabilities and configuration

### Relationships

```
projects (1) -> (1) roadmap
roadmap (1) -> (many) phases
phase (1) -> (many) tasks

projects (1) -> (many) chat_messages
```

## Technology Stack

- **Runtime**: Node.js
- **Language**: TypeScript
- **Framework**: Express.js
- **Database**: SQLite with better-sqlite3
- **Dev Tools**: tsx (TypeScript execution)

## Environment Variables

Create a `.env` file (optional):

```bash
PORT=3001
NODE_ENV=development
```

## Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Compile TypeScript to JavaScript
- `npm start` - Run production build
- `npm run db:migrate` - Create database tables
- `npm run db:seed` - Seed sample data

## Integration with Frontend

The backend is designed to work seamlessly with the Next.js frontend. Update the frontend API calls to point to `http://localhost:3001`:

```typescript
// In frontend code
const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

// Example API call
const response = await fetch(`${API_BASE}/api/projects`)
```

## Future Enhancements

### LLM Integration

The backend has placeholders for LLM integration:

- **Chat Service** (`src/services/chat-service.ts`) - Replace `generatePMResponse()` with OpenAI/Anthropic API calls
- **Roadmap Generator** (`src/services/roadmap-generator.ts`) - Replace hardcoded logic with LLM-based generation

### WebSockets

For real-time agent execution updates, consider adding Socket.io:

```bash
npm install socket.io
```

### Authentication

Add JWT-based authentication for multi-user support:

```bash
npm install jsonwebtoken bcrypt
```

## Troubleshooting

### Database Locked Error

If you see "database is locked", ensure only one process is accessing the database:

```bash
# Kill any running processes
pkill -f tsx

# Restart the server
npm run dev
```

### Port Already in Use

Change the port in `.env` or use:

```bash
PORT=3002 npm run dev
```

## Testing

Example manual tests with curl:

```bash
# Health check
curl http://localhost:3001/health

# List projects
curl http://localhost:3001/api/projects

# Create project
curl -X POST http://localhost:3001/api/projects \
  -H "Content-Type: application/json" \
  -d '{"description": "A social network for pet owners"}'

# Send chat message
curl -X POST http://localhost:3001/api/projects/{id}/chat \
  -H "Content-Type: application/json" \
  -d '{"content": "Consumer Mobile App"}'
```

## License

MIT
