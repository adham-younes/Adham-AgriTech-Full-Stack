#!/usr/bin/env node
import { argv, env, exit } from "node:process"
import { setTimeout as sleep } from "node:timers/promises"

const HELP_MESSAGE = `Usage: node scripts/vercel-deploy-status.mjs [options]

Options:
  --project <id-or-name>   Vercel project ID or name (defaults to VERCEL_PROJECT env)
  --team <team-id>         Vercel team ID if the project belongs to a team (defaults to VERCEL_TEAM_ID env)
  --token <token>          Vercel access token (defaults to VERCEL_TOKEN env)
  --limit <number>         Number of deployments to fetch (default: 5, max: 20)
  --prod                   Restrict results to production deployments (same as --target production)
  --target <target>        Deployment target filter (production, preview, or development)
  --wait <seconds>         Poll until the latest deployment leaves the building queue (max 300 seconds)
  -h, --help               Show this help message
`

let args
try {
  args = parseArgs(argv.slice(2))
} catch (error) {
  console.error("[vercel]", error instanceof Error ? error.message : error)
  console.log(HELP_MESSAGE)
  exit(1)
}

if (args.help) {
  console.log(HELP_MESSAGE)
  exit(0)
}

const token = args.token ?? env.VERCEL_TOKEN
const project = args.project ?? env.VERCEL_PROJECT
const teamId = args.team ?? env.VERCEL_TEAM_ID

if (!token) {
  console.error("[vercel] Missing access token. Provide --token or set VERCEL_TOKEN.")
  exit(1)
}

if (!project) {
  console.error("[vercel] Missing project identifier. Provide --project or set VERCEL_PROJECT.")
  exit(1)
}

const limit = clamp(Number(args.limit ?? 5), 1, 20)
const target = args.prod ? "production" : args.target
const waitSeconds = clamp(Number(args.wait ?? 0), 0, 300)

try {
  const report = await fetchDeployments({ token, project, teamId, limit, target, waitSeconds })
  printReport(report)
  exit(report.summary.hasBlockingError ? 1 : 0)
} catch (error) {
  console.error("[vercel] Failed to inspect deployments:")
  console.error(error instanceof Error ? error.stack ?? error.message : error)
  exit(1)
}

function parseArgs(list) {
  const result = {}
  for (let i = 0; i < list.length; i++) {
    const key = list[i]
    switch (key) {
      case "-h":
      case "--help": {
        result.help = true
        break
      }
      case "--prod": {
        result.prod = true
        break
      }
      case "--project":
      case "--team":
      case "--token":
      case "--limit":
      case "--target":
      case "--wait": {
        const value = list[i + 1]
        if (!value || value.startsWith("--") || value.startsWith("-")) {
          throw new Error(`Missing value for ${key}`)
        }
        result[key.slice(2)] = value
        i += 1
        break
      }
      default: {
        throw new Error(`Unknown option: ${key}`)
      }
    }
  }
  return result
}

function clamp(value, min, max) {
  if (Number.isNaN(value)) return min
  return Math.min(Math.max(value, min), max)
}

async function fetchDeployments({ token, project, teamId, limit, target, waitSeconds }) {
  const params = new URLSearchParams({
    projectId: project,
    project,
    limit: String(limit),
  })
  if (teamId) params.set("teamId", teamId)
  if (target) params.set("target", target)

  const deploymentsUrl = new URL("https://api.vercel.com/v6/deployments")
  deploymentsUrl.search = params.toString()

  const deployments = await requestJson(deploymentsUrl, token)

  if (!deployments || !Array.isArray(deployments.deployments)) {
    throw new Error("Unexpected deployments payload from Vercel API")
  }

  const decorated = await Promise.all(
    deployments.deployments.map(async (deployment) => {
      const detailsUrl = new URL(`https://api.vercel.com/v13/deployments/${deployment.uid}`)
      if (teamId) detailsUrl.searchParams.set("teamId", teamId)
      const details = await requestJson(detailsUrl, token)
      return decorateDeployment(details ?? deployment)
    }),
  )

  let latest = decorated[0]
  if (latest && waitSeconds > 0 && isPending(latest)) {
    const deadline = Date.now() + waitSeconds * 1000
    while (Date.now() < deadline) {
      await sleep(2000)
      const refreshed = await fetchSingleDeployment(latest.uid, token, teamId)
      if (!refreshed) break
      latest = refreshed
      decorated[0] = refreshed
      if (!isPending(refreshed)) break
    }
  }

  const summary = summarize(decorated)
  return { summary, deployments: decorated }
}

