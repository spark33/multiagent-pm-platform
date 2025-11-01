"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { AgentForm, type AgentFormData } from "@/components/agents/agent-form"

export default function NewAgentPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (data: AgentFormData) => {
    setIsLoading(true)

    try {
      const response = await fetch("/api/agents", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Failed to create agent")
      }

      const newAgent = await response.json()
      console.log("Agent created:", newAgent)

      // Navigate back to agents list
      router.push("/agents")
    } catch (error) {
      console.error("Failed to create agent:", error)
      alert(`Failed to create agent: ${error instanceof Error ? error.message : "Unknown error"}`)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancel = () => {
    router.push("/agents")
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-4xl p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Create New Agent</h1>
          <p className="mt-2 text-muted-foreground">
            Configure a new AI agent with specific capabilities and behavior
          </p>
        </div>

        <AgentForm
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          submitLabel="Create Agent"
          isLoading={isLoading}
        />
      </div>
    </div>
  )
}
