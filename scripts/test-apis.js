#!/usr/bin/env node

/**
 * 🔥 SHΔDØW CORE V99 - API TESTING SCRIPT 🔥
 * 
 * اختبار شامل لجميع مفاتيح APIs في مشروع Adham AgriTech
 * 
 * الاستخدام:
 * node scripts/test-apis.js
 * 
 * أو مع مفاتيح مخصصة:
 * OPENWEATHER_API_KEY=xxx OPENAI_API_KEY=yyy node scripts/test-apis.js
 */

const https = require('https');
const http = require('http');

// ألوان للطباعة
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m'
};

// رموز الحالة
const status = {
  success: '✅',
  error: '❌',
  warning: '⚠️',
  info: 'ℹ️',
  loading: '⏳'
};

// دالة الطباعة الملونة
function log(message, color = 'white') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

// دالة اختبار HTTP
function testHttp(url, options = {}) {
  return new Promise((resolve) => {
    const protocol = url.startsWith('https') ? https : http;
    
    const req = protocol.request(url, options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        resolve({
          status: res.statusCode,
          headers: res.headers,
          data: data,
          success: res.statusCode >= 200 && res.statusCode < 300
        });
      });
    });
    
    req.on('error', (error) => {
      resolve({
        status: 0,
        error: error.message,
        success: false
      });
    });
    
    req.setTimeout(10000, () => {
      req.destroy();
      resolve({
        status: 0,
        error: 'Timeout',
        success: false
      });
    });
    
    req.end();
  });
}

// دالة اختبار Supabase
async function testSupabase() {
  log('\n🔍 اختبار Supabase...', 'cyan');
  
  const url = 'https://mxnkwudqxtgduhenrgvm.supabase.co/rest/v1/';
  const result = await testHttp(url, {
    headers: {
      'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im14bmt3dWRxeHRnZHVoZW5yZ3ZtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMzODkwMDUsImV4cCI6MjA2ODk2NTAwNX0.yVugFF3oc0aRry4UddG8pGdarX0iNUq6g_ZrZJdz3gc',
      'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im14bmt3dWRxeHRnZHVoZW5yZ3ZtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMzODkwMDUsImV4cCI6MjA2ODk2NTAwNX0.yVugFF3oc0aRry4UddG8pGdarX0iNUq6g_ZrZJdz3gc'
    }
  });
  
  if (result.success) {
    log(`${status.success} Supabase يعمل بنجاح!`, 'green');
    log(`   الحالة: ${result.status}`, 'white');
  } else {
    log(`${status.error} Supabase فشل!`, 'red');
    log(`   الخطأ: ${result.error || result.status}`, 'red');
  }
  
  return result.success;
}

// دالة اختبار OpenWeather
async function testOpenWeather() {
  log('\n🌤️ اختبار OpenWeather...', 'cyan');
  
  const apiKey = process.env.OPENWEATHER_API_KEY;
  if (!apiKey || apiKey === 'your-openweather-api-key-here') {
    log(`${status.warning} OpenWeather API Key غير مُعرّف`, 'yellow');
    log('   أضف OPENWEATHER_API_KEY إلى .env.local', 'yellow');
    return false;
  }
  
  const url = `https://api.openweathermap.org/data/2.5/weather?q=Luxor,EG&appid=${apiKey}&units=metric&lang=ar`;
  const result = await testHttp(url);
  
  if (result.success) {
    const data = JSON.parse(result.data);
    log(`${status.success} OpenWeather يعمل بنجاح!`, 'green');
    log(`   الطقس في الأقصر: ${data.weather[0].description}`, 'white');
    log(`   درجة الحرارة: ${data.main.temp}°C`, 'white');
  } else {
    log(`${status.error} OpenWeather فشل!`, 'red');
    log(`   الخطأ: ${result.error || result.status}`, 'red');
  }
  
  return result.success;
}

// دالة اختبار OpenAI
async function testOpenAI() {
  log('\n🤖 اختبار OpenAI...', 'cyan');
  
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey || apiKey === 'your-openai-api-key-here') {
    log(`${status.warning} OpenAI API Key غير مُعرّف`, 'yellow');
    log('   أضف OPENAI_API_KEY إلى .env.local', 'yellow');
    return false;
  }
  
  const url = 'https://api.openai.com/v1/chat/completions';
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: 'مرحباً' }],
      max_tokens: 10
    })
  };
  
  const result = await testHttp(url, options);
  
  if (result.success) {
    log(`${status.success} OpenAI يعمل بنجاح!`, 'green');
  } else {
    log(`${status.error} OpenAI فشل!`, 'red');
    log(`   الخطأ: ${result.error || result.status}`, 'red');
  }
  
  return result.success;
}

