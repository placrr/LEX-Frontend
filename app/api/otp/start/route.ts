import { NextResponse } from "next/server"
import { randomInt } from "node:crypto"
import { redis } from "@/lib/redis"
import { sendOTPEmail } from "@/lib/email"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth-options"

export async function POST(req: Request) {
  try {
    const { authSessionId } = await req.json()

    const session = await getServerSession(authOptions)

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const email = session.user.email
    const name = session.user.name

    const otp = randomInt(100000, 999999).toString()

    await redis.set(`otp:${authSessionId}`, otp, { ex: 300 })

    await redis.set(
      `profile:${authSessionId}`,
      JSON.stringify({
        email,
        name
      }),
      { ex: 1800 }
    )

    sendOTPEmail(email, otp).catch(() => {})

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json(
      { error: "Failed to start OTP" },
      { status: 500 }
    )
  }
}