import { cookies } from "next/headers"
import Hero from "@/components/hero"
import Features from "@/components/Features"
import HowItWorks from "@/components/HowItWorks"
import PricingSection from "@/components/PricingSection"
import AboutSection from "@/components/AboutSection"
import CTABanner from "@/components/CTABanner"
import Footer from "@/components/Footer"

export default async function Home() {
  const cookieStore = await cookies()
  const loggedIn = !!(cookieStore.get("accessToken")?.value || cookieStore.get("refreshToken")?.value)

  return (
    <main className="relative min-h-screen bg-[#F9F7F3] overflow-x-hidden">
      <Hero loggedIn={loggedIn} />
      <Features />
      <HowItWorks />
      <PricingSection />
      <AboutSection />
      <CTABanner />
      <Footer />
    </main>
  )
}
