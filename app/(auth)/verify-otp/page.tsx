"use client"

import { Suspense, useState, useEffect, useRef } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { motion } from "framer-motion"
import { toast } from "sonner"
import { CheckCircle2, Loader2, ShieldCheck, Mail, RotateCw } from "lucide-react"
import Link from "next/link"

export default function VerifyOTPPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen bg-[#F9F7F3]">
        <div className="w-8 h-8 rounded-full border-2 border-gray-200 border-t-purple-500 animate-spin" />
      </div>
    }>
      <VerifyOTPContent />
    </Suspense>
  )
}

function VerifyOTPContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const authSessionId = searchParams.get("session")

  // ─── Persisted state helpers ─────────────────────────────────────────────
  const storageKey = `otp-state:${authSessionId}`

  function loadPersistedState() {
    try {
      const raw = localStorage.getItem(storageKey)
      if (!raw) return null
      return JSON.parse(raw) as { lockUntil?: number; blocked?: boolean; visited?: boolean; otpExpiresAt?: number }
    } catch { return null }
  }

  function persistState(patch: { lockUntil?: number; blocked?: boolean; visited?: boolean; otpExpiresAt?: number }) {
    try {
      const prev = loadPersistedState() || {}
      localStorage.setItem(storageKey, JSON.stringify({ ...prev, ...patch }))
    } catch {}
  }

  // ─── State (server-safe defaults — hydrated from localStorage in useEffect) ─
  const [otp, setOtp] = useState(["", "", "", "", "", ""])
  const [loading, setLoading] = useState(true)
  const [verified, setVerified] = useState(false)
  const [cooldown, setCooldown] = useState(0)
  const [verifying, setVerifying] = useState(false)
  const [lockout, setLockout] = useState(0)
  const [blocked, setBlocked] = useState(false)
  const [hydrated, setHydrated] = useState(false)
  const [otpExpiry, setOtpExpiry] = useState(0) // seconds until OTP expires

  const inputs = useRef<(HTMLInputElement | null)[]>([])

  // ─── Hydrate from localStorage on mount (client only, after first render) ──
  useEffect(() => {
    const persisted = loadPersistedState()

    if (persisted?.blocked) {
      setBlocked(true)
      setLoading(false)
      setHydrated(true)
      return
    }

    if (persisted?.lockUntil) {
      const remaining = Math.floor((persisted.lockUntil - Date.now()) / 1000)
      if (remaining > 0) setLockout(remaining)
    }

    // Restore OTP expiry timer
    if (persisted?.otpExpiresAt) {
      const remaining = Math.floor((persisted.otpExpiresAt - Date.now()) / 1000)
      setOtpExpiry(remaining > 0 ? remaining : 0)
    }

    if (!persisted?.visited) {
      // First visit — OTP was already sent from complete-profile page
      // Mark as visited and start expiry timer
      const otpExpiresAt = Date.now() + 300 * 1000
      persistState({ visited: true, otpExpiresAt })
      setCooldown(30)
      setOtpExpiry(300)
    } else {
      // Returning visit — restore cooldown state
      setCooldown(0)
    }

    setLoading(false)
    setHydrated(true)
  }, [])

  // Focus first input when ready
  useEffect(() => {
    if (hydrated && !loading && lockout <= 0 && !blocked) {
      inputs.current[0]?.focus()
    }
  }, [hydrated, loading, lockout, blocked])

  // Resend cooldown timer
  useEffect(() => {
    if (cooldown <= 0) return
    const timer = setInterval(() => setCooldown((p) => p - 1), 1000)
    return () => clearInterval(timer)
  }, [cooldown])

  // OTP expiry countdown
  useEffect(() => {
    if (otpExpiry <= 0) return
    const timer = setInterval(() => {
      setOtpExpiry((p) => {
        if (p <= 1) {
          toast.error("OTP expired. Please resend.")
          return 0
        }
        return p - 1
      })
    }, 1000)
    return () => clearInterval(timer)
  }, [otpExpiry])

  // Lockout countdown timer
  useEffect(() => {
    if (lockout <= 0) return
    const timer = setInterval(() => setLockout((p) => (p <= 1 ? 0 : p - 1)), 1000)
    return () => clearInterval(timer)
  }, [lockout])

  // ─── No session param — broken link ──────────────────────────────────────
  if (!authSessionId) {
    return (
      <div className="relative flex items-center justify-center min-h-screen bg-[#F9F7F3] overflow-hidden px-4">
        <div className="bg-white/80 backdrop-blur-sm border border-gray-200/60 rounded-3xl shadow-xl shadow-gray-200/40 p-10 w-full max-w-[400px] text-center">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-red-500 to-rose-500 flex items-center justify-center mx-auto mb-5 shadow-lg shadow-red-200">
            <ShieldCheck className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Invalid Session</h2>
          <p className="text-sm text-gray-500 mb-6">
            This link is missing a session token. Please start the login process again.
          </p>
          <a href="/login" className="inline-block bg-gray-900 text-white px-6 py-3 rounded-2xl text-sm font-medium hover:bg-gray-800 transition">
            Go to Login
          </a>
        </div>
      </div>
    )
  }

  // ─── Hydrating (waiting for localStorage read) ───────────────────────────
  if (!hydrated) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#F9F7F3]">
        <div className="w-8 h-8 rounded-full border-2 border-gray-200 border-t-purple-500 animate-spin" />
      </div>
    )
  }

  // ─── Loading state ──────────────────────────────────────────────────────────
  if (loading) {
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
            Check your KIIT email inbox for the code
          </p>

          <div className="flex justify-center">
            <div className="w-10 h-10 rounded-full border-2 border-gray-200 border-t-orange-500 animate-spin" />
          </div>
        </motion.div>
      </div>
    )
  }

  // ─── Verified state ─────────────────────────────────────────────────────────
  if (verified) {
    return (
      <div className="relative flex items-center justify-center min-h-screen bg-[#F9F7F3] overflow-hidden px-4">
        <div className="absolute bottom-[-10%] right-[10%] w-[400px] h-[400px] bg-green-200/25 rounded-full blur-[120px] pointer-events-none" />

        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", damping: 20, stiffness: 200 }}
          className="bg-white/80 backdrop-blur-sm border border-gray-200/60 rounded-3xl shadow-xl shadow-gray-200/40 p-10 w-full max-w-[400px] text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.15, type: "spring", damping: 12 }}
          >
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center mx-auto mb-5 shadow-lg shadow-green-200">
              <CheckCircle2 className="w-10 h-10 text-white" />
            </div>
          </motion.div>

          <h2 className="text-xl font-bold text-gray-900 mb-1.5">
            Verified Successfully
          </h2>
          <p className="text-sm text-gray-500">
            Redirecting you to Placr...
          </p>
        </motion.div>
      </div>
    )
  }

  // ─── Blocked state ──────────────────────────────────────────────────────────
  if (blocked) {
    return (
      <div className="relative flex items-center justify-center min-h-screen bg-[#F9F7F3] overflow-hidden px-4">
        <div className="absolute top-[-10%] left-[10%] w-[400px] h-[400px] bg-red-200/25 rounded-full blur-[120px] pointer-events-none" />

        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", damping: 20, stiffness: 200 }}
          className="bg-white/80 backdrop-blur-sm border border-gray-200/60 rounded-3xl shadow-xl shadow-gray-200/40 p-10 w-full max-w-[400px] text-center"
        >
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-red-500 to-rose-500 flex items-center justify-center mx-auto mb-5 shadow-lg shadow-red-200">
            <ShieldCheck className="w-10 h-10 text-white" />
          </div>

          <h2 className="text-xl font-bold text-gray-900 mb-1.5">
            Session Blocked
          </h2>
          <p className="text-sm text-gray-500 mb-6">
            Too many failed attempts. This session has been permanently locked for security.
          </p>
          <a
            href="/login"
            className="inline-block bg-gray-900 text-white px-6 py-3 rounded-2xl text-sm font-medium hover:bg-gray-800 transition"
          >
            Back to Login
          </a>
        </motion.div>
      </div>
    )
  }

  // ─── Handlers ───────────────────────────────────────────────────────────────

  function clearOTP() {
    setOtp(["", "", "", "", "", ""])
    inputs.current[0]?.focus()
  }

  function handleChange(value: string, index: number) {
    if (!/^[0-9]?$/.test(value)) return

    const newOtp = [...otp]
    newOtp[index] = value
    setOtp(newOtp)

    if (value && index < 5) {
      inputs.current[index + 1]?.focus()
    }

    if (index === 5 && value) {
      verifyOTP([...newOtp].join(""))
    }
  }

  function handleKeyDown(e: React.KeyboardEvent, index: number) {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputs.current[index - 1]?.focus()
    }
  }

  function handlePaste(e: React.ClipboardEvent<HTMLInputElement>) {
    const paste = e.clipboardData.getData("text").slice(0, 6)
    if (!/^\d+$/.test(paste)) return

    const newOtp = paste.split("")
    setOtp(newOtp)

    newOtp.forEach((digit, i) => {
      if (inputs.current[i]) inputs.current[i]!.value = digit
    })

    if (paste.length === 6) verifyOTP(paste)
  }

  async function verifyOTP(otpValue: string) {
    if (verifying || !authSessionId || lockout > 0) return
    setVerifying(true)
    toast.dismiss()

    const res = await fetch("/api/otp/verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ otp: otpValue, authSessionId }),
    })

    const data = await res.json()

    if (res.ok) {
      setVerified(true)
      toast.success("Verified!")
      setTimeout(() => {
        router.push("/")
        router.refresh()
      }, 1500)
    } else if (data.code === "OTP_BLOCKED") {
      clearOTP()
      setBlocked(true)
      persistState({ blocked: true })
      toast.error("Session permanently blocked. Redirecting to login...")
      setTimeout(() => router.push("/login"), 3000)
    } else if (data.code === "OTP_LOCKED") {
      clearOTP()
      const seconds = data.retryAfter || 300
      setLockout(seconds)
      persistState({ lockUntil: Date.now() + seconds * 1000 })
      const round = data.lockRound || 1
      const nextAttempts = data.nextAttempts
      toast.error(
        round === 1
          ? `Locked for 5 minutes. You'll get ${nextAttempts} attempts after.`
          : `Locked for 15 minutes. You'll get ${nextAttempts} final attempt after.`
      )
    } else {
      clearOTP()
      toast.error(data.error || "Verification failed")
    }

    setVerifying(false)
  }

  async function handleVerify(e: React.FormEvent) {
    e.preventDefault()
    const otpValue = otp.join("")
    if (otpValue.length !== 6) {
      toast.error("Enter complete 6-digit OTP")
      return
    }
    verifyOTP(otpValue)
  }

  async function resendOTP() {
    if (!authSessionId) {
      toast.error("Session expired. Please login again.")
      return
    }

    const res = await fetch("/api/otp/resend", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ authSessionId }),
    })

    const data = await res.json()

    if (!res.ok) {
      toast.error(data.error || "Failed to resend OTP")
      return
    }

    toast.success("New OTP sent to your email")
    setCooldown(30)
    setOtpExpiry(300)
    persistState({ otpExpiresAt: Date.now() + 300 * 1000 })
  }

  // ─── Main OTP form ─────────────────────────────────────────────────────────

  return (
    <div className="relative flex items-center justify-center min-h-screen bg-[#F9F7F3] overflow-hidden px-4">
      {/* Background orbs */}
      <div className="absolute top-[-10%] left-[-5%] w-[400px] h-[400px] bg-purple-200/25 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-5%] w-[350px] h-[350px] bg-orange-200/20 rounded-full blur-[100px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative w-full max-w-[440px]"
      >
        {/* Step indicator */}
        <div className="flex items-center justify-center gap-2 mb-6">
          <span className="w-8 h-1 rounded-full bg-gray-300" />
          <span className="w-8 h-1 rounded-full bg-gray-300" />
          <span className="w-8 h-1 rounded-full bg-gray-900" />
        </div>

        <form
          onSubmit={handleVerify}
          className="bg-white/80 backdrop-blur-sm border border-gray-200/60 rounded-3xl shadow-xl shadow-gray-200/40 p-8 sm:p-10 text-center"
        >
          {/* Icon */}
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-600 to-pink-500 flex items-center justify-center mx-auto mb-5 shadow-lg shadow-purple-200">
            <ShieldCheck className="w-6 h-6 text-white" />
          </div>

          <h1 className="text-2xl font-bold text-gray-900 mb-1.5">
            Verify Your Email
          </h1>
          <p className="text-sm text-gray-500 mb-8">
            Enter the 6-digit code sent to your KIIT email
          </p>

          {/* OTP expiry indicator — hidden during lockout (irrelevant while locked) */}
          {!lockout && !blocked && otpExpiry > 0 && (
            <p className={`text-xs mb-4 tabular-nums ${otpExpiry <= 60 ? "text-red-500" : "text-gray-400"}`}>
              Code expires in {Math.floor(otpExpiry / 60)}:{String(otpExpiry % 60).padStart(2, "0")}
            </p>
          )}
          {!lockout && !blocked && otpExpiry === 0 && hydrated && !loading && !verified && (
            <p className="text-xs text-red-500 mb-4">
              OTP expired — hit Resend to get a new one
            </p>
          )}

          {/* Lockout banner */}
          {lockout > 0 && (
            <div className="mb-5 bg-red-50 border border-red-200 rounded-2xl px-4 py-3">
              <p className="text-sm font-semibold text-red-700">Temporarily locked</p>
              <p className="text-xs text-red-500 mt-0.5">
                Too many failed attempts. You can resend and try again in{" "}
                <span className="font-bold tabular-nums">
                  {Math.floor(lockout / 60)}:{String(lockout % 60).padStart(2, "0")}
                </span>
              </p>
            </div>
          )}

          {/* OTP Inputs */}
          <div className={`flex justify-center gap-2 sm:gap-3 mb-6 ${lockout > 0 ? "opacity-40 pointer-events-none" : ""}`}>
            {otp.map((digit, index) => (
              <input
                key={index}
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                autoComplete="one-time-code"
                maxLength={1}
                value={digit}
                disabled={lockout > 0}
                ref={(el) => { inputs.current[index] = el }}
                className="w-10 h-12 sm:w-12 sm:h-14 text-center text-lg font-bold rounded-2xl border border-gray-200 bg-white shadow-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-400 hover:border-gray-300 disabled:bg-gray-50 disabled:cursor-not-allowed"
                onChange={(e) => handleChange(e.target.value, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                onPaste={handlePaste}
              />
            ))}
          </div>

          {/* Verify button */}
          <button
            type="submit"
            disabled={verifying || lockout > 0}
            className="w-full bg-gray-900 hover:bg-gray-800 text-white py-3.5 rounded-2xl text-sm font-medium shadow-sm transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center gap-2"
          >
            {lockout > 0 ? (
              `Locked — ${Math.floor(lockout / 60)}:${String(lockout % 60).padStart(2, "0")}`
            ) : verifying ? (
              <><Loader2 className="w-4 h-4 animate-spin" /> Verifying...</>
            ) : (
              "Verify OTP"
            )}
          </button>

          {/* Resend */}
          <button
            type="button"
            onClick={resendOTP}
            disabled={cooldown > 0 || lockout > 0}
            className="w-full mt-3 text-gray-500 hover:text-gray-900 disabled:text-gray-300 py-3 rounded-2xl text-sm font-medium transition-all disabled:cursor-not-allowed cursor-pointer flex items-center justify-center gap-1.5"
          >
            <RotateCw className="w-3.5 h-3.5" />
            {lockout > 0 ? "Resend locked" : cooldown > 0 ? `Resend in ${cooldown}s` : "Resend OTP"}
          </button>
        </form>

        <div className="text-center mt-5">
          <Link href="/" className="text-xs text-gray-400 hover:text-gray-600 transition">
            Back to home
          </Link>
        </div>
      </motion.div>
    </div>
  )
}
