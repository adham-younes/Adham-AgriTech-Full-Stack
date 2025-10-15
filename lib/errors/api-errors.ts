/**
 * Standardized API Error Handling
 * 
 * Provides specific error types and messages for better error handling
 * Recommendation from REPOSITORY_INSPECTION_REPORT.md
 */

export enum ErrorCode {
  // Authentication Errors (4xx)
  UNAUTHORIZED = 'UNAUTHORIZED',
  FORBIDDEN = 'FORBIDDEN',
  INVALID_CREDENTIALS = 'INVALID_CREDENTIALS',
  TOKEN_EXPIRED = 'TOKEN_EXPIRED',
  
  // Validation Errors (4xx)
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  INVALID_INPUT = 'INVALID_INPUT',
  MISSING_REQUIRED_FIELD = 'MISSING_REQUIRED_FIELD',
  
  // Resource Errors (4xx)
  NOT_FOUND = 'NOT_FOUND',
  ALREADY_EXISTS = 'ALREADY_EXISTS',
  CONFLICT = 'CONFLICT',
  
  // Rate Limiting (4xx)
  RATE_LIMIT_EXCEEDED = 'RATE_LIMIT_EXCEEDED',
  
  // Server Errors (5xx)
  INTERNAL_SERVER_ERROR = 'INTERNAL_SERVER_ERROR',
  DATABASE_ERROR = 'DATABASE_ERROR',
  EXTERNAL_API_ERROR = 'EXTERNAL_API_ERROR',
  SERVICE_UNAVAILABLE = 'SERVICE_UNAVAILABLE',
}

export class APIError extends Error {
  code: ErrorCode
  statusCode: number
  details?: any
  messageAr: string
  messageEn: string

  constructor(
    code: ErrorCode,
    messageEn: string,
    messageAr: string,
    statusCode: number = 500,
    details?: any
  ) {
    super(messageEn)
    this.name = 'APIError'
    this.code = code
    this.messageEn = messageEn
    this.messageAr = messageAr
    this.statusCode = statusCode
    this.details = details
  }

  toJSON() {
    return {
      error: true,
      code: this.code,
      message: this.messageEn,
      message_ar: this.messageAr,
      details: this.details,
      timestamp: new Date().toISOString(),
    }
  }
}

/**
 * Predefined API Errors
 */
export const APIErrors = {
  // Authentication
  Unauthorized: () =>
    new APIError(
      ErrorCode.UNAUTHORIZED,
      'Authentication required',
      'يجب تسجيل الدخول للوصول إلى هذا المورد',
      401
    ),

  Forbidden: () =>
    new APIError(
      ErrorCode.FORBIDDEN,
      'You do not have permission to access this resource',
      'ليس لديك صلاحية للوصول إلى هذا المورد',
      403
    ),

  InvalidCredentials: () =>
    new APIError(
      ErrorCode.INVALID_CREDENTIALS,
      'Invalid email or password',
      'البريد الإلكتروني أو كلمة المرور غير صحيحة',
      401
    ),

  TokenExpired: () =>
    new APIError(
      ErrorCode.TOKEN_EXPIRED,
      'Your session has expired, please login again',
      'انتهت صلاحية جلستك، يرجى تسجيل الدخول مرة أخرى',
      401
    ),

  // Validation
  ValidationError: (details: any) =>
    new APIError(
      ErrorCode.VALIDATION_ERROR,
      'Validation failed',
      'فشل التحقق من صحة البيانات',
      400,
      details
    ),

  InvalidInput: (field: string) =>
    new APIError(
      ErrorCode.INVALID_INPUT,
      `Invalid input for field: ${field}`,
      `مدخل غير صحيح للحقل: ${field}`,
      400,
      { field }
    ),

  MissingRequiredField: (field: string) =>
    new APIError(
      ErrorCode.MISSING_REQUIRED_FIELD,
      `Missing required field: ${field}`,
      `حقل مطلوب مفقود: ${field}`,
      400,
      { field }
    ),

  // Resources
  NotFound: (resource: string) =>
    new APIError(
      ErrorCode.NOT_FOUND,
      `${resource} not found`,
      `${resource} غير موجود`,
      404,
      { resource }
    ),

  AlreadyExists: (resource: string) =>
    new APIError(
      ErrorCode.ALREADY_EXISTS,
      `${resource} already exists`,
      `${resource} موجود بالفعل`,
      409,
      { resource }
    ),

  Conflict: (message: string, messageAr: string) =>
    new APIError(ErrorCode.CONFLICT, message, messageAr, 409),

  // Rate Limiting
  RateLimitExceeded: (retryAfter: number) =>
    new APIError(
      ErrorCode.RATE_LIMIT_EXCEEDED,
      'Too many requests, please try again later',
      'عدد كبير جداً من الطلبات، يرجى المحاولة لاحقاً',
      429,
      { retryAfter }
    ),

  // Server
  InternalServerError: (message?: string) =>
    new APIError(
      ErrorCode.INTERNAL_SERVER_ERROR,
      message || 'An unexpected error occurred',
      'حدث خطأ غير متوقع',
      500
    ),

  DatabaseError: (details?: any) =>
    new APIError(
      ErrorCode.DATABASE_ERROR,
      'Database operation failed',
      'فشلت عملية قاعدة البيانات',
      500,
      details
    ),

  ExternalAPIError: (service: string, details?: any) =>
    new APIError(
      ErrorCode.EXTERNAL_API_ERROR,
      `External service error: ${service}`,
      `خطأ في الخدمة الخارجية: ${service}`,
      502,
      { service, ...details }
    ),

  ServiceUnavailable: () =>
    new APIError(
      ErrorCode.SERVICE_UNAVAILABLE,
      'Service temporarily unavailable',
      'الخدمة غير متاحة مؤقتاً',
      503
    ),
}

/**
 * Error handler for API routes
 */
export function handleAPIError(error: unknown): Response {
  console.error('API Error:', error)

  if (error instanceof APIError) {
    return Response.json(error.toJSON(), { status: error.statusCode })
  }

  // Handle Supabase errors
  if (error && typeof error === 'object' && 'code' in error) {
    const supabaseError = error as { code: string; message: string }
    
    // Map common Supabase error codes
    switch (supabaseError.code) {
      case 'PGRST116': // Not found
        return Response.json(
          APIErrors.NotFound('Resource').toJSON(),
          { status: 404 }
        )
      case '23505': // Unique violation
        return Response.json(
          APIErrors.AlreadyExists('Resource').toJSON(),
          { status: 409 }
        )
      case '42501': // Insufficient privilege
        return Response.json(
          APIErrors.Forbidden().toJSON(),
          { status: 403 }
        )
      default:
        return Response.json(
          APIErrors.DatabaseError({ code: supabaseError.code }).toJSON(),
          { status: 500 }
        )
    }
  }

  // Handle standard JavaScript errors
  if (error instanceof Error) {
    return Response.json(
      APIErrors.InternalServerError(error.message).toJSON(),
      { status: 500 }
    )
  }

  // Unknown error
  return Response.json(
    APIErrors.InternalServerError().toJSON(),
    { status: 500 }
  )
}

/**
 * Success response helper
 */
export function successResponse<T>(
  data: T,
  message?: string,
  messageAr?: string,
  statusCode: number = 200
): Response {
  return Response.json(
    {
      success: true,
      data,
      message: message || 'Operation successful',
      message_ar: messageAr || 'تمت العملية بنجاح',
      timestamp: new Date().toISOString(),
    },
    { status: statusCode }
  )
}
