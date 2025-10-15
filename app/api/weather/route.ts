// Simple in-memory cache implementation
const weatherCache = new Map<string, { data: any; timestamp: number }>()
const CACHE_DURATION = 10 * 60 * 1000 // 10 minutes

// Rate limiting for weather API
const weatherRateLimit = new Map<string, { count: number; resetTime: number }>()
const WEATHER_RATE_LIMIT = 30 // requests per minute
const WEATHER_RATE_WINDOW = 60 * 1000 // 1 minute

function checkWeatherRateLimit(clientIp: string): boolean {
  const now = Date.now()
  const clientData = weatherRateLimit.get(clientIp)
  
  if (!clientData || now > clientData.resetTime) {
    weatherRateLimit.set(clientIp, { count: 1, resetTime: now + WEATHER_RATE_WINDOW })
    return true
  }
  
  if (clientData.count >= WEATHER_RATE_LIMIT) {
    return false
  }
  
  clientData.count++
  return true
}

function getCacheKey(location: string, lang: string): string {
  return `weather_${location}_${lang}`
}

function getCachedData(key: string): any | null {
  const cached = weatherCache.get(key)
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.data
  }
  return null
}

function setCachedData(key: string, data: any): void {
  weatherCache.set(key, { data, timestamp: Date.now() })
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const location = searchParams.get("location") || "Cairo,EG"
    const lang = searchParams.get("lang") || "ar" // Default to Arabic for Egyptian users

    // Extract client IP for rate limiting
    const clientIp = request.headers.get("x-forwarded-for") || 
                    request.headers.get("x-real-ip") || 
                    "unknown"
    
    // Check rate limit
    if (!checkWeatherRateLimit(clientIp)) {
      return Response.json(
        { error: "Rate limit exceeded. Please try again later." },
        { status: 429 }
      )
    }

    // Check cache first
    const cacheKey = getCacheKey(location, lang)
    const cachedData = getCachedData(cacheKey)
    if (cachedData) {
      return Response.json({
        ...cachedData,
        cached: true,
        cacheTimestamp: new Date().toISOString()
      })
    }

    const apiKey = process.env.OPENWEATHER_API_KEY
    if (!apiKey) {
      console.error("[Weather API] OpenWeather API key not configured")
      
      // Return sample data for development
      if (process.env.NODE_ENV === "development") {
        return Response.json({
          current: {
            temp: 25,
            feels_like: 26,
            humidity: 45,
            wind_speed: 12,
            visibility: 10000,
            pressure: 1013,
            condition: lang === "ar" ? "سماء صافية" : "Clear sky",
          },
          forecast: Array.from({ length: 7 }, (_, i) => ({
            date: new Date(Date.now() + i * 24 * 60 * 60 * 1000).toISOString(),
            temp_max: 28 + Math.random() * 5,
            temp_min: 18 + Math.random() * 3,
            condition: lang === "ar" ? "مشمس جزئياً" : "Partly sunny",
          })),
          mock: true,
        })
      }
      
      return Response.json({ error: "Weather service not configured" }, { status: 503 })
    }

    // Fetch current weather with timeout
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 5000) // 5 second timeout

    try {
      const currentResponse = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${apiKey}&units=metric&lang=${lang}`,
        { signal: controller.signal }
      )
      clearTimeout(timeout)

      if (!currentResponse.ok) {
        console.error("[Weather API] OpenWeather API error:", currentResponse.status)
        return Response.json({ 
          error: lang === "ar" ? "فشل في جلب بيانات الطقس" : "Failed to fetch weather data",
          details: currentResponse.statusText 
        }, { status: currentResponse.status })
      }

      const currentData = await currentResponse.json()

      // Fetch 7-day forecast
      const forecastController = new AbortController()
      const forecastTimeout = setTimeout(() => forecastController.abort(), 5000)
      
      const forecastResponse = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?q=${location}&appid=${apiKey}&units=metric&cnt=56&lang=${lang}`,
        { signal: forecastController.signal }
      )
      clearTimeout(forecastTimeout)

      if (!forecastResponse.ok) {
        console.error("[Weather API] OpenWeather forecast API error:", forecastResponse.status)
        // Return current weather even if forecast fails
        return Response.json({
          current: {
            temp: currentData.main.temp,
            feels_like: currentData.main.feels_like,
            humidity: currentData.main.humidity,
            wind_speed: currentData.wind.speed,
            visibility: currentData.visibility,
            pressure: currentData.main.pressure,
            condition: currentData.weather[0].description,
            icon: currentData.weather[0].icon,
          },
          forecast: [],
          forecastError: true,
        })
      }

      const forecastData = await forecastResponse.json()

      // Process forecast data to get daily forecasts with more details
      const dailyForecasts = []
      const dailyData = new Map<string, any>()

      for (const item of forecastData.list) {
        const date = new Date(item.dt * 1000).toISOString().split("T")[0]
        
        if (!dailyData.has(date)) {
          dailyData.set(date, {
            date: new Date(item.dt * 1000).toISOString(),
            temp_max: item.main.temp_max,
            temp_min: item.main.temp_min,
            temps: [item.main.temp],
            humidity_avg: item.main.humidity,
            wind_speeds: [item.wind.speed],
            conditions: [item.weather[0].description],
            icons: [item.weather[0].icon],
            rain_chance: item.pop || 0,
          })
        } else {
          const dayData = dailyData.get(date)
          dayData.temp_max = Math.max(dayData.temp_max, item.main.temp_max)
          dayData.temp_min = Math.min(dayData.temp_min, item.main.temp_min)
          dayData.temps.push(item.main.temp)
          dayData.wind_speeds.push(item.wind.speed)
          dayData.rain_chance = Math.max(dayData.rain_chance, item.pop || 0)
        }
      }

      // Convert to array and calculate averages
      for (const [_, dayData] of dailyData) {
        if (dailyForecasts.length < 7) {
          dailyForecasts.push({
            date: dayData.date,
            temp_max: Math.round(dayData.temp_max),
            temp_min: Math.round(dayData.temp_min),
            temp_avg: Math.round(dayData.temps.reduce((a: number, b: number) => a + b, 0) / dayData.temps.length),
            humidity_avg: dayData.humidity_avg,
            wind_speed_avg: Math.round(dayData.wind_speeds.reduce((a: number, b: number) => a + b, 0) / dayData.wind_speeds.length),
            condition: dayData.conditions[0],
            icon: dayData.icons[0],
            rain_chance: Math.round(dayData.rain_chance * 100),
          })
        }
      }

      const responseData = {
        current: {
          temp: Math.round(currentData.main.temp),
          feels_like: Math.round(currentData.main.feels_like),
          humidity: currentData.main.humidity,
          wind_speed: Math.round(currentData.wind.speed * 3.6), // Convert m/s to km/h
          wind_direction: currentData.wind.deg,
          visibility: currentData.visibility / 1000, // Convert to km
          pressure: currentData.main.pressure,
          condition: currentData.weather[0].description,
          icon: currentData.weather[0].icon,
          sunrise: new Date(currentData.sys.sunrise * 1000).toISOString(),
          sunset: new Date(currentData.sys.sunset * 1000).toISOString(),
        },
        forecast: dailyForecasts,
        location: {
          name: currentData.name,
          country: currentData.sys.country,
          lat: currentData.coord.lat,
          lon: currentData.coord.lon,
        },
        timestamp: new Date().toISOString(),
      }

      // Cache the response
      setCachedData(cacheKey, responseData)

      return Response.json(responseData)
    } catch (error: any) {
      clearTimeout(timeout)
      
      if (error.name === 'AbortError') {
        return Response.json({ 
          error: lang === "ar" ? "انتهت مهلة الطلب" : "Request timeout" 
        }, { status: 504 })
      }
      
      throw error
    }
  } catch (error) {
    console.error("[Weather API] Error fetching weather:", error)
    return Response.json({ 
      error: lang === "ar" ? "خطأ في خدمة الطقس" : "Weather service error" 
    }, { status: 500 })
  }
}
