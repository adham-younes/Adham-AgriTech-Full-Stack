#!/usr/bin/env node
import { spawnSync } from 'node:child_process'
import { existsSync, readFileSync } from 'node:fs'
import { resolve } from 'node:path'

const args = process.argv.slice(2)

const flags = new Set()
let syncOnly = false
let deployOnly = false

for (const arg of args) {
  if (arg === '--dry-run' || arg === '--skip-build' || arg === '--no-prebuilt') {
    flags.add(arg)
  } else if (arg === '--no-sync') {
    flags.add(arg)
  } else if (arg === '--sync-only') {
    syncOnly = true
  } else if (arg === '--deploy-only') {
    deployOnly = true
  }
}

const dryRun = flags.has('--dry-run')
const skipGitSync = flags.has('--no-sync') || deployOnly

const publishEnv = loadPublishEnv()
const mergedEnv = { ...process.env, ...publishEnv }

const missing = validateEnv(mergedEnv)
if (missing.length > 0) {
  const header = dryRun
    ? '\n⚠️  المتغيرات التالية غير مضبوطة. سيتم المتابعة لأن الوضع التجريبي (`--dry-run`) مفعل:'
    : '\n❌ المتغيرات التالية مطلوبة قبل تنفيذ النشر الطارئ:'

  console[dryRun ? 'warn' : 'error'](header)
  for (const item of missing) {
    console[dryRun ? 'warn' : 'error'](`   • ${item}`)
  }

  if (!dryRun) {
    console.error('\nأكمل القيم داخل `.env.publish` أو عبر متغيرات البيئة ثم أعد المحاولة.')
    process.exit(1)
  }

  console.warn('\n💡 يمكن استخدام هذا التشغيل التجريبي لتجهيز الإعدادات دون تنفيذ أي أوامر فعلية.')
}

if (!skipGitSync) {
  maybeSyncGit(mergedEnv, dryRun)
  if (syncOnly) {
    process.exit(0)
  }
}

runReadiness(mergedEnv, dryRun)

if (deployOnly && skipGitSync) {
  // readiness already executed, continue
} else if (deployOnly) {
  // unreachable but keep branch for clarity
}

runDirectDeploy(args, mergedEnv, dryRun)

function loadPublishEnv() {
  const envPath = resolve('.env.publish')
  if (!existsSync(envPath)) {
    return {}
  }

  const overrides = {}
  const content = readFileSync(envPath, 'utf8')
  for (const rawLine of content.split(/\r?\n/)) {
    const line = rawLine.trim()
    if (!line || line.startsWith('#')) continue
    const [key, ...rest] = line.split('=')
    const value = rest.join('=')
    overrides[key.trim()] = stripQuotes(value.trim())
  }

  console.log('ℹ️  تم تحميل إعدادات النشر من `.env.publish`.')
  return overrides
}

function stripQuotes(value) {
  if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
    return value.slice(1, -1)
  }
  return value
}

function validateEnv(env) {
  const missing = []
  if (!hasValue(env.VERCEL_TOKEN)) {
    missing.push('VERCEL_TOKEN')
  }
  if (!hasValue(env.VERCEL_PROJECT) && !hasValue(env.VERCEL_PROJECT_ID)) {
    missing.push('VERCEL_PROJECT أو VERCEL_PROJECT_ID')
  }
  return missing
}

function hasValue(value) {
  return typeof value === 'string' && value.trim().length > 0
}

