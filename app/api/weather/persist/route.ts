import { NextResponse } from "next/server"
import { createServerClient } from "@supabase/ssr"

export async function POST(req: Request) {
  try {
    const { farm_id, location = "Cairo,EG", lang = "en" } = await req.json()
    if (!farm_id) return NextResponse.json({ error: "farm_id is required" }, { status: 400 })

    const apiKey = process.env.OPENWEATHER_API_KEY
    if (!apiKey) return NextResponse.json({ error: "API key not configured" }, { status: 500 })

    const weatherResp = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${apiKey}&units=metric&lang=${lang}`,
    )
    if (!weatherResp.ok) return NextResponse.json({ error: "Failed to fetch weather" }, { status: weatherResp.status })
    const weather = await weatherResp.json()

    const forecastResp = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?q=${location}&appid=${apiKey}&units=metric&cnt=56&lang=${lang}`,
    )
    if (!forecastResp.ok)
      return NextResponse.json({ error: "Failed to fetch forecast" }, { status: forecastResp.status })
    const forecast = await forecastResp.json()

    // Supabase insert
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      { cookies: { getAll() { return [] }, setAll() {} } },
    )

    const { error } = await supabase.from("weather_data").insert({
      farm_id,
      date: new Date().toISOString().slice(0, 10),
      temperature: weather.main?.temp ?? null,
      humidity: weather.main?.humidity ?? null,
      precipitation: weather.rain?.["1h"] ?? null,
      wind_speed: weather.wind?.speed ?? null,
      wind_direction: weather.wind?.deg?.toString() ?? null,
      pressure: weather.main?.pressure ?? null,
      weather_condition: weather.weather?.[0]?.description ?? null,
      forecast_data: forecast,
    })

    if (error) return NextResponse.json({ error: error.message }, { status: 400 })

    return NextResponse.json({ ok: true })
  } catch (error: any) {
    return NextResponse.json({ error: error?.message ?? "Unexpected error" }, { status: 500 })
  }
}
