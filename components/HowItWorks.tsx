"use client"

import { motion } from "framer-motion"
import { Upload, Cpu, BarChart3, MessageSquare } from "lucide-react"

const steps = [
  {
    num: "01",
    icon: Upload,
    title: "Upload Your Resume",
    description: "Drop your PDF or DOCX. We parse every word instantly — no data leaves our servers.",
    color: "from-purple-500 to-purple-600",
  },
  {
    num: "02",
    icon: Cpu,
    title: "Paste the Job Description",
    description: "Add the role title and JD. Our AI extracts every keyword, skill, and requirement.",
    color: "from-pink-500 to-rose-500",
  },
  {
    num: "03",
    icon: BarChart3,
    title: "Get Your ATS Score",
    description: "7-dimension analysis, keyword match table, penalties, bonuses — all in under 90 seconds.",
    color: "from-orange-500 to-amber-500",
  },
  {
    num: "04",
    icon: MessageSquare,
    title: "Chat & Improve",
    description: "Ask our AI about gaps, get exact rewording suggestions, and boost your score before applying.",
    color: "from-blue-500 to-cyan-500",
  },
]

export default function HowItWorks() {
  return (
    <section className="py-20 md:py-28 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <span className="inline-block text-xs font-semibold text-orange-600 bg-orange-50 border border-orange-200 rounded-full px-3 py-1 mb-4">
            How It Works
          </span>
          <h2 className="text-3xl md:text-5xl font-bold text-gray-900 tracking-tight">
            From Upload to Offer-Ready
            <br className="hidden sm:block" />
            <span className="bg-gradient-to-r from-orange-500 to-pink-500 bg-clip-text text-transparent"> in 4 Simple Steps</span>
          </h2>
        </motion.div>

        {/* Steps grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {steps.map((step, i) => (
            <motion.div
              key={step.num}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.45, delay: i * 0.1 }}
              className="group relative bg-white rounded-2xl p-6 border border-gray-100 hover:shadow-lg hover:border-gray-200 transition-all duration-300"
            >
              {/* Step number */}
              <span className="text-[64px] font-black text-gray-100 absolute top-3 right-5 leading-none select-none group-hover:text-gray-200 transition-colors">
                {step.num}
              </span>

              {/* Icon */}
              <div className={`relative w-10 h-10 rounded-xl bg-gradient-to-br ${step.color} flex items-center justify-center mb-5 shadow-sm`}>
                <step.icon className="w-5 h-5 text-white" />
              </div>

              <h3 className="text-base font-bold text-gray-900 mb-2">{step.title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{step.description}</p>

              {/* Connector line (not on last) */}
              {i < steps.length - 1 && (
                <div className="hidden lg:block absolute top-1/2 -right-3 w-6 border-t-2 border-dashed border-gray-200" />
              )}
            </motion.div>
          ))}
        </div>

        {/* Trust line */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="text-center text-xs text-gray-400 mt-10"
        >
          Trusted by 500+ KIIT students across all branches
        </motion.p>
      </div>
    </section>
  )
}
