"use client";

import { Flag } from "lucide-react";
import React, { useState } from "react";

export default function Navbar() {
  const [hovered, setHovered] = useState<string | null>(null);

  const navItems = [
    { label: "Features", href: "#", color: "#F86510", textOnHover: "#ffffff" },
    { label: "Pricing", href: "#", color: "#BBE96A", textOnHover: "#000000" },
    { label: "About", href: "#", color: "#89CCF9", textOnHover: "#ffffff" },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-transparent">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between gap-8 relative">
        {/* Logo */}
        <div className="flex-shrink-0">
          <a
            href="/"
            className="text-2xl font-semibold text-gray-900 bg-white rounded-full px-5 py-2  hover:text-gray-900 hover:bg-gray-50 transition-colors shadow-sm"
          >
            Lex.
          </a>
        </div>

        {/* Center Navigation Items */}
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
        <div className="flex items-center gap-3">
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
      </div>
    </nav>
  );
}
