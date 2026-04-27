import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import bcrypt from "bcrypt"
import { randomUUID } from "crypto"
import { prisma } from "@/lib/prisma"
import {
  verifyRefreshToken,
  generateAccessToken,
  generateRefreshToken
} from "@/lib/tokens"
import { setAuthCookies } from "@/lib/cookies"

export async function POST() {
  const cookieStore = await cookies()
  const refreshToken = cookieStore.get("refreshToken")?.value

  if (!refreshToken) {
    return NextResponse.json(
      { error: "No refresh token" },
      { status: 401 }
    )
  }

  try {
    const payload = verifyRefreshToken(refreshToken)

    // Direct O(1) lookup — tokenId in the JWT matches the DB record id
    const existingToken = await prisma.refreshToken.findUnique({
      where: { id: payload.tokenId }
    })

    if (!existingToken || existingToken.expiresAt < new Date()) {
      return NextResponse.json(
        { error: "Invalid refresh token" },
        { status: 401 }
      )
    }

    const user = await prisma.user.findUnique({ where: { id: payload.userId } })

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 401 }
      )
    }

    const newTokenId = randomUUID()
    const newAccessToken = generateAccessToken(payload.userId, user.email, user.plan, user.role)
    const newRefreshToken = generateRefreshToken(payload.userId, newTokenId)
    const hashed = await bcrypt.hash(newRefreshToken, 8)

    // Rotate: create new token first, then delete old (avoids orphan on failure)
    await prisma.refreshToken.create({
      data: {
        id: newTokenId,
        tokenHash: hashed,
        userId: payload.userId,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
      }
    })

    await prisma.refreshToken.delete({ where: { id: payload.tokenId } })

    await setAuthCookies(newAccessToken, newRefreshToken)

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json(
      { error: "Refresh failed" },
      { status: 401 }
    )
  }
}
