import { NextResponse } from "next/server"

import { fetchDeploymentStatus } from "@/lib/vercel/deployments"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

export async function GET() {
  const result = await fetchDeploymentStatus({ limit: 12 })
  const statusCode = result.error ? 502 : 200

  return NextResponse.json(result, { status: statusCode })
}
