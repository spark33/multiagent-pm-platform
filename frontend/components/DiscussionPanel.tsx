"use client"

import { DiscussionMessage, Deliverable, ApprovalStatus } from "@/types/task-execution"
import { useState } from "react"

interface DiscussionPanelProps {
  messages: DiscussionMessage[]
  messagesByRound: Record<number, DiscussionMessage[]>
  currentRound: number
  deliverables: Deliverable[]
  onSubmitFeedback?: (approved: boolean, feedback?: string) => Promise<void>
  awaitingUserFeedback: boolean
}

export default function DiscussionPanel({
  messages,
  messagesByRound,
  currentRound,
  deliverables,
  onSubmitFeedback,
  awaitingUserFeedback
}: DiscussionPanelProps) {
  const [userFeedback, setUserFeedback] = useState("")
  const [submitting, setSubmitting] = useState(false)

  const handleApprove = async () => {
    if (!onSubmitFeedback) return
    setSubmitting(true)
    try {
      await onSubmitFeedback(true)
    } finally {
      setSubmitting(false)
    }
  }

  const handleRequestChanges = async () => {
    if (!onSubmitFeedback || !userFeedback.trim()) return
    setSubmitting(true)
    try {
      await onSubmitFeedback(false, userFeedback)
      setUserFeedback("")
    } finally {
      setSubmitting(false)
    }
  }

  const getApprovalBadge = (status?: ApprovalStatus) => {
    if (!status) return null

    const styles = {
      approved: "bg-green-100 text-green-800 border-green-200",
      has_concerns: "bg-yellow-100 text-yellow-800 border-yellow-200",
      pending: "bg-gray-100 text-gray-800 border-gray-200"
    }

    const labels = {
      approved: "Approved",
      has_concerns: "Has Concerns",
      pending: "Pending"
    }

    return (
      <span className={`px-2 py-1 text-xs rounded-full border ${styles[status]}`}>
        {labels[status]}
      </span>
    )
  }

  const getMessageTypeIcon = (type: DiscussionMessage['messageType']) => {
    const icons = {
      initial_review: "🔍",
      response: "💬",
      revision: "✏️",
      question: "❓",
      approval: "✅",
      concern: "⚠️",
      user_feedback: "👤"
    }
    return icons[type] || "📝"
  }

  const latestDeliverable = deliverables.length > 0
    ? deliverables[deliverables.length - 1]
    : null

  return (
    <div className="space-y-6">
      {/* Current Deliverable */}
      {latestDeliverable && (
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Current Deliverable (v{latestDeliverable.version})
            </h3>
            <span className="text-sm text-gray-500">
              {new Date(latestDeliverable.createdAt).toLocaleString()}
            </span>
          </div>
          <div className="prose prose-sm max-w-none">
            <div className="bg-gray-50 rounded-lg p-4 whitespace-pre-wrap">
              {latestDeliverable.content}
            </div>
          </div>
        </div>
      )}

      {/* Discussion by Rounds */}
      <div className="space-y-6">
        <h3 className="text-lg font-semibold text-gray-900">
          Discussion (Round {currentRound} of 7)
        </h3>

        {Object.keys(messagesByRound).length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No discussion messages yet. Agents are working...
          </div>
        ) : (
          Object.keys(messagesByRound)
            .map(Number)
            .sort((a, b) => a - b)
            .map(round => (
              <div key={round} className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="h-px flex-1 bg-gray-200" />
                  <span className="text-sm font-medium text-gray-600 px-3">
                    Round {round}
                  </span>
                  <div className="h-px flex-1 bg-gray-200" />
                </div>

                {messagesByRound[round].map(message => (
                  <div
                    key={message.id}
                    className={`border rounded-lg p-4 ${
                      message.agentId === 'user'
                        ? 'bg-blue-50 border-blue-200'
                        : 'bg-white border-gray-200'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">
                          {getMessageTypeIcon(message.messageType)}
                        </span>
                        <div>
                          <div className="font-semibold text-gray-900">
                            {message.agentName}
                          </div>
                          <div className="text-xs text-gray-500">
                            {message.agentRole}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {message.approvalStatus && getApprovalBadge(message.approvalStatus)}
                        <span className="text-xs text-gray-500">
                          {new Date(message.timestamp).toLocaleTimeString()}
                        </span>
                      </div>
                    </div>
                    <div className="prose prose-sm max-w-none text-gray-700 whitespace-pre-wrap">
                      {message.content}
                    </div>
                  </div>
                ))}
              </div>
            ))
        )}
      </div>

      {/* User Feedback Section */}
      {awaitingUserFeedback && onSubmitFeedback && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Your Review Needed
          </h3>
          <p className="text-sm text-gray-700 mb-4">
            The agents have reached consensus. Please review the deliverable and either approve it or provide feedback for further refinement.
          </p>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Feedback (optional if approving, required if requesting changes)
              </label>
              <textarea
                value={userFeedback}
                onChange={(e) => setUserFeedback(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={4}
                placeholder="Provide specific feedback on what needs to be changed..."
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleApprove}
                disabled={submitting}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
              >
                {submitting ? "Submitting..." : "✓ Approve & Complete"}
              </button>
              <button
                onClick={handleRequestChanges}
                disabled={submitting || !userFeedback.trim()}
                className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
              >
                {submitting ? "Submitting..." : "Request Changes"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
