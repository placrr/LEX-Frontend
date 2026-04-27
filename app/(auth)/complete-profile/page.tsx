"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { toast } from "sonner"
import { Loader2, UserRoundPen, ArrowRight, Mail } from "lucide-react"
import Link from "next/link"

export default function CompleteProfilePage() {
  const router = useRouter()

  const [rollNo, setRollNo] = useState("")
  const [year, setYear] = useState("")
  const [loading, setLoading] = useState(false)
  const [sendingOtp, setSendingOtp] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!rollNo.trim()) {
      toast.error("Roll number is required")
      return
    }

    if (!year) {
      toast.error("Please select your year")
      return
    }

    setLoading(true)
    setSendingOtp(true)

    const res = await fetch("/api/users/complete-profile", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ rollNo, year: Number(year) }),
    })

    const data = await res.json()

    if (res.ok && data.authSessionId) {
      router.push(`/verify-otp?session=${data.authSessionId}`)
    } else {
      toast.error(data.error || "Something went wrong")
      setSendingOtp(false)
    }

    setLoading(false)
  }

  // ─── Sending OTP full-screen animation ─────────────────────────────────────
  if (sendingOtp) {
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

  return (
    <div className="relative flex items-center justify-center min-h-screen bg-[#F9F7F3] overflow-hidden px-4">
      {/* Background orbs */}
      <div className="absolute top-[-10%] right-[-5%] w-[400px] h-[400px] bg-blue-200/25 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-5%] w-[350px] h-[350px] bg-pink-200/20 rounded-full blur-[100px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative w-full max-w-[420px]"
      >
        {/* Step indicator */}
        <div className="flex items-center justify-center gap-2 mb-6">
          <span className="w-8 h-1 rounded-full bg-gray-300" />
          <span className="w-8 h-1 rounded-full bg-gray-900" />
          <span className="w-8 h-1 rounded-full bg-gray-200" />
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white/80 backdrop-blur-sm border border-gray-200/60 rounded-3xl shadow-xl shadow-gray-200/40 p-8 sm:p-10"
        >
          <div className="text-center mb-8">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center mx-auto mb-5 shadow-lg shadow-blue-200">
              <UserRoundPen className="w-6 h-6 text-white" />
            </div>

            <h1 className="text-2xl font-bold text-gray-900 mb-1.5">
              Complete Your Profile
            </h1>
            <p className="text-sm text-gray-500">
              Enter your KIIT details to continue
            </p>
          </div>

          {/* Roll Number */}
          <div className="mb-5">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Roll Number
            </label>
            <input
              type="text"
              placeholder="e.g. 23052896"
              value={rollNo}
              onChange={(e) => setRollNo(e.target.value)}
              className="w-full border border-gray-200 bg-white px-4 py-3.5 rounded-2xl text-sm transition-all focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 hover:border-gray-300"
              required
            />
          </div>

          {/* Year */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Year
            </label>
            <div className="grid grid-cols-4 gap-2">
              {[
                { value: "1", label: "1st", sub: "Year" },
                { value: "2", label: "2nd", sub: "Year" },
                { value: "3", label: "3rd", sub: "Year" },
                { value: "4", label: "4th", sub: "Year" },
              ].map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setYear(opt.value)}
                  className={`relative flex flex-col items-center justify-center py-3.5 rounded-2xl border-2 transition-all cursor-pointer ${
                    year === opt.value
                      ? "border-blue-500 bg-blue-50/60 shadow-sm shadow-blue-100"
                      : "border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50/50"
                  }`}
                >
                  <span
                    className={`text-base font-bold ${
                      year === opt.value ? "text-blue-600" : "text-gray-800"
                    }`}
                  >
                    {opt.label}
                  </span>
                  <span
                    className={`text-[10px] font-medium mt-0.5 ${
                      year === opt.value ? "text-blue-400" : "text-gray-400"
                    }`}
                  >
                    {opt.sub}
                  </span>
                  {year === opt.value && (
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-blue-500" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gray-900 hover:bg-gray-800 text-white py-3.5 rounded-2xl text-sm font-medium shadow-sm transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center gap-2"
          >
            {loading ? (
              <><Loader2 className="w-4 h-4 animate-spin" /> Saving...</>
            ) : (
              <>Continue <ArrowRight className="w-4 h-4" /></>
            )}
          </button>

          <p className="text-xs text-gray-400 text-center mt-5">
            This helps us verify your KIIT student identity
          </p>
        </form>

        <div className="text-center mt-5">
          <Link href="/" className="text-sm font-semibold text-gray-900 hover:text-purple-600 transition inline-flex items-center gap-1.5 bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-full">
            &larr; Back to home
          </Link>
        </div>
      </motion.div>
    </div>
  )
}
