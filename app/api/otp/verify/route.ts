// import { NextResponse } from "next/server"
// import { getServerSession } from "next-auth"
// import { authOptions } from "@/lib/auth-options"
// import { prisma } from "@/lib/prisma"
// import { redis } from "@/lib/redis"
// import { rateLimit } from "@/lib/rate-limit"
// import bcrypt from "bcrypt"
// import { randomUUID } from "crypto"

// import {
//   generateAccessToken,
//   generateRefreshToken
// } from "@/lib/tokens"

// import { setAuthCookies } from "@/lib/cookies"

// type Profile = {
//   email: string
//   name: string
//   rollNo: string
//   year: number
// }

// export async function POST(req: Request) {

//   try {

//     // 🔹 Campus-safe IP rate limiting
//     const ip =
//       req.headers.get("x-forwarded-for") ||
//       req.headers.get("x-real-ip") ||
//       "unknown"

//     const allowed = await rateLimit(ip)

//     if (!allowed) {
//       return NextResponse.json(
//         { error: "Too many requests. Slow down." },
//         { status: 429 }
//       )
//     }

//     // 🔹 OAuth session check
//     const session = await getServerSession(authOptions)

//     if (!session?.user?.email) {
//       return NextResponse.json(
//         { error: "Unauthorized" },
//         { status: 401 }
//       )
//     }

//     const { otp, authSessionId } = await req.json()

//     // 🔎 DEBUG LOGS
//     console.log("Session from URL:", authSessionId)
//     console.log("Redis profile key:", `profile:${authSessionId}`)

//     if (!otp || !authSessionId) {
//       return NextResponse.json(
//         { error: "Missing OTP or session" },
//         { status: 400 }
//       )
//     }

//     // 🔒 Check lock
//     const locked = await redis.get(`otp-lock:${authSessionId}`)

//     if (locked) {
//       return NextResponse.json(
//         { error: "Too many attempts. Try again later." },
//         { status: 429 }
//       )
//     }

//     // 🔹 Fetch OTP
//     const storedOtp = await redis.get(`otp:${authSessionId}`)

//     if (!storedOtp) {
//       return NextResponse.json(
//         { error: "OTP expired or not found" },
//         { status: 400 }
//       )
//     }

//     console.log("Stored OTP:", storedOtp)
//     console.log("User OTP:", otp)

//     // 🔹 Validate OTP
//     if (String(storedOtp) !== String(otp)) {

//       const attempts =
//         (await redis.incr(`otp-attempts:${authSessionId}`)) || 1

//       if (attempts >= 5) {
//         await redis.set(
//           `otp-lock:${authSessionId}`,
//           "1",
//           { ex: 900 }
//         )
//       }

//       return NextResponse.json(
//         { error: "Invalid OTP" },
//         { status: 400 }
//       )
//     }

//     // 🔹 Cleanup OTP keys
//     await redis.del(`otp:${authSessionId}`)
//     await redis.del(`otp-attempts:${authSessionId}`)

//     const email = session.user.email

//     // 🔹 Check existing user
//     let user = await prisma.user.findUnique({
//       where: { email }
//     })

//     // 🔹 Create user if new
//     if (!user) {

//       const profileRaw =
//         await redis.get(`profile:${authSessionId}`)

//       // 🔎 DEBUG LOG
//       console.log("Redis profile result:", profileRaw)

// if (!profileRaw) {

//   // If profile missing but user exists → login anyway
//   const existingUser = await prisma.user.findUnique({
//     where: { email }
//   })

//   if (existingUser) {
//     const accessToken = generateAccessToken(existingUser.id)
//     const tokenId = randomUUID()
//     const refreshToken = generateRefreshToken(existingUser.id, tokenId)

//     await prisma.refreshToken.create({
//       data: {
//         id: tokenId,
//         tokenHash: await bcrypt.hash(refreshToken, 8),
//         userId: existingUser.id,
//         expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
//       }
//     })

//     setAuthCookies(accessToken, refreshToken)

//     return NextResponse.json({ success: true })
//   }

//   return NextResponse.json(
//     { error: "Session expired. Please start again." },
//     { status: 400 }
//   )
// }

// let profile

// if (typeof profileRaw === "string") {
//   profile = JSON.parse(profileRaw)
// } else {
//   profile = profileRaw
// }

//       user = await prisma.user.create({
//         data: {
//           email: profile.email,
//           name: profile.name,
//           rollNo: profile.rollNo,
//           year: profile.year,
//           isVerified: true
//         }
//       })

//       await redis.del(`profile:${authSessionId}`)
//     }

//     // 🔹 Generate tokens
//     const accessToken = generateAccessToken(user.id)

//     const tokenId = randomUUID()

//     const refreshToken =
//       generateRefreshToken(user.id, tokenId)

//     const hashedRefreshToken =
//       await bcrypt.hash(refreshToken, 8)

//     await prisma.refreshToken.create({
//       data: {
//         id: tokenId,
//         tokenHash: hashedRefreshToken,
//         userId: user.id,
//         expiresAt: new Date(
//           Date.now() + 7 * 24 * 60 * 60 * 1000
//         )
//       }
//     })

//     // 🔹 Set cookies
//     setAuthCookies(accessToken, refreshToken)

  

//     return NextResponse.json({
//       success: true
//     })

//   } catch (error) {

//     console.error("OTP verify error:", error)

//     return NextResponse.json(
//       { error: "Verification failed" },
//       { status: 500 }
//     )
//   }
// }
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

    // 🔒 Lock check
    const locked = await redis.get(`otp-lock:${authSessionId}`)

    if (locked) {
      return NextResponse.json(
        { error: "Too many attempts. Try again later." },
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
    if (String(storedOtp) !== String(otp)) {

      const attempts =
        (await redis.incr(`otp-attempts:${authSessionId}`)) || 1

      if (attempts >= 5) {
        await redis.set(
          `otp-lock:${authSessionId}`,
          "1",
          { ex: 900 }
        )
      }

      return NextResponse.json(
        { error: "Invalid OTP" },
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
    const accessToken = generateAccessToken(user.id)

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
    setAuthCookies(accessToken, refreshToken)

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