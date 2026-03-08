import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { authOptions } from "@/lib/auth-options"

export default async function AfterOAuth() {
  const session = await getServerSession(authOptions)

  if (!session?.user?.email) {
    redirect("/auth/login")
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email }
  })

  if (!user) {
    redirect("/auth/complete-profile")
  }

  if (!user.isVerified) {
    redirect("/auth/verify-otp")
  }

  redirect("/dashboard")
}