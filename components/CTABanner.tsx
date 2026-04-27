"use client"

import { motion } from "framer-motion"
import { ArrowRight } from "lucide-react"
import Link from "next/link"

export default function CTABanner() {
  return (
    <section className="px-4 py-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.5 }}
        className="max-w-5xl mx-auto bg-gray-900 rounded-3xl px-8 py-14 md:px-16 md:py-20 text-center relative overflow-hidden"
      >
        {/* Decorative glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-purple-500/20 rounded-full blur-[120px] pointer-events-none" />

        <div className="relative">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 tracking-tight">
            Ready to Beat the ATS?
          </h2>
          <p className="text-gray-400 text-sm md:text-base max-w-md mx-auto mb-8">
            Join hundreds of KIIT students who optimized their resumes and landed interviews at top companies.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/ats"
              className="bg-white text-gray-900 hover:bg-gray-100 px-7 py-3.5 rounded-full text-sm font-semibold shadow-lg transition flex items-center gap-2"
            >
              Start Free ATS Scan <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/#pricing"
              className="text-gray-400 hover:text-white px-6 py-3.5 rounded-full text-sm font-medium transition"
            >
              View Plans
            </Link>
          </div>
        </div>
      </motion.div>
    </section>
  )
}
