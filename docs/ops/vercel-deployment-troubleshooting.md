# Vercel Deployment Troubleshooting

This guide explains how to diagnose and stabilise automated deployments for the Adham AgriTech platform. Keep it close while building the global rollout so the delivery pipeline never blocks the roadmap.

## 1. Quick status check

Visit the new [Deployment Control Room](/ops/deployments) for a live, auto-refreshing stream of Vercel releases. It surfaces production-ready builds, queued jobs, and failure telemetry directly inside the platform UI.

Prefer the terminal? Run the inspection script to obtain a real-time view of the latest deployments.

```bash
node scripts/vercel-deploy-status.mjs --project <project-id-or-name>
```

Before reaching out to the Vercel API, confirm that the workspace is wired with the necessary credentials and Git remotes:

```bash
pnpm vercel:check
```

This readiness report fails fast when `VERCEL_TOKEN`, `VERCEL_PROJECT`/`VERCEL_PROJECT_ID`, or the production remote are missing so you can fix them before attempting a redeploy.

Set the following environment variables to avoid passing flags each time:

- `VERCEL_TOKEN` – personal or team access token with **read** permission.
- `VERCEL_PROJECT` / `VERCEL_PROJECT_ID` – Vercel project ID or slug.
- `VERCEL_TEAM_ID` – (optional) team scope when the project belongs to an organisation.

Example with polling until the active build finishes:

```bash
export VERCEL_TOKEN=***
export VERCEL_PROJECT=adham-agritech
node scripts/vercel-deploy-status.mjs --prod --wait 120
```

The command exits with a non-zero status when a deployment is in the `ERROR`/`FAILED` state so it can be wired into CI monitors.

Need to force a publish? Trigger a fresh production rollout directly from the workspace whenever Vercel misses a webhook.

```bash
# Option A – use a deploy hook URL
node scripts/vercel-trigger-deploy.mjs --deploy-hook https://api.vercel.com/v1/integrations/deploy/... 

# Option B – redeploy the last successful production build via the Vercel API
export VERCEL_TOKEN=***
export VERCEL_PROJECT_ID=prj_***
node scripts/vercel-trigger-deploy.mjs --target production
```

Add `--dry-run` to preview the action or `--json` to integrate the result into automation pipelines.

## 2. Interpret the output

- **Ready** – Deployment reached production and is serving traffic.
- **Building** – Deployment is queued or compiling. Use `--wait` to poll until completion.
- **Errors** – Investigate failing builds immediately. The script shows a direct Inspector link when Vercel exposes one.
- **Checks** – GitHub, GitLab, or Bitbucket check suite summary when available.

## 3. Common failure modes

| Symptom | Next step |
| --- | --- |
| `Vercel API 401` | Token expired or missing required scopes. Regenerate from Vercel dashboard. |
| `project not found` | Verify `VERCEL_PROJECT` matches the slug shown in the project settings. |
| Repeated build timeouts | Inspect `next build` locally with `pnpm build` and review the Next.js output stored under `build.log`. |
| Environment variable mismatch | Compare `vercel env ls` output against `.env` and secrets tracked in `SERVICES_INTEGRATION.md`. |

## 4. Keep deployments flowing

1. Run `pnpm lint` and `pnpm build` before pushing to reduce broken builds.
2. Tag releases once a week so rollback targets are obvious.
3. Monitor the script output in your terminal or add it to a GitHub Action that pings the operations channel on failure.
4. Sync infrastructure keys with `API_KEYS_BACKUP.md` and rotate quarterly.

With these checks in place, automated publishing to Vercel stays reliable while the platform scales into the fully immersive, global Agrio-class experience.
