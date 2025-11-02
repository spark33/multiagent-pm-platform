# Phase-Based Workflow

This document describes the detailed workflow for building products using the multi-agent development platform.

## Workflow Overview

The platform uses a **sequential, phase-gated workflow** where each phase must be approved before the next begins. This ensures quality, maintains context, and gives you control over the development process.

```
Discovery → Design → Development → Testing → Complete
    ↓          ↓           ↓            ↓
  [Review]  [Review]   [Review]    [Review]
    ↓          ↓           ↓            ↓
  Approve/   Approve/   Approve/    Approve/
  Revise     Revise     Revise      Revise
```

## Phase Workflow

### Phase 0: Project Initialization

**User Actions**:
1. Create new project
2. Provide initial description
3. (Optional) Set preferences:
   - Tech stack preferences
   - Design style preferences
   - Project constraints

**System Actions**:
1. Create project record
2. Initialize workflow state
3. Prepare context for PM Agent
4. Transition to Discovery phase

**Outputs**:
- Project ID and metadata
- Initial context object

---

## Phase 1: Discovery

**Goal**: Transform user's vision into structured product requirements

**Active Agent**: PM Agent

### 1.1 Initial Analysis

**Agent Actions**:
1. Analyze user's product description
2. Identify potential gaps in requirements
3. Generate clarifying questions

**User Actions**:
1. Review agent's questions
2. Provide answers and additional context
3. Clarify priorities and constraints

**Example Questions**:
- "Who is your primary target user?"
- "What's the most important problem this solves?"
- "Are there any features that are must-haves for v1?"
- "Do you have any technical constraints (hosting, budget, etc.)?"

### 1.2 PRD Generation

**Agent Actions**:
1. Synthesize user input into comprehensive PRD
2. Define user stories with acceptance criteria
3. Prioritize features (P0, P1, P2)
4. Identify technical constraints
5. Define success metrics

**Artifact Generated**: Product Requirements Document (PRD)

### 1.3 Review & Approval

**User Actions**:
1. Review PRD in dedicated UI
2. Evaluate:
   - Does it capture my vision?
   - Are the user stories complete?
   - Are features prioritized correctly?
   - Is anything missing or out of scope?
3. Choose action:
   - **Approve**: Move to Design phase
   - **Request Changes**: Provide specific feedback
   - **Reject**: Major revisions needed

**Example Feedback**:
- "The PRD is missing mobile-specific features"
- "Feature X should be P0, not P1"
- "Add a user story for admin capabilities"

### 1.4 Iteration (if needed)

**Agent Actions**:
1. Receive user feedback
2. Revise PRD based on specific comments
3. Highlight changes made
4. Re-submit for review

**Loop**: Continues until approved

### 1.5 Phase Completion

**System Actions**:
1. Lock approved PRD (versioned)
2. Update project status to "Design" phase
3. Prepare context handoff to Designer Agent
4. Notify user of phase transition

**Outputs**:
- Approved PRD (v1.0)
- Feature prioritization matrix
- Context for next phase

---

## Phase 2: Design

**Goal**: Create visual designs and UI specifications based on approved requirements

**Active Agent**: Designer Agent

### 2.1 Design Planning

**Agent Actions**:
1. Review approved PRD
2. Analyze user stories and features
3. Plan information architecture
4. Identify pages and user flows needed

**User Actions**:
1. (Optional) Provide design preferences:
   - Brand colors
   - Design inspiration
   - Accessibility requirements

### 2.2 Wireframe Creation

**Agent Actions**:
1. Create wireframes for all pages
2. Map wireframes to user stories
3. Design user flows between pages
4. Ensure responsive layouts

**Artifacts Generated**:
- Wireframes for each page
- User flow diagrams
- Navigation structure

### 2.3 Design System Definition

**Agent Actions**:
1. Define color palette
2. Set typography scale
3. Create component library
4. Define spacing and layout system
5. Document design tokens

**Artifact Generated**: Design System Specification

### 2.4 Component Specifications

**Agent Actions**:
1. Break designs into components
2. Define component props and states
3. Specify behavior and interactions
4. Document responsive behavior

**Artifact Generated**: Component Specifications

### 2.5 Review & Approval

**User Actions**:
1. Review wireframes, design system, and component specs
2. Evaluate:
   - Do wireframes match the PRD?
   - Is the design system cohesive?
   - Are all user flows covered?
   - Is the design accessible?
3. Choose action:
   - **Approve**: Move to Development phase
   - **Request Changes**: Provide specific feedback
   - **Reject**: Major design revisions needed

**Example Feedback**:
- "The dashboard layout is too cluttered"
- "Can we use a different color palette?"
- "The mobile navigation needs improvement"

### 2.6 Iteration (if needed)

**Agent Actions**:
1. Receive user feedback
2. Revise designs based on comments
3. Update affected artifacts
4. Re-submit for review

**Loop**: Continues until approved

### 2.7 Phase Completion

**System Actions**:
1. Lock approved design artifacts
2. Update project status to "Development" phase
3. Prepare context handoff to Developer Agent
4. Notify user of phase transition

