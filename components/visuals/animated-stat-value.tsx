"use client";

import { useCounterAnimation } from "@/hooks/use-counter-animation";
import { useInView } from "framer-motion";
import { useRef } from "react";

interface AnimatedStatValueProps {
  value: string;
  className?: string;
}

export function AnimatedStatValue({ value, className = "" }: AnimatedStatValueProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  const extractNumber = (str: string): number | null => {
    const match = str.match(/\d+/);
    return match ? parseInt(match[0], 10) : null;
  };

  const number = extractNumber(value);
  const animatedNumber = useCounterAnimation({
    end: number || 0,
    duration: 2000,
    enabled: isInView && number !== null,
  });

  const getDisplayValue = (): string => {
    if (number === null) return value;
    return value.replace(/\d+/, animatedNumber.toString());
  };

  return (
    <span ref={ref} className={className}>
      {getDisplayValue()}
    </span>
  );
}
