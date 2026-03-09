import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import {
  verifyAccessToken,
  verifyRefreshToken,
  generateAccessToken,
  generateRefreshToken
} from "@/lib/tokens"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcrypt"
import { randomUUID } from "crypto"

export async function proxy(req: NextRequest) {

  const accessToken = req.cookies.get("accessToken")?.value
  const refreshToken = req.cookies.get("refreshToken")?.value

  const pathname = req.nextUrl.pathname

  const protectedPaths = ["/dashboard"]
  const authPages = ["/login", "/verify-otp", "/complete-profile"]

  const isProtected = protectedPaths.some(path =>
    pathname.startsWith(path)
  )

  const isAuthPage = authPages.some(path =>
    pathname.startsWith(path)
  )

 

  if (isAuthPage && accessToken) {
    try {
      verifyAccessToken(accessToken)
      return NextResponse.redirect(new URL("/", req.url))
    } catch {}
  }



  if (!isProtected) {
    return NextResponse.next()
  }



  if (!accessToken && !refreshToken) {
    return NextResponse.redirect(new URL("/login", req.url))
  }



  if (accessToken) {
    try {
      verifyAccessToken(accessToken)
      return NextResponse.next()
    } catch {
      // expired → continue
    }
  }



  if (refreshToken) {
    try {

      const payload = verifyRefreshToken(refreshToken)

      const tokenRecord = await prisma.refreshToken.findUnique({
        where: { id: payload.tokenId }
      })

      if (!tokenRecord || tokenRecord.expiresAt < new Date()) {
        return NextResponse.redirect(new URL("/login", req.url))
      }

      const valid = await bcrypt.compare(
        refreshToken,
        tokenRecord.tokenHash
      )

      if (!valid) {
        return NextResponse.redirect(new URL("/login", req.url))
      }

      /*
      🔁 Refresh token rotation
      */

      await prisma.refreshToken.delete({
        where: { id: payload.tokenId }
      })

      const newTokenId = randomUUID()

      const newAccessToken =
        generateAccessToken(payload.userId)

      const newRefreshToken =
        generateRefreshToken(payload.userId, newTokenId)

      const hashedRefresh =
        await bcrypt.hash(newRefreshToken, 8)

      await prisma.refreshToken.create({
        data: {
          id: newTokenId,
          tokenHash: hashedRefresh,
          userId: payload.userId,
          expiresAt: new Date(
            Date.now() + 7 * 24 * 60 * 60 * 1000
          )
        }
      })

      const response = NextResponse.next()

      response.cookies.set("accessToken", newAccessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 15
      })

      response.cookies.set("refreshToken", newRefreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24 * 7
      })

      return response

    } catch {
      return NextResponse.redirect(new URL("/login", req.url))
    }
  }

  return NextResponse.redirect(new URL("/login", req.url))
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/login",
    "/verify-otp",
    "/complete-profile"
  ]
}