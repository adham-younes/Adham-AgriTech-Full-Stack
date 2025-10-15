import { NextRequest } from 'next/server'

// Error severity levels
export enum ErrorSeverity {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical'
}

// Error categories
export enum ErrorCategory {
  API = 'api',
  DATABASE = 'database',
  AUTHENTICATION = 'authentication',
  VALIDATION = 'validation',
  EXTERNAL_SERVICE = 'external_service',
  UNKNOWN = 'unknown'
}

interface ErrorLog {
  timestamp: string
  severity: ErrorSeverity
  category: ErrorCategory
  message: string
  error?: any
  context?: Record<string, any>
  userId?: string
  requestId?: string
  path?: string
  method?: string
}

interface PerformanceMetric {
  timestamp: string
  name: string
  duration: number
  category: string
  metadata?: Record<string, any>
}

// In-memory storage for development
// In production, use a proper logging service like Sentry, LogRocket, etc.
const errorLogs: ErrorLog[] = []
const performanceMetrics: PerformanceMetric[] = []

// Maximum logs to keep in memory
const MAX_LOGS = 1000
const MAX_METRICS = 1000

export class Logger {
  private static instance: Logger
  
  private constructor() {}
  
  static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger()
    }
    return Logger.instance
  }
  
  // Log an error
  error(
    message: string,
    error?: any,
    options: {
      severity?: ErrorSeverity
      category?: ErrorCategory
      context?: Record<string, any>
      userId?: string
      request?: NextRequest
    } = {}
  ): void {
    const {
      severity = ErrorSeverity.MEDIUM,
      category = ErrorCategory.UNKNOWN,
      context = {},
      userId,
      request
    } = options
    
    const errorLog: ErrorLog = {
      timestamp: new Date().toISOString(),
      severity,
      category,
      message,
      error: error ? {
        name: error.name,
        message: error.message,
        stack: error.stack,
        ...error
      } : undefined,
      context,
      userId,
      requestId: request?.headers.get('x-request-id') || undefined,
      path: request ? new URL(request.url).pathname : undefined,
      method: request?.method
    }
    
    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('[ERROR]', errorLog)
    }
    
    // Store in memory
    errorLogs.push(errorLog)
    if (errorLogs.length > MAX_LOGS) {
      errorLogs.shift()
    }
    
    // In production, send to external service
    if (process.env.NODE_ENV === 'production') {
      this.sendToMonitoringService(errorLog)
    }
  }
  
  // Log a warning
  warn(message: string, context?: Record<string, any>): void {
    this.error(message, undefined, {
      severity: ErrorSeverity.LOW,
      context
    })
  }
  
  // Log an info message
  info(message: string, context?: Record<string, any>): void {
    if (process.env.NODE_ENV === 'development') {
      console.info('[INFO]', message, context)
    }
  }
  
  // Track performance metrics
  trackPerformance(
    name: string,
    duration: number,
    category: string,
    metadata?: Record<string, any>
  ): void {
    const metric: PerformanceMetric = {
      timestamp: new Date().toISOString(),
      name,
      duration,
      category,
      metadata
    }
    
    // Log slow operations
    if (duration > 1000) {
      this.warn(`Slow operation detected: ${name}`, {
        duration,
        category,
        ...metadata
      })
    }
    
    // Store metric
    performanceMetrics.push(metric)
    if (performanceMetrics.length > MAX_METRICS) {
      performanceMetrics.shift()
    }
  }
  
  // Get recent errors
  getRecentErrors(limit: number = 50): ErrorLog[] {
    return errorLogs.slice(-limit)
  }
  
  // Get performance metrics
  getPerformanceMetrics(category?: string): PerformanceMetric[] {
    if (category) {
      return performanceMetrics.filter(m => m.category === category)
    }
    return performanceMetrics
  }
  
  // Send to external monitoring service
  private async sendToMonitoringService(errorLog: ErrorLog): Promise<void> {
    // Implement integration with services like:
    // - Sentry
    // - LogRocket
    // - New Relic
    // - Datadog
    
    // Example with Sentry (requires @sentry/nextjs)
    /*
    if (typeof window === 'undefined') {
      const Sentry = await import('@sentry/nextjs')
      Sentry.captureException(errorLog.error || new Error(errorLog.message), {
        level: errorLog.severity,
        tags: {
          category: errorLog.category,
          userId: errorLog.userId
        },
        extra: errorLog.context
      })
    }
    */
  }
}

// Performance tracking decorator
export function trackPerformance(category: string = 'general') {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    const originalMethod = descriptor.value
    
    descriptor.value = async function (...args: any[]) {
      const start = Date.now()
      const logger = Logger.getInstance()
      
      try {
        const result = await originalMethod.apply(this, args)
        const duration = Date.now() - start
        
        logger.trackPerformance(
          `${target.constructor.name}.${propertyKey}`,
          duration,
          category
        )
        
        return result
      } catch (error) {
        const duration = Date.now() - start
        
        logger.trackPerformance(
          `${target.constructor.name}.${propertyKey}`,
          duration,
          category,
          { error: true }
        )
        
        throw error
      }
    }
    
    return descriptor
  }
}

// Error boundary for API routes
export function withErrorHandling(
  handler: (req: NextRequest) => Promise<Response>
) {
  return async (req: NextRequest): Promise<Response> => {
    const logger = Logger.getInstance()
    const start = Date.now()
    
    try {
      const response = await handler(req)
      
      // Track performance
      logger.trackPerformance(
        `API ${req.method} ${new URL(req.url).pathname}`,
        Date.now() - start,
        'api',
        { status: response.status }
      )
      
      return response
    } catch (error: any) {
      // Log the error
      logger.error(
        `API Error: ${error.message}`,
        error,
        {
          severity: ErrorSeverity.HIGH,
          category: ErrorCategory.API,
          request: req
        }
      )
      
      // Return appropriate error response
      return Response.json(
        {
          error: process.env.NODE_ENV === 'production'
            ? 'Internal server error'
            : error.message,
          timestamp: new Date().toISOString()
        },
        { status: 500 }
      )
    }
  }
}

// Create singleton instance
export const logger = Logger.getInstance()