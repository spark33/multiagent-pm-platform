# System Architecture

This document describes the technical architecture of the Multi-Agent Development Platform.

## Overview

The platform uses a **multi-agent orchestration system** where specialized AI agents collaborate through a phase-based workflow. Each phase produces reviewable artifacts, giving users transparency and control over the development process.

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        User Interface                        │
│                    (Next.js + TypeScript)                    │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    Orchestration Layer                       │
│        (Workflow Engine + Agent Coordination)                │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                       Agent Layer                            │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │PM Agent  │  │Designer  │  │Developer │  │QA Agent  │   │
│  │          │  │Agent     │  │Agent     │  │          │   │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘   │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                      Data Layer                              │
│        (Artifact Storage + Context Management)               │
└─────────────────────────────────────────────────────────────┘
```

## Core Components

### 1. User Interface Layer

**Technology**: Next.js 15, TypeScript, Tailwind CSS

**Responsibilities**:
- Project creation and configuration
- Phase-based workflow navigation
- Artifact review and approval interface
- Real-time agent activity visualization
- Feedback and iteration controls

**Key Features**:
- Dashboard showing project status and progress
- Phase-specific views (Discovery, Design, Development, Testing)
- Artifact viewers (markdown, wireframes, code, test results)
- Approval/rejection workflow with feedback forms
- Chat interface for agent interaction

### 2. Orchestration Layer

**Technology**: TBD (FastAPI or Node.js + LangGraph/LangChain)

**Responsibilities**:
- Workflow state management
- Agent coordination and communication
- Phase transitions and checkpoints
- Context propagation between phases
- Error handling and recovery

**Key Components**:

#### Workflow Engine
- Manages phase progression (Discovery → Design → Development → Testing)
- Enforces approval gates between phases
- Tracks artifact completion status
- Handles rollback and iteration requests

#### Agent Coordinator
- Routes tasks to appropriate agents
- Manages agent communication protocols
- Aggregates agent outputs
- Resolves conflicts between agent recommendations

#### Context Manager
- Maintains project context across phases
- Stores user preferences and decisions
- Tracks approval history
- Manages artifact versioning

### 3. Agent Layer

**Technology**: LLM-based agents (Claude API, custom prompts)

Each agent is a specialized LLM instance with:
- **Domain-specific prompts**: Optimized for their role
- **Artifact templates**: Structured output formats
- **Quality criteria**: Standards for their deliverables
- **Context awareness**: Access to relevant project information

**Agent Types**:

#### PM Agent
- **Input**: User requirements, business goals
- **Output**: PRD, user stories, acceptance criteria
- **Expertise**: Product strategy, requirement analysis

#### Designer Agent
- **Input**: PRD, user stories
- **Output**: Wireframes, design system, component specs
- **Expertise**: UI/UX, design patterns, accessibility

#### Developer Agent
- **Input**: Design specs, technical requirements
- **Output**: Implementation code, documentation
- **Expertise**: Code architecture, best practices, frameworks

#### QA Agent
- **Input**: Code, requirements, design specs
- **Output**: Test plans, test code, quality reports
- **Expertise**: Testing strategies, quality assurance

### 4. Data Layer

**Technology**: TBD (PostgreSQL + S3/Object Storage)

**Responsibilities**:
- Artifact persistence (documents, code, designs)
- Version control for artifacts
- Project metadata storage
- User feedback and approval tracking

**Schema Design** (Conceptual):

```typescript
// Projects
interface Project {
  id: string;
  name: string;
  description: string;
  currentPhase: Phase;
  createdAt: Date;
  updatedAt: Date;
}

// Phases
enum Phase {
  DISCOVERY = 'discovery',
  DESIGN = 'design',
  DEVELOPMENT = 'development',
  TESTING = 'testing',
  COMPLETE = 'complete'
}

// Artifacts
interface Artifact {
  id: string;
  projectId: string;
  phase: Phase;
  agentType: AgentType;
  type: ArtifactType; // PRD, wireframe, code, test
  content: any; // JSON/text/binary
  status: ArtifactStatus;
  version: number;
  createdAt: Date;
}

