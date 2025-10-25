import { NextResponse } from "next/server"
import { z } from "zod"

const payloadSchema = z.object({
  name: z.string().min(2).max(80),
  email: z.string().email().max(160),
  organization: z.string().min(2).max(120),
  focusAreas: z.string().min(2).max(240),
  goals: z.string().min(10).max(500),
})

export async function POST(request: Request) {
  try {
    const payload = await request.json()
    const data = payloadSchema.parse(payload)

    const webhookUrl = process.env.BETA_SIGNUP_WEBHOOK_URL

    if (webhookUrl) {
      await fetch(webhookUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type: "mobile-beta",
          receivedAt: new Date().toISOString(),
          ...data,
        }),
      })
    }

    return NextResponse.json({ message: "Signup received" })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ message: "Invalid form submission" }, { status: 400 })
    }

    console.error("beta-signup error", error)
    return NextResponse.json(
      {
        message: "We could not record your request. Please try again in a moment.",
      },
      { status: 500 },
    )
  }
}
