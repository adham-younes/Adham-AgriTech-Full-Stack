# دليل الإعداد الكامل - Adham AgriTech
## Complete Setup Guide

**آخر تحديث / Last Updated:** 7 أكتوبر 2025 / October 7, 2025

---

## 📋 جدول المحتويات / Table of Contents

1. [المتطلبات الأساسية](#المتطلبات-الأساسية--prerequisites)
2. [تثبيت المشروع](#تثبيت-المشروع--project-installation)
3. [إعداد قاعدة البيانات](#إعداد-قاعدة-البيانات--database-setup)
4. [إعداد مفاتيح API](#إعداد-مفاتيح-api--api-keys-setup)
5. [تشغيل التطبيق](#تشغيل-التطبيق--running-the-app)
6. [إنشاء بيانات تجريبية](#إنشاء-بيانات-تجريبية--creating-test-data)
7. [حل المشاكل](#حل-المشاكل--troubleshooting)

---

## المتطلبات الأساسية / Prerequisites

### Required Software
```bash
✅ Node.js v18+ or v20+
✅ pnpm v8+ (preferred) or npm/yarn
✅ Git
✅ Modern web browser (Chrome, Firefox, Safari, Edge)
✅ Code editor (VS Code recommended)
```

### Accounts Needed
```bash
✅ Supabase account (already configured)
✅ OpenWeather API account (free tier)
✅ OpenAI API account (paid, for AI features)
✅ Mapbox account (already configured)
✅ Planet Labs account (already configured)
```

---

## تثبيت المشروع / Project Installation

### Step 1: Clone Repository (if needed)
```bash
# If you haven't cloned yet
git clone <repository-url>
cd <project-directory>
```

### Step 2: Install Dependencies
```bash
# Using pnpm (recommended)
pnpm install

# Or using npm
npm install

# Or using yarn
yarn install
```

**Expected Output:**
```
✅ Packages: +257
✅ No critical errors
⚠️ Build script warnings (normal, can be ignored)
```

### Step 3: Verify Installation
```bash
# Check if node_modules exists
ls -la node_modules | head -10

# Check package versions
pnpm list --depth=0
```

---

## إعداد قاعدة البيانات / Database Setup

### Step 1: Access Supabase Dashboard

1. Go to: https://supabase.com/dashboard
2. Log in with your account
3. Select your project: `fqiyunkcubguuwzdkmoc`
4. Go to **SQL Editor** in left sidebar

### Step 2: Execute SQL Scripts (IN ORDER!)

**⚠️ IMPORTANT: Execute scripts in this exact order!**

#### Script 1: Helper Functions
```sql
-- File: scripts/000_create_functions.sql
-- Copy and paste entire content, then click "Run"
```

#### Script 2: User Profiles
```sql
-- File: scripts/001_create_profiles.sql
-- This creates the profiles table and auto-trigger
```

#### Script 3: Farms
```sql
-- File: scripts/002_create_farms.sql
-- This creates farms table with RLS policies
```

#### Script 4: Fields
```sql
-- File: scripts/003_create_fields.sql
-- This creates fields table linked to farms
```

#### Script 5: Soil Analysis
```sql
-- File: scripts/004_create_soil_analysis.sql
-- This creates soil analysis table
```

#### Script 6: Crop Monitoring
```sql
-- File: scripts/005_create_crop_monitoring.sql
-- This creates crop monitoring table
```

#### Script 7: Weather Data
```sql
-- File: scripts/006_create_weather_data.sql
-- This creates weather data storage
```

#### Script 8: Irrigation Systems
```sql
-- File: scripts/007_create_irrigation_systems.sql
-- This creates irrigation management tables
```

#### Script 9: Notifications
```sql
-- File: scripts/008_create_notifications.sql
-- This creates notifications system
```

#### Script 10: AI Chat
```sql
-- File: scripts/009_create_ai_chat.sql
-- This creates AI chat history table
```

#### Script 11: Reports
```sql
-- File: scripts/010_create_reports.sql
-- This creates reports system
```

#### Script 12: Marketplace
```sql
-- File: scripts/011_create_marketplace.sql
-- This creates marketplace features
```

#### Script 13: Community Forum
```sql
-- File: scripts/012_create_forum.sql
-- This creates forum functionality
```

### Step 3: Verify Database Setup

Run this query in SQL Editor:
```sql
-- Check all tables created
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;
```

**Expected Output:**
```
✅ profiles
✅ farms
✅ fields
✅ soil_analysis
✅ crop_monitoring
✅ weather_data
✅ irrigation_systems
✅ notifications
✅ ai_chat
✅ reports
✅ marketplace
✅ community_forum
```

### Step 4: Enable Row Level Security

Verify RLS is enabled:
```sql
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public';
```

All tables should show `rowsecurity = true` ✅

---

## إعداد مفاتيح API / API Keys Setup

### Already Configured ✅
```env
NEXT_PUBLIC_SUPABASE_URL=https://fqiyunkcubguuwzdkmoc.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN=pk.eyJ1IjoiYWRoYW15b3VuZXMiLCJhIjoi...
PLANET_API_KEY=PLAK1efdf8c62a944f1d8d15fc6d78d87014
GENERIC_API_IDENTIFIER=2fcea48b-e470-423d-ba99-ecd658a48774
```

### Needs Configuration ⚠️

#### 1. OpenWeather API Key

**Get Free API Key:**
1. Visit: https://openweathermap.org/api
2. Click "Sign Up" (free tier available)
3. Verify email
4. Go to "API keys" section
5. Copy your API key

**Add to .env.local:**
```env
OPENWEATHER_API_KEY=your_actual_openweather_key_here
```

**Test API Key:**
```bash
curl "https://api.openweathermap.org/data/2.5/weather?q=Cairo&appid=YOUR_KEY"
```

#### 2. OpenAI API Key

**Get API Key (Paid):**
1. Visit: https://platform.openai.com/
2. Sign up / Log in
3. Go to "API Keys" section
4. Create new secret key
5. Copy immediately (won't show again!)

**Add to .env.local:**
```env
OPENAI_API_KEY=sk-your_actual_openai_key_here
```

**Important Notes:**
- OpenAI API is not free
- Start with pay-as-you-go plan
- Set usage limits to control costs
- Monitor usage in OpenAI dashboard

**Update AI Route (if needed):**

The AI assistant route should work with Vercel AI SDK. If you need to configure it:

File: `app/api/ai-assistant/route.ts`
```typescript
// The AI SDK should automatically use OPENAI_API_KEY
// If not working, you may need to configure:
import { OpenAI } from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});
```

---

## تشغيل التطبيق / Running the App

### Development Mode

```bash
# Start development server
pnpm dev

# Or with npm
npm run dev

# Or with yarn
yarn dev
```

**Expected Output:**
```bash
✅ - Local:   http://localhost:3000
✅ - Network: http://192.168.x.x:3000
✅ Ready in 2.5s
```

### Access Application

Open browser and navigate to:
- **Home:** http://localhost:3000
- **Login:** http://localhost:3000/auth/login
- **Signup:** http://localhost:3000/auth/signup

### Production Build

```bash
# Build for production
pnpm build

# Start production server
pnpm start
```

---

## إنشاء بيانات تجريبية / Creating Test Data

### Step 1: Create Test User

1. Go to: http://localhost:3000/auth/signup
2. Fill in the form:
   ```
   Full Name: أحمد المزارع
   Email: farmer@test.com
   Password: Test123456!
   Role: Farmer
   ```
3. Click "إنشاء حساب"
4. Check email for verification (if enabled)

### Step 2: Login

1. Go to: http://localhost:3000/auth/login
2. Enter credentials:
   ```
   Email: farmer@test.com
   Password: Test123456!
   ```
3. Click "تسجيل الدخول"

### Step 3: Create Sample Farm

1. Navigate to Dashboard: http://localhost:3000/dashboard
2. Click "إضافة مزرعة" (Add Farm)
3. Fill in farm details:
   ```
   Name: مزرعة النيل
   Location: القاهرة، مصر
   Area: 50 (hectares)
   Latitude: 30.0444
   Longitude: 31.2357
   ```
4. Save farm

### Step 4: Add Fields

1. Go to Fields section
2. Click "إضافة حقل" (Add Field)
3. Fill in field details:
   ```
   Name: حقل القمح
   Farm: مزرعة النيل
   Area: 10 (hectares)
   Crop Type: قمح (Wheat)
   Planting Date: [Select date]
   ```
4. Save field

### Step 5: Test Features

Now you can test:
- ✅ Soil analysis
- ✅ Crop monitoring
- ✅ Weather forecasts
- ✅ Irrigation scheduling
- ✅ AI assistant (if OpenAI key configured)
- ✅ Reports generation

---

## حل المشاكل / Troubleshooting

### Problem 1: Server Won't Start

**Symptoms:**
```
Error: Cannot find module 'next'
```

**Solution:**
```bash
# Delete node_modules and reinstall
rm -rf node_modules
rm pnpm-lock.yaml
pnpm install
```

### Problem 2: Port Already in Use

**Symptoms:**
```
Error: Port 3000 is already in use
```

**Solution:**
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9

# Or use different port
pnpm dev -- -p 3001
```

### Problem 3: Supabase Connection Error

**Symptoms:**
```
Error: Invalid Supabase URL
```

**Solution:**
1. Check `.env.local` file exists
2. Verify `NEXT_PUBLIC_SUPABASE_URL` is correct
3. Verify `NEXT_PUBLIC_SUPABASE_ANON_KEY` is correct
4. Restart development server

### Problem 4: Authentication Not Working

**Symptoms:**
- Can't register users
- Can't login
- Redirect loops

**Solutions:**

**Check 1: Database Tables**
```sql
-- Verify profiles table exists
SELECT * FROM profiles LIMIT 1;
```

**Check 2: RLS Policies**
```sql
-- Check RLS is enabled
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE tablename = 'profiles';
```

**Check 3: Supabase Auth Settings**
1. Go to Supabase Dashboard
2. Navigate to Authentication → Settings
3. Enable "Enable Email Confirmations" (or disable for testing)
4. Check "Site URL" is correct

### Problem 5: Weather API Not Working

**Symptoms:**
```
Error: Failed to fetch weather data
```

**Solutions:**

**If using Mock Data:**
- This is expected! Mock data is default
- To use real data, add OpenWeather API key

**If OpenWeather Key Added:**
1. Check key is valid
2. Uncomment real API code in `app/api/weather/route.ts`
3. Restart server

### Problem 6: AI Assistant Not Responding

**Symptoms:**
- Chat doesn't respond
- Error in console

**Solutions:**

**Check 1: OpenAI Key**
```bash
# Verify key in .env.local
cat .env.local | grep OPENAI_API_KEY
```

**Check 2: API Credits**
- Log in to OpenAI dashboard
- Check billing and usage
- Add credits if needed

**Check 3: Model Access**
- Verify you have access to `gpt-4o-mini`
- Try `gpt-3.5-turbo` if not available

### Problem 7: TypeScript Errors

**Symptoms:**
```
Type error: Property 'x' does not exist
```

**Solutions:**
```bash
# Regenerate types
pnpm tsc --noEmit

# Clear Next.js cache
rm -rf .next
pnpm dev
```

### Problem 8: Build Fails

**Symptoms:**
```
Error: Build failed
```

**Solutions:**
```bash
# Clear all caches
rm -rf .next
rm -rf node_modules
rm pnpm-lock.yaml

# Reinstall
pnpm install

# Try build again
pnpm build
```

---

## 🔒 أمان الإنتاج / Production Security

### Before Deploying to Production:

#### 1. Environment Variables
```bash
# Never commit .env.local to git!
# Use platform-specific env variable management:
# - Vercel: Project Settings → Environment Variables
# - Netlify: Site Settings → Build & Deploy → Environment
# - AWS: Parameter Store or Secrets Manager
```

#### 2. Rotate Keys
```bash
# For production, generate new keys:
# - New Supabase anon key (with production restrictions)
# - New API keys for all services
# - Different database credentials
```

#### 3. Enable Security Headers
```javascript
// Add to next.config.mjs
const securityHeaders = [
  {
    key: 'X-DNS-Prefetch-Control',
    value: 'on'
  },
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload'
  },
  {
    key: 'X-Frame-Options',
    value: 'SAMEORIGIN'
  },
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff'
  },
  {
    key: 'Referrer-Policy',
    value: 'origin-when-cross-origin'
  }
];
```

#### 4. Rate Limiting
```bash
# Add rate limiting to API routes
# Consider using Vercel Edge Config or Upstash
```

#### 5. Monitoring
```bash
# Set up monitoring:
# - Sentry for error tracking
# - Vercel Analytics for performance
# - Supabase logs for database queries
# - OpenAI usage dashboard
```

---

## 📚 موارد إضافية / Additional Resources

### Documentation
- **Next.js:** https://nextjs.org/docs
- **Supabase:** https://supabase.com/docs
- **Tailwind CSS:** https://tailwindcss.com/docs
- **Radix UI:** https://www.radix-ui.com/docs
- **TypeScript:** https://www.typescriptlang.org/docs

### APIs
- **OpenWeather:** https://openweathermap.org/api/one-call-3
- **OpenAI:** https://platform.openai.com/docs
- **Mapbox:** https://docs.mapbox.com/
- **Planet Labs:** https://developers.planet.com/docs/

### Community
- **Next.js Discord:** https://nextjs.org/discord
- **Supabase Discord:** https://discord.supabase.com

---

## ✅ إتمام الإعداد / Setup Completion Checklist

Use this checklist to ensure everything is configured:

### Prerequisites
- [ ] Node.js installed (v18+)
- [ ] pnpm installed
- [ ] Code editor ready
- [ ] Git configured

### Project Setup
- [x] Dependencies installed (`pnpm install`)
- [x] .env.local created
- [x] Supabase credentials configured
- [x] Mapbox token added
- [x] Planet API key added

### Database Setup
- [ ] SQL scripts executed (000-012)
- [ ] Tables verified in Supabase
- [ ] RLS policies active
- [ ] Triggers and functions created

### API Keys
- [x] Supabase (configured)
- [x] Mapbox (configured)
- [x] Planet (configured)
- [ ] OpenWeather (add your key)
- [ ] OpenAI (add your key)

### Testing
- [x] Development server starts
- [x] Home page loads
- [x] Login page accessible
- [ ] Can create user account
- [ ] Can login successfully
- [ ] Dashboard accessible
- [ ] Can create farm
- [ ] Can add fields
- [ ] Weather API working
- [ ] AI assistant working

### Optional
- [ ] Sample data created
- [ ] All features tested
- [ ] Production build successful
- [ ] Monitoring set up
- [ ] Backups configured

---

## 🎉 انتهى الإعداد! / Setup Complete!

بعد إتمام جميع الخطوات، تطبيقك جاهز للاستخدام!

After completing all steps, your application is ready to use!

### Next Steps:

1. **Test Everything** - Go through all features
2. **Create Sample Data** - Add farms, fields, etc.
3. **Invite Team** - Add other users (engineers, managers)
4. **Monitor Performance** - Check logs and analytics
5. **Plan Production** - Prepare for deployment

### Need Help?

- Check TESTING_REPORT.md for test results
- Check REPOSITORY_INSPECTION_REPORT.md for code analysis
- Review troubleshooting section above
- Contact support team

---

**تم إعداد الدليل بواسطة / Guide Prepared By:** AI Code Assistant  
**التاريخ / Date:** 7 October 2025  
**الإصدار / Version:** 1.0  

**Good luck with your agricultural platform! 🌾🚜**
