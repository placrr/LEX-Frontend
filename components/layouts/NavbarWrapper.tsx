import { cookies, headers } from "next/headers"
import Navbar from "../navbar"
import TokenRefresher from "./TokenRefresher"
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

  let token = cookieStore.get("accessToken")?.value
  const refreshToken = cookieStore.get("refreshToken")?.value

  // If access token missing but refresh token exists, decode refresh token
  // to get userId directly (skip the full refresh — can't set cookies in Server Components)
  if (!token && refreshToken) {
    try {
      const { verifyRefreshToken } = await import("@/lib/tokens")
      const payload = verifyRefreshToken(refreshToken)

      // Use userId from refresh token to fetch user directly
      const user = await prisma.user.findUnique({
        where: { id: payload.userId },
        select: { name: true, email: true, plan: true }
      })

      if (user) {
        // Show the user in navbar + render a client component that triggers refresh
        return (
          <>
            <TokenRefresher />
            <Navbar user={user} />
          </>
        )
      }
    } catch {
      // Invalid refresh token
    }

    return (
      <>
        <TokenRefresher />
        <Navbar user={null} />
      </>
    )
  }

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