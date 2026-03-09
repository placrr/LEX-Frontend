"use client";

import Hero from "@/components/hero";
import Features from "@/components/Features";
import BuildForEveryoneSection from "@/components/BuildForEveryoneSection";
import PricingSection from "@/components/Pricing Section";
import CTABanner from "@/components/CTABanner";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="relative min-h-screen bg-white overflow-x-hidden">
      <Navbar />

      <div className="relative z-10">
        <div className="absolute top-0 left-0 right-0 z-50">
        </div>

      {/* FEATURES */}
      <Features />
      <BuildForEveryoneSection />
      <PricingSection />
      <CTABanner />

      <Footer />
    </main>
  );
}
