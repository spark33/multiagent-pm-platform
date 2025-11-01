"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { Agent } from "@/lib/types/agent"

export default function AgentsPage() {
  const [agents, setAgents] = useState<Agent[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchAgents()
  }, [])

  const fetchAgents = async () => {
    try {
      setIsLoading(true)
      const response = await fetch("/api/agents")

      if (!response.ok) {
        throw new Error("Failed to fetch agents")
      }

      const data = await response.json()
      setAgents(data.agents)
    } catch (err) {
      console.error("Error fetching agents:", err)
      setError(err instanceof Error ? err.message : "Unknown error")
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="mx-auto max-w-7xl p-8">
          <div className="text-center">
            <p className="text-muted-foreground">Loading agents...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <div className="mx-auto max-w-7xl p-8">
          <Card>
            <CardHeader>
              <CardTitle>Error</CardTitle>
              <CardDescription>{error}</CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={fetchAgents}>Retry</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl p-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Agents</h1>
            <p className="mt-2 text-muted-foreground">
              Manage your AI agents and their configurations
            </p>
          </div>
          <Link href="/agents/new">
            <Button>Create New Agent</Button>
          </Link>
        </div>

        {agents.length === 0 ? (
          <Card>
            <CardHeader>
              <CardTitle>No agents yet</CardTitle>
              <CardDescription>
                Get started by creating your first AI agent
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/agents/new">
                <Button variant="outline">Create Agent</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {agents.map((agent) => (
              <Card key={agent.id} className="flex flex-col">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="line-clamp-1">{agent.name}</CardTitle>
                      <CardDescription className="line-clamp-1">
                        {agent.role}
                      </CardDescription>
                    </div>
                    <Badge variant="outline" className="ml-2">
                      {agent.llmProvider}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="flex-1 space-y-4">
                  <div>
                    <p className="text-sm font-medium">Goal</p>
                    <p className="line-clamp-2 text-sm text-muted-foreground">
                      {agent.goal}
                    </p>
                  </div>

                  {agent.tools.length > 0 && (
                    <div>
                      <p className="mb-2 text-sm font-medium">Tools</p>
                      <div className="flex flex-wrap gap-1">
                        {agent.tools.slice(0, 3).map((tool) => (
                          <Badge key={tool} variant="secondary" className="text-xs">
                            {tool}
                          </Badge>
                        ))}
                        {agent.tools.length > 3 && (
                          <Badge variant="secondary" className="text-xs">
                            +{agent.tools.length - 3}
                          </Badge>
                        )}
                      </div>
                    </div>
                  )}

                  <div className="flex gap-2 pt-4">
                    <Link href={`/agents/${agent.id}`} className="flex-1">
                      <Button variant="outline" className="w-full">
                        View Details
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
