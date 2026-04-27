import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

const PROTECTED_PATHS = ["/dashboard", "/ats", "/interview", "/jobs"]
const AUTH_PAGES = ["/login", "/verify-otp", "/complete-profile"]

export function middleware(req: NextRequest) {

  const accessToken = req.cookies.get("accessToken")?.value
  const refreshToken = req.cookies.get("refreshToken")?.value
  const hasSession = !!(accessToken || refreshToken)

  const pathname = req.nextUrl.pathname

  const isProtected = PROTECTED_PATHS.some(p => pathname.startsWith(p))
  const isAuthPage = AUTH_PAGES.some(p => pathname.startsWith(p))

  // Protected route with no session → redirect to login
  if (isProtected && !hasSession) {
    return redirect("/login", req)
  }

  // Auth page with active session → redirect home
  if (isAuthPage && hasSession) {
    return redirect("/", req)
  }

  return passThrough(req)
}

function redirect(path: string, req: NextRequest) {
  return setSecurityHeaders(NextResponse.redirect(new URL(path, req.url)), req)
}

function passThrough(req: NextRequest) {
  const reqHeaders = new Headers(req.headers)
  reqHeaders.set("x-pathname", req.nextUrl.pathname)
  return setSecurityHeaders(
    NextResponse.next({ request: { headers: reqHeaders } }),
    req
  )
}

function setSecurityHeaders(response: NextResponse, req: NextRequest) {
  response.headers.set("X-Frame-Options", "DENY")
  response.headers.set("X-Content-Type-Options", "nosniff")
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin")
  response.headers.set("Permissions-Policy", "camera=(), microphone=(), geolocation=()")
  if (req.nextUrl.protocol === "https:") {
    response.headers.set("Strict-Transport-Security", "max-age=31536000; includeSubDomains")
  }
  return response
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|api/).*)"]
}
