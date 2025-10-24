#!/usr/bin/env node

const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');

// Load environment variables from .env.local
const envPath = path.join(__dirname, '..', '.env.local');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  envContent.split('\n').forEach(line => {
    const [key, ...valueParts] = line.split('=');
    if (key && valueParts.length > 0) {
      process.env[key.trim()] = valueParts.join('=').trim();
    }
  });
}

const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  magenta: '\x1b[35m',
  reset: '\x1b[0m',
  bold: '\x1b[1m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function makeRequest(url, options = {}) {
  return new Promise((resolve, reject) => {
    const isHttps = url.startsWith('https://');
    const client = isHttps ? https : http;
    
    const req = client.request(url, options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          resolve({ status: res.statusCode, data: json, headers: res.headers });
        } catch (e) {
          resolve({ status: res.statusCode, data: data, headers: res.headers });
        }
      });
    });
    
    req.on('error', reject);
    req.setTimeout(15000, () => {
      req.destroy();
      reject(new Error('Request timeout'));
    });
    
    if (options.body) {
      req.write(options.body);
    }
    req.end();
  });
}

async function testExternalAPIs() {
  log('\n🌐 Testing External APIs...', 'cyan');
  log('============================', 'cyan');
  
  const results = {};
  
  // Test Supabase
  try {
    log('\n🔍 Testing Supabase...', 'blue');
    const response = await makeRequest('https://mxnkwudqxtgduhenrgvm.supabase.co/rest/v1/', {
      headers: {
        'apikey': process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`
      }
    });
    
    if (response.status === 200) {
      log('✅ Supabase: Working perfectly!', 'green');
      results.supabase = true;
    } else {
      log(`❌ Supabase: Error ${response.status}`, 'red');
      results.supabase = false;
    }
  } catch (error) {
    log(`❌ Supabase: ${error.message}`, 'red');
    results.supabase = false;
  }

  // Test OpenAI
  try {
    log('\n🤖 Testing OpenAI...', 'blue');
    const response = await makeRequest('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [{ role: 'user', content: 'مرحباً' }],
        max_tokens: 50
      })
    });
    
    if (response.status === 200 && response.data.choices) {
      log('✅ OpenAI: Working perfectly!', 'green');
      log(`   Response: ${response.data.choices[0].message.content}`, 'green');
      results.openai = true;
    } else {
      log(`❌ OpenAI: Error ${response.status}`, 'red');
      results.openai = false;
    }
  } catch (error) {
    log(`❌ OpenAI: ${error.message}`, 'red');
    results.openai = false;
  }

  // Test Infura
  try {
    log('\n⛓️  Testing Infura...', 'blue');
    const response = await makeRequest('https://sepolia.infura.io/v3/c39b028e09be4c268110c1dcc81b3ebc', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        jsonrpc: '2.0',
        method: 'eth_blockNumber',
        params: [],
        id: 1
      })
    });
    
    if (response.status === 200 && response.data.result) {
      log('✅ Infura: Working perfectly!', 'green');
      log(`   Latest block: ${parseInt(response.data.result, 16)}`, 'green');
      results.infura = true;
    } else {
      log(`❌ Infura: Error ${response.status}`, 'red');
      results.infura = false;
    }
  } catch (error) {
    log(`❌ Infura: ${error.message}`, 'red');
    results.infura = false;
  }

  // Test Etherscan
  try {
    log('\n🔍 Testing Etherscan...', 'blue');
    const response = await makeRequest(`https://api-sepolia.etherscan.io/api?module=account&action=balance&address=0xAff150d1F86D37c13b6b764f3F62569f4fE27c89&apikey=${process.env.NEXT_PUBLIC_ETHERSCAN_API_KEY}`);
    
    if (response.status === 200) {
      if (response.data.status === '1') {
        log('✅ Etherscan: Working perfectly!', 'green');
        log(`   Balance: ${response.data.result} wei`, 'green');
        results.etherscan = true;
      } else {
        log(`⚠️  Etherscan: ${response.data.message}`, 'yellow');
        results.etherscan = false;
      }
    } else {
      log(`❌ Etherscan: Error ${response.status}`, 'red');
      results.etherscan = false;
    }
  } catch (error) {
    log(`❌ Etherscan: ${error.message}`, 'red');
    results.etherscan = false;
  }

  // Test OpenWeather
  try {
    log('\n🌤️  Testing OpenWeather...', 'blue');
    if (!process.env.OPENWEATHER_API_KEY || process.env.OPENWEATHER_API_KEY === 'your-openweather-api-key-here') {
      log('❌ OpenWeather: API key not configured', 'red');
      log('   Please get your API key from: https://openweathermap.org/api', 'yellow');
      results.openweather = false;
    } else {
      const response = await makeRequest(`https://api.openweathermap.org/data/2.5/weather?q=Luxor,EG&appid=${process.env.OPENWEATHER_API_KEY}&units=metric&lang=ar`);
      
      if (response.status === 200 && response.data.main) {
        log('✅ OpenWeather: Working perfectly!', 'green');
        log(`   Temperature: ${response.data.main.temp}°C`, 'green');
        results.openweather = true;
      } else {
        log(`❌ OpenWeather: Error ${response.status}`, 'red');
        results.openweather = false;
      }
    }
  } catch (error) {
    log(`❌ OpenWeather: ${error.message}`, 'red');
    results.openweather = false;
  }

  return results;
}

async function testProductionAPIs() {
  log('\n🌍 Testing Production APIs...', 'cyan');
  log('=============================', 'cyan');
  
  const results = {};
  const baseUrl = 'https://www.adham-agritech.com';
  
  // Test main page
  try {
    log('\n🏠 Testing Main Page...', 'blue');
    const response = await makeRequest(baseUrl);
    
    if (response.status === 200) {
      log('✅ Main Page: Working perfectly!', 'green');
      log(`   Status: ${response.status}`, 'green');
      results.mainPage = true;
    } else {
      log(`❌ Main Page: Error ${response.status}`, 'red');
      results.mainPage = false;
    }
  } catch (error) {
    log(`❌ Main Page: ${error.message}`, 'red');
    results.mainPage = false;
  }

  // Test dashboard
  try {
    log('\n📊 Testing Dashboard...', 'blue');
    const response = await makeRequest(`${baseUrl}/dashboard`);
    
    if (response.status === 200) {
      log('✅ Dashboard: Working perfectly!', 'green');
      log(`   Status: ${response.status}`, 'green');
      results.dashboard = true;
    } else {
      log(`❌ Dashboard: Error ${response.status}`, 'red');
      results.dashboard = false;
    }
  } catch (error) {
    log(`❌ Dashboard: ${error.message}`, 'red');
    results.dashboard = false;
  }

  // Test satellite page
  try {
    log('\n🛰️  Testing Satellite Page...', 'blue');
    const response = await makeRequest(`${baseUrl}/dashboard/satellite`);
    
    if (response.status === 200) {
      log('✅ Satellite Page: Working perfectly!', 'green');
      log(`   Status: ${response.status}`, 'green');
      results.satellite = true;
    } else {
      log(`❌ Satellite Page: Error ${response.status}`, 'red');
      results.satellite = false;
    }
  } catch (error) {
    log(`❌ Satellite Page: ${error.message}`, 'red');
    results.satellite = false;
  }

  return results;
}

async function testAPIFiles() {
  log('\n📁 Testing API Files...', 'cyan');
  log('=======================', 'cyan');
  
  const results = {};
  const apiFiles = [
    'app/api/health/route.ts',
    'app/api/ai-assistant/route.ts',
    'app/api/weather/route.ts',
    'app/api/soil-analysis/recommendations/route.ts'
  ];
  
  apiFiles.forEach(file => {
    const filePath = path.join(__dirname, '..', file);
    if (fs.existsSync(filePath)) {
      log(`✅ ${file}: Exists`, 'green');
      results[file] = true;
    } else {
      log(`❌ ${file}: Missing`, 'red');
      results[file] = false;
    }
  });
  
  return results;
}

async function main() {
  log('🚀 Adham AgriTech - API Testing (Bypass Auth)', 'bold');
  log('==============================================', 'bold');
  
  // Test external APIs
  const externalResults = await testExternalAPIs();
  
  // Test production APIs
  const productionResults = await testProductionAPIs();
  
  // Test API files
  const fileResults = await testAPIFiles();
  
  // Summary
  log('\n📊 Final Summary:', 'bold');
  log('================', 'bold');
  
  const allResults = { ...externalResults, ...productionResults, ...fileResults };
  const working = Object.values(allResults).filter(Boolean).length;
  const total = Object.keys(allResults).length;
  
  log(`\n✅ Working: ${working}/${total} APIs`, working === total ? 'green' : 'yellow');
  
  log('\n📋 Detailed Results:', 'bold');
  log('===================', 'bold');
  
  // External APIs
  log('\n🌐 External APIs:', 'cyan');
  Object.entries(externalResults).forEach(([key, value]) => {
    log(`  ${value ? '✅' : '❌'} ${key}`, value ? 'green' : 'red');
  });
  
  // Production APIs
  log('\n🌍 Production APIs:', 'cyan');
  Object.entries(productionResults).forEach(([key, value]) => {
    log(`  ${value ? '✅' : '❌'} ${key}`, value ? 'green' : 'red');
  });
  
  // API Files
  log('\n📁 API Files:', 'cyan');
  Object.entries(fileResults).forEach(([key, value]) => {
    log(`  ${value ? '✅' : '❌'} ${key}`, value ? 'green' : 'red');
  });
  
  if (working < total) {
    log('\n🔧 Recommendations:', 'yellow');
    if (!externalResults.openweather) {
      log('1. Get OpenWeather API key: https://openweathermap.org/api', 'yellow');
    }
    if (!externalResults.etherscan) {
      log('2. Update Etherscan to V2 API', 'yellow');
    }
  }
  
  log('\n🎉 API testing complete!', 'green');
}

main().catch(console.error);