function maybeSyncGit(env, dryRunFlag) {
  const remoteUrl = env.GIT_REMOTE_URL
  if (!hasValue(remoteUrl)) {
    console.warn('⚠️  لم يتم تحديد `GIT_REMOTE_URL`، سيتم تخطي مزامنة Git.')
    return
  }

  const syncArgs = ['scripts/git-auto-sync.mjs', '--remote-url', remoteUrl]
  if (hasValue(env.GIT_BRANCH)) {
    syncArgs.push('--branch', env.GIT_BRANCH)
  }
  if (hasValue(env.GIT_REMOTE_NAME)) {
    syncArgs.push('--remote', env.GIT_REMOTE_NAME)
  }
  if (env.GIT_SET_UPSTREAM === 'true') {
    syncArgs.push('--set-upstream')
  }
  if (dryRunFlag) {
    syncArgs.push('--dry-run')
  }

  console.log('\n🔄  بدء مزامنة المستودع البعيد ...')
  runNodeScript(syncArgs, env, dryRunFlag)
}

function runReadiness(env, dryRunFlag) {
  console.log('\n🛡️  تشغيل فحص جاهزية النشر ...')
  const result = spawnSync(process.execPath, ['scripts/vercel-readiness.mjs'], {
    stdio: 'inherit',
    env,
  })

  if (result.status === 1) {
    if (dryRunFlag) {
      console.warn(
        '\n⚠️  فشل فحص الجاهزية أثناء الوضع التجريبي. راجع الرسائل أعلاه واضبط المتغيرات قبل التنفيذ الحقيقي.',
      )
    } else {
      console.error('\n❌ فشل فحص الجاهزية. راجع الإخراج أعلاه لمعالجة المشكلات قبل إعادة المحاولة.')
      process.exit(1)
    }
  }

  if (result.status === 2) {
    console.warn('\n⚠️  فحص الجاهزية انتهى بتحذيرات. سيتم المتابعة، لكن يفضل معالجة التحذيرات قريبًا.')
  }
}

function runDirectDeploy(cliArgs, env, dryRunFlag) {
  console.log('\n🚀  بدء النشر المباشر إلى Vercel ...')
  const passThrough = []
  for (let i = 0; i < cliArgs.length; i++) {
    const arg = cliArgs[i]
    if (arg === '--no-sync' || arg === '--sync-only' || arg === '--deploy-only') {
      continue
    }
    passThrough.push(arg)
  }

  // تمرير الميتا من الملف في حال تم تحديدها
  if (hasValue(env.VERCEL_DEPLOY_META_KEY) && hasValue(env.VERCEL_DEPLOY_META_VALUE)) {
    if (!passThrough.includes('--meta-key')) {
      passThrough.push('--meta-key', env.VERCEL_DEPLOY_META_KEY)
      passThrough.push('--meta-value', env.VERCEL_DEPLOY_META_VALUE)
    }
  }

  if (dryRunFlag && !passThrough.includes('--dry-run')) {
    passThrough.push('--dry-run')
  }

  if (dryRunFlag && !hasValue(env.VERCEL_TOKEN)) {
    console.warn(
      '\n⚠️  لم يتم تمرير `VERCEL_TOKEN`. تم تخطي خطوة استدعاء النشر المباشر لأن التشغيل تجريبي.',
    )
    console.warn('   أعد التشغيل بدون `--dry-run` بعد ضبط الرموز للتحقق من التنفيذ الفعلي.')
    return
  }

  const result = spawnSync(process.execPath, ['scripts/vercel-direct-deploy.mjs', ...passThrough], {
    stdio: 'inherit',
    env,
  })

  if (result.status !== 0) {
    console.error('\n❌ فشل النشر المباشر. راجع الرسائل أعلاه لمعرفة التفاصيل.')
    process.exit(result.status ?? 1)
  }

  console.log('\n✅ اكتملت عملية النشر الطارئ بنجاح.')
}

function runNodeScript(args, env, dryRunFlag) {
  if (dryRunFlag && !args.includes('--dry-run')) {
    args.push('--dry-run')
  }

  const result = spawnSync(process.execPath, args, {
    stdio: 'inherit',
    env,
  })

  if (result.status !== 0) {
    console.error('\n❌ تعذر إتمام عملية مزامنة Git. راجع التفاصيل أعلاه.')
    process.exit(result.status ?? 1)
  }
}
