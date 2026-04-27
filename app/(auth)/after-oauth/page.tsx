import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { authOptions } from "@/lib/auth-options"
import { redis } from "@/lib/redis"
import { randomUUID } from "node:crypto"
import SendingOTP from "./SendingOTP"

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

  // EXISTING USER — render client component that sends OTP with animation
  if (existingUser) {

    const authSessionId = randomUUID()

    // store profile so /api/otp/start can find the email
    await redis.set(
      `profile:${authSessionId}`,
      JSON.stringify({ email, name }),
      { ex: 600 }
    )

    return <SendingOTP authSessionId={authSessionId} />
  }

  // NEW USER
  redirect("/complete-profile")
}