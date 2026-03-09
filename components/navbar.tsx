// Navbar.tsx
import React, { useEffect, useState } from "react";
import clsx from "clsx";

const Navbar: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToId = (id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const offset = window.scrollY + rect.top - 80;
    window.scrollTo({ top: offset, behavior: "smooth" });
  };

  return (
    <header
      className={clsx(
        "fixed inset-x-0 top-0 z-30 flex justify-center px-2 pt-2 sm:px-4 sm:pt-4",
        "transition-all duration-300 ease-out",
        scrolled ? "backdrop-blur-xl" : "backdrop-blur-none"
      )}
    >
      {/* Outer boxed navbar, shorter width */}
      <nav
        className={clsx(
          "flex w-full max-w-2xl items-center justify-between rounded-full border",
          "px-4 py-1.5 sm:px-6 sm:py-2",
          "bg-white/95 border-purple-100 shadow-sm",
          scrolled &&
            "shadow-[0_10px_30px_rgba(124,58,237,0.25)] bg-white/98"
        )}
      >
        {/* Left: Lex logo */}
        <div className="font-sans text-[20px] font-semibold tracking-[-0.16em] text-purple-700">
          Lex
        </div>

        {/* Center: nav links with minimal gaps */}
        <div className="hidden items-center gap-4 text-[13px] font-medium text-purple-900/80 sm:flex">
          <button
            type="button"
            onClick={() => scrollToId("features")}
            className="relative inline-flex items-center transition-colors duration-200 ease-out hover:text-purple-600"
          >
            <span className="text-[15px] text-black  after:absolute after:-bottom-1 after:left-0 after:h-[1px] after:w-0 after:bg-pink-500 after:transition-[width] after:duration-200 after:ease-out hover:after:w-full">
              Features
            </span>
          </button>
          <button
            type="button"
            onClick={() => scrollToId("pricing")}
            className="relative inline-flex items-center transition-colors duration-200 ease-out hover:text-purple-600"
          >
            <span className="text-[15px]  text-black  after:absolute after:-bottom-1 after:left-0 after:h-[1px] after:w-0 after:bg-pink-500 after:transition-[width] after:duration-200 after:ease-out hover:after:w-full">
              Pricing
            </span>
          </button>
          <button
            type="button"
            onClick={() => scrollToId("about")}
            className="relative inline-flex items-center transition-colors duration-200 ease-out hover:text-purple-600"
          >
            <span className="text-[15px]  text-black  after:absolute after:-bottom-1 after:left-0 after:h-[1px] after:w-0 after:bg-pink-500 after:transition-[width] after:duration-200 after:ease-out hover:after:w-full">
              About
            </span>
          </button>
          <button
            type="button"
            onClick={() => scrollToId("Contact")}
            className="relative inline-flex items-center transition-colors duration-200 ease-out hover:text-purple-600"
          >
            <span className="text-[15px] text-black  after:absolute after:-bottom-1 after:left-0 after:h-[1px] after:w-0 after:bg-pink-500 after:transition-[width] after:duration-200 after:ease-out hover:after:w-full">
            Contact
            </span>
          </button>
        </div>

        {/* Right: Sign in + Request Demo boxed buttons */}
        <div className="flex items-center gap-2 text-[13px] font-medium">
          <button
            type="button"
            onClick={() => scrollToId("signin")}
            className={clsx(
              "inline-flex items-center justify-center rounded-full border px-3 py-1.5",
              "border-purple-100 bg-white text-purple-700",
              "transition-all duration-200 ease-out hover:bg-purple-50 hover:border-purple-200 hover:text-purple-800"
            )}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => scrollToId("demo")}
            className={clsx(
              "inline-flex items-center justify-center rounded-full px-4 py-1.5",
              "bg-purple-700 text-white",
              // "shadow-[0_8px_22px_rgba(255,105,180,0.5),0_6px_18px_rgba(124,58,237,0.4)]",
              // "transition-transform duration-200 ease-out hover:-translate-y-0.5 hover:shadow-[0_12px_30px_rgba(255,105,180,0.55),0_10px_24px_rgba(124,58,237,0.45)]"
            )}
          >
            Request Demo
          </button>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
