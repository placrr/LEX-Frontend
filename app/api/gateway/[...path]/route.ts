import { NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"

const GATEWAY_URL = process.env.GATEWAY_URL ?? "http://localhost:4000"

/**
 * BFF proxy: forwards client-side requests to the placr-gateway.
 *
 * This is needed because access tokens live in HTTP-only cookies and
 * cannot be read by browser JavaScript. This route handler reads the
 * cookie, attaches it as a Bearer header, and proxies the request.
 *
 *   Client fetch("/api/gateway/ats/reports")
 *     → this handler reads accessToken cookie
 *     → forwards to http://localhost:4000/ats/reports with Bearer header
 *     → returns the gateway response as-is
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  return proxy(request, await params)
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  return proxy(request, await params)
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  return proxy(request, await params)
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  return proxy(request, await params)
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  return proxy(request, await params)
}

async function proxy(
  request: NextRequest,
  params: { path: string[] }
) {
  const cookieStore = await cookies()
  const token = cookieStore.get("accessToken")?.value

  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  // Sanitize path segments — reject traversal and protocol tricks
  const pathSegments = params.path
  if (pathSegments.some(seg => seg === ".." || seg === "." || seg.includes("\\"))) {
    return NextResponse.json({ error: "Invalid path" }, { status: 400 })
  }

  const gatewayPath = "/" + pathSegments.join("/")
  const url = new URL(gatewayPath, GATEWAY_URL)

  // Only allow http/https to the configured gateway host
  if (!["http:", "https:"].includes(url.protocol) || url.host !== new URL(GATEWAY_URL).host) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  // Preserve query parameters
  request.nextUrl.searchParams.forEach((value, key) => {
    url.searchParams.set(key, value)
  })

  const headers: Record<string, string> = {
    Authorization: `Bearer ${token}`,
  }

  // Always forward Content-Type as-is (includes multipart boundary)
  const contentType = request.headers.get("content-type")
  if (contentType) {
    headers["Content-Type"] = contentType
  }

  // Forward raw bytes — never parse the body (avoids stream-consumed errors)
  let body: BodyInit | null = null
  if (request.method !== "GET" && request.method !== "HEAD") {
    body = Buffer.from(await request.arrayBuffer())
  }

  try {
    const gatewayRes = await fetch(url.toString(), {
      method: request.method,
      headers,
      body,
    })

    const responseBody = await gatewayRes.text()

    return new NextResponse(responseBody, {
      status: gatewayRes.status,
      headers: {
        "Content-Type": gatewayRes.headers.get("content-type") || "application/json",
      },
    })
  } catch (err) {
    console.error("Gateway proxy error:", err)
    return NextResponse.json(
      { error: "Gateway unavailable" },
      { status: 502 }
    )
  }
}
