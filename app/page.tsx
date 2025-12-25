"use client";

import Navbar from "@/components/navbar";
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

      {/* HERO */}
      <Hero />

      {/* FEATURES */}
      <Features />
      <BuildForEveryoneSection />
      <PricingSection />
      <CTABanner />

      <Footer />
    </main>
  );
}
