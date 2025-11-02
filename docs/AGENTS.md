# Agent Specifications

This document defines the roles, responsibilities, capabilities, and interfaces for each AI agent in the platform.

## Agent Design Principles

All agents follow these core principles:

1. **Specialization**: Each agent is an expert in their domain
2. **Artifact-Driven**: Agents produce concrete, reviewable outputs
3. **Context-Aware**: Agents consume outputs from previous phases
4. **Iterative**: Agents can revise based on user feedback
5. **Transparent**: Agent reasoning and decisions are visible to users

## Agent Architecture

Each agent consists of:

```typescript
interface Agent {
  // Identity
  id: string;
  type: AgentType;
  name: string;

  // Capabilities
  phase: Phase;
  inputTypes: ArtifactType[];
  outputTypes: ArtifactType[];

  // Behavior
  systemPrompt: string;
  qualityCriteria: QualityCriteria;
  exampleOutputs: Example[];

  // Methods
  process(input: Input): Promise<Output>;
  revise(artifact: Artifact, feedback: Feedback): Promise<Artifact>;
  validate(artifact: Artifact): ValidationResult;
}
```

---

## 1. PM Agent (Product Manager)

### Overview
The PM Agent translates user ideas into structured product requirements. It acts as the strategic foundation for the entire project.

### Phase
**Discovery**

### Inputs
- User's initial product description
- Business goals and constraints
- Target audience information
- Feature priorities (if provided)

### Outputs

#### Primary: Product Requirements Document (PRD)
```markdown
# Product Requirements Document

## Product Vision
[High-level description of what we're building and why]

## Problem Statement
[The problem this product solves]

## Target Users
[Who will use this product]

## Core Features
1. [Feature 1]
   - Description
   - User value
   - Success criteria
2. [Feature 2]
   ...

## User Stories
As a [user type], I want to [action] so that [benefit]

## Acceptance Criteria
Given [context]
When [action]
Then [expected outcome]

## Technical Constraints
[Any technical limitations or requirements]

## Success Metrics
[How we'll measure success]

## Out of Scope
[What we're explicitly NOT building in this version]
```

#### Secondary: Feature Prioritization Matrix
```markdown
| Feature | Impact | Effort | Priority |
|---------|--------|--------|----------|
| Feature 1 | High | Medium | P0 |
| Feature 2 | Medium | Low | P1 |
```

### Capabilities

#### Strategic Thinking
- Identifies core value proposition
- Prioritizes features by impact vs. effort
- Defines clear success metrics
- Scopes appropriately for MVP vs. future versions

#### User-Centric Analysis
- Translates user needs into product requirements
- Creates realistic user personas
- Maps user journeys
- Identifies edge cases and scenarios

#### Requirement Specification
- Writes clear, unambiguous requirements
- Creates testable acceptance criteria
- Documents technical constraints
- Defines non-functional requirements (performance, security, etc.)

### Quality Criteria

A good PRD must:
- ✅ Clearly articulate the problem being solved
- ✅ Define measurable success criteria
- ✅ Include complete user stories with acceptance criteria
- ✅ Prioritize features realistically
- ✅ Be specific enough for design/development
- ✅ Explicitly state what's out of scope

### Revision Triggers
- User requests different feature priorities
- Scope is too large/small for stated goals
- Requirements are ambiguous or conflicting
- Missing critical user scenarios
- Technical constraints not addressed

### System Prompt (Conceptual)
```
You are a senior product manager specializing in helping solo founders
build their product visions. Your role is to transform raw ideas into
clear, actionable product requirements.

Key responsibilities:
1. Ask clarifying questions to understand the user's vision
2. Identify the core problem and target users
3. Define features with clear user value
4. Write specific, testable acceptance criteria
5. Scope appropriately for an MVP

Output format: Structured PRD in markdown
Quality bar: Every requirement must be clear enough for a designer
to create mockups and a developer to estimate effort.

Avoid: Feature creep, vague requirements, missing acceptance criteria
```

---

## 2. Designer Agent

### Overview
The Designer Agent transforms product requirements into visual designs and UI specifications.

### Phase
**Design**

### Inputs
- Product Requirements Document (PRD)
- User stories and acceptance criteria
- Brand guidelines (if provided)
- Design preferences (if provided)

### Outputs

#### Primary: Wireframes
```markdown
# Wireframes

## Page: Home
[ASCII/Markdown wireframe or link to visual wireframe]

Components:
- Navigation Bar
- Hero Section
- Feature Cards
- CTA Button

## Page: Dashboard
...
```

#### Secondary: Design System
```markdown
# Design System

## Colors
- Primary: #3B82F6
- Secondary: #10B981
- Background: #F9FAFB
- Text: #111827

## Typography
- Headings: Inter, 600
- Body: Inter, 400
- Code: JetBrains Mono

## Components
### Button
- Primary: bg-primary, text-white, px-4 py-2, rounded-md
- Secondary: bg-secondary, text-white, px-4 py-2, rounded-md

### Card
- bg-white, shadow-md, rounded-lg, p-6

## Spacing
- Scale: 4px base (4, 8, 12, 16, 24, 32, 48, 64)

## Breakpoints
- Mobile: < 640px
- Tablet: 640px - 1024px
- Desktop: > 1024px
```

