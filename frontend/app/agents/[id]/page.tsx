"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import type { Agent } from "@/lib/types/agent"

export default function AgentDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter()
  const [agent, setAgent] = useState<Agent | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [resolvedParams, setResolvedParams] = useState<{ id: string } | null>(null)

  useEffect(() => {
    params.then(setResolvedParams)
  }, [params])

  useEffect(() => {
    if (resolvedParams) {
      fetchAgent()
    }
  }, [resolvedParams])

  const fetchAgent = async () => {
    if (!resolvedParams) return

    try {
      setIsLoading(true)
      const response = await fetch(`/api/agents/${resolvedParams.id}`)

      if (!response.ok) {
        throw new Error("Agent not found")
      }

      const data = await response.json()
      setAgent(data)
    } catch (err) {
      console.error("Error fetching agent:", err)
      setError(err instanceof Error ? err.message : "Unknown error")
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!resolvedParams || !agent) return

    if (!confirm(`Are you sure you want to delete "${agent.name}"? This action cannot be undone.`)) {
      return
    }

    try {
      setIsDeleting(true)
      const response = await fetch(`/api/agents/${resolvedParams.id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Failed to delete agent")
      }

      router.push("/agents")
    } catch (err) {
      console.error("Error deleting agent:", err)
      alert(`Failed to delete agent: ${err instanceof Error ? err.message : "Unknown error"}`)
    } finally {
      setIsDeleting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="mx-auto max-w-4xl p-8">
          <div className="text-center">
            <p className="text-muted-foreground">Loading agent...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error || !agent) {
    return (
      <div className="min-h-screen bg-background">
        <div className="mx-auto max-w-4xl p-8">
          <Card>
            <CardHeader>
              <CardTitle>Error</CardTitle>
              <CardDescription>{error || "Agent not found"}</CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/agents">
                <Button>Back to Agents</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-4xl p-8">
        <div className="mb-8">
          <Link href="/agents" className="text-sm text-muted-foreground hover:text-foreground">
            ← Back to Agents
          </Link>
          <div className="mt-4 flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">{agent.name}</h1>
              <p className="mt-2 text-muted-foreground">{agent.role}</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" disabled>
                Edit
              </Button>
              <Button variant="destructive" onClick={handleDelete} disabled={isDeleting}>
                {isDeleting ? "Deleting..." : "Delete"}
              </Button>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm font-medium">Goal</p>
                <p className="mt-1 text-sm text-muted-foreground">{agent.goal}</p>
              </div>

              {agent.backstory && (
                <>
                  <Separator />
                  <div>
                    <p className="text-sm font-medium">Backstory</p>
                    <p className="mt-1 text-sm text-muted-foreground">{agent.backstory}</p>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Tools */}
          <Card>
            <CardHeader>
              <CardTitle>Tools</CardTitle>
              <CardDescription>
                {agent.tools.length === 0
                  ? "No tools configured"
                  : `${agent.tools.length} tool(s) available`}
              </CardDescription>
            </CardHeader>
            {agent.tools.length > 0 && (
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {agent.tools.map((tool) => (
                    <Badge key={tool} variant="secondary">
                      {tool}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            )}
          </Card>

          {/* LLM Configuration */}
          <Card>
            <CardHeader>
              <CardTitle>LLM Configuration</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <p className="text-sm font-medium">Provider</p>
                  <p className="mt-1 text-sm text-muted-foreground capitalize">{agent.llmProvider}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Model</p>
                  <p className="mt-1 text-sm text-muted-foreground">{agent.llmModel}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Advanced Settings */}
          <Card>
            <CardHeader>
              <CardTitle>Advanced Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Allow Delegation</p>
                  <p className="text-sm text-muted-foreground">
                    Can this agent delegate tasks to other agents
                  </p>
                </div>
                <Badge variant={agent.allowDelegation ? "default" : "secondary"}>
                  {agent.allowDelegation ? "Enabled" : "Disabled"}
                </Badge>
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Verbose Output</p>
                  <p className="text-sm text-muted-foreground">
                    Show detailed execution logs
                  </p>
                </div>
                <Badge variant={agent.verbose ? "default" : "secondary"}>
                  {agent.verbose ? "Enabled" : "Disabled"}
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Metadata */}
          <Card>
            <CardHeader>
              <CardTitle>Metadata</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Agent ID</span>
                <span className="font-mono">{agent.id}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Created</span>
                <span>{new Date(agent.createdAt).toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Last Updated</span>
                <span>{new Date(agent.updatedAt).toLocaleString()}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
