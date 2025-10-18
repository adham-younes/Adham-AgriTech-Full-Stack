# API Documentation - Adham AgriTech

## Base URL
```
Development: http://localhost:3000/api
Production: https://your-domain.com/api
```

## Authentication

All API endpoints require authentication via Supabase Auth tokens. Include the token in the Authorization header:

```
Authorization: Bearer YOUR_SUPABASE_ACCESS_TOKEN
```

## Endpoints

### 1. AI Assistant

#### POST `/api/ai-assistant`

Chat with the agricultural AI assistant.

**Request Body:**
```json
{
  "messages": [
    {
      "role": "user",
      "content": "كيف أزرع الطماطم في الصيف؟"
    }
  ],
  "language": "ar" // or "en"
}
```

**Response:**
```
Stream of text data with AI response
```

**Example cURL:**
```bash
curl -X POST http://localhost:3000/api/ai-assistant \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "messages": [{"role": "user", "content": "ما هي أفضل أنواع الأسمدة للقمح؟"}],
    "language": "ar"
  }'
```

---

### 2. Weather Data

#### GET `/api/weather`

Get current weather and 7-day forecast.

**Query Parameters:**
- `location` (optional): City name (default: "Cairo,EG")
- `lang` (optional): Language code "ar" or "en" (default: "en")

**Response:**
```json
{
  "current": {
    "temp": 25.5,
    "feels_like": 24.8,
    "humidity": 60,
    "wind_speed": 3.5,
    "visibility": 10000,
    "pressure": 1015,
    "condition": "clear sky"
  },
  "forecast": [
    {
      "date": "2024-01-15T00:00:00.000Z",
      "temp_max": 28,
      "temp_min": 18,
      "condition": "few clouds"
    }
    // ... 6 more days
  ]
}
```

**Example cURL:**
```bash
curl -X GET "http://localhost:3000/api/weather?location=Alexandria,EG&lang=ar" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

### 3. Soil Analysis Recommendations

#### POST `/api/soil-analysis/recommendations`

Generate AI-powered soil analysis recommendations.

**Request Body:**
```json
{
  "ph_level": 7.2,
  "nitrogen_ppm": 45,
  "phosphorus_ppm": 30,
  "potassium_ppm": 280,
  "organic_matter_percent": 2.5,
  "moisture_percent": 18,
  "language": "ar"
}
```

**Response:**
```json
{
  "recommendations": "بناءً على نتائج تحليل التربة:\n\n1. **حالة التربة**: التربة في حالة جيدة..."
}
```

**Example cURL:**
```bash
curl -X POST http://localhost:3000/api/soil-analysis/recommendations \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "ph_level": 6.8,
    "nitrogen_ppm": 35,
    "phosphorus_ppm": 25,
    "potassium_ppm": 250,
    "language": "ar"
  }'
```

---

## Database Operations (via Supabase SDK)

### Farms

#### Create Farm
```javascript
const { data, error } = await supabase
  .from('farms')
  .insert({
    name: 'مزرعة الأمل',
    location: 'الإسماعيلية',
    area: 50,
    latitude: 30.5965,
    longitude: 32.2715
  })
```

#### Get User's Farms
```javascript
const { data, error } = await supabase
  .from('farms')
  .select('*')
  .order('created_at', { ascending: false })
```

#### Update Farm
```javascript
const { data, error } = await supabase
  .from('farms')
  .update({ name: 'مزرعة النور' })
  .eq('id', 'farm-id')
```

---

### Fields

#### Create Field
```javascript
const { data, error } = await supabase
  .from('fields')
  .insert({
    farm_id: 'farm-uuid',
    name: 'حقل القمح الشرقي',
    area: 10,
    crop_type: 'قمح',
    irrigation_type: 'sprinkler'
  })
```

#### Get Fields with Farm Data
```javascript
const { data, error } = await supabase
  .from('fields')
  .select('*, farms(name)')
  .eq('farm_id', 'farm-uuid')
```

---

### Crop Monitoring

#### Add Monitoring Data
```javascript
const { data, error } = await supabase
  .from('crop_monitoring')
  .insert({
    field_id: 'field-uuid',
    monitoring_date: '2024-01-15',
    health_status: 'good',
    ndvi_value: 0.75,
    evi_value: 0.68
  })
```

#### Get Monitoring History
```javascript
const { data, error } = await supabase
  .from('crop_monitoring')
  .select('*, fields(name, farms(name))')
  .eq('field_id', 'field-uuid')
  .order('monitoring_date', { ascending: false })
```

---

### Soil Analysis

#### Create Analysis
```javascript
const { data, error } = await supabase
  .from('soil_analysis')
  .insert({
    field_id: 'field-uuid',
    analysis_date: '2024-01-15',
    ph_level: 7.2,
    nitrogen: 45,
    phosphorus: 30,
    potassium: 280
  })
```

---

## Error Responses

All endpoints return errors in the following format:

```json
{
  "error": "Error message description",
  "code": "ERROR_CODE"
}
```

Common HTTP status codes:
- `200` - Success
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Internal Server Error

---

## Rate Limiting

Currently, there is no rate limiting implemented. This will be added in future updates.

---

## WebSocket/Realtime

Supabase provides realtime functionality. Subscribe to changes:

```javascript
const subscription = supabase
  .channel('notifications')
  .on('postgres_changes', 
    { event: 'INSERT', schema: 'public', table: 'notifications' },
    (payload) => {
      console.log('New notification:', payload.new)
    }
  )
  .subscribe()
```

---

## Environment Variables Required

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# External APIs
OPENWEATHER_API_KEY=
GROQ_API_KEY=

# Optional
GOOGLE_EARTH_ENGINE_API_KEY=
NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN=
```

---

## Testing

### Using Postman
1. Import the environment variables
2. Set the Authorization header
3. Test each endpoint

### Using Thunder Client (VS Code)
1. Install Thunder Client extension
2. Create a new request
3. Add headers and body as needed

---

## Support

For API support, contact: api-support@adham-agritech.com