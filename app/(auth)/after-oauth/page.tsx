import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { authOptions } from "@/lib/auth-options"
import { redis } from "@/lib/redis"
import { sendOTPEmail } from "@/lib/email"
import { randomUUID } from "crypto"

export default async function AfterOAuth() {

  const session = await getServerSession(authOptions)

  if (!session?.user?.email || !session.user.name) {
    redirect("/login")
  }

  const email = session.user.email
  const name = session.user.name

  const existingUser = await prisma.user.findUnique({
    where: { email }
  })

  // EXISTING USER
  if (existingUser) {

    const otp = Math.floor(100000 + Math.random() * 900000).toString()

    console.log("OTP:", otp)

    const authSessionId = randomUUID()

    // store OTP
    await redis.set(
      `otp:${authSessionId}`,
      otp,
      { ex: 300 }
    )

    // store profile for login
    await redis.set(
      `profile:${authSessionId}`,
      JSON.stringify({
        email,
        name
      }),
      { ex: 600 }
    )

    sendOTPEmail(email, otp).catch(console.error)

    redirect(`/verify-otp?session=${authSessionId}`)
  }

  // NEW USER
  redirect("/complete-profile")
}