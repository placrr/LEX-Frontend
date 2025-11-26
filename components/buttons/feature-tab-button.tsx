"use client";

import { forwardRef } from "react";
import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";

interface FeatureTabButtonProps {
  label: string;
  icon: LucideIcon;
  isActive: boolean;
  onClick: () => void;
  onKeyDown?: (event: React.KeyboardEvent) => void;
  id: string;
  ariaControls: string;
  tabIndex?: number;
  color?: string;
  className?: string;
}

export const FeatureTabButton = forwardRef<
  HTMLButtonElement,
  FeatureTabButtonProps
>(function FeatureTabButton(
  {
    label,
    icon: Icon,
    isActive,
    onClick,
    onKeyDown,
    id,
    ariaControls,
    tabIndex = 0,
    color = "#F86510",
    className = "",
  },
  ref
) {
  return (
    <motion.button
      ref={ref}
      role="tab"
      id={id}
      aria-selected={isActive}
      aria-controls={ariaControls}
      tabIndex={tabIndex}
      onClick={onClick}
      onKeyDown={onKeyDown}
      className={`
          relative flex items-center gap-2 sm:gap-3 px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg
          font-medium text-xs sm:text-sm transition-all duration-300 whitespace-nowrap
          outline-none focus-visible:ring-2 focus-visible:ring-offset-2
          ${className}
        `}
      style={{
        backgroundColor: isActive ? color : "#FFFFFF",
        color: isActive ? "#FFFFFF" : "#374151",
        border: isActive ? "none" : "1px solid #E5E7EB",
        // focusRing: color,
      }}
      whileHover={{
        scale: 1.05,
        y: -2,
        transition: { duration: 0.2 },
      }}
      whileTap={{ scale: 0.95 }}
    >
      <motion.div
        animate={isActive ? { rotate: [0, 5, -5, 0] } : {}}
        transition={{ duration: 0.5, ease: "easeInOut" }}
      >
        <Icon
          className={`w-4 h-4 sm:w-5 sm:h-5 ${
            isActive ? "text-white" : "text-gray-600"
          }`}
        />
      </motion.div>
      <span className="font-['DM_Sans']">{label}</span>
    </motion.button>
  );
});
