import { LRUCache } from "lru-cache"

interface RateLimitOptions {
  interval: number // الفترة الزمنية بالمللي ثانية
  uniqueTokenPerInterval: number // عدد الطلبات المسموحة في الفترة
}

export class RateLimiter {
  private cache: LRUCache<string, number[]>

  constructor(options: RateLimitOptions) {
    this.cache = new LRUCache<string, number[]>({
      max: options.uniqueTokenPerInterval || 500,
      ttl: options.interval || 60000,
    })
  }

  async check(identifier: string, limit: number): Promise<{
    success: boolean
    limit: number
    remaining: number
    reset: Date
  }> {
    const now = Date.now()
    const timestamps = this.cache.get(identifier) || []
    
    // إزالة الطلبات القديمة
    const validTimestamps = timestamps.filter(
      (timestamp) => now - timestamp < 60000 // نافذة زمنية مدتها دقيقة واحدة
    )

    if (validTimestamps.length >= limit) {
      return {
        success: false,
        limit,
        remaining: 0,
        reset: new Date(validTimestamps[0] + 60000),
      }
    }

    // إضافة الطلب الحالي
    validTimestamps.push(now)
    this.cache.set(identifier, validTimestamps)

    return {
      success: true,
      limit,
      remaining: limit - validTimestamps.length,
      reset: new Date(now + 60000),
    }
  }
}

// إنشاء rate limiters لمختلف الاستخدامات
export const apiLimiter = new RateLimiter({
  interval: 60 * 1000, // 1 دقيقة
  uniqueTokenPerInterval: 500,
})

export const authLimiter = new RateLimiter({
  interval: 15 * 60 * 1000, // 15 دقيقة
  uniqueTokenPerInterval: 100,
})

export const aiLimiter = new RateLimiter({
  interval: 60 * 1000, // 1 دقيقة
  uniqueTokenPerInterval: 200,
})

// Helper function للتحقق من rate limit
export async function checkRateLimit(
  identifier: string,
  limiter: RateLimiter,
  limit: number
): Promise<Response | null> {
  const result = await limiter.check(identifier, limit)

  if (!result.success) {
    return new Response(
      JSON.stringify({
        error: "تم تجاوز الحد المسموح من الطلبات. حاول مرة أخرى لاحقاً.",
        error_en: "Rate limit exceeded. Please try again later.",
        retryAfter: result.reset,
      }),
      {
        status: 429,
        headers: {
          "Content-Type": "application/json",
          "X-RateLimit-Limit": result.limit.toString(),
          "X-RateLimit-Remaining": result.remaining.toString(),
          "X-RateLimit-Reset": result.reset.toISOString(),
          "Retry-After": Math.ceil((result.reset.getTime() - Date.now()) / 1000).toString(),
        },
      }
    )
  }

  return null
}