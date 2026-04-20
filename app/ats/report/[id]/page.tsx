"use client"

import { useState, useEffect, useRef, use } from "react"
import Link from "next/link"
import {
  ArrowLeft, Loader2, Send, X, MessageCircle,
  TrendingUp, TrendingDown, Lightbulb,
  Search, AlertTriangle, CheckCircle2,
  Target, ExternalLink, BookOpen, Zap, GraduationCap,
} from "lucide-react"
import { Button } from "@/components/ui/button"

// ─── Inline markdown formatter (bold, code) ──────────────────────────────────
function formatInline(text: string): string {
  return text
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/`(.+?)`/g, '<code class="bg-gray-200 px-1 py-0.5 rounded text-xs">$1</code>')
}

// ─── API paths ────────────────────────────────────────────────────────────────
const API = {
  scoreDetail: (id: string) => `/api/gateway/ats/api/v1/score/${id}`,
  chatHistory: (id: string) => `/api/gateway/ats/api/v1/chat/${id}`,
  chatSend:    (id: string) => `/api/gateway/ats/api/v1/chat/${id}`,
}

// ─── Types ────────────────────────────────────────────────────────────────────

interface KeywordMatch {
  keyword: string
  requirement: "required" | "preferred"
  matchType: "exact" | "partial" | "listed_only" | "not_found"
  matchWeight: number
  evidence: string | null
}

interface Penalty  { reason: string; points: number }
interface Bonus    { reason: string; points: number }

interface ScoreBreakdown {
  rawScore: number
  totalPenalties: number
  totalBonuses: number
  finalScore: number
}

interface FullReport {
  id: string
  status: "PROCESSING" | "COMPLETED" | "FAILED"
  atsScore: number | null
  jobTitle: string | null
  jobDescription: string | null

  strengths: string[]
  improvements: string[]
  recommendations: string[]
  keywordsFound: string[]
  suggestedKeywords: string[]

  keywordMatchScore: number | null
  semanticScore: number | null
  skillsCoverageScore: number | null
  experienceScore: number | null
  educationScore: number | null
  formatScore: number | null

  keywordMatches: KeywordMatch[] | null
  penalties: Penalty[] | null
  bonuses: Bonus[] | null
  scoreBreakdown: ScoreBreakdown | null
  domainMatch: string | null

  resume: { id: string; fileUrl: string }
  createdAt: string
}

interface ChatMessage {
  id: string
  role: "USER" | "ASSISTANT"
  message: string
  createdAt: string
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function scoreBadge(score: number) {
  if (score >= 85) return { label: "Excellent", bg: "bg-green-50", text: "text-green-700", border: "border-green-200" }
  if (score >= 70) return { label: "Strong",    bg: "bg-purple-50", text: "text-purple-700", border: "border-purple-200" }
  if (score >= 55) return { label: "Average",   bg: "bg-yellow-50", text: "text-yellow-700", border: "border-yellow-200" }
  return               { label: "Needs Work", bg: "bg-red-50",    text: "text-red-700",    border: "border-red-200" }
}

function dimensionBar(label: string, value: number | null) {
  if (value == null) return null
  const pct = Math.max(0, Math.min(100, value))
  const color =
    pct >= 80 ? "bg-green-500" :
    pct >= 60 ? "bg-purple-500" :
    pct >= 40 ? "bg-yellow-500" :
    "bg-red-500"

  return (
    <div key={label} className="flex items-center gap-3">
      <span className="text-xs text-gray-600 w-24 sm:w-28 shrink-0">{label}</span>
      <div className="flex-1 h-3 bg-gray-100 rounded-full overflow-hidden">
        <div className={`h-full rounded-full ${color} transition-all duration-500`} style={{ width: `${pct}%` }} />
      </div>
      <span className="text-xs font-bold text-gray-900 w-8 text-right">{value}</span>
    </div>
  )
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function ReportPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)

  const [report, setReport] = useState<FullReport | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [activeTab, setActiveTab] = useState<"score" | "gaps">("score")
  const [chatOpen, setChatOpen] = useState(false)