**Outputs**:
- Approved wireframes
- Approved design system
- Component specifications
- Context for next phase

---

## Phase 3: Development

**Goal**: Implement the product based on approved designs and requirements

**Active Agent**: Developer Agent

### 3.1 Setup & Planning

**Agent Actions**:
1. Review approved PRD and design artifacts
2. Plan implementation strategy
3. Design folder structure
4. Identify external dependencies
5. Create development task list

**User Actions**:
1. (Optional) Provide technical preferences:
   - Hosting platform
   - Third-party services
   - Database choice

### 3.2 Implementation

**Agent Actions**:
1. Set up project scaffolding
2. Implement design system (Tailwind config, components)
3. Build pages and layouts
4. Implement business logic
5. Set up API endpoints (if needed)
6. Add error handling
7. Optimize performance

**Progress Updates**:
- Agent provides real-time implementation updates
- User can see which features are being built
- Code is committed incrementally

### 3.3 Documentation

**Agent Actions**:
1. Document setup instructions
2. Document API endpoints
3. Add code comments for complex logic
4. Create deployment guide

**Artifact Generated**: Technical Documentation

### 3.4 Review & Approval

**User Actions**:
1. Review implemented code
2. Test functionality in preview environment
3. Evaluate:
   - Does it match the designs?
   - Do all features work as specified?
   - Is the code well-organized?
   - Are there any bugs?
4. Choose action:
   - **Approve**: Move to Testing phase
   - **Request Changes**: Identify bugs or issues
   - **Reject**: Major implementation problems

**Example Feedback**:
- "The button colors don't match the design system"
- "Feature X is missing error handling"
- "The mobile layout is broken on iOS"

### 3.5 Iteration (if needed)

**Agent Actions**:
1. Receive user feedback
2. Fix bugs and issues
3. Refine implementation
4. Re-submit for review

**Loop**: Continues until approved

### 3.6 Phase Completion

**System Actions**:
1. Lock approved implementation code
2. Update project status to "Testing" phase
3. Prepare context handoff to QA Agent
4. Notify user of phase transition

**Outputs**:
- Approved implementation code
- Technical documentation
- Context for next phase

---

## Phase 4: Testing

**Goal**: Ensure the product meets quality standards and all requirements

**Active Agent**: QA Agent

### 4.1 Test Planning

**Agent Actions**:
1. Review PRD acceptance criteria
2. Review implemented code
3. Create comprehensive test plan
4. Identify test scenarios (happy path, edge cases, errors)
5. Define quality metrics and thresholds

**Artifact Generated**: Test Plan

### 4.2 Test Implementation

**Agent Actions**:
1. Write unit tests for business logic
2. Write component tests for UI
3. Write integration tests for APIs
4. Write E2E tests for critical flows
5. Set up test automation

**Artifact Generated**: Test Suite

### 4.3 Test Execution

**Agent Actions**:
1. Run all tests
2. Measure code coverage
3. Run performance benchmarks
4. Check accessibility compliance
5. Scan for security vulnerabilities

**Real-time Updates**:
- Test progress (X of Y tests passed)
- Coverage metrics
- Performance scores

### 4.4 Quality Report Generation

**Agent Actions**:
1. Analyze test results
2. Document failed tests with reproduction steps
3. Calculate quality metrics
4. Identify areas for improvement
5. Provide recommendations

**Artifact Generated**: Quality Report

### 4.5 Review & Approval

**User Actions**:
1. Review test results and quality report
2. Evaluate:
   - Are all tests passing?
   - Is code coverage acceptable?
   - Are there any critical bugs?
   - Are quality metrics meeting standards?
3. Choose action:
   - **Approve**: Mark project as complete
   - **Request Fixes**: Identify issues to address
   - **Reject**: Major quality problems

**Example Feedback**:
- "Please fix the 2 failing E2E tests"
- "Code coverage should be >85%"
- "The accessibility score is too low"

### 4.6 Issue Resolution (if needed)

**System Actions**:
1. Route bug fixes back to Developer Agent
2. Developer fixes identified issues
3. QA Agent re-runs affected tests
4. Re-submit quality report

**Loop**: Continues until all critical issues resolved

### 4.7 Phase Completion

**System Actions**:
1. Lock final test suite and quality report
2. Update project status to "Complete"
3. Generate final project summary
4. Prepare deployment artifacts

**Outputs**:
- Approved test suite
- Quality report (all passing)
- Final project artifacts
- Deployment-ready code

---

## Phase 5: Complete

**Goal**: Project is ready for deployment

**User Actions**:
1. Review final project summary
2. Access deployment-ready code
3. Deploy to hosting platform
4. (Optional) Request additional features (new project phase)

**System Actions**:
1. Archive project artifacts
2. Generate handoff documentation
3. Provide deployment checklist

---

## Cross-Phase Features

### Feedback System

**At any review checkpoint**:
```typescript
interface Feedback {
  action: 'approve' | 'request_changes' | 'reject';
  comments?: string;
  specificChanges?: ChangeRequest[];
}

interface ChangeRequest {
  artifact: string;      // Which artifact needs changes
  section: string;       // Specific section/component
  currentState: string;  // What it is now
  desiredState: string;  // What you want
  priority: 'critical' | 'important' | 'nice-to-have';
}
```

