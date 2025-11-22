"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useInView } from "framer-motion";

interface AIInterviewMeetingVisualProps {
  className?: string;
}

export default function AIInterviewMeetingVisual({
  className = "",
}: AIInterviewMeetingVisualProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, {
    once: false,
    margin: "-100px",
    amount: 0.5,
  });
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Animation variants for container entry
  const containerVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.8, ease: "easeOut" },
    },
  };

  // NEW: Animation keyframes for active talking modulation
  const talkingWaveform = {
    scale: [1, 1.12, 1.05, 1.2, 0.95, 1.15, 1],
    opacity: [0.3, 0.7, 0.4, 0.8, 0.3, 0.6, 0.3],
    transition: {
      duration: 1.4, // Fast, speech-like tempo
      repeat: Infinity,
      ease: "easeInOut",
    },
  };

  // Colors Palette
  const colors = {
    bg: "#F0F9FF", // Solid pale sky blue background
    orange: { bright: "#F97316", deep: "#EA580C" },
    skyBlue: {
      pale: "#E0F2FE",
      bright: "#38BDF8",
      deep: "#0284C7",
      darkText: "#0C4A6E",
    },
    lightGreen: { bright: "#86EFAC", deep: "#22C55E" },
  };

  return (
    <div
      ref={ref}
      className={`w-full max-w-3xl mx-auto aspect-video flex items-center justify-center ${className}`}
    >
      <motion.svg
        viewBox="0 0 600 300"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-xl"
        preserveAspectRatio="xMidYMid meet"
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        variants={containerVariants}
      >
        <g transform="translate(100, 0)">
          <defs>
            {/* NOTE: Dot pattern removed. */}

            {/* Vibrant Speaking Gradient for Waves */}
            <linearGradient id="waveGradient" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor={colors.orange.bright} />
              <stop offset="100%" stopColor={colors.skyBlue.bright} />
            </linearGradient>

            {/* User Avatar Gradient */}
            <linearGradient id="userGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#BBF7D0" />
              <stop offset="100%" stopColor={colors.lightGreen.bright} />
            </linearGradient>

            {/* Crystal Edge Gradient */}
            <linearGradient id="crystalEdge" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.9" />
              <stop offset="50%" stopColor="#FFFFFF" stopOpacity="0.1" />
              <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0.6" />
            </linearGradient>

            {/* Sharper Shadow for crystal elements */}
            <filter
              id="crystalShadow"
              x="-20%"
              y="-20%"
              width="140%"
              height="140%"
            >
              <feDropShadow
                dx="0"
                dy="2"
                stdDeviation="3"
                floodColor={colors.skyBlue.darkText}
                floodOpacity="0.15"
              />
            </filter>
          </defs>

          {/* ==========================
            Main Meeting Window Background (Solid Color, No Dots)
           ========================== */}
          <rect
            x="20"
            y="20"
            width="360"
            height="260"
            rx="24"
            fill={colors.bg} // Using solid background color
            stroke={colors.skyBlue.pale}
            strokeWidth="1"
          />

          {/* ==========================
            AI Participant (Left) - NEW TALKING ANIMATION
           ========================== */}
          <motion.g
            initial={{ opacity: 0, scale: 0.9 }}
            animate={
              isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }
            }
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {/* Crystal Video Container */}
            <rect
              x="35"
              y="35"
              width="160"
              height="110"
              rx="16"
              fill="#FFFFFF"
              fillOpacity="0.3"
              stroke="url(#crystalEdge)"
              strokeWidth="1.5"
              filter="url(#crystalShadow)"
            />

            {/* NEW AI TALKING ANIMATION (Pulsing Waveforms) */}
            <g transform="translate(115, 90)">
              {/* Outer Wave (Delayed) */}
              <motion.circle
                cx="0"
                cy="0"
                r="28"
                fill="url(#waveGradient)"
                animate={talkingWaveform}
                transition={{ ...talkingWaveform.transition, delay: 0.2 }}
              />
              {/* Inner Wave */}
              <motion.circle
                cx="0"
                cy="0"
                r="20"
                fill="url(#waveGradient)"
                animate={talkingWaveform}
              />

              {/* Core Orb (Steady) */}
              <circle cx="0" cy="0" r="12" fill="#FFFFFF" />
              <circle cx="0" cy="0" r="7" fill="url(#waveGradient)" />
            </g>

            {/* Crystal Label Pill */}
            <rect
              x="45"
              y="125"
              width="40"
              height="14"
              rx="7"
              fill="#FFFFFF"
              fillOpacity="0.5"
              stroke="url(#crystalEdge)"
              strokeWidth="0.5"
            />
            <text
              x="65"
              y="135"
              textAnchor="middle"
              fill={colors.skyBlue.deep}
              fontSize="8"
              fontWeight="700"
              letterSpacing="0.5"
            >
              AI SPEAKING
            </text>
          </motion.g>

          {/* ==========================
            User Participant (Right)
           ========================== */}
          <motion.g
            initial={{ opacity: 0, scale: 0.9 }}
            animate={
              isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }
            }
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            {/* Crystal Video Container */}
            <rect
              x="205"
              y="35"
              width="160"
              height="110"
              rx="16"
              fill="#FFFFFF"
              fillOpacity="0.3"
              stroke="url(#crystalEdge)"
              strokeWidth="1.5"
              filter="url(#crystalShadow)"
            />

            {/* Avatar Shape */}
            <g transform="translate(285, 90)">
              <circle cx="0" cy="-15" r="16" fill="url(#userGradient)" />
              <path
                d="M -22 15 Q 0 25 22 15 V 25 H -22 Z"
                fill="url(#userGradient)"
                opacity="0.8"
              />
              <path d="M -22 15 Q 0 -5 22 15" fill="url(#userGradient)" />
            </g>

            {/* Crystal Label Pill */}
            <rect
              x="325"
              y="125"
              width="30"
              height="14"
              rx="7"
              fill="#FFFFFF"
              fillOpacity="0.5"
              stroke="url(#crystalEdge)"
              strokeWidth="0.5"
            />
            <text
              x="340"
              y="135"
              textAnchor="middle"
              fill={colors.skyBlue.deep}
              fontSize="8"
              fontWeight="700"
              letterSpacing="0.5"
            >
              YOU
            </text>
          </motion.g>

          {/* ==========================
            Crystal Overlay: Question
           ========================== */}
          <motion.g
            initial={{ y: 10, opacity: 0 }}
            animate={isInView ? { y: 0, opacity: 1 } : { y: 10, opacity: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            {/* Crystal Background */}
            <rect
              x="35"
              y="160"
              width="330"
              height="65"
              rx="16"
              fill="#FFFFFF"
              fillOpacity="0.4"
              stroke="url(#crystalEdge)"
              strokeWidth="2"
              filter="url(#crystalShadow)"
            />

            <text
              x="200"
              y="182"
              textAnchor="middle"
              fill={colors.skyBlue.darkText}
              fontSize="12"
              fontWeight="700"
            >
              Tell me about your experience
            </text>
            <text
              x="200"
              y="198"
              textAnchor="middle"
              fill={colors.skyBlue.deep}
              fontSize="10"
              fontWeight="500"
            >
              with React and TypeScript?
            </text>

            {/* Thinking Animation - Orange dots */}
            <g transform="translate(188, 210)">
              {[0, 1, 2].map((i) => (
                <motion.circle
                  key={i}
                  cx={i * 12}
                  cy="0"
                  r="2.5"
                  fill={colors.orange.bright}
                  animate={{ opacity: [0.3, 1, 0.3], scale: [1, 1.2, 1] }}
                  transition={{
                    duration: 1.2,
                    repeat: Infinity,
                    delay: i * 0.2,
                  }}
                />
              ))}
            </g>
          </motion.g>

          {/* ==========================
            Floating Crystal Controls Bar
           ========================== */}
          <motion.g
            initial={{ y: 20, opacity: 0 }}
            animate={isInView ? { y: 0, opacity: 1 } : { y: 20, opacity: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
          >
            {/* Crystal Bar Background */}
            <rect
              x="80"
              y="245"
              width="240"
              height="40"
              rx="20"
              fill="#FFFFFF"
              fillOpacity="0.4"
              stroke="url(#crystalEdge)"
              strokeWidth="1.5"
              filter="url(#crystalShadow)"
            />

            {/* Icons Group */}
            <g transform="translate(120, 265)">
              {/* Mic (Active) */}
              <circle cx="0" cy="0" r="12" fill={colors.skyBlue.pale} />
              <rect
                x="-3"
                y="-4"
                width="6"
                height="8"
                rx="3"
                fill={colors.skyBlue.deep}
              />

              {/* Camera (Active) */}
              <g transform="translate(40, 0)">
                <circle cx="0" cy="0" r="12" fill={colors.skyBlue.pale} />
                <rect
                  x="-5"
                  y="-3"
                  width="10"
                  height="6"
                  rx="1"
                  fill={colors.skyBlue.deep}
                />
              </g>

              {/* End Call - Deep Orange */}
              <g transform="translate(80, 0)">
                <circle cx="0" cy="0" r="12" fill={colors.orange.deep} />
                <rect
                  x="-4"
                  y="-1.5"
                  width="8"
                  height="3"
                  rx="1.5"
                  fill="#FFFFFF"
                />
              </g>

              {/* Menu */}
              <g transform="translate(120, 0)">
                <circle
                  cx="0"
                  cy="0"
                  r="12"
                  fill="transparent"
                  stroke={colors.skyBlue.pale}
                  strokeWidth="1"
                />
                <circle cx="-4" cy="0" r="1" fill={colors.skyBlue.bright} />
                <circle cx="0" cy="0" r="1" fill={colors.skyBlue.bright} />
                <circle cx="4" cy="0" r="1" fill={colors.skyBlue.bright} />
              </g>
            </g>
          </motion.g>
        </g>
      </motion.svg>
    </div>
  );
}
