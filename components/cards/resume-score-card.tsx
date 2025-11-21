"use client";

import { FileText, CheckCircle2 } from "lucide-react";
import { useCounterAnimation } from "@/hooks/use-counter-animation";
import { useInView } from "framer-motion";
import { useRef } from "react";

export function ResumeScoreCard() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const score = useCounterAnimation({ end: 85, duration: 2000, enabled: isInView });

  return (
    <div ref={ref} className="w-full max-w-sm bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
      <div className="space-y-6">
        {/* Item 1 */}
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-500 text-white shadow-md shadow-orange-200">
            <FileText className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs font-medium text-gray-400 uppercase tracking-wide">
              Analysis
            </p>
            <h3 className="text-lg font-bold text-gray-900">Resume Parsing</h3>
          </div>
        </div>

        {/* Item 2 */}
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-orange-500 text-white shadow-md shadow-orange-200">
            <CheckCircle2 className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs font-medium text-gray-400 uppercase tracking-wide">
              Optimization
            </p>
            <h3 className="text-lg font-bold text-gray-900">Keyword Match</h3>
          </div>
        </div>
      </div>

      <div className="mt-8 pt-6 border-t border-gray-50">
        <p className="text-sm font-medium text-gray-500 mb-1">
          Overall ATS Score
        </p>
        <div className="flex items-baseline gap-2">
          <span className="text-4xl font-bold text-gray-900">{score}</span>
          <span className="inline-flex items-center rounded-full bg-green-100 px-2 py-0.5 text-xs font-bold text-green-600">
            +12%
          </span>
        </div>
      </div>
    </div>
  );
}
