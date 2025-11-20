import { Brain, Mic } from "lucide-react";

export function InterviewReadinessCard() {
  return (
    <div className="w-full max-w-sm bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
      <h3 className="text-lg font-bold text-gray-900 mb-6">
        Interview Readiness
      </h3>

      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-baseline gap-1">
            <span className="text-5xl font-bold text-gray-900 tracking-tight">
              95
            </span>
            <span className="text-sm font-medium text-gray-400">
              percentile
            </span>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <button className="flex items-center gap-2 rounded-xl bg-gray-50 px-4 py-2 text-sm font-bold text-gray-700 hover:bg-gray-100 transition-colors">
            <Brain className="h-4 w-4" />
            Technical
          </button>
          <button className="flex items-center gap-2 rounded-xl bg-gray-50 px-4 py-2 text-sm font-bold text-gray-700 hover:bg-gray-100 transition-colors">
            <Mic className="h-4 w-4" />
            Behavioral
          </button>
        </div>
      </div>

      {/* Decorative bottom element to match image style */}
      <div className="mt-6 flex justify-end">
        <div className="h-10 w-24 bg-lime-500 rounded-t-xl opacity-20 translate-y-6"></div>
      </div>
    </div>
  );
}