### Agent Collaboration

Agents can request assistance from each other:
- Designer → PM: "This user story is ambiguous, can you clarify?"
- Developer → Designer: "How should this component behave on mobile?"
- QA → Developer: "This bug needs a fix before I can continue testing"

### Version Control

All artifacts are versioned:
- PRD v1.0 → PRD v1.1 (after revision)
- Design System v1.0 → Design System v2.0 (major changes)
- Code commits tracked in git

### Rollback Capability

If major issues discovered in later phases:
- User can request rollback to previous phase
- Example: "The design doesn't support a requirement in the PRD"
- System handles context restoration and re-execution

---

## Workflow States

### Project Status
```typescript
enum ProjectStatus {
  DISCOVERY = 'discovery',
  DISCOVERY_REVIEW = 'discovery_review',
  DESIGN = 'design',
  DESIGN_REVIEW = 'design_review',
  DEVELOPMENT = 'development',
  DEVELOPMENT_REVIEW = 'development_review',
  TESTING = 'testing',
  TESTING_REVIEW = 'testing_review',
  COMPLETE = 'complete',
  PAUSED = 'paused',
  ARCHIVED = 'archived'
}
```

### Artifact Status
```typescript
enum ArtifactStatus {
  DRAFT = 'draft',                     // Agent is working on it
  PENDING_REVIEW = 'pending_review',   // Ready for user review
  CHANGES_REQUESTED = 'changes_requested', // User requested changes
  APPROVED = 'approved',               // User approved
  SUPERSEDED = 'superseded'            // Replaced by newer version
}
```

---

## Example: Complete Project Flow

### Project: "Task Management App for Freelancers"

#### Discovery Phase (Day 1)
1. User describes idea: "A simple task manager for freelancers to track client projects"
2. PM Agent asks: "Do you need time tracking? Invoicing? Client collaboration?"
3. User clarifies: "Just tasks and projects for now, no invoicing"
4. PM Agent generates PRD with 5 core features
5. User reviews, requests adding "project templates"
6. PM Agent revises PRD v1.1
7. User approves → Move to Design

#### Design Phase (Day 2)
1. Designer Agent creates wireframes for 4 pages:
   - Dashboard (project list)
   - Project detail (task list)
   - Task detail
   - Settings
2. Designer defines design system (colors, components)
3. User reviews, requests "darker color scheme"
4. Designer revises with new palette
5. User approves → Move to Development

#### Development Phase (Day 3-4)
1. Developer Agent sets up Next.js project
2. Implements design system in Tailwind
3. Builds all pages and components
4. Adds local storage for persistence
5. User reviews, finds bug in task completion
6. Developer fixes bug
7. User approves → Move to Testing

#### Testing Phase (Day 5)
1. QA Agent creates test plan (20 test cases)
2. Writes automated tests
3. Runs tests: 19/20 passing
4. Identifies 1 edge case bug (empty project name)
5. Developer fixes, QA re-runs tests
6. All tests passing, 89% coverage
7. User approves → Project Complete

**Total Time**: 5 days from idea to production-ready code

---

## Best Practices

### For Users

**Be Specific in Feedback**:
- ❌ "I don't like the design"
- ✅ "The dashboard feels cluttered. Can we use a grid instead of a list?"

**Review Each Phase Thoroughly**:
- Catching issues early saves time later
- It's easier to change a PRD than rewrite code

**Iterate in Small Steps**:
- Request small changes rather than major overhauls
- Each iteration is quick, but many iterations add up

**Trust the Process**:
- Agents are specialized for their phase
- Following the workflow produces better results than skipping ahead

### For System Design

**Keep Context Rich**:
- Each agent needs full context from previous phases
- Include user feedback history in handoffs

**Make Revisions Cheap**:
- Fast iteration cycles encourage better outcomes
- Optimize agent response times

**Provide Clear Visibility**:
- Users should always know what's happening
- Show agent progress, not just final outputs

**Enforce Quality Gates**:
- Don't allow skipping approvals
- Poor early phases cascade into poor later phases

---

## Metrics & Analytics

### Tracked Metrics

**Per Phase**:
- Time to completion
- Number of revisions
- User satisfaction rating

**Per Project**:
- Total development time
- Number of phases completed
- Final quality score

**Platform-Wide**:
- Average time per phase
- Most common revision requests
- Phase with highest satisfaction

---

## Future Enhancements

### Parallel Work
- Allow Designer to start while PM finalizes details
- Risk: Rework if PRD changes

### Micro-Approvals
- Approve individual features rather than entire phases
- Allows faster iteration on specific parts

### Agent Learning
- Agents learn from user feedback patterns
- Reduce revision cycles over time

### Collaboration Mode
- Multiple users can review and approve
- Team-based product development

---

## References

- [ARCHITECTURE.md](./ARCHITECTURE.md) - System architecture
- [AGENTS.md](./AGENTS.md) - Agent specifications
- [CONTRIBUTING.md](./CONTRIBUTING.md) - Development guidelines
