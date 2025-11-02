import { NextRequest, NextResponse } from "next/server"

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:3001'

// POST /api/projects/:id/roadmap - Generate roadmap
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const response = await fetch(`${BACKEND_URL}/api/projects/${id}/roadmap`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    const data = await response.json()
    return NextResponse.json(data, { status: response.status })
  } catch (error) {
    console.error("Error generating roadmap:", error)
    return NextResponse.json(
      { error: "Failed to generate roadmap" },
      { status: 500 }
    )
  }
}
