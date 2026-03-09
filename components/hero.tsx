"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { CheckCircle } from "lucide-react";
import { useRef, useState } from "react";

export default function Hero() {
  const heroRef = useRef<HTMLElement | null>(null);
  const [svgDone, setSvgDone] = useState(false);

  return (
    <section
      ref={heroRef}
      className="relative overflow-hidden bg-white py-32 min-h-screen"
    >
      <div className="relative mx-auto -mt-18 h-[300px] max-w-6xl">
        {/* SVG NETWORK */}
        <svg
          className="absolute inset-0 h-full w-full"
          viewBox="0 0 1200 300"
          fill="none"
        >
          {/* MAIN LINE */}
          <motion.line
            x1="250"
            y1="150"
            x2="950"
            y2="150"
            stroke="#E5E7EB"
            strokeWidth="2"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.6, ease: "easeInOut" }}
          />

          {/* LEFT TOP */}
          <motion.line
            x1="450"
            y1="150"
            x2="400"
            y2="90"
            stroke="#E5E7EB"
            strokeWidth="2"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1, delay: 0.6 }}
          />
          <motion.line
            x1="400"
            y1="90"
            x2="300"
            y2="90"
            stroke="#E5E7EB"
            strokeWidth="2"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.9, delay: 0.85 }}
          />
          <motion.circle
            cx="400"
            cy="90"
            r="4"
            fill="#A855F7"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 1.1, duration: 0.4 }}
          />

          {/* LEFT BOTTOM */}
          <motion.line
            x1="500"
            y1="150"
            x2="440"
            y2="210"
            stroke="#E5E7EB"
            strokeWidth="2"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1, delay: 0.7 }}
          />
          <motion.line
            x1="440"
            y1="210"
            x2="360"
            y2="210"
            stroke="#E5E7EB"
            strokeWidth="2"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.9, delay: 0.95 }}
          />
          <motion.circle
            cx="440"
            cy="210"
            r="4"
            fill="#A855F7"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 1.2, duration: 0.4 }}
          />

          {/* RIGHT TOP */}
          <motion.line
            x1="700"
            y1="150"
            x2="800"
            y2="60"
            stroke="#E5E7EB"
            strokeWidth="2"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1, delay: 0.8 }}
          />
          <motion.line
            x1="800"
            y1="60"
            x2="850"
            y2="60"
            stroke="#E5E7EB"
            strokeWidth="2"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.9, delay: 1.05 }}
          />
          <motion.circle
            cx="800"
            cy="60"
            r="4"
            fill="#A855F7"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 1.3, duration: 0.4 }}
          />

          {/* RIGHT BOTTOM */}
          <motion.line
            x1="730"
            y1="150"
            x2="820"
            y2="240"
            stroke="#E5E7EB"
            strokeWidth="2"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1, delay: 0.9 }}
          />
          <motion.line
            x1="820"
            y1="240"
            x2="880"
            y2="240"
            stroke="#E5E7EB"
            strokeWidth="2"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{
              duration: 0.9,
              delay: 1.2,
              onComplete: () => setSvgDone(true),
            }}
          />
          <motion.circle
            cx="820"
            cy="240"
            r="4"
            fill="#A855F7"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 1.45, duration: 0.4 }}
          />
        </svg>

        {/* CENTER CARD */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.4 }}
          className="absolute left-1/2 top-1/2 z-20 h-24 w-24 -translate-x-1/2 -translate-y-1/2"
        >
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 blur-2xl opacity-60" />
          <div className="relative flex h-full w-full items-center justify-center rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 shadow-xl">
            <CheckCircle className="h-10 w-10 text-white" strokeWidth={2.5} />
          </div>
        </motion.div>

        {/* FLOATING CARDS */}
        <Card className="left-[280px] top-[40px]" delay={0.4} icon="💡" />
        <Card className="left-[280px] top-[200px]" delay={0.45} icon="👥" />
        <Card className="right-[280px] top-[40px]" delay={0.5} icon="⚡" />
        <Avatar className="right-[280px] top-[200px]" delay={0.55} />
        <Card
          className="left-[250px] top-[150px] -translate-x-1/2 -translate-y-1/2"
          delay={0.6}
          icon="📦"
        />
        <Avatar
          className="left-[950px] top-[150px] -translate-x-1/2 -translate-y-1/2"
          delay={0.65}
        />
      </div>

      {/* TEXT */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={svgDone ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6 }}
        className="mx-auto max-w-3xl text-center -mt-12"
      >
        <h1 className="text-5xl font-bold tracking-tight">
          All-in-One Career <br /> Accelerator
        </h1>
        <p className="mt-4 text-gray-500">
          Resume fixes, skill gap analysis, and company-specific prep—tailored just
          for KIIT students
        </p>
        <button className="mt-8 rounded-full bg-orange-500 px-8 py-3 text-white shadow-lg">
          Request a Demo
        </button>
      </motion.div>
    </section>
  );
}

/* CARD */
function Card({ className, delay, icon }: any) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className={`absolute flex h-16 w-16 items-center justify-center rounded-xl bg-white shadow-md ${className}`}
    >
      <span className="text-2xl">{icon}</span>
    </motion.div>
  );
}

/* AVATAR */
function Avatar({ className, delay }: any) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className={`absolute h-16 w-16 overflow-hidden rounded-full bg-white shadow-md ${className}`}
    >
      <Image src="/avatar.jpg" alt="avatar" width={64} height={64} />
    </motion.div>
  );
}
