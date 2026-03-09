"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

export default function CompleteProfilePage() {

  const router = useRouter()

  const [rollNo, setRollNo] = useState("")
  const [year, setYear] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  async function handleSubmit(e: React.FormEvent) {

    e.preventDefault()

    setError("")

    // Basic validation
    if (!rollNo.trim()) {
      setError("Roll number is required")
      return
    }

    if (!year) {
      setError("Please select your year")
      return
    }

    setLoading(true)

    const res = await fetch("/api/users/complete-profile", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        rollNo,
        year: Number(year)
      })
    })

    const data = await res.json()

    console.log("API response:", data)

    if (res.ok && data.authSessionId) {

      router.push(`/verify-otp?session=${data.authSessionId}`)

    } else {

      setError(data.error || "Something went wrong")
    }

    setLoading(false)
  }

  return (
    <div className="flex items-center justify-center h-screen bg-gray-50">

      <form
        onSubmit={handleSubmit}
        className="bg-white border rounded-2xl shadow-lg px-12 py-12 space-y-6 w-[420px]"
      >

        <h1 className="text-2xl font-semibold text-center">
          Complete Your Profile
        </h1>

        <p className="text-sm text-gray-500 text-center">
          Enter your KIIT details to continue
        </p>

        {/* Roll Number */}

        <div className="space-y-1">

          <label className="text-sm font-medium">
            Roll Number
          </label>

          <input
            type="text"
            placeholder="2305XXXX"
            value={rollNo}
            onChange={(e) => setRollNo(e.target.value)}
            className="
            w-full
            border
            border-gray-300
            p-2.5
            rounded-lg
            transition
            focus:outline-none
            focus:ring-2
            focus:ring-black
            "
            required
          />

        </div>


        {/* Year */}

        <div className="space-y-1">

          <label className="text-sm font-medium">
            Year
          </label>

          <select
            value={year}
            onChange={(e) => setYear(e.target.value)}
            className="
            w-full
            border
            border-gray-300
            p-2.5
            rounded-lg
            transition
            focus:outline-none
            focus:ring-2
            focus:ring-black
            "
            required
          >

            <option value="">Select Year</option>
            <option value="1">1st Year</option>
            <option value="2">2nd Year</option>
            <option value="3">3rd Year</option>
            <option value="4">4th Year</option>

          </select>

        </div>


        {/* Error message */}

        {error && (
          <p className="text-sm text-red-500 text-center">
            {error}
          </p>
        )}


        {/* Button */}

        <button
          type="submit"
          disabled={loading}
          className="
          w-full
          bg-black
          text-white
          py-2.5
          rounded-lg
          transition
          hover:bg-gray-800
          active:scale-95
          disabled:opacity-50
          cursor-pointer
          "
        >
          {loading ? "Saving..." : "Continue"}
        </button>

      </form>

    </div>
  )
}