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

  const refreshToken =
    cookieStore.get("refreshToken")?.value

  if (!refreshToken) {
    return NextResponse.json(
      { error: "No refresh token" },
      { status: 401 }
    )
  }

  try {

    const payload = verifyRefreshToken(refreshToken)

    const tokens = await prisma.refreshToken.findMany({
      where: { userId: payload.userId }
    })

    let validToken = null

    for (const t of tokens) {
      const match = await bcrypt.compare(
        refreshToken,
        t.tokenHash
      )

      if (match) {
        validToken = t
        break
      }
    }

    if (!validToken) {
      return NextResponse.json(
        { error: "Invalid refresh token" },
        { status: 401 }
      )
    }
const tokenId = randomUUID()

    // 🔁 Rotate tokens
    const newAccessToken =
      generateAccessToken(payload.userId)

    const newRefreshToken =
      generateRefreshToken(payload.userId,tokenId)

    const hashed =
      await bcrypt.hash(newRefreshToken, 8)

    await prisma.refreshToken.create({
      data: {
        tokenHash: hashed,
        userId: payload.userId,
        expiresAt: new Date(
          Date.now() + 7 * 24 * 60 * 60 * 1000
        )
      }
    })

    setAuthCookies(newAccessToken, newRefreshToken)

    return NextResponse.json({
      success: true
    })

  } catch {

    return NextResponse.json(
      { error: "Refresh failed" },
      { status: 401 }
    )
  }
}