async function fetchSingleDeployment(uid, token, teamId) {
  const url = new URL(`https://api.vercel.com/v13/deployments/${uid}`)
  if (teamId) url.searchParams.set("teamId", teamId)
  const details = await requestJson(url, token)
  return details ? decorateDeployment(details) : undefined
}

async function requestJson(url, token) {
  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      "User-Agent": "adham-agritech-vercel-cli/1.0",
    },
  })

  if (response.status === 404) {
    return undefined
  }

  if (!response.ok) {
    const text = await response.text()
    throw new Error(`Vercel API ${response.status}: ${text}`)
  }

  return response.json()
}

function decorateDeployment(deployment) {
  const created = deployment.createdAt ? new Date(deployment.createdAt) : undefined
  const ready = deployment.ready ? new Date(deployment.ready) : undefined
  const durationMs = created && ready ? Math.max(0, ready.getTime() - created.getTime()) : undefined
  return {
    uid: deployment.uid ?? deployment.id,
    name: deployment.name,
    url: deployment.url ? `https://${deployment.url}` : undefined,
    environment: deployment.target ?? deployment.environment ?? "unknown",
    state: deployment.state ?? deployment.readyState ?? "UNKNOWN",
    inspectorUrl: deployment.inspectorUrl,
    createdAt: created?.toISOString(),
    readyAt: ready?.toISOString(),
    durationMs,
    source: deployment.source ?? (deployment.meta?.githubCommitRef ? "git" : "manual"),
    meta: {
      commit: deployment.meta?.githubCommitMessage ?? deployment.meta?.commitMessage,
      branch: deployment.meta?.githubCommitRef ?? deployment.meta?.githubRepo ?? undefined,
      user: deployment.meta?.githubCommitAuthorName ?? deployment.createdBy ?? undefined,
    },
    readiness: deployment.readyState ?? deployment.state ?? "UNKNOWN",
    latestChecks: deployment.checksConclusion ?? deployment.checksState ?? undefined,
  }
}

function isPending(deployment) {
  return ["INITIALIZING", "QUEUED", "BUILDING"].includes(deployment.state?.toUpperCase?.() ?? "")
}

function summarize(deployments) {
  const total = deployments.length
  let building = 0
  let ready = 0
  let errors = 0
  let canceled = 0

  for (const deployment of deployments) {
    const state = (deployment.state ?? "").toUpperCase()
    if (["READY", "SUCCEEDED"].includes(state)) ready += 1
    else if (["CANCELED", "CANCELLED"].includes(state)) canceled += 1
    else if (["ERROR", "FAILED"].includes(state)) errors += 1
    else building += 1
  }

  return {
    total,
    building,
    ready,
    errors,
    canceled,
    hasBlockingError: errors > 0,
  }
}

function printReport(report) {
  const { summary, deployments } = report
  console.log("\nVercel deployment status\n==========================")
  console.log(`Total: ${summary.total}`)
  console.log(`Ready: ${summary.ready}`)
  console.log(`Building: ${summary.building}`)
  console.log(`Errors: ${summary.errors}`)
  console.log(`Canceled: ${summary.canceled}`)
  console.log("")

  for (const deployment of deployments) {
    console.log(`- ${deployment.uid}`)
    console.log(`  state: ${deployment.state}`)
    if (deployment.environment) console.log(`  environment: ${deployment.environment}`)
    if (deployment.url) console.log(`  url: ${deployment.url}`)
    if (deployment.createdAt) console.log(`  created: ${deployment.createdAt}`)
    if (deployment.readyAt) console.log(`  ready: ${deployment.readyAt}`)
    if (deployment.durationMs !== undefined) {
      console.log(`  duration: ${(deployment.durationMs / 1000).toFixed(1)}s`)
    }
    if (deployment.meta?.commit) console.log(`  commit: ${deployment.meta.commit}`)
    if (deployment.meta?.branch) console.log(`  branch: ${deployment.meta.branch}`)
    if (deployment.meta?.user) console.log(`  triggered-by: ${deployment.meta.user}`)
    if (deployment.inspectorUrl) console.log(`  inspector: ${deployment.inspectorUrl}`)
    if (deployment.latestChecks) console.log(`  checks: ${deployment.latestChecks}`)
    console.log("")
  }
}
