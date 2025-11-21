"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FeatureTabButton } from "./feature-tab-button";
import { FEATURE_TABS, FEATURES_DATA } from "@/lib/features-data";
import ResumeOptimizationVisual from "./visuals/resume-optimization-visual";
import AIInterviewVisual from "./visuals/ai-interview-visual";
import AIInterviewMeetingVisual from "./visuals/ai-interview-meeting-visual";
import ATSAnalysisVisual from "./visuals/ats-analysis-visual";
import { AnimatedStatValue } from "./animated-stat-value";

interface KeyFeaturesSectionProps {
  className?: string;
}

const headerVariants = {
  hidden: { opacity: 0, y: 50, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { 
      duration: 0.8,
      ease: [0.22, 1, 0.36, 1] as any, // Custom easing for smooth entry
    },
  },
};

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
    }
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
  const [shouldAnimate, setShouldAnimate] = useState<boolean>(false);
  const [shouldAnimateContent, setShouldAnimateContent] = useState<boolean>(false);
  const [headerScrollDirection, setHeaderScrollDirection] = useState<'down' | 'up'>('down');
  const [contentScrollDirection, setContentScrollDirection] = useState<'down' | 'up'>('down');
  const tabPanelRef = useRef<HTMLDivElement>(null);
  const tabRefs = useRef<{ [key: string]: HTMLButtonElement | null }>({});
  const headerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const lastScrollY = useRef<number>(0);

  useEffect(() => {
    const headerObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Determine direction based on where element is coming from
            const elementTop = entry.boundingClientRect.top;
            const viewportHeight = window.innerHeight;
            const direction = elementTop < viewportHeight / 2 ? 'up' : 'down';
            
            // Reset animation first, then set direction and trigger
            setShouldAnimate(false);
            setHeaderScrollDirection(direction);
            setTimeout(() => setShouldAnimate(true), 50);
          } else {
            setShouldAnimate(false);
          }
        });
      },
      {
        threshold: 0.2,
        rootMargin: "0px",
      }
    );

    const contentObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Determine direction based on where element is coming from
            const elementTop = entry.boundingClientRect.top;
            const viewportHeight = window.innerHeight;
            const direction = elementTop < viewportHeight / 2 ? 'up' : 'down';
            
            // Reset animation first, then set direction and trigger
            setShouldAnimateContent(false);
            setContentScrollDirection(direction);
            setTimeout(() => setShouldAnimateContent(true), 50);
          } else {
            setShouldAnimateContent(false);
          }
        });
      },
      {
        threshold: 0.05,
        rootMargin: "200px",
      }
    );

    if (headerRef.current) {
      headerObserver.observe(headerRef.current);
    }

    if (contentRef.current) {
      contentObserver.observe(contentRef.current);
    }

    return () => {
      if (headerRef.current) {
        headerObserver.unobserve(headerRef.current);
      }
      if (contentRef.current) {
        contentObserver.unobserve(contentRef.current);
      }
    };
  }, []);

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
    const currentIndex = FEATURE_TABS.findIndex((tab) => tab.id === currentTabId);
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
        nextIndex = (currentIndex - 1 + FEATURE_TABS.length) % FEATURE_TABS.length;
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
      className={`w-full pt-8 pb-20 md:pt-12 md:pb-32 relative overflow-hidden rounded-t-4xl ${className}`}
      style={{ backgroundColor: "#FFFFFF", marginTop: "-2rem" }}
    >

      <div className="max-w-[1200px] mx-auto px-4 md:px-6 relative z-10">
        {/* Section Header */}
        <div ref={headerRef} className="text-center mb-12 md:mb-16">
          <motion.div 
            className="inline-flex items-center gap-2.5 px-5 py-2 bg-white border border-gray-200 rounded-full mb-4 shadow-sm"
            animate={{ 
              y: [0, -5, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z" fill="#9CA3AF" />
            </svg>
            <span className="text-base font-normal text-gray-500 font-['DM_Sans']" style={{ letterSpacing: "0.01em" }}>
              Key features
            </span>
          </motion.div>
          <h2
            className="text-3xl md:text-4xl lg:text-5xl font-semibold text-black mb-4 font-['DM_Sans'] px-2"
            style={{ letterSpacing: "-0.03em" }}
          >
            {"Key Features that Transform".split('').map((char, index, array) => {
              let delay = 0;
              if (shouldAnimate) {
                delay = headerScrollDirection === 'down' 
                  ? index * 0.03 
                  : 0.1 + (array.length - index - 1) * 0.03;
              }
              return (
                <motion.span
                  key={`line1-${index}-${headerScrollDirection}`}
                  className="inline-block"
                  initial={{ opacity: 0, y: 50, rotateX: 90 }}
                  animate={shouldAnimate ? { opacity: 1, y: 0, rotateX: 0 } : { opacity: 0, y: 50, rotateX: 90 }}
                  transition={{
                    duration: 0.5,
                    delay,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                >
                  {char === ' ' ? '\u00A0' : char}
                </motion.span>
              );
            })}
            <br />
            {"your Job Application Success".split('').map((char, index, array) => {
              let delay = 0;
              if (shouldAnimate) {
                delay = headerScrollDirection === 'down' 
                  ? 0.8 + (index * 0.03) 
                  : 0.1 + (array.length - index - 1) * 0.03;
              }
              return (
                <motion.span
                  key={`line2-${index}-${headerScrollDirection}`}
                  className="inline-block"
                  initial={{ opacity: 0, y: 50, rotateX: 90 }}
                  animate={shouldAnimate ? { opacity: 1, y: 0, rotateX: 0 } : { opacity: 0, y: 50, rotateX: 90 }}
                  transition={{
                    duration: 0.5,
                    delay,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                >
                  {char === ' ' ? '\u00A0' : char}
                </motion.span>
              );
            })}
          </h2>
          <p className="text-sm md:text-base text-gray-400 max-w-2xl mx-auto font-['DM_Sans'] px-4">
            {"Discover powerful AI-driven tools designed to optimize your resume, practice interviews, and maximize your chances of landing your dream job.".split('').map((char, index, array) => {
              let delay = 0;
              if (shouldAnimate) {
                delay = headerScrollDirection === 'down' 
                  ? 1.6 + (index * 0.005) 
                  : 0.1 + (array.length - index - 1) * 0.005;
              }
              return (
                <motion.span
                  key={`desc-${index}-${headerScrollDirection}`}
                  className="inline-block"
                  initial={{ opacity: 0, y: 30, scale: 0.8 }}
                  animate={shouldAnimate ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 30, scale: 0.8 }}
                  transition={{
                    duration: 0.4,
                    delay,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                >
                  {char === ' ' ? '\u00A0' : char}
                </motion.span>
              );
            })}
          </p>
        </div>

        {/* Feature Tabs */}
        <motion.div
          role="tablist"
          aria-label="Feature categories"
          className="mb-12 md:mb-16"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, margin: "-100px", amount: 0.3 }}
          variants={tabContainerVariants}
        >
          {/* Mobile: Horizontal scrollable tabs */}
          <div className="md:hidden overflow-x-auto scrollbar-hide -mx-4 px-4">
            <div className="flex gap-2 sm:gap-3 min-w-min pb-2">
              {FEATURE_TABS.map((tab) => (
                <motion.div key={tab.id} variants={tabVariants} className="shrink-0">
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
        <div ref={contentRef}>
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
              className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-10 lg:gap-12 items-center outline-none"
            >
              {/* Feature Visual - Slides in from left */}
              <motion.div 
                className="order-2 lg:order-1 flex items-center justify-center min-h-[250px] sm:min-h-[300px]"
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
                className="order-1 lg:order-2 space-y-4 md:space-y-6"
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
                <h3 className="text-2xl md:text-3xl lg:text-4xl font-semibold text-black mb-3 md:mb-4 font-['DM_Sans']">
                  {activeFeature.title.split('').map((char, index, array) => {
                    let delay = 0;
                    if (shouldAnimateContent) {
                      delay = contentScrollDirection === 'down' 
                        ? 0.3 + (index * 0.03) 
                        : 0.1 + (array.length - index - 1) * 0.03;
                    }
                    return (
                      <motion.span
                        key={`${activeTab}-title-${index}-${contentScrollDirection}`}
                        className="inline-block"
                        initial={{ opacity: 0, y: 50, rotateX: 90 }}
                        animate={shouldAnimateContent ? { opacity: 1, y: 0, rotateX: 0 } : { opacity: 0, y: 50, rotateX: 90 }}
                        transition={{
                          duration: 0.5,
                          delay,
                          ease: [0.22, 1, 0.36, 1],
                        }}
                      >
                        {char === ' ' ? '\u00A0' : char}
                      </motion.span>
                    );
                  })}
                </h3>
                <p className="text-base md:text-lg text-gray-600 leading-relaxed font-['DM_Sans']" style={{ lineHeight: "1.6" }}>
                  {activeFeature.description.split('').map((char, index, array) => {
                    let delay = 0;
                    if (shouldAnimateContent) {
                      delay = contentScrollDirection === 'down' 
                        ? 0.5 + (index * 0.01) 
                        : 0.1 + (array.length - index - 1) * 0.01;
                    }
                    return (
                      <motion.span
                        key={`${activeTab}-desc-${index}-${contentScrollDirection}`}
                        className="inline-block"
                        initial={{ opacity: 0, y: 30, scale: 0.8 }}
                        animate={shouldAnimateContent ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 30, scale: 0.8 }}
                        transition={{
                          duration: 0.4,
                          delay,
                          ease: [0.22, 1, 0.36, 1],
                        }}
                      >
                        {char === ' ' ? '\u00A0' : char}
                      </motion.span>
                    );
                  })}
                </p>
              </motion.div>

              {/* Feature Stats */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4 pt-2 md:pt-4">
                {activeFeature.stats.map((stat, index) => {
                  const StatIcon = stat.icon;
                  const statColor = getStatColor(index);
                  return (
                    <motion.div
                      key={index}
                      className="bg-white rounded-lg p-3 md:p-4 shadow-sm border border-gray-200 cursor-pointer overflow-hidden relative group"
                      initial={{ opacity: 0, y: 20, scale: 0.9 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      whileHover={{ 
                        scale: 1.05,
                        y: -5,
                        boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)",
                        transition: { duration: 0.2 }
                      }}
                      transition={{ 
                        delay: 0.2 + (0.1 * index),
                        duration: 0.4,
                        ease: [0.22, 1, 0.36, 1] as any
                      }}
                    >
                      {/* Hover gradient overlay */}
                      <motion.div
                        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                        style={{
                          background: `linear-gradient(to bottom right, ${statColor}10, transparent)`
                        }}
                      />
                      
                      <div className="flex items-start gap-2 md:gap-3 relative z-10">
                        <motion.div 
                          className="p-1.5 md:p-2 rounded-lg shrink-0"
                          style={{ backgroundColor: `${statColor}20` }}
                          whileHover={{ rotate: [0, -10, 10, -10, 0], scale: 1.1 }}
                          transition={{ duration: 0.5 }}
                        >
                          <StatIcon className="w-4 h-4 md:w-5 md:h-5" style={{ color: statColor }} />
                        </motion.div>
                        <div className="min-w-0 flex-1">
                          <div className="text-lg md:text-xl lg:text-2xl font-semibold text-black font-['DM_Sans']">
                            <AnimatedStatValue value={stat.value} />
                          </div>
                          <div className="text-xs text-gray-500 font-['DM_Sans'] break-words">
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