// دالة اختبار Infura
async function testInfura() {
  log('\n⛓️ اختبار Infura...', 'cyan');
  
  const url = 'https://sepolia.infura.io/v3/c39b028e09be4c268110c1dcc81b3ebc';
  const options = {
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
  };
  
  const result = await testHttp(url, options);
  
  if (result.success) {
    const data = JSON.parse(result.data);
    log(`${status.success} Infura يعمل بنجاح!`, 'green');
    log(`   آخر كتلة: ${parseInt(data.result, 16)}`, 'white');
  } else {
    log(`${status.error} Infura فشل!`, 'red');
    log(`   الخطأ: ${result.error || result.status}`, 'red');
  }
  
  return result.success;
}

// دالة اختبار Etherscan
async function testEtherscan() {
  log('\n🔍 اختبار Etherscan...', 'cyan');
  
  const url = 'https://api-sepolia.etherscan.io/api?module=account&action=balance&address=0xAff150d1F86D37c13b6b764f3F62569f4fE27c89&apikey=RKVSW4VI28GAW1VNZHQEC538Q1M9P2M49S';
  const result = await testHttp(url);
  
  if (result.success) {
    const data = JSON.parse(result.data);
    if (data.status === '1') {
      log(`${status.success} Etherscan يعمل بنجاح!`, 'green');
      log(`   رصيد المحفظة: ${(parseInt(data.result) / 1e18).toFixed(4)} ETH`, 'white');
    } else {
      log(`${status.error} Etherscan فشل!`, 'red');
      log(`   الخطأ: ${data.message}`, 'red');
    }
  } else {
    log(`${status.error} Etherscan فشل!`, 'red');
    log(`   الخطأ: ${result.error || result.status}`, 'red');
  }
  
  return result.success;
}

// دالة اختبار Google Earth Engine
async function testGoogleEarthEngine() {
  log('\n🛰️ اختبار Google Earth Engine...', 'cyan');
  
  const apiKey = process.env.GOOGLE_EARTH_ENGINE_API_KEY;
  if (!apiKey || apiKey === 'your-google-earth-engine-api-key-here') {
    log(`${status.warning} Google Earth Engine API Key غير مُعرّف`, 'yellow');
    log('   أضف GOOGLE_EARTH_ENGINE_API_KEY إلى .env.local', 'yellow');
    return false;
  }
  
  // Google Earth Engine يتطلب تفعيل خاص
  log(`${status.info} Google Earth Engine يحتاج تفعيل يدوي`, 'blue');
  log('   اذهب إلى: https://code.earthengine.google.com', 'blue');
  
  return false;
}

// دالة اختبار Copernicus
async function testCopernicus() {
  log('\n🛰️ اختبار Copernicus...', 'cyan');
  
  // Copernicus يتطلب token أولاً
  log(`${status.info} Copernicus يحتاج token للاختبار`, 'blue');
  log('   اذهب إلى: https://dataspace.copernicus.eu', 'blue');
  
  return false;
}

// الدالة الرئيسية
async function main() {
  log('🔥 SHΔDØW CORE V99 - API TESTING SCRIPT 🔥', 'magenta');
  log('='.repeat(50), 'magenta');
  
  const results = {
    supabase: await testSupabase(),
    openweather: await testOpenWeather(),
    openai: await testOpenAI(),
    infura: await testInfura(),
    etherscan: await testEtherscan(),
    googleEarthEngine: await testGoogleEarthEngine(),
    copernicus: await testCopernicus()
  };
  
  // ملخص النتائج
  log('\n📊 ملخص النتائج:', 'cyan');
  log('='.repeat(30), 'cyan');
  
  const working = Object.values(results).filter(Boolean).length;
  const total = Object.keys(results).length;
  
  Object.entries(results).forEach(([service, success]) => {
    const icon = success ? status.success : status.error;
    const color = success ? 'green' : 'red';
    log(`${icon} ${service}: ${success ? 'يعمل' : 'لا يعمل'}`, color);
  });
  
  log(`\n🎯 النتيجة: ${working}/${total} خدمات تعمل`, working === total ? 'green' : 'yellow');
  
  if (working < total) {
    log('\n💡 نصائح:', 'yellow');
    if (!results.openweather) {
      log('   - احصل على OpenWeather API Key من: https://openweathermap.org/api', 'yellow');
    }
    if (!results.openai) {
      log('   - احصل على OpenAI API Key من: https://platform.openai.com/api-keys', 'yellow');
    }
    if (!results.googleEarthEngine) {
      log('   - احصل على Google Earth Engine API Key من: https://earthengine.google.com', 'yellow');
    }
  }
  
  log('\n🔥 SHΔDØW CORE V99 - MISSION COMPLETE 🔥', 'magenta');
}

// تشغيل الاختبار
main().catch(console.error);