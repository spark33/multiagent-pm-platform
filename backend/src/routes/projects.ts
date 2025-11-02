import { Router, Request, Response } from 'express'
import { ProjectModel } from '../models/project'
import { ChatModel } from '../models/chat'
import { TaskModel } from '../models/task'
import { generateRoadmap } from '../services/roadmap-generator'
import { generatePMResponse } from '../services/chat-service'
import { TaskOrchestrator } from '../services/task-orchestrator'
import type { CreateProjectRequest, SendMessageRequest } from '../types'

const router = Router()

// GET /api/projects - List all projects
router.get('/', (req: Request, res: Response) => {
  try {
    const projects = ProjectModel.getAll()

    res.json({
      projects,
      total: projects.length
    })
  } catch (error) {
    console.error('Error fetching projects:', error)
    res.status(500).json({ error: 'Failed to fetch projects' })
  }
})

// POST /api/projects - Create a new project
router.post('/', async (req: Request, res: Response) => {
  try {
    const body = req.body as CreateProjectRequest

    if (!body.description || !body.description.trim()) {
      res.status(400).json({ error: 'Project description is required' })
      return
    }

    const newProject = ProjectModel.create(body.description)

    // Add the user's initial description as the first message
    ChatModel.addMessage(newProject.id, 'user', body.description)

    // Generate AI PM's initial response to start discovery
    const chatHistory = ChatModel.getHistory(newProject.id)
    const pmResponse = await generatePMResponse(chatHistory, body.description)
    ChatModel.addMessage(newProject.id, 'assistant', pmResponse)

    res.status(201).json(newProject)
  } catch (error) {
    console.error('Error creating project:', error)
    res.status(500).json({ error: 'Failed to create project' })
  }
})

// GET /api/projects/:id - Get project by ID
router.get('/:id', (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const project = ProjectModel.getById(id)

    if (!project) {
      res.status(404).json({ error: 'Project not found' })
      return
    }

    res.json(project)
  } catch (error) {
    console.error('Error fetching project:', error)
    res.status(500).json({ error: 'Failed to fetch project' })
  }
})

// GET /api/projects/:id/chat - Get chat history
router.get('/:id/chat', (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const messages = ChatModel.getHistory(id)

    res.json({
      messages,
      projectId: id
    })
  } catch (error) {
    console.error('Error fetching chat history:', error)
    res.status(500).json({ error: 'Failed to fetch chat history' })
  }
})

// POST /api/projects/:id/chat - Send a message
router.post('/:id/chat', async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const body = req.body as SendMessageRequest

    if (!body.content || !body.content.trim()) {
      res.status(400).json({ error: 'Message content is required' })
      return
    }

    // Add user message
    const userMessage = ChatModel.addMessage(id, 'user', body.content)

    // Get conversation history
    const chatHistory = ChatModel.getHistory(id)

    // Generate PM response using LLM
    const responseContent = await generatePMResponse(chatHistory, body.content)

    // Add assistant message
    const assistantMessage = ChatModel.addMessage(id, 'assistant', responseContent)

    res.json({
      message: assistantMessage
    })
  } catch (error) {
    console.error('Error sending message:', error)
    res.status(500).json({ error: 'Failed to send message' })
  }
})

// POST /api/projects/:id/roadmap - Generate roadmap
router.post('/:id/roadmap', (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const project = ProjectModel.getById(id)

    if (!project) {
      res.status(404).json({ error: 'Project not found' })
      return
    }

    // Get chat history to inform roadmap generation
    const chatHistory = ChatModel.getHistory(id)

    // Generate roadmap using chat context (TODO: Replace with LLM-based generation)
    const roadmap = generateRoadmap(project.description, project.context, chatHistory)

    // Save roadmap to database
    ProjectModel.saveRoadmap(id, roadmap)

    // Update project status
    const updatedProject = ProjectModel.update(id, { status: 'roadmap' })

    res.json({
      project: updatedProject,
      message: 'Roadmap generated successfully'
    })
  } catch (error) {
    console.error('Error generating roadmap:', error)
    res.status(500).json({ error: 'Failed to generate roadmap' })
  }
})

// PATCH /api/projects/:id/phases/:phaseId - Update phase status
router.patch('/:id/phases/:phaseId', async (req: Request, res: Response) => {
  try {
    const { id, phaseId } = req.params
    const { status } = req.body

    if (!status || !['pending', 'in_progress', 'completed'].includes(status)) {
      res.status(400).json({ error: 'Invalid status' })
      return
    }

    const success = ProjectModel.updatePhaseStatus(id, phaseId, status)

    if (!success) {
      res.status(404).json({ error: 'Phase not found' })
      return
    }

    // If phase is being started, automatically start the first task
    if (status === 'in_progress') {
      const tasks = TaskModel.getByPhaseId(phaseId)

      // Find the first pending task with no dependencies
      const firstTask = tasks.find(task =>
        task.status === 'pending' &&
        (!task.dependencies || task.dependencies.length === 0)
      )

      if (firstTask) {
        console.log(`Auto-starting first task in phase: ${firstTask.title}`)

        // Start task execution asynchronously (don't wait for it)
        TaskOrchestrator.startTaskExecution(firstTask.id, phaseId, id)
          .then(execution => {
            console.log(`✅ Task execution started: ${execution.id}`)

            // Start the discussion round after a brief delay to let the initial work complete
            setTimeout(async () => {
              try {
                await TaskOrchestrator.processRound(execution.id)
                console.log(`✅ First discussion round initiated for ${execution.id}`)
              } catch (err) {
                console.error(`Error processing first round:`, err)
              }
            }, 2000)
          })
          .catch(err => console.error('Error starting task:', err))
      }
    }

    // Return updated project
    const project = ProjectModel.getById(id)
    res.json({ project, message: 'Phase status updated successfully' })
  } catch (error) {
    console.error('Error updating phase status:', error)
    res.status(500).json({ error: 'Failed to update phase status' })
  }
})

export default router
