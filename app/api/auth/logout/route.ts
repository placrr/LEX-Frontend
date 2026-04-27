import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { prisma } from "@/lib/prisma"
import { verifyRefreshToken } from "@/lib/tokens"

const COOKIE_CLEAR: Parameters<typeof NextResponse.prototype.cookies.set>[2] = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax",
  expires: new Date(0),
  path: "/",
}

function buildClearResponse() {
  const res = NextResponse.json({ success: true })

  res.cookies.set("accessToken", "", COOKIE_CLEAR)
  res.cookies.set("refreshToken", "", COOKIE_CLEAR)

  // Clear both NextAuth session-token variants:
  // __Secure- prefix is used on HTTPS (production), plain name is used on HTTP (dev)
  res.cookies.set("__Secure-next-auth.session-token", "", {
    ...COOKIE_CLEAR,
    secure: true,
  })
  res.cookies.set("next-auth.session-token", "", {
    ...COOKIE_CLEAR,
    secure: false,
  })

  return res
}

export async function POST() {
  const cookieStore = await cookies()
  const refreshToken = cookieStore.get("refreshToken")?.value

  if (!refreshToken) {
    return buildClearResponse()
  }

  try {
    const payload = verifyRefreshToken(refreshToken)

    // Direct O(1) delete — tokenId in the JWT matches the DB record id
    await prisma.refreshToken.deleteMany({
      where: { id: payload.tokenId }
    })
  } catch {
    // Ignore — still clear cookies below
  }

  return buildClearResponse()
}
