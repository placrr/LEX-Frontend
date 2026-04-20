"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  FileSearch, BarChart3, TrendingUp, Trophy, FileText,
  ArrowRight, ChevronRight, Loader2, Plus, Crown,
} from "lucide-react"
import { toast } from "sonner"
import { motion } from "framer-motion"

// ─── Types ────────────────────────────────────────────────────────────────────

interface Props {
  user: {
    name: string
    email: string
    rollNo: string
    year: number
    plan: string
    joinedAt: string
  }
  resumes: {
    id: string
    fileName: string
    createdAt: string
    reportCount: number
  }[]
  recentReports: {
    id: string
    jobTitle: string | null
    atsScore: number
    status: string
    createdAt: string
    dimensions: {
      keywordMatch: number | null
      semantic: number | null
      skills: number | null
      experience: number | null
      education: number | null
      format: number | null
    }
  }[]
  stats: {
    totalScans: number
    avgScore: number
    bestScore: number
    completedScans: number
    planLimit: number
    resumeCount: number
  }
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function scoreBg(score: number) {
  if (score >= 85) return "bg-green-500"
  if (score >= 70) return "bg-purple-500"
  if (score >= 55) return "bg-yellow-500"
  return "bg-red-500"
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric" })
}

const fadeUp = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4 },
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function DashboardClient({ user, resumes, recentReports, stats }: Props) {
  const router = useRouter()
  const remaining = Math.max(0, stats.planLimit - stats.totalScans)
  const usagePct = Math.min(100, Math.round((stats.totalScans / stats.planLimit) * 100))

  async function handleLogout() {
    const logout = fetch("/api/auth/logout", { method: "POST" })
    router.push("/")
    await logout
    router.refresh()
  }

  return (
    <div className="min-h-screen bg-[#F9F7F3]">
      <div className="max-w-6xl mx-auto px-4 py-8 md:py-12">

        {/* ── Header ── */}
        <motion.div {...fadeUp} className="bg-white rounded-2xl border border-gray-100 p-6 md:p-8 mb-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              {/* Avatar */}
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-600 to-pink-500 flex items-center justify-center shadow-lg shadow-purple-200 shrink-0">
                <span className="text-white text-xl font-bold">{user.name.charAt(0)}</span>
              </div>
              <div>
                <h1 className="text-xl md:text-2xl font-bold text-gray-900">
                  Welcome back, {user.name.split(" ")[0]}
                </h1>
                <div className="flex flex-wrap items-center gap-x-2 gap-y-1 mt-1">
                  <span className="text-sm text-gray-500">{user.email}</span>
                  <span className="text-gray-300 hidden sm:inline">&middot;</span>
                  <span className="text-sm text-gray-400">{user.rollNo}</span>
                  <span className="text-gray-300 hidden sm:inline">&middot;</span>
                  <span className="text-sm text-gray-400">Year {user.year}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2.5">
              <span className={`inline-flex items-center gap-1.5 text-xs font-bold px-4 py-2 rounded-full ${
                user.plan === "PRO"
                  ? "bg-gradient-to-r from-purple-600 to-pink-500 text-white shadow-md shadow-purple-200"
                  : "bg-gray-900 text-white"
              }`}>
                {user.plan === "PRO" && <Crown className="w-3.5 h-3.5" />}
                {user.plan}
              </span>
              <button
                onClick={handleLogout}
                className="text-xs font-semibold text-red-500 hover:text-white hover:bg-red-500 border border-red-200 hover:border-red-500 px-4 py-2 rounded-full transition-all"
              >
                Logout
              </button>
            </div>
          </div>
        </motion.div>

        {/* ── Stat Cards ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
        >
          {[
            { icon: BarChart3, label: "Total Scans", value: stats.totalScans, sub: `/ ${stats.planLimit} limit`, color: "text-blue-600 bg-blue-50" },
            { icon: TrendingUp, label: "Avg. Score", value: stats.avgScore || "—", sub: stats.completedScans > 0 ? `across ${stats.completedScans} reports` : "no reports yet", color: "text-purple-600 bg-purple-50" },
            { icon: Trophy, label: "Best Score", value: stats.bestScore || "—", sub: stats.bestScore >= 85 ? "Excellent!" : stats.bestScore >= 70 ? "Strong" : stats.bestScore > 0 ? "Room to grow" : "—", color: "text-green-600 bg-green-50" },
            { icon: FileText, label: "Resumes", value: stats.resumeCount, sub: "uploaded", color: "text-orange-600 bg-orange-50" },
          ].map((card) => (
            <div key={card.label} className="bg-white rounded-2xl border border-gray-100 p-5">
              <div className={`w-9 h-9 rounded-xl ${card.color} flex items-center justify-center mb-3`}>
                <card.icon className="w-4 h-4" />
              </div>
              <div className="text-2xl font-bold text-gray-900">{card.value}</div>
              <div className="text-xs text-gray-400 mt-0.5">{card.label}</div>
              <div className="text-[11px] text-gray-400 mt-1">{card.sub}</div>
            </div>
          ))}
        </motion.div>

        {/* ── Usage bar ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.15 }}
          className="bg-white rounded-2xl border border-gray-100 p-5 mb-8"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Plan Usage</span>
            <span className="text-xs text-gray-400">{remaining} scans remaining</span>
          </div>
          <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                usagePct >= 90 ? "bg-red-500" : usagePct >= 70 ? "bg-yellow-500" : "bg-purple-500"
              }`}
              style={{ width: `${usagePct}%` }}
            />
          </div>
          {remaining <= 2 && remaining > 0 && (
            <p className="text-xs text-yellow-600 mt-2">Almost at limit — consider upgrading.</p>
          )}
          {remaining === 0 && (
            <div className="flex items-center justify-between mt-2">
              <p className="text-xs text-red-500">Plan limit reached.</p>
              <Link href="/#pricing" className="text-xs text-purple-600 font-medium hover:underline">
                Upgrade
              </Link>
            </div>
          )}
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">

          {/* ── Recent Reports (2 cols) ── */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 p-6"
          >
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-bold text-gray-900">Recent Reports</h2>
              <Link href="/ats" className="text-xs text-purple-600 font-medium hover:underline flex items-center gap-1">
                View all <ArrowRight className="w-3 h-3" />
              </Link>
            </div>

            {recentReports.length === 0 ? (
              <div className="text-center py-12">
                <FileSearch className="w-10 h-10 text-gray-200 mx-auto mb-3" />
                <p className="text-sm text-gray-400 mb-4">No reports yet</p>
                <Link
                  href="/ats"
                  className="inline-flex items-center gap-2 bg-gray-900 text-white text-sm px-5 py-2.5 rounded-full hover:bg-gray-800 transition"
                >
                  <Plus className="w-4 h-4" /> Run Your First Scan
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {recentReports.map((report) => (
                  <Link
                    key={report.id}
                    href={report.status === "COMPLETED" ? `/ats/report/${report.id}` : "#"}
                    className={`flex items-center gap-4 p-4 rounded-xl border transition ${
                      report.status === "COMPLETED"
                        ? "border-gray-100 hover:bg-gray-50 cursor-pointer"
                        : "border-gray-50 opacity-60 cursor-default"
                    }`}
                  >
                    {/* Score circle */}
                    <div className="shrink-0">
                      {report.status === "COMPLETED" ? (
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${scoreBg(report.atsScore)} text-white`}>
                          <span className="text-sm font-bold">{report.atsScore}</span>
                        </div>
                      ) : report.status === "PROCESSING" ? (
                        <div className="w-12 h-12 rounded-full flex items-center justify-center bg-gray-100">
                          <Loader2 className="w-5 h-5 animate-spin text-gray-400" />
                        </div>
                      ) : (
                        <div className="w-12 h-12 rounded-full flex items-center justify-center bg-red-50 text-red-400 text-xs font-medium">
                          Fail
                        </div>
                      )}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-gray-900 truncate">
                        {report.jobTitle || "General Analysis"}
                      </div>
                      <div className="text-xs text-gray-400 mt-0.5">
                        {formatDate(report.createdAt)}
                        {report.status === "COMPLETED" && report.dimensions.keywordMatch != null && (
                          <span> &middot; Keywords: {report.dimensions.keywordMatch}%</span>
                        )}
                      </div>
                    </div>

                    {/* Dimension mini-bars (desktop) */}
                    {report.status === "COMPLETED" && (
                      <div className="hidden md:flex items-center gap-1">
                        {[
                          report.dimensions.keywordMatch,
                          report.dimensions.semantic,
                          report.dimensions.skills,
                          report.dimensions.experience,
                          report.dimensions.education,
                        ].map((v, j) => (
                          <div key={j} className="w-1.5 bg-gray-100 rounded-full overflow-hidden" style={{ height: 28 }}>
                            <div
                              className={`w-full rounded-full ${v != null && v >= 70 ? "bg-green-400" : v != null && v >= 50 ? "bg-yellow-400" : "bg-red-300"}`}
                              style={{ height: `${Math.max(4, v ?? 0)}%`, marginTop: "auto" }}
                            />
                          </div>
                        ))}
                      </div>
                    )}

                    {report.status === "COMPLETED" && (
                      <ChevronRight className="w-4 h-4 text-gray-300 shrink-0" />
                    )}
                  </Link>
                ))}
              </div>
            )}
          </motion.div>

          {/* ── Right Sidebar ── */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.25 }}
            className="space-y-6"
          >
            {/* Quick Actions */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6">
              <h2 className="text-base font-bold text-gray-900 mb-4">Quick Actions</h2>
              <div className="space-y-2">
                <Link
                  href="/ats"
                  className="flex items-center gap-3 p-3 rounded-xl bg-purple-50 hover:bg-purple-100 transition group"
                >
                  <div className="w-9 h-9 rounded-lg bg-purple-500 flex items-center justify-center">
                    <FileSearch className="w-4 h-4 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-medium text-gray-900">New ATS Scan</div>
                    <div className="text-[11px] text-gray-500">Upload & analyze a resume</div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-gray-400 group-hover:translate-x-0.5 transition-transform" />
                </Link>

                <Link
                  href="/interview"
                  className="flex items-center gap-3 p-3 rounded-xl bg-blue-50 hover:bg-blue-100 transition group"
                >
                  <div className="w-9 h-9 rounded-lg bg-blue-500 flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-medium text-gray-900">Interview Prep</div>
                    <div className="text-[11px] text-gray-500">Practice with AI</div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-gray-400 group-hover:translate-x-0.5 transition-transform" />
                </Link>

                <Link
                  href="/jobs"
                  className="flex items-center gap-3 p-3 rounded-xl bg-orange-50 hover:bg-orange-100 transition group"
                >
                  <div className="w-9 h-9 rounded-lg bg-orange-500 flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 00.75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 00-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0112 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 01-.673-.38m0 0A2.18 2.18 0 013 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 013.413-.387m7.5 0V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25v.894m7.5 0a48.667 48.667 0 00-7.5 0" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-medium text-gray-900">Job Informer</div>
                    <div className="text-[11px] text-gray-500">Smart job alerts</div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-gray-400 group-hover:translate-x-0.5 transition-transform" />
                </Link>
              </div>
            </div>

            {/* Resumes */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6">
              <h2 className="text-base font-bold text-gray-900 mb-4">Your Resumes</h2>
              {resumes.length === 0 ? (
                <p className="text-sm text-gray-400 text-center py-4">No resumes uploaded yet.</p>
              ) : (
                <div className="space-y-2">
                  {resumes.map((r) => (
                    <div key={r.id} className="flex items-center gap-3 py-2">
                      <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center shrink-0">
                        <FileText className="w-4 h-4 text-gray-500" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm text-gray-800 truncate">{r.fileName}</div>
                        <div className="text-[11px] text-gray-400">
                          {formatDate(r.createdAt)} &middot; {r.reportCount} report{r.reportCount !== 1 ? "s" : ""}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Upgrade CTA (free plan only) */}
            {user.plan === "FREE" && (
              <div className="bg-gradient-to-br from-purple-600 to-pink-500 rounded-2xl p-5 text-white">
                <h3 className="text-base font-bold mb-1">Unlock More Scans</h3>
                <p className="text-xs text-white/80 mb-4">
                  Upgrade to Pro for 100 scans, priority AI, and more.
                </p>
                <Link
                  href="/#pricing"
                  className="inline-flex items-center gap-1.5 bg-white text-gray-900 text-xs font-semibold px-4 py-2 rounded-full hover:bg-gray-100 transition"
                >
                  View Plans <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  )
}