enum ArtifactStatus {
  DRAFT = 'draft',
  PENDING_REVIEW = 'pending_review',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  REVISED = 'revised'
}

// Feedback
interface Feedback {
  id: string;
  artifactId: string;
  userId: string;
  action: 'approve' | 'reject' | 'request_changes';
  comments: string;
  createdAt: Date;
}
```

## Workflow State Machine

```
[Project Created]
       │
       ▼
[Discovery Phase]
       │
       ├─→ PM Agent generates PRD
       ├─→ User reviews PRD
       │
       ├─→ Approved? ──No──→ PM Agent revises
       │        │
       │       Yes
       ▼
[Design Phase]
       │
       ├─→ Designer Agent creates wireframes
       ├─→ Designer Agent defines design system
       ├─→ User reviews design artifacts
       │
       ├─→ Approved? ──No──→ Designer Agent revises
       │        │
       │       Yes
       ▼
[Development Phase]
       │
       ├─→ Developer Agent implements features
       ├─→ User reviews code and functionality
       │
       ├─→ Approved? ──No──→ Developer Agent revises
       │        │
       │       Yes
       ▼
[Testing Phase]
       │
       ├─→ QA Agent creates test plan
       ├─→ QA Agent generates tests
       ├─→ Tests run automatically
       ├─→ User reviews quality report
       │
       ├─→ Approved? ──No──→ QA Agent/Dev Agent address issues
       │        │
       │       Yes
       ▼
[Project Complete]
```

## Communication Patterns

### User → Agent Communication
- User provides high-level requirements or feedback
- System translates to agent-specific instructions
- Agent processes and generates artifacts
- User reviews artifacts and provides feedback

### Agent → Agent Communication
- Agents share context through structured handoffs
- Downstream agents consume upstream artifacts
- Bi-directional feedback (e.g., Developer → Designer for clarifications)
- Coordinated through the Orchestration Layer

### Real-Time Updates
- WebSocket connections for live agent activity
- Server-Sent Events for artifact updates
- Optimistic UI updates with rollback on errors

## Scalability Considerations

### Phase 1 (MVP)
- Single-user, single-project focus
- Synchronous agent execution
- In-memory state management
- File-based artifact storage

### Phase 2 (Multi-User)
- User authentication and authorization
- Multiple concurrent projects
- Database-backed persistence
- Cloud storage for artifacts

### Phase 3 (Scale)
- Asynchronous agent execution with job queues
- Horizontal scaling of orchestration layer
- Caching layer for frequently accessed artifacts
- CDN for static assets

## Security Considerations

- **Authentication**: User identity verification
- **Authorization**: Project-level access control
- **Data Privacy**: Encryption at rest and in transit
- **API Security**: Rate limiting, input validation
- **Code Execution**: Sandboxed environments for generated code
- **Audit Logging**: Track all user actions and agent operations

## Technology Decisions (To Be Finalized)

### Backend Framework
**Options**:
- FastAPI (Python) - Better LangChain integration, AI ecosystem
- Node.js/Express - Unified TypeScript stack, faster prototyping

### Database
**Options**:
- PostgreSQL - Robust, JSONB support for artifacts
- MongoDB - Flexible schema for evolving artifact types

### Agent Framework
**Options**:
- LangGraph - Native multi-agent support, state management
- Custom orchestration - Full control, simpler stack

### Hosting
**Options**:
- Vercel (Frontend) + Railway/Render (Backend)
- AWS (Full stack)
- Self-hosted

## Next Steps

1. Implement basic orchestration layer with single-phase workflow
2. Build PM Agent with PRD generation capability
3. Create frontend phase navigation and artifact review UI
4. Add approval/rejection workflow
5. Implement Designer Agent and Design phase
6. Continue with Developer and QA agents
7. Add iteration and feedback loops
8. Implement full multi-phase workflow

## References

- [AGENTS.md](./AGENTS.md) - Detailed agent specifications
- [WORKFLOW.md](./WORKFLOW.md) - Phase-by-phase workflow details
- [CONTRIBUTING.md](./CONTRIBUTING.md) - Development guidelines
