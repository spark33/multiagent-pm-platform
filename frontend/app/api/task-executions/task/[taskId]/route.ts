import { NextRequest, NextResponse } from "next/server"

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3001"

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ taskId: string }> }
) {
  try {
    const { taskId } = await params

    const response = await fetch(`${BACKEND_URL}/api/task-executions/task/${taskId}`, {
      method: "GET",
    })

    const data = await response.json()
    return NextResponse.json(data, { status: response.status })
  } catch (error) {
    console.error("Error fetching task execution by task ID:", error)
    return NextResponse.json(
      { error: "Failed to fetch task execution" },
      { status: 500 }
    )
  }
}
