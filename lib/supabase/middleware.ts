import { NextResponse, type NextRequest } from "next/server"

const PUBLIC_PATH_PREFIXES = ["/marketplace", "/partners", "/docs"]

function isAuthPath(pathname: string) {
  return pathname === "/auth" || pathname.startsWith("/auth/")
}

function isPublicPath(pathname: string) {
  if (pathname === "/") {
    return true
  }

  return PUBLIC_PATH_PREFIXES.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`))
}

function hasSupabaseSessionCookie(request: NextRequest) {
  return request.cookies
    .getAll()
    .some((cookie) => cookie.name === "sb-access-token" || cookie.name.endsWith("-auth-token"))
}

export async function updateSession(request: NextRequest) {
  const isAuthenticated = hasSupabaseSessionCookie(request)
  const pathname = request.nextUrl.pathname

  if (!isAuthenticated && !isAuthPath(pathname) && !isPublicPath(pathname)) {
    const url = request.nextUrl.clone()
    url.pathname = "/auth/login"
    url.searchParams.set("redirectedFrom", pathname)
    return NextResponse.redirect(url)
  }

  if (isAuthenticated && isAuthPath(pathname)) {
    const url = request.nextUrl.clone()
    url.pathname = "/dashboard"
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}
