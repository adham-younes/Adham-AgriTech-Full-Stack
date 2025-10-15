# Adham AgriTech - API Documentation
# توثيق واجهات برمجة التطبيقات

**Version:** 1.0  
**Last Updated:** October 15, 2025  
**Base URL:** `/api`

---

## 📋 Table of Contents / جدول المحتويات

1. [Authentication](#authentication)
2. [AI Assistant](#ai-assistant)
3. [Weather API](#weather-api)
4. [Soil Analysis](#soil-analysis)
5. [Error Handling](#error-handling)
6. [Rate Limiting](#rate-limiting)

---

## 🔐 Authentication

All API endpoints require authentication via Supabase session cookies, except where noted.

### Headers Required
```
Cookie: sb-<project-ref>-auth-token
Content-Type: application/json
```

### Authentication Flow
1. User logs in via `/auth/login`
2. Supabase sets session cookies
3. Middleware validates session on protected routes
4. API routes access user via `getUser()`

---

## 🤖 AI Assistant

### Endpoint
`POST /api/ai-assistant`

### Description
AI-powered agricultural assistant using OpenAI GPT-4o-mini. Provides farming advice, recommendations, and answers in Arabic and English.

### Rate Limit
- **20 requests per minute** per client

### Request Body
```json
{
  "messages": [
    {
      "role": "user",
      "content": "ما هو أفضل وقت لزراعة الطماطم؟"
    }
  ]
}
```

### Request Schema
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| messages | Array<Message> | Yes | Conversation history |
| messages[].role | string | Yes | "user" or "assistant" |
| messages[].content | string | Yes | Message content |

### Response
Streaming response with AI-generated text.

### Example Request
```bash
curl -X POST https://your-domain.com/api/ai-assistant \
  -H "Content-Type: application/json" \
  -H "Cookie: sb-xxx-auth-token=xxx" \
  -d '{
    "messages": [
      {
        "role": "user",
        "content": "كيف أحسن إنتاج القمح؟"
      }
    ]
  }'
```

### Error Responses

#### 401 Unauthorized
```json
{
  "error": true,
  "code": "UNAUTHORIZED",
  "message": "Authentication required",
  "message_ar": "يجب تسجيل الدخول للوصول إلى هذا المورد",
  "timestamp": "2025-10-15T10:30:00.000Z"
}
```

#### 400 Bad Request
```json
{
  "error": true,
  "code": "VALIDATION_ERROR",
  "message": "Validation failed",
  "message_ar": "فشل التحقق من صحة البيانات",
  "details": {
    "messages": "Messages array is required"
  },
  "timestamp": "2025-10-15T10:30:00.000Z"
}
```

#### 429 Rate Limit Exceeded
```json
{
  "error": true,
  "code": "RATE_LIMIT_EXCEEDED",
  "message": "Too many requests, please try again later",
  "message_ar": "عدد كبير جداً من الطلبات، يرجى المحاولة لاحقاً",
  "details": {
    "retryAfter": 30
  },
  "timestamp": "2025-10-15T10:30:00.000Z"
}
```

---

## 🌦️ Weather API

### Endpoint
`GET /api/weather?location={location}&lat={lat}&lon={lon}`

### Description
Fetches current weather and 7-day forecast for farm locations.

### Rate Limit
- **100 requests per hour** per client

### Query Parameters
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| location | string | Optional | City name (e.g., "Cairo") |
| lat | number | Optional | Latitude |
| lon | number | Optional | Longitude |

**Note:** Provide either `location` OR (`lat` AND `lon`)

### Response Schema
```json
{
  "success": true,
  "data": {
    "current": {
      "temp": 28,
      "temp_ar": "٢٨",
      "feels_like": 30,
      "humidity": 65,
      "humidity_ar": "٦٥",
      "wind_speed": 12,
      "wind_speed_ar": "١٢",
      "description": "Partly cloudy",
      "description_ar": "غائم جزئياً",
      "icon": "02d",
      "pressure": 1013,
      "visibility": 10000,
      "uv_index": 7
    },
    "forecast": [
      {
        "date": "2025-10-16",
        "date_ar": "١٦ أكتوبر ٢٠٢٥",
        "temp_max": 32,
        "temp_max_ar": "٣٢",
        "temp_min": 22,
        "temp_min_ar": "٢٢",
        "humidity": 60,
        "description": "Sunny",
        "description_ar": "مشمس",
        "icon": "01d",
        "precipitation": 0,
        "wind_speed": 10
      }
      // ... 6 more days
    ],
    "location": {
      "name": "Cairo",
      "name_ar": "القاهرة",
      "country": "EG",
      "lat": 30.0444,
      "lon": 31.2357
    }
  },
  "message": "Weather data fetched successfully",
  "message_ar": "تم جلب بيانات الطقس بنجاح",
  "timestamp": "2025-10-15T10:30:00.000Z"
}
```

### Example Request
```bash
curl "https://your-domain.com/api/weather?lat=30.0444&lon=31.2357" \
  -H "Cookie: sb-xxx-auth-token=xxx"
```

### Error Responses

#### 400 Bad Request
```json
{
  "error": true,
  "code": "INVALID_INPUT",
  "message": "Invalid input for field: location",
  "message_ar": "مدخل غير صحيح للحقل: location",
  "details": {
    "field": "location"
  },
  "timestamp": "2025-10-15T10:30:00.000Z"
}
```

#### 502 External API Error
```json
{
  "error": true,
  "code": "EXTERNAL_API_ERROR",
  "message": "External service error: OpenWeather",
  "message_ar": "خطأ في الخدمة الخارجية: OpenWeather",
  "details": {
    "service": "OpenWeather"
  },
  "timestamp": "2025-10-15T10:30:00.000Z"
}
```

---

## 🌱 Soil Analysis

### Endpoint
`POST /api/soil-analysis/recommendations`

### Description
Generates AI-powered soil recommendations based on analysis results.

### Rate Limit
- **50 requests per hour** per client

### Request Body
```json
{
  "fieldId": "uuid-here",
  "soilData": {
    "pH": 6.5,
    "nitrogen": 45,
    "phosphorus": 30,
    "potassium": 120,
    "organic_matter": 3.5,
    "moisture": 25,
    "temperature": 22,
    "electrical_conductivity": 1.2
  },
  "cropType": "wheat",
  "language": "ar"
}
```

### Request Schema
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| fieldId | string (UUID) | Yes | Field identifier |
| soilData | object | Yes | Soil analysis data |
| soilData.pH | number | Yes | Soil pH (0-14) |
| soilData.nitrogen | number | Yes | Nitrogen (ppm) |
| soilData.phosphorus | number | Yes | Phosphorus (ppm) |
| soilData.potassium | number | Yes | Potassium (ppm) |
| soilData.organic_matter | number | No | Organic matter (%) |
| soilData.moisture | number | No | Moisture (%) |
| soilData.temperature | number | No | Temperature (°C) |
| soilData.electrical_conductivity | number | No | EC (dS/m) |
| cropType | string | Yes | Current or planned crop |
| language | string | No | "ar" or "en" (default: "ar") |

### Response Schema
```json
{
  "success": true,
  "data": {
    "recommendations": "توصيات مفصلة بناءً على تحليل التربة...",
    "fertilizer_plan": [
      {
        "type": "نتروجين",
        "amount": "50 كجم/هكتار",
        "timing": "قبل الزراعة بأسبوع",
        "notes": "يفضل استخدام سماد اليوريا"
      }
    ],
    "irrigation_advice": "يوصى بالري كل 3-4 أيام...",
    "warnings": [
      "مستوى الفوسفور منخفض قليلاً"
    ],
    "soil_health_score": 85
  },
  "message": "Recommendations generated successfully",
  "message_ar": "تم إنشاء التوصيات بنجاح",
  "timestamp": "2025-10-15T10:30:00.000Z"
}
```

### Example Request
```bash
curl -X POST https://your-domain.com/api/soil-analysis/recommendations \
  -H "Content-Type: application/json" \
  -H "Cookie: sb-xxx-auth-token=xxx" \
  -d '{
    "fieldId": "123e4567-e89b-12d3-a456-426614174000",
    "soilData": {
      "pH": 6.5,
      "nitrogen": 45,
      "phosphorus": 30,
      "potassium": 120
    },
    "cropType": "wheat",
    "language": "ar"
  }'
```

---

## ⚠️ Error Handling

All API endpoints use standardized error responses.

### Error Response Format
```json
{
  "error": true,
  "code": "ERROR_CODE",
  "message": "Error message in English",
  "message_ar": "رسالة الخطأ بالعربية",
  "details": {},
  "timestamp": "2025-10-15T10:30:00.000Z"
}
```

### Error Codes

| Code | Status | Description (EN) | Description (AR) |
|------|--------|------------------|------------------|
| UNAUTHORIZED | 401 | Authentication required | يجب تسجيل الدخول |
| FORBIDDEN | 403 | No permission | ليس لديك صلاحية |
| INVALID_CREDENTIALS | 401 | Wrong email/password | بيانات دخول خاطئة |
| VALIDATION_ERROR | 400 | Invalid input | بيانات غير صحيحة |
| NOT_FOUND | 404 | Resource not found | غير موجود |
| ALREADY_EXISTS | 409 | Resource exists | موجود بالفعل |
| RATE_LIMIT_EXCEEDED | 429 | Too many requests | طلبات كثيرة جداً |
| INTERNAL_SERVER_ERROR | 500 | Server error | خطأ في الخادم |
| DATABASE_ERROR | 500 | Database failed | خطأ قاعدة بيانات |
| EXTERNAL_API_ERROR | 502 | External service failed | خطأ خدمة خارجية |

---

## 🚦 Rate Limiting

Rate limiting is applied per IP address and user agent.

### Limits by Endpoint

| Endpoint | Limit | Window |
|----------|-------|--------|
| `/api/ai-assistant` | 20 requests | 1 minute |
| `/api/weather` | 100 requests | 1 hour |
| `/api/soil-analysis/*` | 50 requests | 1 hour |
| General API | 100 requests | 1 minute |
| Authentication | 5 attempts | 15 minutes |

### Rate Limit Headers
```
X-RateLimit-Limit: 20
X-RateLimit-Remaining: 15
X-RateLimit-Reset: 1697365800
```

### Rate Limit Response
When rate limit is exceeded:
```json
{
  "error": true,
  "code": "RATE_LIMIT_EXCEEDED",
  "message": "Too many requests, please try again later",
  "message_ar": "عدد كبير جداً من الطلبات، يرجى المحاولة لاحقاً",
  "details": {
    "retryAfter": 30
  },
  "timestamp": "2025-10-15T10:30:00.000Z"
}
```

---

## 📚 Additional Resources

### Authentication
- [Supabase Auth Documentation](https://supabase.com/docs/guides/auth)
- Middleware: `/middleware.ts`
- Client setup: `/lib/supabase/client.ts`

### Database
- Schema scripts: `/scripts/*.sql`
- All tables have Row Level Security (RLS)
- User isolation enforced at database level

### External Services
- **OpenAI:** GPT-4o-mini for AI assistant
- **OpenWeather:** Weather data and forecasts
- **Planet Labs:** Satellite imagery
- **Mapbox:** Maps and geolocation

---

## 🔧 Development Setup

### Required Environment Variables
See `.env.local.example` for complete list:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `OPENAI_API_KEY`
- `OPENWEATHER_API_KEY`
- `PLANET_API_KEY`
- `NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN`

### Testing APIs Locally
```bash
# Install dependencies
pnpm install

# Set up environment
cp .env.local.example .env.local
# Edit .env.local with your keys

# Run development server
pnpm dev

# API available at http://localhost:3000/api
```

---

## 📞 Support

For API issues or questions:
- **Email:** adhamlouxor@gmail.com
- **Project:** https://v0.app/chat/projects/UaFHyHNnIQx

---

**Documentation Version:** 1.0  
**Last Updated:** October 15, 2025  
**Created by:** AI Code Assistant (Based on REPOSITORY_INSPECTION_REPORT.md)
