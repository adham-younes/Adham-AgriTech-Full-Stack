#!/usr/bin/env node
import { execSync } from 'node:child_process';
import process from 'node:process';

const args = process.argv.slice(2);

const hasFlag = (flag) => args.includes(flag);
const getValue = (flag) => {
  const index = args.indexOf(flag);
  if (index === -1) return undefined;
  return args[index + 1];
};

const dryRun = hasFlag('--dry-run');
const skipBuild = hasFlag('--skip-build');
const noPrebuilt = hasFlag('--no-prebuilt');
const extraBuild = getValue('--build-cmd');

const token = getValue('--token') || process.env.VERCEL_TOKEN;
const project =
  getValue('--project') || process.env.VERCEL_PROJECT || process.env.VERCEL_PROJECT_ID;
const org = getValue('--org') || process.env.VERCEL_TEAM_ID || process.env.VERCEL_ORG_ID;

if (!token && !dryRun) {
  console.error('❌  يجب ضبط `VERCEL_TOKEN` أو تمرير `--token` قبل محاولة النشر المباشر.');
  process.exit(1);
}

const run = (command, options = {}) => {
  if (dryRun) {
    console.log(`↗️  [DRY RUN] ${command}`);
    return;
  }
  const envWithToken = token
    ? { ...process.env, VERCEL_TOKEN: token }
    : { ...process.env };
  execSync(command, { stdio: 'inherit', env: envWithToken, ...options });
};

if (!skipBuild) {
  const buildCommand = extraBuild ? extraBuild : 'pnpm build';
  console.log(`🏗️  تشغيل أمر البناء: ${buildCommand}`);
  run(buildCommand);
} else {
  console.log('⚙️  تم تجاوز خطوة البناء بناءً على الإعدادات.');
}

const tokenForCommand = token ?? '<VERCEL_TOKEN>';
const pullArgs = ['npx', 'vercel', 'pull', '--yes', '--environment=production'];
if (token || dryRun) {
  pullArgs.push('--token', tokenForCommand);
}
if (project) {
  pullArgs.push('--project', project);
}
if (org) {
  pullArgs.push('--org', org);
}

console.log('🔁  مزامنة إعدادات المشروع من Vercel');
run(pullArgs.join(' '));

const deployArgs = ['npx', 'vercel', 'deploy', '--prod', '--yes'];
if (token || dryRun) {
  deployArgs.push('--token', tokenForCommand);
}
if (!noPrebuilt) {
  deployArgs.push('--prebuilt');
}
if (project) {
  deployArgs.push('--project', project);
}
if (org) {
  deployArgs.push('--org', org);
}
const metaKey = getValue('--meta-key');
const metaValue = getValue('--meta-value');
if (metaKey && metaValue) {
  deployArgs.push('--meta', `${metaKey}=${metaValue}`);
}

console.log('🚀  تنفيذ نشر مباشر إلى Vercel');
run(deployArgs.join(' '));

console.log('✅  اكتملت عملية النشر المباشر. تحقق من لوحة التحكم على Vercel للتأكد من الحالة.');
