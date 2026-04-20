"use client"

import { useState, useEffect, useRef, use } from "react"
import Link from "next/link"
import {
  ArrowLeft, Loader2, Send, X, MessageCircle,
  TrendingUp, TrendingDown, Lightbulb,
  Search, AlertTriangle, CheckCircle2,
  Target, ExternalLink, BookOpen, Zap, GraduationCap, BarChart3,
} from "lucide-react"
import { Button } from "@/components/ui/button"

// ─── Helpers ──────────────────────────────────────────────────────────────────

function fmt(text: string): string {
  return text
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/`(.+?)`/g, '<code class="bg-gray-200 px-1 py-0.5 rounded text-[11px]">$1</code>')
}

const API = {
  scoreDetail: (id: string) => `/api/gateway/ats/api/v1/score/${id}`,
  chatHistory: (id: string) => `/api/gateway/ats/api/v1/chat/${id}`,
  chatSend:    (id: string) => `/api/gateway/ats/api/v1/chat/${id}`,
}

// ─── Types ────────────────────────────────────────────────────────────────────

interface KW { keyword: string; requirement: "required" | "preferred"; matchType: "exact" | "partial" | "listed_only" | "not_found"; matchWeight: number; evidence: string | null }
interface Pen { reason: string; points: number }
interface Bon { reason: string; points: number }
interface SB { rawScore: number; totalPenalties: number; totalBonuses: number; finalScore: number }
interface Report {
  id: string; status: string; atsScore: number | null; jobTitle: string | null; jobDescription: string | null
  strengths: string[]; improvements: string[]; recommendations: string[]
  keywordsFound: string[]; suggestedKeywords: string[]
  keywordMatchScore: number | null; semanticScore: number | null; skillsCoverageScore: number | null
  experienceScore: number | null; educationScore: number | null; formatScore: number | null
  keywordMatches: KW[] | null; penalties: Pen[] | null; bonuses: Bon[] | null
  scoreBreakdown: SB | null; domainMatch: string | null; resume: { id: string; fileUrl: string }; createdAt: string
}
interface Chat { id: string; role: "USER" | "ASSISTANT"; message: string; createdAt: string }

function scoreColor(s: number) { return s >= 85 ? "text-green-600" : s >= 70 ? "text-purple-600" : s >= 55 ? "text-yellow-600" : "text-red-500" }
function scoreBg(s: number) { return s >= 85 ? "bg-green-500" : s >= 70 ? "bg-purple-500" : s >= 55 ? "bg-yellow-500" : "bg-red-500" }
function scoreLabel(s: number) { return s >= 85 ? "Excellent" : s >= 70 ? "Strong" : s >= 55 ? "Average" : "Needs Work" }
function barColor(v: number) { return v >= 80 ? "bg-green-500" : v >= 60 ? "bg-purple-500" : v >= 40 ? "bg-yellow-500" : "bg-red-400" }

// ─── Component ────────────────────────────────────────────────────────────────

