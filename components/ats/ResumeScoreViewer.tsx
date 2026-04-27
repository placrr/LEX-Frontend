"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { ChevronDown, ChevronRight, FileText, Loader2, BarChart3 } from "lucide-react"

// ─── API paths ───────────────────────────────────────────────────────────────

const API = {
  resumeList:   "/api/gateway/resume/api/v1/resume/list",
  resumeScores: (id: string) => `/api/gateway/ats/api/v1/score/resume/${id}`,
}

// ─── Types ───────────────────────────────────────────────────────────────────

interface Resume {
  id: string
  fileUrl: string
  createdAt: string
}

interface ResumeReport {
  id: string
  jobTitle: string | null
  atsScore: number | null
  status: "PROCESSING" | "COMPLETED" | "FAILED"
  keywordMatchScore: number | null
  semanticScore: number | null
  skillsCoverageScore: number | null
  experienceScore: number | null
  educationScore: number | null
  formatScore: number | null
  industryScore: number | null
  createdAt: string
}

interface ResumeWithScores {
  resume: Resume
  reports: ResumeReport[]
  loading: boolean
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function scoreColor(score: number) {
  if (score >= 85) return "text-green-600"
  if (score >= 70) return "text-purple-600"
  if (score >= 55) return "text-yellow-600"
  return "text-red-500"
}

function scoreBg(score: number) {
  if (score >= 85) return "bg-green-500"
  if (score >= 70) return "bg-purple-500"
  if (score >= 55) return "bg-yellow-400"
  return "bg-red-500"
}

function fileName(fileUrl: string) {
  return fileUrl.replace("uploaded://", "")
}

// ─── Mini dimension bar ──────────────────────────────────────────────────────

function DimBar({ label, value }: { label: string; value: number | null }) {
  if (value == null) return null
  return (
    <div className="flex items-center gap-2 text-[11px]">
      <span className="w-20 text-gray-400 truncate">{label}</span>
      <div className="flex-1 h-1.5 rounded-full bg-gray-100">
        <div
          className={`h-1.5 rounded-full transition-all ${scoreBg(value)}`}
          style={{ width: `${value}%` }}
        />
      </div>
      <span className="w-6 text-right text-gray-500 font-medium">{value}</span>
    </div>
  )
}

// ─── Component ───────────────────────────────────────────────────────────────

export function ResumeScoreViewer() {
  const router = useRouter()
  const [resumes, setResumes] = useState<Resume[]>([])
  const [loading, setLoading] = useState(true)
  const [expanded, setExpanded] = useState<Record<string, ResumeWithScores>>({})

  // Load resume list
  useEffect(() => {
    fetch(API.resumeList)
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((data) => setResumes(data.resumes ?? []))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  // Toggle expand — fetch scores on first open
  const toggle = useCallback(async (resume: Resume) => {
    setExpanded((prev) => {
      if (prev[resume.id] && !prev[resume.id].loading) {
        // Collapse
        const next = { ...prev }
        delete next[resume.id]
        return next
      }
      return prev
    })

    // If not loaded yet, fetch
    if (expanded[resume.id]) return

    setExpanded((prev) => ({
      ...prev,
      [resume.id]: { resume, reports: [], loading: true },
    }))

    try {
      const res = await fetch(API.resumeScores(resume.id))
      if (!res.ok) throw new Error()
      const data = await res.json()
      setExpanded((prev) => ({
        ...prev,
        [resume.id]: { resume, reports: data.reports ?? [], loading: false },
      }))
    } catch {
      setExpanded((prev) => ({
        ...prev,
        [resume.id]: { resume, reports: [], loading: false },
      }))
    }
  }, [expanded])

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="w-5 h-5 animate-spin text-gray-300" />
      </div>
    )
  }

  if (resumes.length === 0) return null

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
      <div className="flex items-center gap-2 mb-5">
        <BarChart3 className="w-5 h-5 text-purple-500" />
        <h2 className="text-lg font-semibold text-gray-900">Resume Score History</h2>
      </div>

      <div className="space-y-3">
        {resumes.map((resume) => {
          const entry = expanded[resume.id]
          const isOpen = !!entry

          return (
            <div key={resume.id} className="rounded-xl border border-gray-100 overflow-hidden">
              {/* Resume header — click to expand */}
              <button
                onClick={() => toggle(resume)}
                className="w-full flex items-center justify-between px-4 py-3.5 hover:bg-gray-50 transition text-left"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-purple-50 flex items-center justify-center shrink-0">
                    <FileText className="w-4 h-4 text-purple-500" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {fileName(resume.fileUrl)}
                    </p>
                    <p className="text-xs text-gray-400">
                      Uploaded {new Date(resume.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {isOpen && !entry.loading && (
                    <span className="text-xs text-gray-400">
                      {entry.reports.length} {entry.reports.length === 1 ? "report" : "reports"}
                    </span>
                  )}
                  {isOpen ? (
                    <ChevronDown className="w-4 h-4 text-gray-400" />
                  ) : (
                    <ChevronRight className="w-4 h-4 text-gray-400" />
                  )}
                </div>
              </button>

              {/* Expanded — score cards */}
              {isOpen && (
                <div className="border-t border-gray-50 bg-gray-50/50 px-4 py-3">
                  {entry.loading ? (
                    <div className="flex justify-center py-4">
                      <Loader2 className="w-4 h-4 animate-spin text-gray-300" />
                    </div>
                  ) : entry.reports.length === 0 ? (
                    <p className="text-xs text-gray-400 text-center py-4">
                      No reports yet for this resume.
                    </p>
                  ) : (
                    <div className="space-y-3">
                      {entry.reports.map((report) => (
                        <div
                          key={report.id}
                          onClick={() => {
                            if (report.status === "COMPLETED") {
                              router.push(`/ats/report/${report.id}`)
                            }
                          }}
                          className={`rounded-xl bg-white border border-gray-100 p-4 ${
                            report.status === "COMPLETED"
                              ? "cursor-pointer hover:border-purple-200 hover:shadow-sm transition"
                              : "opacity-60"
                          }`}
                        >
                          <div className="flex items-center justify-between mb-3">
                            <div>
                              <p className="text-sm font-medium text-gray-900">
                                {report.jobTitle || "General Analysis"}
                              </p>
                              <p className="text-xs text-gray-400">
                                {new Date(report.createdAt).toLocaleDateString()}
                              </p>
                            </div>
                            {report.status === "COMPLETED" && report.atsScore != null ? (
                              <div className="text-right">
                                <span className={`text-2xl font-bold ${scoreColor(report.atsScore)}`}>
                                  {report.atsScore}
                                </span>
                                <span className="text-xs text-gray-400 ml-0.5">/100</span>
                              </div>
                            ) : report.status === "PROCESSING" ? (
                              <Loader2 className="w-4 h-4 animate-spin text-purple-400" />
                            ) : (
                              <span className="text-xs text-red-500 font-medium">Failed</span>
                            )}
                          </div>

                          {/* Mini dimension bars */}
                          {report.status === "COMPLETED" && report.keywordMatchScore != null && (
                            <div className="space-y-1.5 pt-1 border-t border-gray-50">
                              <DimBar label="Keywords"   value={report.keywordMatchScore} />
                              <DimBar label="Semantic"    value={report.semanticScore} />
                              <DimBar label="Skills"      value={report.skillsCoverageScore} />
                              <DimBar label="Experience"  value={report.experienceScore} />
                              <DimBar label="Education"   value={report.educationScore} />
                              <DimBar label="Format"      value={report.formatScore} />
                              <DimBar label="Industry"    value={report.industryScore} />
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
