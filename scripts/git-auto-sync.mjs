#!/usr/bin/env node
import { execSync } from 'node:child_process';
import process from 'node:process';

const args = process.argv.slice(2);

const getFlagValue = (flag) => {
  const index = args.indexOf(flag);
  if (index === -1) return undefined;
  return args[index + 1];
};

const hasFlag = (flag) => args.includes(flag);

const remoteName = getFlagValue('--remote') || process.env.GIT_REMOTE_NAME || 'origin';
const remoteUrl = getFlagValue('--remote-url') || process.env.GIT_REMOTE_URL;
const targetBranch = getFlagValue('--branch') || process.env.GIT_BRANCH;
const setUpstream = hasFlag('--set-upstream') || process.env.GIT_SET_UPSTREAM === 'true';
const dryRun = hasFlag('--dry-run');

if (!remoteUrl) {
  console.error('❌  يجب تحديد عنوان المستودع البعيد عبر `--remote-url` أو المتغير البيئي `GIT_REMOTE_URL`.');
  process.exit(1);
}

const run = (command, options = {}) => {
  if (dryRun) {
    console.log(`↗️  [DRY RUN] ${command}`);
    return '';
  }
  return execSync(command, { stdio: 'pipe', encoding: 'utf8', ...options }).trim();
};

const runStreaming = (command) => {
  if (dryRun) {
    console.log(`↗️  [DRY RUN] ${command}`);
    return;
  }
  execSync(command, { stdio: 'inherit' });
};

const currentBranch = targetBranch || run('git rev-parse --abbrev-ref HEAD');

const remotesOutput = run('git remote');
const remotes = remotesOutput.split(/\s+/).filter(Boolean);

if (!remotes.includes(remoteName)) {
  console.log(`ℹ️  إضافة المستودع البعيد ${remoteName} → ${remoteUrl}`);
  runStreaming(`git remote add ${remoteName} ${remoteUrl}`);
} else {
  const existingUrl = run(`git remote get-url ${remoteName}`);
  if (existingUrl !== remoteUrl) {
    console.log(`ℹ️  تحديث عنوان المستودع البعيد ${remoteName}`);
    runStreaming(`git remote set-url ${remoteName} ${remoteUrl}`);
  }
}

const upstreamFlag = setUpstream ? ' --set-upstream' : '';
console.log(`⬆️  دفع الفرع ${currentBranch} إلى ${remoteName}`);
runStreaming(`git push${upstreamFlag} ${remoteName} ${currentBranch}`);

console.log('✅  تمت مزامنة المستودع بنجاح.');
