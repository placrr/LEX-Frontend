"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { useRouter } from "next/navigation"
import { FileSearch, Upload, Loader2, Trash2, ChevronRight, RefreshCw, AlertTriangle } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { motion, AnimatePresence } from "framer-motion"
import { FileText } from "lucide-react"

// ─── Gateway-prefixed paths (BFF proxy → gateway → ATS backend) ──────────────
const API = {
  resumeUpload:  "/api/gateway/resume/api/v1/resume/upload",
  resumeList:    "/api/gateway/resume/api/v1/resume/list",
  scoreAnalyze:  "/api/gateway/ats/api/v1/score/analyze",
  scoreList:     "/api/gateway/ats/api/v1/score",
  scoreUsage:    "/api/gateway/ats/api/v1/score/usage",
  scoreDetail:   (id: string) => `/api/gateway/ats/api/v1/score/${id}`,
  scoreStatus:   (id: string) => `/api/gateway/ats/api/v1/score/${id}/status`,
}

// ─── Types (matching ATS_BACKEND responses) ──────────────────────────────────

interface ResumeUploadRes {
  message: string
  resume: { id: string; createdAt: string }
}

interface AnalyzeRes {
  message: string
  reportId: string
  status: "PROCESSING"
  disclaimer: string
}

interface ReportSummary {
  id: string
  resumeId: string
  jobTitle: string | null
  atsScore: number | null
  status: "PROCESSING" | "COMPLETED" | "FAILED"
  createdAt: string
  resume?: { id: string; fileUrl: string }
}

interface StatusRes {
  id: string
  status: "PROCESSING" | "COMPLETED" | "FAILED"
  atsScore: number | null
}

interface UsageRes {
  plan: string
  limit: number
  used: number
  remaining: number
}

interface PaginationRes {
  reports: ReportSummary[]
  pagination: { page: number; limit: number; total: number; totalPages: number }
}

