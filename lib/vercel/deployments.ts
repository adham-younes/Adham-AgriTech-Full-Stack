import "server-only"

const VERCEL_API_BASE = "https://api.vercel.com/v13/deployments"

type VercelDeploymentApi = {
  uid: string
  name: string
  url: string
  target?: string | null
  state?: string
  readyState?: string
  created?: number
  ready?: number | null
  inspectorUrl?: string | null
  meta?: Record<string, string | undefined>
  creator?: {
    username?: string | null
    email?: string | null
  }
  checksState?: string | null
}

export type DeploymentStatus =
  | "BUILDING"
  | "INITIALIZING"
  | "READY"
  | "ERROR"
  | "CANCELED"
  | "QUEUED"
  | "UNKNOWN"

export interface DeploymentSummary {
  id: string
  name: string
  url: string
  environment: string
  status: DeploymentStatus
  createdAt: string
  createdTimestamp: number
  readyAt?: string
  durationMs?: number
  inspectorUrl?: string
  gitCommitRef?: string
  gitCommitSha?: string
  creator?: {
    username?: string | null
    email?: string | null
  }
  checksState?: string
}

export interface DeploymentStatusResult {
  deployments: DeploymentSummary[]
  missingToken: boolean
  missingProject: boolean
  error?: string
  fetchedAt: string
}

function getProjectIdentifier() {
  const projectId =
    process.env.VERCEL_PROJECT_ID ||
    process.env.VERCEL_PROJECT ||
    process.env.NEXT_PUBLIC_VERCEL_PROJECT ||
    process.env.VERCEL_PROJECT_SLUG

  return projectId?.trim() || undefined
}

function getApiToken() {
  const token = process.env.VERCEL_API_TOKEN || process.env.VERCEL_TOKEN
  return token?.trim() || undefined
}

function determineStatus(deployment: VercelDeploymentApi): DeploymentStatus {
  const state = (deployment.readyState || deployment.state || "").toUpperCase()

  switch (state) {
    case "QUEUED":
    case "QUEUING":
      return "QUEUED"
    case "BUILDING":
    case "DEPLOYING":
      return "BUILDING"
    case "READY":
    case "SUCCEEDED":
      return "READY"
    case "ERROR":
    case "FAILED":
      return "ERROR"
    case "CANCELED":
    case "CANCELLED":
      return "CANCELED"
    case "INITIALIZING":
      return "INITIALIZING"
    default:
      return "UNKNOWN"
  }
}

function normaliseDeployment(deployment: VercelDeploymentApi): DeploymentSummary {
  const createdTimestamp = deployment.created ?? Date.now()
  const readyTimestamp = deployment.ready ?? undefined
  const durationMs = readyTimestamp ? Math.max(readyTimestamp - createdTimestamp, 0) : undefined

  return {
    id: deployment.uid,
    name: deployment.name,
    url: `https://${deployment.url}`,
    environment: deployment.target || "preview",
    status: determineStatus(deployment),
    createdAt: new Date(createdTimestamp).toISOString(),
    createdTimestamp,
    readyAt: readyTimestamp ? new Date(readyTimestamp).toISOString() : undefined,
    durationMs,
    inspectorUrl: deployment.inspectorUrl || undefined,
    gitCommitRef: deployment.meta?.githubCommitRef || deployment.meta?.gitlabCommitRef,
    gitCommitSha:
      deployment.meta?.githubCommitSha ||
      deployment.meta?.gitlabCommitSha ||
      deployment.meta?.commitSha,
    creator: deployment.creator,
    checksState: deployment.checksState || undefined,
  }
}

export interface FetchDeploymentOptions {
  limit?: number
  target?: "production" | "preview" | "development"
}

export async function fetchDeploymentStatus(
  options: FetchDeploymentOptions = {},
): Promise<DeploymentStatusResult> {
  const token = getApiToken()
  const project = getProjectIdentifier()

  const missingToken = !token
  const missingProject = !project

  if (missingToken || missingProject) {
    return {
      deployments: [],
      missingToken,
      missingProject,
      fetchedAt: new Date().toISOString(),
    }
  }

  const searchParams = new URLSearchParams()
  const limit = options.limit && options.limit > 0 ? options.limit : 8
  searchParams.set("limit", String(Math.min(limit, 20)))

  if (project.startsWith("prj_")) {
    searchParams.set("projectId", project)
  } else {
    searchParams.set("app", project)
  }

  if (process.env.VERCEL_TEAM_ID) {
    searchParams.set("teamId", process.env.VERCEL_TEAM_ID)
  }

  if (options.target) {
    searchParams.set("target", options.target)
  }

  const response = await fetch(`${VERCEL_API_BASE}?${searchParams.toString()}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "User-Agent": "adham-agritech-deployment-dashboard",
    },
    next: { revalidate: 60 },
  })

  if (!response.ok) {
    const errorBody = await response.text()
    return {
      deployments: [],
      missingToken: false,
      missingProject: false,
      error: `Failed to reach Vercel API (${response.status}): ${errorBody}`,
      fetchedAt: new Date().toISOString(),
    }
  }

  const payload = (await response.json()) as { deployments?: VercelDeploymentApi[] }
  const deployments = (payload.deployments || []).map(normaliseDeployment)

  return {
    deployments,
    missingToken: false,
    missingProject: false,
    fetchedAt: new Date().toISOString(),
  }
}
