/**
 * lib/api.ts
 *
 * Server-side client for placr-gateway (default: http://localhost:4000).
 *
 * Can ONLY be imported in Server Components, Route Handlers, and Server Actions
 * because it reads HTTP-only cookies via next/headers.
 *
 * For client components, use the BFF proxy at /api/gateway/[...path] instead.
 *
 * Environment variables:
 *   GATEWAY_URL          – gateway base URL (default http://localhost:4000)
 *   NEXT_PUBLIC_APP_URL  – this Next.js app (default http://localhost:3000)
 *
 * ATS_BACKEND endpoints (via gateway):
 *   Resume:  POST /resume/api/v1/resume/upload
 *            GET  /resume/api/v1/resume/list
 *            GET  /resume/api/v1/resume/:id
 *            DEL  /resume/api/v1/resume/:id
 *   Score:   POST /ats/api/v1/score/analyze       → 202 { reportId, status }
 *            GET  /ats/api/v1/score                → paginated reports
 *            GET  /ats/api/v1/score/:id            → full report
 *            GET  /ats/api/v1/score/:id/status     → lightweight poll
 *   Chat:    POST /ats/api/v1/chat/:reportId
 *            GET  /ats/api/v1/chat/:reportId
 */

import { cookies } from "next/headers"

const GATEWAY_URL = process.env.GATEWAY_URL ?? "http://localhost:4000"
const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"

// ─── Response types (match ATS_BACKEND responses) ─────────────────────────────

export type ATSStatus = "PROCESSING" | "COMPLETED" | "FAILED"
export type ChatRole  = "USER" | "ASSISTANT"
export type Plan      = "FREE" | "PRO"
export type Role      = "USER" | "ADMIN"

export interface ResumeUploadRes {
  message: string
  resume: { id: string; createdAt: string }
}

export interface Resume {
  id:        string
  fileUrl:   string
  hash:      string
  createdAt: string
  updatedAt: string
}

export interface ResumeDetail {
  id:        string
  text:      string
  fileUrl:   string
  createdAt: string
}

export interface AnalyzeRes {
  message:    string
  reportId:   string
  status:     "PROCESSING"
  disclaimer: string
}

export interface KeywordMatch {
  keyword:     string
  requirement: "required" | "preferred"
  matchType:   "exact" | "partial" | "listed_only" | "not_found"
  matchWeight: number
  evidence:    string | null
}

export interface Penalty { reason: string; points: number }
export interface Bonus   { reason: string; points: number }

export interface ScoreBreakdown {
  rawScore:       number
  totalPenalties: number
  totalBonuses:   number
  finalScore:     number
}

export interface ATSReport {
  id:              string
  userId:          string
  resumeId:        string
  status:          ATSStatus
  atsScore:        number | null
  jobTitle:        string | null
  jobDescription:  string | null
  strengths:       string[]
  improvements:    string[]
  recommendations: string[]
  keywordsFound:   string[]
  suggestedKeywords: string[]
  keywordMatchScore:   number | null
  semanticScore:       number | null
  skillsCoverageScore: number | null
  experienceScore:     number | null
  educationScore:      number | null
  formatScore:         number | null
  keywordMatches: KeywordMatch[] | null
  penalties:      Penalty[] | null
  bonuses:        Bonus[] | null
  scoreBreakdown: ScoreBreakdown | null
  domainMatch:    string | null
  resume:  { id: string; fileUrl: string }
  createdAt: string
  updatedAt: string
}

export interface ReportListRes {
  reports: ATSReport[]
  pagination: { page: number; limit: number; total: number; totalPages: number }
}

export interface StatusRes {
  id:       string
  status:   ATSStatus
  atsScore: number | null
}

export interface ATSChat {
  id:        string
  role:      ChatRole
  message:   string
  createdAt: string
}

export interface ChatSendRes {
  userMessage:      string
  assistantMessage: string
  chatId:           string
}

export interface ChatHistoryRes {
  messages: ATSChat[]
}

// ─── Error class ──────────────────────────────────────────────────────────────

export class GatewayError extends Error {
  constructor(message: string, public readonly status: number) {
    super(message)
    this.name = "GatewayError"
  }

  get isUnauthorized() { return this.status === 401 }
  get isRateLimited()  { return this.status === 429 }
}

// ─── Internal helpers ─────────────────────────────────────────────────────────

async function getToken(): Promise<string | null> {
  const store = await cookies()
  return store.get("accessToken")?.value ?? null
}

