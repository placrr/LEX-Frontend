"use client"

import { motion } from "framer-motion"
import { Check } from "lucide-react"
import Link from "next/link"

const plans = [
  {
    name: "Free",
    price: "0",
    period: "forever",
    description: "Get started with essential tools to test the waters.",
    cta: "Get Started Free",
    href: "/coming-soon",
    popular: false,
    features: [
      "3 ATS resume scans",
      "Full 7-dimension scoring",
      "Keyword match analysis",
      "AI chat per report",
      "PDF & DOCX upload",
      "Score history",
    ],
  },
  {
    name: "Pro",
    price: "99",
    period: "/month",
    description: "Unlimited power for serious job seekers ready to land offers.",
    cta: "Upgrade to Pro",
    href: "/coming-soon",
    popular: true,
    features: [
      "100 ATS resume scans",
      "Everything in Free",
      "Priority AI processing",
      "AI Interview Prep (coming soon)",
      "Job Informer alerts (coming soon)",
      "Export reports as PDF",
      "Email support",
    ],
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "",
    description: "For placement cells, colleges, and bulk student onboarding.",
    cta: "Contact Us",
    href: "mailto:shabbirud01@gmail.com",
    popular: false,
    features: [
      "1000+ scans",
      "Everything in Pro",
      "Admin dashboard",
      "Bulk student upload",
      "Analytics & reporting",
      "Dedicated support",
      "Custom integrations",
    ],
  },
]

export default function PricingSection() {
  return (
    <section id="pricing" className="py-20 md:py-28 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }}
          className="text-center mb-14"
        >
          <span className="inline-block text-xs font-semibold text-green-600 bg-green-50 border border-green-200 rounded-full px-3 py-1 mb-4">
            Pricing
          </span>
          <h2 className="text-3xl md:text-5xl font-bold text-gray-900 tracking-tight">
            Simple, Student-Friendly Pricing
          </h2>
          <p className="mt-4 text-gray-500 max-w-md mx-auto text-sm md:text-base">
            Start free. Upgrade when you need more scans.
          </p>
        </motion.div>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 items-start">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.45, delay: i * 0.1 }}
              className={`relative rounded-2xl p-7 border transition-shadow duration-300 ${
                plan.popular
                  ? "bg-gray-900 text-white border-gray-800 shadow-xl shadow-gray-900/20 md:-mt-4 md:mb-[-16px]"
                  : "bg-white text-gray-900 border-gray-200 hover:shadow-lg"
              }`}
            >
              {plan.popular && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-[11px] font-semibold px-3 py-1 rounded-full">
                  Most Popular
                </span>
              )}

              <h3 className="text-lg font-bold mb-1">{plan.name}</h3>
              <p className={`text-sm mb-5 ${plan.popular ? "text-gray-400" : "text-gray-500"}`}>
                {plan.description}
              </p>

              {/* Price */}
              <div className="mb-6">
                {plan.price === "Custom" ? (
                  <span className="text-3xl font-bold">Custom</span>
                ) : (
                  <>
                    <span className="text-xs align-top">&#8377;</span>
                    <span className="text-4xl font-bold">{plan.price}</span>
                    <span className={`text-sm ml-1 ${plan.popular ? "text-gray-400" : "text-gray-500"}`}>
                      {plan.period}
                    </span>
                  </>
                )}
              </div>

              {/* Features */}
              <ul className="space-y-3 mb-7">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-sm">
                    <Check className={`w-4 h-4 mt-0.5 shrink-0 ${plan.popular ? "text-green-400" : "text-green-600"}`} />
                    <span className={plan.popular ? "text-gray-300" : "text-gray-600"}>{f}</span>
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <Link
                href={plan.href}
                className={`block w-full text-center py-3 rounded-xl text-sm font-semibold transition ${
                  plan.popular
                    ? "bg-white text-gray-900 hover:bg-gray-100"
                    : "bg-gray-100 text-gray-900 hover:bg-gray-200"
                }`}
              >
                {plan.cta}
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
