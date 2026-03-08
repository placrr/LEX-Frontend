import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { authOptions } from "@/lib/auth-options"
import { randomUUID } from "crypto"

export default async function AfterOAuth() {

  const session = await getServerSession(authOptions)

  if (!session?.user?.email || !session.user.name) {
    redirect("/login")
  }

  const email = session.user.email

  const existingUser = await prisma.user.findUnique({
    where: { email }
  })

  // EXISTING USER → go directly to OTP page
  if (existingUser) {

    const authSessionId = randomUUID()

    // No OTP generation here anymore
    redirect(`/verify-otp?session=${authSessionId}`)
  }

  // NEW USER
  redirect("/complete-profile")
}