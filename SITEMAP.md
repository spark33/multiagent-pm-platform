# Multi-Agent Orchestration Platform - Sitemap

## Product Vision

An AI-powered project manager (PM Agent) that guides users from initial idea to execution. The PM Agent conducts a conversational discovery process, develops a comprehensive roadmap covering market research, design, architecture, and development, then orchestrates specialized agents to execute the plan.

## Application Structure

### Core User Journey

```
1. User describes project idea (simple text input)
   ↓
2. PM Agent engages in discovery conversation
   - Asks clarifying questions
   - Helps refine value proposition
   - Explores market fit
   - Discusses technical requirements
   ↓
3. PM Agent generates comprehensive roadmap
   - Market research tasks
   - Value proposition development
   - Design requirements
   - Technical architecture
   - Development plan
   - Go-to-market strategy
   ↓
4. User reviews and approves roadmap
   ↓
5. PM Agent orchestrates specialized agents to execute tasks
   - Delegates to Research Agent, Designer, Developer, etc.
   - Monitors progress
   - Coordinates handoffs
   ↓
6. User tracks progress and reviews deliverables
```

### Page Structure

```
/
├─ / (Entry Point)
│  └─ Simple, focused interface with text input
│     - "What project would you like to build?"
│     - Recent projects list
│     - Quick start examples
│
├─ /projects/[id]/chat
│  └─ PM-led discovery conversation
│     - Chat interface with PM Agent
│     - Contextual questions and suggestions
│     - Project details captured in sidebar
│     - "Generate Roadmap" action when ready
│
├─ /projects/[id]/roadmap
│  └─ Comprehensive project roadmap
│     - Visual timeline/kanban view
│     - Phases: Research → Strategy → Design → Architecture → Development → Launch
│     - Task breakdown for each phase
│     - Approve/edit roadmap
│     - "Start Execution" action
│
├─ /projects/[id]/execution
│  └─ Live execution dashboard
│     - Current phase and active tasks
│     - Agent activity feed
│     - Task completion status
│     - Deliverables and artifacts
│     - Real-time updates
│
├─ /projects/[id]/deliverables
│  └─ Project outputs and artifacts
│     - Market research reports
│     - Value proposition canvas
│     - Design mockups
│     - Architecture diagrams
│     - Code repositories
│     - Documentation
│
└─ /projects
   └─ Project list/dashboard
      - All projects with status
      - Quick access to active projects
      - Archive completed projects

### System/Admin Pages

├─ /agents (System Configuration - Hidden from main flow)
│  └─ Manage available agent templates
│     - Pre-configured specialist agents
│     - PM Agent configuration
│     - Tool assignments
│
├─ /settings
│  ├─ /settings/llm-providers
│  └─ /settings/preferences
│
└─ /design-system (Dev only)
```

## Component Architecture

### Reusable Components

```
components/
├─ chat/
│  ├─ chat-interface.tsx          # Main chat UI with message history
│  ├─ message-bubble.tsx          # Individual message display
│  ├─ pm-suggestions.tsx          # Contextual suggestions from PM
│  └─ project-context-sidebar.tsx # Captured project details
│
├─ roadmap/
│  ├─ roadmap-timeline.tsx        # Visual timeline/gantt view
│  ├─ roadmap-kanban.tsx          # Kanban board view
│  ├─ phase-card.tsx              # Individual phase breakdown
│  ├─ task-card.tsx               # Task detail card
│  └─ roadmap-editor.tsx          # Edit/approve roadmap
│
├─ execution/
│  ├─ execution-dashboard.tsx     # Live execution overview
│  ├─ agent-activity-feed.tsx    # Real-time agent updates
│  ├─ task-progress.tsx          # Progress indicators
│  └─ deliverable-viewer.tsx     # View outputs/artifacts
│
├─ projects/
│  ├─ project-card.tsx           # Project summary card
│  ├─ project-input.tsx          # Initial project description input
│  └─ quick-start-examples.tsx   # Example project templates
│
├─ agents/
│  └─ (system config - not user-facing)
│
└─ ui/
   └─ (shadcn components)         # Base UI components
```

## User Flow: Frontend-Led Development

### Phase 1: Foundation (Completed)
- ✓ Design system setup with shadcn/ui
- ✓ Base API structure
- ✓ Agent CRUD endpoints (for system config)

### Phase 2: Core User Experience (Current Focus)
1. **Entry Point & Project Creation**
   - Simple homepage with project description input
   - Quick start examples/templates
   - Create new project

   **Backend needs:**
   - POST /api/projects (create project)
   - Project data model

2. **PM Chat Interface**
   - Conversational UI for discovery
   - PM asks clarifying questions
   - Captures project context
   - Natural language interaction

   **Backend needs:**
   - POST /api/projects/:id/chat (send message)
   - GET /api/projects/:id/chat (message history)
   - LLM integration for PM Agent
   - Streaming responses

3. **Roadmap Generation & Review**
   - PM generates comprehensive roadmap
   - Visual timeline/kanban display
   - Edit and approve functionality

   **Backend needs:**
   - POST /api/projects/:id/generate-roadmap
   - GET /api/projects/:id/roadmap
   - PUT /api/projects/:id/roadmap (edits)
   - Roadmap data structure

### Phase 3: Execution & Orchestration
1. **Live Execution Dashboard**
   - Real-time agent activity
   - Task progress tracking
   - Deliverable preview

   **Backend needs:**
   - POST /api/projects/:id/execute
   - WebSocket for real-time updates
   - Agent orchestration engine
   - Task execution pipeline

2. **Deliverables & Artifacts**
   - View research reports
   - Browse design assets
   - Access code/documentation

   **Backend needs:**
   - GET /api/projects/:id/deliverables
   - File storage integration
   - Artifact management

### Phase 4: Project Management
1. Projects dashboard
2. Project archive
3. Settings and configuration
```

## Navigation Structure

```
Primary Navigation (Header):
├─ Home (create new project)
├─ Projects (all projects)
└─ Settings

Project-Level Navigation (within /projects/[id]):
├─ Chat (discovery conversation)
├─ Roadmap (generated plan)
├─ Execution (live dashboard)
└─ Deliverables (outputs)

Hidden/Admin Navigation:
└─ Agents (system configuration)
```

## Data Models

### Project
```typescript
{
  id: string
  title: string
  description: string
  status: "discovery" | "roadmap" | "execution" | "completed"
  createdAt: string
  updatedAt: string
  context: ProjectContext
  roadmap?: Roadmap
}
```

### ProjectContext (Captured during chat)
```typescript
{
  targetAudience?: string
  problemStatement?: string
  valueProposition?: string
  technicalRequirements?: string[]
  constraints?: string[]
  goals?: string[]
}
```

### Roadmap
```typescript
{
  phases: Phase[]
  estimatedDuration: string
  approvedAt?: string
}
```

### Phase
```typescript
{
  id: string
  name: "research" | "strategy" | "design" | "architecture" | "development" | "launch"
  tasks: Task[]
  dependencies?: string[]
  assignedAgent?: string
}
```

## Current Status

- ✓ Design system established (shadcn/ui with professional light theme)
- ✓ Core UI components installed
- ✓ Agent CRUD API (system config)
- → Redesigning for PM-led conversational workflow
- → Building project entry point
