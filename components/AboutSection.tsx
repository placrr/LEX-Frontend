"use client"

import { motion } from "framer-motion"
import { Sparkles, GraduationCap, ShieldCheck, Zap } from "lucide-react"

const values = [
  {
    icon: Sparkles,
    title: "AI-First Approach",
    description:
      "Every tool is powered by state-of-the-art AI — from resume parsing to interview feedback. No templates, no guesswork.",
    gradient: "from-purple-500 to-pink-500",
    bg: "bg-purple-50",
  },
  {
    icon: GraduationCap,
    title: "Built for KIIT",
    description:
      "Designed exclusively for KIIT students. We understand your placement process, your competition, and your goals.",
    gradient: "from-blue-500 to-cyan-500",
    bg: "bg-blue-50",
  },
  {
    icon: ShieldCheck,
    title: "Private & Secure",
    description:
      "Your resumes and data never leave our servers. No third-party sharing, no selling your information. Ever.",
    gradient: "from-green-500 to-emerald-500",
    bg: "bg-green-50",
  },
  {
    icon: Zap,
    title: "Always Improving",
    description:
      "New features ship every week — interview prep, job alerts, and more. Your feedback shapes the roadmap.",
    gradient: "from-orange-500 to-amber-500",
    bg: "bg-orange-50",
  },
]

export default function AboutSection() {
  return (
    <section id="about" className="py-20 md:py-28 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }}
          className="text-center mb-14"
        >
          <span className="inline-block text-xs font-semibold text-blue-600 bg-blue-50 border border-blue-200 rounded-full px-3 py-1 mb-4">
            About Placr
          </span>
          <h2 className="text-3xl md:text-5xl font-bold text-gray-900 tracking-tight">
            Your Unfair Advantage
            <br className="hidden sm:block" />
            <span className="bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
              {" "}in the Placement Race
            </span>
          </h2>
          <p className="mt-4 text-gray-500 max-w-lg mx-auto text-sm md:text-base leading-relaxed">
            Placr is an AI-powered career platform built by students, for students.
            We help you crack ATS filters, ace interviews, and find the right opportunities
            — so you can focus on what matters.
          </p>
        </motion.div>

        {/* Value cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-14">
          {values.map((v, i) => (
            <motion.div
              key={v.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.45, delay: i * 0.1 }}
              className="group bg-white rounded-2xl p-7 border border-gray-100 hover:shadow-lg hover:border-gray-200 transition-all duration-300"
            >
              <div
                className={`w-10 h-10 rounded-xl bg-gradient-to-br ${v.gradient} flex items-center justify-center mb-4 shadow-sm`}
              >
                <v.icon className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">{v.title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{v.description}</p>
            </motion.div>
          ))}
        </div>

        {/* Stats strip */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="bg-gray-900 rounded-2xl px-6 py-8 md:px-12 md:py-10 grid grid-cols-2 md:grid-cols-4 gap-6 text-center"
        >
          {[
            { value: "500+", label: "Students Using Placr" },
            { value: "2,000+", label: "Resumes Scanned" },
            { value: "90s", label: "Avg. Report Time" },
            { value: "4.6/5", label: "Student Rating" },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: 0.1 + i * 0.08 }}
            >
              <div className="text-2xl md:text-3xl font-bold text-white">{stat.value}</div>
              <div className="text-xs text-gray-400 mt-1">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
