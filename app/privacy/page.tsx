import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default function PrivacyPolicy() {
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
            Privacy Policy
          </h1>
          <p className="text-sm text-gray-500">
            Last updated: April 2026
          </p>
          <p className="text-sm text-gray-500 mt-3 leading-relaxed">
            At Placr, your privacy is fundamental to everything we build. This policy explains what data we collect,
            how we use it, and the choices you have. We believe in transparency — no surprises, no fine print tricks.
          </p>
        </div>

        {/* Content */}
        <div className="space-y-6">

          <div className="bg-white rounded-2xl border border-gray-200 p-8">
            <div className="flex items-start gap-4">
              <span className="shrink-0 w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-sm font-bold text-gray-500">1</span>
              <div>
                <h2 className="text-base font-bold text-gray-900 mb-2">Information We Collect</h2>
                <p className="text-sm text-gray-600 leading-relaxed mb-3">
                  We collect only what is necessary to provide our services:
                </p>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-purple-500 mt-1.5 shrink-0"></span>
                    <span><strong className="text-gray-900">Account data</strong> — Name, email address, roll number, and year provided during sign-up via your KIIT Google account.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-purple-500 mt-1.5 shrink-0"></span>
                    <span><strong className="text-gray-900">Uploaded content</strong> — Resumes (PDF/DOCX) and job descriptions you submit for analysis.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-purple-500 mt-1.5 shrink-0"></span>
                    <span><strong className="text-gray-900">Generated reports</strong> — ATS scores, dimension breakdowns, and AI feedback produced by our system.</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 p-8">
            <div className="flex items-start gap-4">
              <span className="shrink-0 w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-sm font-bold text-gray-500">2</span>
              <div>
                <h2 className="text-base font-bold text-gray-900 mb-2">How We Use Your Data</h2>
                <p className="text-sm text-gray-600 leading-relaxed mb-3">
                  Your data powers the features you use and nothing else:
                </p>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-purple-500 mt-1.5 shrink-0"></span>
                    <span>Analyzing resumes and generating ATS compatibility reports.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-purple-500 mt-1.5 shrink-0"></span>
                    <span>Personalizing AI interview prep and job matching.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-purple-500 mt-1.5 shrink-0"></span>
                    <span>Authenticating your account and maintaining your session.</span>
                  </li>
                </ul>
                <div className="mt-4 bg-gray-50 border border-gray-100 rounded-xl p-4">
                  <p className="text-xs text-gray-500 leading-relaxed">
                    We do not sell, rent, or share your personal data with third parties for marketing or advertising. Period.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 p-8">
            <div className="flex items-start gap-4">
              <span className="shrink-0 w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-sm font-bold text-gray-500">3</span>
              <div>
                <h2 className="text-base font-bold text-gray-900 mb-2">Security</h2>
                <p className="text-sm text-gray-600 leading-relaxed">
                  All data is transmitted over HTTPS and stored on encrypted servers. Authentication uses httpOnly, secure cookies
                  with JWT-based token management. Resumes and reports are isolated per account — no user can access another&apos;s data.
                  We follow industry-standard practices to protect your information at every layer.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 p-8">
            <div className="flex items-start gap-4">
              <span className="shrink-0 w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-sm font-bold text-gray-500">4</span>
              <div>
                <h2 className="text-base font-bold text-gray-900 mb-2">Data Retention & Deletion</h2>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Your data is retained as long as your account is active. You may request complete deletion of your
                  account and all associated data at any time by emailing{" "}
                  <a href="mailto:shabbirud01@gmail.com" className="text-purple-600 font-medium hover:underline">
                    shabbirud01@gmail.com
                  </a>.
                  We will process deletion requests within 7 business days.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 p-8">
            <div className="flex items-start gap-4">
              <span className="shrink-0 w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-sm font-bold text-gray-500">5</span>
              <div>
                <h2 className="text-base font-bold text-gray-900 mb-2">Cookies</h2>
                <p className="text-sm text-gray-600 leading-relaxed">
                  We use strictly essential cookies for authentication — access tokens, refresh tokens, and session tokens.
                  All auth cookies are httpOnly and secure. We do not use analytics, tracking, or advertising cookies of any kind.
                </p>
              </div>
            </div>
          </div>

        </div>

        {/* Contact card */}
        <div className="mt-8 bg-gray-900 rounded-2xl p-8 text-center">
          <h3 className="text-base font-bold text-white mb-2">Questions about your privacy?</h3>
          <p className="text-sm text-gray-400 mb-5">
            We&apos;re happy to help with any privacy-related questions or data requests.
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
