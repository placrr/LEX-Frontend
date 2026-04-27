"use client"

import { Mic, Clock, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function InterviewPage() {
  return (
    <div className="min-h-screen bg-[#F9F7F3]">
      <div className="max-w-4xl mx-auto px-4 py-12">

        {/* Header */}
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center">
              <Mic className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">AI Interview Prep</h1>
          </div>
          <p className="text-gray-600 max-w-xl">
            Practice with AI-powered mock interviews tailored to your target role. Get real-time feedback on your answers.
          </p>
        </div>

        {/* Coming Soon Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8 md:p-12 text-center">
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-blue-50 flex items-center justify-center mx-auto mb-6">
            <Clock className="w-8 h-8 text-blue-500" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Coming Soon</h2>
          <p className="text-gray-500 max-w-md mx-auto mb-8">
            We&apos;re building an AI-powered interview simulator with role-specific questions,
            real-time analysis, and detailed feedback. Stay tuned!
          </p>
          <Link href="/ats">
            <Button variant="outline" className="rounded-full px-6">
              Try ATS Checker instead <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
