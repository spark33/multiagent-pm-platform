# Contributing Guide

This guide provides development standards, best practices, and guidelines for building the Multi-Agent Development Platform.

## Table of Contents

- [Development Setup](#development-setup)
- [Project Structure](#project-structure)
- [Code Standards](#code-standards)
- [Git Workflow](#git-workflow)
- [Testing Requirements](#testing-requirements)
- [Documentation](#documentation)
- [Agent Development](#agent-development)
- [Pull Request Process](#pull-request-process)

---

## Development Setup

### Prerequisites

- Node.js 18+ and npm
- Git
- Code editor (VS Code recommended)
- Claude API key (for agent development)

### Initial Setup

```bash
# Clone the repository
git clone <repository-url>
cd multiagent-v0

# Install frontend dependencies
cd frontend
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your API keys

# Start development server
npm run dev
```

### Environment Variables

```bash
# .env.local
NEXT_PUBLIC_API_URL=http://localhost:3000/api
CLAUDE_API_KEY=your_api_key_here
DATABASE_URL=postgresql://localhost:5432/multiagent
```

---

## Project Structure

```
multiagent-v0/
├── frontend/                 # Next.js application
│   ├── app/                 # App router pages and layouts
│   │   ├── (routes)/       # Page routes
│   │   ├── api/            # API routes
│   │   └── layout.tsx      # Root layout
│   ├── components/          # React components
│   │   ├── ui/             # Reusable UI components
│   │   ├── features/       # Feature-specific components
│   │   └── layouts/        # Layout components
│   ├── lib/                # Utility functions and helpers
│   │   ├── agents/         # Agent integration logic
│   │   ├── api/            # API client functions
│   │   └── utils/          # General utilities
│   ├── types/              # TypeScript type definitions
│   ├── hooks/              # Custom React hooks
│   ├── public/             # Static assets
│   └── styles/             # Global styles
├── backend/                # Backend API (TBD)
├── docs/                   # Documentation
└── README.md
```

### Naming Conventions

**Files and Folders**:
- Components: `PascalCase.tsx` (e.g., `ProjectCard.tsx`)
- Utilities: `camelCase.ts` (e.g., `formatDate.ts`)
- Hooks: `use*.ts` (e.g., `useProject.ts`)
- Types: `*.types.ts` (e.g., `project.types.ts`)
- API routes: `route.ts` in Next.js App Router

**Code**:
- Components: `PascalCase`
- Functions: `camelCase`
- Constants: `UPPER_SNAKE_CASE`
- Types/Interfaces: `PascalCase`
- Enums: `PascalCase`

---

## Code Standards

### TypeScript

**Always use TypeScript**. No `any` types except in rare, justified cases.

```typescript
// ✅ Good
interface Project {
  id: string;
  name: string;
  status: ProjectStatus;
}

function createProject(data: CreateProjectInput): Project {
  // ...
}

// ❌ Bad
function createProject(data: any): any {
  // ...
}
```

### React Components

**Functional components with TypeScript**:

```typescript
// ✅ Good
interface ProjectCardProps {
  project: Project;
  onSelect: (id: string) => void;
}

export function ProjectCard({ project, onSelect }: ProjectCardProps) {
  return (
    <div onClick={() => onSelect(project.id)}>
      <h3>{project.name}</h3>
      <Badge status={project.status} />
    </div>
  );
}

// ❌ Bad - no types, default export
export default function ProjectCard(props) {
  return <div>{props.project.name}</div>;
}
```

### Styling

**Use Tailwind CSS utility classes**:

```typescript
// ✅ Good
<button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
  Create Project
</button>

// ❌ Bad - inline styles
<button style={{ padding: '8px 16px', background: 'blue' }}>
  Create Project
</button>
```

**For complex, reusable styles, use component composition**:

```typescript
// components/ui/Button.tsx
interface ButtonProps {
  variant?: 'primary' | 'secondary';
  children: React.ReactNode;
}

export function Button({ variant = 'primary', children }: ButtonProps) {
  const baseClasses = "px-4 py-2 rounded-md font-medium";
  const variantClasses = {
    primary: "bg-blue-600 text-white hover:bg-blue-700",
    secondary: "bg-gray-200 text-gray-900 hover:bg-gray-300"
  };

  return (
    <button className={`${baseClasses} ${variantClasses[variant]}`}>
      {children}
    </button>
  );
}
```

### Error Handling

**Always handle errors gracefully**:

```typescript
// ✅ Good
async function createProject(data: CreateProjectInput) {
  try {
    const response = await fetch('/api/projects', {
      method: 'POST',
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      throw new Error(`Failed to create project: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error creating project:', error);
    throw error; // Re-throw for caller to handle
  }
}

// ❌ Bad - no error handling
async function createProject(data: CreateProjectInput) {
  const response = await fetch('/api/projects', {
    method: 'POST',
    body: JSON.stringify(data)
  });
  return await response.json();
}
```

### Performance

**Optimize React re-renders**:

```typescript
// Use React.memo for expensive components
export const ProjectList = React.memo(({ projects }: ProjectListProps) => {
  return (
    <div>
      {projects.map(project => (
        <ProjectCard key={project.id} project={project} />
      ))}
    </div>
  );
});

// Use useCallback for functions passed to children
const handleSelect = useCallback((id: string) => {
  setSelectedId(id);
}, []);

// Use useMemo for expensive calculations
const sortedProjects = useMemo(() => {
  return projects.sort((a, b) => a.name.localeCompare(b.name));
}, [projects]);
```

---

## Git Workflow

### Branching Strategy

```
main
  ├── feature/discovery-phase
  ├── feature/design-agent
  ├── fix/project-creation-bug
  └── docs/update-architecture
```

**Branch naming**:
- Features: `feature/description`
- Bug fixes: `fix/description`
- Documentation: `docs/description`
- Refactoring: `refactor/description`

### Commit Messages

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <subject>

<body>

<footer>
```

**Types**:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, no logic change)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

**Examples**:

```
feat(agents): implement PM Agent with PRD generation

- Add PM Agent system prompt
- Create PRD template
- Implement revision logic

Closes #42
```

```
fix(ui): resolve mobile navigation bug

The hamburger menu was not closing on route change in iOS Safari.
Added useEffect to close menu on pathname change.

Fixes #58
```

### Pull Request Process

See [Pull Request Process](#pull-request-process) section below.

---

## Testing Requirements

### Test Coverage Goals

- **Unit tests**: >80% coverage for business logic
- **Component tests**: All UI components
- **Integration tests**: All API endpoints
- **E2E tests**: Critical user flows

### Testing Tools

- **Unit/Component**: Jest + React Testing Library
- **E2E**: Playwright
- **API**: Supertest (or Playwright for Next.js API routes)

### Writing Tests

**Component Tests**:

```typescript
// components/ProjectCard.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { ProjectCard } from './ProjectCard';

describe('ProjectCard', () => {
  const mockProject = {
    id: '1',
    name: 'Test Project',
    status: 'discovery' as const
  };

  it('should render project name', () => {
    render(<ProjectCard project={mockProject} onSelect={jest.fn()} />);
    expect(screen.getByText('Test Project')).toBeInTheDocument();
  });

  it('should call onSelect when clicked', () => {
    const onSelect = jest.fn();
    render(<ProjectCard project={mockProject} onSelect={onSelect} />);

    fireEvent.click(screen.getByText('Test Project'));
    expect(onSelect).toHaveBeenCalledWith('1');
  });
});
```

**API Tests**:

```typescript
// app/api/projects/route.test.ts
import { POST } from './route';

describe('POST /api/projects', () => {
  it('should create a new project', async () => {
    const request = new Request('http://localhost:3000/api/projects', {
      method: 'POST',
      body: JSON.stringify({ name: 'New Project' })
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(201);
    expect(data).toHaveProperty('id');
    expect(data.name).toBe('New Project');
  });
});
```

**E2E Tests**:

```typescript
// e2e/project-creation.spec.ts
import { test, expect } from '@playwright/test';

test('user can create a new project', async ({ page }) => {
  await page.goto('http://localhost:3000');

  await page.click('button:has-text("New Project")');
  await page.fill('input[name="name"]', 'My Project');
  await page.fill('textarea[name="description"]', 'Test description');
  await page.click('button:has-text("Create")');

  await expect(page.locator('text=My Project')).toBeVisible();
});
```

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm test -- --watch

# Run E2E tests
npm run test:e2e

# Generate coverage report
npm test -- --coverage
```

---

## Documentation

### Code Documentation

**Use JSDoc for complex functions**:

```typescript
/**
 * Generates a PRD based on user input and project requirements.
 *
 * @param input - User's product description and preferences
 * @param context - Additional context from previous interactions
 * @returns A structured PRD with user stories and acceptance criteria
 * @throws {ValidationError} If input is invalid or incomplete
 */
async function generatePRD(
  input: UserInput,
  context: ProjectContext
): Promise<PRD> {
  // ...
}
```

**Add comments for complex logic**:

```typescript
// Calculate feature priority using weighted scoring:
// Impact (40%) + User Value (30%) + Implementation Effort (30%)
const priority = (
  impact * 0.4 +
  userValue * 0.3 +
  (1 - effort) * 0.3 // Invert effort (lower effort = higher priority)
);
```

### README Files

Each major feature should have a README:

```
lib/agents/
├── pm-agent/
│   ├── index.ts
│   ├── prompt.ts
│   └── README.md    # Explains PM Agent implementation
```

### Updating Documentation

When making significant changes:
1. Update relevant `.md` files in project root
2. Update component/function documentation
3. Update examples if behavior changes
4. Add migration guides for breaking changes

---

## Agent Development

### Creating a New Agent

1. **Define the agent interface**:

```typescript
// types/agents.types.ts
export interface Agent {
  id: string;
  type: AgentType;
  phase: Phase;
  process(input: AgentInput): Promise<AgentOutput>;
  revise(artifact: Artifact, feedback: Feedback): Promise<Artifact>;
}
```

2. **Implement the agent**:

```typescript
// lib/agents/pm-agent/index.ts
import { Agent, AgentInput, AgentOutput } from '@/types/agents.types';
import { PM_SYSTEM_PROMPT } from './prompt';

export class PMAgent implements Agent {
  id = 'pm-agent';
  type = 'PM' as const;
  phase = 'discovery' as const;

  async process(input: AgentInput): Promise<AgentOutput> {
    // Call LLM with system prompt and user input
    const prd = await this.generatePRD(input);
    return {
      artifacts: [{ type: 'PRD', content: prd }],
      status: 'pending_review'
    };
  }

  async revise(artifact: Artifact, feedback: Feedback): Promise<Artifact> {
    // Incorporate feedback and regenerate
  }

  private async generatePRD(input: AgentInput): Promise<string> {
    // LLM integration logic
  }
}
```

3. **Define the system prompt**:

```typescript
// lib/agents/pm-agent/prompt.ts
export const PM_SYSTEM_PROMPT = `
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
`;
```

4. **Write tests**:

```typescript
// lib/agents/pm-agent/index.test.ts
describe('PMAgent', () => {
  it('should generate a PRD from user input', async () => {
    const agent = new PMAgent();
    const output = await agent.process({
      description: 'A task manager for freelancers'
    });

    expect(output.artifacts).toHaveLength(1);
    expect(output.artifacts[0].type).toBe('PRD');
  });
});
```

5. **Document the agent**:

Update `AGENTS.md` with the new agent's specification.

### Agent Quality Checklist

- [ ] Agent produces structured, parseable output
- [ ] System prompt is clear and specific
- [ ] Agent handles edge cases and errors
- [ ] Agent can revise based on feedback
- [ ] Unit tests cover core functionality
- [ ] Documentation is complete

---

## Pull Request Process

### Before Creating a PR

1. **Run all checks locally**:
```bash
npm run lint        # ESLint
npm run type-check  # TypeScript
npm test            # All tests
npm run build       # Production build
```

2. **Update documentation** if needed

3. **Write clear commit messages**

### Creating a PR

1. **Title**: Use conventional commit format
   - Example: `feat(agents): add Designer Agent implementation`

2. **Description template**:
```markdown
## Summary
[Brief description of changes]

## Changes Made
- Added X component
- Implemented Y functionality
- Fixed Z bug

## Testing
- [ ] Unit tests added/updated
- [ ] E2E tests added/updated
- [ ] Manually tested in browser

## Screenshots (if UI changes)
[Add screenshots]

## Related Issues
Closes #123
```

3. **Checklist**:
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Comments added for complex logic
- [ ] Documentation updated
- [ ] Tests added/updated
- [ ] All tests passing
- [ ] No console errors or warnings
- [ ] Build succeeds

### Review Process

1. **Automated checks must pass**:
   - Linting
   - Type checking
   - Tests
   - Build

2. **Code review**:
   - At least one approval required
   - Address all comments before merging

3. **Merge**:
   - Squash and merge for feature branches
   - Keep commit history clean

---

## Code Review Guidelines

### As a Reviewer

**Focus on**:
- Correctness: Does it work as intended?
- Code quality: Is it maintainable?
- Performance: Are there obvious bottlenecks?
- Security: Are there vulnerabilities?
- Tests: Is it well-tested?

**Provide**:
- Specific, actionable feedback
- Praise for good solutions
- Links to relevant docs or examples

**Avoid**:
- Nitpicking style (let the linter handle it)
- Blocking on subjective preferences
- Vague comments ("this could be better")

### As an Author

**Do**:
- Respond to all comments
- Ask questions if feedback is unclear
- Push updates after addressing comments
- Thank reviewers

**Don't**:
- Take feedback personally
- Argue unnecessarily
- Ignore feedback
- Force merge

---

## Performance Guidelines

### Frontend Performance

1. **Code splitting**: Use dynamic imports for large components
```typescript
const HeavyComponent = dynamic(() => import('./HeavyComponent'), {
  loading: () => <Spinner />
});
```

2. **Image optimization**: Use Next.js Image component
```typescript
import Image from 'next/image';

<Image
  src="/project-icon.png"
  width={64}
  height={64}
  alt="Project icon"
/>
```

3. **Minimize bundle size**: Analyze with `npm run analyze`

4. **Lazy load**: Load below-the-fold content lazily

### API Performance

1. **Caching**: Use appropriate cache headers
2. **Pagination**: Don't return huge datasets
3. **Database queries**: Use indexes, avoid N+1 queries
4. **Rate limiting**: Protect against abuse

---

## Security Guidelines

### Input Validation

**Always validate and sanitize user input**:

```typescript
import { z } from 'zod';

const CreateProjectSchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().max(1000).optional()
});

export async function POST(request: Request) {
  const body = await request.json();
  const validated = CreateProjectSchema.parse(body); // Throws if invalid
  // ...
}
```

### Authentication & Authorization

```typescript
// Verify user is authenticated
const session = await getSession(request);
if (!session) {
  return new Response('Unauthorized', { status: 401 });
}

// Verify user owns the resource
const project = await db.project.findUnique({ where: { id } });
if (project.userId !== session.userId) {
  return new Response('Forbidden', { status: 403 });
}
```

### Environment Variables

**Never commit secrets**:
- Use `.env.local` (gitignored)
- Use `NEXT_PUBLIC_*` prefix only for client-side vars
- Rotate API keys regularly

---

## Accessibility Guidelines

### WCAG Compliance

Target **WCAG 2.1 Level AA** compliance:

1. **Semantic HTML**: Use proper heading hierarchy, landmarks
2. **Keyboard navigation**: All interactive elements accessible via keyboard
3. **Focus management**: Visible focus indicators
4. **ARIA labels**: For icon buttons and dynamic content
5. **Color contrast**: Minimum 4.5:1 for text

### Example

```typescript
<button
  onClick={handleSubmit}
  aria-label="Create new project"
  className="focus:ring-2 focus:ring-blue-500 focus:outline-none"
>
  <PlusIcon className="w-5 h-5" aria-hidden="true" />
</button>
```

---

## Questions?

If you have questions about contributing:
1. Check existing documentation
2. Search closed issues/PRs
3. Ask in discussions
4. Open an issue

---

## License

By contributing, you agree that your contributions will be licensed under the same license as the project (TBD).