  // Chat
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [chatInput, setChatInput] = useState("")
  const [sending, setSending] = useState(false)
  const chatEndRef = useRef<HTMLDivElement>(null)

  // ─── Fetch report ─────────────────────────────────────────────────────────

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(API.scoreDetail(id))
        if (!res.ok) throw new Error("Report not found")
        const data = await res.json()
        setReport(data.report)
      } catch (e: any) {
        setError(e.message)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [id])

  // ─── Fetch chat history ───────────────────────────────────────────────────

  useEffect(() => {
    async function loadChat() {
      try {
        const res = await fetch(API.chatHistory(id))
        if (res.ok) {
          const data = await res.json()
          setMessages(data.messages || [])
        }
      } catch {}
    }
    loadChat()
  }, [id])

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  // ─── Send chat ────────────────────────────────────────────────────────────

  async function handleSend() {
    const text = chatInput.trim()
    if (!text || sending) return

    setSending(true)
    setChatInput("")

    // Optimistic user message
    const tempId = crypto.randomUUID()
    setMessages((prev) => [...prev, { id: tempId, role: "USER", message: text, createdAt: new Date().toISOString() }])

    try {
      const res = await fetch(API.chatSend(id), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text }),
      })

      if (!res.ok) throw new Error("Send failed")

      const data = await res.json()
      setMessages((prev) => [
        ...prev,
        { id: data.chatId, role: "ASSISTANT", message: data.assistantMessage, createdAt: new Date().toISOString() },
      ])
    } catch {
      setMessages((prev) => prev.filter((m) => m.id !== tempId))
      setChatInput(text)
    } finally {
      setSending(false)
    }
  }

  // ─── Loading / Error ──────────────────────────────────────────────────────

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F9F7F3] flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
      </div>
    )
  }

  if (error || !report) {
    return (
      <div className="min-h-screen bg-[#F9F7F3] flex flex-col items-center justify-center gap-4">
        <p className="text-gray-500">{error || "Report not found"}</p>
        <Link href="/ats">
          <Button variant="outline" className="rounded-full">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to ATS
          </Button>
        </Link>
      </div>
    )
  }

  const badge = report.atsScore != null ? scoreBadge(report.atsScore) : null

  const dimensions = [
    { label: "Keyword Match",    value: report.keywordMatchScore },
    { label: "Semantic Score",   value: report.semanticScore },
    { label: "Skills Coverage",  value: report.skillsCoverageScore },
    { label: "Experience",       value: report.experienceScore },
    { label: "Education",        value: report.educationScore },
    { label: "Format",           value: report.formatScore },
  ]

  // ─── Render ───────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-[#F9F7F3]">
      <div className="max-w-5xl mx-auto px-4 py-8">

        {/* Back */}
        <Link href="/ats" className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-900 mb-6 transition">
          <ArrowLeft className="w-4 h-4" /> Back to ATS
        </Link>

        {/* ── Score Header ── */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 mb-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-1">
                {report.jobTitle || "General Analysis"}
              </h1>
              <p className="text-sm text-gray-400">
                {new Date(report.createdAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
              </p>
            </div>
            {report.atsScore != null && badge && (
              <div className="flex items-center gap-3">
                <span className={`text-3xl sm:text-5xl font-bold ${badge.text}`}>{report.atsScore}</span>
                <div className="flex flex-col">
                  <span className="text-sm text-gray-400">/ 100</span>
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full border ${badge.bg} ${badge.text} ${badge.border}`}>
                    {badge.label}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Domain Match */}
          {report.domainMatch && (
            <p className="mt-4 text-sm text-gray-500">
              <span className="font-medium text-gray-700">Domain:</span> {report.domainMatch}
            </p>
          )}
        </div>

        {/* ── Layout: Tabs + Chat side by side on desktop ── */}
        <div className="flex gap-6">

        {/* Left: Tab content */}
        <div className="flex-1 min-w-0">

        {/* Tabs */}
        <div className="flex gap-1 bg-white rounded-2xl shadow-sm border border-gray-100 p-1.5 mb-6">
          {([
            { key: "score", label: "Score Breakdown", icon: TrendingUp },
            { key: "gaps", label: "Skill Gap Analysis", icon: Target },
          ] as const).map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium transition-all ${
                activeTab === tab.key
                  ? "bg-gray-900 text-white shadow-sm"
                  : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* ── Tab: Score ── */}
        {activeTab === "score" && (
          <div className="space-y-6">
            {/* Dimensions */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Score Breakdown</h2>
              <div className="space-y-4">
                {dimensions.map((d) => dimensionBar(d.label, d.value))}
              </div>
              {report.scoreBreakdown && (
                <div className="mt-6 pt-4 border-t border-gray-100 grid grid-cols-3 gap-2 sm:gap-4 text-center text-xs sm:text-sm">
                  <div>
                    <div className="text-gray-400">Raw</div>
                    <div className="font-semibold text-gray-900">{report.scoreBreakdown.rawScore}</div>
                  </div>
                  <div>
                    <div className="text-gray-400">Penalties</div>
                    <div className="font-semibold text-red-500">{report.scoreBreakdown.totalPenalties}</div>
                  </div>
                  <div>
                    <div className="text-gray-400">Bonuses</div>
                    <div className="font-semibold text-green-600">+{report.scoreBreakdown.totalBonuses}</div>
                  </div>
                </div>
              )}
            </div>

            {/* Strengths */}
            {report.strengths?.length > 0 && (
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl shadow-sm border border-green-200 p-6">
                <h2 className="flex items-center gap-2 text-lg font-bold text-green-900 mb-4">
                  <div className="w-8 h-8 rounded-lg bg-green-500 flex items-center justify-center"><TrendingUp className="w-4 h-4 text-white" /></div>
                  What&apos;s Working
                </h2>
                <ul className="space-y-3">
                  {report.strengths.map((s, i) => (
                    <li key={i} className="flex items-start gap-3 bg-white/70 rounded-xl px-4 py-3 border border-green-100">
                      <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 shrink-0" />
                      <span className="text-sm text-gray-800 leading-relaxed">{s}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Improvements */}
            {report.improvements?.length > 0 && (
              <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-2xl shadow-sm border border-red-200 p-6">
                <h2 className="flex items-center gap-2 text-lg font-bold text-red-900 mb-4">
                  <div className="w-8 h-8 rounded-lg bg-red-500 flex items-center justify-center"><AlertTriangle className="w-4 h-4 text-white" /></div>
                  Critical Gaps
                </h2>
                <ul className="space-y-3">
                  {report.improvements.map((s, i) => (
                    <li key={i} className="flex items-start gap-3 bg-white/70 rounded-xl px-4 py-3 border border-red-100">
                      <TrendingDown className="w-5 h-5 text-red-500 mt-0.5 shrink-0" />
                      <span className="text-sm text-gray-800 leading-relaxed">{s}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Recommendations */}
            {report.recommendations?.length > 0 && (
              <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-2xl shadow-sm border border-purple-200 p-6">
                <h2 className="flex items-center gap-2 text-lg font-bold text-purple-900 mb-4">
                  <div className="w-8 h-8 rounded-lg bg-purple-500 flex items-center justify-center"><Lightbulb className="w-4 h-4 text-white" /></div>
                  Exact Fixes to Make
                </h2>
                <ul className="space-y-3">
                  {report.recommendations.map((s, i) => (
                    <li key={i} className="flex items-start gap-3 bg-white/70 rounded-xl px-4 py-3 border border-purple-100">
                      <span className="w-6 h-6 rounded-full bg-purple-500 text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">{i + 1}</span>
                      <span className="text-sm text-gray-800 leading-relaxed">{s}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Penalties & Bonuses */}
            {(report.penalties?.length || report.bonuses?.length) ? (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-3">Scoring Adjustments</h2>
                {report.penalties && report.penalties.length > 0 && (
                  <div className="mb-4">
                    <p className="text-xs font-medium text-red-500 mb-2">Penalties</p>
                    <div className="space-y-1.5">
                      {report.penalties.map((p, i) => (
                        <div key={i} className="flex justify-between text-sm">
                          <span className="text-gray-700">{p.reason}</span>
                          <span className="font-medium text-red-500">{p.points}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {report.bonuses && report.bonuses.length > 0 && (
                  <div>
                    <p className="text-xs font-medium text-green-600 mb-2">Bonuses</p>
                    <div className="space-y-1.5">
                      {report.bonuses.map((b, i) => (
                        <div key={i} className="flex justify-between text-sm">
                          <span className="text-gray-700">{b.reason}</span>
                          <span className="font-medium text-green-600">+{b.points}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : null}
          </div>
        )}

        {/* ── Tab: Skill Gap ── */}
        {activeTab === "gaps" && (
          <div className="space-y-6">
            {report.keywordMatches && report.keywordMatches.length > 0 ? (() => {
              const exact = report.keywordMatches!.filter(k => k.matchType === "exact")
              const partial = report.keywordMatches!.filter(k => k.matchType === "partial")
              const listedOnly = report.keywordMatches!.filter(k => k.matchType === "listed_only")
              const notFound = report.keywordMatches!.filter(k => k.matchType === "not_found")
              const required = report.keywordMatches!.filter(k => k.requirement === "required")
              const preferred = report.keywordMatches!.filter(k => k.requirement === "preferred")
              const requiredMatched = required.filter(k => k.matchType === "exact" || k.matchType === "partial")
              const preferredMatched = preferred.filter(k => k.matchType === "exact" || k.matchType === "partial")
              const coveragePct = required.length > 0 ? Math.round((requiredMatched.length / required.length) * 100) : 0
              const totalMatched = exact.length + partial.length
              const total = report.keywordMatches!.length

              return (
                <>
                  {/* ── Overview Cards ── */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <div className="bg-white rounded-2xl border border-gray-100 p-4 text-center">
                      <div className="text-2xl font-bold text-gray-900">{total}</div>
                      <div className="text-[11px] text-gray-500 mt-0.5">JD Keywords</div>
                    </div>
                    <div className="bg-white rounded-2xl border border-green-100 p-4 text-center">
                      <div className="text-2xl font-bold text-green-600">{totalMatched}</div>
                      <div className="text-[11px] text-gray-500 mt-0.5">Matched</div>
                    </div>
                    <div className="bg-white rounded-2xl border border-yellow-100 p-4 text-center">
                      <div className="text-2xl font-bold text-yellow-600">{listedOnly.length}</div>
                      <div className="text-[11px] text-gray-500 mt-0.5">Need Proof</div>
                    </div>
                    <div className="bg-white rounded-2xl border border-red-100 p-4 text-center">
                      <div className="text-2xl font-bold text-red-500">{notFound.length}</div>
                      <div className="text-[11px] text-gray-500 mt-0.5">Missing</div>
                    </div>
                  </div>

                  {/* ── Coverage Bars ── */}
                  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                    <h2 className="text-base font-bold text-gray-900 mb-4">Coverage Breakdown</h2>
                    <div className="space-y-4">
                      <div>
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="text-sm text-gray-700">Required Skills</span>
                          <span className="text-xs font-bold text-gray-900">{requiredMatched.length}/{required.length}</span>
                        </div>
                        <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
                          <div className={`h-full rounded-full ${coveragePct >= 80 ? "bg-green-500" : coveragePct >= 50 ? "bg-yellow-500" : "bg-red-500"}`} style={{ width: `${coveragePct}%` }} />
                        </div>
                      </div>
                      <div>
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="text-sm text-gray-700">Preferred Skills</span>
                          <span className="text-xs font-bold text-gray-900">{preferredMatched.length}/{preferred.length}</span>
                        </div>
                        <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
                          <div className="h-full rounded-full bg-blue-500" style={{ width: `${preferred.length > 0 ? Math.round((preferredMatched.length / preferred.length) * 100) : 0}%` }} />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* ── Full Keyword Table ── */}
                  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                    <h2 className="text-base font-bold text-gray-900 mb-4">All Keywords from Job Description</h2>
                    <div className="space-y-2">
                      {report.keywordMatches!.map((k, i) => (
                        <div key={i} className={`flex items-center gap-3 rounded-xl px-4 py-3 border ${
                          k.matchType === "exact" ? "bg-green-50/50 border-green-100" :
                          k.matchType === "partial" ? "bg-blue-50/50 border-blue-100" :
                          k.matchType === "listed_only" ? "bg-yellow-50/50 border-yellow-100" :
                          "bg-red-50/50 border-red-100"
                        }`}>
                          <div className={`w-2 h-2 rounded-full shrink-0 ${
                            k.matchType === "exact" ? "bg-green-500" :
                            k.matchType === "partial" ? "bg-blue-500" :
                            k.matchType === "listed_only" ? "bg-yellow-500" :
                            "bg-red-500"
                          }`} />
                          <span className="text-sm font-medium text-gray-900 flex-1">{k.keyword}</span>
                          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                            k.requirement === "required" ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-500"
                          }`}>{k.requirement}</span>
                          <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${
                            k.matchType === "exact" ? "bg-green-100 text-green-700" :
                            k.matchType === "partial" ? "bg-blue-100 text-blue-700" :
                            k.matchType === "listed_only" ? "bg-yellow-100 text-yellow-700" :
                            "bg-red-100 text-red-700"
                          }`}>{k.matchType === "listed_only" ? "weak" : k.matchType === "not_found" ? "missing" : k.matchType}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* ── What To Do Next ── */}
                  {(notFound.length > 0 || listedOnly.length > 0) && (
                    <div className="bg-gray-900 rounded-2xl p-6 text-white">
                      <h2 className="flex items-center gap-2 text-base font-bold mb-1">
                        <Zap className="w-5 h-5 text-yellow-400" /> What To Do Next
                      </h2>
                      <p className="text-xs text-gray-400 mb-5">Follow these steps to improve your score for this role.</p>

                      <div className="space-y-4">
                        {notFound.filter(k => k.requirement === "required").length > 0 && (
                          <div className="bg-white/10 rounded-xl p-4">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="w-5 h-5 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center shrink-0">!</span>
                              <span className="text-sm font-semibold">Critical — Add these required skills</span>
                            </div>
                            <div className="flex flex-wrap gap-1.5 mb-3">
                              {notFound.filter(k => k.requirement === "required").map((k, i) => (
                                <span key={i} className="px-2.5 py-1 bg-red-500/20 text-red-200 text-xs font-medium rounded-full border border-red-500/30">{k.keyword}</span>
                              ))}
                            </div>
                            <p className="text-xs text-gray-400">These are dealbreakers. Without them, most ATS systems will auto-reject your resume.</p>
                            <div className="flex flex-wrap gap-2 mt-3">
                              {notFound.filter(k => k.requirement === "required").slice(0, 3).map((k, i) => (
                                <a key={i} href={`https://www.youtube.com/results?search_query=${encodeURIComponent(k.keyword)}+tutorial+for+beginners`} target="_blank" rel="noopener noreferrer" className="text-[11px] font-medium text-yellow-400 hover:text-yellow-300 flex items-center gap-1">
                                  Learn {k.keyword} <ExternalLink className="w-2.5 h-2.5" />
                                </a>
                              ))}
                            </div>
                          </div>
                        )}

                        {listedOnly.length > 0 && (
                          <div className="bg-white/10 rounded-xl p-4">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="w-5 h-5 rounded-full bg-yellow-500 text-white text-[10px] font-bold flex items-center justify-center shrink-0">
                                <Zap className="w-2.5 h-2.5" />
                              </span>
                              <span className="text-sm font-semibold">Strengthen — Back up these with proof</span>
                            </div>
                            <div className="flex flex-wrap gap-1.5 mb-3">
                              {listedOnly.map((k, i) => (
                                <span key={i} className="px-2.5 py-1 bg-yellow-500/20 text-yellow-200 text-xs font-medium rounded-full border border-yellow-500/30">{k.keyword}</span>
                              ))}
                            </div>
                            <p className="text-xs text-gray-400">You listed these in Skills but never mentioned them in your projects or experience. Add a bullet like: &quot;Built X using {listedOnly[0]?.keyword}&quot;.</p>
                          </div>
                        )}

                        {notFound.filter(k => k.requirement === "preferred").length > 0 && (
                          <div className="bg-white/10 rounded-xl p-4">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="w-5 h-5 rounded-full bg-gray-500 text-white text-[10px] font-bold flex items-center justify-center shrink-0">+</span>
                              <span className="text-sm font-semibold">Bonus — Nice-to-have skills</span>
                            </div>
                            <div className="flex flex-wrap gap-1.5 mb-3">
                              {notFound.filter(k => k.requirement === "preferred").map((k, i) => (
                                <span key={i} className="px-2.5 py-1 bg-gray-500/20 text-gray-300 text-xs font-medium rounded-full border border-gray-500/30">{k.keyword}</span>
                              ))}
                            </div>
                            <p className="text-xs text-gray-400">Not required, but adding even one of these gives you an edge over other candidates.</p>
                          </div>
                        )}

                        {exact.length > 0 && (
                          <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="w-5 h-5 rounded-full bg-green-500 text-white text-[10px] font-bold flex items-center justify-center shrink-0">✓</span>
                              <span className="text-sm font-semibold">Keep — Your strongest matches</span>
                            </div>
                            <div className="flex flex-wrap gap-1.5">
                              {exact.map((k, i) => (
                                <span key={i} className="px-2.5 py-1 bg-green-500/20 text-green-300 text-xs font-medium rounded-full border border-green-500/30">{k.keyword}</span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </>
              )
            })() : (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
                <Target className="w-10 h-10 text-gray-200 mx-auto mb-3" />
                <p className="text-sm text-gray-400">No keyword match data available for this report.</p>
              </div>
            )}
          </div>
        )}

        </div>{/* end left: tab content */}

        {/* Right: Chat sidebar — visible on lg+, floating on mobile */}
        <div className="hidden lg:flex w-56 shrink-0">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col sticky top-24 w-full" style={{ height: "350px" }}>
            <div className="flex items-center gap-2 px-4 py-3 border-b border-gray-100">
              <div className="w-7 h-7 rounded-lg bg-purple-500 flex items-center justify-center">
                <MessageCircle className="w-3.5 h-3.5 text-white" />
              </div>
              <span className="text-sm font-semibold text-gray-900">Ask AI</span>
            </div>

            <div className="flex-1 overflow-y-auto p-3 space-y-3">
              {messages.length === 0 && (
                <div className="text-center py-8">
                  <MessageCircle className="w-6 h-6 text-gray-200 mx-auto mb-2" />
                  <p className="text-xs text-gray-400">Ask about gaps, how to improve, what recruiters look for...</p>
                </div>
              )}
              {messages.map((msg) => (
                <div key={msg.id} className={`text-sm px-3 py-2.5 rounded-2xl max-w-[95%] ${msg.role === "USER" ? "bg-gray-900 text-white ml-auto" : "bg-gray-100 text-gray-800"}`}>
                  {msg.role === "USER" ? msg.message : (
                    <div className="space-y-2 leading-relaxed [&_strong]:font-semibold">
                      {msg.message.split(/\n{2,}/).map((block, i) => {
                        const t = block.trim(); if (!t) return null
                        const lm = t.match(/^(\d+)[.)]\s+(.+)/); if (lm) return <div key={i} className="flex gap-2"><span className="text-gray-400 shrink-0 font-medium">{lm[1]}.</span><span dangerouslySetInnerHTML={{ __html: formatInline(lm[2]) }} /></div>
                        const bm = t.match(/^[-•]\s+(.+)/); if (bm) return <div key={i} className="flex gap-2"><span className="text-gray-400 shrink-0">•</span><span dangerouslySetInnerHTML={{ __html: formatInline(bm[1]) }} /></div>
                        return <p key={i} dangerouslySetInnerHTML={{ __html: formatInline(t.replace(/\n/g, "<br/>")) }} />
                      })}
                    </div>
                  )}
                </div>
              ))}
              {sending && <div className="bg-gray-100 text-gray-400 text-sm px-3 py-2.5 rounded-2xl w-fit"><Loader2 className="w-3.5 h-3.5 animate-spin inline mr-1" /> Thinking...</div>}
              <div ref={chatEndRef} />
            </div>

            <div className="flex gap-1.5 p-2 border-t border-gray-100">
              <input value={chatInput} onChange={(e) => setChatInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSend()} placeholder="Ask..." maxLength={2000} className="flex-1 min-w-0 border border-gray-200 rounded-lg px-2 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-purple-300 transition" />
              <Button size="icon" onClick={handleSend} disabled={sending || !chatInput.trim()} className="bg-gray-900 hover:bg-gray-800 text-white rounded-lg disabled:opacity-40 h-8 w-8 shrink-0"><Send className="w-3 h-3" /></Button>
            </div>
          </div>
        </div>

        </div>{/* end flex layout */}

      </div>

      {/* Mobile: Floating chat button + panel (lg: hidden) */}
      <div className="lg:hidden">
        <button
          onClick={() => setChatOpen(!chatOpen)}
          className="fixed bottom-6 right-6 w-14 h-14 bg-gray-900 hover:bg-gray-800 text-white rounded-full shadow-xl shadow-gray-900/30 flex items-center justify-center transition-all z-50"
        >
          {chatOpen ? <X className="w-5 h-5" /> : <MessageCircle className="w-5 h-5" />}
          {messages.length > 0 && !chatOpen && (
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-purple-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">{messages.length}</span>
          )}
        </button>

        {chatOpen && (
          <div className="fixed bottom-24 right-4 left-4 bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col z-50 animate-[fadeUp_0.2s_ease_both]" style={{ maxHeight: "min(450px, calc(100vh - 150px))" }}>
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-purple-500 flex items-center justify-center"><MessageCircle className="w-3.5 h-3.5 text-white" /></div>
                <span className="text-sm font-semibold text-gray-900">Ask AI</span>
              </div>
              <button onClick={() => setChatOpen(false)} className="text-gray-400 hover:text-gray-600"><X className="w-4 h-4" /></button>
            </div>
            <div className="flex-1 overflow-y-auto p-3 space-y-3">
              {messages.length === 0 && <p className="text-xs text-gray-400 text-center py-6">Ask about gaps, improvements, what recruiters look for...</p>}
              {messages.map((msg) => (
                <div key={msg.id} className={`text-sm px-3 py-2.5 rounded-2xl max-w-[85%] ${msg.role === "USER" ? "bg-gray-900 text-white ml-auto" : "bg-gray-100 text-gray-800"}`}>
                  {msg.role === "USER" ? msg.message : (
                    <div className="space-y-2 leading-relaxed [&_strong]:font-semibold">
                      {msg.message.split(/\n{2,}/).map((block, i) => {
                        const t = block.trim(); if (!t) return null
                        const lm = t.match(/^(\d+)[.)]\s+(.+)/); if (lm) return <div key={i} className="flex gap-2"><span className="text-gray-400 shrink-0 font-medium">{lm[1]}.</span><span dangerouslySetInnerHTML={{ __html: formatInline(lm[2]) }} /></div>
                        const bm = t.match(/^[-•]\s+(.+)/); if (bm) return <div key={i} className="flex gap-2"><span className="text-gray-400 shrink-0">•</span><span dangerouslySetInnerHTML={{ __html: formatInline(bm[1]) }} /></div>
                        return <p key={i} dangerouslySetInnerHTML={{ __html: formatInline(t.replace(/\n/g, "<br/>")) }} />
                      })}
                    </div>
                  )}
                </div>
              ))}
              {sending && <div className="bg-gray-100 text-gray-400 text-sm px-3 py-2.5 rounded-2xl w-fit"><Loader2 className="w-3.5 h-3.5 animate-spin inline mr-1" /> Thinking...</div>}
              <div ref={chatEndRef} />
            </div>
            <div className="flex gap-2 p-3 border-t border-gray-100">
              <input value={chatInput} onChange={(e) => setChatInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSend()} placeholder="Type a question..." maxLength={2000} className="flex-1 border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-300 transition" />
              <Button size="icon" onClick={handleSend} disabled={sending || !chatInput.trim()} className="bg-gray-900 hover:bg-gray-800 text-white rounded-xl disabled:opacity-40 h-10 w-10"><Send className="w-4 h-4" /></Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
