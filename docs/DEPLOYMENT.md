# Deployment Guide for Adham AgriTech Platform

## Prerequisites

- Node.js 18+ installed
- pnpm package manager
- Supabase account and project
- Vercel account (recommended) or other hosting provider
- API keys for external services

## Environment Setup

1. **Copy the environment template**:
```bash
cp .env.example .env.local
```

2. **Configure environment variables**:

### Required Variables:
```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# External APIs
OPENWEATHER_API_KEY=your-openweather-api-key
GROQ_API_KEY=your-groq-api-key

# Application
NEXT_PUBLIC_APP_URL=https://your-domain.com
```

## Database Setup

1. **Run database migrations**:
```bash
# Connect to your Supabase project
supabase db push

# Or manually run scripts in order:
scripts/000_create_functions.sql
scripts/001_create_profiles_and_users.sql
scripts/002_create_farms.sql
scripts/003_create_fields.sql
scripts/004_create_soil_analysis.sql
scripts/005_create_crop_monitoring.sql
scripts/006_create_weather_data.sql
scripts/007_create_irrigation_systems.sql
scripts/008_create_notifications.sql
scripts/009_create_ai_chat.sql
scripts/010_create_marketplace.sql
scripts/011_create_community_forum.sql
scripts/optimize_database.sql
```

2. **Enable Row Level Security (RLS)**:
- Ensure all tables have RLS enabled
- Verify policies are correctly set

## Local Development

1. **Install dependencies**:
```bash
pnpm install
```

2. **Run development server**:
```bash
pnpm dev
```

3. **Build for production**:
```bash
pnpm build
```

## Deployment Options

### Option 1: Vercel (Recommended)

1. **Install Vercel CLI**:
```bash
npm i -g vercel
```

2. **Deploy**:
```bash
vercel
```

3. **Configure environment variables in Vercel dashboard**

4. **Set up automatic deployments**:
- Connect GitHub repository
- Enable automatic deployments on push

### Option 2: Docker

1. **Create Dockerfile**:
```dockerfile
FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package.json pnpm-lock.yaml ./
RUN corepack enable pnpm && pnpm i --frozen-lockfile

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NEXT_TELEMETRY_DISABLED 1
RUN corepack enable pnpm && pnpm build

# Production image
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000

CMD ["node", "server.js"]
```

2. **Build and run**:
```bash
docker build -t agritech-platform .
docker run -p 3000:3000 --env-file .env agritech-platform
```

### Option 3: Traditional VPS

1. **Install Node.js and pnpm on server**
2. **Clone repository**
3. **Install dependencies and build**:
```bash
pnpm install
pnpm build
```

4. **Use PM2 for process management**:
```bash
npm i -g pm2
pm2 start npm --name "agritech" -- start
pm2 save
pm2 startup
```

## Post-Deployment

### 1. Security Checklist

- [ ] Enable HTTPS
- [ ] Set secure headers (CSP, HSTS, etc.)
- [ ] Configure CORS properly
- [ ] Enable rate limiting
- [ ] Set up WAF (Web Application Firewall)
- [ ] Regular security audits

### 2. Monitoring Setup

- [ ] Set up error tracking (Sentry)
- [ ] Configure performance monitoring
- [ ] Set up uptime monitoring
- [ ] Enable logging aggregation
- [ ] Configure alerts

### 3. Backup Strategy

- [ ] Enable Supabase automatic backups
- [ ] Set up database replication
- [ ] Configure file storage backups
- [ ] Document recovery procedures

### 4. Performance Optimization

- [ ] Enable CDN for static assets
- [ ] Configure image optimization
- [ ] Enable caching headers
- [ ] Set up Redis for session/cache (optional)
- [ ] Monitor Core Web Vitals

## Maintenance

### Regular Tasks

1. **Weekly**:
   - Check error logs
   - Review performance metrics
   - Update dependencies (security patches)

2. **Monthly**:
   - Full backup verification
   - Security audit
   - Performance review
   - Update documentation

3. **Quarterly**:
   - Major dependency updates
   - Infrastructure review
   - Cost optimization review

### Scaling Considerations

1. **Database**:
   - Monitor query performance
   - Add read replicas if needed
   - Optimize indexes regularly

2. **Application**:
   - Horizontal scaling with load balancer
   - Consider serverless for API routes
   - Implement caching strategies

3. **Storage**:
   - Use CDN for media files
   - Implement image optimization
   - Archive old data

## Troubleshooting

### Common Issues

1. **Database Connection Errors**:
   - Check Supabase service status
   - Verify connection pool settings
   - Check network connectivity

2. **API Rate Limiting**:
   - Review rate limit settings
   - Check for abuse patterns
   - Consider upgrading API plans

3. **Performance Issues**:
   - Check database query performance
   - Review API response times
   - Monitor memory usage

### Debug Mode

Enable debug logging:
```env
DEBUG=true
LOG_LEVEL=debug
```

## Support

- Documentation: [/docs](./README.md)
- API Documentation: [/docs/API.md](./API.md)
- Issues: GitHub Issues
- Email: support@adham-agritech.com