import { ArrowRight, FileSearch, Mic, Briefcase } from "lucide-react"
import Link from "next/link"

const floatingTags = [
  { label: "ATS Score: 87%", style: { left: "2%", top: "15%" }, delay: "0.6s" },
  { label: "Interview Ready", style: { left: "5%", top: "45%" }, delay: "0.8s" },
  { label: "Keywords Matched", style: { right: "2%", top: "15%" }, delay: "1s" },
  { label: "Resume Optimized", style: { right: "5%", top: "45%" }, delay: "1.2s" },
]

export default function Hero({ loggedIn = false }: { loggedIn?: boolean }) {
  return (
    <section className="relative overflow-clip pt-28 pb-20 md:pt-36 md:pb-28">
      {/* Background gradient orbs */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-purple-200/40 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-orange-200/30 rounded-full blur-[100px] pointer-events-none" />

      <div className="relative max-w-6xl mx-auto px-4">
        {/* Badge */}
        <div className="flex justify-center mb-6 animate-[fadeUp_0.5s_ease_both]">
          <span className="inline-flex items-center gap-2 bg-white border border-gray-200 rounded-full px-4 py-1.5 text-xs font-medium text-gray-600 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            Built for KIIT Students
          </span>
        </div>

        {/* Heading */}
        <h1 className="text-center text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-gray-900 leading-[1.08] animate-[fadeUp_0.6s_0.1s_ease_both]">
          Your AI Career
          <br />
          <span className="bg-gradient-to-r from-purple-600 via-pink-500 to-orange-500 bg-clip-text text-transparent">
            Accelerator
          </span>
        </h1>

        {/* Subheading */}
        <p className="mt-5 text-center text-gray-500 text-base md:text-lg max-w-xl mx-auto leading-relaxed animate-[fadeUp_0.5s_0.25s_ease_both]">
          ATS resume scoring, AI mock interviews, and smart job matching
          — all in one place. Land your dream role faster.
        </p>

        {/* CTA Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3 animate-[fadeUp_0.5s_0.4s_ease_both]">
          <Link
            href="/ats"
            className="bg-gray-900 hover:bg-gray-800 text-white px-7 py-3.5 rounded-full text-sm font-medium shadow-lg shadow-gray-900/20 transition flex items-center gap-2"
          >
            Try ATS Checker Free <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href={loggedIn ? "/dashboard" : "/login"}
            className="bg-white hover:bg-gray-50 text-gray-700 px-7 py-3.5 rounded-full text-sm font-medium border border-gray-200 shadow-sm transition"
          >
            {loggedIn ? "Go to Dashboard" : "Sign Up with KIIT Email"}
          </Link>
        </div>

        {/* Feature pills */}
        <div className="mt-12 flex flex-wrap items-center justify-center gap-3 animate-[fadeUp_0.5s_0.6s_ease_both]">
          {[
            { icon: FileSearch, label: "Resume ATS Checker", color: "text-purple-600 bg-purple-50 border-purple-200" },
            { icon: Mic, label: "AI Interview Prep", color: "text-blue-600 bg-blue-50 border-blue-200" },
            { icon: Briefcase, label: "Smart Job Matching", color: "text-orange-600 bg-orange-50 border-orange-200" },
          ].map((f) => (
            <span
              key={f.label}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium border ${f.color}`}
            >
              <f.icon className="w-3.5 h-3.5" />
              {f.label}
            </span>
          ))}
        </div>

        {/* Floating tags — decorative */}
        <div className="hidden xl:block relative h-0">
          {floatingTags.map((tag) => (
            <div
              key={tag.label}
              className="absolute whitespace-nowrap bg-white/80 backdrop-blur-sm border border-gray-200 rounded-full px-3 py-1.5 text-[11px] font-medium text-gray-600 shadow-sm animate-[fadeIn_0.4s_ease_both]"
              style={{ ...tag.style, animationDelay: tag.delay }}
            >
              {tag.label}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