export default function ReportPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const [report, setReport] = useState<Report | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [tab, setTab] = useState<"score" | "gaps">("score")
  const [chatOpen, setChatOpen] = useState(false)
  const [msgs, setMsgs] = useState<Chat[]>([])
  const [chatIn, setChatIn] = useState("")
  const [sending, setSending] = useState(false)
  const chatEnd = useRef<HTMLDivElement>(null)

  useEffect(() => { fetch(API.scoreDetail(id)).then(r => r.ok ? r.json() : Promise.reject()).then(d => setReport(d.report)).catch(() => setError("Report not found")).finally(() => setLoading(false)) }, [id])
  useEffect(() => { fetch(API.chatHistory(id)).then(r => r.ok ? r.json() : null).then(d => d?.messages && setMsgs(d.messages)).catch(() => {}) }, [id])
  useEffect(() => { chatEnd.current?.scrollIntoView({ behavior: "smooth" }) }, [msgs])

  async function send() {
    const text = chatIn.trim(); if (!text || sending) return
    setSending(true); setChatIn("")
    const tid = crypto.randomUUID()
    setMsgs(p => [...p, { id: tid, role: "USER", message: text, createdAt: new Date().toISOString() }])
    try {
      const r = await fetch(API.chatSend(id), { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ message: text }) })
      if (!r.ok) throw 0
      const d = await r.json()
      setMsgs(p => [...p, { id: d.chatId, role: "ASSISTANT", message: d.assistantMessage, createdAt: new Date().toISOString() }])
    } catch { setMsgs(p => p.filter(m => m.id !== tid)); setChatIn(text) }
    finally { setSending(false) }
  }

  if (loading) return <div className="min-h-screen bg-[#F9F7F3] flex items-center justify-center"><Loader2 className="w-6 h-6 animate-spin text-gray-400" /></div>
  if (error || !report) return (
    <div className="min-h-screen bg-[#F9F7F3] flex flex-col items-center justify-center gap-4">
      <p className="text-gray-500">{error || "Report not found"}</p>
      <Link href="/ats"><Button variant="outline" className="rounded-full"><ArrowLeft className="w-4 h-4 mr-2" /> Back</Button></Link>
    </div>
  )

  const s = report.atsScore ?? 0
  const dims = [
    { label: "Keyword Match", val: report.keywordMatchScore, weight: "25%" },
    { label: "Semantic", val: report.semanticScore, weight: "20%" },
    { label: "Skills Coverage", val: report.skillsCoverageScore, weight: "15%" },
    { label: "Experience", val: report.experienceScore, weight: "15%" },
    { label: "Education", val: report.educationScore, weight: "10%" },
    { label: "Format", val: report.formatScore, weight: "10%" },
  ]
  const kw = report.keywordMatches ?? []
  const exact = kw.filter(k => k.matchType === "exact")
  const partial = kw.filter(k => k.matchType === "partial")
  const weak = kw.filter(k => k.matchType === "listed_only")
  const missing = kw.filter(k => k.matchType === "not_found")
  const reqAll = kw.filter(k => k.requirement === "required")
  const reqMatched = reqAll.filter(k => k.matchType === "exact" || k.matchType === "partial")
  const covPct = reqAll.length > 0 ? Math.round((reqMatched.length / reqAll.length) * 100) : 0

  // ─── Chat renderer ─────────────────────────────────────────────────────────
  function ChatPanel({ className = "", maxH = "calc(100vh-8rem)" }: { className?: string; maxH?: string }) {
    return (
      <div className={`bg-white rounded-2xl border border-gray-100 shadow-sm flex flex-col ${className}`} style={{ height: maxH }}>
        <div className="flex items-center gap-2 px-4 py-3 border-b border-gray-50">
          <div className="w-6 h-6 rounded-md bg-purple-500 flex items-center justify-center"><MessageCircle className="w-3 h-3 text-white" /></div>
          <span className="text-sm font-semibold text-gray-900">Ask AI</span>
        </div>
        <div className="flex-1 overflow-y-auto p-3 space-y-2.5">
          {msgs.length === 0 && <p className="text-[11px] text-gray-400 text-center py-8">Ask about your score, gaps, or how to improve...</p>}
          {msgs.map(m => (
            <div key={m.id} className={`text-[13px] leading-relaxed px-3 py-2 rounded-xl max-w-[90%] ${m.role === "USER" ? "bg-gray-900 text-white ml-auto" : "bg-gray-50 text-gray-800 border border-gray-100"}`}>
              {m.role === "USER" ? m.message : (
                <div className="space-y-1.5 [&_strong]:font-semibold">
                  {m.message.split(/\n{2,}/).map((b, i) => {
                    const t = b.trim(); if (!t) return null
                    const lm = t.match(/^(\d+)[.)]\s+(.+)/); if (lm) return <div key={i} className="flex gap-1.5"><span className="text-gray-400 shrink-0">{lm[1]}.</span><span dangerouslySetInnerHTML={{ __html: fmt(lm[2]) }} /></div>
                    const bm = t.match(/^[-•]\s+(.+)/); if (bm) return <div key={i} className="flex gap-1.5"><span className="text-gray-400">•</span><span dangerouslySetInnerHTML={{ __html: fmt(bm[1]) }} /></div>
                    return <p key={i} dangerouslySetInnerHTML={{ __html: fmt(t.replace(/\n/g, "<br/>")) }} />
                  })}
                </div>
              )}
            </div>
          ))}
          {sending && <div className="text-[13px] text-gray-400 bg-gray-50 border border-gray-100 px-3 py-2 rounded-xl w-fit"><Loader2 className="w-3 h-3 animate-spin inline mr-1" />Thinking...</div>}
          <div ref={chatEnd} />
        </div>
        <div className="flex gap-2 p-2.5 border-t border-gray-50">
          <input value={chatIn} onChange={e => setChatIn(e.target.value)} onKeyDown={e => e.key === "Enter" && !e.shiftKey && send()} placeholder="Ask a question..." maxLength={2000} className="flex-1 bg-gray-50 border-0 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-200" />
          <Button size="icon" onClick={send} disabled={sending || !chatIn.trim()} className="bg-gray-900 hover:bg-gray-800 text-white rounded-lg disabled:opacity-30 h-9 w-9"><Send className="w-3.5 h-3.5" /></Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#F9F7F3]">
      <div className="max-w-7xl mx-auto px-4 py-6">

        <Link href="/ats" className="inline-flex items-center gap-1 text-sm text-gray-400 hover:text-gray-900 mb-5 transition">
          <ArrowLeft className="w-4 h-4" /> Back
        </Link>

        {/* ── Score Header ── */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 sm:p-7 mb-5">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900">{report.jobTitle || "ATS Report"}</h1>
              <p className="text-xs text-gray-400 mt-1">{new Date(report.createdAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}{report.domainMatch && ` · ${report.domainMatch}`}</p>
            </div>
            <div className="flex items-center gap-2.5">
              <span className={`text-4xl sm:text-5xl font-black tabular-nums ${scoreColor(s)}`}>{s}</span>
              <div>
                <span className="text-xs text-gray-400 block">/100</span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${scoreBg(s)} text-white`}>{scoreLabel(s)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* ── Layout ── */}
        <div className="flex gap-5">

          {/* Left: Tabs */}
          <div className="flex-1 min-w-0">

            <div className="flex gap-1 bg-white rounded-xl border border-gray-100 p-1 mb-5">
              {([{ key: "score" as const, label: "Score", icon: BarChart3 }, { key: "gaps" as const, label: "Skill Gap", icon: Target }]).map(t => (
                <button key={t.key} onClick={() => setTab(t.key)} className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-semibold transition ${tab === t.key ? "bg-gray-900 text-white" : "text-gray-400 hover:text-gray-700"}`}>
                  <t.icon className="w-3.5 h-3.5" />{t.label}
                </button>
              ))}
            </div>

            {/* ── SCORE TAB ── */}
            {tab === "score" && (
              <div className="space-y-4">

                {/* Dimension bars */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                  <h2 className="text-sm font-bold text-gray-900 mb-4">Scoring Dimensions</h2>
                  <div className="space-y-3">
                    {dims.map(d => d.val != null && (
                      <div key={d.label} className="flex items-center gap-2.5">
                        <span className="text-[11px] text-gray-500 w-24 shrink-0">{d.label}</span>
                        <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                          <div className={`h-full rounded-full ${barColor(d.val)} transition-all duration-700`} style={{ width: `${d.val}%` }} />
                        </div>
                        <span className="text-[11px] font-bold text-gray-900 w-7 text-right tabular-nums">{d.val}</span>
                        <span className="text-[9px] text-gray-300 w-6">{d.weight}</span>
                      </div>
                    ))}
                  </div>
                  {report.scoreBreakdown && (
                    <div className="flex items-center gap-4 mt-4 pt-3 border-t border-gray-50 text-[11px]">
                      <span className="text-gray-400">Raw <span className="font-bold text-gray-900">{report.scoreBreakdown.rawScore}</span></span>
                      <span className="text-gray-400">Penalties <span className="font-bold text-red-500">{report.scoreBreakdown.totalPenalties}</span></span>
                      <span className="text-gray-400">Bonuses <span className="font-bold text-green-600">+{report.scoreBreakdown.totalBonuses}</span></span>
                    </div>
                  )}
                </div>

                {/* Strengths + Improvements side by side on desktop */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {report.strengths?.length > 0 && (
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                      <h2 className="flex items-center gap-2 text-sm font-bold text-gray-900 mb-3">
                        <span className="w-5 h-5 rounded-md bg-green-500 flex items-center justify-center"><CheckCircle2 className="w-3 h-3 text-white" /></span>
                        Strengths
                      </h2>
                      <ul className="space-y-2">
                        {report.strengths.map((s, i) => (
                          <li key={i} className="text-[13px] text-gray-700 leading-relaxed pl-3 border-l-2 border-green-300">{s}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {report.improvements?.length > 0 && (
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                      <h2 className="flex items-center gap-2 text-sm font-bold text-gray-900 mb-3">
                        <span className="w-5 h-5 rounded-md bg-red-500 flex items-center justify-center"><AlertTriangle className="w-3 h-3 text-white" /></span>
                        Improve
                      </h2>
                      <ul className="space-y-2">
                        {report.improvements.map((s, i) => (
                          <li key={i} className="text-[13px] text-gray-700 leading-relaxed pl-3 border-l-2 border-red-300">{s}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                {/* Recommendations */}
                {report.recommendations?.length > 0 && (
                  <div className="bg-gray-900 rounded-2xl shadow-sm p-5 text-white">
                    <h2 className="flex items-center gap-2 text-sm font-bold mb-3">
                      <Lightbulb className="w-4 h-4 text-yellow-400" /> Action Items
                    </h2>
                    <div className="space-y-2">
                      {report.recommendations.map((s, i) => (
                        <div key={i} className="flex items-start gap-2.5">
                          <span className="w-5 h-5 rounded-full bg-white/15 text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">{i + 1}</span>
                          <p className="text-[13px] text-gray-300 leading-relaxed">{s}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Penalties & Bonuses — compact */}
                {(report.penalties?.length || report.bonuses?.length) ? (
                  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                    <h2 className="text-sm font-bold text-gray-900 mb-3">Adjustments</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {report.penalties && report.penalties.length > 0 && (
                        <div className="space-y-1">
                          {report.penalties.map((p, i) => (
                            <div key={i} className="flex items-center justify-between text-[12px]">
                              <span className="text-gray-600 truncate mr-2">{p.reason}</span>
                              <span className="font-bold text-red-500 tabular-nums shrink-0">{p.points}</span>
                            </div>
                          ))}
                        </div>
                      )}
                      {report.bonuses && report.bonuses.length > 0 && (
                        <div className="space-y-1">
                          {report.bonuses.map((b, i) => (
                            <div key={i} className="flex items-center justify-between text-[12px]">
                              <span className="text-gray-600 truncate mr-2">{b.reason}</span>
                              <span className="font-bold text-green-600 tabular-nums shrink-0">+{b.points}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ) : null}
              </div>
            )}

            {/* ── SKILL GAP TAB ── */}
            {tab === "gaps" && (
              <div className="space-y-4">
                {kw.length > 0 ? (
                  <>
                    {/* Stats row */}
                    <div className="grid grid-cols-4 gap-2">
                      {[
                        { n: exact.length, label: "Exact", color: "text-green-600 border-green-100" },
                        { n: partial.length, label: "Partial", color: "text-blue-600 border-blue-100" },
                        { n: weak.length, label: "Weak", color: "text-yellow-600 border-yellow-100" },
                        { n: missing.length, label: "Missing", color: "text-red-500 border-red-100" },
                      ].map(x => (
                        <div key={x.label} className={`bg-white rounded-xl border p-3 text-center ${x.color}`}>
                          <div className="text-xl font-black tabular-nums">{x.n}</div>
                          <div className="text-[10px] text-gray-500">{x.label}</div>
                        </div>
                      ))}
                    </div>

                    {/* Coverage */}
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-bold text-gray-900">Required Skills Coverage</span>
                        <span className={`text-sm font-black tabular-nums ${covPct >= 80 ? "text-green-600" : covPct >= 50 ? "text-yellow-600" : "text-red-500"}`}>{covPct}%</span>
                      </div>
                      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div className={`h-full rounded-full ${covPct >= 80 ? "bg-green-500" : covPct >= 50 ? "bg-yellow-500" : "bg-red-500"} transition-all duration-700`} style={{ width: `${covPct}%` }} />
                      </div>
                      <p className="text-[11px] text-gray-400 mt-2">{reqMatched.length} of {reqAll.length} required skills matched</p>
                    </div>

                    {/* Keyword table */}
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                      <div className="px-5 py-3 border-b border-gray-50">
                        <h2 className="text-sm font-bold text-gray-900">All {kw.length} Keywords</h2>
                      </div>
                      <div className="divide-y divide-gray-50">
                        {kw.map((k, i) => (
                          <div key={i} className="flex items-center gap-3 px-5 py-2.5 hover:bg-gray-50/50 transition">
                            <div className={`w-1.5 h-1.5 rounded-full shrink-0 ${k.matchType === "exact" ? "bg-green-500" : k.matchType === "partial" ? "bg-blue-500" : k.matchType === "listed_only" ? "bg-yellow-500" : "bg-red-400"}`} />
                            <span className="text-[13px] font-medium text-gray-900 flex-1">{k.keyword}</span>
                            <span className={`text-[9px] font-bold uppercase tracking-wide px-1.5 py-0.5 rounded ${k.requirement === "required" ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-400"}`}>{k.requirement === "required" ? "REQ" : "PREF"}</span>
                            <span className={`text-[9px] font-bold uppercase tracking-wide px-1.5 py-0.5 rounded ${k.matchType === "exact" ? "bg-green-100 text-green-700" : k.matchType === "partial" ? "bg-blue-100 text-blue-700" : k.matchType === "listed_only" ? "bg-yellow-100 text-yellow-700" : "bg-red-100 text-red-600"}`}>{k.matchType === "not_found" ? "MISS" : k.matchType === "listed_only" ? "WEAK" : k.matchType.toUpperCase()}</span>
                            {k.matchType === "not_found" && (
                              <a href={`https://www.google.com/search?q=learn+${encodeURIComponent(k.keyword)}+free+course`} target="_blank" rel="noopener noreferrer" className="text-[10px] text-blue-500 hover:text-blue-700"><ExternalLink className="w-3 h-3" /></a>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Action plan */}
                    {(missing.length > 0 || weak.length > 0) && (
                      <div className="bg-gray-900 rounded-2xl shadow-sm p-5 text-white">
                        <h2 className="flex items-center gap-2 text-sm font-bold mb-4"><Zap className="w-4 h-4 text-yellow-400" /> Fix These to Boost Your Score</h2>

                        {missing.filter(k => k.requirement === "required").length > 0 && (
                          <div className="mb-4">
                            <p className="text-[10px] uppercase tracking-widest text-red-400 font-bold mb-2">Critical — Required & Missing</p>
                            <div className="flex flex-wrap gap-1.5">
                              {missing.filter(k => k.requirement === "required").map((k, i) => (
                                <a key={i} href={`https://www.youtube.com/results?search_query=${encodeURIComponent(k.keyword)}+tutorial`} target="_blank" rel="noopener noreferrer" className="px-2.5 py-1 bg-red-500/20 text-red-200 text-xs font-medium rounded-md border border-red-500/30 hover:bg-red-500/30 transition">
                                  {k.keyword} <ExternalLink className="w-2.5 h-2.5 inline ml-0.5" />
                                </a>
                              ))}
                            </div>
                          </div>
                        )}

                        {weak.length > 0 && (
                          <div className="mb-4">
                            <p className="text-[10px] uppercase tracking-widest text-yellow-400 font-bold mb-2">Strengthen — Add Project Proof</p>
                            <div className="flex flex-wrap gap-1.5">
                              {weak.map((k, i) => <span key={i} className="px-2.5 py-1 bg-yellow-500/15 text-yellow-200 text-xs font-medium rounded-md border border-yellow-500/25">{k.keyword}</span>)}
                            </div>
                            <p className="text-[11px] text-gray-500 mt-2">Add these to your experience bullets: &quot;Built X using {weak[0]?.keyword}&quot;</p>
                          </div>
                        )}

                        {missing.filter(k => k.requirement === "preferred").length > 0 && (
                          <div>
                            <p className="text-[10px] uppercase tracking-widest text-gray-500 font-bold mb-2">Nice to Have</p>
                            <div className="flex flex-wrap gap-1.5">
                              {missing.filter(k => k.requirement === "preferred").map((k, i) => <span key={i} className="px-2.5 py-1 bg-white/5 text-gray-400 text-xs font-medium rounded-md border border-white/10">{k.keyword}</span>)}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </>
                ) : (
                  <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
                    <Target className="w-8 h-8 text-gray-200 mx-auto mb-2" />
                    <p className="text-sm text-gray-400">No keyword data for this report.</p>
                  </div>
                )}
              </div>
            )}

          </div>{/* end left */}

          {/* Right: Chat — desktop */}
          <div className="hidden lg:block w-72 xl:w-80 shrink-0">
            <div className="sticky top-20">
              <ChatPanel maxH="calc(100vh - 6rem)" />
            </div>
          </div>

        </div>{/* end flex */}
      </div>

      {/* Mobile chat */}
      <div className="lg:hidden">
        <button onClick={() => setChatOpen(!chatOpen)} className="fixed bottom-5 right-5 w-12 h-12 bg-gray-900 text-white rounded-full shadow-lg flex items-center justify-center z-50">
          {chatOpen ? <X className="w-4 h-4" /> : <MessageCircle className="w-4 h-4" />}
          {msgs.length > 0 && !chatOpen && <span className="absolute -top-1 -right-1 w-4 h-4 bg-purple-500 text-white text-[8px] font-bold rounded-full flex items-center justify-center">{msgs.length}</span>}
        </button>
        {chatOpen && (
          <div className="fixed bottom-20 right-3 left-3 z-50 animate-[fadeUp_0.15s_ease_both]">
            <ChatPanel maxH="min(400px, calc(100vh - 140px))" />
          </div>
        )}
      </div>
    </div>
  )
}
