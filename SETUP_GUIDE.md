# دليل الإعداد - Adham AgriTech Setup Guide
# Setting Up Adham AgriTech Platform

**Created:** October 15, 2025  
**Based on:** REPOSITORY_INSPECTION_REPORT.md recommendations

---

## 📋 المتطلبات الأساسية / Prerequisites

### Required Software
- **Node.js:** v18.17 or later
- **pnpm:** v8.0 or later (Package Manager)
- **Git:** Latest version
- **Code Editor:** VS Code recommended

### Required Accounts
1. **Supabase Account** - Database and Authentication
   - Sign up at: https://supabase.com
   
2. **OpenAI Account** - AI Assistant
   - Get API key at: https://platform.openai.com
   
3. **OpenWeather Account** - Weather Data
   - Get API key at: https://openweathermap.org/api
   
4. **Planet Labs Account** (Optional) - Satellite Imagery
   - Sign up at: https://www.planet.com
   
5. **Mapbox Account** - Maps
   - Get token at: https://www.mapbox.com

---

## 🚀 خطوات الإعداد السريع / Quick Setup Steps

### الخطوة 1: استنساخ المستودع / Step 1: Clone Repository

```bash
# Clone the repository
git clone <repository-url>
cd <project-folder>

# Install dependencies
pnpm install
```

### الخطوة 2: إعداد قاعدة البيانات / Step 2: Database Setup

#### 2.1 Create Supabase Project
1. Go to https://supabase.com/dashboard
2. Click "New Project"
3. Fill in project details:
   - **Name:** Adham AgriTech
   - **Database Password:** (save this securely)
   - **Region:** Choose closest to your users
4. Wait for project creation (~2 minutes)

#### 2.2 Get Supabase Credentials
1. Go to Project Settings → API
2. Copy the following:
   - **Project URL:** `https://xxxxx.supabase.co`
   - **anon/public key:** `eyJh...`
   - **service_role key:** `eyJh...` (keep this secret!)

#### 2.3 Run Database Scripts
In Supabase Dashboard → SQL Editor:

```sql
-- Run scripts in order (000 to 012)
-- Copy content from scripts/ folder and execute each one

-- 1. Create functions
-- Copy content from: scripts/000_create_functions.sql

-- 2. Create profiles
-- Copy content from: scripts/001_create_profiles.sql

-- 3. Create farms
-- Copy content from: scripts/002_create_farms.sql

-- Continue with all scripts 003-012 in order
```

### الخطوة 3: إعداد ملف البيئة / Step 3: Environment Variables

```bash
# Copy the example environment file
cp .env.local.example .env.local

# Edit .env.local with your credentials
nano .env.local  # or use your preferred editor
```

#### Fill in the following values:

```bash
# =============================================================================
# Supabase Configuration
# =============================================================================
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here

# =============================================================================
# OpenAI API Configuration
# =============================================================================
OPENAI_API_KEY=sk-your_openai_key_here

# =============================================================================
# Weather API Configuration
# =============================================================================
OPENWEATHER_API_KEY=your_openweather_key_here
NEXT_PUBLIC_OPENWEATHER_API_KEY=your_openweather_key_here

# =============================================================================
# Satellite Imagery (Optional)
# =============================================================================
PLANET_API_KEY=your_planet_key_here
NEXT_PUBLIC_PLANET_API_KEY=your_planet_key_here

# =============================================================================
# Maps Configuration
# =============================================================================
NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN=pk.your_mapbox_token_here

# =============================================================================
# Application Settings
# =============================================================================
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development
```

### الخطوة 4: تشغيل التطبيق / Step 4: Run the Application

```bash
# Start development server
pnpm dev

# Application will be available at:
# http://localhost:3000
```

### الخطوة 5: إنشاء أول مستخدم / Step 5: Create First User

1. Open http://localhost:3000
2. Click "إنشاء حساب" (Sign Up)
3. Fill in:
   - Email
   - Password (minimum 6 characters)
   - Full Name
   - Phone (optional)
   - Select Role: Farmer / Engineer / Manager
4. Check your email for verification (if enabled in Supabase)
5. Login and start using the platform!

---

## 🔧 إعداد تفصيلي / Detailed Configuration

### A. Supabase Configuration

#### Enable Email Authentication
1. Supabase Dashboard → Authentication → Settings
2. Enable "Email" provider
3. Configure email templates (optional)
4. Set redirect URLs:
   - Development: `http://localhost:3000/auth/callback`
   - Production: `https://your-domain.com/auth/callback`

#### Configure Row Level Security (RLS)
✅ Already configured in SQL scripts!
- All tables have RLS enabled
- Users can only access their own data
- Role-based policies for engineers/managers

### B. OpenAI Configuration

#### Get API Key
1. Go to https://platform.openai.com/api-keys
2. Create new secret key
3. Copy and save it (shown only once!)
4. Add to `.env.local` as `OPENAI_API_KEY`

#### Choose Model
Default: `gpt-4o-mini` (cost-effective)
- Can be changed in `/app/api/ai-assistant/route.ts`
- Options: gpt-4, gpt-4-turbo, gpt-3.5-turbo

### C. OpenWeather Configuration

#### Get API Key
1. Sign up at https://openweathermap.org/appid
2. Free tier includes:
   - 1,000 calls/day
   - Current weather + 5-day forecast
3. Activate key (takes ~10 minutes)
4. Add to `.env.local`

#### API Endpoints Used
- Current Weather: `/data/2.5/weather`
- 7-Day Forecast: `/data/2.5/forecast`

### D. Mapbox Configuration

