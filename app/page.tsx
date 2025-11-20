import Navbar from "@/components/navbar";
import Hero from "@/components/hero";

export default function Home() {
  return (
    <main className="min-h-screen" style={{ backgroundColor: "#F9F7F3" }}>
      {/* Dot pattern background (moved into hero section) */}

      <div className="relative z-10">
        <div className="absolute top-0 left-0 right-0 z-50">
          <Navbar />
        </div>

        {/* Hero section */}
        <Hero>{/* put hero content here */}</Hero>

        {/* Dummy section */}
        <section className="h-screen bg-white w-full flex items-center justify-center">
          <h2 className="text-3xl font-bold text-gray-200">Content Section</h2>
        </section>
      </div>
    </main>
  );
}
