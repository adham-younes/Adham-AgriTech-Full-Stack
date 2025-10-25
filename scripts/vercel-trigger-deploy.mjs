#!/usr/bin/env node
/*
 * Manual trigger for Vercel deployments.
 *
 * Supports triggering via deploy hooks or by redeploying the latest
 * production build using the Vercel REST API.
 */

import process from 'node:process';

const HELP_TEXT = `Usage: node scripts/vercel-trigger-deploy.mjs [options]\n\nOptions:\n  --deploy-hook <url>        Deploy hook URL to invoke directly\n  --token <token>            Vercel API token (defaults to VERCEL_TOKEN)\n  --project <id>             Vercel project ID (defaults to VERCEL_PROJECT_ID)\n  --team <id>                Optional Vercel team ID (defaults to VERCEL_TEAM_ID)\n  --target <env>             Target environment (production|preview, default: production)\n  --meta key=value           Attach custom metadata (repeatable)\n  --dry-run                  Show the action without executing it\n  --json                     Emit machine-readable JSON output\n  -h, --help                 Show this help message\n\nEnvironment variables:\n  VERCEL_DEPLOY_HOOK_URL, VERCEL_TOKEN, VERCEL_PROJECT_ID, VERCEL_TEAM_ID\n`;

function parseArgs(argv) {
  const args = [...argv];
  const options = {
    deployHook: process.env.VERCEL_DEPLOY_HOOK_URL || null,
    token: process.env.VERCEL_TOKEN || null,
    project: process.env.VERCEL_PROJECT_ID || process.env.VERCEL_PROJECT || null,
    team: process.env.VERCEL_TEAM_ID || null,
    target: 'production',
    dryRun: false,
    json: false,
    meta: {},
  };

  while (args.length) {
    const arg = args.shift();
    switch (arg) {
      case '--deploy-hook':
        options.deployHook = args.shift();
        break;
      case '--token':
        options.token = args.shift();
        break;
      case '--project':
        options.project = args.shift();
        break;
      case '--team':
        options.team = args.shift();
        break;
      case '--target':
        options.target = args.shift() || 'production';
        break;
      case '--meta': {
        const pair = args.shift();
        if (!pair || !pair.includes('=')) {
          throw new Error('Expected key=value after --meta');
        }
        const [key, ...rest] = pair.split('=');
        options.meta[key] = rest.join('=');
        break;
      }
      case '--dry-run':
        options.dryRun = true;
        break;
      case '--json':
        options.json = true;
        break;
      case '-h':
      case '--help':
        options.help = true;
        break;
      default:
        throw new Error(`Unknown argument: ${arg}`);
    }
  }

  return options;
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

async function triggerDeployHook(url, { meta }) {
  const body = Object.keys(meta).length ? { meta } : {};
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body),
  });

  const text = await response.text();
  return {
    ok: response.ok,
    status: response.status,
    statusText: response.statusText,
    body: text,
  };
}

async function redeployLatest({ token, team, project, target, meta }) {
  const query = new URLSearchParams({ projectId: project, limit: '1', state: 'READY', target });
  if (team) {
    query.set('teamId', team);
  }

  const listResponse = await fetch(`https://api.vercel.com/v6/deployments?${query}`, {
    headers: {
      authorization: `Bearer ${token}`,
    },
  });

  if (!listResponse.ok) {
    const errorText = await listResponse.text();
    throw new Error(`Failed to fetch deployments (${listResponse.status}): ${errorText}`);
  }

  const data = await listResponse.json();
  const deployment = data?.deployments?.[0];
  assert(deployment, 'No deployments found to redeploy. Ensure a prior production build exists.');

  const redeployUrl = new URL(`https://api.vercel.com/v13/deployments/${deployment.uid}/redeploy`);
  if (team) {
    redeployUrl.searchParams.set('teamId', team);
  }

  const redeployResponse = await fetch(redeployUrl, {
    method: 'POST',
    headers: {
      authorization: `Bearer ${token}`,
      'content-type': 'application/json',
    },
    body: JSON.stringify({ target, meta }),
  });

  const payload = await redeployResponse.json().catch(() => ({}));

  if (!redeployResponse.ok) {
    throw new Error(`Failed to trigger redeploy (${redeployResponse.status}): ${JSON.stringify(payload)}`);
  }

  return {
    ok: true,
    status: redeployResponse.status,
    deploymentId: payload?.id || deployment.uid,
    inspectorUrl: payload?.inspectorUrl || deployment?.inspectorUrl || null,
  };
}

function output(result, jsonOutput) {
  if (jsonOutput) {
    console.log(JSON.stringify(result, null, 2));
  } else {
    if (result.ok) {
      console.log('✅ Deployment trigger initiated successfully.');
      if (result.deploymentId) {
        console.log(`   Deployment ID: ${result.deploymentId}`);
      }
      if (result.inspectorUrl) {
        console.log(`   Inspector URL: ${result.inspectorUrl}`);
      }
      if (result.status) {
        console.log(`   Status Code: ${result.status}`);
      }
    } else {
      console.error('❌ Deployment trigger failed.');
      console.error(`   Status Code: ${result.status}`);
      console.error(`   Status Text: ${result.statusText}`);
      if (result.body) {
        console.error(`   Body: ${result.body}`);
      }
      process.exitCode = 1;
    }
  }
}

async function main() {
  try {
    const options = parseArgs(process.argv.slice(2));
    if (options.help) {
      console.log(HELP_TEXT);
      return;
    }

    if (options.dryRun) {
      const plan = {
        mode: options.deployHook ? 'deploy-hook' : 'redeploy-latest',
        target: options.target,
        meta: options.meta,
        hasToken: Boolean(options.token),
        hasProject: Boolean(options.project),
        hasTeam: Boolean(options.team),
        deployHook: options.deployHook ? '[provided]' : null,
      };
      output({ ok: true, plan }, options.json);
      return;
    }

    if (options.deployHook) {
      const result = await triggerDeployHook(options.deployHook, options);
      output(result, options.json);
      return;
    }

    assert(options.token, 'Missing Vercel token. Provide --token or set VERCEL_TOKEN.');
    assert(options.project, 'Missing Vercel project ID. Provide --project or set VERCEL_PROJECT_ID.');

    const result = await redeployLatest(options);
    output(result, options.json);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    if (process.argv.includes('--json')) {
      console.log(JSON.stringify({ ok: false, error: message }));
    } else {
      console.error('❌', message);
      console.error('Use --help for usage information.');
    }
    process.exitCode = 1;
  }
}

main();
