import type { Metadata } from "next";
import { Suspense } from "react";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { Toaster } from "sonner";
import NavbarWrapper from "@/components/layouts/NavbarWrapper";
import "./globals.css";

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
});

export const metadata: Metadata = {
  title: "Placr",
  description: "Placr — AI career platform for KIIT students",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${geist.variable} ${geistMono.variable} font-sans antialiased`}
      >
        <Suspense fallback={
          <nav className="sticky top-0 z-50 bg-transparent">
            <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
              <div className="text-2xl font-semibold text-gray-900 bg-white rounded-full px-5 py-2 shadow-sm">Placr.</div>
              <div className="h-10 w-32 bg-gray-100 rounded-full animate-pulse" />
            </div>
          </nav>
        }>
          <NavbarWrapper />
        </Suspense>

        {children}

        <Toaster
          position="top-center"
          richColors
          closeButton
          toastOptions={{
            style: { borderRadius: "16px", fontSize: "14px" },
          }}
        />
        <Analytics />
      </body>
    </html>
  );
}