#### Tertiary: Component Specifications
```markdown
# Component Specs

## ProjectCard
Purpose: Display project summary in dashboard

Properties:
- title: string
- status: 'discovery' | 'design' | 'development' | 'testing'
- lastUpdated: Date
- onClick: () => void

Layout:
- Card container (bg-white, shadow, rounded)
- Title (text-xl, font-semibold)
- Status badge (colored based on phase)
- Last updated text (text-sm, text-gray-500)
```

### Capabilities

#### UI/UX Design
- Creates intuitive information architectures
- Designs user flows that match user stories
- Applies UI best practices and patterns
- Ensures accessibility (WCAG compliance)

#### Visual Design
- Establishes cohesive design systems
- Selects appropriate color palettes
- Defines typography scales
- Creates responsive layouts

#### Component Design
- Breaks designs into reusable components
- Defines component states (hover, active, disabled)
- Specifies component props and behavior
- Documents component usage

### Quality Criteria

Good design artifacts must:
- ✅ Cover all user stories from the PRD
- ✅ Follow established UI/UX patterns
- ✅ Be responsive across device sizes
- ✅ Meet accessibility standards
- ✅ Use a consistent design system
- ✅ Be detailed enough for development

### Revision Triggers
- Design doesn't match user expectations
- Missing pages or user flows
- Accessibility concerns
- Inconsistent design system
- Layout issues on specific devices

### System Prompt (Conceptual)
```
You are a senior product designer specializing in web applications.
Your role is to translate product requirements into beautiful,
functional designs.

Key responsibilities:
1. Create wireframes for all pages in the user stories
2. Design a cohesive design system (colors, typography, components)
3. Specify component behavior and states
4. Ensure responsive design across devices
5. Follow accessibility best practices

Output format: Markdown wireframes + design system + component specs
Quality bar: A developer should be able to implement the design
without making any design decisions.

Avoid: Inconsistent styling, missing states, inaccessible patterns
```

---

## 3. Developer Agent

### Overview
The Developer Agent implements the product based on design specifications and requirements.

### Phase
**Development**

### Inputs
- Product Requirements Document (PRD)
- Wireframes and design system
- Component specifications
- Technical stack preferences

### Outputs

#### Primary: Implementation Code
```
src/
├── components/
│   ├── ui/              # Reusable UI components
│   ├── features/        # Feature-specific components
│   └── layouts/         # Layout components
├── app/                 # Next.js app directory
│   ├── (routes)/
│   └── api/
├── lib/                 # Utilities and helpers
├── types/               # TypeScript types
└── styles/              # Global styles
```

#### Secondary: Technical Documentation
```markdown
# Implementation Notes

## Architecture Decisions
- [Decision 1]: Why we chose X over Y
- [Decision 2]: Trade-offs considered

## Setup Instructions
1. Install dependencies: `npm install`
2. Set environment variables: `.env.local`
3. Run development server: `npm run dev`

## API Endpoints
### POST /api/projects
Creates a new project
...

## Database Schema
[Schema definitions]

## Deployment
[Deployment instructions]
```

### Capabilities

#### Code Implementation
- Writes clean, maintainable code
- Follows framework best practices (Next.js, React)
- Implements responsive designs pixel-perfect
- Uses TypeScript for type safety

#### Architecture
- Designs scalable folder structures
- Separates concerns (UI, logic, data)
- Implements proper state management
- Creates reusable abstractions

#### Best Practices
- Writes semantic, accessible HTML
- Optimizes performance (lazy loading, code splitting)
- Handles errors gracefully
- Implements proper security measures

#### Documentation
- Comments complex logic
- Writes clear README files
- Documents API contracts
- Provides setup instructions

### Quality Criteria

Good code must:
- ✅ Implement all requirements from PRD
- ✅ Match design specifications exactly
- ✅ Follow TypeScript/framework best practices
- ✅ Be well-organized and maintainable
- ✅ Handle edge cases and errors
- ✅ Include necessary documentation

### Revision Triggers
- Bugs or incorrect behavior
- Performance issues
- Code doesn't match design specs
- Poor code organization
- Missing error handling
- Security vulnerabilities

### System Prompt (Conceptual)
```
You are a senior full-stack developer specializing in modern web
applications. Your role is to implement features based on
requirements and design specifications.

Key responsibilities:
1. Write clean, type-safe TypeScript code
2. Implement designs pixel-perfect using Tailwind CSS
3. Create reusable, composable components
4. Handle edge cases and errors gracefully
5. Document complex logic and setup instructions

Tech stack: Next.js 15, TypeScript, Tailwind CSS, React
Output format: Complete, working code files
Quality bar: Code should be production-ready, not a prototype.

Avoid: Any, poor naming, tight coupling, missing error handling
```

---

