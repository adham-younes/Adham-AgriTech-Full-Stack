const cache = new Map<string, { timestamp: number; payload: any }>()

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const location = (searchParams.get("location") || "Cairo,EG").trim()
    const lang = (searchParams.get("lang") || "en").trim()

    const apiKey = process.env.OPENWEATHER_API_KEY
    if (!apiKey) {
      console.error("[v0] OpenWeather API key not configured")
      return Response.json({ error: "API key not configured" }, { status: 500 })
    }

    const cacheKey = `${location}|${lang}`
    const cached = cache.get(cacheKey)
    if (cached && Date.now() - cached.timestamp < 5 * 60 * 1000) {
      return Response.json(cached.payload, { headers: { "Cache-Control": "s-maxage=300, stale-while-revalidate=60" } })
    }

    // Fetch current weather
    const currentResponse = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${apiKey}&units=metric&lang=${lang}`,
    )

    if (!currentResponse.ok) {
      console.error("[v0] OpenWeather API error:", await currentResponse.text())
      return Response.json({ error: "Failed to fetch weather data" }, { status: currentResponse.status })
    }

    const currentData = await currentResponse.json()

    // Fetch 7-day forecast
    const forecastResponse = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?q=${location}&appid=${apiKey}&units=metric&cnt=56&lang=${lang}`,
    )

    if (!forecastResponse.ok) {
      console.error("[v0] OpenWeather forecast API error:", await forecastResponse.text())
      return Response.json({ error: "Failed to fetch forecast data" }, { status: forecastResponse.status })
    }

    const forecastData = await forecastResponse.json()

    // Process forecast data to aggregate daily highs/lows and first condition
    const dailyMap = new Map<string, { dateIso: string; max: number; min: number; condition: string }>()
    for (const item of forecastData.list as Array<any>) {
      const dateKey = new Date(item.dt * 1000).toISOString().split("T")[0]
      const entry = dailyMap.get(dateKey)
      const tempMax = Number(item.main.temp_max)
      const tempMin = Number(item.main.temp_min)
      const condition = item.weather?.[0]?.description ?? ""
      if (!entry) {
        dailyMap.set(dateKey, {
          dateIso: new Date(item.dt * 1000).toISOString(),
          max: tempMax,
          min: tempMin,
          condition,
        })
      } else {
        entry.max = Math.max(entry.max, tempMax)
        entry.min = Math.min(entry.min, tempMin)
        // keep earliest condition
      }
    }
    const dailyForecasts = Array.from(dailyMap.entries())
      .sort((a, b) => (a[0] < b[0] ? -1 : 1))
      .slice(0, 7)
      .map(([, v]) => ({ date: v.dateIso, temp_max: v.max, temp_min: v.min, condition: v.condition }))

    const payload = {
      current: {
        temp: currentData.main.temp,
        feels_like: currentData.main.feels_like,
        humidity: currentData.main.humidity,
        wind_speed: currentData.wind.speed,
        visibility: currentData.visibility,
        pressure: currentData.main.pressure,
        condition: currentData.weather[0].description,
      },
      forecast: dailyForecasts,
    }

    cache.set(cacheKey, { timestamp: Date.now(), payload })
    return Response.json(payload, { headers: { "Cache-Control": "s-maxage=300, stale-while-revalidate=60" } })
  } catch (error) {
    console.error("[v0] Error fetching weather:", error)
    return Response.json({ error: "Failed to fetch weather data" }, { status: 500 })
  }
}
