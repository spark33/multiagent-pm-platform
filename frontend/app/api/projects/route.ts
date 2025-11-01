import { NextRequest, NextResponse } from "next/server"
import { getAllProjects, createProject } from "@/lib/data/sample-projects"
import type { CreateProjectRequest, ProjectListResponse } from "@/lib/types/project"

// GET /api/projects - List all projects
export async function GET() {
  try {
    const projects = getAllProjects()

    const response: ProjectListResponse = {
      projects,
      total: projects.length,
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error("Error fetching projects:", error)
    return NextResponse.json(
      { error: "Failed to fetch projects" },
      { status: 500 }
    )
  }
}

// POST /api/projects - Create a new project
export async function POST(request: NextRequest) {
  try {
    const body: CreateProjectRequest = await request.json()

    if (!body.description || !body.description.trim()) {
      return NextResponse.json(
        { error: "Project description is required" },
        { status: 400 }
      )
    }

    const newProject = createProject(body.description)

    return NextResponse.json(newProject, { status: 201 })
  } catch (error) {
    console.error("Error creating project:", error)
    return NextResponse.json(
      { error: "Failed to create project" },
      { status: 500 }
    )
  }
}
