"use client";

import { useMemo, useRef, useState, useEffect } from "react";
import { motion, useInView } from "framer-motion";

interface AIInterviewVisualProps {
  className?: string;
}

export default function AIInterviewVisual({
  className = "",
}: AIInterviewVisualProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, {
    once: false,
    margin: "-100px",
    amount: 0.5,
  });
  const [animationKey, setAnimationKey] = useState(0);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isInView && isMounted) {
      setAnimationKey((prev) => prev + 1);
    }
  }, [isInView, isMounted]);

  // Data with wrapped text for 210px width
  const interviewData = useMemo(() => {
    const scenarios = [
      {
        q: ["What are my strongest", "skills based on my resume?"],
        a: ["Based on your resume,", "your top skills are..."],
      },
      {
        q: ["Which jobs match my", "experience best?"],
        a: ["Your experience aligns", "well with roles in..."],
      },
      {
        q: ["How can I improve my", "resume for tech roles?"],
        a: ["I recommend adding", "more technical keywords..."],
      },
    ];

    const index = isMounted ? Math.floor(Math.random() * scenarios.length) : 0;
    return scenarios[index];
  }, [animationKey, isMounted]);

  // --- FIXED LAYOUT CONSTANTS ---
  // Header divider line is at Y=70. We start just below it.
  const START_Y = 85;
  const LINE_HEIGHT = 20;
  const PADDING_Y = 24;
  const BUBBLE_GAP = 20;

  const CARD_X = 40;
  const CARD_WIDTH = 320;

  const BUBBLE_WIDTH = 210;
  const TEXT_PADDING = 16;

  // 1. Left Align (AI): 20px from Left Card Edge
  const LEFT_BUBBLE_X = CARD_X + 20; // 60
  const LEFT_TEXT_X = LEFT_BUBBLE_X + TEXT_PADDING; // 76

  // 2. Right Align (User): 20px from Right Card Edge
  const RIGHT_BUBBLE_X = CARD_X + CARD_WIDTH - BUBBLE_WIDTH - 20; // 130
  const RIGHT_TEXT_X = RIGHT_BUBBLE_X + TEXT_PADDING; // 146

  // 1. Calculate Question Dimensions
  const qLines = interviewData.q;
  const qHeight = qLines.length * LINE_HEIGHT + PADDING_Y;
  const qY = START_Y;

  // 2. Calculate Answer Dimensions
  const aLines = interviewData.a;
  const aHeight = aLines.length * LINE_HEIGHT + PADDING_Y;
  const aY = qY + qHeight + BUBBLE_GAP;

  // Total SVG Height needed
  const totalContentHeight = aY + aHeight + 60;
  const viewBoxHeight = Math.max(280, totalContentHeight);

  // Animation constants
  const CONTAINER_DELAY = 0.1;
  const HEADER_DELAY = 0.3;
  const QUESTION_DELAY = 0.6;
  const ANSWER_DELAY = 1.2;
  const FEEDBACK_DELAY = 1.6;
  const TYPING_DELAY = 2.0;

  return (
    <div
      ref={ref}
      className={`w-full max-w-3xl mx-auto flex items-center justify-center min-h-[120px] sm:min-h-[150px] md:min-h-[200px] ${className}`}
    >
      <svg
        key={animationKey}
        viewBox={`0 0 600 ${viewBoxHeight}`}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full max-h-[160px] sm:max-h-[200px] md:max-h-none"
        preserveAspectRatio="xMidYMid meet"
        style={{ overflow: "visible" }}
      >
        <g transform="translate(100, 0)">
          {/* Main Card Background */}
          <motion.rect
            x={CARD_X}
            y="20"
            width={CARD_WIDTH}
            height={viewBoxHeight - 30}
            rx="16"
            fill="#FFFFFF"
            stroke="#E5E7EB"
            strokeWidth="2"
            initial={{ opacity: 0, y: 10 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
            transition={{ duration: 0.4, delay: CONTAINER_DELAY }}
          />

          {/* Header Area */}
          <motion.path
            d={`M ${CARD_X} 36 A 16 16 0 0 1 ${CARD_X + 16} 20 H ${
              CARD_X + CARD_WIDTH - 16
            } A 16 16 0 0 1 ${CARD_X + CARD_WIDTH} 36 V 70 H ${CARD_X} V 36 Z`}
            fill="#F9FAFB"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.3, delay: HEADER_DELAY }}
          />

          <motion.rect
            x={CARD_X}
            y="70"
            width={CARD_WIDTH}
            height="1"
            fill="#F3F4F6"
            initial={{ scaleX: 0 }}
            animate={isInView ? { scaleX: 1 } : { scaleX: 0 }}
            transition={{ duration: 0.5, delay: HEADER_DELAY }}
          />

          {/* Header Icon & Text */}
          <motion.circle
            cx={CARD_X + 30}
            cy="45"
            r="14"
            fill="#BAEA6A"
            initial={{ scale: 0 }}
            animate={isInView ? { scale: 1 } : { scale: 0 }}
            transition={{
              duration: 0.4,
              delay: HEADER_DELAY + 0.1,
              type: "spring",
            }}
          />
          <motion.text
            x={CARD_X + 30}
            y="49"
            textAnchor="middle"
            fill="#000000"
            fontSize="11"
            fontWeight="700"
            style={{ fontFamily: "sans-serif" }}
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.2, delay: HEADER_DELAY + 0.2 }}
          >
            AI
          </motion.text>

          <motion.text
            x={CARD_X + 55}
            y="42"
            fill="#111827"
            fontSize="13"
            fontWeight="700"
            style={{ fontFamily: "sans-serif" }}
            initial={{ opacity: 0, x: CARD_X + 45 }}
            animate={
              isInView
                ? { opacity: 1, x: CARD_X + 55 }
                : { opacity: 0, x: CARD_X + 45 }
            }
            transition={{ duration: 0.3, delay: HEADER_DELAY + 0.2 }}
          >
            Resume Assistant
          </motion.text>
          <motion.text
            x={CARD_X + 55}
            y="56"
            fill="#6B7280"
            fontSize="10"
            fontWeight="400"
            style={{ fontFamily: "sans-serif" }}
            initial={{ opacity: 0, x: CARD_X + 45 }}
            animate={
              isInView
                ? { opacity: 1, x: CARD_X + 55 }
                : { opacity: 0, x: CARD_X + 45 }
            }
            transition={{ duration: 0.3, delay: HEADER_DELAY + 0.3 }}
          >
            Ask me about your resume
          </motion.text>

          {/* === 1. Question Bubble (AI) - LEFT ALIGNED === */}
          {/* Removed Y-axis animation to prevent drift */}
          <motion.rect
            x={LEFT_BUBBLE_X}
            y={qY}
            width={BUBBLE_WIDTH}
            height={qHeight}
            rx="12"
            fill="#F3F4F6"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={
              isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.95 }
            }
            transition={{ duration: 0.4, delay: QUESTION_DELAY }}
          />
          {qLines.map((line, i) => (
            <motion.text
              key={`q-${i}`}
              x={LEFT_TEXT_X}
              y={qY + PADDING_Y / 2 + 5 + i * LINE_HEIGHT}
              fill="#1F2937"
              fontSize="12"
              style={{ fontFamily: "sans-serif" }}
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : { opacity: 0 }}
              transition={{
                duration: 0.3,
                delay: QUESTION_DELAY + 0.2 + i * 0.1,
              }}
            >
              {line}
            </motion.text>
          ))}

          {/* === 2. Answer Bubble (User) - RIGHT ALIGNED === */}
          <motion.rect
            x={RIGHT_BUBBLE_X}
            y={aY}
            width={BUBBLE_WIDTH}
            height={aHeight}
            rx="12"
            fill="#E3F2FD"
            stroke="#90CAF9"
            strokeWidth="1"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={
              isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.95 }
            }
            transition={{ duration: 0.4, delay: ANSWER_DELAY }}
          />
          {aLines.map((line, i) => (
            <motion.text
              key={`a-${i}`}
              x={RIGHT_TEXT_X}
              y={aY + PADDING_Y / 2 + 5 + i * LINE_HEIGHT}
              fill="#1F2937"
              fontSize="12"
              style={{ fontFamily: "sans-serif" }}
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : { opacity: 0 }}
              transition={{
                duration: 0.3,
                delay: ANSWER_DELAY + 0.2 + i * 0.1,
              }}
            >
              {line}
            </motion.text>
          ))}

          {/* "Clear" Badge - Right Edge of User Bubble */}
          <motion.g
            initial={{ scale: 0, opacity: 0 }}
            animate={
              isInView ? { scale: 1, opacity: 1 } : { scale: 0, opacity: 0 }
            }
            transition={{
              duration: 0.4,
              delay: FEEDBACK_DELAY,
              type: "spring",
            }}
          >
            <circle
              cx={RIGHT_BUBBLE_X + BUBBLE_WIDTH - 20}
              cy={aY + aHeight / 2}
              r="16"
              fill="#FFF3E0"
              stroke="#FFB74D"
              strokeWidth="1"
            />
            <circle
              cx={RIGHT_BUBBLE_X + BUBBLE_WIDTH - 20}
              cy={aY + aHeight / 2}
              r="12"
              fill="#FEB271"
              fillOpacity="0.2"
            />
            <motion.path
              d={`M ${RIGHT_BUBBLE_X + BUBBLE_WIDTH - 26} ${
                aY + aHeight / 2
              } L ${RIGHT_BUBBLE_X + BUBBLE_WIDTH - 22} ${
                aY + aHeight / 2 + 4
              } L ${RIGHT_BUBBLE_X + BUBBLE_WIDTH - 14} ${
                aY + aHeight / 2 - 4
              }`}
              stroke="#FEB271"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
              initial={{ pathLength: 0 }}
              animate={isInView ? { pathLength: 1 } : { pathLength: 0 }}
              transition={{ duration: 0.3, delay: FEEDBACK_DELAY + 0.2 }}
            />
            <text
              x={RIGHT_BUBBLE_X + BUBBLE_WIDTH - 20}
              y={aY + aHeight / 2 + 28}
              textAnchor="middle"
              fill="#FEB271"
              fontSize="9"
              fontWeight="600"
              style={{ fontFamily: "sans-serif" }}
            >
              Clear
            </text>
          </motion.g>

          {/* Typing Indicator - Left Aligned (under answer bubble) */}
          <motion.g
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ delay: TYPING_DELAY }}
          >
            {[0, 1, 2].map((index) => (
              <motion.circle
                key={index}
                cx={LEFT_BUBBLE_X + 15 + index * 8}
                cy={aY + aHeight + 25}
                r="2.5"
                fill="#9CA3AF"
                animate={{
                  y: [0, -4, 0],
                  opacity: [0.4, 1, 0.4],
                }}
                transition={{
                  duration: 1.2,
                  repeat: Infinity,
                  delay: index * 0.2,
                  ease: "easeInOut",
                }}
              />
            ))}
          </motion.g>
        </g>
      </svg>
    </div>
  );
}
