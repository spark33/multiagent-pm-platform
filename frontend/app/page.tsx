"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"

const EXAMPLE_PROJECTS = [
  {
    title: "AI Recipe App",
    description: "A mobile app that suggests recipes based on ingredients you have at home",
  },
  {
    title: "SaaS Analytics Dashboard",
    description: "Real-time analytics platform for e-commerce businesses",
  },
  {
    title: "Fitness Coaching Platform",
    description: "Connect personal trainers with clients for virtual coaching",
  },
]

export default function Home() {
  const router = useRouter()
  const [projectDescription, setProjectDescription] = useState("")
  const [isCreating, setIsCreating] = useState(false)
  const [recentProjects, setRecentProjects] = useState<any[]>([])

  useEffect(() => {
    fetchRecentProjects()
  }, [])

  const fetchRecentProjects = async () => {
    try {
      const response = await fetch("/api/projects")
      if (response.ok) {
        const data = await response.json()
        setRecentProjects(data.projects.slice(0, 3))
      }
    } catch (error) {
      console.error("Error fetching projects:", error)
    }
  }

  const handleCreateProject = async () => {
    if (!projectDescription.trim()) return

    setIsCreating(true)
    try {
      console.log("Creating project with description:", projectDescription)

      const response = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ description: projectDescription }),
      })

      console.log("Response status:", response.status)

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        console.error("Error response:", errorData)
        throw new Error(errorData.error || "Failed to create project")
      }

      const project = await response.json()
      console.log("Project created:", project)

      router.push(`/projects/${project.id}/chat`)
    } catch (error) {
      console.error("Error creating project:", error)
      alert(`Failed to create project: ${error instanceof Error ? error.message : "Unknown error"}`)
    } finally {
      setIsCreating(false)
    }
  }

  const handleExampleClick = (description: string) => {
    setProjectDescription(description)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
      handleCreateProject()
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-4xl px-8 py-16">
        {/* Hero Section */}
        <div className="mb-12 text-center">
          <h1 className="text-5xl font-bold tracking-tight">
            What would you like to build?
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Describe your project idea and I'll help you develop a comprehensive plan
          </p>
        </div>

        {/* Main Input */}
        <Card className="mb-8">
          <CardContent className="pt-6">
            <Textarea
              placeholder="e.g., A mobile app that helps people learn languages through daily conversations with AI tutors..."
              value={projectDescription}
              onChange={(e) => setProjectDescription(e.target.value)}
              onKeyDown={handleKeyDown}
              rows={6}
              className="mb-4 text-base"
            />
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                Press <kbd className="rounded bg-muted px-2 py-1 text-xs">⌘ Enter</kbd> to start
              </p>
              <Button
                onClick={handleCreateProject}
                disabled={!projectDescription.trim() || isCreating}
                size="lg"
              >
                {isCreating ? "Starting..." : "Start Project"}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Example Projects */}
        <div className="mb-12">
          <p className="mb-4 text-sm font-medium text-muted-foreground">
            Or try one of these examples:
          </p>
          <div className="grid gap-4 md:grid-cols-3">
            {EXAMPLE_PROJECTS.map((example, index) => (
              <Card
                key={index}
                className="cursor-pointer transition-colors hover:bg-accent"
                onClick={() => handleExampleClick(example.description)}
              >
                <CardHeader>
                  <CardTitle className="text-base">{example.title}</CardTitle>
                  <CardDescription className="text-sm">
                    {example.description}
                  </CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>

        {/* Recent Projects */}
        {recentProjects.length > 0 && (
          <div>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-semibold">Recent Projects</h2>
              <Link href="/projects">
                <Button variant="ghost" size="sm">
                  View All →
                </Button>
              </Link>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              {recentProjects.map((project) => {
                // Link to roadmap if available, otherwise to chat
                const projectHref = project.roadmap
                  ? `/projects/${project.id}/roadmap`
                  : `/projects/${project.id}/chat`

                return (
                  <Link key={project.id} href={projectHref}>
                    <Card className="cursor-pointer transition-colors hover:bg-accent">
                      <CardHeader>
                        <CardTitle className="line-clamp-1 text-base">{project.title}</CardTitle>
                        <CardDescription className="line-clamp-2 text-sm">
                          {project.description}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center justify-between">
                          <Badge variant="secondary">{project.status}</Badge>
                          {project.roadmap && (
                            <span className="text-xs text-muted-foreground">
                              {project.roadmap.phases.length} phases
                            </span>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                )
              })}
            </div>
          </div>
        )}

        {/* Footer Links */}
        <div className="mt-12 flex justify-center gap-6 text-sm text-muted-foreground">
          <Link href="/agents" className="hover:text-foreground">
            Agent Configuration
          </Link>
          <Link href="/design-system" className="hover:text-foreground">
            Design System
          </Link>
        </div>
      </div>
    </div>
  )
}
