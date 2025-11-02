import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import type { Phase, Task } from "@/lib/types/project"

interface PhaseCardProps {
  phase: Phase
  projectId: string
  isFirst?: boolean
  isLast?: boolean
}

const statusColors = {
  completed: "bg-green-500",
  in_progress: "bg-blue-500",
  pending: "bg-gray-300",
}

const statusLabels = {
  completed: "Completed",
  in_progress: "In Progress",
  pending: "Pending",
}

const priorityColors = {
  high: "destructive",
  medium: "default",
  low: "secondary",
} as const

export function PhaseCard({ phase, projectId, isFirst, isLast }: PhaseCardProps) {
  const completedTasks = phase.tasks.filter(t => t.status === "completed").length
  const totalTasks = phase.tasks.length
  const progressPercentage = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0

  return (
    <div className="relative">
      {/* Timeline connector line */}
      {!isLast && (
        <div className="absolute left-6 top-20 bottom-0 w-0.5 bg-border -mb-8" />
      )}

      <div className="flex gap-6">
        {/* Timeline dot */}
        <div className="flex flex-col items-center flex-shrink-0">
          <div className={`w-12 h-12 rounded-full ${statusColors[phase.status]} flex items-center justify-center text-white font-medium z-10`}>
            {phase.status === "completed" ? "✓" : completedTasks}
          </div>
        </div>

        {/* Phase content */}
        <div className="flex-1 pb-8">
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <CardTitle className="text-lg">{phase.title}</CardTitle>
                    <Badge variant={phase.status === "completed" ? "default" : phase.status === "in_progress" ? "outline" : "secondary"}>
                      {statusLabels[phase.status]}
                    </Badge>
                  </div>
                  <CardDescription>{phase.description}</CardDescription>
                </div>
              </div>
            </CardHeader>

            <CardContent>
              {/* Objective */}
              <div className="mb-4">
                <h4 className="text-sm font-medium mb-1">Objective</h4>
                <p className="text-sm text-muted-foreground">{phase.objective}</p>
              </div>

              {/* Progress bar */}
              {totalTasks > 0 && (
                <div className="mb-4">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-muted-foreground">Tasks Progress</span>
                    <span className="font-medium">{completedTasks}/{totalTasks} completed</span>
                  </div>
                  <div className="h-2 bg-secondary rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary transition-all"
                      style={{ width: `${progressPercentage}%` }}
                    />
                  </div>
                </div>
              )}

              <Separator className="my-4" />

              {/* Tasks */}
              {totalTasks > 0 && (
                <div>
                  <h4 className="text-sm font-medium mb-3">Tasks ({totalTasks})</h4>
                  <div className="space-y-2">
                    {phase.tasks.map((task) => (
                      <TaskItem key={task.id} task={task} projectId={projectId} phaseId={phase.id} />
                    ))}
                  </div>
                </div>
              )}

              {/* Deliverables */}
              {phase.deliverables && phase.deliverables.length > 0 && (
                <>
                  <Separator className="my-4" />
                  <div>
                    <h4 className="text-sm font-medium mb-2">Key Deliverables</h4>
                    <ul className="space-y-1">
                      {phase.deliverables.map((deliverable, idx) => (
                        <li key={idx} className="text-sm text-muted-foreground flex items-start gap-2">
                          <span className="text-primary mt-0.5">•</span>
                          <span>{deliverable}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

function TaskItem({ task, projectId, phaseId }: { task: Task; projectId: string; phaseId: string }) {
  const router = useRouter()

  const handleStartTask = async (e: React.MouseEvent) => {
    e.stopPropagation()

    try {
      // Create task execution
      const response = await fetch('/api/task-executions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          taskId: task.id,
          phaseId: phaseId,
          projectId: projectId
        })
      })

      if (!response.ok) {
        throw new Error('Failed to start task execution')
      }

      const execution = await response.json()

      // Navigate to task execution page
      router.push(`/projects/${projectId}/tasks/${task.id}`)
    } catch (error) {
      console.error('Error starting task:', error)
      alert('Failed to start task execution')
    }
  }

  const handleViewTask = () => {
    if (task.status === 'in_progress' || task.status === 'completed') {
      router.push(`/projects/${projectId}/tasks/${task.id}`)
    }
  }

  return (
    <div
      className={`p-3 rounded-lg border bg-card transition-colors ${
        task.status === "completed" ? "opacity-75" : ""
      } ${task.status !== "pending" ? "cursor-pointer hover:bg-accent/50" : ""}`}
      onClick={handleViewTask}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            {task.status === "completed" && (
              <div className="w-4 h-4 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0">
                <span className="text-white text-xs">✓</span>
              </div>
            )}
            {task.status === "in_progress" && (
              <div className="w-4 h-4 rounded-full bg-blue-500 animate-pulse flex-shrink-0" />
            )}
            {task.status === "pending" && (
              <div className="w-4 h-4 rounded-full border-2 border-gray-300 flex-shrink-0" />
            )}
            <h5 className="text-sm font-medium truncate">{task.title}</h5>
            <Badge variant={priorityColors[task.priority]} className="text-xs">
              {task.priority}
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground line-clamp-2">{task.description}</p>

          {task.assignedAgent && (
            <div className="flex items-center gap-3 mt-2 text-xs">
              <span className="text-muted-foreground">
                <span className="font-medium text-foreground">{task.assignedAgent}</span>
                {task.agentRole && ` • ${task.agentRole}`}
              </span>
            </div>
          )}
        </div>

        {/* Start Task Button */}
        {task.status === "pending" && (
          <Button
            size="sm"
            onClick={handleStartTask}
            className="flex-shrink-0"
          >
            Start Task
          </Button>
        )}

        {task.status === "in_progress" && (
          <Button
            size="sm"
            variant="outline"
            className="flex-shrink-0"
          >
            View Progress
          </Button>
        )}
      </div>

      {/* Deliverables for task */}
      {task.deliverables && task.deliverables.length > 0 && (
        <div className="mt-2 pt-2 border-t">
          <p className="text-xs font-medium text-muted-foreground mb-1">Deliverables:</p>
          <div className="flex flex-wrap gap-1">
            {task.deliverables.map((deliverable, idx) => (
              <Badge key={idx} variant="outline" className="text-xs">
                {deliverable}
              </Badge>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
