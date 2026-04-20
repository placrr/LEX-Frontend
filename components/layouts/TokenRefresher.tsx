"use client"

import { useEffect } from "react"

export default function TokenRefresher() {
  useEffect(() => {
    // Silently call refresh endpoint to get a new accessToken cookie
    fetch("/api/auth/refresh", { method: "POST" }).catch(() => {})
  }, [])

  return null
}
