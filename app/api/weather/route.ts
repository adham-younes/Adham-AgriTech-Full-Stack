import { rateLimit, RateLimitConfigs } from "@/lib/middleware/rate-limit"
import { handleAPIError, APIErrors, successResponse } from "@/lib/errors/api-errors"
import { createClient } from "@/lib/supabase/server"

export async function GET(request: Request) {
  try {
    // Apply rate limiting
    const rateLimitResult = await rateLimit(request, RateLimitConfigs.WEATHER)
    if (!rateLimitResult.success) {
      return Response.json(rateLimitResult.error, { status: 429 })
    }

    // Verify authentication
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return Response.json(APIErrors.Unauthorized().toJSON(), { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const location = searchParams.get("location")
    const lat = searchParams.get("lat")
    const lon = searchParams.get("lon")
    const lang = searchParams.get("lang") || "en"

    // Validate input
    if (!location && (!lat || !lon)) {
      return Response.json(
        APIErrors.ValidationError({ 
          message: "Either 'location' or both 'lat' and 'lon' parameters are required" 
        }).toJSON(),
        { status: 400 }
      )
    }

    const apiKey = process.env.OPENWEATHER_API_KEY
    if (!apiKey) {
      console.error("OpenWeather API key not configured")
      return Response.json(
        APIErrors.ExternalAPIError("OpenWeather", { reason: "API key not configured" }).toJSON(),
        { status: 500 }
      )
    }

    // Build API URL
    const weatherUrl = location
      ? `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${apiKey}&units=metric&lang=${lang}`
      : `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric&lang=${lang}`

    // Fetch current weather
    const currentResponse = await fetch(weatherUrl)

    if (!currentResponse.ok) {
      const errorText = await currentResponse.text()
      console.error("OpenWeather API error:", errorText)
      return Response.json(
        APIErrors.ExternalAPIError("OpenWeather", { status: currentResponse.status }).toJSON(),
        { status: 502 }
      )
    }

    const currentData = await currentResponse.json()

    // Build forecast URL
    const forecastUrl = location
      ? `https://api.openweathermap.org/data/2.5/forecast?q=${location}&appid=${apiKey}&units=metric&cnt=56&lang=${lang}`
      : `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric&cnt=56&lang=${lang}`

    // Fetch 7-day forecast
    const forecastResponse = await fetch(forecastUrl)

    if (!forecastResponse.ok) {
      const errorText = await forecastResponse.text()
      console.error("OpenWeather forecast API error:", errorText)
      return Response.json(
        APIErrors.ExternalAPIError("OpenWeather Forecast", { status: forecastResponse.status }).toJSON(),
        { status: 502 }
      )
    }

    const forecastData = await forecastResponse.json()

    // Process forecast data to get daily forecasts
    const dailyForecasts = []
    const processedDates = new Set()

    for (const item of forecastData.list) {
      const date = new Date(item.dt * 1000).toISOString().split("T")[0]
      if (!processedDates.has(date) && dailyForecasts.length < 7) {
        processedDates.add(date)
        dailyForecasts.push({
          date: new Date(item.dt * 1000).toISOString(),
          temp_max: item.main.temp_max,
          temp_min: item.main.temp_min,
          condition: item.weather[0].description,
          humidity: item.main.humidity,
          wind_speed: item.wind.speed,
          icon: item.weather[0].icon,
        })
      }
    }

    const responseData = {
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
      forecast: dailyForecasts,
      location: {
        name: currentData.name,
        country: currentData.sys.country,
        lat: currentData.coord.lat,
        lon: currentData.coord.lon,
      },
    }

    return successResponse(
      responseData,
      "Weather data fetched successfully",
      "تم جلب بيانات الطقس بنجاح"
    )
  } catch (error) {
    return handleAPIError(error)
  }
}
