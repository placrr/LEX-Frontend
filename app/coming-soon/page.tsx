"use client"

import { motion } from "framer-motion"
import { ArrowLeft, Bell } from "lucide-react"
import Link from "next/link"

export default function ComingSoon() {
  return (
    <main className="relative flex items-center justify-center min-h-screen bg-[#F9F7F3] overflow-hidden px-4">
      <div className="absolute top-[-10%] left-[10%] w-[400px] h-[400px] bg-purple-200/30 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[10%] w-[350px] h-[350px] bg-orange-200/20 rounded-full blur-[100px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative text-center max-w-md"
      >
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-600 to-pink-500 flex items-center justify-center mx-auto mb-6 shadow-lg shadow-purple-200">
          <Bell className="w-7 h-7 text-white" />
        </div>

        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
          Coming Soon
        </h1>
        <p className="text-sm text-gray-500 mb-8 leading-relaxed">
          We&apos;re working hard to bring this to you. Stay tuned for updates — it&apos;ll be worth the wait.
        </p>

        <Link
          href="/"
          className="inline-flex items-center gap-2 bg-gray-900 hover:bg-gray-800 text-white px-6 py-3 rounded-full text-sm font-medium shadow-lg transition"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </Link>
      </motion.div>
    </main>
  )
}
