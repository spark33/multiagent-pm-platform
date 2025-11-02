import { NextRequest, NextResponse } from "next/server"

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:3001'

// PATCH /api/projects/:id/phases/:phaseId - Update phase status
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; phaseId: string }> }
) {
  try {
    const { id, phaseId } = await params
    const body = await request.json()

    const response = await fetch(`${BACKEND_URL}/api/projects/${id}/phases/${phaseId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })

    const data = await response.json()
    return NextResponse.json(data, { status: response.status })
  } catch (error) {
    console.error("Error updating phase status:", error)
    return NextResponse.json(
      { error: "Failed to update phase status" },
      { status: 500 }
    )
  }
}
