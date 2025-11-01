"use client"

import { useEffect, useState, useRef } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import ReactMarkdown from "react-markdown"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { PMMessageCard } from "@/components/chat/pm-message-card"
import type { Project, ChatMessage } from "@/lib/types/project"

export default function ProjectChatPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter()
  const [project, setProject] = useState<Project | null>(null)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [inputMessage, setInputMessage] = useState("")
  const [isSending, setIsSending] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [resolvedParams, setResolvedParams] = useState<{ id: string } | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    params.then(setResolvedParams)
  }, [params])

  useEffect(() => {
    if (resolvedParams) {
      fetchProjectAndChat()
    }
  }, [resolvedParams])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const fetchProjectAndChat = async () => {
    if (!resolvedParams) return

    try {
      setIsLoading(true)

      const [projectRes, chatRes] = await Promise.all([
        fetch(`/api/projects/${resolvedParams.id}`),
        fetch(`/api/projects/${resolvedParams.id}/chat`),
      ])

      if (!projectRes.ok) {
        const errorData = await projectRes.json().catch(() => ({}))
        console.error("Failed to load project:", errorData)
        throw new Error(errorData.error || "Failed to load project")
      }

      if (!chatRes.ok) {
        const errorData = await chatRes.json().catch(() => ({}))
        console.error("Failed to load chat:", errorData)
        throw new Error(errorData.error || "Failed to load chat")
      }

      const projectData = await projectRes.json()
      const chatData = await chatRes.json()

      setProject(projectData)
      setMessages(chatData.messages)
    } catch (error) {
      console.error("Error loading project:", error)
      setProject(null)
      // Don't show alert immediately, just set error state
    } finally {
      setIsLoading(false)
    }
  }

  const handleSendMessage = async (messageOverride?: string) => {
    const messageToSend = messageOverride || inputMessage.trim()
    if (!messageToSend || !resolvedParams || isSending) return

    // Check if this is the "Generate Roadmap" action
    if (messageToSend === "Generate Roadmap") {
      handleGenerateRoadmap()
      return
    }

    if (!messageOverride) {
      setInputMessage("")
    }
    setIsSending(true)

    // Optimistically add user message
    const tempUserMsg: ChatMessage = {
      id: `temp-${Date.now()}`,
      role: "user",
      content: messageToSend,
      timestamp: new Date().toISOString(),
    }
    setMessages(prev => [...prev, tempUserMsg])

    try {
      const response = await fetch(`/api/projects/${resolvedParams.id}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: messageToSend }),
      })

      if (!response.ok) {
        throw new Error("Failed to send message")
      }

      const data = await response.json()

      // Replace temp message and add assistant response
      setMessages(prev => [
        ...prev.filter(m => m.id !== tempUserMsg.id),
        { ...tempUserMsg, id: `user-${Date.now()}` },
        data.message,
      ])
    } catch (error) {
      console.error("Error sending message:", error)
      // Remove temp message on error
      setMessages(prev => prev.filter(m => m.id !== tempUserMsg.id))
      alert("Failed to send message. Please try again.")
    } finally {
      setIsSending(false)
    }
  }

  const handleGenerateRoadmap = async () => {
    if (!resolvedParams || isSending) return

    setIsSending(true)

    try {
      const response = await fetch(`/api/projects/${resolvedParams.id}/roadmap`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      })

      if (!response.ok) {
        throw new Error("Failed to generate roadmap")
      }

      const data = await response.json()

      // Navigate to roadmap page
      router.push(`/projects/${resolvedParams.id}/roadmap`)
    } catch (error) {
      console.error("Error generating roadmap:", error)
      alert("Failed to generate roadmap. Please try again.")
    } finally {
      setIsSending(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <p className="text-muted-foreground">Loading conversation...</p>
      </div>
    )
  }

  if (!project) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Card className="p-8">
          <p className="mb-4 text-muted-foreground">Project not found</p>
          <Link href="/">
            <Button>Back to Home</Button>
          </Link>
        </Card>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Header */}
      <div className="border-b bg-background">
        <div className="mx-auto max-w-5xl px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <Link href="/" className="text-sm text-muted-foreground hover:text-foreground">
                ← Back to Home
              </Link>
              <h1 className="mt-2 text-2xl font-bold">{project.title}</h1>
              <div className="mt-1 flex items-center gap-2">
                <Badge>{project.status}</Badge>
                <span className="text-sm text-muted-foreground">Discovery Phase</span>
              </div>
            </div>
            <Button variant="outline" disabled>
              Generate Roadmap
            </Button>
          </div>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-3xl px-8 py-8">
          <div className="space-y-6">
            {messages.map((message) => {
              // Try to parse as structured content
              let structuredContent = null
              try {
                structuredContent = JSON.parse(message.content)
              } catch {
                // Not JSON, render as regular message
              }

              return (
                <div
                  key={message.id}
                  className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  {structuredContent && (structuredContent.type === "recommendations" || structuredContent.type === "options" || structuredContent.type === "action") ? (
                    // Render structured PM message with options/actions
                    <PMMessageCard
                      message={structuredContent.message}
                      type={structuredContent.type}
                      allowMultiSelect={structuredContent.allowMultiSelect}
                      options={structuredContent.options}
                      actions={structuredContent.actions}
                      onSelect={handleSendMessage}
                    />
                  ) : (
                    // Regular message bubble
                    <div
                      className={`max-w-[85%] rounded-lg px-4 py-3 ${
                        message.role === "user"
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted"
                      }`}
                    >
                      {message.role === "assistant" && (
                        <p className="mb-2 text-xs font-medium opacity-70">AI Project Manager</p>
                      )}
                      <div className={`prose prose-sm max-w-none ${
                        message.role === "user"
                          ? "prose-invert"
                          : "prose-slate"
                      }`}>
                        <ReactMarkdown
                          components={{
                            p: ({ node, ...props }) => <p className="mb-3 last:mb-0" {...props} />,
                            strong: ({ node, ...props }) => <strong className="font-semibold text-foreground" {...props} />,
                            ul: ({ node, ...props }) => <ul className="my-2 ml-4 space-y-1" {...props} />,
                            li: ({ node, ...props }) => <li className="text-sm" {...props} />,
                          }}
                        >
                          {message.content}
                        </ReactMarkdown>
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
            <div ref={messagesEndRef} />
          </div>
        </div>
      </div>

      {/* Input Area - More Prominent */}
      <div className="border-t bg-background shadow-lg">
        <div className="mx-auto max-w-3xl px-8 py-6">
          <div className="mb-3 flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-primary animate-pulse"></div>
            <p className="text-sm font-medium">Your Response</p>
          </div>
          <div className="flex gap-3">
            <Textarea
              placeholder="Type your response here... (or select an option above)"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isSending}
              rows={3}
              className="resize-none text-base"
            />
            <Button
              onClick={handleSendMessage}
              disabled={!inputMessage.trim() || isSending}
              size="lg"
              className="px-8"
            >
              {isSending ? "Sending..." : "Send"}
            </Button>
          </div>
          <p className="mt-2 text-xs text-muted-foreground">
            Press Enter to send • Shift+Enter for new line
          </p>
        </div>
      </div>
    </div>
  )
}
