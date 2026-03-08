import { NextResponse } from "next/server"
import { redis } from "@/lib/redis"

export async function POST(req: Request) {

  // Read request body
  const body = await req.json()
  const { email } = body

  if (!email) {
    return NextResponse.json(
      { error: "Email required" },
      { status: 400 }
    )
  }

  // Generate OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString()

  console.log("OTP:", otp)

  // Store OTP in Redis for 5 minutes
  await redis.set(
    `otp:${email}`,
    otp,
    { ex: 300 }
  )

  return NextResponse.json({
    success: true
  })
}