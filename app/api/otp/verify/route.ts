import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth-options"
import { prisma } from "@/lib/prisma"
import { redis } from "@/lib/redis"
import { rateLimit } from "@/lib/rate-limit"
import bcrypt from "bcrypt"
import { randomUUID } from "crypto"

import {
  generateAccessToken,
  generateRefreshToken
} from "@/lib/tokens"

import { setAuthCookies } from "@/lib/cookies"

type Profile = {
  email: string
  name: string
  rollNo?: string
  year?: number
}

export async function POST(req: Request) {

  try {

    // 🔹 Rate limit
    const ip =
      req.headers.get("x-forwarded-for") ||
      req.headers.get("x-real-ip") ||
      "unknown"

    const allowed = await rateLimit(ip)

    if (!allowed) {
      return NextResponse.json(
        { error: "Too many requests. Slow down." },
        { status: 429 }
      )
    }

    // 🔹 Check OAuth session
    const session = await getServerSession(authOptions)

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const { otp, authSessionId } = await req.json()

    if (!otp || !authSessionId) {
      return NextResponse.json(
        { error: "Missing OTP or session" },
        { status: 400 }
      )
    }

    // 🔒 Permanent block check (3rd lockout = session killed)
    const blocked = await redis.get(`otp-blocked:${authSessionId}`)

    if (blocked) {
      return NextResponse.json(
        { error: "This session has been permanently blocked due to too many failed attempts. Please login again.", code: "OTP_BLOCKED" },
        { status: 403 }
      )
    }

    // 🔒 Temporary lock check
    const locked = await redis.get(`otp-lock:${authSessionId}`)

    if (locked) {
      const ttl = await redis.ttl(`otp-lock:${authSessionId}`)
      return NextResponse.json(
        { error: "Too many failed attempts.", code: "OTP_LOCKED", retryAfter: ttl > 0 ? ttl : 300 },
        { status: 429 }
      )
    }

    // 🔹 Fetch OTP
    const storedOtp = await redis.get(`otp:${authSessionId}`)

    if (!storedOtp) {
      return NextResponse.json(
        { error: "OTP expired or not found" },
        { status: 400 }
      )
    }

    // 🔹 Validate OTP
    // Progressive lockout: Round 1 = 5 tries → 5 min, Round 2 = 3 tries → 15 min, Round 3 = 1 try → blocked
    if (String(storedOtp) !== String(otp)) {

      const attempts = (await redis.incr(`otp-attempts:${authSessionId}`)) || 1
      const lockCount = Number(await redis.get(`otp-locks:${authSessionId}`)) || 0

      // Determine max attempts for current round
      const maxAttempts = lockCount === 0 ? 5 : lockCount === 1 ? 3 : 1

      if (attempts >= maxAttempts) {
        const nextLockCount = lockCount + 1

        if (nextLockCount >= 3) {
          // 3rd lockout — permanently block, kill the OTP
          await redis.set(`otp-blocked:${authSessionId}`, "1", { ex: 3600 })
          await redis.del(`otp:${authSessionId}`)
          await redis.del(`otp-attempts:${authSessionId}`)

          return NextResponse.json(
            { error: "Session permanently blocked. Please login again.", code: "OTP_BLOCKED" },
            { status: 403 }
          )
        }

        // Lock: round 1 = 5 min, round 2 = 15 min
        const lockDuration = nextLockCount === 1 ? 300 : 900

        await redis.set(`otp-lock:${authSessionId}`, "1", { ex: lockDuration })
        await redis.set(`otp-locks:${authSessionId}`, String(nextLockCount), { ex: 7200 })
        await redis.del(`otp-attempts:${authSessionId}`)

        // Extend profile TTL so it survives the lockout period
        await redis.expire(`profile:${authSessionId}`, lockDuration + 600)

        const nextMax = nextLockCount === 1 ? 3 : 1

        return NextResponse.json(
          { error: "Too many failed attempts.", code: "OTP_LOCKED", retryAfter: lockDuration, lockRound: nextLockCount, nextAttempts: nextMax },
          { status: 429 }
        )
      }

      const remaining = maxAttempts - attempts

      return NextResponse.json(
        { error: `Invalid OTP. ${remaining} attempt${remaining === 1 ? "" : "s"} remaining.`, code: "OTP_INVALID", attemptsLeft: remaining },
        { status: 400 }
      )
    }

    // 🔹 Clean OTP keys
    await redis.del(`otp:${authSessionId}`)
    await redis.del(`otp-attempts:${authSessionId}`)

    const email = session.user.email

    // 🔹 Check if user already exists
    let user = await prisma.user.findUnique({
      where: { email }
    })

    // 🔹 If user doesn't exist, try creating
    if (!user) {

      const profileRaw =
        await redis.get(`profile:${authSessionId}`)

      if (!profileRaw) {
        return NextResponse.json(
          { error: "Session expired. Please start again." },
          { status: 400 }
        )
      }

      let profile: Profile

      if (typeof profileRaw === "string") {
        profile = JSON.parse(profileRaw)
      } else {
        profile = profileRaw as Profile
      }

      // 🔹 Ensure required fields exist
      if (!profile.rollNo || !profile.year) {

        return NextResponse.json(
          { error: "Profile incomplete. Please restart signup." },
          { status: 400 }
        )
      }

      // Check if rollNo is already taken by another account
      const rollNoTaken = await prisma.user.findUnique({
        where: { rollNo: profile.rollNo }
      })

      if (rollNoTaken) {
        return NextResponse.json(
          { error: "This roll number is already registered with a different account." },
          { status: 409 }
        )
      }

      user = await prisma.user.create({
        data: {
          email: profile.email,
          name: profile.name,
          rollNo: profile.rollNo,
          year: profile.year,
          isVerified: true
        }
      })

      await redis.del(`profile:${authSessionId}`)
    }

    // 🔹 Generate tokens
    const accessToken = generateAccessToken(user.id, user.email, user.plan, user.role)

    const tokenId = randomUUID()

    const refreshToken =
      generateRefreshToken(user.id, tokenId)

    const hashedRefreshToken =
      await bcrypt.hash(refreshToken, 8)

    await prisma.refreshToken.create({
      data: {
        id: tokenId,
        tokenHash: hashedRefreshToken,
        userId: user.id,
        expiresAt: new Date(
          Date.now() + 7 * 24 * 60 * 60 * 1000
        )
      }
    })

    // 🔹 Set cookies
    await setAuthCookies(accessToken, refreshToken)

    return NextResponse.json({
      success: true
    })

  } catch (error) {

    console.error("OTP verify error:", error)

    return NextResponse.json(
      { error: "Verification failed" },
      { status: 500 }
    )
  }
}