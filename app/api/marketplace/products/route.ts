import { NextResponse } from "next/server"
import { getMarketplaceCatalog } from "@/lib/marketplace/catalog"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const query = searchParams.get("q") ?? undefined
  const category = searchParams.get("category") ?? undefined
  const limitParam = searchParams.get("limit")
  const limit = limitParam ? Math.min(50, Math.max(1, Number(limitParam))) : undefined

  try {
    const catalog = await getMarketplaceCatalog({ query, category, limit })

    return NextResponse.json(catalog, {
      headers: {
        "Cache-Control": "s-maxage=300, stale-while-revalidate=600",
      },
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error"
    return NextResponse.json(
      {
        error: message,
      },
      { status: 500 },
    )
  }
}
