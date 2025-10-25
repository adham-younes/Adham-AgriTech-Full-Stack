#!/usr/bin/env node

const https = require('https');
const fs = require('fs');
const path = require('path');

// --- Configuration ---
const DOTENV_PATH = path.join(__dirname, '..', '.env.local');
const REQUEST_TIMEOUT = 10000; // 10 seconds

// --- ANSI Colors for Logging ---
const colors = {
  green: '\x1b[32m', red: '\x1b[31m', yellow: '\x1b[33m',
  blue: '\x1b[34m', magenta: '\x1b[35m', cyan: '\x1b[36m',
  reset: '\x1b[0m', bold: '\x1b[1m'
};

// --- Helper Functions ---
function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function loadEnv() {
  if (fs.existsSync(DOTENV_PATH)) {
    const content = fs.readFileSync(DOTENV_PATH, 'utf8');
    content.split(/\r?\n/).forEach(line => {
      const match = line.match(/^([^=:#]+)=(.*)$/);
      if (match) {
        const key = match[1].trim();
        const value = match[2].trim().replace(/['"]/g, '');
        if (!process.env[key]) {
          process.env[key] = value;
        }
      }
    });
  }
}

function makeRequest(url, options = {}) {
  return new Promise((resolve, reject) => {
    const req = https.request(url, options, res => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, data: JSON.parse(data) });
        } catch (e) {
          resolve({ status: res.statusCode, data });
        }
      });
    });
    req.on('error', reject);
    req.setTimeout(REQUEST_TIMEOUT, () => {
      req.destroy();
      reject(new Error('Request timeout'));
    });
    if (options.body) req.write(options.body);
    req.end();
  });
}

// --- Test Definitions ---
const tests = [
  {
    name: 'Supabase',
    emoji: '🔍',
    requiredEnv: ['NEXT_PUBLIC_SUPABASE_URL', 'NEXT_PUBLIC_SUPABASE_ANON_KEY'],
    run: async () => {
      const url = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/`;
      const headers = {
        'apikey': process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`
      };
      const res = await makeRequest(url, { headers });
      if (res.status !== 200) throw new Error(`Received status ${res.status}`);
      log('   Service is responsive.', 'green');
    }
  },
  {
    name: 'OpenAI',
    emoji: '🤖',
    requiredEnv: ['OPENAI_API_KEY'],
    run: async () => {
      const body = JSON.stringify({
        model: 'gpt-4o-mini', messages: [{ role: 'user', content: 'Hi' }], max_tokens: 10
      });
      const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
      };
      const res = await makeRequest('https://api.openai.com/v1/chat/completions', { method: 'POST', headers, body });
      if (res.status !== 200) throw new Error(`Received status ${res.status}: ${res.data?.error?.message || 'Unknown error'}`);
      if (!res.data.choices) throw new Error('Invalid response structure.');
      log(`   Responded successfully.`, 'green');
    }
  },
  {
    name: 'Infura',
    emoji: '⛓️',
    requiredEnv: ['INFURA_PROJECT_ID'],
    run: async () => {
      const body = JSON.stringify({ jsonrpc: '2.0', method: 'eth_blockNumber', params: [], id: 1 });
      const headers = { 'Content-Type': 'application/json' };
      const url = `https://sepolia.infura.io/v3/${process.env.INFURA_PROJECT_ID}`;
      const res = await makeRequest(url, { method: 'POST', headers, body });
      if (res.status !== 200 || !res.data.result) throw new Error(`Received status ${res.status} or invalid result.`);
      log(`   Latest block: ${parseInt(res.data.result, 16)}`, 'green');
    }
  },
  {
    name: 'Etherscan',
    emoji: '🔍',
    requiredEnv: ['ETHERSCAN_API_KEY'],
    run: async () => {
      const url = `https://api-sepolia.etherscan.io/api?module=account&action=balance&address=0xde0b295669a9fd93d5f28d9ec85e40f4cb697bae&apikey=${process.env.ETHERSCAN_API_KEY}`;
      const res = await makeRequest(url);
      if (res.data.status !== '1') throw new Error(`API returned error: ${res.data.message} - ${res.data.result}`);
      log(`   Successfully queried balance.`, 'green');
    }
  },
  {
    name: 'OpenWeather',
    emoji: '🌤️',
    requiredEnv: ['OPENWEATHER_API_KEY'],
    run: async () => {
      const url = `https://api.openweathermap.org/data/2.5/weather?q=Luxor,EG&appid=${process.env.OPENWEATHER_API_KEY}`;
      const res = await makeRequest(url);
      if (res.status !== 200 || !res.data.main) throw new Error(`Received status ${res.status}`);
      log(`   Current temp in Luxor: ${res.data.main.temp}°C`, 'green');
    }
  }
];

// --- Main Execution Logic ---
async function main() {
  loadEnv();
  log('🚀 Adham AgriTech - API Status Checker', 'bold');
  log('=====================================', 'bold');

  const results = { passed: 0, failed: 0, skipped: 0 };
  const remedialSteps = [];

  for (const test of tests) {
    log(`\n${test.emoji} Testing ${test.name}...`, 'blue');
    
    const missingKeys = test.requiredEnv.filter(key => !process.env[key] || process.env[key].startsWith('your-'));
    
    if (missingKeys.length > 0) {
      results.skipped++;
      log(`   SKIPPED: Missing required environment variable(s): ${missingKeys.join(', ')}`, 'yellow');
      remedialSteps.push(`[${test.name}] Set the following environment variable(s) in .env.local: ${missingKeys.join(', ')}`);
      continue;
    }

    try {
      await test.run();
      results.passed++;
      log(`✅ ${test.name}: Passed`, 'green');
    } catch (error) {
      results.failed++;
      log(`❌ ${test.name}: FAILED - ${error.message}`, 'red');
      remedialSteps.push(`[${test.name}] Check credentials and service status. Error: ${error.message}`);
    }
  }

  log('\n📊 Final Summary:', 'bold');
  log('===============', 'bold');
  log(`   ✅ Passed:  ${results.passed}`, 'green');
  log(`   ❌ Failed:  ${results.failed}`, 'red');
  log(`   ⏩ Skipped: ${results.skipped}`, 'yellow');

  if (remedialSteps.length > 0) {
    log('\n🔧 Remedial Steps:', 'cyan');
    remedialSteps.forEach((step, i) => log(`   ${i + 1}. ${step}`, 'cyan'));
  }

  log('\n🎉 API testing complete!', 'bold');
  
  if (results.failed > 0) {
    process.exit(1); // Exit with error code if any test failed
  }
}

main().catch(error => {
  log(`\n🚨 A critical error occurred: ${error.message}`, 'red');
  process.exit(1);
});
