/**
 * Rate Limiting Middleware
 * 
 * Implements rate limiting for API routes to prevent abuse
 * Recommendation from REPOSITORY_INSPECTION_REPORT.md
 * 
 * Usage:
 * import { rateLimit } from '@/lib/middleware/rate-limit'
 * 
 * export async function POST(req: Request) {
 *   const rateLimitResult = await rateLimit(req)
 *   if (!rateLimitResult.success) {
 *     return Response.json(rateLimitResult.error, { status: 429 })
 *   }
 *   // ... rest of your code
 * }
 */

import { headers } from 'next/headers'

interface RateLimitConfig {
  interval: number // Time window in milliseconds
  uniqueTokenPerInterval: number // Max number of unique tokens per interval
}

interface RateLimitStore {
  [key: string]: {
    count: number
    resetTime: number
  }
}

// In-memory store (use Redis in production for distributed systems)
const rateLimitStore: RateLimitStore = {}

// Default configuration: 10 requests per minute
const DEFAULT_CONFIG: RateLimitConfig = {
  interval: 60 * 1000, // 1 minute
  uniqueTokenPerInterval: 10,
}

/**
 * Clean up expired entries from the store
 */
function cleanup() {
  const now = Date.now()
  for (const key in rateLimitStore) {
    if (rateLimitStore[key].resetTime < now) {
      delete rateLimitStore[key]
    }
  }
}

/**
 * Get client identifier from request
 */
function getClientId(req: Request): string {
  const headersList = headers()
  
  // Try to get IP from various headers (Vercel, Cloudflare, etc.)
  const forwardedFor = headersList.get('x-forwarded-for')
  const realIp = headersList.get('x-real-ip')
  const cfConnectingIp = headersList.get('cf-connecting-ip')
  
  const ip = forwardedFor?.split(',')[0] || realIp || cfConnectingIp || 'unknown'
  
  // Add user agent to make identifier more specific
  const userAgent = headersList.get('user-agent') || 'unknown'
  
  return `${ip}-${userAgent}`
}

/**
 * Rate limit check
 */
export async function rateLimit(
  req: Request,
  config: Partial<RateLimitConfig> = {}
): Promise<{ success: boolean; error?: any; remaining?: number }> {
  const { interval, uniqueTokenPerInterval } = {
    ...DEFAULT_CONFIG,
    ...config,
  }

  const clientId = getClientId(req)
  const now = Date.now()

  // Cleanup old entries periodically
  if (Math.random() < 0.1) {
    cleanup()
  }

  // Get or create client entry
  if (!rateLimitStore[clientId] || rateLimitStore[clientId].resetTime < now) {
    rateLimitStore[clientId] = {
      count: 1,
      resetTime: now + interval,
    }
    return {
      success: true,
      remaining: uniqueTokenPerInterval - 1,
    }
  }

  // Check if limit exceeded
  if (rateLimitStore[clientId].count >= uniqueTokenPerInterval) {
    const resetIn = Math.ceil((rateLimitStore[clientId].resetTime - now) / 1000)
    return {
      success: false,
      error: {
        error: 'Rate limit exceeded',
        message: 'لقد تجاوزت الحد المسموح من الطلبات',
        message_en: 'Too many requests, please try again later',
        retryAfter: resetIn,
      },
    }
  }

  // Increment count
  rateLimitStore[clientId].count++

  return {
    success: true,
    remaining: uniqueTokenPerInterval - rateLimitStore[clientId].count,
  }
}

/**
 * Specific rate limit configurations for different endpoints
 */
export const RateLimitConfigs = {
  // AI Assistant: 20 requests per minute
  AI_ASSISTANT: {
    interval: 60 * 1000,
    uniqueTokenPerInterval: 20,
  },
  
  // Weather API: 100 requests per hour
  WEATHER: {
    interval: 60 * 60 * 1000,
    uniqueTokenPerInterval: 100,
  },
  
  // Soil Analysis: 50 requests per hour
  SOIL_ANALYSIS: {
    interval: 60 * 60 * 1000,
    uniqueTokenPerInterval: 50,
  },
  
  // Authentication: 5 attempts per 15 minutes
  AUTH: {
    interval: 15 * 60 * 1000,
    uniqueTokenPerInterval: 5,
  },
  
  // General API: 100 requests per minute
  GENERAL: {
    interval: 60 * 1000,
    uniqueTokenPerInterval: 100,
  },
}

/**
 * Helper to add rate limit headers to response
 */
export function addRateLimitHeaders(
  response: Response,
  remaining: number,
  limit: number,
  resetTime: number
): Response {
  const headers = new Headers(response.headers)
  headers.set('X-RateLimit-Limit', limit.toString())
  headers.set('X-RateLimit-Remaining', remaining.toString())
  headers.set('X-RateLimit-Reset', resetTime.toString())
  
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  })
}
