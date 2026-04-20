import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth-options"
import { prisma } from "@/lib/prisma"
import { redis } from "@/lib/redis"
import { sendOTPEmail } from "@/lib/email"
import { randomUUID, randomInt } from "node:crypto"

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

const rollNo = String(body.rollNo ?? "").trim()
const year = Number(body.year)

if (!rollNo || rollNo.length > 20) {
  return NextResponse.json(
    { error: "Invalid roll number" },
    { status: 400 }
  )
}

if (!Number.isInteger(year) || year < 1 || year > 4) {
  return NextResponse.json(
    { error: "Invalid year" },
    { status: 400 }
  )
}

    // Check if roll number is already registered
    const existing = await prisma.user.findUnique({
      where: { rollNo: String(rollNo) }
    })

    if (existing) {
      return NextResponse.json(
        { error: "This roll number is already registered with another account." },
        { status: 409 }
      )
    }

    const email = session.user.email
    const name = session.user.name

    // 🔹 Generate OTP
    const otp =
      randomInt(100000, 999999).toString()

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

    // Send OTP email in background — don't block the response
    sendOTPEmail(email, otp).catch(() => {})

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