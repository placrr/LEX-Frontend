"use client"

import { motion } from "framer-motion"
import { FileSearch, Mic, Briefcase, ArrowUpRight } from "lucide-react"
import Link from "next/link"

const features = [
  {
    title: "Resume (ATS) Checker",
    description: "Upload your resume and a job description. Get an instant ATS compatibility score with keyword analysis, dimension breakdown, and exact fixes to boost your score.",
    icon: FileSearch,
    href: "/ats",
    gradient: "from-purple-600 to-pink-500",
    bg: "bg-gradient-to-br from-purple-50 to-pink-50",
    border: "border-purple-200",
    stats: [
      { value: "7", label: "Scoring Dimensions" },
      { value: "AI", label: "Keyword Analysis" },
      { value: "90s", label: "Avg. Report Time" },
    ],
  },
  {
    title: "AI Interview Prep",
    description: "Practice with AI-powered mock interviews tailored to your target role. Get real-time feedback on answers, confidence, and communication patterns.",
    icon: Mic,
    href: "/interview",
    gradient: "from-blue-600 to-cyan-500",
    bg: "bg-gradient-to-br from-blue-50 to-cyan-50",
    border: "border-blue-200",
    stats: [
      { value: "50+", label: "Question Types" },
      { value: "Live", label: "AI Feedback" },
      { value: "Role", label: "Specific Prep" },
    ],
  },
  {
    title: "Job Informer",
    description: "Get personalized job recommendations matched to your resume and skills. Never miss the right opportunity — alerts delivered to your inbox.",
    icon: Briefcase,
    href: "/jobs",
    gradient: "from-orange-500 to-amber-500",
    bg: "bg-gradient-to-br from-orange-50 to-amber-50",
    border: "border-orange-200",
    stats: [
      { value: "Daily", label: "Job Alerts" },
      { value: "Smart", label: "Matching" },
      { value: "KIIT", label: "Focused" },
    ],
  },
]

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.15 } },
}

const item = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
}

export default function Features() {
  return (
    <section id="features" className="py-20 md:py-28 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }}
          className="text-center mb-14"
        >
          <span className="inline-block text-xs font-semibold text-purple-600 bg-purple-50 border border-purple-200 rounded-full px-3 py-1 mb-4">
            Features
          </span>
          <h2 className="text-3xl md:text-5xl font-bold text-gray-900 tracking-tight">
            Everything You Need to
            <br className="hidden sm:block" />
            <span className="bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent"> Land Your Dream Job</span>
          </h2>
          <p className="mt-4 text-gray-500 max-w-lg mx-auto text-sm md:text-base">
            AI-driven tools that give you an unfair advantage in the job market.
          </p>
        </motion.div>

        {/* Cards */}
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-60px" }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6"
        >
          {features.map((f) => (
            <motion.div
              key={f.title}
              variants={item}
              className={`group relative rounded-3xl p-7 ${f.bg} border ${f.border} hover:shadow-lg transition-shadow duration-300`}
            >
              {/* Icon */}
              <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${f.gradient} flex items-center justify-center mb-5 shadow-sm`}>
                <f.icon className="w-5 h-5 text-white" />
              </div>

              <h3 className="text-xl font-bold text-gray-900 mb-2">{f.title}</h3>
              <p className="text-sm text-gray-600 leading-relaxed mb-6">{f.description}</p>

              {/* Mini stats */}
              <div className="grid grid-cols-3 gap-1.5 sm:gap-3 mb-6">
                {f.stats.map((s) => (
                  <div key={s.label} className="text-center bg-white/70 rounded-xl py-2.5 border border-white">
                    <div className="text-base font-bold text-gray-900">{s.value}</div>
                    <div className="text-[10px] text-gray-500 font-medium">{s.label}</div>
                  </div>
                ))}
              </div>

              {/* Link */}
              <Link
                href={f.href}
                className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-900 group-hover:gap-2.5 transition-all"
              >
                Try it now <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
