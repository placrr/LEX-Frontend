"use client"

import { useState, useEffect, useRef, use } from "react"
import Link from "next/link"
import {
  ArrowLeft, Loader2, Send,
  TrendingUp, TrendingDown, Lightbulb,
  Search, AlertTriangle, CheckCircle2,
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
    <div key={label} className="space-y-1">
      <div className="flex justify-between text-xs">
        <span className="text-gray-600">{label}</span>
        <span className="font-medium text-gray-900">{value}</span>
      </div>
      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
        <div className={`h-full rounded-full ${color} transition-all duration-500`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  )
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function ReportPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)

  const [report, setReport] = useState<FullReport | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* ── Left Column ── */}
          <div className="lg:col-span-2 space-y-6">

            {/* Dimensions */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Score Breakdown</h2>
              <div className="space-y-4">
                {dimensions.map((d) => dimensionBar(d.label, d.value))}
              </div>

              {report.scoreBreakdown && (
                <div className="mt-6 pt-4 border-t border-gray-100 grid grid-cols-3 gap-4 text-center text-sm">
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
                  <div className="w-8 h-8 rounded-lg bg-green-500 flex items-center justify-center">
                    <TrendingUp className="w-4 h-4 text-white" />
                  </div>
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
                  <div className="w-8 h-8 rounded-lg bg-red-500 flex items-center justify-center">
                    <AlertTriangle className="w-4 h-4 text-white" />
                  </div>
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
                  <div className="w-8 h-8 rounded-lg bg-purple-500 flex items-center justify-center">
                    <Lightbulb className="w-4 h-4 text-white" />
                  </div>
                  Exact Fixes to Make
                </h2>
                <ul className="space-y-3">
                  {report.recommendations.map((s, i) => (
                    <li key={i} className="flex items-start gap-3 bg-white/70 rounded-xl px-4 py-3 border border-purple-100">
                      <span className="w-6 h-6 rounded-full bg-purple-500 text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                        {i + 1}
                      </span>
                      <span className="text-sm text-gray-800 leading-relaxed">{s}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Keywords */}
            {(report.keywordsFound?.length > 0 || report.suggestedKeywords?.length > 0) && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <h2 className="flex items-center gap-2 text-lg font-semibold text-gray-900 mb-3">
                  <Search className="w-5 h-5 text-blue-500" /> Keywords
                </h2>

                {report.keywordsFound?.length > 0 && (
                  <div className="mb-4">
                    <p className="text-xs font-medium text-gray-500 mb-2">Found in your resume</p>
                    <div className="flex flex-wrap gap-2">
                      {report.keywordsFound.map((k, i) => (
                        <span key={i} className="px-3 py-1 bg-green-50 text-green-700 text-xs font-medium rounded-full border border-green-200">
                          {k}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {report.suggestedKeywords?.length > 0 && (
                  <div>
                    <p className="text-xs font-medium text-gray-500 mb-2">Suggested to add</p>
                    <div className="flex flex-wrap gap-2">
                      {report.suggestedKeywords.map((k, i) => (
                        <span key={i} className="px-3 py-1 bg-orange-50 text-orange-700 text-xs font-medium rounded-full border border-orange-200">
                          {k}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
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

          {/* ── Right Column: Chat ── */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 lg:sticky lg:top-24 flex flex-col max-h-[500px] lg:max-h-[calc(100vh-8rem)]">
              <h2 className="text-base font-semibold text-gray-900 mb-3 px-2">Ask about this report</h2>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto space-y-3 mb-3 px-1">
                {messages.length === 0 && (
                  <p className="text-xs text-gray-400 text-center py-6">
                    Ask anything about your ATS report — keyword gaps, how to improve, what recruiters look for...
                  </p>
                )}

                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`text-sm px-3 py-2.5 rounded-xl max-w-[95%] ${
                      msg.role === "USER"
                        ? "bg-gray-900 text-white ml-auto"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {msg.role === "USER" ? (
                      msg.message
                    ) : (
                      <div className="space-y-2 leading-relaxed [&_strong]:font-semibold">
                        {msg.message.split(/\n{2,}/).map((block, i) => {
                          const trimmed = block.trim()
                          if (!trimmed) return null

                          // Numbered list item: "1. Text" or "1) Text"
                          const listMatch = trimmed.match(/^(\d+)[.)]\s+(.+)/)
                          if (listMatch) {
                            return (
                              <div key={i} className="flex gap-2">
                                <span className="text-gray-400 shrink-0 font-medium">{listMatch[1]}.</span>
                                <span dangerouslySetInnerHTML={{ __html: formatInline(listMatch[2]) }} />
                              </div>
                            )
                          }

                          // Bullet: "- Text" or "• Text"
                          const bulletMatch = trimmed.match(/^[-•]\s+(.+)/)
                          if (bulletMatch) {
                            return (
                              <div key={i} className="flex gap-2">
                                <span className="text-gray-400 shrink-0">•</span>
                                <span dangerouslySetInnerHTML={{ __html: formatInline(bulletMatch[1]) }} />
                              </div>
                            )
                          }

                          // Regular paragraph
                          return <p key={i} dangerouslySetInnerHTML={{ __html: formatInline(trimmed.replace(/\n/g, "<br/>")) }} />
                        })}
                      </div>
                    )}
                  </div>
                ))}

                {sending && (
                  <div className="bg-gray-100 text-gray-400 text-sm px-3 py-2 rounded-xl w-fit">
                    <Loader2 className="w-3.5 h-3.5 animate-spin inline mr-1" /> Thinking...
                  </div>
                )}

                <div ref={chatEndRef} />
              </div>

              {/* Input */}
              <div className="flex gap-2">
                <input
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
                  placeholder="Type a question..."
                  maxLength={2000}
                  className="flex-1 border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-300 transition"
                />
                <Button
                  size="icon"
                  onClick={handleSend}
                  disabled={sending || !chatInput.trim()}
                  className="bg-gray-900 hover:bg-gray-800 text-white rounded-xl disabled:opacity-40"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
