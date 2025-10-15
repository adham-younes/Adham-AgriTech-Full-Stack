import { NextRequest, NextResponse } from 'next/server'

interface RateLimitConfig {
  windowMs: number
  max: number
  message?: string
  statusCode?: number
  skipSuccessfulRequests?: boolean
  skipFailedRequests?: boolean
  keyGenerator?: (req: NextRequest) => string
}

interface RateLimitEntry {
  count: number
  resetTime: number
}

// In-memory store for rate limiting
// In production, consider using Redis or another distributed cache
const rateLimitStore = new Map<string, RateLimitEntry>()

// Clean up expired entries periodically
setInterval(() => {
  const now = Date.now()
  for (const [key, entry] of rateLimitStore.entries()) {
    if (now > entry.resetTime) {
      rateLimitStore.delete(key)
    }
  }
}, 60000) // Clean up every minute

export function createRateLimiter(config: RateLimitConfig) {
  const {
    windowMs,
    max,
    message = 'Too many requests, please try again later.',
    statusCode = 429,
    skipSuccessfulRequests = false,
    skipFailedRequests = true,
    keyGenerator = (req) => {
      // Default key generator uses IP address
      return req.headers.get('x-forwarded-for') || 
             req.headers.get('x-real-ip') || 
             req.ip || 
             'unknown'
    }
  } = config

  return async function rateLimit(
    req: NextRequest,
    handler: (req: NextRequest) => Promise<Response>
  ): Promise<Response> {
    const key = keyGenerator(req)
    const now = Date.now()
    
    let entry = rateLimitStore.get(key)
    
    if (!entry || now > entry.resetTime) {
      entry = {
        count: 0,
        resetTime: now + windowMs
      }
      rateLimitStore.set(key, entry)
    }
    
    // Check if limit exceeded
    if (entry.count >= max) {
      const retryAfter = Math.ceil((entry.resetTime - now) / 1000)
      
      return NextResponse.json(
        { 
          error: message,
          retryAfter 
        },
        { 
          status: statusCode,
          headers: {
            'Retry-After': retryAfter.toString(),
            'X-RateLimit-Limit': max.toString(),
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': new Date(entry.resetTime).toISOString()
          }
        }
      )
    }
    
    // Increment counter before processing request
    if (!skipFailedRequests) {
      entry.count++
    }
    
    try {
      // Process the request
      const response = await handler(req)
      
      // Increment counter after successful request if configured
      if (!skipSuccessfulRequests && response.ok && skipFailedRequests) {
        entry.count++
      }
      
      // Add rate limit headers to successful responses
      const remaining = Math.max(0, max - entry.count)
      response.headers.set('X-RateLimit-Limit', max.toString())
      response.headers.set('X-RateLimit-Remaining', remaining.toString())
      response.headers.set('X-RateLimit-Reset', new Date(entry.resetTime).toISOString())
      
      return response
    } catch (error) {
      // If request processing fails and we're counting failed requests
      if (!skipFailedRequests) {
        // Counter was already incremented
      }
      throw error
    }
  }
}

// Pre-configured rate limiters for common use cases
export const rateLimiters = {
  // Strict rate limit for authentication endpoints
  auth: createRateLimiter({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5,
    message: 'Too many authentication attempts, please try again later.',
    skipFailedRequests: false, // Count failed attempts
  }),
  
  // Standard API rate limit
  api: createRateLimiter({
    windowMs: 60 * 1000, // 1 minute
    max: 60,
    message: 'API rate limit exceeded, please slow down.',
  }),
  
  // Lenient rate limit for read operations
  read: createRateLimiter({
    windowMs: 60 * 1000, // 1 minute
    max: 100,
    message: 'Too many read requests, please try again.',
  }),
  
  // Strict rate limit for write operations
  write: createRateLimiter({
    windowMs: 60 * 1000, // 1 minute
    max: 20,
    message: 'Too many write requests, please slow down.',
  }),
  
  // AI/LLM endpoints with higher costs
  ai: createRateLimiter({
    windowMs: 60 * 1000, // 1 minute
    max: parseInt(process.env.AI_RATE_LIMIT || '10'),
    message: 'AI service rate limit exceeded, please try again later.',
  }),
  
  // Weather API rate limit
  weather: createRateLimiter({
    windowMs: 60 * 1000, // 1 minute
    max: parseInt(process.env.WEATHER_RATE_LIMIT || '30'),
    message: 'Weather service rate limit exceeded, please try again later.',
  }),
}

// Helper function to apply rate limiting to API routes
export function withRateLimit(
  handler: (req: NextRequest) => Promise<Response>,
  limiter: ReturnType<typeof createRateLimiter> = rateLimiters.api
) {
  return async (req: NextRequest) => {
    return limiter(req, handler)
  }
}