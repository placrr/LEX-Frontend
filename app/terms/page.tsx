import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default function TermsOfService() {
  return (
    <main className="min-h-screen bg-[#F9F7F3]">
      <div className="max-w-3xl mx-auto px-4 py-16 md:py-24">

        {/* Back link */}
        <Link href="/" className="inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-600 transition mb-10">
          <ArrowLeft className="w-3.5 h-3.5" /> Back to home
        </Link>

        {/* Header card */}
        <div className="bg-white rounded-2xl border border-gray-200 p-8 md:p-10 mb-8">
          <span className="inline-block text-xs font-semibold text-purple-600 bg-purple-50 border border-purple-200 rounded-full px-3 py-1 mb-4">
            Legal
          </span>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight mb-2">
            Terms of Service
          </h1>
          <p className="text-sm text-gray-500">
            Last updated: April 2026
          </p>
          <p className="text-sm text-gray-500 mt-3 leading-relaxed">
            These terms govern your use of Placr. By creating an account or using our services, you agree to
            everything outlined below. Please read them carefully.
          </p>
        </div>

        {/* Content */}
        <div className="space-y-6">

          <div className="bg-white rounded-2xl border border-gray-200 p-8">
            <div className="flex items-start gap-4">
              <span className="shrink-0 w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-sm font-bold text-gray-500">1</span>
              <div>
                <h2 className="text-base font-bold text-gray-900 mb-2">Eligibility</h2>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Placr is available exclusively to students with a valid <strong className="text-gray-900">@kiit.ac.in</strong> email address.
                  By signing up, you confirm that you are a current student at KIIT University and that the information
                  you provide (name, roll number, year) is accurate.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 p-8">
            <div className="flex items-start gap-4">
              <span className="shrink-0 w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-sm font-bold text-gray-500">2</span>
              <div>
                <h2 className="text-base font-bold text-gray-900 mb-2">Acceptable Use</h2>
                <p className="text-sm text-gray-600 leading-relaxed mb-3">
                  You agree to use Placr for personal career development only. The following are prohibited:
                </p>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-400 mt-1.5 shrink-0"></span>
                    <span>Reverse-engineering, scraping, or attempting to extract data from the platform.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-400 mt-1.5 shrink-0"></span>
                    <span>Sharing your account credentials or allowing unauthorized access.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-400 mt-1.5 shrink-0"></span>
                    <span>Uploading malicious content, spam, or content that violates the rights of others.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-400 mt-1.5 shrink-0"></span>
                    <span>Attempting to disrupt, overload, or interfere with Placr&apos;s infrastructure.</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 p-8">
            <div className="flex items-start gap-4">
              <span className="shrink-0 w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-sm font-bold text-gray-500">3</span>
              <div>
                <h2 className="text-base font-bold text-gray-900 mb-2">Your Content</h2>
                <p className="text-sm text-gray-600 leading-relaxed">
                  You retain full ownership of everything you upload — resumes, job descriptions, and any other content.
                  By uploading, you grant Placr a limited, non-transferable license to process your content solely for
                  the purpose of delivering our services (ATS analysis, interview prep, job matching).
                  We do not claim ownership, redistribute, or use your content for any other purpose.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 p-8">
            <div className="flex items-start gap-4">
              <span className="shrink-0 w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-sm font-bold text-gray-500">4</span>
              <div>
                <h2 className="text-base font-bold text-gray-900 mb-2">Account Security</h2>
                <p className="text-sm text-gray-600 leading-relaxed">
                  You are responsible for maintaining the security of your account. Each student is allowed one account.
                  If you suspect unauthorized access, contact us immediately. Placr reserves the right to suspend or terminate
                  accounts that violate these terms.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 p-8">
            <div className="flex items-start gap-4">
              <span className="shrink-0 w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-sm font-bold text-gray-500">5</span>
              <div>
                <h2 className="text-base font-bold text-gray-900 mb-2">Plans & Limits</h2>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Free and Pro plans include scan limits as described on our pricing section. Once you reach your limit,
                  an upgrade is required to continue scanning. We reserve the right to modify plan features and pricing
                  with reasonable advance notice to active users.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 p-8">
            <div className="flex items-start gap-4">
              <span className="shrink-0 w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-sm font-bold text-gray-500">6</span>
              <div>
                <h2 className="text-base font-bold text-gray-900 mb-2">Disclaimer</h2>
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                  <p className="text-sm text-amber-900 leading-relaxed">
                    Placr provides AI-generated analysis and suggestions. ATS scores, keyword recommendations, and interview
                    feedback are approximations designed to help you improve they are not guarantees of hiring outcomes.
                    Always use your own judgement when making career decisions.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 p-8">
            <div className="flex items-start gap-4">
              <span className="shrink-0 w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-sm font-bold text-gray-500">7</span>
              <div>
                <h2 className="text-base font-bold text-gray-900 mb-2">Changes to Terms</h2>
                <p className="text-sm text-gray-600 leading-relaxed">
                  We may update these terms from time to time. When we do, we will update the &quot;Last updated&quot; date at the top.
                  Continued use of Placr after changes constitutes acceptance of the revised terms.
                </p>
              </div>
            </div>
          </div>

        </div>

        {/* Contact card */}
        <div className="mt-8 bg-gray-900 rounded-2xl p-8 text-center">
          <h3 className="text-base font-bold text-white mb-2">Have questions about these terms?</h3>
          <p className="text-sm text-gray-400 mb-5">
            We&apos;re here to clarify anything. Reach out anytime.
          </p>
          <a
            href="mailto:shabbirud01@gmail.com"
            className="inline-block bg-white text-gray-900 text-sm font-semibold px-6 py-2.5 rounded-full hover:bg-gray-100 transition"
          >
            Contact Us
          </a>
        </div>

      </div>
    </main>
  )
}
