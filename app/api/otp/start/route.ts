import { NextResponse } from "next/server"
import { redis } from "@/lib/redis"
import { sendOTPEmail } from "@/lib/email"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth-options"

export async function POST(req: Request) {

  const { authSessionId } = await req.json()

  const session = await getServerSession(authOptions)

  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const email = session.user.email
  const name = session.user.name

  const otp = Math.floor(100000 + Math.random() * 900000).toString()

  console.log("OTP:", otp)

  await redis.set(`otp:${authSessionId}`, otp, { ex: 300 })

  await redis.set(
    `profile:${authSessionId}`,
    JSON.stringify({
      email,
      name
    }),
    { ex: 1800 }
  )

  sendOTPEmail(email, otp).catch(console.error)

  return NextResponse.json({ success: true })
}