"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { PhaseCard } from "@/components/roadmap/phase-card"
import type { Project } from "@/lib/types/project"

export default function RoadmapPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter()
  const [project, setProject] = useState<Project | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [resolvedParams, setResolvedParams] = useState<{ id: string } | null>(null)

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
    } catch (error) {
      console.error("Error loading project:", error)
      setProject(null)
    } finally {
      setIsLoading(false)
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
      {/* Header */}
      <div className="border-b bg-background sticky top-0 z-10">
        <div className="mx-auto max-w-6xl px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <Link href="/" className="text-sm text-muted-foreground hover:text-foreground">
                ← Back to Home
              </Link>
              <h1 className="mt-2 text-2xl font-bold">{project.title}</h1>
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
      </div>

      <div className="mx-auto max-w-6xl px-8 py-8">
        {/* Roadmap Overview */}
        <div className="mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Roadmap Overview</CardTitle>
              <CardDescription>{roadmap.summary}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-6">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Phases</p>
                  <p className="text-2xl font-bold">{roadmap.phases.length}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {completedPhases} completed • {inProgressPhases} in progress
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Total Tasks</p>
                  <p className="text-2xl font-bold">{totalTasks}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {completedTasks} completed ({Math.round((completedTasks / totalTasks) * 100)}%)
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Generated</p>
                  <p className="text-sm font-medium">
                    {new Date(roadmap.generatedAt).toLocaleDateString()}
                  </p>
                  {roadmap.approvedAt && (
                    <p className="text-xs text-muted-foreground mt-1">
                      Approved {new Date(roadmap.approvedAt).toLocaleDateString()}
                    </p>
                  )}
                </div>
              </div>

              {/* Overall progress bar */}
              <Separator className="my-4" />
              <div>
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="font-medium">Overall Progress</span>
                  <span className="text-muted-foreground">
                    {completedTasks} of {totalTasks} tasks completed
                  </span>
                </div>
                <div className="h-3 bg-secondary rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary transition-all"
                    style={{ width: `${(completedTasks / totalTasks) * 100}%` }}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Project Context */}
        {project.context && Object.keys(project.context).length > 0 && (
          <div className="mb-8">
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

        {/* Timeline */}
        <div>
          <h2 className="text-xl font-bold mb-6">Execution Timeline</h2>
          <div className="space-y-0">
            {roadmap.phases.map((phase, index) => (
              <PhaseCard
                key={phase.id}
                phase={phase}
                isFirst={index === 0}
                isLast={index === roadmap.phases.length - 1}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
