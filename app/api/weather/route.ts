export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const location = searchParams.get("location") || "Cairo,EG"
    const lang = searchParams.get("lang") || "en"

    // Mock weather data for demonstration
    // In production, you would use OpenWeather API with process.env.OPENWEATHER_API_KEY
    const mockWeatherData = {
      current: {
        temp: 28 + Math.random() * 10,
        feels_like: 30 + Math.random() * 8,
        humidity: 45 + Math.random() * 30,
        wind_speed: 3 + Math.random() * 7,
        visibility: 8000 + Math.random() * 2000,
        pressure: 1010 + Math.random() * 20,
        condition: ["Clear", "Partly Cloudy", "Cloudy", "Light Rain"][Math.floor(Math.random() * 4)],
      },
      forecast: Array.from({ length: 7 }, (_, i) => ({
        date: new Date(Date.now() + i * 24 * 60 * 60 * 1000).toISOString(),
        temp_max: 30 + Math.random() * 8,
        temp_min: 18 + Math.random() * 8,
        condition: ["Clear", "Partly Cloudy", "Cloudy", "Light Rain"][Math.floor(Math.random() * 4)],
      })),
    }

    // Uncomment this to use real OpenWeather API:
    /*
    const apiKey = process.env.OPENWEATHER_API_KEY
    if (!apiKey) {
      return Response.json({ error: "API key not configured" }, { status: 500 })
    }

    const currentResponse = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${apiKey}&units=metric&lang=${lang}`
    )
    const currentData = await currentResponse.json()

    const forecastResponse = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast/daily?q=${location}&appid=${apiKey}&units=metric&cnt=7&lang=${lang}`
    )
    const forecastData = await forecastResponse.json()

    return Response.json({
      current: {
        temp: currentData.main.temp,
        feels_like: currentData.main.feels_like,
        humidity: currentData.main.humidity,
        wind_speed: currentData.wind.speed,
        visibility: currentData.visibility,
        pressure: currentData.main.pressure,
        condition: currentData.weather[0].description,
      },
      forecast: forecastData.list.map((day: any) => ({
        date: new Date(day.dt * 1000).toISOString(),
        temp_max: day.temp.max,
        temp_min: day.temp.min,
        condition: day.weather[0].description,
      })),
    })
    */

    return Response.json(mockWeatherData)
  } catch (error) {
    console.error("[v0] Error fetching weather:", error)
    return Response.json({ error: "Failed to fetch weather data" }, { status: 500 })
  }
}
