import express, { Request, Response } from 'express'
import { TaskOrchestrator } from '../services/task-orchestrator'
import { TaskExecutionModel } from '../models/task-execution'

const router = express.Router()

/**
 * POST /api/task-executions
 * Start execution of a task
 */
router.post('/', async (req: Request, res: Response) => {
  try {
    const { taskId, phaseId, projectId } = req.body

    if (!taskId || !phaseId || !projectId) {
      return res.status(400).json({
        error: 'Missing required fields: taskId, phaseId, projectId'
      })
    }

    const execution = await TaskOrchestrator.startTaskExecution(taskId, phaseId, projectId)

    res.status(201).json(execution)
  } catch (error: any) {
    console.error('Error starting task execution:', error)
    res.status(500).json({ error: error.message || 'Failed to start task execution' })
  }
})

/**
 * GET /api/task-executions/:id
 * Get task execution state with full details
 */
router.get('/:id', (req: Request, res: Response) => {
  try {
    const { id } = req.params

    const state = TaskOrchestrator.getExecutionState(id)

    if (!state) {
      return res.status(404).json({ error: 'Task execution not found' })
    }

    res.json(state)
  } catch (error: any) {
    console.error('Error fetching task execution:', error)
    res.status(500).json({ error: error.message || 'Failed to fetch task execution' })
  }
})

/**
 * GET /api/task-executions/task/:taskId
 * Get task execution by task ID
 */
router.get('/task/:taskId', (req: Request, res: Response) => {
  try {
    const { taskId } = req.params

    const execution = TaskExecutionModel.getByTaskId(taskId)

    if (!execution) {
      return res.status(404).json({ error: 'Task execution not found' })
    }

    const state = TaskOrchestrator.getExecutionState(execution.id)

    res.json(state)
  } catch (error: any) {
    console.error('Error fetching task execution:', error)
    res.status(500).json({ error: error.message || 'Failed to fetch task execution' })
  }
})

/**
 * GET /api/task-executions/phase/:phaseId
 * Get all task executions for a phase
 */
router.get('/phase/:phaseId', (req: Request, res: Response) => {
  try {
    const { phaseId } = req.params

    const executions = TaskExecutionModel.getByPhaseId(phaseId)

    res.json({ executions, total: executions.length })
  } catch (error: any) {
    console.error('Error fetching phase executions:', error)
    res.status(500).json({ error: error.message || 'Failed to fetch phase executions' })
  }
})

/**
 * POST /api/task-executions/:id/feedback
 * Submit user feedback on a task
 */
router.post('/:id/feedback', async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const { approved, feedback } = req.body

    if (typeof approved !== 'boolean') {
      return res.status(400).json({ error: 'approved field must be a boolean' })
    }

    if (!approved && !feedback) {
      return res.status(400).json({ error: 'feedback is required when not approving' })
    }

    await TaskOrchestrator.submitUserFeedback(id, approved, feedback)

    const state = TaskOrchestrator.getExecutionState(id)

    res.json(state)
  } catch (error: any) {
    console.error('Error submitting feedback:', error)
    res.status(500).json({ error: error.message || 'Failed to submit feedback' })
  }
})

/**
 * POST /api/task-executions/:id/advance
 * Manually advance to next discussion round
 * (For testing or forcing progress)
 */
router.post('/:id/advance', async (req: Request, res: Response) => {
  try {
    const { id } = req.params

    await TaskOrchestrator.processRound(id)

    const state = TaskOrchestrator.getExecutionState(id)

    res.json(state)
  } catch (error: any) {
    console.error('Error advancing round:', error)
    res.status(500).json({ error: error.message || 'Failed to advance round' })
  }
})

export default router
