import Link from "next/link"
import { Metadata } from "next"
import { ArrowUpRight, Rocket, ShieldCheck, Sparkles } from "lucide-react"

import { DeploymentDashboard } from "@/components/ops/deployment-dashboard"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { fetchDeploymentStatus } from "@/lib/vercel/deployments"

export const metadata: Metadata = {
  title: "Deployment Control Room – Adham AgriTech",
  description:
    "Monitor Vercel builds, troubleshoot automation, and keep the global agritech platform continuously updated.",
}

export default async function DeploymentOpsPage() {
  const status = await fetchDeploymentStatus({ limit: 12 })

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-[#030712] via-[#031b12] to-[#020b09] text-white">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(16,185,129,0.25),_transparent_60%)]" />
      <div className="pointer-events-none absolute -top-48 right-20 h-96 w-96 rounded-full bg-emerald-500/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 left-[-10%] h-[28rem] w-[28rem] rounded-full bg-lime-500/10 blur-[120px]" />

      <div className="relative mx-auto flex max-w-6xl flex-col gap-12 px-4 py-16 sm:px-6 lg:px-8">
        <header className="space-y-6 text-center sm:text-left">
          <p className="inline-flex items-center gap-2 rounded-full border border-emerald-500/40 bg-emerald-500/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-emerald-100 shadow-[0_10px_40px_-20px_rgba(16,185,129,0.7)]">
            <Sparkles className="h-4 w-4" />
            Ops Command
          </p>
          <h1 className="text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl">
            Deployment Control Room
          </h1>
          <p className="mx-auto max-w-3xl text-sm text-emerald-100/80 sm:text-base lg:text-lg">
            Keep every push to main visible on the live domain. Track Vercel build pipelines, surface failures instantly, and align engineering velocity with our Agrio-scale global expansion roadmap.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 sm:justify-start">
            <Button
              asChild
              className="bg-emerald-500/90 text-sm font-semibold text-black shadow-[0_15px_35px_-20px_rgba(16,185,129,0.9)] hover:bg-emerald-500"
            >
              <Link href="/docs/ops/vercel-deployment-troubleshooting">
                Review troubleshooting guide
                <ArrowUpRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" className="border-emerald-300/40 bg-white/5 text-sm text-emerald-100 hover:border-emerald-200 hover:bg-emerald-400/10">
              <Link href="/docs/engineering/smart-ag-best-practices">
                Engineering playbook
              </Link>
            </Button>
          </div>
        </header>

        <DeploymentDashboard initialData={status} pollIntervalMs={60000} />

        <section className="grid gap-6 lg:grid-cols-2">
          <Card className="border-white/10 bg-white/[0.06] backdrop-blur-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl text-white">
                <Rocket className="h-5 w-5 text-emerald-300" />
                Automate with confidence
              </CardTitle>
              <CardDescription className="text-emerald-100/80">
                Wire the CLI helper into GitHub Actions to fail builds proactively and notify the operations channel before customers notice downtime.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-sm text-emerald-50/90">
              <p>
                Run <code className="rounded bg-black/60 px-2 py-1 font-mono text-xs text-emerald-200">pnpm vercel:status -- --wait 180</code> after every production deployment to guarantee the new release reaches the live alias.
              </p>
              <p>
                Add a scheduled check (every 30 minutes) that polls Vercel and sends a webhook when <span className="font-semibold text-emerald-100">readyState</span> does not reach <code className="font-mono text-xs">READY</code> within SLA. Integrate with Slack, WhatsApp, or SMS for global coverage.
              </p>
            </CardContent>
          </Card>

          <Card className="border-white/10 bg-gradient-to-br from-emerald-500/10 via-emerald-500/5 to-transparent backdrop-blur-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl text-white">
                <ShieldCheck className="h-5 w-5 text-emerald-300" />
                Global uptime pledge
              </CardTitle>
              <CardDescription className="text-emerald-100/80">
                Align infrastructure practices with the elite agritech leaders we benchmarked. Zero downtime and transparent recovery plans are core to an Agrio-class experience.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-sm text-emerald-50/90">
              <p>
                Mirror production and staging secrets via Vercel&apos;s <span className="font-semibold text-emerald-100">Environment Variables</span> sync. Review <code className="font-mono text-xs">API_KEYS_BACKUP.md</code> monthly to ensure disaster recovery parity.
              </p>
              <p>
                Track deployment MTTR, change failure rate, and weekly release cadence here. Publish the metrics to investors and cooperative partners to prove platform reliability as we scale worldwide.
              </p>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  )
}
