"use client"

import Link from "next/link"

const links = {
  Product: [
    { label: "ATS Checker", href: "/ats" },
    { label: "Interview Prep", href: "/interview" },
    { label: "Job Informer", href: "/jobs" },
    { label: "Pricing", href: "/#pricing" },
  ],
  Company: [
    { label: "About Placr", href: "/#about" },
    { label: "Contact", href: "mailto:shabbirud01@gmail.com" },
  ],
  Legal: [
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms of Service", href: "/terms" },
  ],
}

export default function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-white">
      <div className="max-w-6xl mx-auto px-4 py-12 md:py-16">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          {/* Brand */}
          <div className="col-span-2">
            <Link href="/" className="text-2xl font-bold text-gray-900">
              Placr.
            </Link>
            <p className="mt-3 text-sm text-gray-500 max-w-xs leading-relaxed">
              AI-powered career tools built exclusively for KIIT students. Resume scoring, interview prep, and job matching in one platform.
            </p>
          </div>

          {/* Link columns */}
          {Object.entries(links).map(([title, items]) => (
            <div key={title}>
              <h4 className="text-sm font-semibold text-gray-900 mb-3">{title}</h4>
              <ul className="space-y-2">
                {items.map((item) => (
                  <li key={item.label}>
                    <Link
                      href={item.href}
                      className="text-sm text-gray-500 hover:text-gray-900 transition"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-6 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-gray-400">
            &copy; {new Date().getFullYear()} Placr. Built at KIIT University.
          </p>
          <p className="text-xs text-gray-400">
            Made with care for students who want more.
          </p>
        </div>
      </div>
    </footer>
  )
}
