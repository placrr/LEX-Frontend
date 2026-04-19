import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { verifyAccessToken } from "@/lib/tokens"
import { prisma } from "@/lib/prisma"
import DashboardClient from "./DashboardClient"

export default async function DashboardPage() {
  const cookieStore = await cookies()
  const token = cookieStore.get("accessToken")?.value

  if (!token) redirect("/login")

  let userId: string
  try {
    const payload = verifyAccessToken(token)
    userId = payload.userId
  } catch {
    redirect("/login")
  }

  // Fetch everything in parallel
  const [user, resumes, recentReports, stats] = await Promise.all([
    prisma.user.findUnique({
      where: { id: userId },
      select: {
        name: true,
        email: true,
        rollNo: true,
        year: true,
        plan: true,
        createdAt: true,
      },
    }),
    prisma.resume.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: 5,
      select: {
        id: true,
        fileUrl: true,
        createdAt: true,
        _count: { select: { atsReports: true } },
      },
    }),
    prisma.aTSReport.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: 6,
      select: {
        id: true,
        jobTitle: true,
        atsScore: true,
        status: true,
        createdAt: true,
        keywordMatchScore: true,
        semanticScore: true,
        skillsCoverageScore: true,
        experienceScore: true,
        educationScore: true,
        formatScore: true,
      },
    }),
    prisma.aTSReport.aggregate({
      where: { userId, status: "COMPLETED" },
      _avg: { atsScore: true },
      _max: { atsScore: true },
      _count: true,
    }),
  ])

  if (!user) redirect("/login")

  const totalReports = await prisma.aTSReport.count({ where: { userId } })
  const planLimit = user.plan === "PRO" ? 100 : user.plan === "FREE" ? 6 : 1000

  return (
    <DashboardClient
      user={{
        name: user.name,
        email: user.email,
        rollNo: user.rollNo,
        year: user.year,
        plan: user.plan,
        joinedAt: user.createdAt.toISOString(),
      }}
      resumes={resumes.map((r) => ({
        id: r.id,
        fileName: r.fileUrl.replace("uploaded://", ""),
        createdAt: r.createdAt.toISOString(),
        reportCount: r._count.atsReports,
      }))}
      recentReports={recentReports.map((r) => ({
        id: r.id,
        jobTitle: r.jobTitle,
        atsScore: r.atsScore,
        status: r.status,
        createdAt: r.createdAt.toISOString(),
        dimensions: {
          keywordMatch: r.keywordMatchScore,
          semantic: r.semanticScore,
          skills: r.skillsCoverageScore,
          experience: r.experienceScore,
          education: r.educationScore,
          format: r.formatScore,
        },
      }))}
      stats={{
        totalScans: totalReports,
        avgScore: Math.round(stats._avg.atsScore ?? 0),
        bestScore: stats._max.atsScore ?? 0,
        completedScans: stats._count,
        planLimit,
        resumeCount: resumes.length,
      }}
    />
  )
}
