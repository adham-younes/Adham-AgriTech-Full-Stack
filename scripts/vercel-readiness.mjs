#!/usr/bin/env node
import { env, exit } from "node:process"
import { execSync } from "node:child_process"

const checks = []

checks.push(checkEnv("VERCEL_TOKEN", "Vercel access token"))
checks.push(
  checkAnyEnv(
    ["VERCEL_PROJECT", "VERCEL_PROJECT_ID"],
    "Vercel project identifier (set VERCEL_PROJECT or VERCEL_PROJECT_ID)",
  ),
)
checks.push(checkEnv("VERCEL_TEAM_ID", "Vercel team ID", { optional: true }))
checks.push(checkGitRemote())

const failed = checks.filter((check) => check.status === "fail")
const warnings = checks.filter((check) => check.status === "warn")

printReport(checks)

if (failed.length > 0) {
  exit(1)
}

if (warnings.length > 0) {
  exit(2)
}

exit(0)

function checkEnv(name, description, options = {}) {
  const value = env[name]
  if (value && value.trim().length > 0) {
    return {
      label: name,
      description,
      status: "pass",
      detail: "Environment variable is set.",
    }
  }

  const status = options.optional ? "warn" : "fail"
  return {
    label: name,
    description,
    status,
    detail: options.optional
      ? "Optional variable is missing; set it if the project belongs to a Vercel team."
      : "Missing environment variable.",
  }
}

function checkAnyEnv(names, description) {
  const hasValue = names.some((name) => env[name] && env[name].trim().length > 0)
  if (hasValue) {
    return {
      label: names.join(" / "),
      description,
      status: "pass",
      detail: "At least one identifier is configured.",
    }
  }

  return {
    label: names.join(" / "),
    description,
    status: "fail",
    detail: "Provide one of the identifiers so the deployment scripts can target the correct project.",
  }
}

function checkGitRemote() {
  try {
    const output = execSync("git remote -v", { stdio: ["ignore", "pipe", "pipe"] })
      .toString()
      .trim()

    if (!output) {
      return {
        label: "git remote",
        description: "Connected Git remotes",
        status: "warn",
        detail: "No git remotes configured. Add the GitHub repository before attempting to push updates.",
      }
    }

    const remotes = Array.from(new Set(output.split(/\r?\n/).map((line) => line.split(/\s+/)[0])))
    return {
      label: "git remote",
      description: "Connected Git remotes",
      status: "pass",
      detail: `Configured remotes: ${remotes.join(", ")}`,
    }
  } catch (error) {
    return {
      label: "git remote",
      description: "Connected Git remotes",
      status: "warn",
      detail: `Unable to inspect git remotes: ${error instanceof Error ? error.message : String(error)}`,
    }
  }
}

function printReport(checks) {
  console.log("Vercel deployment readiness report:\n")
  for (const check of checks) {
    const icon = check.status === "pass" ? "✅" : check.status === "warn" ? "⚠️" : "❌"
    console.log(`${icon} ${check.label}`)
    console.log(`   ${check.description}`)
    console.log(`   ${check.detail}\n`)
  }

  const summary = checks.reduce(
    (acc, check) => {
      acc[check.status] += 1
      return acc
    },
    { pass: 0, warn: 0, fail: 0 },
  )

  console.log(
    `Summary: ${summary.pass} passed, ${summary.warn} warning${summary.warn === 1 ? "" : "s"}, ${summary.fail} failed check${summary.fail === 1 ? "" : "s"}.`,
  )
  console.log(
    "Resolve failed checks before attempting to trigger or monitor production deployments.",
  )
}
