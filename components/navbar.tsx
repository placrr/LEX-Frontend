"use client";

import { Flag, Menu, X } from "lucide-react";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

export default function Navbar() {
  const [hovered, setHovered] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { label: "Features", href: "#", color: "#F86510", textOnHover: "#ffffff" },
    { label: "Pricing", href: "#", color: "#BBE96A", textOnHover: "#000000" },
    { label: "About", href: "#", color: "#89CCF9", textOnHover: "#ffffff" },
  ];

  return (
    <>
      <nav className="sticky top-0 z-50 bg-transparent">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between gap-4 relative">
          {/* Logo */}
          <div className="shrink-0 z-50">
            <a
              href="/"
              className="text-2xl font-semibold text-gray-900 bg-white rounded-full px-5 py-2  hover:text-gray-900 hover:bg-gray-50 transition-colors shadow-sm"
            >
              Lex.
            </a>
          </div>

          {/* Center Navigation Items - Desktop */}
          <div className="hidden md:flex items-center gap-6 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            {navItems.map((item) => {
              const isHovered = hovered === item.label;
              const style: React.CSSProperties = {
                backgroundImage: `linear-gradient(to right, ${item.color}, ${item.color})`,
                backgroundSize: isHovered ? "100% 100%" : "0% 100%",
                backgroundRepeat: "no-repeat",
                transition: "background-size 300ms ease, color 300ms ease",
                color: isHovered ? item.textOnHover : undefined,
              };

              return (
                <a
                  key={item.label}
                  href={item.href}
                  onMouseEnter={() => setHovered(item.label)}
                  onMouseLeave={() => setHovered(null)}
                  className="bg-white rounded-full px-6 py-2 text-gray-500 text-sm font-medium shadow-sm"
                  style={style}
                >
                  {item.label}
                </a>
              );
            })}
          </div>

          {/* Right Side - Language Selector & CTA */}
          <div className="hidden md:flex items-center gap-3">
            <button
              className="bg-white rounded-full px-2 py-2 hover:bg-gray-50 transition-colors shadow-sm"
              aria-label="Select language"
            >
              <img src="https://img.icons8.com/?size=25&id=esGVrxg9VCJ1&format=png&color=000000"></img>
            </button>

            {/* CTA Button */}
            <button className="bg-gray-900 hover:bg-gray-800 text-white px-6 py-3 rounded-full text-sm font-medium transition-colors">
              Login / Sign Up
            </button>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="md:hidden flex items-center gap-2 z-50">
            <Button
              variant="ghost"
              size="icon"
              className="bg-white rounded-full shadow-sm relative overflow-hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <AnimatePresence mode="wait" initial={false}>
                {isMobileMenuOpen ? (
                  <motion.div
                    key="close"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <X className="h-6 w-6" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="menu"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Menu className="h-6 w-6" />
                  </motion.div>
                )}
              </AnimatePresence>
            </Button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/20 z-40 md:hidden"
            />

            {/* Menu Content */}
            <motion.div
              initial={{ y: "-100%" }}
              animate={{ y: 0 }}
              exit={{ y: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 left-0 right-0 h-auto bg-white z-40 md:hidden shadow-xl rounded-b-3xl overflow-hidden flex flex-col"
            >
              <div className="flex flex-col gap-6 p-8 pt-24 pb-8 overflow-y-auto">
                <div className="flex flex-col gap-4">
                  {navItems.map((item) => (
                    <a
                      key={item.label}
                      href={item.href}
                      className="text-2xl font-medium text-gray-900 hover:text-gray-600"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {item.label}
                    </a>
                  ))}
                </div>

                <div className="h-px bg-gray-100 w-full" />

                <div className="flex items-center gap-3 mt-2">
                  <button className="w-12 h-12 rounded-full bg-white flex items-center justify-center shrink-0 hover:bg-gray-200 transition-colors border border-gray-200">
                    <img
                      src="https://img.icons8.com/?size=25&id=esGVrxg9VCJ1&format=png&color=000000"
                      alt="Language"
                      className="w-6 h-6"
                    />
                  </button>
                  <button className="bg-black hover:bg-gray-800 text-white px-6 py-3 rounded-full text-base font-medium transition-colors w-full">
                    Login / Sign Up
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
