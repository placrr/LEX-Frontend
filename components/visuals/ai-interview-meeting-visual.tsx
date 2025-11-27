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
      transition: { duration: 0.8, ease: "easeOut" as any },
    },
  };

  // NEW: Animation keyframes for active talking modulation
  const talkingWaveform = {
    scale: [1, 1.12, 1.05, 1.2, 0.95, 1.15, 1],
    opacity: [0.3, 0.7, 0.4, 0.8, 0.3, 0.6, 0.3],
    transition: {
      duration: 1.4, // Fast, speech-like tempo
      repeat: Infinity,
      ease: "easeInOut" as any,
    },
  };

  // Colors Palette
  const colors = {
    bg: "#FFFFFF",
    border: "#000000",
    text: {
      primary: "#000000",
      secondary: "#666666",
    },
    surface: {
      light: "#FAFAFA",
      stroke: "#E5E5E5",
    },
    accent: "#000000",
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
        className="w-full h-full drop-shadow-2xl"
        preserveAspectRatio="xMidYMid meet"
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        variants={containerVariants}
      >
        <g transform="translate(100, 0)">
          <defs>
            {/* Monochrome Gradients */}
            <linearGradient id="waveGradient" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#000000" />
              <stop offset="100%" stopColor="#404040" />
            </linearGradient>

            <linearGradient id="userGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#E0F2FE" />
              <stop offset="100%" stopColor="#7DD3FC" />
            </linearGradient>

            <linearGradient id="glassGradient" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0.4" />
            </linearGradient>

            <filter
              id="softShadow"
              x="-20%"
              y="-20%"
              width="140%"
              height="140%"
            >
              <feDropShadow
                dx="0"
                dy="4"
                stdDeviation="6"
                floodColor="#000000"
                floodOpacity="0.1"
              />
            </filter>
          </defs>

          {/* Main Meeting Window */}
          <rect
            x="20"
            y="20"
            width="360"
            height="260"
            rx="24"
            fill={colors.bg}
            stroke="white"
            strokeWidth="2"
            // filter="url(#softShadow)"
          />

          {/* AI Participant (Left) */}
          <motion.g
            initial={{ opacity: 0, scale: 0.9 }}
            animate={
              isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }
            }
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {/* Video Container */}
            <rect
              x="35"
              y="35"
              width="160"
              height="110"
              rx="16"
              fill={colors.surface.light}
              stroke={colors.surface.stroke}
              strokeWidth="1"
            />

            {/* AI Talking Animation */}
            <g transform="translate(115, 90)">
              <motion.circle
                cx="0"
                cy="0"
                r="28"
                fill="#90CAF9"
                opacity="0.1"
                animate={talkingWaveform}
                transition={{ ...talkingWaveform.transition, delay: 0.2 }}
              />
              <motion.circle
                cx="0"
                cy="0"
                r="20"
                fill="#90CAF9"
                opacity="0.2"
                animate={talkingWaveform}
              />
              <circle cx="0" cy="0" r="12" fill="#90CAF9" />
              <circle cx="0" cy="0" r="4" fill="#90CAF9" />
            </g>

            {/* Label */}
            {/* <rect x="45" y="125" width="75" height="16" rx="8" fill="#000000" /> */}
            <text
              x="83"
              y="136"
              textAnchor="middle"
              fill="black"
              fontSize="9"
              fontWeight="1000"
              letterSpacing="0.5"
            >
              INTERVIEWER
            </text>
          </motion.g>

          {/* User Participant (Right) */}
          <motion.g
            initial={{ opacity: 0, scale: 0.9 }}
            animate={
              isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }
            }
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <rect
              x="205"
              y="35"
              width="160"
              height="110"
              rx="16"
              fill={colors.surface.light}
              stroke={colors.surface.stroke}
              strokeWidth="1"
            />

            <g transform="translate(285, 90)">
              <circle cx="0" cy="-15" r="16" fill="#90CAF9" />
              <path
                d="M -22 15 Q 0 25 22 15 V 25 H -22 Z"
                fill="#90CAF9"
                opacity="0.8"
              />
              <path d="M -22 15 Q 0 -5 22 15" fill="#90CAF9" />
            </g>

            {/* <rect
              x="325"
              y="125"
              width="30"
              height="16"
              rx="8"
              fill="#000000"
            /> */}
            <text
              x="340"
              y="136"
              textAnchor="middle"
              fill="black"
              fontSize="9"
              fontWeight="1000"
              letterSpacing="0.5"
            >
              YOU
            </text>
          </motion.g>

          {/* Question Overlay */}
          <motion.g
            initial={{ y: 10, opacity: 0 }}
            animate={isInView ? { y: 0, opacity: 1 } : { y: 10, opacity: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <rect
              x="35"
              y="160"
              width="330"
              height="65"
              rx="16"
              fill="#FFFFFF"
              stroke={colors.surface.stroke}
              strokeWidth="1"
              filter="url(#softShadow)"
            />

            <text
              x="200"
              y="182"
              textAnchor="middle"
              fill={colors.text.primary}
              fontSize="12"
              fontWeight="600"
            >
              Tell me about your experience
            </text>
            <text
              x="200"
              y="198"
              textAnchor="middle"
              fill={colors.text.secondary}
              fontSize="11"
              fontWeight="500"
            >
              with React and TypeScript?
            </text>

            {/* Thinking Dots */}
            <g transform="translate(188, 210)">
              {[0, 1, 2].map((i) => (
                <motion.circle
                  key={i}
                  cx={i * 12}
                  cy="0"
                  r="2.5"
                  fill="#000000"
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

          {/* Controls Bar */}
          <motion.g
            initial={{ y: 20, opacity: 0 }}
            animate={isInView ? { y: 0, opacity: 1 } : { y: 20, opacity: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
          >
            <rect
              x="80"
              y="245"
              width="240"
              height="40"
              rx="20"
              fill="#000000"
              // filter="url(#softShadow)"
            />

            <g transform="translate(120, 265)">
              {/* Mic */}
              <circle cx="0" cy="0" r="12" fill="#333333" />
              <rect x="-3" y="-4" width="6" height="8" rx="3" fill="#FFFFFF" />

              {/* Camera */}
              <g transform="translate(40, 0)">
                <circle cx="0" cy="0" r="12" fill="#333333" />
                <rect
                  x="-5"
                  y="-3"
                  width="10"
                  height="6"
                  rx="1"
                  fill="#FFFFFF"
                />
              </g>

              {/* End Call */}
              <g transform="translate(80, 0)">
                <circle cx="0" cy="0" r="12" fill="#DC2626" />
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
                  stroke="#333333"
                  strokeWidth="1"
                />
                <circle cx="-4" cy="0" r="1" fill="#FFFFFF" />
                <circle cx="0" cy="0" r="1" fill="#FFFFFF" />
                <circle cx="4" cy="0" r="1" fill="#FFFFFF" />
              </g>
            </g>
          </motion.g>
        </g>
      </motion.svg>
    </div>
  );
}
