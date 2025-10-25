"use client"

import { useEffect, useMemo, useState, useTransition } from "react"
import {
  AlertTriangle,
  ArrowUpRight,
  CheckCircle2,
  Clock3,
  ExternalLink,
  Loader2,
  RefreshCcw,
  ServerCog,
  XCircle,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { cn } from "@/lib/utils"
import type { DeploymentStatusResult, DeploymentSummary } from "@/lib/vercel/deployments"

type Props = {
  initialData: DeploymentStatusResult
  pollIntervalMs?: number
}

type StatusVisual = {
  label: string
  accent: string
  border: string
  icon: typeof CheckCircle2
}

const statusStyles: Record<string, StatusVisual> = {
  READY: {
    label: "Ready",
    accent: "text-emerald-300",
    border: "border-emerald-400/20",
    icon: CheckCircle2,
  },
  BUILDING: {
    label: "Building",
    accent: "text-amber-300",
    border: "border-amber-300/30",
    icon: Loader2,
  },
  INITIALIZING: {
    label: "Initializing",
    accent: "text-sky-300",
    border: "border-sky-300/30",
    icon: ServerCog,
  },
  QUEUED: {
    label: "Queued",
    accent: "text-blue-300",
    border: "border-blue-300/20",
    icon: Clock3,
  },
  ERROR: {
    label: "Failed",
    accent: "text-red-300",
    border: "border-red-400/30",
    icon: XCircle,
  },
  CANCELED: {
    label: "Canceled",
    accent: "text-zinc-300",
    border: "border-zinc-400/20",
    icon: AlertTriangle,
  },
  UNKNOWN: {
    label: "Unknown",
    accent: "text-zinc-300",
    border: "border-zinc-400/20",
    icon: AlertTriangle,
  },
}

const relativeFormatter = new Intl.RelativeTimeFormat("en", { numeric: "auto" })
const shortFormatter = new Intl.DateTimeFormat("en-GB", {
  dateStyle: "medium",
  timeStyle: "short",
})

function formatRelativeTime(date: string) {
  const timestamp = new Date(date).getTime()
  if (Number.isNaN(timestamp)) {
    return "unknown"
  }
  const now = Date.now()
  const diffMinutes = Math.round((timestamp - now) / 60000)
  if (Math.abs(diffMinutes) < 120) {
    return relativeFormatter.format(diffMinutes, "minute")
  }
  const diffHours = Math.round((timestamp - now) / 3600000)
  if (Math.abs(diffHours) < 48) {
    return relativeFormatter.format(diffHours, "hour")
  }
  const diffDays = Math.round((timestamp - now) / 86400000)
  return relativeFormatter.format(diffDays, "day")
}

function formatDuration(durationMs?: number) {
  if (!durationMs) {
    return "—"
  }
  const seconds = Math.floor(durationMs / 1000)
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = seconds % 60
  if (minutes >= 1) {
    return `${minutes}m ${remainingSeconds}s`
  }
  return `${seconds}s`
}

function summarise(deployments: DeploymentSummary[]) {
  const summary = deployments.reduce(
    (acc, deployment) => {
      acc.total += 1
      acc.byStatus[deployment.status] = (acc.byStatus[deployment.status] || 0) + 1
      if (!acc.latest || deployment.createdTimestamp > acc.latest.createdTimestamp) {
        acc.latest = deployment
      }
      return acc
    },
    { total: 0, byStatus: {} as Record<string, number>, latest: undefined as DeploymentSummary | undefined },
  )

  return summary
}

export function DeploymentDashboard({ initialData, pollIntervalMs = 60000 }: Props) {
  const [data, setData] = useState(initialData)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [error, setError] = useState<string | undefined>(initialData.error)
  const [isPending, startTransition] = useTransition()

  const canPoll = !data.missingProject && !data.missingToken
  const metrics = useMemo(() => summarise(data.deployments), [data.deployments])

  useEffect(() => {
    setData(initialData)
    setError(initialData.error)
  }, [initialData])

  useEffect(() => {
    if (!canPoll || pollIntervalMs <= 0) {
      return
    }

    const controller = new AbortController()
    const interval = setInterval(() => {
      refresh(true, controller.signal)
    }, pollIntervalMs)

    return () => {
      controller.abort()
      clearInterval(interval)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [canPoll, pollIntervalMs])

  async function refresh(auto = false, signal?: AbortSignal) {
    if (auto) {
      startTransition(() => {
        fetchData(signal)
          .then((next) => {
            setData(next)
            setError(next.error)
          })
          .catch((err) => {
            if (!signal?.aborted) {
              console.error("Failed to refresh deployment status", err)
            }
          })
      })
      return
    }

    setIsRefreshing(true)
    try {
      const next = await fetchData(signal)
      setData(next)
      setError(next.error)
    } catch (err) {
      if (!signal?.aborted) {
        setError((err as Error).message)
      }
    } finally {
      setIsRefreshing(false)
    }
  }

  async function fetchData(signal?: AbortSignal) {
    const response = await fetch("/api/vercel/deployments", {
      cache: "no-store",
      signal,
    })
    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status}`)
    }
    return (await response.json()) as DeploymentStatusResult
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
      <Card className="relative overflow-hidden border-white/10 bg-gradient-to-br from-white/5 via-white/5 to-transparent backdrop-blur-xl shadow-[0_25px_80px_-40px_rgba(16,185,129,0.45)]">
        <div className="pointer-events-none absolute -top-32 right-16 h-64 w-64 rounded-full bg-emerald-500/20 blur-3xl" />
        <CardHeader className="relative z-10">
          <CardTitle className="text-xl font-semibold text-white">Live Deployment Feed</CardTitle>
          <CardDescription className="text-sm text-emerald-100/80">
            Track the latest Vercel builds and production rollouts powering the Adham AgriTech experience.
          </CardDescription>
          <div className="flex items-center gap-3 text-xs text-emerald-100/70">
            <Clock3 className="h-4 w-4" />
            <span>Last sync {shortFormatter.format(new Date(data.fetchedAt))}</span>
            <span className="hidden sm:inline">({formatRelativeTime(data.fetchedAt)})</span>
          </div>
        </CardHeader>
        <CardContent className="relative z-10 space-y-4">
          {data.missingToken || data.missingProject ? (
            <div className="rounded-xl border border-amber-400/30 bg-amber-500/10 p-6 text-sm text-amber-100">
              <div className="flex items-start gap-3">
                <AlertTriangle className="mt-0.5 h-5 w-5 flex-shrink-0" />
                <div className="space-y-1">
                  <p className="font-semibold uppercase tracking-widest text-amber-200">Configuration required</p>
                  <p>
                    Provide <code className="font-mono text-xs">VERCEL_API_TOKEN</code> and <code className="font-mono text-xs">VERCEL_PROJECT</code>{" "}
                    secrets in Vercel to unlock real-time deployment telemetry on the dashboard.
                  </p>
                </div>
              </div>
            </div>
          ) : data.deployments.length === 0 ? (
            <div className="rounded-xl border border-slate-400/20 bg-slate-500/10 p-6 text-sm text-slate-200">
              <div className="flex items-start gap-3">
                <ServerCog className="mt-0.5 h-5 w-5 flex-shrink-0" />
                <div>
                  <p className="font-semibold uppercase tracking-widest text-slate-200">No deployments yet</p>
                  <p>Push to the main branch or trigger a Vercel build to populate this timeline.</p>
                </div>
              </div>
            </div>
          ) : (
            <ul className="space-y-4">
              {data.deployments.map((deployment) => {
                const visuals = statusStyles[deployment.status] || statusStyles.UNKNOWN
                const Icon = visuals.icon
                return (
                  <li
                    key={deployment.id}
                    className={cn(
                      "relative overflow-hidden rounded-2xl border bg-gradient-to-br from-white/10 via-white/5 to-transparent p-5 transition hover:border-white/40",
                      visuals.border,
                    )}
                  >
                    <div className="absolute inset-y-0 left-0 w-1 rounded-l-2xl bg-gradient-to-b from-transparent via-white/70 to-transparent" />
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                      <div className="space-y-2">
                        <div className="flex items-center gap-3">
                          <span
                            className={cn(
                              "flex items-center gap-2 rounded-full bg-black/30 px-3 py-1 text-xs font-semibold uppercase tracking-widest",
                              visuals.accent,
                            )}
                          >
                            <Icon className={cn("h-4 w-4", deployment.status === "BUILDING" && "animate-spin") } />
                            {visuals.label}
                          </span>
                          <span className="text-xs text-white/70">{deployment.environment}</span>
                        </div>
                        <div className="space-y-1">
                          <p className="text-lg font-semibold text-white">{deployment.name}</p>
                          <p className="text-sm text-emerald-100/80">
                            Initiated {shortFormatter.format(new Date(deployment.createdAt))} · {formatRelativeTime(deployment.createdAt)}
                          </p>
                        </div>
                        <div className="flex flex-wrap items-center gap-3 text-xs text-white/70">
                          <span className="flex items-center gap-1">
                            <Clock3 className="h-3.5 w-3.5" />
                            Runtime {formatDuration(deployment.durationMs)}
                          </span>
                          {deployment.gitCommitRef ? (
                            <span className="flex items-center gap-1">
                              <ArrowUpRight className="h-3.5 w-3.5" />
                              {deployment.gitCommitRef}
                            </span>
                          ) : null}
                          {deployment.gitCommitSha ? (
                            <span className="font-mono text-[10px] text-white/60">
                              {deployment.gitCommitSha.slice(0, 10)}
                            </span>
                          ) : null}
                          {deployment.creator?.username || deployment.creator?.email ? (
                            <span className="flex items-center gap-1 text-white/60">
                              ·
                              <span>
                                {deployment.creator.username || deployment.creator.email}
                              </span>
                            </span>
                          ) : null}
                        </div>
                      </div>
                      <div className="flex flex-col items-start gap-3 sm:items-end">
                        <a
                          href={deployment.url}
                          className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs text-white transition hover:border-white/40 hover:bg-white/20"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Visit deployment
                          <ExternalLink className="h-3.5 w-3.5" />
                        </a>
                        {deployment.inspectorUrl ? (
                          <a
                            href={deployment.inspectorUrl}
                            className="inline-flex items-center gap-2 text-xs text-emerald-100/80 underline-offset-4 hover:underline"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            Open inspector
                          </a>
                        ) : null}
                        {deployment.checksState ? (
                          <span className="text-xs text-white/60">
                            Checks: {deployment.checksState.toLowerCase()}
                          </span>
                        ) : null}
                      </div>
                    </div>
                  </li>
                )
              })}
            </ul>
          )}
        </CardContent>
        <CardFooter className="relative z-10 flex flex-wrap items-center justify-between gap-4 text-xs text-white/70">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="border-white/20 bg-white/10 text-white hover:border-white/40 hover:bg-white/20"
              onClick={() => refresh()}
              disabled={isRefreshing || isPending}
            >
              {isRefreshing || isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <RefreshCcw className="h-4 w-4" />
              )}
              Refresh
            </Button>
            {error ? (
              <span className="flex items-center gap-1 text-red-200">
                <AlertTriangle className="h-3.5 w-3.5" />
                {error}
              </span>
            ) : null}
          </div>
          <span>
            {canPoll ? `Auto-refresh every ${Math.round(pollIntervalMs / 1000)}s` : "Auto-refresh paused until configuration is complete"}
          </span>
        </CardFooter>
      </Card>

      <Card className="border-white/10 bg-gradient-to-br from-emerald-400/10 via-emerald-500/10 to-transparent backdrop-blur-xl">
        <CardHeader>
          <CardTitle className="text-lg text-white">Pipeline Pulse</CardTitle>
          <CardDescription className="text-sm text-emerald-50/70">
            Snapshot of the deployment stream to keep releases aligned with the Agrio-class expansion roadmap.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-2 gap-4 text-center text-white">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4 shadow-inner">
              <p className="text-xs uppercase tracking-[0.3em] text-white/70">Total tracked</p>
              <p className="mt-2 text-3xl font-semibold">{metrics.total}</p>
            </div>
            <div className="rounded-2xl border border-emerald-300/20 bg-emerald-400/10 p-4 shadow-inner">
              <p className="text-xs uppercase tracking-[0.3em] text-emerald-100/80">Ready builds</p>
              <p className="mt-2 text-3xl font-semibold">
                {metrics.byStatus.READY ? metrics.byStatus.READY : 0}
              </p>
            </div>
          </div>
          <div className="space-y-2 text-sm text-white/70">
            {Object.entries(metrics.byStatus).map(([status, count]) => {
              const visuals = statusStyles[status] || statusStyles.UNKNOWN
              const MetricIcon = visuals.icon
              return (
                <div key={status} className="flex items-center justify-between rounded-lg border border-white/5 bg-white/5 px-3 py-2">
                  <span className={cn("flex items-center gap-2 font-medium", visuals.accent)}>
                    <MetricIcon className={cn("h-4 w-4", status === "BUILDING" && "animate-spin") } />
                    {visuals.label}
                  </span>
                  <span>{count}</span>
                </div>
              )
            })}
          </div>
          {metrics.latest ? (
            <div className="rounded-2xl border border-white/10 bg-black/40 p-4 text-xs text-white/80">
              <p className="mb-2 text-[0.7rem] uppercase tracking-[0.3em] text-emerald-200">Latest production push</p>
              <p className="text-sm font-semibold text-white">{metrics.latest.name}</p>
              <p className="mt-1">{shortFormatter.format(new Date(metrics.latest.createdAt))}</p>
              <p className="mt-1 text-white/60">{formatRelativeTime(metrics.latest.createdAt)}</p>
              <a
                href={metrics.latest.url}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 inline-flex items-center gap-2 text-emerald-100 underline-offset-4 hover:underline"
              >
                Inspect deployment
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            </div>
          ) : null}
        </CardContent>
        <CardFooter className="text-xs text-white/70">
          <p>
            Stay aligned with the <span className="font-semibold text-white">Global Operations Playbook</span> to guarantee each push surfaces on the live domain without delays.
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}
