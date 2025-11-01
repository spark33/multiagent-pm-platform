"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { Project } from "@/lib/types/project"

const STATUS_LABELS: Record<Project["status"], { label: string; variant: "default" | "secondary" | "outline" }> = {
  discovery: { label: "Discovery", variant: "secondary" },
  roadmap: { label: "Roadmap Ready", variant: "outline" },
  execution: { label: "In Progress", variant: "default" },
  completed: { label: "Completed", variant: "outline" },
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchProjects()
  }, [])

  const fetchProjects = async () => {
    try {
      const response = await fetch("/api/projects")
      if (!response.ok) throw new Error("Failed to fetch projects")

      const data = await response.json()
      setProjects(data.projects)
    } catch (error) {
      console.error("Error fetching projects:", error)
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <p className="text-muted-foreground">Loading projects...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-6xl px-8 py-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">All Projects</h1>
            <p className="mt-2 text-muted-foreground">
              View and manage your project portfolio
            </p>
          </div>
          <Link href="/">
            <Button>Create New Project</Button>
          </Link>
        </div>

        {projects.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-16">
              <p className="mb-4 text-muted-foreground">No projects yet</p>
              <Link href="/">
                <Button>Start Your First Project</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {projects.map((project) => {
              const statusConfig = STATUS_LABELS[project.status]
              const hasRoadmap = !!project.roadmap
              const completedPhases = hasRoadmap
                ? project.roadmap.phases.filter(p => p.status === "completed").length
                : 0
              const totalPhases = hasRoadmap ? project.roadmap.phases.length : 0

              return (
                <Card key={project.id} className="flex flex-col hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <CardTitle className="line-clamp-2">{project.title}</CardTitle>
                        <CardDescription className="mt-2 line-clamp-2">
                          {project.description}
                        </CardDescription>
                      </div>
                    </div>
                    <div className="mt-4 flex flex-wrap gap-2">
                      <Badge variant={statusConfig.variant}>
                        {statusConfig.label}
                      </Badge>
                      {hasRoadmap && (
                        <Badge variant="outline">
                          {completedPhases}/{totalPhases} phases
                        </Badge>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="flex-1 space-y-4">
                    <div className="text-xs text-muted-foreground">
                      Updated {new Date(project.updatedAt).toLocaleDateString()}
                    </div>

                    <div className="flex gap-2">
                      {project.status === "discovery" && (
                        <Link href={`/projects/${project.id}/chat`} className="flex-1">
                          <Button variant="default" className="w-full">
                            Continue Discovery
                          </Button>
                        </Link>
                      )}
                      {project.status === "roadmap" && (
                        <Link href={`/projects/${project.id}/roadmap`} className="flex-1">
                          <Button variant="default" className="w-full">
                            View Roadmap
                          </Button>
                        </Link>
                      )}
                      {project.status === "execution" && (
                        <Link href={`/projects/${project.id}/execution`} className="flex-1">
                          <Button variant="default" className="w-full">
                            View Dashboard
                          </Button>
                        </Link>
                      )}
                      {project.status === "completed" && (
                        <Link href={`/projects/${project.id}/deliverables`} className="flex-1">
                          <Button variant="default" className="w-full">
                            View Deliverables
                          </Button>
                        </Link>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
