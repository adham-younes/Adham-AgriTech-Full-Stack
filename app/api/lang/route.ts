import { NextResponse } from "next/server"

export async function POST(req: Request) {
  try {
    const { lang } = await req.json()
    const value = lang === "en" ? "en" : "ar"
    const res = NextResponse.json({ ok: true })
    res.cookies.set("lang", value, {
      httpOnly: false,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 365, // 1 year
    })
    return res
  } catch (error) {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 })
  }
}
