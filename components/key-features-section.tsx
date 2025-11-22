"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FeatureTabButton } from "./buttons/feature-tab-button";
import { FEATURE_TABS, FEATURES_DATA } from "@/lib/features-data";
import ResumeOptimizationVisual from "./visuals/resume-optimization-visual";
import AIInterviewVisual from "./visuals/ai-interview-visual";
import AIInterviewMeetingVisual from "./visuals/ai-interview-meeting-visual";
import ATSAnalysisVisual from "./visuals/ats-analysis-visual";
import { AnimatedStatValue } from "./visuals/animated-stat-value";

interface KeyFeaturesSectionProps {
  className?: string;
}

const tabContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.3,
    },
  },
};

const tabVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.9 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.5,
      ease: [0.22, 1, 0.36, 1] as any,
    },
  },
};

// Variants for visual and details with directional entry
const visualVariants = {
  hidden: { opacity: 0, x: -100, scale: 0.8 },
  visible: {
    opacity: 1,
    x: 0,
    scale: 1,
    transition: {
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1] as any,
    },
  },
  exit: {
    opacity: 0,
    x: -50,
    transition: { duration: 0.3 },
  },
};

const detailsVariants = {
  hidden: { opacity: 0, x: 100, scale: 0.8 },
  visible: {
    opacity: 1,
    x: 0,
    scale: 1,
    transition: {
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1] as any,
      delay: 0.1,
    },
  },
  exit: {
    opacity: 0,
    x: 50,
    transition: { duration: 0.3 },
  },
};

