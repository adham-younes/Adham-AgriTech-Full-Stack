import { createClient } from '@supabase/supabase-js'
import type { Database } from '@/types/database'

// Connection pool configuration
const POOL_SIZE = parseInt(process.env.SUPABASE_POOL_SIZE || '10')
const POOL_TIMEOUT = parseInt(process.env.SUPABASE_POOL_TIMEOUT || '60000')

// Create a singleton instance with connection pooling
let supabaseInstance: ReturnType<typeof createClient<Database>> | null = null

export function getSupabaseClient() {
  if (!supabaseInstance) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Missing Supabase environment variables')
    }

    supabaseInstance = createClient<Database>(supabaseUrl, supabaseKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
      db: {
        schema: 'public',
      },
      global: {
        headers: {
          'x-application-name': 'agritech-platform',
        },
      },
    })
  }

  return supabaseInstance
}

// Query builder with automatic retries and error handling
export async function executeQuery<T>(
  queryFn: (client: ReturnType<typeof getSupabaseClient>) => Promise<{ data: T | null; error: any }>,
  options: {
    maxRetries?: number
    retryDelay?: number
    onError?: (error: any) => void
  } = {}
): Promise<T | null> {
  const { maxRetries = 3, retryDelay = 1000, onError } = options
  const client = getSupabaseClient()

  let lastError: any = null
  
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      const { data, error } = await queryFn(client)
      
      if (error) {
        lastError = error
        
        // Don't retry on client errors (4xx)
        if (error.code && error.code.startsWith('4')) {
          break
        }
        
        // Wait before retrying
        if (attempt < maxRetries - 1) {
          await new Promise(resolve => setTimeout(resolve, retryDelay * (attempt + 1)))
          continue
        }
      }
      
      return data
    } catch (error) {
      lastError = error
      
      // Network or connection errors
      if (attempt < maxRetries - 1) {
        await new Promise(resolve => setTimeout(resolve, retryDelay * (attempt + 1)))
        continue
      }
    }
  }

  // All retries failed
  if (onError) {
    onError(lastError)
  }
  
  console.error('[Database] Query failed after retries:', lastError)
  return null
}

// Batch operations helper
export async function executeBatch<T>(
  operations: Array<() => Promise<T>>,
  options: {
    batchSize?: number
    onProgress?: (completed: number, total: number) => void
  } = {}
): Promise<T[]> {
  const { batchSize = 5, onProgress } = options
  const results: T[] = []
  
  for (let i = 0; i < operations.length; i += batchSize) {
    const batch = operations.slice(i, i + batchSize)
    const batchResults = await Promise.all(batch.map(op => op()))
    results.push(...batchResults)
    
    if (onProgress) {
      onProgress(Math.min(i + batchSize, operations.length), operations.length)
    }
  }
  
  return results
}

// Transaction helper (using Supabase RPC functions)
export async function executeTransaction<T>(
  transactionName: string,
  params: Record<string, any>
): Promise<T | null> {
  return executeQuery<T>(
    async (client) => client.rpc(transactionName, params),
    {
      maxRetries: 1, // Transactions should not be retried automatically
    }
  )
}

// Cache helper for frequently accessed data
const queryCache = new Map<string, { data: any; timestamp: number }>()
const CACHE_TTL = 5 * 60 * 1000 // 5 minutes

export async function cachedQuery<T>(
  cacheKey: string,
  queryFn: () => Promise<T | null>,
  options: {
    ttl?: number
    force?: boolean
  } = {}
): Promise<T | null> {
  const { ttl = CACHE_TTL, force = false } = options
  
  if (!force) {
    const cached = queryCache.get(cacheKey)
    if (cached && Date.now() - cached.timestamp < ttl) {
      return cached.data as T
    }
  }
  
  const data = await queryFn()
  
  if (data !== null) {
    queryCache.set(cacheKey, { data, timestamp: Date.now() })
  }
  
  return data
}

// Clean up old cache entries periodically
setInterval(() => {
  const now = Date.now()
  for (const [key, value] of queryCache.entries()) {
    if (now - value.timestamp > CACHE_TTL) {
      queryCache.delete(key)
    }
  }
}, 60000) // Clean up every minute