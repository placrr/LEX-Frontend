"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Mail } from "lucide-react"

export default function SendingOTP({ authSessionId }: { authSessionId: string }) {
  const router = useRouter()

  useEffect(() => {
    fetch("/api/otp/start", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ authSessionId }),
    })
      .then(() => {
        router.push(`/verify-otp?session=${authSessionId}`)
      })
      .catch(() => {
        router.push("/login")
      })
  }, [authSessionId, router])

  return (
    <div className="relative flex items-center justify-center min-h-screen bg-[#F9F7F3] overflow-hidden px-4">
      <div className="absolute top-[-10%] left-[20%] w-[400px] h-[400px] bg-orange-200/25 rounded-full blur-[120px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/80 backdrop-blur-sm border border-gray-200/60 rounded-3xl shadow-xl shadow-gray-200/40 p-10 w-full max-w-[400px] text-center"
      >
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center mx-auto mb-5 shadow-lg shadow-orange-200">
          <Mail className="w-6 h-6 text-white" />
        </div>

        <h2 className="text-xl font-bold text-gray-900 mb-2">Sending OTP</h2>
        <p className="text-sm text-gray-500 mb-6">
          Sending verification code to your KIIT email...
        </p>

        <div className="flex justify-center">
          <div className="w-10 h-10 rounded-full border-2 border-gray-200 border-t-orange-500 animate-spin" />
        </div>
      </motion.div>
    </div>
  )
}
