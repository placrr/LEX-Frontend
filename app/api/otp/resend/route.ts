import { NextResponse } from "next/server"
import { redis } from "@/lib/redis"
import { sendOTPEmail } from "@/lib/email"

type Profile = {
  email: string
  name: string
  rollNo: string
  year: number
}

export async function POST(req: Request) {

  const { authSessionId } = await req.json()

  if (!authSessionId) {
    return NextResponse.json(
      { error: "Session missing" },
      { status: 400 }
    )
  }

  const profileRaw =
    await redis.get(`profile:${authSessionId}`)

  console.log("Resend profileRaw:", profileRaw)

  if (!profileRaw) {
    return NextResponse.json(
      { error: "Session expired. Please start again." },
      { status: 400 }
    )
  }

let profile

if (typeof profileRaw === "string") {
  profile = JSON.parse(profileRaw)
} else {
  profile = profileRaw
}

  const otp =
    Math.floor(100000 + Math.random() * 900000).toString()

  console.log("Resent OTP:", otp)

  await redis.set(`otp:${authSessionId}`, otp, { ex: 300 })

  sendOTPEmail(profile.email, otp).catch(console.error)

  return NextResponse.json({
    success: true
  })
}