"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import type { Phase, Task } from "@/lib/types/project"

interface GanttChartProps {
  phases: Phase[]
}

const statusColors = {
  completed: "bg-green-500",
  in_progress: "bg-blue-500",
  pending: "bg-gray-300",
}

const statusLabels = {
  completed: "✓",
  in_progress: "●",
  pending: "",
}

const priorityColors = {
  high: "destructive",
  medium: "default",
  low: "secondary",
} as const

export function GanttChart({ phases }: GanttChartProps) {
  const [selectedTask, setSelectedTask] = useState<{ task: Task; phase: Phase } | null>(null)

  // Build dependency map
  const taskMap = new Map<string, { task: Task; phase: Phase }>()
  phases.forEach(phase => {
    phase.tasks.forEach(task => {
      taskMap.set(task.id, { task, phase })
    })
  })

  // Calculate task levels based on dependencies
  const calculateTaskLevel = (taskId: string, visited = new Set<string>()): number => {
    if (visited.has(taskId)) return 0 // Circular dependency protection
    visited.add(taskId)

    const taskData = taskMap.get(taskId)
    if (!taskData || !taskData.task.dependencies || taskData.task.dependencies.length === 0) {
      return 0
    }

    const maxDependencyLevel = Math.max(
      ...taskData.task.dependencies.map(depId => calculateTaskLevel(depId, visited))
    )
    return maxDependencyLevel + 1
  }

  // Group tasks by level within each phase
  const phaseColumns = phases.map(phase => {
    const tasksWithLevels = phase.tasks.map(task => ({
      task,
      level: calculateTaskLevel(task.id),
    }))

    // Group by level
    const maxLevel = Math.max(...tasksWithLevels.map(t => t.level), 0)
    const columns: Task[][] = Array.from({ length: maxLevel + 1 }, () => [])

    tasksWithLevels.forEach(({ task, level }) => {
      columns[level].push(task)
    })

    return {
      phase,
      columns,
      maxLevel,
    }
  })

  const maxRowsInAnyPhase = Math.max(...phaseColumns.flatMap(pc => pc.columns.map(col => col.length)), 1)

  return (
    <div className="flex">
      {/* Main Gantt Chart */}
      <div className={`flex-1 overflow-x-auto transition-all ${selectedTask ? 'mr-0' : ''}`}>
        <div className="min-w-max">
          {/* Phase Header - scrolls horizontally with content */}
          <div className="sticky top-0 z-10 bg-background border-b shadow-sm">
            <div className="flex">
          {phases.map((phase, idx) => {
            const completedTasks = phase.tasks.filter(t => t.status === "completed").length
            const totalTasks = phase.tasks.length
            const progressPercentage = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0

            return (
              <div
                key={phase.id}
                className="flex-shrink-0 border-r last:border-r-0 px-4 py-3"
                style={{ width: `${(phaseColumns[idx].maxLevel + 1) * 200}px` }}
              >
                <div className="flex items-center gap-2 mb-1">
                  <div className={`w-5 h-5 rounded-full ${statusColors[phase.status]} flex items-center justify-center text-white text-xs font-bold flex-shrink-0`}>
                    {statusLabels[phase.status] || (idx + 1)}
                  </div>
                  <h3 className="font-semibold text-sm">{phase.title}</h3>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">{completedTasks}/{totalTasks} tasks</span>
                  <div className="h-1 w-16 bg-secondary rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary transition-all"
                      style={{ width: `${progressPercentage}%` }}
                    />
                  </div>
                </div>
              </div>
            )
          })}
            </div>
          </div>

          {/* Gantt Chart Body */}
          <div className="flex">
            {phaseColumns.map(({ phase, columns, maxLevel }, phaseIdx) => (
              <div
                key={phase.id}
                className="flex-shrink-0 border-r last:border-r-0"
                style={{ width: `${(maxLevel + 1) * 200}px` }}
              >
                <div className="flex">
                  {columns.map((columnTasks, columnIdx) => (
                    <div
                      key={columnIdx}
                      className="flex-shrink-0 p-3 space-y-2"
                      style={{ width: '200px' }}
                    >
                      {columnTasks.map((task, taskIdx) => {
                        const hasDependencies = task.dependencies && task.dependencies.length > 0

                        return (
                          <div key={task.id} className="relative">
                            {/* Dependency arrow indicator */}
                            {hasDependencies && columnIdx > 0 && (
                              <div className="absolute -left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-xs">
                                →
                              </div>
                            )}

                            <MinimalTaskCard
                              task={task}
                              onClick={() => setSelectedTask({ task, phase })}
                              isSelected={selectedTask?.task.id === task.id}
                            />
                          </div>
                        )
                      })}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Sidebar */}
      {selectedTask && (
        <TaskDetailSidebar
          task={selectedTask.task}
          phase={selectedTask.phase}
          onClose={() => setSelectedTask(null)}
        />
      )}
    </div>
  )
}

function MinimalTaskCard({ task, onClick, isSelected }: { task: Task; onClick: () => void; isSelected: boolean }) {
  return (
    <button
      onClick={onClick}
      className={`w-full text-left p-2 rounded border transition-all hover:shadow-md hover:border-primary ${
        task.status === "completed" ? "opacity-75" : ""
      } ${
        isSelected ? "border-primary bg-primary/5" : "bg-card"
      }`}
    >
      <div className="flex items-start gap-2">
        {task.status === "completed" && (
          <div className="w-4 h-4 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0 mt-0.5">
            <span className="text-white text-[10px]">✓</span>
          </div>
        )}
        {task.status === "in_progress" && (
          <div className="w-4 h-4 rounded-full bg-blue-500 animate-pulse flex-shrink-0 mt-0.5" />
        )}
        {task.status === "pending" && (
          <div className="w-4 h-4 rounded-full border-2 border-gray-300 flex-shrink-0 mt-0.5" />
        )}

        <div className="flex-1 min-w-0">
          <p className="text-xs font-medium line-clamp-2 mb-1">{task.title}</p>
          {task.assignedAgent && (
            <p className="text-[10px] text-muted-foreground truncate">{task.assignedAgent}</p>
          )}
        </div>
      </div>
    </button>
  )
}

function TaskDetailSidebar({ task, phase, onClose }: { task: Task; phase: Phase; onClose: () => void }) {
  return (
    <div className="w-96 border-l bg-card flex-shrink-0 overflow-y-auto">
      <div className="sticky top-0 bg-card border-b p-4 flex items-center justify-between z-10">
        <h3 className="font-semibold">Task Details</h3>
        <Button variant="ghost" size="sm" onClick={onClose}>✕</Button>
      </div>

      <div className="p-4 space-y-4">
        {/* Status */}
        <div className="flex items-center gap-2">
          {task.status === "completed" && (
            <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center">
              <span className="text-white text-xs">✓</span>
            </div>
          )}
          {task.status === "in_progress" && (
            <div className="w-6 h-6 rounded-full bg-blue-500 animate-pulse" />
          )}
          {task.status === "pending" && (
            <div className="w-6 h-6 rounded-full border-2 border-gray-300" />
          )}
          <span className="text-sm font-medium capitalize">{task.status.replace('_', ' ')}</span>
        </div>

        <Separator />

        {/* Title and Priority */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <h4 className="font-semibold">{task.title}</h4>
            <Badge variant={priorityColors[task.priority]}>{task.priority}</Badge>
          </div>
          <p className="text-sm text-muted-foreground">{task.description}</p>
        </div>

        <Separator />

        {/* Phase */}
        <div>
          <p className="text-xs font-medium text-muted-foreground mb-1">Phase</p>
          <p className="text-sm font-medium">{phase.title}</p>
        </div>

        {/* Agent */}
        {task.assignedAgent && (
          <div>
            <p className="text-xs font-medium text-muted-foreground mb-1">Assigned Agent</p>
            <p className="text-sm font-medium">{task.assignedAgent}</p>
            {task.agentRole && (
              <p className="text-xs text-muted-foreground">{task.agentRole}</p>
            )}
          </div>
        )}

        {/* Deliverables */}
        {task.deliverables && task.deliverables.length > 0 && (
          <div>
            <p className="text-xs font-medium text-muted-foreground mb-2">Deliverables</p>
            <div className="space-y-1">
              {task.deliverables.map((deliverable, idx) => (
                <div key={idx} className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span className="text-sm flex-1">{deliverable}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Dependencies */}
        {task.dependencies && task.dependencies.length > 0 && (
          <div>
            <p className="text-xs font-medium text-muted-foreground mb-2">Dependencies</p>
            <div className="space-y-1">
              {task.dependencies.map((depId, idx) => (
                <div key={idx} className="text-xs bg-muted px-2 py-1 rounded">
                  Task ID: {depId}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
