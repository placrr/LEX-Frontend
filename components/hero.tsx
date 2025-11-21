"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { InterviewReadinessCard } from "./cards/interview-readiness-card";
import { ResumeScoreCard } from "./cards/resume-score-card";
import { SkillsAnalysisCard } from "./cards/skills-analysis-card";
import { RecentActivityCard } from "./cards/recent-activity-card";
import { EmptyCard } from "./cards/empty-card";
import { CursorBadge } from "./cursor-badge";

type HeroProps = {
  children?: React.ReactNode;
};

export default function Hero({ children }: HeroProps) {
  const sectionRef = useRef<HTMLElement | null>(null);
  const heroRef = useRef<HTMLHeadingElement | null>(null);
  const topPillRef = useRef<HTMLButtonElement | null>(null);
  const bottomPillRef = useRef<HTMLButtonElement | null>(null);

  const [topPillPos, setTopPillPos] = useState<{
    left: number;
    top: number;
  } | null>(null);
  const [bottomPillPos, setBottomPillPos] = useState<{
    left: number;
    top: number;
  } | null>(null);
  const [topArrowStyle, setTopArrowStyle] =
    useState<React.CSSProperties | null>(null);
  const [bottomArrowStyle, setBottomArrowStyle] =
    useState<React.CSSProperties | null>(null);

  useEffect(() => {
    function compute() {
      const sec = sectionRef.current;
      const hero = heroRef.current;
      if (!sec || !hero) return;
      const secRect = sec.getBoundingClientRect();
      const heroRect = hero.getBoundingClientRect();

      const heroCenterX = heroRect.left - secRect.left + heroRect.width / 2;
      const heroCenterY = heroRect.top - secRect.top + heroRect.height / 2;

      // bottom pill: anywhere below hero paragraph center, keep inside section bounds
      const minLeft = 16;
      const maxLeft = Math.max(100, secRect.width - 120);
      const bottomLeft =
        Math.floor(Math.random() * (maxLeft - minLeft)) + minLeft;
      const bottomTopMin = Math.min(
        secRect.height - 120,
        Math.floor(heroCenterY + 40)
      );
      const bottomTopMax = Math.max(bottomTopMin + 20, secRect.height - 80);
      const bottomTop =
        Math.floor(Math.random() * (bottomTopMax - bottomTopMin)) +
        bottomTopMin;

      // top pill: above or near hero text
      const topLeft = Math.floor(Math.random() * (maxLeft - minLeft)) + minLeft;
      const topTopMax = Math.max(8, Math.floor(heroCenterY - 60));
      const topTopMin = Math.max(8, Math.floor(heroCenterY - 140));
      const topTop =
        Math.floor(Math.random() * (topTopMax - topTopMin + 1)) + topTopMin;

      setBottomPillPos({ left: bottomLeft, top: bottomTop });
      setTopPillPos({ left: topLeft, top: topTop });
    }

    compute();
    window.addEventListener("resize", compute);
    return () => window.removeEventListener("resize", compute);
  }, []);

  // compute arrow positions after pill elements render
  useEffect(() => {
    function computeArrows() {
      const sec = sectionRef.current;
      const topBtn = topPillRef.current;
      const bottomBtn = bottomPillRef.current;
      if (!sec || !topBtn || !bottomBtn) return;
      const secRect = sec.getBoundingClientRect();
      const topRect = topBtn.getBoundingClientRect();
      const bottomRect = bottomBtn.getBoundingClientRect();

      // top arrow: place just below top pill (arrow pointing down)
      const topArrowLeft = topRect.left - secRect.left + topRect.width / 2 - 8;
      const topArrowTop = topRect.top - secRect.top + topRect.height + 8; // padding between pill and arrow

      // bottom arrow: place just above bottom pill (arrow pointing up)
      const bottomArrowLeft =
        bottomRect.left - secRect.left + bottomRect.width / 2 - 8;
      const bottomArrowTop = bottomRect.top - secRect.top - 18; // place above with small gap

      setTopArrowStyle({ left: topArrowLeft, top: topArrowTop });
      setBottomArrowStyle({ left: bottomArrowLeft, top: bottomArrowTop });
    }

    // run after a short delay to allow layout
    const id = setTimeout(computeArrows, 50);
    window.addEventListener("resize", computeArrows);
    return () => {
      clearTimeout(id);
      window.removeEventListener("resize", computeArrows);
    };
  }, [topPillPos, bottomPillPos]);

  return (
    <section
      ref={sectionRef}
      className="min-h-[85vh] md:min-h-screen w-full relative overflow-hidden flex flex-col pt-28 md:pt-34 border-t rounded-b-2xl bg-[#F9F7F3]"
    >
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `
            radial-gradient(circle, #E2E0DC 1px, transparent 1px),
            repeating-linear-gradient(to bottom, rgba(224,220,214,0.06) 0px, rgba(224,220,214,0.06) 0.5px, transparent 0.5px, transparent 50px),
            repeating-linear-gradient(90deg, rgba(224,220,214,0.06) 0px, rgba(224,220,214,0.06) 0.5px, transparent 0.5px, transparent 50px)
          `,
          backgroundSize: "50px 50px, 50px 50px, 50px 50px",
          backgroundPosition: "0 0, 0 0, 0 0",
          zIndex: 0,
        }}
      />

      <div className="relative z-10 text-center shrink-0 px-4">
        <motion.h1
          ref={heroRef}
          className="hero-title text-3xl sm:text-4xl md:text-5xl lg:text-[48px] leading-tight font-semibold text-black"
          initial="hidden"
          animate="visible"
          variants={{
            visible: { transition: { staggerChildren: 0.05 } },
          }}
        >
          {Array.from("Be the Candidate").map((char, i) => (
            <motion.span
              key={`l1-${i}`}
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 },
              }}
              className="inline-block"
            >
              {char === " " ? "\u00A0" : char}
            </motion.span>
          ))}
          <br />
          {Array.from("Companies Can’t Ignore").map((char, i) => (
            <motion.span
              key={`l2-${i}`}
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 },
              }}
              className="inline-block"
            >
              {char === " " ? "\u00A0" : char}
            </motion.span>
          ))}
        </motion.h1>

        <motion.p
          className="mt-6 text-gray-400 max-w-2xl mx-auto text-base sm:text-sm"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.5 }}
        >
          AI platform that helps students improve their resume, practice
          interviews, and boost their shortlist chances
        </motion.p>

        <motion.div
          className="mt-8 flex items-center justify-center gap-6"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{
            delay: 1.2,
            type: "spring",
            stiffness: 200,
            damping: 15,
          }}
        >
          <a
            href="#"
            className="inline-flex items-center justify-center bg-[#F86510] text-white px-6 py-3 rounded-full shadow-lg text-sm font-medium hover:shadow-xl transition"
          >
            Try free for 14 days
          </a>
        </motion.div>
      </div>

      {/* Mobile Card Display (Fan-like at bottom) */}
      <div className="md:hidden relative w-full h-[300px] mt-8 overflow-hidden">
        <div className="absolute bottom-0 left-0 h-full flex justify-center items-end pb-12 right-6">
          <div
            className="absolute left-30 bottom-11 z-30 scale-[0.6] origin-bottom"
            style={{
              transform: "translateX(-50%) translateX(-150px) rotate(-20deg)",
            }}
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
            >
              <RecentActivityCard />
            </motion.div>
          </div>
          {/* Left Card - Interview Readiness */}
          <div
            className="absolute left-1/2 bottom-[84px] z-10 scale-[0.6] origin-bottom"
            style={{
              transform: "translateX(-50%) translateX(-150px) rotate(-20deg)",
            }}
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.4, type: "spring" }}
            >
              <InterviewReadinessCard />
            </motion.div>
          </div>

          {/* Center Card - Skills Analysis */}
          <div
            className="absolute left-40 bottom-[70px] z-20 scale-[0.71] mr-20 origin-bottom"
            style={{
              transform: "translateX(-50%)",
            }}
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.6, type: "spring" }}
            >
              <SkillsAnalysisCard />
            </motion.div>
          </div>

          {/* Right Card - Resume Score */}
          <div
            className="absolute left-1/2 bottom-9 z-10 scale-[0.6] origin-bottom"
            style={{
              transform: "translateX(-50%) translateX(150px) rotate(20deg)",
            }}
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.8, type: "spring" }}
            >
              <ResumeScoreCard />
            </motion.div>
          </div>
        </div>
      </div>

      {/* Desktop Fan-like Card Display */}
      <div className="hidden md:block relative w-full max-w-[1400px] mx-auto grow perspective-1000 top-38">
        <div className="absolute bottom-0 left-0 right-0 h-[500px] flex justify-center items-end pb-20">
          {/* Index 0: Empty Card (Far Left) */}
          <div
            className="absolute left-140 bottom-4 z-0 opacity-80 scale-75 transition-all duration-500"
            style={{
              transform: "translateX(-50%) translateX(-340px) rotate(-30deg)",
            }}
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
            >
              <EmptyCard />
            </motion.div>
          </div>

          {/* Index 1: Interview Readiness (Left) */}
          <div
            className="absolute left-140 bottom-28 z-10 scale-75 transition-all duration-500 hover:z-40 hover:scale-90 hover:rotate-0"
            style={{
              transform: "translateX(-50%) translateX(-210px) rotate(-15deg)",
            }}
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.4, type: "spring" }}
            >
              <InterviewReadinessCard />
            </motion.div>
          </div>

          {/* Index 2: Skills Analysis (Center Left) */}
          <div
            className="absolute left-1/2 bottom-36 z-20 scale-78 transition-all duration-500 hover:z-50 hover:scale-95"
            style={{
              transform: "translateX(-50%) translateX(-75px) rotate(-5deg)",
            }}
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.6, type: "spring" }}
            >
              <SkillsAnalysisCard />
            </motion.div>
          </div>

          {/* Index 3: Resume Score (Center Right) */}
          <div
            className="absolute left-1/2 bottom-24 z-20 scale-75 transition-all duration-500 hover:z-50 hover:scale-95"
            style={{
              transform: "translateX(-50%) translateX(75px) rotate(5deg)",
            }}
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.8, type: "spring" }}
            >
              <ResumeScoreCard />
            </motion.div>
          </div>

          {/* Index 4: Recent Activity (Right) */}
          <div
            className="absolute left-1/2 bottom-18 z-10 scale-75 transition-all duration-500 hover:z-40 hover:scale-90 hover:rotate-0"
            style={{
              transform: "translateX(-50%) translateX(210px) rotate(15deg)",
            }}
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 1.0, type: "spring" }}
            >
              <RecentActivityCard />
            </motion.div>
          </div>

          {/* Index 5: Empty Card (Far Right) */}
          <div
            className="absolute left-1/2 bottom-4 z-0 opacity-80 scale-75 transition-all duration-500"
            style={{
              transform: "translateX(-50%) translateX(340px) rotate(30deg)",
            }}
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 1.2, type: "spring" }}
            >
              <EmptyCard />
            </motion.div>
          </div>
        </div>
      </div>

      {/* Floating Cursor Badges */}
      <motion.div
        className="absolute left-1 top-17 md:left-[4%] md:top-[55%] z-20 block animate-float-delayed"
        initial={{ x: -200, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <CursorBadge
          text="AI Interview"
          color="#BAEA6A"
          rotation={90}
          sharpEdge="top-right"
        />
      </motion.div>

      <motion.div
        className="absolute right-[-30] top-75 md:right-[8%] md:top-[30%] z-20 block animate-float-delayed"
        initial={{ x: 200, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
      >
        <CursorBadge
          text="ATS Score"
          color="#FEB271"
          rotation={0}
          sharpEdge="top-left"
        />
      </motion.div>

      {/* Next Section Wrapper for Deep Cut */}

      <style jsx global>{`
        @keyframes float {
          0%,
          100% {
            transform: translate(0, 0);
          }
          50% {
            transform: translate(20px, -20px);
          }
        }

        @keyframes float-left {
          0%,
          100% {
            transform: translate(0, 0);
          }
          50% {
            transform: translate(-20px, -20px);
          }
        }

        .animate-float {
          animation: float 4s ease-in-out infinite;
        }

        .animate-float-delayed {
          animation: float-left 4s ease-in-out 2s infinite;
        }

        @import url("https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,500&display=swap");

        .hero-title {
          font-family: "DM Sans", sans-serif;
          font-weight: 500;
          letter-spacing: -0.03em;
        }

        .pill {
          z-index: 30;
        }

        .pill-arrow {
          width: 0;
          height: 0;
          z-index: 25;
        }

        .pill-arrow.up {
          border-left: 8px solid transparent;
          border-right: 8px solid transparent;
          border-bottom: 12px solid #000;
        }

        .pill-arrow.down {
          border-left: 8px solid transparent;
          border-right: 8px solid transparent;
          border-top: 12px solid #000;
        }

        /* small connector line to make arrow feel like pointing to hero text */
        .pill-arrow::after {
          content: "";
          position: absolute;
          left: 50%;
          transform: translateX(-50%);
          width: 28px;
          height: 2px;
          background: #000;
        }

        .pill-arrow.up::after {
          top: -10px;
        }

        .pill-arrow.down::after {
          top: 12px;
        }
      `}</style>
    </section>
  );
}
