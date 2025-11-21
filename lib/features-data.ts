import {
  TrendingUp,
  FileText,
  CheckCircle2,
  MessageSquare,
  Target,
  Clock,
  Database,
  Zap,
  Award,
  FileCheck,
  Bot,
  ScanSearch,
} from "lucide-react";

// TypeScript interfaces for feature data structure
export interface FeatureStat {
  label: string;
  value: string;
  change?: string;
  icon: React.ComponentType<{ className?: string }>;
}

export interface FeatureContent {
  id: string;
  title: string;
  description: string;
  stats: FeatureStat[];
}

export interface FeatureTab {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

// Feature tabs configuration
export const FEATURE_TABS: FeatureTab[] = [
  {
    id: "resume-optimization",
    label: "Resume Optimization",
    icon: FileCheck,
  },
  {
    id: "ai-resume-chat",
    label: "AI Resume Chat",
    icon: MessageSquare,
  },
  {
    id: "ai-interview",
    label: "AI Interview Practice",
    icon: Bot,
  },
  {
    id: "ats-analysis",
    label: "ATS Analysis",
    icon: ScanSearch,
  },
];

// Feature content data
export const FEATURES_DATA: Record<string, FeatureContent> = {
  "resume-optimization": {
    id: "resume-optimization",
    title: "Resume Optimization",
    description:
      "AI-powered resume analysis that identifies gaps, suggests improvements, and optimizes your resume for ATS systems. Get actionable feedback on formatting, keywords, and content structure.",
    stats: [
      {
        label: "Average Score Improvement",
        value: "+32%",
        icon: TrendingUp,
      },
      {
        label: "Keywords Optimized",
        value: "150+",
        icon: FileText,
      },
      {
        label: "ATS Compatibility",
        value: "95%",
        icon: CheckCircle2,
      },
    ],
  },
  "ai-resume-chat": {
    id: "ai-resume-chat",
    title: "AI Resume Chat",
    description:
      "Upload your resume and chat with our AI assistant to get instant answers about your experience, skills, and qualifications. Perfect for interview preparation and resume refinement.",
    stats: [
      {
        label: "Questions Answered",
        value: "10K+",
        icon: MessageSquare,
      },
      {
        label: "Response Time",
        value: "<2s",
        icon: Clock,
      },
      {
        label: "Accuracy Rate",
        value: "96%",
        icon: Target,
      },
    ],
  },
  "ai-interview": {
    id: "ai-interview",
    title: "AI Interview Practice",
    description:
      "Practice with AI-powered mock interviews in a realistic video call environment. Get real-time feedback on your answers, body language, and communication skills to ace your next interview.",
    stats: [
      {
        label: "Interview Scenarios",
        value: "500+",
        icon: Bot,
      },
      {
        label: "Success Rate",
        value: "87%",
        icon: Target,
      },
      {
        label: "Avg. Preparation Time",
        value: "2 weeks",
        icon: Clock,
      },
    ],
  },
  "ats-analysis": {
    id: "ats-analysis",
    title: "ATS Analysis",
    description:
      "Deep analysis of how Applicant Tracking Systems will parse and rank your resume. Understand exactly what recruiters see and optimize for maximum visibility.",
    stats: [
      {
        label: "ATS Systems Tested",
        value: "50+",
        icon: Database,
      },
      {
        label: "Parse Accuracy",
        value: "98%",
        icon: Zap,
      },
      {
        label: "Shortlist Rate",
        value: "+45%",
        icon: Award,
      },
    ],
  },
};
