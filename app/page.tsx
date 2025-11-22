"use client";

import { useEffect } from "react";
import Navbar from "@/components/navbar";
import Hero from "@/components/hero";
import KeyFeaturesSection from "@/components/key-features-section";

export default function Home() {
  useEffect(() => {
    window.scrollTo(0, 0);
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }
  }, []);

  return (
    <main className="min-h-screen" style={{ backgroundColor: "white" }}>
      {/* Dot pattern background (moved into hero section) */}

      <div className="relative z-10">
        <div className="absolute top-0 left-0 right-0 z-50">
          <Navbar />
        </div>

        {/* Hero section */}
        <Hero>{/* put hero content here */}</Hero>

        {/* Key Features Section */}
        <div className="pt-12 md:pt-16">
          <KeyFeaturesSection />
        </div>

        {/* Dummy section */}
        {/* <section className="h-screen bg-white w-full flex items-center justify-center">
          <h2 className="text-3xl font-bold text-gray-200">Content Section</h2>
        </section> */}
      </div>
    </main>
  );
}
