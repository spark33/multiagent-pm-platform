import { Router, Request, Response } from 'express'
import { AgentModel } from '../models/agent'
import type { CreateAgentRequest, UpdateAgentRequest } from '../types'

const router = Router()

// GET /api/agents - List all agents
router.get('/', (req: Request, res: Response) => {
  try {
    const agents = AgentModel.getAll()

    res.json({
      agents,
      total: agents.length
    })
  } catch (error) {
    console.error('Error fetching agents:', error)
    res.status(500).json({ error: 'Failed to fetch agents' })
  }
})

// GET /api/agents/:id - Get agent by ID
router.get('/:id', (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const agent = AgentModel.getById(id)

    if (!agent) {
      res.status(404).json({ error: 'Agent not found' })
      return
    }

    res.json(agent)
  } catch (error) {
    console.error('Error fetching agent:', error)
    res.status(500).json({ error: 'Failed to fetch agent' })
  }
})

// POST /api/agents - Create a new agent
router.post('/', (req: Request, res: Response) => {
  try {
    const body = req.body as CreateAgentRequest

    // Basic validation
    if (!body.name || !body.role || !body.goal) {
      res.status(400).json({ error: 'Name, role, and goal are required' })
      return
    }

    const newAgent = AgentModel.create(body)

    res.status(201).json(newAgent)
  } catch (error) {
    console.error('Error creating agent:', error)
    res.status(500).json({ error: 'Failed to create agent' })
  }
})

// PUT /api/agents/:id - Update an agent
router.put('/:id', (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const body = req.body as UpdateAgentRequest

    const updatedAgent = AgentModel.update(id, body)

    if (!updatedAgent) {
      res.status(404).json({ error: 'Agent not found' })
      return
    }

    res.json(updatedAgent)
  } catch (error) {
    console.error('Error updating agent:', error)
    res.status(500).json({ error: 'Failed to update agent' })
  }
})

// DELETE /api/agents/:id - Delete an agent
router.delete('/:id', (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const deleted = AgentModel.delete(id)

    if (!deleted) {
      res.status(404).json({ error: 'Agent not found' })
      return
    }

    res.status(204).send()
  } catch (error) {
    console.error('Error deleting agent:', error)
    res.status(500).json({ error: 'Failed to delete agent' })
  }
})

export default router
