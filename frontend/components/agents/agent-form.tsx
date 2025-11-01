"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

export interface AgentFormData {
  name: string
  role: string
  goal: string
  backstory: string
  tools: string[]
  llmProvider: string
  llmModel: string
  allowDelegation: boolean
  verbose: boolean
}

interface AgentFormProps {
  initialData?: Partial<AgentFormData>
  onSubmit: (data: AgentFormData) => void | Promise<void>
  onCancel?: () => void
  submitLabel?: string
  isLoading?: boolean
}

const DEFAULT_FORM_DATA: AgentFormData = {
  name: "",
  role: "",
  goal: "",
  backstory: "",
  tools: [],
  llmProvider: "openai",
  llmModel: "gpt-4",
  allowDelegation: true,
  verbose: true,
}

export function AgentForm({
  initialData,
  onSubmit,
  onCancel,
  submitLabel = "Create Agent",
  isLoading = false,
}: AgentFormProps) {
  const [formData, setFormData] = useState<AgentFormData>({
    ...DEFAULT_FORM_DATA,
    ...initialData,
  })

  const [toolInput, setToolInput] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await onSubmit(formData)
  }

  const updateField = <K extends keyof AgentFormData>(
    field: K,
    value: AgentFormData[K]
  ) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const addTool = () => {
    if (toolInput.trim() && !formData.tools.includes(toolInput.trim())) {
      updateField("tools", [...formData.tools, toolInput.trim()])
      setToolInput("")
    }
  }

  const removeTool = (tool: string) => {
    updateField("tools", formData.tools.filter(t => t !== tool))
  }

  const handleToolInputKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault()
      addTool()
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Basic Information */}
      <Card>
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
          <CardDescription>
            Define the core identity and purpose of your agent
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Agent Name *</Label>
            <Input
              id="name"
              placeholder="e.g., Research Analyst"
              value={formData.name}
              onChange={(e) => updateField("name", e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="role">Role *</Label>
            <Input
              id="role"
              placeholder="e.g., Senior Data Analyst"
              value={formData.role}
              onChange={(e) => updateField("role", e.target.value)}
              required
            />
            <p className="text-xs text-muted-foreground">
              The agent's professional role or title
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="goal">Goal *</Label>
            <Textarea
              id="goal"
              placeholder="e.g., Analyze data and provide actionable insights to support decision-making"
              value={formData.goal}
              onChange={(e) => updateField("goal", e.target.value)}
              rows={3}
              required
            />
            <p className="text-xs text-muted-foreground">
              What the agent is trying to achieve
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="backstory">Backstory</Label>
            <Textarea
              id="backstory"
              placeholder="e.g., You are an experienced data analyst with a background in business intelligence..."
              value={formData.backstory}
              onChange={(e) => updateField("backstory", e.target.value)}
              rows={4}
            />
            <p className="text-xs text-muted-foreground">
              Context and personality that shapes how the agent approaches tasks
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Tools */}
      <Card>
        <CardHeader>
          <CardTitle>Tools</CardTitle>
          <CardDescription>
            Specify which tools this agent can use to accomplish its tasks
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="tool-input">Add Tools</Label>
            <div className="flex gap-2">
              <Input
                id="tool-input"
                placeholder="e.g., search_tool, file_reader"
                value={toolInput}
                onChange={(e) => setToolInput(e.target.value)}
                onKeyDown={handleToolInputKeyDown}
              />
              <Button type="button" onClick={addTool} variant="secondary">
                Add
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Press Enter or click Add to add a tool
            </p>
          </div>

          {formData.tools.length > 0 && (
            <div className="space-y-2">
              <Label>Selected Tools ({formData.tools.length})</Label>
              <div className="flex flex-wrap gap-2">
                {formData.tools.map((tool) => (
                  <Badge key={tool} variant="secondary" className="gap-1">
                    {tool}
                    <button
                      type="button"
                      onClick={() => removeTool(tool)}
                      className="ml-1 hover:text-destructive"
                    >
                      ×
                    </button>
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* LLM Configuration */}
      <Card>
        <CardHeader>
          <CardTitle>LLM Configuration</CardTitle>
          <CardDescription>
            Choose which language model powers this agent
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="llm-provider">Provider *</Label>
              <select
                id="llm-provider"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                value={formData.llmProvider}
                onChange={(e) => updateField("llmProvider", e.target.value)}
                required
              >
                <option value="openai">OpenAI</option>
                <option value="anthropic">Anthropic</option>
                <option value="ollama">Ollama (Local)</option>
                <option value="azure">Azure OpenAI</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="llm-model">Model *</Label>
              <Input
                id="llm-model"
                placeholder="e.g., gpt-4, claude-3-opus"
                value={formData.llmModel}
                onChange={(e) => updateField("llmModel", e.target.value)}
                required
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Advanced Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Advanced Settings</CardTitle>
          <CardDescription>
            Additional configuration options
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="allow-delegation">Allow Delegation</Label>
              <p className="text-xs text-muted-foreground">
                Can this agent delegate tasks to other agents?
              </p>
            </div>
            <input
              type="checkbox"
              id="allow-delegation"
              checked={formData.allowDelegation}
              onChange={(e) => updateField("allowDelegation", e.target.checked)}
              className="h-4 w-4 rounded border-input"
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="verbose">Verbose Output</Label>
              <p className="text-xs text-muted-foreground">
                Show detailed execution logs
              </p>
            </div>
            <input
              type="checkbox"
              id="verbose"
              checked={formData.verbose}
              onChange={(e) => updateField("verbose", e.target.checked)}
              className="h-4 w-4 rounded border-input"
            />
          </div>
        </CardContent>
      </Card>

      {/* Form Actions */}
      <div className="flex justify-end gap-4">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
            Cancel
          </Button>
        )}
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Saving..." : submitLabel}
        </Button>
      </div>
    </form>
  )
}
