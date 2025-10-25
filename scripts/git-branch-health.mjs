#!/usr/bin/env node
import { execSync } from 'node:child_process';
import process from 'node:process';

const args = process.argv.slice(2);
const hasFlag = (flag) => args.includes(flag);
const getFlagValue = (flag) => {
  const index = args.indexOf(flag);
  if (index === -1) return undefined;
  return args[index + 1];
};

const remoteName = getFlagValue('--remote') || process.env.GIT_REMOTE_NAME || 'origin';
const focusBranch = getFlagValue('--branch') || process.env.GIT_BRANCH;
const outputJson = hasFlag('--json');
const skipFetch = hasFlag('--no-fetch');

const execOptions = { stdio: 'pipe', encoding: 'utf8' };

const run = (command, options = execOptions) => {
  return execSync(command, options).toString().trim();
};

const tryRun = (command, options = execOptions) => {
  try {
    return run(command, options);
  } catch (error) {
    return null;
  }
};

const data = {
  remote: {
    name: remoteName,
    url: null,
    headBranch: null,
    fetchAttempted: false,
    fetchError: null,
  },
  workingTree: {
    currentBranch: null,
    dirty: false,
    conflicted: false,
  },
  branches: [],
  suggestions: [],
  errors: [],
};

const warn = (message) => {
  data.suggestions.push(message);
  if (!outputJson) {
    console.warn(message);
  }
};

const error = (message) => {
  data.errors.push(message);
  if (!outputJson) {
    console.error(message);
  }
};

const remotesRaw = tryRun('git remote');
const remotes = remotesRaw ? remotesRaw.split(/\s+/).filter(Boolean) : [];

if (!remotes.includes(remoteName)) {
  error(`لم يتم العثور على المستودع البعيد "${remoteName}". استخدم \`git remote add ${remoteName} <url>\` ثم أعد المحاولة.`);
  if (outputJson) {
    console.log(JSON.stringify(data, null, 2));
  }
  process.exit(1);
}

data.remote.url = tryRun(`git remote get-url ${remoteName}`);

data.workingTree.currentBranch = tryRun('git rev-parse --abbrev-ref HEAD');

const statusOutput = tryRun('git status --porcelain=v1');
if (statusOutput && statusOutput.length > 0) {
  data.workingTree.dirty = true;
  warn('هناك تغييرات محلية غير مثبتة. نفّذ git commit أو git stash قبل الدمج.');
}

const conflictOutput = tryRun('git ls-files -u');
if (conflictOutput && conflictOutput.length > 0) {
  data.workingTree.conflicted = true;
  warn('تم العثور على تعارضات دمج غير محلولة. عالجها ثم نفّذ git add لحلها.');
}

if (!skipFetch) {
  data.remote.fetchAttempted = true;
  try {
    if (!outputJson) {
      console.log(`⏬ جلب التحديثات من ${remoteName}...`);
    }
    run(`git fetch ${remoteName} --prune`, { stdio: 'inherit' });
  } catch (fetchErr) {
    data.remote.fetchError = fetchErr.message;
    error('فشل أمر git fetch. تأكد من صحة بيانات الوصول أو حاول مرة أخرى لاحقًا.');
  }
}

const remoteShow = tryRun(`git remote show ${remoteName}`);
if (remoteShow) {
  const headLine = remoteShow
    .split('\n')
    .map((line) => line.trim())
    .find((line) => line.toLowerCase().startsWith('head branch:'));
  if (headLine) {
    data.remote.headBranch = headLine.split(':')[1].trim();
  }
}

const localBranchesRaw = tryRun("git for-each-ref --format='%(refname:short)' refs/heads");
const remoteBranchesRaw = tryRun(`git for-each-ref --format='%(refname:short)' refs/remotes/${remoteName}`);

const localBranches = localBranchesRaw
  ? localBranchesRaw
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean)
  : [];
const remoteBranches = remoteBranchesRaw
  ? remoteBranchesRaw
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean)
  : [];

const remoteBranchExists = (branch) => remoteBranches.includes(`${remoteName}/${branch}`);
const localBranchExists = (branch) => localBranches.includes(branch);

const focusCandidates = new Set();
if (data.workingTree.currentBranch) {
  focusCandidates.add(data.workingTree.currentBranch);
}
if (focusBranch) {
  focusCandidates.add(focusBranch);
}
if (data.remote.headBranch) {
  focusCandidates.add(data.remote.headBranch);
}

const toInspect = Array.from(focusCandidates);

const branchReport = (branchName) => {
  const localExists = localBranchExists(branchName);
  const remoteExists = remoteBranchExists(branchName);

  const record = {
    branch: branchName,
    localExists,
    remoteExists,
    ahead: null,
    behind: null,
    status: 'unknown',
  };

  if (!localExists) {
    warn(`الفرع المحلي ${branchName} غير موجود. إذا كان هذا هو فرع الإنتاج فتأكد من سحبه عبر git checkout ${branchName}.`);
  }
  if (!remoteExists) {
    warn(`الفرع ${branchName} غير موجود على المستودع البعيد ${remoteName}. قد تحتاج إلى دفعه أو التحقق من اسم الفرع.`);
  }

  if (localExists && remoteExists) {
    const aheadBehindRaw = tryRun(`git rev-list --left-right --count ${remoteName}/${branchName}...${branchName}`);
    if (aheadBehindRaw) {
      const [behindStr, aheadStr] = aheadBehindRaw.split('\t');
      const behind = Number.parseInt(behindStr, 10);
      const ahead = Number.parseInt(aheadStr, 10);
      record.ahead = Number.isNaN(ahead) ? null : ahead;
      record.behind = Number.isNaN(behind) ? null : behind;

      if (ahead === 0 && behind === 0) {
        record.status = 'up-to-date';
      } else if (ahead > 0 && behind === 0) {
        record.status = 'ahead';
        warn(`الفرع ${branchName} يحتوي على ${ahead} التزام/التزامات غير مدفوعة. نفّذ git push ${remoteName} ${branchName}.`);
      } else if (behind > 0 && ahead === 0) {
        record.status = 'behind';
        warn(`الفرع ${branchName} متأخر بـ ${behind} التزام/التزامات. نفّذ git pull ${remoteName} ${branchName} أو rebase لمزامنة التغييرات.`);
      } else if (ahead > 0 && behind > 0) {
        record.status = 'diverged';
        warn(`الفرع ${branchName} متباعد عن ${remoteName}/${branchName}. قم بتنفيذ git pull --rebase أو git merge لحل التعارضات.`);
      }
    }
  }

  data.branches.push(record);
};

toInspect.forEach(branchReport);

if (!outputJson) {
  console.log('\n📊 تقرير تباعد الفروع');
  data.branches.forEach((branch) => {
    console.log(`- ${branch.branch}`);
    console.log(`  • محلي: ${branch.localExists ? '✔️' : '❌'}`);
    console.log(`  • بعيد: ${branch.remoteExists ? '✔️' : '❌'}`);
    if (branch.ahead !== null && branch.behind !== null) {
      console.log(`  • حالة: ${branch.status} (ahead: ${branch.ahead}, behind: ${branch.behind})`);
    } else {
      console.log(`  • حالة: ${branch.status}`);
    }
  });

  if (data.suggestions.length > 0) {
    console.log('\n🔧 توصيات');
    data.suggestions.forEach((item) => console.log(`- ${item}`));
  }

  if (data.errors.length > 0) {
    console.log('\n⛔ أخطاء');
    data.errors.forEach((item) => console.log(`- ${item}`));
  }
} else {
  console.log(JSON.stringify(data, null, 2));
}