#### Get Access Token
1. Sign up at https://account.mapbox.com/
2. Create access token with scopes:
   - `styles:read`
   - `fonts:read`
   - `datasets:read`
3. Copy public token (starts with `pk.`)
4. Add to `.env.local`

---

## 📦 البناء للإنتاج / Production Build

### Build the Application

```bash
# Create production build
pnpm build

# Test production build locally
pnpm start

# Check for errors
pnpm lint
```

### Deploy to Vercel

#### Option 1: Vercel CLI
```bash
# Install Vercel CLI
pnpm add -g vercel

# Login
vercel login

# Deploy
vercel --prod
```

#### Option 2: Git Integration
1. Push code to GitHub
2. Go to https://vercel.com/new
3. Import your repository
4. Configure:
   - **Framework:** Next.js
   - **Build Command:** `pnpm build`
   - **Output Directory:** `.next`
5. Add environment variables in Vercel dashboard
6. Deploy!

### Environment Variables in Vercel
1. Vercel Dashboard → Project → Settings → Environment Variables
2. Add all variables from `.env.local`
3. Set environment: Production / Preview / Development
4. Redeploy after adding variables

---

## 🧪 اختبار النظام / System Testing

### Test Authentication
```bash
# 1. Sign up with test account
# 2. Verify email redirect works
# 3. Login with credentials
# 4. Check dashboard access
# 5. Logout and verify redirect
```

### Test API Endpoints
```bash
# Test Weather API
curl "http://localhost:3000/api/weather?lat=30.0444&lon=31.2357"

# Test AI Assistant (requires auth cookie)
curl -X POST http://localhost:3000/api/ai-assistant \
  -H "Content-Type: application/json" \
  -d '{"messages":[{"role":"user","content":"مرحبا"}]}'
```

### Test Database Connection
1. Dashboard → Farms → Add New Farm
2. Fill in farm details
3. Save and verify data in Supabase dashboard
4. Test RLS by trying to access other user's data

---

## 🐛 استكشاف الأخطاء / Troubleshooting

### Common Issues

#### ❌ "Supabase client not initialized"
**Solution:**
- Check `.env.local` has correct Supabase URL and keys
- Restart development server: `pnpm dev`
- Verify environment variables loaded: `console.log(process.env.NEXT_PUBLIC_SUPABASE_URL)`

#### ❌ "OpenWeather API error"
**Solution:**
- Verify API key is activated (wait 10 minutes after signup)
- Check API key spelling in `.env.local`
- Test API key directly: https://api.openweathermap.org/data/2.5/weather?q=Cairo&appid=YOUR_KEY

#### ❌ "Rate limit exceeded"
**Solution:**
- Wait for rate limit window to reset
- Check `X-RateLimit-Reset` header
- Upgrade API plan if needed

#### ❌ "Database error: permission denied"
**Solution:**
- Verify RLS policies are created
- Check user is authenticated
- Verify user_id matches in database

#### ❌ "AI Assistant not responding"
**Solution:**
- Check OpenAI API key is valid
- Verify API key has credits/quota
- Check network connection to OpenAI
- Review error logs in browser console

---

## 📊 مراقبة الأداء / Performance Monitoring

### Vercel Analytics (Free)
Already integrated! View in Vercel Dashboard.

### Add Sentry (Optional Error Tracking)
```bash
# Install Sentry
pnpm add @sentry/nextjs

# Follow setup wizard
npx @sentry/wizard@latest -i nextjs
```

### Database Monitoring
- Supabase Dashboard → Database → Query Performance
- Monitor slow queries
- Check connection pool usage

---

## 🔄 التحديثات / Updates

### Update Dependencies
```bash
# Check for updates
pnpm outdated

# Update all dependencies
pnpm update

# Update specific package
pnpm update package-name
```

### Database Migrations
When adding new features:
1. Create new SQL migration file
2. Test locally
3. Apply to production Supabase
4. Document changes

---

## 📞 الدعم / Support

### Resources
- **Documentation:** See `API_DOCUMENTATION.md`
- **Inspection Report:** See `REPOSITORY_INSPECTION_REPORT.md`
- **Supabase Docs:** https://supabase.com/docs
- **Next.js Docs:** https://nextjs.org/docs

### Contact
- **Email:** adhamlouxor@gmail.com
- **Project:** https://v0.app/chat/projects/UaFHyHNnIQx

---

## ✅ قائمة التحقق / Checklist

Before going to production, verify:

- [ ] All environment variables set in Vercel
- [ ] Database scripts executed (000-012)
- [ ] RLS policies enabled and tested
- [ ] Email authentication configured
- [ ] API keys validated and working
- [ ] Production build successful (`pnpm build`)
- [ ] No linting errors (`pnpm lint`)
- [ ] All features tested:
  - [ ] User registration
  - [ ] Login/Logout
  - [ ] Farm management
  - [ ] Soil analysis
  - [ ] Weather data
  - [ ] AI assistant
  - [ ] Crop monitoring
- [ ] Error boundaries working
- [ ] Rate limiting active
- [ ] Analytics configured
- [ ] Backup strategy planned
- [ ] SSL certificate active (Vercel auto)
- [ ] Custom domain configured (if applicable)

---

## 🎉 تهانينا! / Congratulations!

Your Adham AgriTech platform is now set up and ready to use!

**Next Steps:**
1. Create test data (farms, fields, soil analysis)
2. Invite team members
3. Configure custom branding (logo, colors)
4. Set up automated backups
5. Plan monitoring and maintenance schedule

---

**Setup Guide Version:** 1.0  
**Last Updated:** October 15, 2025  
**Status:** ✅ Ready for Production
