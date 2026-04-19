import { cookies } from "next/headers"

export async function setAuthCookies(
  accessToken: string,
  refreshToken: string
) {
  const cookieStore = await cookies()

  const isProduction = process.env.NODE_ENV === "production"

  cookieStore.set("accessToken", accessToken, {
    httpOnly: true,
    secure: isProduction,
    sameSite: "strict",
    path: "/",
    maxAge: 60 * 15, // 15 minutes
  })

  cookieStore.set("refreshToken", refreshToken, {
    httpOnly: true,
    secure: isProduction,
    sameSite: "strict",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  })
}

export async function clearAuthCookies() {
  const cookieStore = await cookies()

  cookieStore.delete("accessToken")
  cookieStore.delete("refreshToken")
  // Both NextAuth session-token variants: __Secure- prefix on HTTPS, plain name on HTTP
  cookieStore.delete("__Secure-next-auth.session-token")
  cookieStore.delete("next-auth.session-token")
}