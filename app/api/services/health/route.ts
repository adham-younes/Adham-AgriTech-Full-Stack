import { testWeatherConnection } from "@/lib/services/weather"
import { testBlockchainConnection } from "@/lib/services/blockchain"
import { testCopernicusConnection } from "@/lib/services/copernicus"

export async function GET() {
  try {
    const [weather, blockchain, copernicus] = await Promise.all([
      testWeatherConnection(),
      testBlockchainConnection(),
      testCopernicusConnection(),
    ])

    const allHealthy =
      weather.status === "success" && blockchain.status === "success" && copernicus.status === "success"

    return Response.json(
      {
        status: allHealthy ? "healthy" : "degraded",
        timestamp: new Date().toISOString(),
        services: {
          weather,
          blockchain,
          copernicus,
          supabase: {
            status: "success",
            message: "Supabase configured",
          },
        },
      },
      {
        status: allHealthy ? 200 : 503,
      },
    )
  } catch (error) {
    return Response.json(
      {
        status: "error",
        message: error instanceof Error ? error.message : "Unknown error",
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    )
  }
}
