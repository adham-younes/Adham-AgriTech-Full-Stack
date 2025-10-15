# Adham AgriTech API Documentation

## Overview

The Adham AgriTech platform provides a comprehensive set of APIs for smart agriculture management. All APIs use JSON for request and response bodies.

### Base URL
```
https://your-domain.com/api
```

### Authentication

Most endpoints require authentication via Supabase Auth. Include the authentication token in the Authorization header:

```
Authorization: Bearer YOUR_AUTH_TOKEN
```

### Rate Limiting

All API endpoints are rate-limited to prevent abuse:

- **AI Assistant**: 10 requests per minute
- **Weather API**: 30 requests per minute
- **Soil Analysis**: 10 requests per minute
- **General APIs**: 60 requests per minute

Rate limit headers are included in responses:
- `X-RateLimit-Limit`: Maximum requests allowed
- `X-RateLimit-Remaining`: Remaining requests in current window
- `X-RateLimit-Reset`: Time when the rate limit resets

## Endpoints

### 1. AI Agricultural Assistant

**Endpoint**: `POST /api/ai-assistant`

**Description**: Get AI-powered agricultural advice and recommendations.

**Request Body**:
```json
{
  "messages": [
    {
      "role": "user",
      "content": "Your question here"
    }
  ],
  "language": "ar" // or "en"
}
```

**Response**: Server-Sent Events (SSE) stream with AI response

**Example**:
```bash
curl -X POST https://your-domain.com/api/ai-assistant \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "messages": [{"role": "user", "content": "ما هو أفضل وقت لزراعة القمح في مصر؟"}],
    "language": "ar"
  }'
```

### 2. Weather Data

**Endpoint**: `GET /api/weather`

**Description**: Get current weather and 7-day forecast for a location.

**Query Parameters**:
- `location` (optional): Location name (default: "Cairo,EG")
- `lang` (optional): Language code "ar" or "en" (default: "ar")

**Response**:
```json
{
  "current": {
    "temp": 25,
    "feels_like": 26,
    "humidity": 45,
    "wind_speed": 12,
    "wind_direction": 180,
    "visibility": 10,
    "pressure": 1013,
    "condition": "سماء صافية",
    "icon": "01d",
    "sunrise": "2024-01-15T04:45:00Z",
    "sunset": "2024-01-15T17:15:00Z"
  },
  "forecast": [
    {
      "date": "2024-01-15T00:00:00Z",
      "temp_max": 28,
      "temp_min": 18,
      "temp_avg": 23,
      "humidity_avg": 50,
      "wind_speed_avg": 15,
      "condition": "مشمس جزئياً",
      "icon": "02d",
      "rain_chance": 10
    }
  ],
  "location": {
    "name": "Cairo",
    "country": "EG",
    "lat": 30.0444,
    "lon": 31.2357
  },
  "timestamp": "2024-01-15T12:00:00Z",
  "cached": false
}
```

**Example**:
```bash
curl "https://your-domain.com/api/weather?location=Alexandria,EG&lang=ar" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### 3. Soil Analysis Recommendations

**Endpoint**: `POST /api/soil-analysis/recommendations`

**Description**: Get AI-powered recommendations based on soil analysis results.

**Request Body**:
```json
{
  "ph_level": 7.2,
  "nitrogen_ppm": 15,
  "phosphorus_ppm": 25,
  "potassium_ppm": 200,
  "organic_matter_percent": 2.5,
  "moisture_percent": 18,
  "language": "ar"
}
```

**Response**:
```json
{
  "recommendations": "Detailed recommendations text...",
  "analysis_summary": {
    "ph_status": "neutral",
    "nitrogen_status": "adequate",
    "phosphorus_status": "adequate",
    "potassium_status": "adequate"
  },
  "timestamp": "2024-01-15T12:00:00Z"
}
```

**Example**:
```bash
curl -X POST https://your-domain.com/api/soil-analysis/recommendations \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "ph_level": 6.8,
    "nitrogen_ppm": 12,
    "phosphorus_ppm": 20,
    "potassium_ppm": 180,
    "language": "ar"
  }'
```

## Error Responses

All endpoints return consistent error responses:

```json
{
  "error": "Error message",
  "timestamp": "2024-01-15T12:00:00Z"
}
```

### Common HTTP Status Codes:

- `200`: Success
- `400`: Bad Request - Invalid input data
- `401`: Unauthorized - Missing or invalid authentication
- `429`: Too Many Requests - Rate limit exceeded
- `500`: Internal Server Error
- `503`: Service Unavailable - External service error

## Best Practices

1. **Caching**: Weather data is cached for 10 minutes. Use the `cached` field to determine if data is from cache.

2. **Language Support**: All endpoints support Arabic (`ar`) and English (`en`) languages.

3. **Error Handling**: Always check the response status and handle errors appropriately.

4. **Rate Limiting**: Implement exponential backoff when receiving 429 responses.

5. **Security**: Never expose your API tokens in client-side code.

## Environment Variables

Required environment variables for API functionality:

```env
# AI Service
AI_PROVIDER=groq
GROQ_API_KEY=your_groq_api_key
OPENAI_API_KEY=your_openai_api_key (optional)

# Weather Service
OPENWEATHER_API_KEY=your_openweather_api_key

# Database
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Rate Limiting
AI_RATE_LIMIT=10
WEATHER_RATE_LIMIT=30
```

## SDK Examples

### JavaScript/TypeScript

```typescript
// AI Assistant
async function askAI(question: string, language: 'ar' | 'en' = 'ar') {
  const response = await fetch('/api/ai-assistant', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${authToken}`
    },
    body: JSON.stringify({
      messages: [{ role: 'user', content: question }],
      language
    })
  });

  // Handle SSE stream
  const reader = response.body?.getReader();
  // ... process stream
}

// Weather API
async function getWeather(location: string = 'Cairo,EG') {
  const response = await fetch(`/api/weather?location=${location}&lang=ar`, {
    headers: {
      'Authorization': `Bearer ${authToken}`
    }
  });
  
  return response.json();
}

// Soil Analysis
async function getSoilRecommendations(soilData: SoilData) {
  const response = await fetch('/api/soil-analysis/recommendations', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${authToken}`
    },
    body: JSON.stringify(soilData)
  });
  
  return response.json();
}
```

## Support

For API support, please contact:
- Email: api-support@adham-agritech.com
- Documentation: https://docs.adham-agritech.com
- Status Page: https://status.adham-agritech.com