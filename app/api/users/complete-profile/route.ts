import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth-options"
import { redis } from "@/lib/redis"
import { sendOTPEmail } from "@/lib/email"
import { randomUUID } from "crypto"

export async function POST(req: Request) {

  try {

    const session = await getServerSession(authOptions)

    if (!session?.user?.email || !session.user.name) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const body = await req.json()

const rollNo = body.rollNo
const year = Number(body.year)

if (!rollNo || !year) {
  return NextResponse.json(
    { error: "Invalid profile data" },
    { status: 400 }
  )
}

    const email = session.user.email
    const name = session.user.name

    // 🔹 Generate OTP
    const otp =
      Math.floor(100000 + Math.random() * 900000).toString()

    console.log("OTP:", otp)

    // 🔹 Create temporary auth session
    const authSessionId = randomUUID()

    // 🔹 Store OTP (5 min expiry)
    await redis.set(`otp:${authSessionId}`, otp, { ex: 300 })

    // 🔹 Store profile data
    await redis.set(
      `profile:${authSessionId}`,
      JSON.stringify({
        email,
        name,
        rollNo,
        year
      }),
      { ex: 1800 }
    )

    // 🔹 Send OTP email async
    sendOTPEmail(email, otp).catch(console.error)

    return NextResponse.json({
      success: true,
      authSessionId
    })

  } catch (error) {

    console.error("Complete profile error:", error)

    return NextResponse.json(
      { error: "Failed to start verification" },
      { status: 500 }
    )
  }
}