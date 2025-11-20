import { Play } from "lucide-react";

export function RecentActivityCard() {
  return (
    <div className="w-full max-w-sm bg-white rounded-3xl p-6 shadow-sm border border-gray-100 relative overflow-hidden">
      <div className="flex justify-end mb-6">
        <button className="flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-bold text-white shadow-md shadow-orange-200 bg-orange-600 transition-colors">
          <Play className="h-4 w-4 fill-current" />
          Practice
        </button>
      </div>

      <div className="space-y-6">
        {/* Item 1 */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-100 text-orange-600">
              <span className="font-bold text-lg">F</span>
            </div>
            <div>
              <span className="text-lg font-bold text-gray-900">Frontend</span>
              <span className="ml-2 text-xs font-medium text-gray-400">
                Mock Interview
              </span>
            </div>
          </div>
        </div>

        {/* Item 2 */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-blue-500">
              <span className="font-bold text-lg">S</span>
            </div>
            <div>
              <span className="text-lg font-bold text-gray-900">
                System Design
              </span>
              <span className="ml-2 text-xs font-medium text-gray-400">
                Assessment
              </span>
            </div>
          </div>
        </div>

        {/* Item 3 */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-teal-100 text-teal-600">
              <span className="font-bold text-sm">HR</span>
            </div>
            <div>
              <span className="text-lg font-bold text-gray-900">
                Behavioral
              </span>
              <span className="ml-2 text-xs font-medium text-gray-400">
                Feedback
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
