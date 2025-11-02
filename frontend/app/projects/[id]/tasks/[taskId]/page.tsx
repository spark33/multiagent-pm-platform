"use client"

import { use, useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { TaskExecutionState } from "@/types/task-execution"
import DiscussionPanel from "@/components/DiscussionPanel"

interface PageProps {
  params: Promise<{
    id: string
    taskId: string
  }>
}

export default function TaskExecutionPage({ params }: PageProps) {
  const router = useRouter()
  const resolvedParams = use(params)
  const [state, setState] = useState<TaskExecutionState | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch task execution state
  const fetchState = async () => {
    try {
      const response = await fetch(`/api/task-executions/task/${resolvedParams.taskId}`)

      if (!response.ok) {
        throw new Error('Failed to fetch task execution')
      }

      const data = await response.json()
      setState(data)
      setError(null)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  // Initial fetch
  useEffect(() => {
    fetchState()
  }, [resolvedParams.taskId])

  // Polling for live updates (every 3 seconds)
  useEffect(() => {
    if (!state || state.execution.status === 'completed') return

    const interval = setInterval(fetchState, 3000)
    return () => clearInterval(interval)
  }, [state?.execution.status])

  // Submit user feedback
  const handleSubmitFeedback = async (approved: boolean, feedback?: string) => {
    if (!state) return

    try {
      const response = await fetch(`/api/task-executions/${state.execution.id}/feedback`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ approved, feedback })
      })

      if (!response.ok) {
        throw new Error('Failed to submit feedback')
      }

      const updatedState = await response.json()
      setState(updatedState)

      // If approved, navigate back to roadmap
      if (approved) {
        router.push(`/projects/${resolvedParams.id}/roadmap`)
      }
    } catch (err: any) {
      alert(`Error: ${err.message}`)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading task execution...</p>
        </div>
      </div>
    )
  }

  if (error || !state) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error || 'Task execution not found'}</p>
          <button
            onClick={() => router.back()}
            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
          >
            Go Back
          </button>
        </div>
      </div>
    )
  }

  const getStatusBadge = () => {
    const styles = {
      pending: "bg-gray-100 text-gray-800",
      in_progress: "bg-blue-100 text-blue-800",
      under_discussion: "bg-purple-100 text-purple-800",
      awaiting_consensus: "bg-yellow-100 text-yellow-800",
      awaiting_user: "bg-orange-100 text-orange-800",
      completed: "bg-green-100 text-green-800"
    }

    const labels = {
      pending: "Pending",
      in_progress: "In Progress",
      under_discussion: "Under Discussion",
      awaiting_consensus: "Awaiting Consensus",
      awaiting_user: "Awaiting Your Review",
      completed: "Completed"
    }

    return (
      <span className={`px-3 py-1 rounded-full text-sm font-medium ${styles[state.execution.status]}`}>
        {labels[state.execution.status]}
      </span>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <button
                onClick={() => router.push(`/projects/${resolvedParams.id}/roadmap`)}
                className="text-sm text-gray-600 hover:text-gray-900 mb-2 flex items-center gap-1"
              >
                ← Back to Roadmap
              </button>
              <h1 className="text-2xl font-bold text-gray-900">Task Execution</h1>
              <p className="text-sm text-gray-500 mt-1">
                Task ID: {state.execution.taskId}
              </p>
            </div>
            <div className="flex items-center gap-4">
              {getStatusBadge()}
              {state.execution.status !== 'completed' && (
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <div className="animate-pulse w-2 h-2 bg-blue-600 rounded-full"></div>
                  Live Updates
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Progress Info */}
        <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <div className="text-sm text-gray-600 mb-1">Primary Agent</div>
              <div className="font-semibold text-gray-900">{state.execution.primaryAgentId}</div>
            </div>
            <div>
              <div className="text-sm text-gray-600 mb-1">Reviewers</div>
              <div className="font-semibold text-gray-900">
                {state.execution.reviewerAgentIds.length} agents
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-600 mb-1">Discussion Round</div>
              <div className="font-semibold text-gray-900">
                {state.execution.currentRound} / {state.execution.maxRounds}
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mt-6">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Progress</span>
              <span>{Math.round((state.execution.currentRound / state.execution.maxRounds) * 100)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                style={{ width: `${(state.execution.currentRound / state.execution.maxRounds) * 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* Discussion Panel */}
        {state.discussion && (
          <DiscussionPanel
            messages={state.discussion.messages}
            messagesByRound={state.discussion.messagesByRound}
            currentRound={state.discussion.currentRound}
            deliverables={state.deliverables}
            onSubmitFeedback={handleSubmitFeedback}
            awaitingUserFeedback={state.execution.status === 'awaiting_user'}
          />
        )}

        {/* Waiting State */}
        {state.execution.status === 'in_progress' && !state.discussion?.messages.length && (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Primary agent is creating initial deliverable...</p>
          </div>
        )}
      </div>
    </div>
  )
}