async function silentRefresh(): Promise<boolean> {
  try {
    const res = await fetch(`${APP_URL}/api/auth/refresh`, {
      method: "POST",
      cache:  "no-store",
    })
    return res.ok
  } catch {
    return false
  }
}

async function gatewayFetch(
  path:    string,
  init:    RequestInit = {},
  isRetry: boolean     = false,
): Promise<Response> {
  const token = await getToken()

  const headers: Record<string, string> = {
    ...(init.headers as Record<string, string> | undefined),
  }

  if (!(init.body instanceof FormData)) {
    headers["Content-Type"] = "application/json"
  }

  if (token) {
    headers["Authorization"] = `Bearer ${token}`
  }

  const res = await fetch(`${GATEWAY_URL}${path}`, {
    ...init,
    headers,
    cache: "no-store",
  })

  if (res.status === 401 && !isRetry) {
    const refreshed = await silentRefresh()
    if (refreshed) {
      return gatewayFetch(path, init, true)
    }
  }

  return res
}

async function gatewayJSON<T>(path: string, init: RequestInit = {}): Promise<T> {
  const res = await gatewayFetch(path, init)

  if (!res.ok) {
    const body = await res.json().catch(() => ({ error: `HTTP ${res.status}` }))
    throw new GatewayError(body.error ?? `HTTP ${res.status}`, res.status)
  }

  return res.json() as Promise<T>
}

// ─── Resume API  (gateway: /resume/api/v1/resume/*) ──────────────────────────

export const resumeApi = {
  /**
   * Upload a resume file (PDF / DOCX, max 5 MB).
   * FormData key must be "resume".
   */
  upload(formData: FormData): Promise<ResumeUploadRes> {
    return gatewayJSON<ResumeUploadRes>("/resume/api/v1/resume/upload", {
      method: "POST",
      body:   formData,
    })
  },

  /** List all resumes for the authenticated user. */
  list(): Promise<{ resumes: Resume[] }> {
    return gatewayJSON<{ resumes: Resume[] }>("/resume/api/v1/resume/list")
  },

  /** Fetch a single resume by ID (includes extracted text). */
  get(id: string): Promise<ResumeDetail> {
    return gatewayJSON<ResumeDetail>(`/resume/api/v1/resume/${id}`)
  },

  /** Delete a resume (cascades to reports + chats). */
  delete(id: string): Promise<{ message: string }> {
    return gatewayJSON<{ message: string }>(`/resume/api/v1/resume/${id}`, {
      method: "DELETE",
    })
  },
}

// ─── Score / ATS API  (gateway: /ats/api/v1/score/*) ─────────────────────────

export const atsApi = {
  /**
   * Start ATS analysis (returns 202).
   * Poll `getStatus` until COMPLETED.
   */
  analyze(params: {
    resumeId:        string
    jobTitle?:       string | null
    jobDescription?: string | null
  }): Promise<AnalyzeRes> {
    return gatewayJSON<AnalyzeRes>("/ats/api/v1/score/analyze", {
      method: "POST",
      body:   JSON.stringify(params),
    })
  },

  /** Paginated report history. */
  listReports(page = 1, limit = 10): Promise<ReportListRes> {
    return gatewayJSON<ReportListRes>(`/ats/api/v1/score?page=${page}&limit=${limit}`)
  },

  /** Full report with all scores, keywords, penalties, bonuses. */
  getReport(id: string): Promise<{ report: ATSReport; disclaimer: string }> {
    return gatewayJSON<{ report: ATSReport; disclaimer: string }>(`/ats/api/v1/score/${id}`)
  },

  /** Lightweight status poll (id, status, atsScore). */
  getStatus(id: string): Promise<StatusRes> {
    return gatewayJSON<StatusRes>(`/ats/api/v1/score/${id}/status`)
  },
}

// ─── Chat API  (gateway: /ats/api/v1/chat/*) ─────────────────────────────────

export const chatApi = {
  /** Send a message (max 2000 chars). Returns AI reply. */
  send(reportId: string, message: string): Promise<ChatSendRes> {
    return gatewayJSON<ChatSendRes>(`/ats/api/v1/chat/${reportId}`, {
      method: "POST",
      body:   JSON.stringify({ message }),
    })
  },

  /** Full chat history for a report. */
  history(reportId: string): Promise<ChatHistoryRes> {
    return gatewayJSON<ChatHistoryRes>(`/ats/api/v1/chat/${reportId}`)
  },
}

// ─── Gateway health ───────────────────────────────────────────────────────────

export function gatewayHealth(): Promise<{ status: string; service: string; uptime: number }> {
  return gatewayJSON("/health")
}
