# Frontend-Backend Integration

## Overview

The frontend Next.js application uses its API routes as a proxy to the Express backend. This approach provides:
- **Security**: Backend URL and API keys stay server-side
- **Single Origin**: No CORS issues for the browser
- **Flexibility**: Easy to add caching, auth, or swap backends

## Architecture

```
Browser → Next.js Frontend (localhost:3000)
           ↓ (API Routes /api/*)
         Next.js API Proxy
           ↓ (Internal Server-Side)
         Express Backend (localhost:3001)
           ↓
         SQLite Database
```

## Configuration

### Backend (.env - not created yet, uses defaults)
```bash
PORT=3001
NODE_ENV=development
```

### Frontend (.env.local - created)
```bash
BACKEND_URL=http://localhost:3001
```

## API Routes (Proxy Layer)

All Next.js API routes in `frontend/app/api/*` now proxy to the backend:

### Projects
- `GET /api/projects` → `http://localhost:3001/api/projects`
- `POST /api/projects` → `http://localhost:3001/api/projects`
- `GET /api/projects/:id` → `http://localhost:3001/api/projects/:id`
- `PUT /api/projects/:id` → `http://localhost:3001/api/projects/:id`
- `DELETE /api/projects/:id` → `http://localhost:3001/api/projects/:id`

### Chat
- `GET /api/projects/:id/chat` → `http://localhost:3001/api/projects/:id/chat`
- `POST /api/projects/:id/chat` → `http://localhost:3001/api/projects/:id/chat`

### Roadmap
- `POST /api/projects/:id/roadmap` → `http://localhost:3001/api/projects/:id/roadmap`

### Agents
- `GET /api/agents` → `http://localhost:3001/api/agents`
- `POST /api/agents` → `http://localhost:3001/api/agents`
- `GET /api/agents/:id` → `http://localhost:3001/api/agents/:id`
- `PUT /api/agents/:id` → `http://localhost:3001/api/agents/:id`
- `DELETE /api/agents/:id` → `http://localhost:3001/api/agents/:id`

## Running the Stack

### 1. Start Backend
```bash
cd backend
npm install            # First time only
npm run db:migrate     # First time only
npm run db:seed        # First time only
npm run dev            # Starts on http://localhost:3001
```

### 2. Start Frontend
```bash
cd frontend
npm install            # First time only
npm run dev            # Starts on http://localhost:3000
```

### 3. Verify Integration
```bash
# Test backend directly
curl http://localhost:3001/api/projects

# Test through frontend proxy
curl http://localhost:3000/api/projects
```

## Frontend Code Changes

The frontend React components don't need any changes! They still call:
```typescript
const response = await fetch('/api/projects')
```

But now the request flow is:
1. Browser → Next.js frontend (:3000/api/projects)
2. Next.js API route → Express backend (:3001/api/projects)
3. Express → SQLite database
4. Response flows back up the chain

## Benefits of This Approach

1. **Security**
   - LLM API keys will be in `frontend/.env.local` (server-side only)
   - Backend URL not exposed to browser
   - Can add auth tokens server-side

2. **Flexibility**
   - Can add request/response transformation
   - Can add caching at proxy level
   - Can swap backends without changing frontend code

3. **Development**
   - Still develop with hot-reload on both ends
   - Can debug full request flow
   - Same as production architecture

4. **Production**
   - Deploy both as single Next.js app
   - Or deploy separately and change BACKEND_URL
   - No CORS configuration needed

## Next Steps

### Add LLM Integration
When ready to add LLM calls:

1. Add API keys to `frontend/.env.local`:
```bash
OPENAI_API_KEY=sk-...
ANTHROPIC_API_KEY=sk-ant-...
```

2. Update backend services:
   - `backend/src/services/chat-service.ts`
   - `backend/src/services/roadmap-generator.ts`

3. The proxy will handle passing them to the backend securely

### Optional: Backend Authentication
If you want to add security between frontend and backend:

```typescript
// frontend/app/api/projects/route.ts
const response = await fetch(`${BACKEND_URL}/api/projects`, {
  headers: {
    'Authorization': `Bearer ${process.env.BACKEND_API_KEY}`,
    'Content-Type': 'application/json',
  },
})
```

## Troubleshooting

### Backend not responding
```bash
# Check if backend is running
curl http://localhost:3001/health

# Check logs
cd backend && npm run dev
```

### Frontend can't connect to backend
1. Verify `frontend/.env.local` has `BACKEND_URL=http://localhost:3001`
2. Restart frontend dev server after changing .env
3. Check backend is actually running on port 3001

### CORS errors
Should not happen with proxy approach! If you see CORS errors:
- The proxy is broken
- Check the API route files in `frontend/app/api/*`
- Make sure they're fetching from BACKEND_URL

## Testing

### Manual API Tests

```bash
# Create a project
curl -X POST http://localhost:3000/api/projects \
  -H "Content-Type: application/json" \
  -d '{"description": "A social network for pet owners"}'

# Get project ID from response, then test chat
curl -X POST http://localhost:3000/api/projects/{PROJECT_ID}/chat \
  -H "Content-Type: application/json" \
  -d '{"content": "Consumer Mobile App"}'

# Generate roadmap
curl -X POST http://localhost:3000/api/projects/{PROJECT_ID}/roadmap
```

### Check Database
```bash
cd backend
sqlite3 data/multiagent.db

# In sqlite shell:
.tables
SELECT * FROM projects;
SELECT * FROM agents;
.quit
```

## Production Deployment

### Option 1: Monolithic (Recommended for MVP)
Deploy the Next.js frontend with the backend embedded:

1. Move backend into `frontend/server/`
2. Start backend in `frontend/package.json` scripts
3. Deploy to Vercel/Railway/Render as one app

### Option 2: Separate Services
- Frontend: Vercel/Netlify
- Backend: Railway/Render/Fly.io
- Update `BACKEND_URL` to production URL
- Add proper authentication between services

## Current Status

- ✅ Backend running on http://localhost:3001
- ✅ All API endpoints implemented
- ✅ SQLite database with sample data
- ✅ Frontend proxy routes configured
- ✅ Environment files created
- ⚠️ Frontend has unrelated CSS dependency issue (not related to backend integration)
- 🔄 Ready for LLM integration

## Files Modified

### Created
- `frontend/.env.local` - Backend URL configuration
- `frontend/.env.example` - Template for environment variables
- `backend/*` - Entire backend implementation

### Modified
- `frontend/app/api/projects/route.ts` - Proxy to backend
- `frontend/app/api/projects/[id]/route.ts` - Proxy to backend
- `frontend/app/api/projects/[id]/chat/route.ts` - Proxy to backend
- `frontend/app/api/projects/[id]/roadmap/route.ts` - Proxy to backend
- `frontend/app/api/agents/route.ts` - Proxy to backend
- `frontend/app/api/agents/[id]/route.ts` - Proxy to backend
- `frontend/.gitignore` - Allow .env.example

### No Changes Needed
- Frontend React components - Still call `/api/*` routes
- Frontend UI code - No changes required
- Frontend types - Already match backend