## 4. QA Agent (Quality Assurance)

### Overview
The QA Agent ensures the product meets quality standards through comprehensive testing.

### Phase
**Testing**

### Inputs
- Product Requirements Document (PRD)
- Implementation code
- Design specifications
- Acceptance criteria

### Outputs

#### Primary: Test Plan
```markdown
# Test Plan

## Test Strategy
- Unit tests for business logic
- Integration tests for API endpoints
- Component tests for UI
- E2E tests for critical user flows

## Test Cases

### TC-001: User can create a project
**Acceptance Criteria**: [from PRD]
**Test Steps**:
1. Navigate to dashboard
2. Click "New Project"
3. Fill in project details
4. Submit form
**Expected Result**: Project appears in dashboard
**Actual Result**: [Pass/Fail]
```

#### Secondary: Test Code
```typescript
// Unit tests
describe('ProjectService', () => {
  it('should create a project with valid data', async () => {
    // ...
  });
});

// Component tests
describe('ProjectCard', () => {
  it('should render project title', () => {
    // ...
  });
});

// E2E tests
describe('Project Creation Flow', () => {
  it('should allow user to create a project', () => {
    // ...
  });
});
```

#### Tertiary: Quality Report
```markdown
# Quality Report

## Test Results
- Total Tests: 45
- Passed: 43
- Failed: 2
- Coverage: 87%

## Failed Tests
1. TC-023: Project deletion - Database cleanup failing
2. TC-031: Mobile navigation - Menu not closing on route change

## Quality Metrics
- Code Coverage: 87%
- Performance Score: 92/100
- Accessibility Score: 98/100
- SEO Score: 100/100

## Recommendations
1. Fix failing tests before deployment
2. Increase test coverage for utils/
3. Add integration tests for API layer
```

### Capabilities

#### Test Strategy
- Designs comprehensive test plans
- Identifies critical test scenarios
- Balances unit, integration, and E2E tests
- Defines quality metrics and thresholds

#### Test Implementation
- Writes clear, maintainable tests
- Uses appropriate testing frameworks
- Mocks external dependencies
- Tests edge cases and error scenarios

#### Quality Analysis
- Measures code coverage
- Evaluates performance metrics
- Checks accessibility compliance
- Identifies security vulnerabilities

#### Bug Reporting
- Documents bugs clearly
- Provides reproduction steps
- Suggests potential fixes
- Prioritizes by severity

### Quality Criteria

Good testing artifacts must:
- ✅ Cover all acceptance criteria from PRD
- ✅ Include unit, integration, and E2E tests
- ✅ Test both happy paths and edge cases
- ✅ Achieve >80% code coverage
- ✅ Document all test failures clearly
- ✅ Provide actionable recommendations

### Revision Triggers
- Tests don't cover key scenarios
- Test failures not adequately documented
- Low code coverage
- Performance issues identified
- Accessibility violations found

### System Prompt (Conceptual)
```
You are a senior QA engineer specializing in modern web applications.
Your role is to ensure the product meets quality standards through
comprehensive testing.

Key responsibilities:
1. Create detailed test plans covering all acceptance criteria
2. Write automated tests (unit, integration, E2E)
3. Identify bugs and quality issues
4. Measure quality metrics (coverage, performance, accessibility)
5. Provide clear, actionable quality reports

Tech stack: Jest, React Testing Library, Playwright
Output format: Test plan + test code + quality report
Quality bar: All critical user flows must have E2E test coverage.

Avoid: Shallow tests, unclear bug reports, missing edge cases
```

---

## Agent Communication Protocol

### Handoff Structure
```typescript
interface AgentHandoff {
  fromAgent: AgentType;
  toAgent: AgentType;
  phase: Phase;
  artifacts: Artifact[];
  context: {
    projectId: string;
    userFeedback?: Feedback[];
    revisionCount: number;
  };
  message: string; // Human-readable summary
}
```

### Example Handoff: PM → Designer
```json
{
  "fromAgent": "PM",
  "toAgent": "Designer",
  "phase": "design",
  "artifacts": [
    {
      "type": "PRD",
      "content": "...",
      "status": "approved"
    }
  ],
  "context": {
    "projectId": "proj_123",
    "userFeedback": [],
    "revisionCount": 0
  },
  "message": "PRD approved. Please create wireframes for the 5 core pages defined in the user stories."
}
```

---

## Future Agents (Planned)

### DevOps Agent
- **Phase**: Deployment
- **Outputs**: CI/CD pipelines, deployment configs, monitoring setup

### Documentation Agent
- **Phase**: Post-Development
- **Outputs**: User guides, API documentation, README files

### Analytics Agent
- **Phase**: Post-Launch
- **Outputs**: Analytics setup, tracking implementation, dashboards

---

## References

- [ARCHITECTURE.md](./ARCHITECTURE.md) - System architecture
- [WORKFLOW.md](./WORKFLOW.md) - Phase-based workflow
- [CONTRIBUTING.md](./CONTRIBUTING.md) - Development guidelines
