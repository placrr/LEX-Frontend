"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { motion } from "framer-motion"
import { CheckCircle2 } from "lucide-react"

export default function VerifyOTPPage() {

  const router = useRouter()
  const searchParams = useSearchParams()

  const authSessionId = searchParams.get("session")

  const [otp, setOtp] = useState(["", "", "", "", "", ""])
  const [loading, setLoading] = useState(true)
  const [verified, setVerified] = useState(false)
  const [attempts, setAttempts] = useState(0)
  const [cooldown, setCooldown] = useState(30)

  const inputs = useRef<(HTMLInputElement | null)[]>([])

  // 5 SECOND LOADING SCREEN
  useEffect(() => {

    const timer = setTimeout(() => {
      setLoading(false)
    }, 5000)

    return () => clearTimeout(timer)

  }, [])


  // OTP START
  useEffect(() => {

    if (!authSessionId) return

    fetch("/api/otp/start", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        authSessionId
      })
    })

  }, [authSessionId])



  // Cooldown timer
  useEffect(() => {

    if (cooldown <= 0) return

    const timer = setInterval(() => {
      setCooldown(prev => prev - 1)
    }, 1000)

    return () => clearInterval(timer)

  }, [cooldown])



  // PREMIUM LOADING SCREEN
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white p-10 rounded-xl shadow-lg text-center space-y-4"
        >

          <div className="text-2xl font-semibold">
            Sending OTP
          </div>

          <div className="text-gray-500">
            OTP sent to your email. Please check inbox.
          </div>

          <div className="flex justify-center">
            <div className="w-10 h-10 border-4 border-gray-300 border-t-black rounded-full animate-spin"></div>
          </div>

        </motion.div>

      </div>
    )
  }



  // VERIFIED ANIMATION
  if (verified) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">

        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white p-10 rounded-xl shadow-lg text-center"
        >

          <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />

          <h2 className="text-xl font-semibold">
            Verified Successfully
          </h2>

        </motion.div>

      </div>
    )
  }



  function clearOTP() {
    setOtp(["", "", "", "", "", ""])

    inputs.current.forEach((input) => {
      if (input) input.value = ""
    })

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
      if (inputs.current[i]) {
        inputs.current[i]!.value = digit
      }
    })
  }



  async function handleVerify(e: React.FormEvent) {

    e.preventDefault()

    if (!authSessionId) return

    const otpValue = otp.join("")

    if (otpValue.length !== 6) {
      alert("Enter complete 6-digit OTP")
      return
    }

    const res = await fetch("/api/otp/verify", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        otp: otpValue,
        authSessionId
      })
    })

    const data = await res.json()

    if (res.ok) {

      setVerified(true)

      setTimeout(() => {
        router.push("/")
        router.refresh()
      }, 1500)

    } else {

      setAttempts(prev => prev + 1)

      clearOTP()

      alert(data.error || "Verification failed")
    }
  }



  async function resendOTP() {

    if (!authSessionId) {
      alert("Session expired. Please login again.")
      router.replace("/login")
      return
    }

    const res = await fetch("/api/otp/resend", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        authSessionId
      })
    })

    const data = await res.json()

    if (!res.ok) {
      alert(data.error || "Failed to resend OTP")
      return
    }

    alert("OTP sent again to your email")

    setCooldown(30)
  }



  return (
    <div className="flex items-center justify-center h-screen bg-gray-50">

      <form
        onSubmit={handleVerify}
        className="p-10 bg-white border rounded-xl shadow-lg space-y-6 w-96 text-center"
      >

        <h1 className="text-2xl font-semibold">
          Verify OTP
        </h1>

        <p className="text-sm text-gray-500">
          Enter the 6-digit code sent to your email
        </p>



        {/* OTP INPUTS */}

        <div className="flex justify-between gap-3">

          {otp.map((digit, index) => (
            <input
              key={index}
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={1}
              ref={(el) => { inputs.current[index] = el }}
              className="w-12 h-12 text-center border rounded-lg text-lg font-semibold 
              focus:outline-none focus:ring-2 focus:ring-black
              transition"
              onChange={(e) =>
                handleChange(e.target.value, index)
              }
              onKeyDown={(e) =>
                handleKeyDown(e, index)
              }
              onPaste={handlePaste}
            />
          ))}

        </div>



        {/* VERIFY BUTTON */}

        <button
          type="submit"
          className="w-full bg-black text-white py-2 rounded-lg 
          transition 
          hover:bg-gray-800 
          active:scale-95 cursor-pointer"
        >
          Verify OTP
        </button>



        {attempts > 0 && (
          <p className="text-sm text-gray-500">
            Attempts used: {attempts} / 5
          </p>
        )}



        {/* RESEND BUTTON */}

        <button
          type="button"
          onClick={resendOTP}
          disabled={cooldown > 0}
          className="w-full border py-2 rounded-lg 
          transition 
          hover:bg-gray-100 
          active:scale-95 
          disabled:opacity-50 cursor-pointer"
        >
          {cooldown > 0
            ? `Resend OTP in ${cooldown}s`
            : "Resend OTP"}
        </button>

      </form>

    </div>
  )
}