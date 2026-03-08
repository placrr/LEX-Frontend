"use client";

import { Menu, X, ChevronDown } from "lucide-react";
import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

interface NavbarUser {
  name: string | null;
  email: string;
  plan: string | null;
}

interface NavbarProps {
  user: NavbarUser | null;
}

export default function Navbar({ user }: NavbarProps) {

  console.log("Navbar user:", user)

  const [hovered, setHovered] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openUserMenu, setOpenUserMenu] = useState(false);

  const router = useRouter();

  async function handleLogout() {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/");
      router.refresh();
    } catch (err) {
      console.error("Logout failed", err);
    }
  }

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
            <Link
              href="/"
              className="text-2xl font-semibold text-gray-900 bg-white rounded-full px-5 py-2 hover:bg-gray-50 transition shadow-sm cursor-pointer"
            >
              Lex.
            </Link>
          </div>

          {/* Desktop Nav */}
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
                <Link
                  key={item.label}
                  href={item.href}
                  onMouseEnter={() => setHovered(item.label)}
                  onMouseLeave={() => setHovered(null)}
                  className="bg-white rounded-full px-6 py-2 text-gray-500 text-sm font-medium shadow-sm cursor-pointer"
                  style={style}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>

          {/* Right Side */}
          <div className="hidden md:flex items-center gap-3">

            {/* Language */}
            <button
              className="bg-white rounded-full px-2 py-2 hover:bg-gray-50 transition shadow-sm cursor-pointer"
              aria-label="Select language"
            >
              <img
                src="https://img.icons8.com/?size=25&id=esGVrxg9VCJ1&format=png&color=000000"
                alt="Language"
              />
            </button>

            {/* Auth Section */}
            {user ? (

              <div className="relative">

                <button
                  onClick={() => setOpenUserMenu(!openUserMenu)}
                  className="flex items-center gap-2 bg-white rounded-full px-3 py-2 shadow-sm hover:bg-gray-50 transition cursor-pointer"
                >

                  <div className="w-8 h-8 rounded-full bg-gray-900 text-white flex items-center justify-center text-sm font-medium">
                    {user.name?.charAt(0) || "U"}
                  </div>

                  <span className="text-sm font-medium">
                    {user.name}
                  </span>

                  <ChevronDown className="w-4 h-4 text-gray-500" />
                </button>

                <AnimatePresence>

                  {openUserMenu && (

                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                      className="absolute right-0 mt-3 w-56 bg-white rounded-xl shadow-lg border p-2 z-50"
                    >

                      <div className="px-3 py-2 border-b text-sm">
                        <div className="font-medium">{user.name}</div>
                        <div className="text-gray-500 text-xs">
                          {user.email}
                        </div>
                      </div>

                      <button
                        onClick={() => router.push("/dashboard")}
                        className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 rounded-lg cursor-pointer"
                      >
                        Dashboard
                      </button>

                      <button
                        onClick={() => router.push("/pricing")}
                        className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 rounded-lg cursor-pointer"
                      >
                        Upgrade Plan
                      </button>

                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-3 py-2 text-sm text-red-500 hover:bg-gray-100 rounded-lg cursor-pointer"
                      >
                        Logout
                      </button>

                    </motion.div>
                  )}
                </AnimatePresence>

              </div>

            ) : (

              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link href="/login">
                  <button
                    className="
                    bg-gray-900
                    hover:bg-gray-800
                    text-white
                    px-6
                    py-3
                    rounded-full
                    text-sm
                    font-medium
                    shadow-md
                    transition
                    cursor-pointer
                    "
                  >
                    Login / Sign Up
                  </button>
                </Link>
              </motion.div>

            )}
          </div>

          {/* Mobile Toggle */}
          <div className="md:hidden flex items-center gap-2 z-50">

            <Button
              variant="ghost"
              size="icon"
              className="bg-white rounded-full shadow-sm relative overflow-hidden cursor-pointer"
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

      {/* Mobile Menu */}
      <AnimatePresence>

        {isMobileMenuOpen && (

          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/20 z-40 md:hidden"
            />

            <motion.div
              initial={{ y: "-100%" }}
              animate={{ y: 0 }}
              exit={{ y: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 left-0 right-0 bg-white z-40 md:hidden shadow-xl rounded-b-3xl overflow-hidden flex flex-col"
            >

              <div className="flex flex-col gap-6 p-8 pt-24 pb-8">

                {navItems.map((item) => (
                  <Link
                    key={item.label}
                    href={item.href}
                    className="text-2xl font-medium text-gray-900 hover:text-gray-600 cursor-pointer"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {item.label}
                  </Link>
                ))}

                <div className="h-px bg-gray-100 w-full" />

                {user ? (

                  <button
                    onClick={handleLogout}
                    className="bg-black hover:bg-gray-800 text-white px-6 py-3 rounded-full text-base font-medium transition w-full cursor-pointer"
                  >
                    Logout
                  </button>

                ) : (

                  <motion.div whileTap={{ scale: 0.95 }} className="w-full">
                    <Link href="/login">
                      <button
                        className="
                        bg-black
                        hover:bg-gray-800
                        text-white
                        px-6
                        py-3
                        rounded-full
                        text-base
                        font-medium
                        transition
                        shadow-md
                        w-full
                        cursor-pointer
                        "
                      >
                        Login / Sign Up
                      </button>
                    </Link>
                  </motion.div>

                )}
              </div>

            </motion.div>
          </>
        )}

      </AnimatePresence>
    </>
  );
}