import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { verifyRefreshToken } from "@/lib/tokens"
import bcrypt from "bcrypt"

export async function POST(req: Request) {
  const refreshToken =
    req.headers.get("cookie")
      ?.split("; ")
      .find(c => c.startsWith("refreshToken="))
      ?.split("=")[1]

  if (!refreshToken) {
    return NextResponse.json({ success: true })
  }

  try {
    const payload = verifyRefreshToken(refreshToken)

    const tokens = await prisma.refreshToken.findMany({
      where: { userId: payload.userId }
    })

    for (const tokenRecord of tokens) {
      const match = await bcrypt.compare(
        refreshToken,
        tokenRecord.tokenHash
      )

      if (match) {
        await prisma.refreshToken.delete({
          where: { id: tokenRecord.id }
        })
        break
      }
    }
  } catch {
    // Ignore errors
  }

  const response = NextResponse.json({ success: true })

  response.cookies.set("accessToken", "", {
    httpOnly: true,
    expires: new Date(0),
    path: "/"
  })

  response.cookies.set("refreshToken", "", {
    httpOnly: true,
    expires: new Date(0),
    path: "/"
  })

  return response
}