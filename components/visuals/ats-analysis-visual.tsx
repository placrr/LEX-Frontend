"use client";

import { useMemo, useRef, useState, useEffect } from "react";
import { motion, useInView } from "framer-motion";

interface ATSAnalysisVisualProps {
  className?: string;
}

export default function ATSAnalysisVisual({
  className = "",
}: ATSAnalysisVisualProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, {
    once: false,
    margin: "-50px",
    amount: 0.3,
  });
  const [animationKey, setAnimationKey] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  // Reset animation logic
  useEffect(() => {
    if (isInView) {
      setAnimationKey((prev) => prev + 1);
    }
  }, [isInView]);

  // Random score calculation
  const score = 92; // Fixed high score for demo, or make random: Math.floor(Math.random() * 10) + 85

  // Colors
  const PRIMARY = "#F86510";
  const GRAY_LIGHT = "#E5E7EB";
  const GRAY_DARK = "#4B5563";

  return (
    <div
      ref={ref}
      className={`w-full max-w-3xl mx-auto aspect-video flex items-center justify-center  rounded-xl p-4 ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <motion.svg
        key={animationKey}
        viewBox="0 0 600 300" // Widened viewbox for better spacing
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-sm"
        preserveAspectRatio="xMidYMid meet"
      >
        {/* =============================================
            SECTION 1: THE RESUME (LEFT)
           ============================================= */}
        <g transform="translate(50, 75)">
          {/* Document Body */}
          <motion.rect
            width="100"
            height="140"
            rx="8"
            fill="#FFFFFF"
            stroke={GRAY_LIGHT}
            strokeWidth="2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.05, stroke: PRIMARY }}
            transition={{ duration: 0.5 }}
          />

          {/* Skeleton Text Lines */}
          {[20, 40, 55, 70, 85, 105, 120].map((y, i) => (
            <motion.rect
              key={i}
              x="15"
              y={y}
              width={i === 0 ? 40 : [70, 60, 65, 50, 70, 60][i - 1]}
              height="4"
              rx="2"
              fill={i === 0 ? GRAY_DARK : GRAY_LIGHT}
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 0.3 + i * 0.05, duration: 0.4 }}
            />
          ))}

          {/* Scanning Beam Effect (The "Interactive" Part) */}
          <motion.rect
            x="0"
            y="0"
            width="100"
            height="5"
            fill="url(#scanGradient)"
            opacity="0.5"
            animate={{ y: [0, 140, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          />
        </g>

        {/* =============================================
            SECTION 2: CONNECTING LINES & DATA FLOW
           ============================================= */}

        {/* Path: Resume -> ATS */}
        <path
          d="M 150 145 L 220 145"
          stroke={GRAY_LIGHT}
          strokeWidth="2"
          strokeDasharray="4 4"
        />

        {/* Data Particle 1 */}
        <motion.circle r="4" fill={PRIMARY}>
          <motion.animateMotion
            path="M 150 145 L 220 145"
            dur="1.5s"
            repeatCount="indefinite"
            begin="0.5s"
          />
        </motion.circle>

        {/* Paths: ATS -> Result (Three converging lines) */}
        <path
          d="M 320 85  C 360 85,  360 145, 430 145"
          stroke={GRAY_LIGHT}
          strokeWidth="2"
          fill="none"
          strokeDasharray="4 4"
        />
        <path
          d="M 320 145 C 360 145, 360 145, 430 145"
          stroke={GRAY_LIGHT}
          strokeWidth="2"
          fill="none"
          strokeDasharray="4 4"
        />
        <path
          d="M 320 205 C 360 205, 360 145, 430 145"
          stroke={GRAY_LIGHT}
          strokeWidth="2"
          fill="none"
          strokeDasharray="4 4"
        />

        {/* Data Particles moving to Score */}
        {[85, 145, 205].map((startY, i) => (
          <motion.circle key={i} r="3" fill={PRIMARY} opacity={0.8}>
            <motion.animateMotion
              path={`M 320 ${startY} C 360 ${startY}, 360 145, 430 145`}
              dur="1.2s"
              repeatCount="indefinite"
              begin={`${1.5 + i * 0.2}s`}
            />
          </motion.circle>
        ))}

        {/* =============================================
            SECTION 3: ATS PROCESSORS (CENTER)
           ============================================= */}
        <g transform="translate(220, 50)">
          {/* CORRECTION: The connecting line is now here (First), so it renders BEHIND the boxes */}
          <motion.rect
            x="48"
            y="25"
            width="4"
            height="100"
            rx="2"
            fill={GRAY_LIGHT}
            opacity="0.5"
            initial={{ height: 0 }}
            animate={{ height: 100 }}
            transition={{ delay: 1.2 }}
          />

          {/* 3 Server Nodes */}
          {[0, 60, 120].map((yOffset, index) => (
            <motion.g
              key={index}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.8 + index * 0.2, type: "spring" }}
            >
              {/* Box Background */}
              <rect
                x="0"
                y={yOffset}
                width="100"
                height="50"
                rx="8"
                fill="white"
                stroke={isHovered ? PRIMARY : GRAY_LIGHT}
                strokeWidth="2"
                className="transition-colors duration-300"
              />
              {/* Server Blink Lights */}
              <circle
                cx="15"
                cy={yOffset + 15}
                r="3"
                fill={PRIMARY}
                opacity="0.3"
              >
                <animate
                  attributeName="opacity"
                  values="0.3;1;0.3"
                  dur="1s"
                  repeatCount="indefinite"
                  begin={`${index * 0.3}s`}
                />
              </circle>
              <circle
                cx="25"
                cy={yOffset + 15}
                r="3"
                fill={GRAY_DARK}
                opacity="0.3"
              />

              {/* Text */}
              <text
                x="50"
                y={yOffset + 28}
                textAnchor="middle"
                fontSize="12"
                fontWeight="bold"
                fill={GRAY_DARK}
              >
                {["Keywords", "Formatting", "Experience"][index]}
              </text>
            </motion.g>
          ))}
        </g>

        {/* =============================================
            SECTION 4: COMPATIBILITY SCORE (RIGHT)
           ============================================= */}
        <g transform="translate(430, 75)">
          <motion.g
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 2, type: "spring" }}
          >
            {/* Card Background */}
            <rect
              width="120"
              height="140"
              rx="12"
              fill="white"
              stroke={GRAY_LIGHT}
              strokeWidth="1"
              filter="url(#shadow)"
            />

            {/* Circular Progress Background */}
            <circle
              cx="60"
              cy="60"
              r="35"
              stroke={GRAY_LIGHT}
              strokeWidth="6"
              fill="none"
              opacity="0.3"
            />

            {/* Circular Progress Indicator */}
            <motion.circle
              cx="60"
              cy="60"
              r="35"
              stroke={PRIMARY}
              strokeWidth="6"
              fill="none"
              strokeLinecap="round"
              strokeDasharray="220" // Circumference
              strokeDashoffset="220"
              animate={{ strokeDashoffset: 220 - (220 * score) / 100 }}
              transition={{ delay: 2.5, duration: 1.5, ease: "easeOut" }}
            />

            {/* Score Text */}
            <motion.text
              x="60"
              y="60"
              dy="6"
              textAnchor="middle"
              fontSize="24"
              fontWeight="bold"
              fill={PRIMARY}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <tspan>{score}</tspan>
              <tspan fontSize="12" dx="2">
                %
              </tspan>
            </motion.text>

            <text
              x="60"
              y="115"
              textAnchor="middle"
              fontSize="12"
              fill={GRAY_DARK}
              fontWeight="500"
            >
              Match Rate
            </text>

            {/* Badge */}
            <rect
              x="35"
              y="125"
              width="50"
              height="5"
              rx="2.5"
              fill={PRIMARY}
              opacity="0.2"
            />
          </motion.g>
        </g>

        {/* Definitions */}
        <defs>
          <linearGradient id="scanGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={PRIMARY} stopOpacity="0" />
            <stop offset="50%" stopColor={PRIMARY} stopOpacity="0.5" />
            <stop offset="100%" stopColor={PRIMARY} stopOpacity="0" />
          </linearGradient>
          <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow
              dx="0"
              dy="4"
              stdDeviation="4"
              floodColor="#000000"
              floodOpacity="0.05"
            />
          </filter>
        </defs>
      </motion.svg>
    </div>
  );
}
