import { cookies, headers } from "next/headers"
import Navbar from "../navbar"
import { verifyAccessToken } from "@/lib/tokens"
import { prisma } from "@/lib/prisma"
import { redis } from "@/lib/redis"

// Routes where the navbar should not appear
const NAVBAR_HIDDEN_ROUTES = [
  "/login",
  "/after-oauth",
  "/complete-profile",
  "/verify-otp",
]

type NavbarUser = {
  name: string | null
  email: string
  plan: string | null
}

export default async function NavbarWrapper() {

  const headersList = await headers()
  const pathname = headersList.get("x-pathname") ?? ""

  if (NAVBAR_HIDDEN_ROUTES.some(route => pathname.startsWith(route))) {
    return null
  }

  const cookieStore = await cookies()

  const token = cookieStore.get("accessToken")?.value

  if (!token) {
    return <Navbar user={null} />
  }

  try {

    const payload = verifyAccessToken(token)

    if (!payload?.userId) {
      return <Navbar user={null} />
    }

    /*
    🔹 Try Redis cache
    */

    const cachedUser = await redis.get(`user:${payload.userId}`)

    if (cachedUser) {

      try {

        const user = typeof cachedUser === "string"
          ? JSON.parse(cachedUser)
          : cachedUser

        return <Navbar user={user as NavbarUser} />

      } catch {

        // corrupted cache → delete it
        await redis.del(`user:${payload.userId}`)
      }
    }

    /*
    🔹 Fallback to DB
    */

    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      select: {
        name: true,
        email: true,
        plan: true
      }
    })

    if (!user) {
      return <Navbar user={null} />
    }

    /*
    🔹 Save clean cache
    */

    await redis.set(
      `user:${payload.userId}`,
      JSON.stringify(user),
      { ex: 3600 }
    )

    return <Navbar user={user} />

  } catch (error) {

    console.error("Navbar auth error:", error)

    return <Navbar user={null} />
  }
}