import { NextResponse } from "next/server"
import { randomInt } from "node:crypto"
import { redis } from "@/lib/redis"

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { email } = body

    if (!email || typeof email !== "string") {
      return NextResponse.json(
        { error: "Email required" },
        { status: 400 }
      )
    }

    // Rate limit: max 5 OTP sends per email per 15 minutes
    const limitKey = `otp-send-limit:${email}`
    const sendCount = await redis.incr(limitKey)
    if (sendCount === 1) await redis.expire(limitKey, 900)

    if (sendCount > 5) {
      return NextResponse.json(
        { error: "Too many OTP requests. Try again later." },
        { status: 429 }
      )
    }

    const otp = randomInt(100000, 999999).toString()

    await redis.set(
      `otp:${email}`,
      otp,
      { ex: 300 }
    )

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json(
      { error: "Failed to send OTP" },
      { status: 500 }
    )
  }
}