export default function KeyFeaturesSection({
  className = "",
}: KeyFeaturesSectionProps) {
  const [activeTab, setActiveTab] = useState<string>("resume-optimization");
  const [isAnimating, setIsAnimating] = useState<boolean>(false);
  const tabPanelRef = useRef<HTMLDivElement>(null);
  const tabRefs = useRef<{ [key: string]: HTMLButtonElement | null }>({});

  const handleTabClick = (tabId: string) => {
    if (isAnimating || tabId === activeTab) return;

    setIsAnimating(true);
    setActiveTab(tabId);
    setTimeout(() => setIsAnimating(false), 400);
  };
  useEffect(() => {
    if (tabPanelRef.current) {
      tabPanelRef.current.setAttribute("tabindex", "0");
      tabPanelRef.current.focus();
      setTimeout(() => {
        tabPanelRef.current?.setAttribute("tabindex", "-1");
      }, 100);
    }
  }, [activeTab]);

  const handleKeyDown = (event: React.KeyboardEvent, currentTabId: string) => {
    const currentIndex = FEATURE_TABS.findIndex(
      (tab) => tab.id === currentTabId
    );
    let nextIndex = currentIndex;

    switch (event.key) {
      case "ArrowRight":
      case "ArrowDown":
        event.preventDefault();
        nextIndex = (currentIndex + 1) % FEATURE_TABS.length;
        break;
      case "ArrowLeft":
      case "ArrowUp":
        event.preventDefault();
        nextIndex =
          (currentIndex - 1 + FEATURE_TABS.length) % FEATURE_TABS.length;
        break;
      case "Home":
        event.preventDefault();
        nextIndex = 0;
        break;
      case "End":
        event.preventDefault();
        nextIndex = FEATURE_TABS.length - 1;
        break;
      default:
        return;
    }

    const nextTab = FEATURE_TABS[nextIndex];
    handleTabClick(nextTab.id);

    setTimeout(() => {
      tabRefs.current[nextTab.id]?.focus();
    }, 50);
  };

  const getVisualComponent = (featureId: string) => {
    switch (featureId) {
      case "resume-optimization":
        return <ResumeOptimizationVisual />;
      case "ai-resume-chat":
        return <AIInterviewVisual />;
      case "ai-interview":
        return <AIInterviewMeetingVisual />;
      case "ats-analysis":
        return <ATSAnalysisVisual />;
      default:
        return null;
    }
  };

  const getTabColor = (tabId: string) => {
    switch (tabId) {
      case "resume-optimization":
        return "#F86510"; // Dark Orange
      case "ai-resume-chat":
        return "#BAEA6A"; // Green
      case "ai-interview":
        return "#90CAF9"; // Blue
      case "ats-analysis":
        return "#F86510"; // Orange
      default:
        return "#F86510";
    }
  };

  const getStatColor = (index: number) => {
    const colors = ["#F86510", "#BAEA6A", "#90CAF9"];
    return colors[index % colors.length];
  };

  const activeFeature = FEATURES_DATA[activeTab];

  return (
    <section
      className={`w-full pt-8 pb-12 md:pt-10 md:pb-16 relative overflow-hidden ${className}`}
      style={{ backgroundColor: "#FFFFFF", marginTop: "-2rem" }}
    >
      <div className="max-w-[1200px] mx-auto px-4 md:px-6 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-8 md:mb-12">
          <motion.div
            className="inline-flex items-center gap-2 px-4 py-1.5 bg-white border border-gray-200 rounded-full mb-3 shadow-sm"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z"
                fill="#9CA3AF"
              />
            </svg>
            <span
              className="text-sm font-normal text-gray-500 font-['DM_Sans']"
              style={{ letterSpacing: "0.01em" }}
            >
              Key features
            </span>
          </motion.div>
          <motion.h2
            className="text-2xl md:text-3xl lg:text-4xl font-semibold text-black mb-3 font-['DM_Sans'] px-2"
            style={{ letterSpacing: "-0.03em" }}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Key Features that Transform
            <br />
            your Job Application Success
          </motion.h2>
          <motion.p
            className="text-sm text-gray-400 max-w-2xl mx-auto font-['DM_Sans'] px-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Discover powerful AI-driven tools designed to optimize your resume,
            practice interviews, and maximize your chances of landing your dream
            job.
          </motion.p>
        </div>

        {/* Feature Tabs */}
        <motion.div
          role="tablist"
          aria-label="Feature categories"
          className="mb-8 md:mb-12"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={tabContainerVariants}
        >
          {/* Mobile: Horizontal scrollable tabs */}
          <div className="md:hidden overflow-x-auto scrollbar-hide -mx-4 px-4">
            <div className="flex gap-2 sm:gap-3 min-w-min pb-2">
              {FEATURE_TABS.map((tab) => (
                <motion.div
                  key={tab.id}
                  variants={tabVariants}
                  className="shrink-0"
                >
                  <FeatureTabButton
                    ref={(el) => {
                      tabRefs.current[tab.id] = el;
                    }}
                    id={`tab-${tab.id}`}
                    label={tab.label}
                    icon={tab.icon as any}
                    isActive={activeTab === tab.id}
                    onClick={() => handleTabClick(tab.id)}
                    onKeyDown={(e) => handleKeyDown(e, tab.id)}
                    ariaControls={`panel-${tab.id}`}
                    tabIndex={activeTab === tab.id ? 0 : -1}
                    color={getTabColor(tab.id)}
                  />
                </motion.div>
              ))}
            </div>
          </div>

          {/* Tablet & Desktop: Centered flex layout */}
          <div className="hidden md:flex flex-wrap justify-center gap-4">
            {FEATURE_TABS.map((tab) => (
              <motion.div key={tab.id} variants={tabVariants}>
                <FeatureTabButton
                  ref={(el) => {
                    tabRefs.current[tab.id] = el;
                  }}
                  id={`tab-${tab.id}`}
                  label={tab.label}
                  icon={tab.icon as any}
                  isActive={activeTab === tab.id}
                  onClick={() => handleTabClick(tab.id)}
                  onKeyDown={(e) => handleKeyDown(e, tab.id)}
                  ariaControls={`panel-${tab.id}`}
                  tabIndex={activeTab === tab.id ? 0 : -1}
                  color={getTabColor(tab.id)}
                />
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Feature Content Display */}
        <div>
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              ref={tabPanelRef}
              role="tabpanel"
              id={`panel-${activeTab}`}
              aria-labelledby={`tab-${activeTab}`}
              aria-live="polite"
              aria-atomic="true"
              tabIndex={-1}
              className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 lg:gap-10 items-center outline-none"
            >
              {/* Feature Visual - Slides in from left */}
              <motion.div
                className="order-2 lg:order-1 flex items-center justify-center min-h-[200px] sm:min-h-[250px]"
                variants={visualVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                <motion.div
                  className="w-full max-w-lg mx-auto lg:mx-0"
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.3 }}
                >
                  {getVisualComponent(activeTab)}
                </motion.div>
              </motion.div>

              {/* Feature Details - Slides in from right */}
              <motion.div
                className="order-1 lg:order-2 space-y-3 md:space-y-4"
                variants={detailsVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                >
                  <h3 className="text-xl md:text-2xl lg:text-3xl font-semibold text-black mb-2 md:mb-3 font-['DM_Sans']">
                    {activeFeature.title}
                  </h3>
                  <p
                    className="text-sm md:text-base text-gray-600 leading-relaxed font-['DM_Sans']"
                    style={{ lineHeight: "1.6" }}
                  >
                    {activeFeature.description}
                  </p>
                </motion.div>

                {/* Feature Stats */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 md:gap-3 pt-2">
                  {activeFeature.stats.map((stat, index) => {
                    const StatIcon = stat.icon;
                    const statColor = getStatColor(index);
                    return (
                      <motion.div
                        key={index}
                        className="bg-white rounded-lg p-2.5 md:p-3 shadow-sm border border-gray-200 cursor-pointer overflow-hidden relative group"
                        initial={{ opacity: 0, y: 20, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        whileHover={{
                          scale: 1.05,
                          y: -5,
                          boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)",
                          transition: { duration: 0.2 },
                        }}
                        transition={{
                          delay: 0.2 + 0.1 * index,
                          duration: 0.4,
                          ease: [0.22, 1, 0.36, 1] as any,
                        }}
                      >
                        {/* Hover gradient overlay */}
                        <motion.div
                          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                          style={{
                            background: `linear-gradient(to bottom right, ${statColor}10, transparent)`,
                          }}
                        />

                        <div className="flex items-start gap-2 relative z-10">
                          <motion.div
                            className="p-1.5 rounded-lg shrink-0"
                            style={{ backgroundColor: `${statColor}20` }}
                            whileHover={{
                              rotate: [0, -10, 10, -10, 0],
                              scale: 1.1,
                            }}
                            transition={{ duration: 0.5 }}
                          >
                            <StatIcon
                              className="w-4 h-4"
                              style={{ color: statColor }}
                            />
                          </motion.div>
                          <div className="min-w-0 flex-1">
                            <div className="text-base md:text-lg lg:text-xl font-semibold text-black font-['DM_Sans']">
                              <AnimatedStatValue value={stat.value} />
                            </div>
                            <div className="text-[10px] md:text-xs text-gray-500 font-['DM_Sans'] break-words">
                              {stat.label}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </motion.div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      <style jsx global>{`
        @import url("https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600&display=swap");
      `}</style>
    </section>
  );
}
