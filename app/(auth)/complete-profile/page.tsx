"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

export default function CompleteProfilePage() {

  const router = useRouter()

  const [rollNo, setRollNo] = useState("")
  const [year, setYear] = useState("")
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {

    e.preventDefault()

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

      alert(data.error || "Something went wrong")

    }

    setLoading(false)
  }

  return (
    <div className="flex items-center justify-center h-screen">

      <form
        onSubmit={handleSubmit}
        className="p-8 border rounded-xl shadow-md space-y-4 w-96"
      >

        <h1 className="text-xl font-semibold text-center">
          Complete Your Profile
        </h1>

        <input
          type="text"
          placeholder="Roll Number"
          value={rollNo}
          onChange={(e) => setRollNo(e.target.value)}
          className="w-full border p-2 rounded"
          required
        />

        <select
          value={year}
          onChange={(e) => setYear(e.target.value)}
          className="w-full border p-2 rounded"
          required
        >
          <option value="">Select Year</option>
          <option value="1">1st Year</option>
          <option value="2">2nd Year</option>
          <option value="3">3rd Year</option>
          <option value="4">4th Year</option>
        </select>

        <button
          type="submit"
          className="w-full bg-black text-white py-2 rounded"
          disabled={loading}
        >
          {loading ? "Saving..." : "Continue"}
        </button>

      </form>

    </div>
  )
}