import { NextResponse } from "next/server"
import { randomInt } from "node:crypto"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth-options"
import { redis } from "@/lib/redis"
import { sendOTPEmail } from "@/lib/email"

export async function POST(req: Request) {

  const { authSessionId } = await req.json()

  if (!authSessionId) {
    return NextResponse.json(
      { error: "Session missing" },
      { status: 400 }
    )
  }

  // Try to get email from Redis profile first
  let email: string | null = null

  const profileRaw = await redis.get(`profile:${authSessionId}`)

  if (profileRaw) {
    const profile = typeof profileRaw === "string" ? JSON.parse(profileRaw) : profileRaw
    email = profile.email

    // Extend profile TTL so it survives lockout periods
    await redis.expire(`profile:${authSessionId}`, 3600)
  }

  // Fallback: get email from NextAuth session (for existing users)
  if (!email) {
    const session = await getServerSession(authOptions)
    email = session?.user?.email ?? null
  }

  if (!email) {
    return NextResponse.json(
      { error: "Session expired. Please login again." },
      { status: 400 }
    )
  }

  const otp = randomInt(100000, 999999).toString()

  await redis.set(`otp:${authSessionId}`, otp, { ex: 300 })

  sendOTPEmail(email, otp).catch(() => {})

  return NextResponse.json({ success: true })
}