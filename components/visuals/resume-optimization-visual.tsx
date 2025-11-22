"use client";

import React, { useMemo, useRef, useState, useEffect } from "react";
import { motion, useInView } from "framer-motion";

interface ResumeOptimizationVisualProps {
  className?: string;
}

export default function ResumeOptimizationVisual({
  className = "",
}: ResumeOptimizationVisualProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, {
    once: false,
    margin: "-100px",
    amount: 0.5,
  });
  const [animationKey, setAnimationKey] = useState(0);
  const [isMounted, setIsMounted] = useState(false);

  // Ensure component is mounted on client
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Reset animation when coming into view
  useEffect(() => {
    if (isInView && isMounted) {
      setAnimationKey((prev) => prev + 1);
    }
  }, [isInView, isMounted]);

  // Define all content lines
  const contentLines = [
    { y: 95, width: 140 },
    { y: 105, width: 130 },
    { y: 115, width: 135 },
    { y: 138, width: 120 },
    { y: 148, width: 100 },
    { y: 175, width: 140 },
    { y: 185, width: 125 },
    { y: 195, width: 135 },
    { y: 210, width: 130 },
    { y: 220, width: 145 },
  ];

  // Randomly select 2-3 lines to highlight and generate random score (regenerate on each animation)
  const { highlightedIndices, score } = useMemo(() => {
    // Only generate random values on client side to avoid hydration mismatch
    if (!isMounted) {
      return {
        highlightedIndices: [2, 3, 4], // Default values for SSR
        score: 85,
      };
    }

    const count = Math.floor(Math.random() * 2) + 2; // 2 or 3 lines
    const indices: number[] = [];
    while (indices.length < count) {
      const randomIndex = Math.floor(Math.random() * contentLines.length);
      if (!indices.includes(randomIndex)) {
        indices.push(randomIndex);
      }
    }
    const randomScore = Math.floor(Math.random() * 16) + 80; // Random score between 80-95
    return {
      highlightedIndices: indices.sort((a, b) => a - b),
      score: randomScore,
    };
  }, [animationKey, isMounted]); // Regenerate when animation restarts

  // Calculate bounding box for highlighted lines
  const highlightBox = useMemo(() => {
    if (highlightedIndices.length === 0) return null;
    const firstLine = contentLines[highlightedIndices[0]];
    const lastLine =
      contentLines[highlightedIndices[highlightedIndices.length - 1]];
    return {
      y: firstLine.y - 8,
      height: lastLine.y - firstLine.y + 12,
    };
  }, [highlightedIndices]);

  // Animation timing
  const DOCUMENT_DELAY = 0.1;
  const DOCUMENT_DURATION = 0.4;
  const LINE_START_DELAY = DOCUMENT_DELAY + DOCUMENT_DURATION + 0.1;
  const LINE_STAGGER = 0.08;
  const HIGHLIGHT_DELAY =
    LINE_START_DELAY + contentLines.length * LINE_STAGGER + 0.2;
  const BOX_DELAY = HIGHLIGHT_DELAY + 0.3;
  const ARROW_DELAY = BOX_DELAY + 0.3;
  const SCORE_DELAY = ARROW_DELAY + 0.4;
  const CHECK_START_DELAY = SCORE_DELAY + 0.5;

  return (
    <div
      ref={ref}
      className={`w-full max-w-3xl mx-auto aspect-video flex items-center justify-center ${className}`}
    >
      <svg
        key={animationKey}
        viewBox="0 0 600 300"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
        preserveAspectRatio="xMidYMid meet"
      >
        <g transform="translate(100, 0)">
          {/* Resume Document */}
          <motion.rect
            x="80"
            y="40"
            width="180"
            height="220"
            rx="8"
            fill="#FFFFFF"
            stroke="#E5E7EB"
            strokeWidth="2"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={
              isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }
            }
            transition={{ duration: DOCUMENT_DURATION, delay: DOCUMENT_DELAY }}
          />

          {/* Header Section */}
          <motion.rect
            x="100"
            y="60"
            width="80"
            height="8"
            rx="4"
            fill="#6B7280"
            initial={{ width: 0 }}
            animate={isInView ? { width: 80 } : { width: 0 }}
            transition={{ duration: 0.4, delay: LINE_START_DELAY }}
          />
          <motion.rect
            x="100"
            y="75"
            width="120"
            height="6"
            rx="3"
            fill="#E5E7EB"
            initial={{ width: 0 }}
            animate={isInView ? { width: 120 } : { width: 0 }}
            transition={{
              duration: 0.4,
              delay: LINE_START_DELAY + LINE_STAGGER,
            }}
          />

          {/* Content Lines - Appear gradually, then some turn orange */}
          {contentLines.map((line, index) => {
            const isHighlighted = highlightedIndices.includes(index);
            const lineDelay = LINE_START_DELAY + (index + 2) * LINE_STAGGER;

            return (
              <motion.rect
                key={index}
                x="100"
                y={line.y}
                width={line.width}
                height="4"
                rx="2"
                fill={isHighlighted ? "#F86510" : "#E5E7EB"}
                initial={{ width: 0 }}
                animate={
                  isInView
                    ? {
                        width: line.width,
                      }
                    : { width: 0 }
                }
                transition={{
                  width: { duration: 0.4, delay: lineDelay },
                }}
              />
            );
          })}

          {/* Highlighted Section Box - Appears after lines turn orange */}
          {highlightBox && (
            <motion.rect
              x="95"
              y={highlightBox.y}
              width="150"
              height={highlightBox.height}
              rx="4"
              fill="#F86510"
              fillOpacity="0.1"
              stroke="#F86510"
              strokeWidth="1.5"
              strokeDasharray="4 2"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={
                isInView
                  ? { opacity: 1, scale: 1 }
                  : { opacity: 0, scale: 0.95 }
              }
              transition={{ duration: 0.4, delay: BOX_DELAY }}
            />
          )}

          {/* Improvement Arrow - Draws from box to score */}
          <motion.path
            d="M 280 140 L 320 115"
            stroke="#F86510"
            strokeWidth="2"
            strokeLinecap="round"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={
              isInView
                ? { pathLength: 1, opacity: 1 }
                : { pathLength: 0, opacity: 0 }
            }
            transition={{ duration: 0.5, delay: ARROW_DELAY }}
          />
          <motion.path
            d="M 315 110 L 320 115 L 318 121"
            fill="#F86510"
            initial={{ opacity: 0, scale: 0 }}
            animate={
              isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0 }
            }
            transition={{ duration: 0.3, delay: ARROW_DELAY + 0.4 }}
          />

          {/* Score Badge - Pops up after arrow */}
          <motion.circle
            cx="320"
            cy="80"
            r="35"
            fill="#F86510"
            initial={{ scale: 0, opacity: 0 }}
            animate={
              isInView
                ? {
                    scale: 1,
                    opacity: 1,
                  }
                : { scale: 0, opacity: 0 }
            }
            transition={{
              duration: 0.5,
              delay: SCORE_DELAY,
              type: "spring",
              stiffness: 200,
              damping: 15,
            }}
          />

          {/* Continuous pulse for score badge */}
          {isInView && (
            <motion.circle
              cx="320"
              cy="80"
              r="35"
              fill="#F86510"
              initial={{ scale: 1, opacity: 0 }}
              animate={{
                scale: [1, 1.15, 1],
                opacity: [0, 0, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
                delay: SCORE_DELAY + 0.5,
              }}
            />
          )}

          <motion.g
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ delay: SCORE_DELAY + 0.3, duration: 0.3 }}
          >
            <text
              x="320"
              y="78"
              textAnchor="middle"
              fill="#FFFFFF"
              fontSize="20"
              fontWeight="600"
            >
              {score}
            </text>
            <text
              x="320"
              y="92"
              textAnchor="middle"
              fill="#FFFFFF"
              fontSize="10"
            >
              Score
            </text>
          </motion.g>

          {/* Checkmarks - Appear sequentially after score */}
          {[160, 190, 220].map((cy, index) => (
            <React.Fragment key={cy}>
              <motion.circle
                cx="310"
                cy={cy}
                r="12"
                fill="#F86510"
                fillOpacity="0.2"
                initial={{ scale: 0 }}
                animate={isInView ? { scale: 1 } : { scale: 0 }}
                transition={{
                  duration: 0.3,
                  delay: CHECK_START_DELAY + index * 0.2,
                  type: "spring",
                  stiffness: 300,
                }}
              />
              <motion.path
                d={`M 305 ${cy} L 308 ${cy + 3} L 315 ${cy - 4}`}
                stroke="#F86510"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={
                  isInView
                    ? { pathLength: 1, opacity: 1 }
                    : { pathLength: 0, opacity: 0 }
                }
                transition={{
                  duration: 0.4,
                  delay: CHECK_START_DELAY + index * 0.2 + 0.15,
                }}
              />
            </React.Fragment>
          ))}
        </g>
      </svg>
    </div>
  );
}
