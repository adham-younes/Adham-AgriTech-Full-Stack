#!/usr/bin/env node

const https = require('https');
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
  reset: '\x1b[0m',
  bold: '\x1b[1m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function makeRequest(url, options = {}) {
  return new Promise((resolve, reject) => {
    const req = https.request(url, options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          resolve({ status: res.statusCode, data: json });
        } catch (e) {
          resolve({ status: res.statusCode, data: data });
        }
      });
    });
    
    req.on('error', reject);
    req.setTimeout(10000, () => {
      req.destroy();
      reject(new Error('Request timeout'));
    });
    
    if (options.body) {
      req.write(options.body);
    }
    req.end();
  });
}

async function testSupabase() {
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
      return true;
    } else {
      log(`❌ Supabase: Error ${response.status}`, 'red');
      return false;
    }
  } catch (error) {
    log(`❌ Supabase: ${error.message}`, 'red');
    return false;
  }
}

async function testOpenAI() {
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
      return true;
    } else {
      log(`❌ OpenAI: Error ${response.status}`, 'red');
      log(`   Response: ${JSON.stringify(response.data)}`, 'red');
      return false;
    }
  } catch (error) {
    log(`❌ OpenAI: ${error.message}`, 'red');
    return false;
  }
}

async function testInfura() {
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
      return true;
    } else {
      log(`❌ Infura: Error ${response.status}`, 'red');
      return false;
    }
  } catch (error) {
    log(`❌ Infura: ${error.message}`, 'red');
    return false;
  }
}

async function testEtherscan() {
  try {
    log('\n🔍 Testing Etherscan...', 'blue');
    const response = await makeRequest(`https://api-sepolia.etherscan.io/api?module=account&action=balance&address=0xAff150d1F86D37c13b6b764f3F62569f4fE27c89&apikey=${process.env.NEXT_PUBLIC_ETHERSCAN_API_KEY}`);
    
    if (response.status === 200) {
      if (response.data.status === '1') {
        log('✅ Etherscan: Working perfectly!', 'green');
        log(`   Balance: ${response.data.result} wei`, 'green');
        return true;
      } else {
        log(`⚠️  Etherscan: ${response.data.message}`, 'yellow');
        return false;
      }
    } else {
      log(`❌ Etherscan: Error ${response.status}`, 'red');
      return false;
    }
  } catch (error) {
    log(`❌ Etherscan: ${error.message}`, 'red');
    return false;
  }
}

async function testOpenWeather() {
  try {
    log('\n🌤️  Testing OpenWeather...', 'blue');
    if (!process.env.OPENWEATHER_API_KEY || process.env.OPENWEATHER_API_KEY === 'your-openweather-api-key-here') {
      log('❌ OpenWeather: API key not configured', 'red');
      log('   Please get your API key from: https://openweathermap.org/api', 'yellow');
      return false;
    }
    
    const response = await makeRequest(`https://api.openweathermap.org/data/2.5/weather?q=Luxor,EG&appid=${process.env.OPENWEATHER_API_KEY}&units=metric&lang=ar`);
    
    if (response.status === 200 && response.data.main) {
      log('✅ OpenWeather: Working perfectly!', 'green');
      log(`   Temperature: ${response.data.main.temp}°C`, 'green');
      return true;
    } else {
      log(`❌ OpenWeather: Error ${response.status}`, 'red');
      return false;
    }
  } catch (error) {
    log(`❌ OpenWeather: ${error.message}`, 'red');
    return false;
  }
}

async function main() {
  log('🚀 Adham AgriTech - API Status Checker', 'bold');
  log('=====================================', 'bold');
  
  const results = {
    supabase: await testSupabase(),
    openai: await testOpenAI(),
    infura: await testInfura(),
    etherscan: await testEtherscan(),
    openweather: await testOpenWeather()
  };
  
  const working = Object.values(results).filter(Boolean).length;
  const total = Object.keys(results).length;
  
  log('\n📊 Summary:', 'bold');
  log('==========', 'bold');
  log(`✅ Working: ${working}/${total} APIs`, working === total ? 'green' : 'yellow');
  
  if (working < total) {
    log('\n🔧 Next Steps:', 'yellow');
    if (!results.openweather) {
      log('1. Get OpenWeather API key: https://openweathermap.org/api', 'yellow');
    }
    if (!results.etherscan) {
      log('2. Update Etherscan to V2 API', 'yellow');
    }
  }
  
  log('\n🎉 API testing complete!', 'green');
}

main().catch(console.error);
