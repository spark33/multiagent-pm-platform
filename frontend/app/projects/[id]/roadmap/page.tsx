"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { PhaseCard } from "@/components/roadmap/phase-card"
import { GanttChart } from "@/components/roadmap/gantt-chart"
import type { Project } from "@/lib/types/project"

export default function RoadmapPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [project, setProject] = useState<Project | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [resolvedParams, setResolvedParams] = useState<{ id: string } | null>(null)
  const [hasAutoStarted, setHasAutoStarted] = useState(false)

  useEffect(() => {
    params.then(setResolvedParams)
  }, [params])

  useEffect(() => {
    if (resolvedParams) {
      fetchProject()
    }
  }, [resolvedParams])

  const fetchProject = async () => {
    if (!resolvedParams) return

    try {
      setIsLoading(true)
      const response = await fetch(`/api/projects/${resolvedParams.id}`)

      if (!response.ok) {
        throw new Error("Failed to load project")
      }

      const data = await response.json()
      setProject(data)

      // Auto-start first phase if autostart parameter is present
      const shouldAutoStart = searchParams.get('autostart') === 'true'
      if (shouldAutoStart && !hasAutoStarted && data.roadmap?.phases?.length > 0) {
        const firstPhase = data.roadmap.phases[0]
        if (firstPhase.status === 'pending') {
          setHasAutoStarted(true)
          await startPhase(firstPhase.id)
        }
      }
    } catch (error) {
      console.error("Error loading project:", error)
      setProject(null)
    } finally {
      setIsLoading(false)
    }
  }

  const startPhase = async (phaseId: string) => {
    if (!resolvedParams) return

    try {
      const response = await fetch(`/api/projects/${resolvedParams.id}/phases/${phaseId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: 'in_progress' }),
      })

      if (!response.ok) {
        throw new Error('Failed to start phase')
      }

      const data = await response.json()

      // Update local state with the new project data
      if (data.project) {
        setProject(data.project)
      }

      console.log(`Phase started: ${phaseId}`)
    } catch (error) {
      console.error("Error starting phase:", error)
    }
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <p className="text-muted-foreground">Loading roadmap...</p>
      </div>
    )
  }

  if (!project || !project.roadmap) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Card className="p-8">
          <p className="mb-4 text-muted-foreground">
            {!project ? "Project not found" : "No roadmap generated yet"}
          </p>
          <Link href="/">
            <Button>Back to Home</Button>
          </Link>
        </Card>
      </div>
    )
  }

  const { roadmap } = project
  const totalTasks = roadmap.phases.reduce((sum, phase) => sum + phase.tasks.length, 0)
  const completedTasks = roadmap.phases.reduce(
    (sum, phase) => sum + phase.tasks.filter(t => t.status === "completed").length,
    0
  )
  const inProgressPhases = roadmap.phases.filter(p => p.status === "in_progress").length
  const completedPhases = roadmap.phases.filter(p => p.status === "completed").length

  return (
    <div className="min-h-screen bg-background">
      {/* Page Header */}
      <div className="border-b bg-background px-8 py-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">{project.title}</h1>
            <div className="mt-1 flex items-center gap-2">
              <Badge>{project.status}</Badge>
              <span className="text-sm text-muted-foreground">Project Roadmap</span>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" asChild>
              <Link href={`/projects/${project.id}/chat`}>
                View Discovery Chat
              </Link>
            </Button>
          </div>
        </div>
      </div>

      <div className="w-full pt-8">
        {/* Project Context */}
        {project.context && Object.keys(project.context).length > 0 && (
          <div className="mb-8 px-8">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Project Context</CardTitle>
              </CardHeader>
              <CardContent className="grid md:grid-cols-2 gap-4">
                {project.context.targetAudience && (
                  <div>
                    <h4 className="text-sm font-medium mb-1">Target Audience</h4>
                    <p className="text-sm text-muted-foreground">{project.context.targetAudience}</p>
                  </div>
                )}
                {project.context.problemStatement && (
                  <div>
                    <h4 className="text-sm font-medium mb-1">Problem Statement</h4>
                    <p className="text-sm text-muted-foreground">{project.context.problemStatement}</p>
                  </div>
                )}
                {project.context.valueProposition && (
                  <div>
                    <h4 className="text-sm font-medium mb-1">Value Proposition</h4>
                    <p className="text-sm text-muted-foreground">{project.context.valueProposition}</p>
                  </div>
                )}
                {project.context.goals && project.context.goals.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium mb-1">Goals</h4>
                    <ul className="space-y-1">
                      {project.context.goals.map((goal, idx) => (
                        <li key={idx} className="text-sm text-muted-foreground flex items-start gap-2">
                          <span className="text-primary">•</span>
                          <span>{goal}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {/* Gantt Chart */}
        <div className="px-8">
          <h2 className="text-xl font-bold mb-4">Execution Timeline</h2>
          <div className="border rounded-lg overflow-hidden bg-card">
            <GanttChart phases={roadmap.phases} />
          </div>
        </div>
      </div>
    </div>
  )
}