export default function ATSPage() {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [file, setFile] = useState<File | null>(null)
  const [jobTitle, setJobTitle] = useState("")
  const [jobDescription, setJobDescription] = useState("")
  const [uploading, setUploading] = useState(false)
  const [analyzing, setAnalyzing] = useState(false)
  const [error, setError] = useState("")

  const [reports, setReports] = useState<ReportSummary[]>([])
  const [loadingReports, setLoadingReports] = useState(true)
  const hasLoaded = useRef(false)
  const [pollingIds, setPollingIds] = useState<Set<string>>(new Set())
  const [usage, setUsage] = useState<UsageRes | null>(null)

  // ─── Load report history ────────────────────────────────────────────────────

  const loadReports = useCallback(async (showLoading = true) => {
    if (showLoading && !hasLoaded.current) setLoadingReports(true)
    try {
      const [reportsRes, usageRes] = await Promise.all([
        fetch(`${API.scoreList}?page=1&limit=20`),
        fetch(API.scoreUsage),
      ])

      if (reportsRes.ok) {
        const data: PaginationRes = await reportsRes.json()
        setReports(data.reports)

        const processing = data.reports
          .filter((r) => r.status === "PROCESSING")
          .map((r) => r.id)
        if (processing.length > 0) {
          setPollingIds(new Set(processing))
        }
      }

      if (usageRes.ok) {
        setUsage(await usageRes.json())
      }
    } catch {
      // silent
    } finally {
      setLoadingReports(false)
      hasLoaded.current = true
    }
  }, [])

  useEffect(() => {
    loadReports()
  }, [loadReports])

  // ─── Poll PROCESSING reports ────────────────────────────────────────────────

  useEffect(() => {
    if (pollingIds.size === 0) return

    const interval = setInterval(async () => {
      const updates = await Promise.all(
        Array.from(pollingIds).map(async (id) => {
          try {
            const res = await fetch(API.scoreStatus(id))
            if (res.ok) return (await res.json()) as StatusRes
          } catch {}
          return null
        })
      )

      const finishedIds = new Set<string>()

      setReports((prev) =>
        prev.map((r) => {
          const update = updates.find((u) => u?.id === r.id)
          if (update && update.status !== "PROCESSING") {
            finishedIds.add(r.id)
            return { ...r, status: update.status, atsScore: update.atsScore }
          }
          return r
        })
      )

      if (finishedIds.size > 0) {
        setPollingIds((prev) => {
          const next = new Set(prev)
          finishedIds.forEach((id) => next.delete(id))
          return next
        })
      }
    }, 6000)

    return () => clearInterval(interval)
  }, [pollingIds])

  // ─── Upload & Analyze ───────────────────────────────────────────────────────

  const limitReached = usage !== null && usage.remaining <= 0

  async function handleUploadAndAnalyze() {
    if (limitReached) {
      toast.error(`You've used all ${usage!.limit} scans on the ${usage!.plan} plan. Upgrade to continue.`)
      return
    }
    if (!file) {
      toast.error("Please upload a resume.")
      return
    }
    if (!jobTitle.trim()) {
      toast.error("Job title is required for accurate ATS scoring.")
      return
    }
    if (!jobDescription.trim()) {
      toast.error("Job description is required for accurate ATS scoring.")
      return
    }

    setError("")
    setUploading(true)

    try {
      // Step 1 — Upload resume
      const formData = new FormData()
      formData.append("resume", file)

      const uploadRes = await fetch(API.resumeUpload, {
        method: "POST",
        body: formData,
      })

      if (!uploadRes.ok) {
        const data = await uploadRes.json().catch(() => ({}))
        throw new Error(data.error || "Upload failed")
      }

      const { resume }: ResumeUploadRes = await uploadRes.json()
      setUploading(false)
      setAnalyzing(true)

      // Step 2 — Kick off analysis (returns 202)
      const analyzeRes = await fetch(API.scoreAnalyze, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          resumeId: resume.id,
          jobTitle: jobTitle.trim(),
          jobDescription: jobDescription.trim(),
        }),
      })

      if (!analyzeRes.ok) {
        const data = await analyzeRes.json().catch(() => ({} as any))
        if (data.code === "PLAN_LIMIT_REACHED") {
          setUsage({ plan: data.plan, limit: data.limit, used: data.used, remaining: 0 })
        }
        throw new Error(data.error || "Analysis failed")
      }

      const { reportId }: AnalyzeRes = await analyzeRes.json()

      // Add PROCESSING report to list and start polling
      const newReport: ReportSummary = {
        id: reportId,
        resumeId: resume.id,
        jobTitle: jobTitle.trim() || null,
        atsScore: null,
        status: "PROCESSING",
        createdAt: new Date().toISOString(),
      }

      setReports((prev) => [newReport, ...prev])
      setPollingIds((prev) => new Set(prev).add(reportId))
      toast.success("Analysis started! Your report will be ready in ~90 seconds.")

      // Update usage count
      if (usage) setUsage({ ...usage, used: usage.used + 1, remaining: usage.remaining - 1 })

      // Reset form
      setFile(null)
      setJobTitle("")
      setJobDescription("")
      if (fileInputRef.current) fileInputRef.current.value = ""
    } catch (err: any) {
      toast.error(err.message || "Something went wrong")
    } finally {
      setUploading(false)
      setAnalyzing(false)
    }
  }

  // ─── Score color ────────────────────────────────────────────────────────────

  function scoreColor(score: number) {
    if (score >= 85) return "text-green-600"
    if (score >= 70) return "text-purple-600"
    if (score >= 55) return "text-yellow-600"
    return "text-red-500"
  }

  // ─── UI ─────────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-[#F9F7F3]">
      <div className="max-w-5xl mx-auto px-4 py-12">

        {/* Header */}
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-pink-500 to-purple-500 flex items-center justify-center">
              <FileSearch className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">ATS Resume Checker</h1>
          </div>
          <p className="text-gray-600 max-w-xl">
            Upload your resume and paste the job description. Our AI analyzes ATS compatibility, keyword matches, and gives actionable recommendations.
          </p>

          {/* Usage badge */}
          {usage && (
            <div className="mt-3 flex items-center gap-3">
              <span className="text-xs font-medium text-gray-500">
                {usage.plan} plan — {usage.remaining}/{usage.limit} scans remaining
              </span>
              {usage.remaining <= 2 && usage.remaining > 0 && (
                <span className="text-xs text-yellow-600 font-medium">Almost at limit</span>
              )}
            </div>
          )}
        </div>

        {/* Plan limit alert */}
        {limitReached && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-2xl p-5 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-red-500 mt-0.5 shrink-0" />
            <div>
              <p className="text-sm font-semibold text-red-800">
                {usage!.plan} plan limit reached ({usage!.limit} scans used)
              </p>
              <p className="text-sm text-red-600 mt-1">
                Upgrade to PRO for 100 scans or contact us for Enterprise access.
              </p>
              <a href="/#pricing" className="inline-block mt-2 text-sm font-medium text-red-700 underline hover:text-red-900">
                View pricing plans
              </a>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">

          {/* ── Left: Upload Form ── */}
          <div className="lg:col-span-3">
            <div className={`bg-white rounded-2xl shadow-sm border p-6 space-y-5 transition ${limitReached ? "border-red-200 opacity-60 pointer-events-none select-none" : "border-gray-100"}`}>

              {limitReached && (
                <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
                  <AlertTriangle className="w-4 h-4 text-red-500 shrink-0" />
                  <span className="text-sm text-red-700 font-medium">Plan limit reached. Upgrade to continue scanning.</span>
                </div>
              )}

              {/* File Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Resume (PDF or DOCX)
                </label>
                <div
                  onClick={() => !limitReached && fileInputRef.current?.click()}
                  className={`border-2 border-dashed rounded-xl p-6 text-center transition ${limitReached ? "border-red-200 bg-red-50/30 cursor-not-allowed" : "border-gray-200 cursor-pointer hover:border-purple-300 hover:bg-purple-50/30"}`}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf,.docx"
                    className="hidden"
                    disabled={limitReached}
                    onChange={(e) => setFile(e.target.files?.[0] || null)}
                  />
                  {file ? (
                    <div className="flex items-center justify-center gap-2 text-sm text-gray-800">
                      <FileSearch className="w-4 h-4 text-purple-500" />
                      {file.name}
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          setFile(null)
                          if (fileInputRef.current) fileInputRef.current.value = ""
                        }}
                        className="text-red-400 hover:text-red-600 ml-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-2">
                      <Upload className="w-8 h-8 text-gray-300" />
                      <span className="text-sm text-gray-500">Click to upload your resume</span>
                      <span className="text-xs text-gray-400">PDF or DOCX, max 5 MB</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Job Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Job Title <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                  placeholder="e.g. Software Engineer"
                  disabled={limitReached}
                  className={`w-full border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-purple-300 focus:border-transparent transition ${limitReached ? "border-red-200 bg-red-50/30 cursor-not-allowed" : "border-gray-200"}`}
                />
              </div>

              {/* Job Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Job Description <span className="text-red-400">*</span>
                </label>
                <textarea
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  placeholder="Paste the full job description here..."
                  rows={6}
                  disabled={limitReached}
                  className={`w-full border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-purple-300 focus:border-transparent transition resize-none ${limitReached ? "border-red-200 bg-red-50/30 cursor-not-allowed" : "border-gray-200"}`}
                />
              </div>

              {/* Error */}
              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    className="text-sm text-red-500 bg-red-50 rounded-lg px-4 py-2"
                  >
                    {error}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Submit */}
              <Button
                onClick={handleUploadAndAnalyze}
                disabled={uploading || analyzing || limitReached}
                className="w-full bg-gray-900 hover:bg-gray-800 text-white rounded-xl py-3 text-sm font-medium disabled:opacity-60 cursor-pointer disabled:cursor-not-allowed"
              >
                {limitReached ? (
                  "Plan limit reached — Upgrade"
                ) : uploading ? (
                  <span className="flex items-center gap-2"><Loader2 className="w-4 h-4 animate-spin" /> Uploading...</span>
                ) : analyzing ? (
                  <span className="flex items-center gap-2"><Loader2 className="w-4 h-4 animate-spin" /> Starting analysis...</span>
                ) : (
                  "Analyze Resume"
                )}
              </Button>
            </div>
          </div>

          {/* ── Right: Report History ── */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Reports</h2>
                <button onClick={() => loadReports(false)} className="text-gray-400 hover:text-gray-600 transition">
                  <RefreshCw className="w-4 h-4" />
                </button>
              </div>

              {loadingReports ? (
                <div className="flex flex-col items-center gap-3 py-10">
                  <div className="flex gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-purple-400 animate-bounce" style={{ animationDelay: "0ms" }} />
                    <span className="w-2 h-2 rounded-full bg-purple-400 animate-bounce" style={{ animationDelay: "150ms" }} />
                    <span className="w-2 h-2 rounded-full bg-purple-400 animate-bounce" style={{ animationDelay: "300ms" }} />
                  </div>
                  <p className="text-xs text-gray-400">Loading reports...</p>
                </div>
              ) : reports.length === 0 ? (
                <p className="text-sm text-gray-400 text-center py-8">
                  No reports yet. Analyze a resume to get started.
                </p>
              ) : (
                <div className="space-y-3 max-h-[480px] overflow-y-auto [&::-webkit-scrollbar]:w-[3px] [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-transparent [&::-webkit-scrollbar-track]:bg-transparent hover:[&::-webkit-scrollbar-thumb]:bg-gray-300/50" style={{ scrollbarGutter: "stable" }}>
                  {reports.map((report) => (
                    <button
                      key={report.id}
                      onClick={() => {
                        if (report.status === "COMPLETED") {
                          router.push(`/ats/report/${report.id}`)
                        }
                      }}
                      disabled={report.status !== "COMPLETED"}
                      className={`w-full text-left px-4 py-3 rounded-xl border transition ${
                        report.status === "COMPLETED"
                          ? "border-gray-100 hover:bg-gray-50 cursor-pointer"
                          : report.status === "PROCESSING"
                          ? "border-purple-200 bg-purple-50/50 cursor-default animate-pulse"
                          : "border-red-100 bg-red-50/30 cursor-default"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="min-w-0 flex-1">
                          <div className={`text-sm font-medium ${report.status === "FAILED" ? "text-gray-400" : "text-gray-900"}`}>
                            {report.jobTitle || "General Analysis"}
                          </div>
                          {report.resume?.fileUrl && (
                            <div className="flex items-center gap-1 mt-0.5">
                              <FileText className="w-3 h-3 text-purple-400 shrink-0" />
                              <span className="text-[11px] text-purple-500 font-medium truncate">
                                {report.resume.fileUrl.replace("uploaded://", "")}
                              </span>
                            </div>
                          )}
                          <div className="text-xs text-gray-400 mt-0.5">
                            {new Date(report.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          {report.status === "COMPLETED" && report.atsScore != null ? (
                            <span className={`text-lg font-bold ${scoreColor(report.atsScore)}`}>
                              {report.atsScore}%
                            </span>
                          ) : report.status === "PROCESSING" ? (
                            <div className="flex items-center gap-2">
                              <div className="flex gap-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-bounce" style={{ animationDelay: "0ms" }} />
                                <span className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-bounce" style={{ animationDelay: "150ms" }} />
                                <span className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-bounce" style={{ animationDelay: "300ms" }} />
                              </div>
                              <span className="text-xs font-medium text-purple-600">Analyzing</span>
                            </div>
                          ) : (
                            <span className="text-xs text-red-500 font-medium bg-red-50 px-2 py-0.5 rounded-full">Failed</span>
                          )}
                          {report.status === "COMPLETED" && (
                            <ChevronRight className="w-4 h-4 text-gray-300" />
                          )}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>


      </div>
    </div>
  )
}
