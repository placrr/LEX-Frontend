"use client";

// Navbar.tsx
import React, { useState, useEffect, useRef } from "react";
import clsx from "clsx";

import { Menu, X, ChevronDown, ChevronRight, Loader2, FileSearch, Mic, Briefcase } from "lucide-react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

const featureItems = [
  { label: "ATS Resume Checker", href: "/ats", icon: FileSearch, description: "Optimize your resume for ATS" },
  { label: "AI Interview Prep", href: "/interview", icon: Mic, description: "Practice with AI mock interviews" },
  { label: "Job Informer", href: "/jobs", icon: Briefcase, description: "Personalized job recommendations" },
];

const navItems = [
  { label: "Features", href: "#", color: "#F86510", textOnHover: "#ffffff", hasDropdown: true },
  { label: "Pricing", href: "/#pricing", color: "#BBE96A", textOnHover: "#000000" },
  { label: "About", href: "/#about", color: "#89CCF9", textOnHover: "#ffffff" },
];

interface NavbarUser {
  name: string | null;
  email: string;
  plan: string | null;
}

interface NavbarProps {
  user: NavbarUser | null;
}

export default function Navbar({ user }: NavbarProps) {

  const [hovered, setHovered] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openUserMenu, setOpenUserMenu] = useState(false);
  const [navigating, setNavigating] = useState(false);
  const [featuresOpen, setFeaturesOpen] = useState(false);
  const [mobileFeatures, setMobileFeatures] = useState(false);
  const featuresRef = useRef<HTMLDivElement>(null);

  const router = useRouter();
  const pathname = usePathname();

  // Reset spinner when navigation completes (root layout persists across routes)
  useEffect(() => {
    setNavigating(false);
    setFeaturesOpen(false);
    setMobileFeatures(false);
  }, [pathname]);

  // Close features dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (featuresRef.current && !featuresRef.current.contains(e.target as Node)) {
        setFeaturesOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Hide navbar on auth routes (works for client-side navigation too)
  const hiddenRoutes = ["/login", "/after-oauth", "/complete-profile", "/verify-otp"];
  if (hiddenRoutes.some(route => pathname.startsWith(route))) {
    return null;
  }

  function handleLoginClick() {
    if (navigating) return;
    setNavigating(true);
    router.push("/login");
  }

  async function handleLogout() {
    const logout = fetch("/api/auth/logout", { method: "POST" });
    router.push("/");
    await logout;
    router.refresh();
  }

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
              Placr.
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

              if (item.hasDropdown) {
                return (
                  <div key={item.label} ref={featuresRef} className="relative">
                    <button
                      onClick={() => setFeaturesOpen(!featuresOpen)}
                      onMouseEnter={() => setHovered(item.label)}
                      onMouseLeave={() => setHovered(null)}
                      className="bg-white rounded-full px-6 py-2 text-gray-500 text-sm font-medium shadow-sm cursor-pointer flex items-center gap-1"
                      style={style}
                    >
                      {item.label}
                      <ChevronDown className={clsx("w-3.5 h-3.5 transition-transform duration-200", featuresOpen && "rotate-180")} />
                    </button>

                    <AnimatePresence>
                      {featuresOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: -8 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -8 }}
                          transition={{ duration: 0.18 }}
                          className="absolute left-1/2 -translate-x-1/2 mt-3 w-72 bg-white rounded-2xl shadow-lg border border-gray-100 p-2 z-50"
                        >
                          {featureItems.map((fi) => {
                            const Icon = fi.icon;
                            return (
                              <Link
                                key={fi.href}
                                href={fi.href}
                                onClick={() => setFeaturesOpen(false)}
                                className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-50 transition group"
                              >
                                <div className="w-9 h-9 rounded-lg bg-orange-50 flex items-center justify-center shrink-0 group-hover:bg-orange-100 transition">
                                  <Icon className="w-4.5 h-4.5 text-orange-600" />
                                </div>
                                <div>
                                  <div className="text-sm font-medium text-gray-900">{fi.label}</div>
                                  <div className="text-xs text-gray-500">{fi.description}</div>
                                </div>
                              </Link>
                            );
                          })}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              }

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
              className="bg-white rounded-full p-2 hover:bg-gray-50 transition shadow-sm cursor-pointer"
            >
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5a17.92 17.92 0 01-8.716-2.247m0 0A9 9 0 013 12c0-1.47.353-2.856.978-4.082" />
              </svg>
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
                        onClick={() => router.push("/#pricing")}
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
                whileHover={{ scale: navigating ? 1 : 1.05 }}
                whileTap={{ scale: navigating ? 1 : 0.95 }}
              >
                <button
                  onClick={handleLoginClick}
                  disabled={navigating}
                  className="
                  bg-gray-900
                  hover:bg-gray-800
                  disabled:opacity-60
                  disabled:cursor-not-allowed
                  text-white
                  px-6
                  py-3
                  rounded-full
                  text-sm
                  font-medium
                  shadow-md
                  transition
                  cursor-pointer
                  flex items-center gap-2
                  "
                >
                  {navigating
                    ? <><Loader2 className="w-4 h-4 animate-spin" /> Redirecting…</>
                    : "Login / Sign Up"
                  }
                </button>
              </motion.div>

            )}
          </div>

          {/* Mobile Toggle */}
          <div className="md:hidden flex items-center gap-2 z-50">

            <Button
              variant="ghost"
              size="icon"
              className="bg-white rounded-full shadow-sm cursor-pointer"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >

              <AnimatePresence mode="wait" initial={false}>

                {isMobileMenuOpen ? (
                  <motion.div
                    key="close"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                  >
                    <X className="h-6 w-6" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="menu"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
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

              <div className="flex flex-col gap-6 p-8 pt-24 pb-10">

                {navItems.map((item) => {
                  if (item.hasDropdown) {
                    return (
                      <div key={item.label} className="flex flex-col">
                        <button
                          onClick={() => setMobileFeatures(!mobileFeatures)}
                          className="text-2xl font-medium text-gray-900 hover:text-gray-600 cursor-pointer flex items-center gap-2 text-left"
                        >
                          {item.label}
                          <ChevronRight className={clsx("w-5 h-5 transition-transform duration-200", mobileFeatures && "rotate-90")} />
                        </button>

                        <AnimatePresence>
                          {mobileFeatures && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.2 }}
                              className="overflow-hidden"
                            >
                              <div className="flex flex-col gap-2 pl-4 pt-3">
                                {featureItems.map((fi) => {
                                  const Icon = fi.icon;
                                  return (
                                    <Link
                                      key={fi.href}
                                      href={fi.href}
                                      onClick={() => setIsMobileMenuOpen(false)}
                                      className="flex items-center gap-3 py-2 text-gray-700 hover:text-gray-900 transition"
                                    >
                                      <Icon className="w-5 h-5 text-orange-500" />
                                      <span className="text-base font-medium">{fi.label}</span>
                                    </Link>
                                  );
                                })}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    );
                  }

                  return (
                    <Link
                      key={item.label}
                      href={item.href}
                      className="text-2xl font-medium text-gray-900 hover:text-gray-600 cursor-pointer"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {item.label}
                    </Link>
                  );
                })}

                <div className="h-px bg-gray-100 w-full" />

                {user ? (

                  <div className="flex flex-col gap-4">

                    {/* User Info */}
                    <div className="flex items-center gap-3 border-b pb-4">

                      <div className="w-10 h-10 rounded-full bg-gray-900 text-white flex items-center justify-center text-sm font-medium">
                        {user.name?.charAt(0) || "U"}
                      </div>

                      <div>
                        <div className="text-sm font-semibold">
                          {user.name}
                        </div>
                        <div className="text-xs text-gray-500">
                          {user.email}
                        </div>
                      </div>

                    </div>

                    <button
                      onClick={() => router.push("/dashboard")}
                      className="w-full bg-gray-100 text-gray-900 px-6 py-3 rounded-full text-base font-medium hover:bg-gray-200 transition cursor-pointer"
                    >
                      Dashboard
                    </button>

                    <button
                      onClick={() => router.push("/#pricing")}
                      className="w-full bg-gray-100 text-gray-900 px-6 py-3 rounded-full text-base font-medium hover:bg-gray-200 transition cursor-pointer"
                    >
                      Upgrade Plan
                    </button>

                    <button
                      onClick={handleLogout}
                      className="w-full bg-black text-white px-6 py-3 rounded-full text-base font-medium hover:bg-gray-800 transition cursor-pointer"
                    >
                      Logout
                    </button>

                  </div>

                ) : (

                  <button
                    onClick={handleLoginClick}
                    disabled={navigating}
                    className="bg-black text-white px-6 py-3 rounded-full text-base font-medium transition shadow-md w-full cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {navigating
                      ? <><Loader2 className="w-4 h-4 animate-spin" /> Redirecting…</>
                      : "Login / Sign Up"
                    }
                  </button>

                )}
              </div>

            </motion.div>
          </>
        )}

      </AnimatePresence>
    </>
  );
}
